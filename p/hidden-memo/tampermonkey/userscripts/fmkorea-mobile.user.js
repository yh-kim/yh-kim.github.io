// ==UserScript==
// @name         FM코리아 모바일 정리
// @namespace    https://blog.pickth.com/
// @version      1.1.0
// @description  모바일 상단·광고·닉네임 아이콘·포텐/방출 버튼 숨김, 글 상세 제목 오른쪽 포텐수와 왼쪽 아래 설정
// @match        *://m.fmkorea.com/*
// @match        *://www.fmkorea.com/*
// @match        *://fmkorea.com/*
// @downloadURL  https://blog.pickth.com/p/hidden-memo/tampermonkey/userscripts/fmkorea-mobile.user.js
// @updateURL    https://blog.pickth.com/p/hidden-memo/tampermonkey/userscripts/fmkorea-mobile.user.js
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
    ['header', '본문 위 상단 영역 숨김'],
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
  const hiddenElements = { header: new Map(), ads: new Map() };
  const headerSelectors = [
    'header.hd', 'div.hd', '#header', '#gnb', '.msearch', '.msearch + .dummy', 'nav.fmkorea_navi',
    '.main_recent', '.fm-recent-visited.mobile'
  ];
  const adSelectors = [
    '.fmad_wrapper', '[id^="fmad_wrapper_"]', '[id^="fmad_extra_wrapper_"]',
    '.ad_wrapper', '.adpost', '.adsbygoogle', '.google-auto-placed', '.pli', '.responsive_fill',
    '[id^="google_ads_iframe_"]', '[id^="div-gpt-ad"]', '[id^="aswift_"][id$="_host"]',
    'iframe[src*="//loader.fmkorea.com/"]', 'iframe[src*="//cdn.nhnace.com/"]',
    'iframe[src*="//new-cdn.nhnace.com/"]', 'iframe[src*="doubleclick.net/"]',
    'iframe[src*="googlesyndication.com/"]'
  ];
  let currentAdSelectors = adSelectors;
  const narrowScreen = window.matchMedia('(max-width: 1024px)');

  function isMobileView() {
    // 모바일 브라우저의 PC형 HTML·태블릿·주소 리다이렉트도 처리합니다.
    return Boolean(document.querySelector('header.hd, div.hd, link[href*="/m.layouts/"]')) ||
      location.hostname === 'm.fmkorea.com' ||
      new URLSearchParams(location.search).get('m') === '1' ||
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent)) ||
      narrowScreen.matches;
  }

  function discoverAdSelectors() {
    const selectors = [...adSelectors];
    // 광고 복구 모듈은 매 요청마다 CSS 파일명과 광고 클래스명을 함께 바꿉니다.
    // /modules/... 등의 일반 스타일은 제외하고 해당 루트 CSS의 클래스만 찾습니다.
    document.querySelectorAll('link[rel="stylesheet"][href]').forEach(link => {
      try {
        const url = new URL(link.href, location.href);
        const match = url.hostname === 'static.fmkorea.com' && url.pathname.match(/^\/([A-Za-z]{12,})\.css$/);
        if (match) selectors.push(`.${match[1]}`);
      } catch (error) {
        // 잘못된 외부 리소스 주소는 무시합니다.
      }
    });
    return selectors;
  }

  function adContainer(element) {
    // 광고만 담긴 고정 높이 래퍼도 함께 접어 빈 광고 공간이 남지 않게 합니다.
    let container = element;
    while (container.parentElement) {
      const parent = container.parentElement;
      if (!parent.matches('div, section, aside, li') || parent.matches(
        '#wrap, #container, #content, main, article, .rd, .rd_hd, .rd_body, .rd_ft, .fdb_itm, .comment-content, .xe_content'
      )) break;
      const hasContent = Array.from(parent.childNodes).some(node => {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim() !== '';
        if (node.nodeType !== Node.ELEMENT_NODE || node === container) return false;
        if (node.matches('div:empty') && (!node.className || node.style.clear === 'both')) return false;
        return !node.matches(`script, style, template, ${currentAdSelectors.join(',')}`);
      });
      if (hasContent) break;
      container = parent;
    }
    return container;
  }

  function collectAdTargets() {
    const targets = new Set();
    document.querySelectorAll(currentAdSelectors.join(',')).forEach(element => {
      // 빈 차단 감지용 미끼는 건드리지 않습니다. 실제 광고가 들어오면 다시 검사합니다.
      if (!element.firstElementChild && !element.textContent.trim() && !element.getBoundingClientRect().height) return;
      targets.add(adContainer(element));
    });
    return targets;
  }

  function contentRoot() {
    const rotatingClasses = currentAdSelectors.slice(adSelectors.length).join(',');
    for (const anchor of document.querySelectorAll('.rd_body article, .bd_lst_wrp, .fm_best_widget')) {
      // 복구 모듈은 본문과 목록도 복제하므로 광고 모듈의 복제본을 제외합니다.
      if (rotatingClasses && anchor.closest(rotatingClasses)) continue;
      if (!anchor.getClientRects().length || getComputedStyle(anchor).visibility === 'hidden') continue;
      return anchor.closest('.bd') || anchor;
    }
    return null;
  }

  function collectHeaderTargets(adTargets) {
    const targets = new Set();
    const ads = Array.from(adTargets);
    function add(element) {
      if (element.matches(`script, style, link, template, #${HOST_ID}`)) return;
      if (ads.some(ad => ad === element || ad.contains(element))) return;
      if (ads.some(ad => element.contains(ad))) {
        // 상단과 광고를 따로 토글하고, 광고를 display:none으로 감추지 않게 합니다.
        Array.from(element.children).forEach(add);
      } else {
        targets.add(element);
      }
    }
    const root = contentRoot();
    if (root) {
      // 태그·클래스에 의존하지 않고 실제 본문 이전의 형제 영역을 접습니다.
      for (let node = root; node && node !== document.body; node = node.parentElement) {
        for (let sibling = node.previousElementSibling; sibling; sibling = sibling.previousElementSibling) add(sibling);
      }
    } else {
      // 본문이 아직 파싱되지 않았거나 로그인/설정 화면인 경우에만 좁은 fallback을 사용합니다.
      document.querySelectorAll(headerSelectors.join(',')).forEach(add);
    }
    return targets;
  }

  function syncHiddenElements(key, active, targets) {
    const saved = hiddenElements[key];
    if (active) {
      targets.forEach(element => {
        if (saved.has(element)) return;
        // display 기반 광고 차단 감지를 유발하지 않고, 흐름 밖으로 빼 공간도 접습니다.
        const styles = key === 'ads' ? {
          position: 'absolute', left: '-100000px', top: '0px', visibility: 'hidden',
          'pointer-events': 'none', width: `${Math.max(element.getBoundingClientRect().width, 1)}px`
        } : { display: 'none' };
        const original = new Map();
        for (const property of Object.keys(styles)) original.set(property, {
          value: element.style.getPropertyValue(property), priority: element.style.getPropertyPriority(property)
        });
        saved.set(element, { styles, original });
      });
    }
    for (const [element, state] of saved) {
      if (!active || !targets.has(element)) {
        for (const [property, original] of state.original) {
          if (original.value) element.style.setProperty(property, original.value, original.priority);
          else element.style.removeProperty(property);
        }
        saved.delete(element);
      } else if (!element.isConnected) {
        saved.delete(element);
      } else {
        for (const [property, value] of Object.entries(state.styles)) {
          if (element.style.getPropertyValue(property) === value && element.style.getPropertyPriority(property) === 'important') continue;
          state.original.set(property, {
            value: element.style.getPropertyValue(property), priority: element.style.getPropertyPriority(property)
          });
          element.style.setProperty(property, value, 'important');
        }
      }
    }
  }

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
  const styleText = style.textContent;

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
    if (!document.body) return;
    if (host) {
      if (!host.isConnected) document.body.appendChild(host);
      return;
    }
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
      refresh();
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
    if (style.textContent !== styleText) style.textContent = styleText;
    if (!style.isConnected) (document.head || document.documentElement).appendChild(style);
    const mobile = isMobileView();
    document.documentElement.setAttribute('data-fm-clean-mobile', String(mobile));
    applySettings();
    currentAdSelectors = discoverAdSelectors();
    const adTargets = collectAdTargets();
    const headerTargets = collectHeaderTargets(adTargets);
    syncHiddenElements('header', mobile && settings.enabled && settings.header, headerTargets);
    syncHiddenElements('ads', mobile && settings.enabled && settings.ads, adTargets);
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
      attributes: true, attributeFilter: ['class', 'id', 'src', 'href', 'style']
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
    narrowScreen.addEventListener('change', scheduleRefresh);
  }
  if (document.documentElement) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
}());
