const recipeListPath = "/html-documents/home-cooking-recipes.html";
const recipes = window.HOME_COOKING_RECIPES || [];
const recipeId = document.body.dataset.recipeId;
const recipe = recipes.find((item) => item.id === recipeId);

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function renderSourceLinks() {
  const sourceLinks = document.querySelector("#sourceLinks");
  sourceLinks.innerHTML = "";
  recipe.sourceLinks.forEach((source) => {
    const link = createElement("a", "top-source-link", source.label);
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener";
    sourceLinks.appendChild(link);
  });
}

function renderHero() {
  document.title = `${recipe.title} | 집밥 레시피 보관함`;
  document.querySelector("#recipeTitle").textContent = recipe.title;
  document.querySelector("#recipeLead").textContent = recipe.description;
  document.querySelector("#recipeTime").textContent = recipe.time;
  document.querySelector("#recipeIngredients").textContent = recipe.ingredients.join(", ");

  const heroText = document.querySelector(".hero-text");
  const existingThumb = heroText.querySelector(".detail-thumb, .detail-thumb-placeholder");
  if (existingThumb) existingThumb.remove();

  if (recipe.image) {
    const image = document.createElement("img");
    image.className = "detail-thumb";
    image.src = recipe.image;
    image.alt = recipe.imageAlt || recipe.title;
    heroText.appendChild(image);
  } else {
    heroText.appendChild(createElement("div", "detail-thumb-placeholder", "이미지 생성 예정"));
  }
}

function renderPrep() {
  const prepList = document.querySelector("#prepList");
  prepList.innerHTML = "";
  recipe.prep.forEach((item) => prepList.appendChild(createElement("li", "", item)));
}

function renderMethods() {
  const methodContainer = document.querySelector("#methodContainer");
  methodContainer.innerHTML = "";
  recipe.methods.forEach((method) => {
    const panel = createElement("article", "panel");
    panel.appendChild(createElement("h2", "", method.title));
    const list = document.createElement("ol");
    method.steps.forEach((step) => list.appendChild(createElement("li", "", step)));
    panel.appendChild(list);
    methodContainer.appendChild(panel);
  });
}

function renderMemo() {
  const memoPanel = document.querySelector("#memoPanel");
  if (!recipe.memo) {
    memoPanel.hidden = true;
    return;
  }
  document.querySelector("#recipeMemo").textContent = recipe.memo;
}

function renderMedia() {
  const media = document.querySelector("#recipeMedia");
  media.innerHTML = "";

  recipe.embeds.forEach((embed) => {
    const wrap = createElement("div", "embed-wrap");
    const frame = document.createElement("iframe");
    frame.src = embed.src;
    frame.title = embed.title;
    frame.loading = "lazy";
    frame.allowTransparency = "true";
    wrap.appendChild(frame);
    media.appendChild(wrap);
  });
}

function renderMissingRecipe() {
  document.querySelector("#recipeTitle").textContent = "레시피를 찾을 수 없습니다";
  document.querySelector("#recipeLead").textContent = "목록에서 다시 선택해주세요.";
  document.querySelector("#recipeTime").textContent = "-";
  document.querySelector("#recipeIngredients").textContent = "-";
  document.querySelector("#prepList").innerHTML = "";
  document.querySelector("#methodContainer").innerHTML = "";
  document.querySelector("#recipeMedia").innerHTML = "";
  document.querySelector("#memoPanel").hidden = true;
  document.querySelector("#sourceLinks").innerHTML = "";
}

document.querySelector("#backButton").addEventListener("click", () => {
  const referrer = document.referrer ? new URL(document.referrer) : null;
  const cameFromList = referrer
    && referrer.origin === window.location.origin
    && referrer.pathname === recipeListPath;

  if (cameFromList && window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = recipeListPath;
  }
});

document.querySelector("#scrollTopButton").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

if (recipe) {
  renderSourceLinks();
  renderHero();
  renderPrep();
  renderMethods();
  renderMemo();
  renderMedia();
} else {
  renderMissingRecipe();
}
