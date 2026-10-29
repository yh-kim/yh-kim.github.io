(function () {
  'use strict';

  var categoryView = document.getElementById('tampermonkey-list');
  var noteViews = Array.from(document.querySelectorAll('[data-note-view]'));
  var noteButtons = Array.from(document.querySelectorAll('[data-open-note]'));
  var backButtons = Array.from(document.querySelectorAll('[data-back-to-category]'));
  var panels = Array.from(document.querySelectorAll('[data-script-panel]'));

  function showCategory() {
    categoryView.hidden = false;
    noteViews.forEach(function (view) { view.hidden = true; });
    document.title = 'TAMPERMONKEY · Memo';
    window.scrollTo(0, 0);
    if (noteButtons[0]) noteButtons[0].focus();
  }

  function showNote(note) {
    var view = noteViews.find(function (item) { return item.dataset.noteView === note; });
    if (!view) return;

    categoryView.hidden = true;
    noteViews.forEach(function (item) { item.hidden = item !== view; });
    document.title = view.querySelector('h1').textContent + ' · Memo';
    window.scrollTo(0, 0);

    var focusTarget = view.querySelector('[data-copy-button]');
    if (focusTarget) window.setTimeout(function () { focusTarget.focus(); }, 80);
  }

  async function writeClipboard(value) {
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      var textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
  }

  function buildPanel(state) {
    if (!state.template) return;
    state.currentCode = state.template;
    state.output.textContent = state.currentCode;
    state.copyButton.disabled = false;
    state.help.textContent = 'Tampermonkey에 바로 복사할 수 있습니다.';
  }

  function initPanel(panel) {
    var state = {
      template: '',
      currentCode: '',
      output: panel.querySelector('[data-code-output]'),
      copyButton: panel.querySelector('[data-copy-button]'),
      help: panel.querySelector('[data-copy-help]')
    };

    state.copyButton.addEventListener('click', async function () {
      if (state.copyButton.disabled || !state.currentCode) return;
      await writeClipboard(state.currentCode);
      state.copyButton.textContent = '복사 완료';
      state.help.textContent = 'Tampermonkey에 새 스크립트로 붙여 넣으세요.';
      window.setTimeout(function () { state.copyButton.textContent = '코드 복사'; }, 1400);
    });

    fetch(panel.dataset.scriptSource, { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('script load failed: ' + response.status);
        return response.text();
      })
      .then(function (source) {
        state.template = source.trim();
        buildPanel(state);
      })
      .catch(function () {
        state.output.textContent = '코드를 불러오지 못했습니다.';
        state.help.textContent = '페이지를 새로고침해 다시 시도하세요.';
        state.copyButton.disabled = true;
      });
  }

  noteButtons.forEach(function (button) {
    button.addEventListener('click', function () { showNote(button.dataset.openNote); });
  });
  backButtons.forEach(function (button) {
    button.addEventListener('click', showCategory);
  });
  panels.forEach(initPanel);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && categoryView.hidden) showCategory();
  });
}());
