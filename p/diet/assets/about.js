(function () {
  "use strict";

  var promptText = "";
  var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-copy-prompt]"));
  var statuses = Array.prototype.slice.call(document.querySelectorAll("[data-copy-status]"));
  var preview = document.querySelector("[data-prompt-preview]");

  buttons.forEach(function (button) {
    button.dataset.defaultLabel = button.textContent;
  });

  function setStatus(text, success) {
    statuses.forEach(function (item) { item.textContent = text; });
    buttons.forEach(function (button) {
      button.classList.toggle("is-done", success);
      button.textContent = success ? "복사 완료" : button.dataset.defaultLabel;
    });
  }

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var copied = document.execCommand("copy");
    document.body.removeChild(area);
    return copied;
  }

  function copyPrompt() {
    if (!promptText) {
      setStatus("프롬프트를 아직 불러오지 못했습니다. 잠시 후 다시 눌러주세요.", false);
      return;
    }
    var task = navigator.clipboard && window.isSecureContext
      ? navigator.clipboard.writeText(promptText)
      : Promise.resolve(fallbackCopy(promptText));
    task.then(function (result) {
      if (result === false) { throw new Error("copy failed"); }
      setStatus("프롬프트 전체를 클립보드에 저장했습니다.", true);
      window.setTimeout(function () { setStatus("", false); }, 2600);
    }).catch(function () {
      setStatus("자동 복사에 실패했습니다. 미리보기를 열어 직접 복사해주세요.", false);
    });
  }

  buttons.forEach(function (button) { button.addEventListener("click", copyPrompt); });

  fetch("/p/diet/prompt.txt?v=20260723-59")
    .then(function (response) {
      if (!response.ok) { throw new Error("prompt load failed"); }
      return response.text();
    })
    .then(function (text) {
      promptText = text.trim();
      preview.textContent = promptText;
    })
    .catch(function () {
      preview.textContent = "프롬프트를 불러오지 못했습니다.";
      setStatus("프롬프트 파일을 불러오지 못했습니다.", false);
    });
}());
