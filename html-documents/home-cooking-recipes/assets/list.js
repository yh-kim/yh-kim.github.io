const recipes = window.HOME_COOKING_RECIPES || [];
const recipeList = document.querySelector("#recipeList");
const filterControls = Array.from(document.querySelectorAll("[data-filter-kind]"));
const filterLayer = document.querySelector("#filterLayer");
const chipList = document.querySelector("#chipList");
const resetFilter = document.querySelector("#resetFilter");
const logicToggle = document.querySelector("#logicToggle");
const activeFilterSummary = document.querySelector("#activeFilterSummary");
const emptyState = document.querySelector("#emptyState");
const selectedTags = new Set();
const selectedIngredients = new Set();
let activeFilterKind = "tag";
let filterLogic = "OR";

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function renderRecipeCard(recipe) {
  const card = createElement("li", "recipe-card");
  card.dataset.tags = recipe.tags.join(" ");
  card.dataset.ingredients = recipe.searchIngredients.join(" ");

  const link = document.createElement("a");
  link.href = `/html-documents/home-cooking-recipes/${recipe.id}.html`;

  const thumb = createElement("span", recipe.image ? "thumb" : "thumb pending");
  if (recipe.image) {
    const image = document.createElement("img");
    image.src = recipe.image;
    image.alt = recipe.imageAlt || recipe.title;
    thumb.appendChild(image);
  } else {
    thumb.textContent = "이미지 생성 예정";
  }

  const body = createElement("span", "card-body");
  const meta = createElement("span", "meta");
  meta.appendChild(createElement("span", "pill time", recipe.time));
  recipe.tags.slice(0, 2).forEach((tag) => meta.appendChild(createElement("span", "pill", tag)));

  const title = createElement("h2", "", recipe.title);
  const summary = createElement("p", "summary", recipe.description);
  const ingredients = createElement("ul", "ingredients");
  ingredients.setAttribute("aria-label", "주요 재료");
  recipe.ingredients.forEach((ingredient) => ingredients.appendChild(createElement("li", "", ingredient)));

  body.append(meta, title, summary, ingredients);
  link.append(thumb, body);
  card.appendChild(link);
  return card;
}

function renderList() {
  recipeList.innerHTML = "";
  recipes.forEach((recipe) => recipeList.appendChild(renderRecipeCard(recipe)));
}

function getCards() {
  return Array.from(document.querySelectorAll(".recipe-card"));
}

function getFilterItems(kind) {
  const key = kind === "tag" ? "tags" : "searchIngredients";
  return Array.from(new Set(recipes.flatMap((recipe) => recipe[key]))).sort((a, b) => a.localeCompare(b, "ko"));
}

const filterData = {
  tag: {
    title: "태그",
    get items() {
      return getFilterItems("tag");
    },
    selected: selectedTags
  },
  ingredient: {
    title: "재료",
    get items() {
      return getFilterItems("ingredient");
    },
    selected: selectedIngredients
  }
};

function renderChips(kind) {
  const data = filterData[kind];
  document.querySelector("#filterTitle").textContent = data.title;
  chipList.innerHTML = data.items.map((item) => `
    <li><button class="tag-chip" type="button" aria-pressed="${data.selected.has(item)}" data-value="${item}">${item}</button></li>
  `).join("");
}

function updateChipState() {
  document.querySelectorAll(".tag-chip").forEach((chip) => {
    chip.setAttribute("aria-pressed", String(filterData[activeFilterKind].selected.has(chip.dataset.value)));
  });
}

function applyFilters() {
  const selectedFilters = [
    ...Array.from(selectedTags).map((value) => ({ kind: "tag", value })),
    ...Array.from(selectedIngredients).map((value) => ({ kind: "ingredient", value }))
  ];
  let visibleCount = 0;

  getCards().forEach((card) => {
    const cardTags = card.dataset.tags.split(/\s+/);
    const cardIngredients = card.dataset.ingredients.split(/\s+/);
    const matches = selectedFilters.map((filter) => (
      filter.kind === "tag"
        ? cardTags.includes(filter.value)
        : cardIngredients.includes(filter.value)
    ));
    const visible = selectedFilters.length === 0
      ? true
      : filterLogic === "AND"
      ? matches.every(Boolean)
      : matches.some(Boolean);
    card.classList.toggle("is-hidden", !visible);
    if (visible) visibleCount += 1;
  });

  const selected = [
    ...Array.from(selectedTags).map((tag) => `태그 ${tag}`),
    ...Array.from(selectedIngredients).map((ingredient) => `재료 ${ingredient}`)
  ];
  activeFilterSummary.textContent = selected.length ? `${filterLogic} · ${selected.join(" · ")}` : "";
  activeFilterSummary.classList.toggle("is-visible", selected.length > 0);
  emptyState.classList.toggle("is-visible", visibleCount === 0);
}

function closeLayer() {
  applyFilters();
  filterLayer.classList.remove("is-open");
}

renderList();

chipList.addEventListener("click", (event) => {
  const chip = event.target.closest(".tag-chip");
  if (!chip) return;
  const selected = filterData[activeFilterKind].selected;

  if (selected.has(chip.dataset.value)) {
    selected.delete(chip.dataset.value);
  } else {
    selected.add(chip.dataset.value);
  }
  updateChipState();
});

filterControls.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilterKind = button.dataset.filterKind;
    renderChips(activeFilterKind);
    filterLayer.classList.add("is-open");
  });
});

logicToggle.addEventListener("click", () => {
  filterLogic = filterLogic === "AND" ? "OR" : "AND";
  logicToggle.textContent = filterLogic;
  applyFilters();
});

resetFilter.addEventListener("click", () => {
  selectedTags.clear();
  selectedIngredients.clear();
  renderChips(activeFilterKind);
  applyFilters();
  closeLayer();
});

filterLayer.addEventListener("click", (event) => {
  if (event.target === filterLayer) closeLayer();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && filterLayer.classList.contains("is-open")) {
    closeLayer();
  }
});

document.querySelector("#scrollTopButton").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
