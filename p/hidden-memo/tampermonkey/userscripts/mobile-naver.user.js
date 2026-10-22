// ==UserScript==
// @name         모바일 네이버 메인
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  상단 메뉴·검색·바로가기만 남기고 아이콘·이름·URL을 편집하는 즐겨찾기 추가
// @match        https://m.naver.com/
// @downloadURL  https://blog.pickth.com/p/hidden-memo/tampermonkey/userscripts/mobile-naver.user.js
// @updateURL    https://blog.pickth.com/p/hidden-memo/tampermonkey/userscripts/mobile-naver.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'pimi.naver.home-bookmarks.v1';
  const HOST_ID = 'naver-clean-bookmarks';
  const icons = [
    { id: 'star', name: '별', path: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>' },
    { id: 'home', name: '홈', path: '<path d="m3 10 9-7 9 7v10H4V10M9 20v-7h6v7"/>' },
    { id: 'book', name: '책', path: '<path d="M12 5v16M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1Z"/>' },
    { id: 'video', name: '영상', path: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m10 8 6 4-6 4Z"/>' },
    { id: 'bag', name: '쇼핑', path: '<path d="M5 7h14l2 14H3ZM8 8V6a4 4 0 0 1 8 0v2"/>' },
    { id: 'work', name: '업무', path: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12c6 4 12 4 18 0M10 14h4"/>' },
    { id: 'heart', name: '하트', path: '<path d="M20.5 4.5a5 5 0 0 0-7.1 0L12 6l-1.4-1.5a5 5 0 0 0-7.1 7.1L12 21l8.5-9.4a5 5 0 0 0 0-7.1Z"/>' },
    { id: 'link', name: '링크', path: '<path d="m10 13 4-4M8 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0M13 8l2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" transform="translate(1 0)"/>' }
  ];
  const iconSvg = icon => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon.path}</svg>`;
  const newId = () => typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  function normalizedUrl(value) {
    const text = String(value || '').trim();
    if (!text || text.length > 2048 || /^\/(?!\/)|^[?#]/.test(text)) return null;
    try {
      const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(text) && !/^[a-z0-9.-]+:\d+(?:[/?#]|$)/i.test(text);
      const url = new URL(hasScheme ? text : `https://${text.replace(/^\/\//, '')}`);
      return /^https?:$/.test(url.protocol) && url.hostname ? url.href : null;
    } catch (error) { return null; }
  }

  function loadBookmarks() {
    try {
      const saved = typeof GM_getValue === 'function' ? GM_getValue(STORAGE_KEY, []) :
        JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(saved)) return [];
      const seen = new Set();
      return saved.flatMap(item => {
        if (!item || typeof item.name !== 'string' || typeof item.url !== 'string') return [];
        const name = item.name.trim().slice(0, 40);
        const url = normalizedUrl(item.url);
        if (!name || !url) return [];
        const id = typeof item.id === 'string' && item.id && !seen.has(item.id) ? item.id : newId();
        seen.add(id);
        return [{ id, name, url, icon: icons.some(icon => icon.id === item.icon) ? item.icon : 'star' }];
      });
    } catch (error) { return []; }
  }

  function saveBookmarks(next) {
    try {
      if (typeof GM_setValue === 'function') GM_setValue(STORAGE_KEY, next);
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return true;
    } catch (error) { return false; }
  }

  let bookmarks = loadBookmarks();
  let host;
  let pending = false;
  const style = document.createElement('style');
  style.id = 'naver-clean-layout';
  // 공통 피드 루트를 숨겨 이후 추가되는 숏텐츠·추천 카드도 제외합니다.
  // 햄버거 메뉴·검색·메일/카페 바로가기는 이 영역 밖에 있어 유지됩니다.
  style.textContent = `
    #HOME_AD, #MM_search_container, #MM_homefeed_react_root,
    #MM_HOME_NUDGE_BANNER, .wrap.id_search > .main_footer, .id_comp_shortents {
      display: none !important;
    }
    #MM_logo { margin-bottom: 0 !important; }
    #MM_home_menu_container { margin-top: 0 !important; }
  `;

  function createBookmarks() {
    host = document.createElement('section');
    host.id = HOST_ID;
    host.className = 'MM_SWIPE_IGNORE';
    const shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host {
          all: initial; display: block; margin: 12px 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif;
          --fallback-bg: #fff; --fallback-raised: #f5f6f8; --fallback-text: #24262b; --fallback-muted: #777d87;
          --fallback-line: #e9ecef; --fallback-accent: #008858; --fallback-soft: #e8f6ef;
          --bg: var(--color-neutral-background-default, var(--fallback-bg));
          --raised: var(--color-neutral-background-raised-1, var(--fallback-raised));
          --text: var(--color-neutral-foreground-default, var(--fallback-text));
          --muted: var(--color-neutral-foreground-subtle-3, var(--fallback-muted));
          --line: var(--color-neutral-stroke-default, var(--fallback-line));
          --accent: var(--color-primary-foreground-default, var(--fallback-accent));
          --soft: var(--color-primary-background-subtle-1, var(--fallback-soft));
        }
        @media (prefers-color-scheme: dark) {
          :host { --fallback-bg: #202124; --fallback-raised: #292b30; --fallback-text: #e6e8ec; --fallback-muted: #a3a8b1;
            --fallback-line: #34373c; --fallback-accent: #62d5a4; --fallback-soft: #203c30; }
        }
        * { box-sizing: border-box; }
        [hidden] { display: none !important; }
        .card { padding: 14px; border: 1px solid var(--line); border-radius: 18px; background: var(--bg); color: var(--text); }
        header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
        h2 { margin: 0; font-size: 14px; font-weight: 650; }
        button, input, a { font: inherit; }
        button, a { touch-action: manipulation; }
        button { cursor: pointer; }
        button:focus-visible, a:focus-visible, input:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
        .edit { min-width: 44px; min-height: 32px; padding: 6px 9px; border: 0; border-radius: 9px; background: var(--raised); color: var(--muted); font-size: 12px; }
        .edit:disabled { opacity: .5; cursor: default; }
        nav { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px; }
        .shortcut { display: grid; justify-items: center; align-content: start; gap: 6px; min-width: 0;
          padding: 8px 2px; border: 0; border-radius: 12px; background: transparent; color: var(--text); text-decoration: none; }
        .shortcut:hover { background: var(--raised); }
        .symbol { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 12px; background: var(--raised); color: var(--accent); }
        svg { display: block; width: 23px; height: 23px; }
        .name { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; line-height: 1.4; }
        .shortcut[data-edit-item] .symbol { background: var(--soft); outline: 1px dashed var(--accent); }
        p { margin: 8px 0 0; color: var(--muted); font-size: 12px; line-height: 1.5; }
        [data-status]:empty { display: none; }
        form { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--line); }
        h3 { margin: 0 0 10px; font-size: 13px; }
        fieldset { margin: 0 0 12px; padding: 0; border: 0; min-width: 0; }
        legend, .field { font-size: 12px; color: var(--muted); }
        legend { margin-bottom: 6px; }
        .icons { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
        .icon { position: relative; display: grid; justify-items: center; gap: 3px; padding: 8px 3px;
          border: 1px solid var(--line); border-radius: 10px; color: var(--muted); cursor: pointer; font-size: 10px; }
        .icon:has(input:checked) { border-color: var(--accent); background: var(--soft); color: var(--accent); }
        .icon:has(input:focus-visible) { outline: 2px solid var(--accent); outline-offset: 2px; }
        .icon input { position: absolute; width: 1px; height: 1px; opacity: 0; }
        .icon svg { width: 21px; height: 21px; }
        .field { display: block; margin-top: 10px; }
        .field input { display: block; width: 100%; margin-top: 5px; padding: 10px; border: 1px solid var(--line);
          border-radius: 10px; background: var(--raised); color: var(--text); font-size: 16px; }
        .actions { display: flex; gap: 6px; margin-top: 12px; }
        .actions button { min-height: 36px; padding: 8px 12px; border: 0; border-radius: 10px; background: var(--raised); color: var(--text); font-size: 12px; }
        .actions [type="submit"] { margin-left: auto; background: var(--soft); color: var(--accent); font-weight: 600; }
      </style>
      <section class="card" aria-label="즐겨찾기">
        <header><h2>즐겨찾기</h2><button class="edit" type="button" aria-pressed="false">편집</button></header>
        <nav aria-label="내 즐겨찾기"></nav>
        <p data-empty>자주 가는 사이트를 추가해 보세요.</p>
        <p data-status role="status"></p>
        <form aria-label="즐겨찾기 편집" novalidate hidden>
          <h3>즐겨찾기 추가</h3>
          <fieldset><legend>아이콘</legend><div class="icons">
            ${icons.map(icon => `<label class="icon"><input type="radio" name="icon" value="${icon.id}" aria-label="${icon.name}">${iconSvg(icon)}<span>${icon.name}</span></label>`).join('')}
          </div></fieldset>
          <label class="field">이름<input name="name" type="text" maxlength="40" autocomplete="off" required></label>
          <label class="field">URL<input name="url" type="text" inputmode="url" maxlength="2048" placeholder="https://example.com" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" required></label>
          <div class="actions"><button data-delete type="button" hidden>삭제</button><button data-cancel type="button">취소</button><button type="submit">저장</button></div>
        </form>
      </section>
    `;
    const nav = shadow.querySelector('nav');
    const form = shadow.querySelector('form');
    const edit = shadow.querySelector('.edit');
    const status = shadow.querySelector('[data-status]');
    const nameInput = form.elements.namedItem('name');
    const urlInput = form.elements.namedItem('url');
    let editing = false;
    let editingId = null;

    function render() {
      const items = bookmarks.map(bookmark => {
        const element = document.createElement(editing ? 'button' : 'a');
        if (editing) {
          element.type = 'button';
          element.setAttribute('data-edit-item', bookmark.id);
          element.setAttribute('aria-label', `${bookmark.name} 수정`);
        } else element.href = bookmark.url;
        element.className = 'shortcut';
        element.title = bookmark.name;
        const symbol = document.createElement('span');
        symbol.className = 'symbol';
        symbol.innerHTML = iconSvg(icons.find(icon => icon.id === bookmark.icon));
        const name = document.createElement('span');
        name.className = 'name';
        name.textContent = bookmark.name;
        element.append(symbol, name);
        return element;
      });
      const add = document.createElement('button');
      add.className = 'shortcut';
      add.type = 'button';
      add.setAttribute('data-add', '');
      add.setAttribute('aria-label', '즐겨찾기 추가');
      add.innerHTML = '<span class="symbol"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></span><span class="name">추가</span>';
      nav.replaceChildren(...items, add);
      shadow.querySelector('[data-empty]').hidden = bookmarks.length > 0;
      edit.textContent = editing ? '완료' : '편집';
      edit.setAttribute('aria-pressed', String(editing));
    }

    function openEditor(bookmark) {
      editingId = bookmark?.id || null;
      form.reset();
      form.querySelector('h3').textContent = bookmark ? '즐겨찾기 수정' : '즐겨찾기 추가';
      nameInput.value = bookmark?.name || '';
      urlInput.value = bookmark?.url || '';
      form.querySelector(`input[value="${bookmark?.icon || 'star'}"]`).checked = true;
      form.querySelector('[data-delete]').hidden = !bookmark;
      form.hidden = false;
      edit.disabled = true;
      status.textContent = '';
      nameInput.focus({ preventScroll: true });
    }

    function closeEditor(message = '') {
      form.hidden = true;
      editingId = null;
      editing = false;
      edit.disabled = false;
      status.textContent = message;
      render();
      nav.querySelector('[data-add]').focus({ preventScroll: true });
    }

    function commit(next, message) {
      if (!saveBookmarks(next)) { status.textContent = '즐겨찾기를 저장할 수 없습니다. 다시 시도해 주세요.'; return; }
      bookmarks = next;
      closeEditor(message);
    }

    edit.addEventListener('click', () => {
      editing = !editing;
      status.textContent = editing ? '수정할 즐겨찾기를 눌러주세요.' : '';
      render();
    });
    nav.addEventListener('click', event => {
      if (event.target.closest?.('[data-add]')) openEditor(null);
      const item = event.target.closest?.('[data-edit-item]');
      if (item) openEditor(bookmarks.find(bookmark => bookmark.id === item.getAttribute('data-edit-item')));
    });
    form.querySelector('[data-cancel]').addEventListener('click', () => closeEditor());
    form.addEventListener('input', () => { status.textContent = ''; });
    form.querySelector('[data-delete]').addEventListener('click', () => {
      if (editingId) commit(bookmarks.filter(bookmark => bookmark.id !== editingId), '삭제했습니다.');
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      const name = nameInput.value.trim();
      const url = normalizedUrl(urlInput.value);
      if (!name) { status.textContent = '이름을 입력해 주세요.'; nameInput.focus(); return; }
      if (!url) { status.textContent = 'http:// 또는 https:// 주소를 입력해 주세요.'; urlInput.focus(); return; }
      const selectedIcon = form.elements.namedItem('icon').value;
      const bookmark = { id: editingId || newId(), name, url,
        icon: icons.some(icon => icon.id === selectedIcon) ? selectedIcon : 'star' };
      commit(editingId ? bookmarks.map(item => item.id === editingId ? bookmark : item) : [...bookmarks, bookmark], '저장했습니다.');
    });
    shadow.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !form.hidden) { event.preventDefault(); closeEditor(); }
    });
    for (const type of ['pointerdown', 'touchstart', 'touchmove', 'touchend', 'click']) {
      shadow.addEventListener(type, event => event.stopPropagation(), { passive: true });
    }
    render();
  }

  function syncLayout() {
    pending = false;
    if (!style.isConnected) (document.head || document.documentElement).appendChild(style);
    const search = document.getElementById('MM_logo');
    const menu = document.getElementById('MM_home_menu_container');
    if (!search || !menu || search.parentElement !== menu.parentElement) return;
    if (!host) createBookmarks();
    if (host.parentElement !== menu.parentElement || host.nextElementSibling !== menu) menu.before(host);
  }

  function start() {
    const observer = new MutationObserver(() => {
      if (pending) return;
      pending = true;
      queueMicrotask(syncLayout);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    syncLayout();
  }

  if (document.documentElement) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
