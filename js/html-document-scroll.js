(function () {
  var TOP_BUTTON_CLASS = "html-document-top-button";

  function scrollToTarget(button) {
    var targetId = button.getAttribute("data-scroll-target");
    if (!targetId) return;

    var target = document.getElementById(targetId);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function initScrollTargets(root) {
    var scope = root || document;
    scope.querySelectorAll("[data-scroll-target]").forEach(function (button) {
      if (button.getAttribute("data-scroll-bound") === "true") return;

      button.setAttribute("data-scroll-bound", "true");
      button.addEventListener("click", function () {
        scrollToTarget(button);
      });
    });
  }

  function ensureTopButtonStyle() {
    if (document.getElementById("html-document-top-style")) return;

    var style = document.createElement("style");
    style.id = "html-document-top-style";
    style.textContent = [
      "." + TOP_BUTTON_CLASS + " {",
      "  position: fixed;",
      "  right: max(16px, env(safe-area-inset-right));",
      "  bottom: max(18px, env(safe-area-inset-bottom));",
      "  z-index: 2147483000;",
      "  width: var(--html-doc-top-size, 46px);",
      "  height: var(--html-doc-top-size, 46px);",
      "  display: inline-grid;",
      "  place-items: center;",
      "  border: var(--html-doc-top-border, 1px solid rgba(255,255,255,.55));",
      "  border-radius: var(--html-doc-top-radius, 999px);",
      "  background: var(--html-doc-top-bg, rgba(255,255,255,.92));",
      "  color: var(--html-doc-top-color, #223028);",
      "  box-shadow: var(--html-doc-top-shadow, 0 14px 34px rgba(0,0,0,.18));",
      "  backdrop-filter: blur(14px);",
      "  -webkit-backdrop-filter: blur(14px);",
      "  cursor: pointer;",
      "  opacity: 0;",
      "  pointer-events: none;",
      "  transform: translateY(10px) scale(.98);",
      "  transition: opacity .18s ease, transform .18s ease;",
      "  font: 900 var(--html-doc-top-font-size, 20px)/1 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "}",
      "." + TOP_BUTTON_CLASS + ".is-visible {",
      "  opacity: 1;",
      "  pointer-events: auto;",
      "  transform: translateY(0) scale(1);",
      "}",
      "." + TOP_BUTTON_CLASS + ":focus-visible {",
      "  outline: 3px solid var(--html-doc-top-focus, rgba(63,143,103,.35));",
      "  outline-offset: 3px;",
      "}",
      "@media (max-width: 620px) {",
      "  ." + TOP_BUTTON_CLASS + " {",
      "    right: max(12px, env(safe-area-inset-right));",
      "    bottom: max(12px, env(safe-area-inset-bottom));",
      "    width: var(--html-doc-top-mobile-size, 42px);",
      "    height: var(--html-doc-top-mobile-size, 42px);",
      "  }",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function isLongDocument() {
    var pageHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return pageHeight > Math.max(900, viewportHeight * 1.35);
  }

  function initTopButton() {
    ensureTopButtonStyle();

    var button = document.querySelector("." + TOP_BUTTON_CLASS);
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = TOP_BUTTON_CLASS;
      button.setAttribute("aria-label", "맨 위로 이동");
      button.setAttribute("title", "맨 위로 이동");
      button.textContent = "↑";
      document.body.appendChild(button);
      button.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    function update() {
      var show = isLongDocument() && window.scrollY > 280;
      button.classList.toggle("is-visible", show);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function init(root) {
    initScrollTargets(root || document);
    initTopButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init(document);
    });
  } else {
    init(document);
  }

  window.HtmlDocumentScroll = {
    init: init,
    initScrollTargets: initScrollTargets,
    initTopButton: initTopButton
  };
})();
