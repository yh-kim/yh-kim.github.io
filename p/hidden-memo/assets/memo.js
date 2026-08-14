(function () {
  'use strict';

  var categoryView = document.getElementById('tampermonkey-list');
  var noteViews = Array.from(document.querySelectorAll('[data-note-view]'));
  var noteButtons = Array.from(document.querySelectorAll('[data-open-note]'));
  var backButtons = Array.from(document.querySelectorAll('[data-back-to-category]'));
  var panels = Array.from(document.querySelectorAll('[data-script-panel]'));
  var panelStates = new Map();

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

    var focusTarget = note === 'escape'
      ? document.getElementById('guest-name')
      : view.querySelector('[data-copy-button]');
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

  function buildPanel(panel) {
    var state = panelStates.get(panel);
    if (!state || !state.template) return;

    if (panel.dataset.generator !== 'escape') {
      state.currentCode = state.template;
      state.output.textContent = state.currentCode;
      state.copyButton.disabled = false;
      state.help.textContent = 'Tampermonkey에 바로 복사할 수 있습니다.';
      return;
    }

    var name = state.nameInput.value.trim();
    var phone = state.phoneInput.value.trim();
    var phoneDigits = phone.replace(/\D/g, '');
    var autoSubmit = state.autoSubmitInput.value;
    var validPhone = phoneDigits.length === 10 || phoneDigits.length === 11;

    state.currentCode = state.template
      .replace('__GUEST_NAME__', JSON.stringify(name))
      .replace('__GUEST_PHONE__', JSON.stringify(phone))
      .replace(
        /const IS_USING_AUTO_SUBMIT = (?:true|false|__AUTO_SUBMIT__);/,
        'const IS_USING_AUTO_SUBMIT = ' + autoSubmit + ';'
      );

    state.output.textContent = state.currentCode;
    state.copyButton.disabled = !name || !validPhone;

    if (!name || !phone) {
      state.help.textContent = '이름과 전화번호를 입력하면 복사할 수 있습니다.';
    } else if (!validPhone) {
      state.help.textContent = '전화번호는 숫자 10~11자리로 입력하세요.';
    } else {
      state.help.textContent = '7개 사이트에 입력값이 반영되었습니다.';
    }
  }

  function initPanel(panel) {
    var state = {
      template: '',
      currentCode: '',
      output: panel.querySelector('[data-code-output]'),
      copyButton: panel.querySelector('[data-copy-button]'),
      help: panel.querySelector('[data-copy-help]'),
      nameInput: document.getElementById('guest-name'),
      phoneInput: document.getElementById('guest-phone'),
      autoSubmitInput: document.getElementById('auto-submit')
    };
    panelStates.set(panel, state);

    state.copyButton.addEventListener('click', async function () {
      if (state.copyButton.disabled || !state.currentCode) return;
      await writeClipboard(state.currentCode);
      state.copyButton.textContent = '복사 완료';
      state.help.textContent = 'Tampermonkey에 새 스크립트로 붙여 넣으세요.';
      window.setTimeout(function () { state.copyButton.textContent = '코드 복사'; }, 1400);
    });

    if (panel.dataset.generator === 'escape') {
      state.nameInput.addEventListener('input', function () { buildPanel(panel); });
      state.phoneInput.addEventListener('input', function () { buildPanel(panel); });
      state.autoSubmitInput.addEventListener('change', function () { buildPanel(panel); });
    }

    fetch(panel.dataset.scriptSource, { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('script load failed: ' + response.status);
        return response.text();
      })
      .then(function (source) {
        state.template = source.trim();
        buildPanel(panel);
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
