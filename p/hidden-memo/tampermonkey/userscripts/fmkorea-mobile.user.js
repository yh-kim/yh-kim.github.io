// ==UserScript==
// @name         FM코리아 모바일 정리
// @namespace    https://blog.pickth.com/
// @version      1.0.0
// @description  모바일 상단·광고·닉네임 아이콘·포텐/방출 버튼 숨김, 글 상세 제목 오른쪽 포텐수와 왼쪽 아래 설정
// @match        *://m.fmkorea.com/*
// @match        *://www.fmkorea.com/*
// @match        *://fmkorea.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'pimi.fmkorea.mobile-cleaner.v1';
  const HOST_ID = 'fm-clean-controls';
  const defaults = { enabled: true, header: true, ads: true, icons: true, votes: true, count: true };
  const options = [
    ['enabled', '전체 기능 켜기'],
    ['header', '상단 로고·메뉴 숨김'],
    ['ads', '광고 영역 숨김'],
    ['icons', '글·댓글 닉네임 아이콘 숨김'],
    ['votes', '포텐·방출 버튼 숨김'],
    ['count', '상세 제목 오른쪽 포텐수']
  ];
  const settings = loadSettings();
  let host;
  let panel;
  let launcher;
  let pending = false;

  function loadSettings() {
    const result = { ...defaults };
    try {
      // GM 저장소로 m / www 주소 사이에서도 같은 설정을 사용합니다.
      const saved = GM_getValue(STORAGE_KEY, {});
      for (const key of Object.keys(defaults)) {
        if (saved && typeof saved[key] === 'boolean') result[key] = saved[key];
      }
    } catch (error) {
      // 저장이 막혀도 현재 페이지에서는 토글을 사용할 수 있습니다.
    }
    return result;
  }

  function saveSettings() {
    try {
      GM_setValue(STORAGE_KEY, { ...settings });
      panel.querySelector('[data-save-status]').textContent = '설정이 자동 저장됩니다.';
    } catch (error) {
      panel.querySelector('[data-save-status]').textContent = '저장할 수 없어 현재 페이지에만 적용됩니다.';
    }
  }

  function scope(key) {
    return `html[data-fm-clean-mobile="true"][data-fm-clean-enabled="true"][data-fm-clean-${key}="true"]`;
  }

  function hideRule(key, selectors) {
    return selectors.map(selector => `${scope(key)} ${selector}`).join(',\n') + ' { display: none !important; }';
  }

  const style = document.createElement('style');
  style.id = 'fm-clean-style';
  style.textContent = [
    hideRule('header', ['header.hd', '.msearch', 'nav.fmkorea_navi', '.main_recent', '.fm-recent-visited.mobile']),
    hideRule('ads', [
      '.fmad_wrapper', '[id^="fmad_wrapper_"]', '.ad_wrapper', '.adpost',
      '.adsbygoogle', '[id^="google_ads_iframe_"]', '[id^="div-gpt-ad"]',
      'iframe[src*="//loader.fmkorea.com/"]', 'iframe[src*="//cdn.nhnace.com/"]',
      'iframe[src*="//new-cdn.nhnace.com/"]', 'iframe[src*="doubleclick.net/"]',
      'iframe[src*="googlesyndication.com/"]'
    ]),
    // 회원 이름 안의 장식만 숨겨 본문 이미지·댓글 이모티콘·추천 아이콘을 보존합니다.
    hideRule('icons', [
      '.member_plate img:not(.image_name)', '.member_plate .level', '.member_plate .ico',
      '.member_plate .icon',
      'img.level[src*="/modules/point/icons/"]',
      '.rd_hd img[src*="/modules/point/icons/"]', '.fdb_itm .meta img[src*="/modules/point/icons/"]'
    ]),
    // 댓글 추천/비추천 및 신고·목록 버튼은 이 범위에 포함되지 않습니다.
    hideRule('votes', ['.rd .fm_vote .vote', '.rd .fm_vote .use_new_voted_count']),
    `
      [data-fm-clean-badge] { display: none !important; }
      ${scope('count')} [data-fm-clean-title] {
        display: flex !important; align-items: flex-start; gap: 8px;
        width: 100% !important; box-sizing: border-box; clear: both;
      }
      ${scope('count')} [data-fm-clean-title] .np_18px_span {
        flex: 1 1 auto; min-width: 0; width: auto !important;
        white-space: normal !important; overflow-wrap: anywhere;
      }
      ${scope('count')} [data-fm-clean-badge] {
        display: inline-block !important; flex: 0 0 auto; margin-left: auto;
        padding: 3px 6px; border: 1px solid #688cd766; border-radius: 6px;
        color: #526fbd; background: #688cd712; white-space: nowrap;
        font: 600 12px/1.4 -apple-system, BlinkMacSystemFont, sans-serif;
        letter-spacing: 0; text-indent: 0;
      }
      ${scope('count')} [data-fm-clean-original-count] { display: none !important; }
      #${HOST_ID} {
        all: initial !important; display: block !important; position: fixed !important;
        left: max(8px, env(safe-area-inset-left, 0px)) !important;
        bottom: max(8px, env(safe-area-inset-bottom, 0px)) !important;
        z-index: 2147483647 !important;
      }
    `
  ].join('\n');

  function applySettings() {
    for (const [key, value] of Object.entries(settings)) {
      document.documentElement.setAttribute(`data-fm-clean-${key}`, String(value));
    }
    if (!launcher) return;
    launcher.textContent = settings.enabled ? 'FM' : 'FM 꺼짐';
    launcher.title = settings.enabled ? 'FM코리아 화면 정리 설정' : 'FM코리아 화면 정리 꺼짐 · 설정 열기';
    launcher.setAttribute('aria-label', launcher.title);
    for (const input of panel.querySelectorAll('input')) input.checked = settings[input.name];
  }

  function setPanelOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) panel.querySelector('input').focus();
    else launcher.focus();
  }

  function mountControls() {
    if (host?.isConnected || !document.body) return;
    host = document.createElement('div');
    host.id = HOST_ID;
    const shadow = host.attachShadow({ mode: 'open' });
    // Shadow DOM으로 사이트의 버튼/입력 스타일과 충돌하지 않게 합니다.
    shadow.innerHTML = `
      <style>
        :host { color-scheme: light dark; }
        * { box-sizing: border-box; }
        button, input { font: inherit; }
        button, label { touch-action: manipulation; }
        button { cursor: pointer; }
        .launcher {
          display: block; min-width: 36px; height: 32px; padding: 0 8px;
          border: 1px solid #64748b66; border-radius: 10px;
          background: #1e293beb; color: #fff; box-shadow: 0 2px 8px #0002;
          font: 600 11px/1 -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .panel {
          position: absolute; left: 0; bottom: 40px; width: 256px;
          max-width: calc(100vw - 24px); max-height: calc(100dvh - 80px);
          overflow-y: auto; padding: 12px; border: 1px solid #cbd5e1;
          border-radius: 12px; background: #fff; color: #172033;
          box-shadow: 0 8px 32px #0003;
          font: 13px/1.5 -apple-system, BlinkMacSystemFont, sans-serif;
        }
        [hidden] { display: none !important; }
        header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
        strong { font-size: 13px; }
        .close { border: 0; background: transparent; color: inherit; padding: 4px 8px; font-size: 18px; }
        label { display: flex; align-items: center; gap: 8px; min-height: 36px; cursor: pointer; }
        input { width: 16px; height: 16px; margin: 0; accent-color: #526fbd; flex-shrink: 0; }
        p { font-size: 11px; color: #64748b; margin: 8px 0 0; }
        @media (prefers-color-scheme: dark) {
          .panel { background: #172033; color: #f1f5f9; border-color: #475569; }
          p { color: #94a3b8; }
        }
      </style>
      <section class="panel" id="fm-clean-panel" aria-label="FM코리아 화면 정리 설정" hidden>
        <header><strong>FM코리아 화면 정리</strong><button class="close" type="button" aria-label="설정 닫기">×</button></header>
        ${options.map(([key, label]) => `<label><input type="checkbox" name="${key}">${label}</label>`).join('')}
        <p data-save-status>설정이 자동 저장됩니다.</p>
      </section>
      <button class="launcher" type="button" aria-label="FM코리아 화면 정리 설정" aria-expanded="false" aria-controls="fm-clean-panel">FM</button>
    `;
    panel = shadow.querySelector('.panel');
    launcher = shadow.querySelector('.launcher');
    launcher.addEventListener('click', () => setPanelOpen(panel.hidden));
    shadow.querySelector('.close').addEventListener('click', () => setPanelOpen(false));
    panel.addEventListener('change', event => {
      const input = event.target;
      if (!Object.prototype.hasOwnProperty.call(defaults, input.name)) return;
      settings[input.name] = input.checked;
      applySettings();
      saveSettings();
      scheduleRefresh();
    });
    document.addEventListener('pointerdown', event => {
      if (!panel.hidden && !event.composedPath().includes(host)) setPanelOpen(false);
    });
    shadow.addEventListener('keydown', event => {
      if (event.key === 'Escape') setPanelOpen(false);
    });
    document.body.appendChild(host);
    applySettings();
  }

  function readCount(element) {
    if (!element) return null;
    const text = (element.querySelector('.voted_count') || element).textContent;
    const match = text.match(/[+-]?\d[\d,]*/);
    return match ? match[0] : null;
  }

  function updateDetailCounts() {
    // .rd는 글 상세에만 존재합니다. 목록 제목/댓글 추천수는 변경하지 않습니다.
    document.querySelectorAll('.rd').forEach(article => {
      const title = article.querySelector('.rd_hd h1.np_18px, .rd_hd h1');
      if (!title) return;
      const metadata = Array.from(article.querySelectorAll('.rd_hd .btm_area .side > span'))
        .find(item => /^\s*추천\s*수\s*/.test(item.textContent));
      const source = article.querySelector('.fm_vote .new_voted_count, .fm_vote .vote [id^="fm_vote"]:not([id^="fm_vote2"])');
      const count = readCount(source) ?? readCount(metadata?.querySelector('b'));
      let badge = title.querySelector('[data-fm-clean-badge]');
      if (count === null) {
        badge?.remove();
        title.removeAttribute('data-fm-clean-title');
        metadata?.removeAttribute('data-fm-clean-original-count');
        return;
      }
      if (!badge) {
        badge = document.createElement('span');
        badge.setAttribute('data-fm-clean-badge', '');
        title.appendChild(badge);
      }
      const text = `포텐 ${count}`;
      if (badge.textContent !== text) badge.textContent = text;
      badge.setAttribute('aria-label', `포텐수 ${count}`);
      title.setAttribute('data-fm-clean-title', '');
      metadata?.setAttribute('data-fm-clean-original-count', '');
    });
  }

  const observer = new MutationObserver(scheduleRefresh);
  function refresh() {
    pending = false;
    observer.disconnect();
    if (!style.isConnected) (document.head || document.documentElement).appendChild(style);
    // 화면 폭/기기 추측 대신 실제 모바일 레이아웃을 확인합니다. PC에서는 아무것도 숨기지 않습니다.
    const mobile = Boolean(document.querySelector('header.hd, link[href*="/m.layouts/"]'));
    document.documentElement.setAttribute('data-fm-clean-mobile', String(mobile));
    if (mobile) {
      mountControls();
      if (host) host.hidden = false;
      if (settings.enabled && settings.count) updateDetailCounts();
    } else if (host) {
      // host의 display: block !important에 가려지지 않게 모바일이 아니면 제거합니다.
      host.remove();
    }
    observer.observe(document.documentElement, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ['class', 'id', 'src', 'href']
    });
  }

  function scheduleRefresh() {
    if (pending) return;
    pending = true;
    window.setTimeout(refresh, 80);
  }

  function start() {
    applySettings();
    refresh();
    document.addEventListener('DOMContentLoaded', scheduleRefresh, { once: true });
    window.addEventListener('pageshow', scheduleRefresh);
  }
  if (document.documentElement) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
}());
