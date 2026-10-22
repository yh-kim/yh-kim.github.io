// ==UserScript==
// @name         FM코리아 모바일 정리
// @namespace    https://blog.pickth.com/
// @version      1.5.18
// @description  홈 버튼 드래그 이동, 저장 메뉴·짧은 링크 복사, 본문 진행률, 살구색 모바일 UI, 광고·상단·댓글 정리
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
  const MAIN_URL = 'https://www.fmkorea.com/';
  const DOUBLE_TAP_MS = 400;
  const SCRIPT_VERSION = '1.5.18';
  const AD_STATE_ATTRIBUTE = 'data-fm-clean-ad-original';
  const defaults = {
    enabled: true, header: true, ads: true, icons: true, votes: true,
    boardLabel: true, count: true, readingHeader: true, swipeBack: true, footer: true, commentActions: true, commentComposer: true, siteFooter: true, appearance: true, launcherRight: false
  };
  const options = [
    ['enabled', '전체 기능 켜기'],
    ['header', '상단 로고·알림 숨김'],
    ['ads', '광고 영역 숨김'],
    ['icons', '글·댓글 닉네임 아이콘 숨김'],
    ['votes', '포텐·방출 버튼 숨김'],
    ['boardLabel', '상세 제목 왼쪽 현재 메뉴 표시'],
    ['count', '상세 제목 오른쪽 추천 숫자'],
    ['readingHeader', '스크롤 시 제목·진행 바 표시'],
    ['swipeBack', '오른쪽 스와이프로 뒤로가기'],
    ['footer', '상세 주소·하단 도구 숨김'],
    ['commentActions', '댓글 추천 수만 표시·이동 버튼 정리'],
    ['commentComposer', '댓글 쓰기 기본 접기'],
    ['siteFooter', '사이트 하단 문의·신고 숨김'],
    ['appearance', '깔끔한 화면 디자인']
  ];
  const settings = loadSettings();
  let host;
  let panel;
  let backdrop;
  let launcher;
  let pending = false;
  let launcherClickTimer = null;
  let primaryContentRoot = null;
  const hiddenElements = { header: new Map(), ads: new Map() };
  const knownAdTargets = new Set();
  const headerSelectors = [
    'header.hd', 'div.hd', '#header', '.msearch', '.msearch + .dummy'
  ];
  const menuSelectors = 'nav.fmkorea_navi, #gnb';
  const adSelectors = [
    `[${AD_STATE_ATTRIBUTE}]`,
    '.fmad_wrapper', '[id^="fmad_wrapper_"]', '[id^="fmad_extra_wrapper_"]',
    '.ad_wrapper', '.adpost', '.adsbygoogle', '.google-auto-placed', '.pli', '.responsive_fill',
    '[id^="google_ads_iframe_"]', '[id^="div-gpt-ad"]', '[id^="aswift_"][id$="_host"]',
    'iframe[src*="//loader.fmkorea.com/"]', 'iframe[src*="//cdn.nhnace.com/"]',
    'iframe[src*="//new-cdn.nhnace.com/"]', 'iframe[src*="doubleclick.net/"]',
    'iframe[src*="googlesyndication.com/"]'
  ];
  const discoveredAdSelectors = new Set(adSelectors);
  const adResources = new Map();
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

  function rememberAdResource(href) {
    try {
      const url = new URL(href, location.href);
      const match = url.hostname === 'static.fmkorea.com' && url.pathname.match(/^\/([A-Za-z_][A-Za-z0-9_-]*)\.(css|js)$/);
      if (!match) return;
      const assets = adResources.get(match[1]) || new Set();
      assets.add(match[2]);
      adResources.set(match[1], assets);
      // 이름 길이는 요청마다 다릅니다. 동명의 루트 CSS·JS 쌍으로 광고 모듈을 식별합니다.
      if (assets.has('css') && assets.has('js')) discoveredAdSelectors.add(`.${match[1]}`);
    } catch (error) {
      // 잘못된 외부 리소스 주소는 무시합니다.
    }
  }

  function rememberAdForm(form) {
    const match = form.id.match(/^([A-Za-z_][A-Za-z0-9_-]*)_form$/);
    if (!match) return;
    const field = form.elements.namedItem(match[1]);
    if (!(field instanceof HTMLInputElement) || field.type !== 'hidden') return;
    try {
      const payload = atob(field.value);
      const identity = payload.match(/s:13:"random_string";s:\d+:"([A-Za-z_][A-Za-z0-9_-]*)";/);
      if (identity?.[1] === match[1] && /s:7:"channel";s:\d+:"[^"\n]*fmkorea\./.test(payload)) {
        discoveredAdSelectors.add(`.${match[1]}`);
      }
    } catch (error) { /* 일반 폼이나 디코딩할 수 없는 값은 광고로 취급하지 않습니다. */ }
  }

  function rememberAdNode(node) {
    if (!(node instanceof Element)) return;
    const remember = element => {
      if (element instanceof HTMLFormElement) rememberAdForm(element);
      else rememberAdResource(element.getAttribute('href') || element.getAttribute('src'));
    };
    if (node.matches('link[href], script[src], form[id$="_form"]')) remember(node);
    node.querySelectorAll('link[href], script[src], form[id$="_form"]').forEach(remember);
  }

  function discoverAdSelectors() {
    // 리소스 쌍과 광고 요청 폼의 random_string을 교차 확인하며 길이는 가정하지 않습니다.
    rememberAdNode(document.documentElement);
    // CSS 링크가 교체돼도 이미 확인한 광고 클래스의 정체는 유지합니다.
    return [...discoveredAdSelectors];
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
    for (const element of knownAdTargets) {
      if (!element.isConnected) knownAdTargets.delete(element);
    }
    const parked = Array.from(knownAdTargets);
    // 사이트가 같은 광고의 class/id를 지워도 숨김을 해제하지 않습니다.
    // 다시 감싼 광고 전용 부모도 접되, 본문이 함께 있는 부모까지 올라가지는 않습니다.
    const targets = new Set(parked.filter(element => element.isConnected).map(adContainer));
    parked.filter(element => element.isConnected).forEach(element => targets.add(element));
    const rotatingClasses = currentAdSelectors.slice(adSelectors.length).join(',');
    document.querySelectorAll(currentAdSelectors.join(',')).forEach(element => {
      const target = adContainer(element);
      const verifiedSlot = element.hasAttribute(AD_STATE_ATTRIBUTE) || (rotatingClasses && element.matches(rotatingClasses));
      // 빈 차단 감지용 미끼는 건드리지 않습니다. 실제 광고가 들어오면 다시 검사합니다.
      // 숨겨진 슬롯의 부모에 고정 높이가 남아 있거나 이미 접은 슬롯인 경우에는 계속 관리합니다.
      // 난수 CSS와 연결된 슬롯은 CSS 다운로드 전의 0높이 상태에서도 선제적으로 접습니다.
      if (!verifiedSlot && !element.firstElementChild && !element.textContent.trim() && !element.getBoundingClientRect().height &&
          !target.getBoundingClientRect().height &&
          !parked.some(saved => saved === element || saved.contains(element))) return;
      targets.add(target);
    });
    // 숨김 상태와 광고의 정체를 분리해, 기능을 껐다 켜도 다시 찾을 수 있게 합니다.
    targets.forEach(element => knownAdTargets.add(element));
    return targets;
  }

  function contentRoot() {
    const rotatingClasses = currentAdSelectors.slice(adSelectors.length).join(',');
    // 광고 복제본이 앞에 삽입돼도 먼저 확인한 실제 게시판을 기준으로 유지합니다.
    if (primaryContentRoot?.isConnected &&
        !primaryContentRoot.closest(`[${AD_STATE_ATTRIBUTE}]${rotatingClasses ? `,${rotatingClasses}` : ''}`)) return primaryContentRoot;
    for (const anchor of document.querySelectorAll('.rd_body article, .bd_lst_wrp, .fm_best_widget')) {
      // 복구 모듈은 본문과 목록도 복제하므로 광고 모듈의 복제본을 제외합니다.
      if (rotatingClasses && anchor.closest(rotatingClasses)) continue;
      if (!anchor.getClientRects().length || getComputedStyle(anchor).visibility === 'hidden') continue;
      primaryContentRoot = anchor.closest('.bd') || anchor;
      return primaryContentRoot;
    }
    return null;
  }

  function collectHeaderTargets(adTargets) {
    const targets = new Set();
    // 아직 비어 있거나 원래 숨겨진 광고 슬롯도 상단 display:none 처리에서는 제외합니다.
    const ads = [...adTargets, ...document.querySelectorAll(currentAdSelectors.join(','))];
    const menus = Array.from(document.querySelectorAll(menuSelectors));
    // 최근 방문 안에 실제 게시판 링크가 있으면 그 메뉴 목록만 보존합니다.
    document.querySelectorAll('.fm-recent-visited .list').forEach(list => {
      if (list.querySelector('.item.bookmark a[href], .item.recent a[href]')) menus.push(list);
    });
    function add(element) {
      if (element.matches(`script, style, link, template, #${HOST_ID}`)) return;
      if (ads.some(ad => ad === element || ad.contains(element))) return;
      if (menus.some(menu => menu === element || menu.contains(element))) return;
      if (ads.some(ad => element.contains(ad)) || menus.some(menu => element.contains(menu))) {
        // 게시판 메뉴는 보존하고, 광고는 display:none으로 감추지 않게 분리합니다.
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
    // 알림/최근방문 제어부와 현재 게시판 위치 표시는 본문 안에 있어도 숨깁니다.
    document.querySelectorAll('.main_recent, .fm-recent-visited, .bd .tl_srch').forEach(add);
    return targets;
  }

  function syncHiddenElements(key, active, targets) {
    const saved = hiddenElements[key];
    {
      targets.forEach(element => {
        if (saved.has(element)) return;
        // 꺼진 동안 재삽입된 복제본도 복원 정보를 읽어 원래 표시 상태로 돌립니다.
        if (!active && !(key === 'ads' && element.hasAttribute(AD_STATE_ATTRIBUTE))) return;
        // display 기반 광고 차단 감지를 유발하지 않고, 흐름 밖으로 빼 공간도 접습니다.
        const styles = key === 'ads' ? {
          position: 'absolute', left: '-100000px', top: '0px', visibility: 'hidden',
          'pointer-events': 'none', width: `${Math.max(element.getBoundingClientRect().width, 1)}px`,
          height: '0px', 'min-height': '0px', 'max-height': '0px',
          'margin-top': '0px', 'margin-right': '0px', 'margin-bottom': '0px', 'margin-left': '0px',
          'padding-top': '0px', 'padding-right': '0px', 'padding-bottom': '0px', 'padding-left': '0px',
          'border-top-width': '0px', 'border-right-width': '0px',
          'border-bottom-width': '0px', 'border-left-width': '0px',
          'overflow-x': 'hidden', 'overflow-y': 'hidden'
        } : { display: 'none' };
        const original = new Map();
        let inherited = new Map();
        if (key === 'ads') {
          // 사이트가 광고를 cloneNode로 복제하면 표식과 복원 정보도 함께 따라갑니다.
          // 복제된 강제 숨김 스타일을 원래 스타일로 잘못 저장하지 않습니다.
          try {
            const data = JSON.parse(element.getAttribute(AD_STATE_ATTRIBUTE) || 'null');
            if (Array.isArray(data)) inherited = new Map(data.filter(entry =>
              Array.isArray(entry) && entry.length === 2 && Object.hasOwn(styles, entry[0]) &&
              typeof entry[1]?.value === 'string' && typeof entry[1]?.priority === 'string'
            ));
          } catch (error) { /* 원래 스타일을 직접 저장하는 기본 경로를 사용합니다. */ }
        }
        for (const property of Object.keys(styles)) original.set(property, {
          value: element.style.getPropertyValue(property), priority: element.style.getPropertyPriority(property)
        });
        for (const [property, value] of inherited) {
          if (original.get(property).value === styles[property] && original.get(property).priority === 'important') original.set(property, value);
        }
        saved.set(element, { styles, original });
      });
    }
    for (const [element, state] of saved) {
      if (active && key === 'ads' && !element.isConnected) {
        // 잠시 DOM 밖으로 뺀 광고의 표식을 지우면 클래스 없는 재삽입을 놓칩니다.
        // 복원 정보는 노드 자체에 남기고 Map 참조만 해제합니다.
        saved.delete(element);
      } else if (!active || !targets.has(element)) {
        for (const [property, original] of state.original) {
          if (original.value) element.style.setProperty(property, original.value, original.priority);
          else element.style.removeProperty(property);
        }
        if (key === 'ads') element.removeAttribute(AD_STATE_ATTRIBUTE);
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
        if (key === 'ads') element.setAttribute(AD_STATE_ATTRIBUTE, JSON.stringify([...state.original]));
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

  function cleanAppearance() {
    const root = scope('appearance');
    const detail = `${root} .rd_hd .board:has(> .top_area > .date):has(> .btm_area > .side.fr)`;
    const home = `${root} body:has(.main_recent)`;
    const commentItem = `${root}[data-fm-clean-commentactions="true"] .fdb_itm:has(> .fdb_nav)`;
    const commentNav = `${root}[data-fm-clean-commentactions="true"] .fdb_itm .fdb_nav`;
    // 본문 작성자 색상·영상·인용 형식은 유지하고 다크 모드 이미지 밝기만 낮춥니다.
    return `
      ${root} { background: transparent !important; }
      ${root} body {
        --fm-clean-bg: #f6f5f2; --fm-clean-surface: #fff; --fm-clean-raised: #faf9f7;
        --fm-clean-text: #1c1b19; --fm-clean-muted: #6b6862; --fm-clean-line: #e7e4de;
        --fm-clean-title: #1c1b19;
        --fm-clean-content: #1c1b19;
        --fm-clean-read: #74716b;
        --fm-clean-comment: #8b5a3c;
        --fm-clean-accent: #9a4e26; --fm-clean-soft: #fff0e7;
        color-scheme: light;
        background: var(--fm-clean-surface) !important; color: var(--fm-clean-text) !important;
        margin: 0 4px !important; padding: 0 !important; box-sizing: border-box;
        font-family: Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif !important;
      }
      ${root} body.night_mode {
        --fm-clean-bg: #121211; --fm-clean-surface: #1b1b1a; --fm-clean-raised: #232321;
        --fm-clean-text: #f0efeb; --fm-clean-muted: #b0ada6; --fm-clean-line: #2f2e2b;
        --fm-clean-title: #dad7d1; --fm-clean-content: #d5d2cc;
        --fm-clean-read: #9b9891;
        --fm-clean-comment: #b69a86;
        --fm-clean-accent: #f0b58f; --fm-clean-soft: #3b2a23;
        color-scheme: dark;
      }
      ${root} :where(.bd, .fm_best_widget, nav.fmkorea_navi, .fmkorea_m_navi, #gnb, body > footer) a:not(:where(.xe_content *, article *)) {
        color: var(--fm-clean-text) !important;
      }
      ${root} .bd {
        color: var(--fm-clean-text) !important; background: var(--fm-clean-surface) !important;
        border: 0 !important; border-radius: 0 !important; margin: 0 !important;
        box-shadow: none !important;
      }
      ${root} :is(.bd_lst_wrp, .fdb_lst_wrp) { background: var(--fm-clean-surface) !important; }
      ${root} :is(nav.fmkorea_navi, .fmkorea_m_navi, #gnb) {
        background: var(--fm-clean-bg) !important;
        border: 0 !important; border-bottom: 1px solid var(--fm-clean-line) !important;
        padding: 7px 10px !important; box-sizing: border-box;
      }
      ${root} :is(nav.fmkorea_navi, .fmkorea_m_navi, #gnb) :is(.list, .expand) {
        background: var(--fm-clean-bg) !important; border-color: var(--fm-clean-line) !important;
      }
      ${root} :is(nav.fmkorea_navi, .fmkorea_m_navi, #gnb) a {
        color: var(--fm-clean-text) !important; background: var(--fm-clean-raised) !important;
        border: 1px solid var(--fm-clean-line) !important; border-radius: 999px !important; box-shadow: none !important;
        text-shadow: none !important; font-size: 13px !important; font-weight: 500 !important;
      }
      ${root} :is(nav.fmkorea_navi, .fmkorea_m_navi, #gnb) a:is(.on, .active, [aria-current]:not([aria-current="false"])),
      ${root} :is(nav.fmkorea_navi, .fmkorea_m_navi, #gnb) :is(li.on, li.active) > a {
        color: var(--fm-clean-accent) !important; background: var(--fm-clean-soft) !important;
        border-color: transparent !important;
      }
      ${root} :is(nav.fmkorea_navi, .fmkorea_m_navi, #gnb) :is(.expand, .expand i, button.close) {
        color: var(--fm-clean-text) !important;
      }
      ${root} .fm-recent-visited {
        background: var(--fm-clean-surface) !important; border-bottom: 1px solid var(--fm-clean-line) !important;
        margin: 0 !important; padding: 5px 8px !important;
      }
      ${root} .fm-recent-visited:not(.expanded) { height: 38px !important; }
      ${root} .fm-recent-visited.expanded { height: auto !important; }
      ${root} .fm-recent-visited .list { background: var(--fm-clean-surface) !important; }
      ${root} .fm-recent-visited .item:is(.bookmark, .recent) {
        height: 26px !important; line-height: 24px !important; border: 1px solid var(--fm-clean-line) !important;
        border-radius: 999px !important; background: var(--fm-clean-raised) !important; box-sizing: border-box;
      }
      ${root} .fm-recent-visited .item:is(.bookmark, .recent) a {
        color: var(--fm-clean-text) !important; padding: 0 9px !important; text-decoration: none !important;
        font: 500 12px/24px Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif !important;
      }
      ${root} .fm-recent-visited .item.bookmark {
        background: var(--fm-clean-soft) !important; border-color: transparent !important;
      }
      ${root} .fm-recent-visited .item.bookmark a { color: var(--fm-clean-accent) !important; }
      ${root} .fm-recent-visited .item span.time { color: var(--fm-clean-muted) !important; font-size: 10px !important; }
      ${root} .rd_hd {
        margin: 0 !important; padding: 10px 8px 8px !important;
        background: var(--fm-clean-surface) !important; border-bottom: 1px solid var(--fm-clean-line) !important;
      }
      ${root} .rd_hd :is(.top_area, .btm_area, .board) {
        border: 0 !important; background: transparent !important; box-shadow: none !important;
        text-shadow: none !important;
      }
      ${root} .rd_hd .board .top_area { padding: 0 !important; }
      ${root} .rd_hd .date {
        display: block !important; float: none !important; text-align: right;
        color: var(--fm-clean-muted) !important;
        margin: 0 0 4px !important; font-size: 11px !important; line-height: 1.4 !important;
      }
      ${root} .rd_hd .board .btm_area { margin: 0 !important; padding: 0 !important; }
      ${root} .rd_hd h1 {
        padding: 0 !important; margin: 4px 0 6px !important;
        color: var(--fm-clean-title) !important; font-size: 18px !important;
        font-weight: 600 !important; line-height: 1.5 !important; letter-spacing: -.2px !important;
        text-shadow: none !important;
      }
      ${root} .rd_hd h1 .np_18px_span { color: var(--fm-clean-title) !important; }
      ${root} .rd_hd :is(.btm_area, .btm_area span, .btm_area b),
      ${root} .document_address, ${root} .document_address a {
        color: var(--fm-clean-muted) !important; font-size: 12px !important;
      }
      ${root} .rd_hd .member_plate { color: var(--fm-clean-text) !important; }
      ${detail} {
        display: grid !important; grid-template-columns: minmax(0, 1fr) auto auto;
        column-gap: 7px; align-items: center;
      }
      ${detail} > .top_area, ${detail} > .btm_area { display: contents !important; }
      ${detail}::after, ${detail} > .top_area::after, ${detail} > .btm_area::after { content: none !important; }
      ${detail} > .top_area > .clear { display: none !important; }
      ${detail} > .top_area > h1 { grid-row: 1; grid-column: 1 / -1; margin-top: 0 !important; }
      ${detail} > .top_area > .date {
        grid-row: 2; grid-column: 3; justify-self: end; align-self: center;
        margin: 0 !important; white-space: nowrap; font-size: 10px !important;
      }
      ${detail} > .btm_area > .side {
        grid-row: 2; float: none !important; width: auto !important; min-width: 0;
        margin: 0 !important; padding: 0 !important; font-size: 11px !important;
      }
      ${detail} > .btm_area > .side:first-child {
        grid-column: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      ${detail} > .btm_area > .side.fr {
        grid-column: 2; display: flex !important; gap: 7px; white-space: nowrap;
      }
      ${detail} > .btm_area > .side.fr :is(span, b) { font-size: 11px !important; margin: 0 !important; }
      ${root} .rd_body { padding: 0 !important; margin-left: 0 !important; margin-right: 0 !important; }
      ${root} .rd_body .document_address {
        margin: 0 !important; padding: 10px 12px !important;
        border-bottom: 1px solid var(--fm-clean-line) !important;
      }
      ${root} .document_address .btn_pack { background: none !important; padding: 0 !important; border: 0 !important; }
      ${root} .document_address .btn_pack button {
        background: var(--fm-clean-raised) !important; color: var(--fm-clean-muted) !important;
        border: 1px solid var(--fm-clean-line) !important; border-radius: 999px !important;
        padding: 3px 9px !important; box-shadow: none !important; text-shadow: none !important;
      }
      ${root} .rd_body article .xe_content > p:not(:has(img, picture, video, iframe)) {
        padding-left: 8px !important; padding-right: 8px !important;
      }
      ${root} body.night_mode .rd_body article .xe_content:not([style*="color" i]) {
        color: var(--fm-clean-content) !important;
      }
      ${root} body.night_mode .rd_body article .xe_content img:not(table.invertl img):not([style*="filter" i]) {
        filter: none !important;
      }
      ${root} body.night_mode .rd_body article .xe_content img[data-fm-clean-bright-image]:not(table.invertl img):not([style*="filter" i]) {
        filter: brightness(.64) !important;
      }
      ${root} :is(.fdb_tag, .fdb_lst, .fdb_itm, .bd_lst, .bd_lst > li, .bd_lst td, .bd_m_lst, .bd_m_lst > li) {
        background: transparent !important; border-color: var(--fm-clean-line) !important;
        color: var(--fm-clean-text) !important; box-shadow: none !important;
      }
      ${root} .bd_m_lst.zine > li { padding-top: 5px !important; padding-bottom: 5px !important; }
      ${root} .bd_m_lst.zine > li:not(.is_tmb) { padding-left: 10px !important; padding-right: 10px !important; }
      ${root} .bd_m_lst.zine > li.is_tmb { padding-right: 10px !important; }
      ${root} :is(.bd_lst, .bd_m_lst) > li { border-bottom: 1px solid var(--fm-clean-line) !important; }
      ${root} .bd_m_lst > li .rt_area h3 {
        color: var(--fm-clean-title) !important; font-size: 13px !important; font-weight: 400 !important; line-height: 1.35 !important;
        height: auto !important;
        white-space: normal !important; text-overflow: clip !important; overflow: visible !important;
      }
      ${root} .bd_m_lst > li.notice.pop0 .rt_area h3 { font-size: 12px !important; }
      ${root} .bd_m_lst > li .rt_area h3 > a { white-space: normal !important; }
      ${root} .bd_m_lst h3 .ellipsis-target {
        display: inline !important; white-space: normal !important; overflow: visible !important;
        max-width: none !important; text-overflow: clip !important;
      }
      ${root} .bd_m_lst h3 .no strong {
        background: var(--fm-clean-soft) !important; color: var(--fm-clean-accent) !important;
        border-radius: 999px !important; font-size: 10px !important;
      }
      ${root} .bd_m_lst > li .info { margin-top: 2px !important; line-height: 1.4 !important; font-size: 10.5px !important; }
      ${root} .bd_m_lst > li .rt_area h3 > a,
      ${root} .bd_m_lst > li .rt_area h3 > a :not(.comment_count) {
        color: var(--fm-clean-title) !important; text-shadow: none !important;
      }
      ${root} .bd_m_lst .blind, ${root} .bd_m_lst .blind * {
        color: var(--fm-clean-title) !important;
      }
      ${root} .bd_m_lst > li .rt_area h3 .comment_count,
      ${root} .bd_m_lst > li .visited .comment_count {
        color: var(--fm-clean-comment) !important;
      }
      ${root} .bd_m_lst > li .rt_area h3 .no strong {
        color: var(--fm-clean-accent) !important;
      }
      ${root} .bd_m_lst > li .info,
      ${root} .bd_m_lst > li .info :is(span, b, a, i) {
        color: var(--fm-clean-muted) !important; font-size: 10.5px !important;
      }
      ${root} .bd_m_lst .mrk,
      ${root} .bd_m_lst .mrk.update,
      ${root} .bd_m_lst .mrk.pop {
        color: var(--fm-clean-accent) !important; background: var(--fm-clean-soft) !important;
        border-radius: 999px !important;
      }
      ${root} .bd_m_lst > li:is(.notice.pop1, .select) {
        background: var(--fm-clean-raised) !important;
      }
      ${root} .bd_m_lst > li .tmb_wrp {
        background: var(--fm-clean-raised) !important; border-color: var(--fm-clean-line) !important;
      }
      ${root} :is(.tl_srch, .new_lst_btn, .bd_cnb, .bd_hd) {
        background: var(--fm-clean-surface) !important; color: var(--fm-clean-text) !important;
        border-color: var(--fm-clean-line) !important; box-shadow: none !important;
      }
      ${root} :is(.tl_srch, .new_lst_btn, .bd_cnb) { border-bottom: 1px solid var(--fm-clean-line) !important; }
      ${root} .tl_srch .bd_tl :is(h1, h1 a) { color: var(--fm-clean-text) !important; }
      ${root} .new_lst_btn :is(a, a i, .view_notice),
      ${root} .bd_hd .btn_img { color: var(--fm-clean-muted) !important; text-shadow: none !important; }
      ${root} .bd_hd .btn_img {
        background: var(--fm-clean-raised) !important; border: 1px solid var(--fm-clean-line) !important;
        border-radius: 999px !important; box-shadow: none !important;
      }
      ${root} .new_lst_btn :is(.view_notice .a, .pop_border .a, .lst_btn a) {
        background-color: var(--fm-clean-raised) !important; border-color: var(--fm-clean-line) !important;
        border-radius: 999px !important;
      }
      ${root} .new_lst_btn .lst_btn li.on a {
        background: var(--fm-clean-soft) !important; color: var(--fm-clean-accent) !important;
        border-color: var(--fm-clean-line) !important; border-radius: 999px !important;
      }
      ${root} .bd_cnb ul { background: transparent !important; border: 0 !important; }
      ${root} .bd_cnb li a {
        background: var(--fm-clean-raised) !important; border: 1px solid var(--fm-clean-line) !important;
        border-radius: 999px !important; color: var(--fm-clean-text) !important;
        text-shadow: none !important;
      }
      ${root} .bd_cnb li.on a, ${root} .bd_cnb li a.on, ${root} .bd_cnb .a1.on {
        background: var(--fm-clean-soft) !important; color: var(--fm-clean-accent) !important;
      }
      ${root} .bd_cnb .a1.on::before { content: none !important; }
      ${root} .fdb_lst_ul { background: var(--fm-clean-surface) !important; }
      ${root} .rd > .fdb_lst_wrp {
        margin-top: 8px !important; padding-top: 8px !important;
        border-top: 1px solid var(--fm-clean-line) !important;
      }
      ${root} .fdb_tag {
        background: var(--fm-clean-raised) !important; border: 0 !important;
        border-bottom: 1px solid var(--fm-clean-line) !important; border-radius: 0 !important; padding: 8px 10px !important;
      }
      ${root} .fdb_itm { padding-top: 6px !important; padding-bottom: 6px !important; }
      ${root} .fdb_itm > .meta { margin-bottom: 4px !important; }
      ${root} .fdb_itm :is(.meta, .meta .date, .meta a, .meta span) {
        color: var(--fm-clean-muted) !important; font-size: 11px !important;
      }
      ${root} .fdb_itm .member_plate { color: var(--fm-clean-text) !important; font-weight: 600; }
      ${root} .fdb_itm .meta [data-fm-clean-author] {
        display: inline-flex; align-items: center; flex: none; vertical-align: middle;
        padding: 2px 5px; border-radius: 999px; background: var(--fm-clean-soft);
        color: var(--fm-clean-accent) !important; font-size: 9px !important;
        font-weight: 600; line-height: 1.3; white-space: nowrap;
      }
      ${root} .fdb_itm .comment-content { color: var(--fm-clean-content) !important; font-size: 13px !important; line-height: 1.55 !important; }
      ${root} .fdb_itm .comment-content .xe_content { font-size: inherit !important; line-height: inherit !important; }
      ${root} .fdb_itm .comment-content > .xe_content:not([style*="color" i]) { color: inherit !important; }
      ${root} .fdb_itm .meta :is(.best, .icon-hit) {
        background: var(--fm-clean-soft) !important; color: var(--fm-clean-accent) !important;
        border: 0 !important; border-radius: 999px !important;
      }
      ${commentItem} {
        display: grid !important; grid-template-columns: minmax(0, 1fr) auto;
        column-gap: 6px; align-items: center;
      }
      ${commentItem}::after { content: none !important; display: none !important; }
      ${commentItem} > .meta {
        grid-row: 1; grid-column: 1; min-width: 0; margin-bottom: 4px !important;
        display: flex !important; align-items: center; flex-wrap: wrap; gap: 3px 6px;
        overflow: visible; white-space: normal;
      }
      ${commentItem} > .meta .member_plate {
        min-width: 0; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      ${commentItem} > .meta .date { padding: 0 !important; font-size: 10px !important; }
      ${commentItem} [data-fm-clean-comment-stats] {
        display: inline-flex; align-items: center; gap: 7px; padding-left: 7px;
        border-left: 1px solid var(--fm-clean-line); white-space: nowrap;
        font-variant-numeric: tabular-nums; cursor: default;
      }
      ${commentItem} [data-fm-clean-comment-stats] span {
        color: var(--fm-clean-muted) !important; font-size: 10px !important; font-weight: 500;
      }
      ${commentItem} [data-fm-clean-comment-stats] [data-stat="up"] { color: var(--fm-clean-comment) !important; }
      ${commentItem} > .comment-content { grid-row: 2; grid-column: 1 / -1; }
      ${commentNav} {
        grid-row: 1; grid-column: 2; position: static !important; float: none !important;
        display: flex !important; align-items: center; justify-content: flex-end; gap: 3px;
        margin: 0 0 4px !important; padding: 0 !important; line-height: 1 !important;
      }
      ${commentItem}:not(:has(> .fdb_nav > .findComment)) { grid-template-columns: minmax(0, 1fr); }
      ${commentNav}:not(:has(> .findComment)) { display: none !important; }
      ${commentNav} a.findComment {
        position: static !important; float: none !important; top: auto !important; right: auto !important;
        display: inline-flex !important; align-items: center; justify-content: center; gap: 3px;
        height: 24px !important; min-width: 30px; box-sizing: border-box !important;
        margin: 0 !important; padding: 0 6px !important; overflow: visible !important; white-space: nowrap;
        border: 1px solid var(--fm-clean-line) !important; border-radius: 999px !important;
        background: var(--fm-clean-raised) !important; color: var(--fm-clean-muted) !important;
        font: 500 10px/1 Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif !important;
        text-shadow: none !important; box-shadow: none !important; text-decoration: none !important;
      }
      ${commentNav} a.findComment i { display: none !important; }
      ${commentNav} a.findComment span { display: inline !important; }
      ${root} .bd_lst :is(.title, .title a, .title a > span) { color: var(--fm-clean-title) !important; }
      ${root} .bd_lst td.title, ${root} .bd_lst td.title a {
        font-size: 13px !important; font-weight: 400 !important; line-height: 1.35 !important;
      }
      ${root} .bd_lst td.title a span:not(.comment_count) { color: var(--fm-clean-title) !important; }
      ${root} .bd_lst td.title .comment_count { color: var(--fm-clean-comment) !important; font-size: 12px !important; }
      ${root} .bd_lst td.title a:is(.visited, :visited),
      ${root} .bd_lst td.title a:is(.visited, :visited) span:not(.comment_count) { color: var(--fm-clean-read) !important; }
      ${root} .bd_lst td { padding-top: 5px !important; padding-bottom: 5px !important; }
      ${root} .bd_lst th {
        background: var(--fm-clean-raised) !important; color: var(--fm-clean-muted) !important;
        border-color: var(--fm-clean-line) !important;
      }
      ${root} .bd_lst tr:is(.notice, .select) { background: var(--fm-clean-raised) !important; }
      ${root} .bd_lst :is(.author, .time, .count, .category) { color: var(--fm-clean-muted) !important; font-size: 10.5px !important; }
      ${root} .bd_m_lst :is(.title, .title a, .title a > span) { color: var(--fm-clean-title) !important; }
      ${root} .bd_m_lst :is(.author, .regdate, .m_no, .category) { color: var(--fm-clean-muted) !important; }
      ${root} .bd_m_lst > li .rt_area h3 > a:is(.visited, :visited),
      ${root} .bd_m_lst > li .rt_area h3 > a:is(.visited, :visited) :not(.comment_count) {
        color: var(--fm-clean-read) !important;
      }
      ${root} .fm_best_widget {
        background: var(--fm-clean-surface) !important; color: var(--fm-clean-text) !important;
        border-color: var(--fm-clean-line) !important;
      }
      ${root} .fm_best_widget li.li {
        background: var(--fm-clean-surface) !important;
        border-color: var(--fm-clean-line) !important; padding-top: 5px !important; padding-bottom: 5px !important;
        box-sizing: border-box;
      }
      ${root} .fm_best_widget li.li:is(.on, .li_best2_pop1) {
        background: var(--fm-clean-raised) !important;
      }
      ${root} .fm_best_widget div,
      ${root} .fm_best_widget :is(.category, .regdate, .author, .voted_count, .hotdeal_info) {
        color: var(--fm-clean-muted) !important; font-size: 10.5px !important;
      }
      ${root} .fm_best_widget :is(a, a:visited, .category a, .category a:visited) {
        color: var(--fm-clean-text) !important; text-shadow: none !important;
      }
      ${root} .fm_best_widget :is(a:hover, a:focus-visible, a:active, a.on),
      ${root} .fm_best_widget .hotdeal_info .strong {
        color: var(--fm-clean-accent) !important;
      }
      ${root} .fm_best_widget .title {
        color: var(--fm-clean-title) !important; font-size: 13px !important;
        font-weight: 400 !important; line-height: 1.35 !important;
      }
      ${root} .fm_best_widget .title a,
      ${root} .fm_best_widget .title a .ellipsis-target {
        color: var(--fm-clean-title) !important;
      }
      ${root} .fm_best_widget :is(.li_visited, .li_visited .title a, .li_visited .title .ellipsis-target),
      ${root} .fm_best_widget .title a:visited,
      ${root} .fm_best_widget .title a:visited .ellipsis-target {
        color: var(--fm-clean-read) !important;
      }
      ${root} .fm_best_widget .comment_count { color: var(--fm-clean-comment) !important; }
      ${root} .m_top_hotdeal::before {
        color: var(--fm-clean-accent) !important; background: var(--fm-clean-soft) !important;
        border-color: var(--fm-clean-line) !important; border-radius: 999px !important;
      }
      ${root} .fm_best_widget li:is(.li_best2_pop1, .li_best2_hotdeal1, .li_best2_politics1) .title::before {
        color: var(--fm-clean-accent) !important; background: var(--fm-clean-soft) !important;
        border: 0 !important; border-radius: 999px !important; font-size: 11px !important;
      }
      ${home} .cnb_n_list_home .bd_cnb {
        padding: 3px 6px !important; border: 0 !important; background: transparent !important;
      }
      ${home} .cnb_n_list_home .bd_cnb > ul {
        display: flex; align-items: center; gap: 4px; height: 28px !important;
        padding: 0 !important; overflow: visible !important;
      }
      ${home} .cnb_n_list_home .bd_cnb > ul > li { margin: 0 !important; }
      ${home} .cnb_n_list_home .bd_cnb > ul > li > a {
        display: inline-flex !important; align-items: center; justify-content: center;
        box-sizing: border-box !important; height: 28px !important; margin: 0 !important;
        padding: 0 11px !important; font-size: 11px !important; line-height: 1 !important;
        border-radius: 999px !important; box-shadow: none !important;
        background: var(--fm-clean-raised) !important; color: var(--fm-clean-muted) !important;
        border-color: transparent !important;
      }
      ${home} .cnb_n_list_home .bd_cnb a[href="/best2"] {
        color: var(--fm-clean-accent) !important; background: var(--fm-clean-soft) !important;
      }
      ${home} .cnb_n_list_home .bd_cnb a[href*="mid=politics"] {
        color: var(--fm-clean-muted) !important; background: var(--fm-clean-raised) !important;
        border-color: var(--fm-clean-line) !important;
      }
      ${home} .cnb_n_list_home .bd_cnb a.on {
        color: var(--fm-clean-accent) !important; background: var(--fm-clean-soft) !important;
        border-color: var(--fm-clean-accent) !important;
      }
      ${home} .fm_best_widget { padding: 0 !important; }
      ${home} .fm_best_widget > ul { margin: 0 !important; padding: 0 !important; }
      ${home} .fm_best_widget > ul > li.li {
        margin: 0 !important; padding: 5px 8px !important; min-height: 0 !important;
        background: transparent !important; border: 0 !important;
        border-bottom: 1px solid var(--fm-clean-line) !important;
      }
      ${home} .fm_best_widget > ul > li.li > div.li {
        padding: 0 !important; min-height: 0 !important;
      }
      ${home} .fm_best_widget > ul > li.li > div.li:has(> a > img.thumb) {
        padding-right: 64px !important; min-height: 44px !important;
      }
      ${home} .fm_best_widget img.thumb {
        left: auto !important; right: 0 !important; top: 0 !important;
        width: 52px !important; height: 44px !important; object-fit: cover; border-radius: 8px;
        background: var(--fm-clean-raised) !important;
      }
      ${home} .fm_best_widget span.thumb { display: none !important; }
      ${home} .fm_best_widget .title {
        margin: 0 0 2px !important; font-size: 13px !important; font-weight: 400 !important; line-height: 1.4 !important;
        display: block !important; -webkit-line-clamp: unset !important;
        height: auto !important; max-height: none !important; white-space: normal !important;
        overflow: visible !important; text-overflow: clip !important;
      }
      ${home} .fm_best_widget .title > a {
        display: inline !important; white-space: normal !important;
        overflow: visible !important; text-overflow: clip !important;
      }
      ${home} .fm_best_widget .title .ellipsis-target {
        display: inline !important; white-space: normal !important; overflow: visible !important;
        max-width: none !important; text-overflow: clip !important;
      }
      ${home} .fm_best_widget > ul > li.li > div.li > div {
        display: inline !important; font-size: 10.5px !important; line-height: 1.4 !important;
      }
      ${home} .fm_best_widget .category { margin-right: 5px; }
      ${home} .fm_best_widget .title::before { margin-left: 0 !important; }
      ${home} .fm_best_widget li.li_best2_politics1 .title::before {
        color: var(--fm-clean-muted) !important; background: var(--fm-clean-raised) !important;
        border: 1px solid var(--fm-clean-line) !important;
      }
      ${root} .bd_m_lst > li .rt_area h3 > a,
      ${root} .bd_m_lst > li .rt_area h3 > a :not(.comment_count),
      ${root} .bd_lst td.title a,
      ${root} .bd_lst td.title a :not(.comment_count),
      ${root} .fm_best_widget .title > a,
      ${root} .fm_best_widget .title > a :not(.comment_count) { font-weight: 400 !important; }
      ${root} .fm_best_widget .li_visited :is(.title, .title a, .title .ellipsis-target),
      ${root} .bd_m_lst > li .rt_area h3 > a.visited,
      ${root} .bd_m_lst > li .rt_area h3 > a.visited :not(.comment_count),
      ${root} .bd_lst td.title a.visited,
      ${root} .bd_lst td.title a.visited span:not(.comment_count) {
        color: var(--fm-clean-read) !important; font-weight: 400 !important;
      }
      ${root} .fm_best_widget .li_visited .comment_count,
      ${root} .fm_best_widget .title a:visited .comment_count,
      ${root} .bd_m_lst > li .rt_area h3 > a:is(.visited, :visited) .comment_count,
      ${root} .bd_lst td.title a:is(.visited, :visited) .comment_count {
        color: var(--fm-clean-read) !important; font-weight: 400 !important;
      }
      /* 하단 주소창이 접혀도 알림의 화면상 위치가 따라 움직이지 않게 합니다. */
      ${root} #fm_alert {
        --fm-alert-bottom: 12px;
        position: fixed !important; right: 12px !important; bottom: auto !important;
        top: calc(100vh - var(--fm-alert-bottom) - env(safe-area-max-inset-bottom, 0px)) !important;
        top: calc(100svh - var(--fm-alert-bottom) - env(safe-area-max-inset-bottom, 0px)) !important;
        transform: translateY(-100%) !important; max-width: calc(100vw - 24px) !important;
      }
      ${root}.document #fm_alert, ${root} .document #fm_alert { --fm-alert-bottom: 50px; }
      ${root} #fm_alert .fm_alert_wrap.best { width: min(280px, calc(100vw - 24px)) !important; }
      ${root} #fm_alert .best .fm_alert {
        padding: 10px 12px !important; border: 1px solid var(--fm-clean-line) !important;
        border-left: 2px solid var(--fm-clean-accent) !important; border-radius: 10px !important;
        background: var(--fm-clean-surface) !important; background-image: none !important;
        box-shadow: 0 4px 16px #0002 !important;
      }
      ${root} #fm_alert .best .msg {
        color: var(--fm-clean-text) !important; font-size: 13px !important; line-height: 1.45 !important;
      }
      ${root} #fm_alert .best .msg[data-fm-clean-alert="linked"] { font-size: 0 !important; line-height: 0 !important; }
      ${root} #fm_alert .best .msg [data-fm-clean-alert-hidden] { display: none !important; }
      ${root} #fm_alert .best .msg [data-fm-clean-alert-path]:not([data-fm-clean-alert-title]) { display: contents !important; }
      ${root} #fm_alert .best .msg [data-fm-clean-alert-title] {
        display: -webkit-box !important; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        overflow: hidden; white-space: normal !important; color: var(--fm-clean-text) !important;
        font: 500 13px/1.45 Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif !important;
        text-decoration: none !important; text-shadow: none !important;
      }
      ${root} #fm_alert .best .msg [data-fm-clean-alert-title] * { color: inherit !important; font: inherit !important; }
      ${root} .bd_faq_srch {
        background: var(--fm-clean-surface) !important; border-color: var(--fm-clean-line) !important;
        color: var(--fm-clean-text) !important;
      }
      ${root} .bd_faq_srch.m_srch {
        width: 100% !important; max-width: none !important; margin: 0 !important;
        padding: 12px !important; box-sizing: border-box !important; border: 0 !important;
        border-top: 1px solid var(--fm-clean-line) !important; border-radius: 0 !important;
      }
      ${root} .bd_faq_srch :is(.itx, .select, select, .srch_itx, .bd_btn) {
        background: var(--fm-clean-raised) !important; color: var(--fm-clean-text) !important;
        border: 1px solid var(--fm-clean-line) !important; border-radius: 10px !important;
        box-shadow: none !important;
      }
      ${root} .bd_faq_srch .bd_btn {
        background: var(--fm-clean-soft) !important; color: var(--fm-clean-accent) !important;
        border-radius: 999px !important;
      }
      ${root} #search_assist_wrapper,
      ${root} #search_assist_wrapper :is(.search_bar, .contents, .keyword_ranking, .recent_searches, .recommend_boards, .recommend_keywords) {
        background: var(--fm-clean-surface) !important; color: var(--fm-clean-text) !important;
        border-color: var(--fm-clean-line) !important;
      }
      ${root} #search_assist_wrapper :is(.title, .list, .item, .loading, .feature-disabled-footer) {
        background: var(--fm-clean-surface) !important; border-color: var(--fm-clean-line) !important;
      }
      ${root} #search_assist_wrapper :is(h2, a, button, span) { color: var(--fm-clean-text) !important; }
      ${root} #search_assist_wrapper .search_input {
        background: var(--fm-clean-raised) !important; color: var(--fm-clean-text) !important;
        border-color: var(--fm-clean-line) !important; border-radius: 10px !important;
      }
      ${root} #search_assist_wrapper .search_bar button {
        color: var(--fm-clean-accent) !important; background: var(--fm-clean-soft) !important;
        border-color: var(--fm-clean-line) !important; border-radius: 999px !important;
      }
      ${root} :is(.cmt_wrt, .simple_wrt, #re_cmt) {
        background: var(--fm-clean-surface) !important; color: var(--fm-clean-text) !important;
        border-color: var(--fm-clean-line) !important;
      }
      ${root} :is(.cmt_wrt, .simple_wrt, #re_cmt) :is(textarea, input[type="text"], input[type="search"]) {
        background: var(--fm-clean-raised) !important; color: var(--fm-clean-text) !important;
        border: 1px solid var(--fm-clean-line) !important; border-radius: 10px !important;
      }
      ${root} :is(.cmt_wrt, .simple_wrt, #re_cmt) .bd_btn {
        background: var(--fm-clean-soft) !important; color: var(--fm-clean-accent) !important;
        border: 1px solid var(--fm-clean-line) !important; border-radius: 999px !important;
        box-shadow: none !important; text-shadow: none !important;
      }
      ${root} :is(.fm_navi, .fm_navi2, .bd_pg) {
        background: var(--fm-clean-surface) !important; color: var(--fm-clean-text) !important;
        border-color: var(--fm-clean-line) !important;
      }
      ${root} body > footer .ft {
        background: var(--fm-clean-bg) !important; padding: 8px 12px !important;
      }
      ${root} body > footer :is(.cr, .crhome) {
        background: var(--fm-clean-bg) !important; color: var(--fm-clean-muted) !important;
        font-size: 12px !important;
      }
      ${root} body > footer .ft :is(li, a) {
        background: transparent !important; border: 0 !important;
        color: var(--fm-clean-muted) !important; text-shadow: none !important; font-weight: 400 !important;
        border-radius: 999px !important;
      }
      ${root} :is(.fm_navi, .fm_navi2, .bd_pg, .fdb_tag) :is(a, button, input) {
        background: transparent !important; color: var(--fm-clean-muted) !important;
        border-color: var(--fm-clean-line) !important; border-radius: 999px !important;
        box-shadow: none !important; text-shadow: none !important;
      }
      ${root} .bd_pg { border-top: 1px solid var(--fm-clean-line) !important; padding: 10px 8px !important; }
      ${root} .bd_pg :is(a, strong) {
        display: inline-flex !important; align-items: center; justify-content: center;
        min-width: 36px !important; min-height: 44px !important; height: auto !important;
        padding: 0 6px !important; box-sizing: border-box !important;
        line-height: 1.2 !important; vertical-align: middle;
      }
      ${root} .fm_navi table a {
        display: flex !important; align-items: center; justify-content: center;
        min-width: 36px !important; min-height: 44px !important;
        padding: 0 2px !important; box-sizing: border-box !important; line-height: 1.2 !important;
      }
      ${root} .fm_navi :is(.js_prev, .js_next) {
        top: 0 !important; min-width: 36px !important; min-height: 44px !important;
        padding: 0 8px !important; box-sizing: border-box !important;
        line-height: 42px !important; text-align: center;
      }
      ${root} .fm_navi2 :is(a.direction, button.move) {
        display: inline-flex !important; align-items: center; justify-content: center;
        min-height: 44px !important; box-sizing: border-box !important; line-height: 1.2 !important;
      }
      ${root} :is(.fm_navi, .bd_pg, .fdb_tag) :is(.this, .active, strong) {
        color: var(--fm-clean-accent) !important; background: var(--fm-clean-soft) !important;
        border-color: transparent !important; border-radius: 999px !important;
      }
      ${root} :is(.fm_navi, .fm_navi2, .bd_pg, .fdb_tag) :is(a:hover, a:focus-visible, button:hover) {
        color: var(--fm-clean-accent) !important; background: var(--fm-clean-soft) !important;
      }
      ${root} .fm_navi2 input[type="number"] {
        background: var(--fm-clean-raised) !important; color: var(--fm-clean-text) !important;
        border: 1px solid var(--fm-clean-line) !important; border-radius: 10px !important;
        width: 44px !important; min-height: 44px !important; height: 44px !important;
        box-sizing: border-box !important; line-height: normal !important; text-align: center !important;
      }
      ${root} :is(.cmt_wrt, .bd_srch) :is(textarea, input[type=text], input[type=search]) {
        background: var(--fm-clean-bg) !important; color: var(--fm-clean-text) !important;
        border: 1px solid var(--fm-clean-line) !important; border-radius: 10px !important;
      }
      ${root} :is(a, button, input, textarea, select):focus-visible {
        outline: 2px solid var(--fm-clean-accent) !important; outline-offset: 2px;
      }
    `;
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
    // 글 추천 버튼과, 본문 아래 도구 모음 및 댓글별 도구 모음은 각각 토글합니다.
    hideRule('votes', ['.rd .fm_vote .vote', '.rd .fm_vote .use_new_voted_count']),
    // 본문과 댓글 사이의 도구 모음 전체만 접습니다. 댓글 목록·페이지 이동·입력은 별도 영역입니다.
    hideRule('footer', ['.rd > .rd_ft', '.rd > .rd_ft_nav', '.rd .m_rd_nav_side', '.rd .rd_body > .document_address']),
    hideRule('header', ['.fm-recent-visited .footer', '.fm-recent-visited .item.feature-disabled', '.bd > nav.fmkorea_navi:has(~ .main_recent)']),
    hideRule('commentActions', ['.fdb_itm .fdb_nav > :not(.findComment)']),
    hideRule('siteFooter', ['body > footer .cr', 'body > footer .crhome', '#footer']),
    cleanAppearance(),
    `
      html[data-fm-clean-boot="true"] body { opacity: 0 !important; pointer-events: none !important; }
      /* 홈은 즐겨찾기를 CSS로, 최근 방문이 없으면 JS로 부모까지 숨깁니다. 실제 저장 링크가 있을 때만 복원합니다. */
      ${scope('header')} .main_recent .fm-recent-visited:has(.list.swiper-wrapper .item.bookmark a[href]) {
        display: block !important;
      }
      ${scope('header')} .main_recent .fm-recent-visited .list .item.bookmark { display: inline-flex !important; }
      [data-fm-clean-badge], [data-fm-clean-board] { display: none !important; }
      ${scope('count')} [data-fm-clean-title],
      ${scope('boardLabel')} [data-fm-clean-title] {
        display: flex !important; align-items: flex-start; gap: 6px;
        width: 100% !important; box-sizing: border-box; clear: both; overflow-wrap: anywhere;
      }
      ${scope('count')} [data-fm-clean-title] .np_18px_span,
      ${scope('boardLabel')} [data-fm-clean-title] .np_18px_span {
        flex: 1 1 auto; min-width: 0; width: auto !important;
        white-space: normal !important; overflow-wrap: anywhere;
      }
      ${scope('boardLabel')} [data-fm-clean-board] {
        display: inline-block !important; flex: 0 1 auto; align-self: flex-start;
        max-width: 40%; height: 22px; box-sizing: border-box; margin-top: 2px; padding: 0 8px;
        border: 0; border-radius: 999px; background: var(--fm-clean-soft, #fff0e7);
        color: var(--fm-clean-accent, #9a4e26) !important; text-decoration: none !important;
        overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
        font: 600 12px/22px Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif;
        letter-spacing: 0; text-indent: 0;
      }
      ${scope('count')} [data-fm-clean-badge] {
        display: inline-block !important; flex: 0 0 auto; align-self: flex-start;
        height: 22px; box-sizing: border-box; margin: 2px 0 0 auto; padding: 0 8px;
        border: 0; border-radius: 999px;
        color: var(--fm-clean-accent, #9a4e26); background: var(--fm-clean-soft, #fff0e7); white-space: nowrap;
        font: 600 12px/22px Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif;
        letter-spacing: 0; text-indent: 0;
      }
      ${scope('count')} [data-fm-clean-original-count] { display: none !important; }
      ${scope('commentComposer')} details[data-fm-clean-comment-composer] {
        margin: 8px 10px; border: 1px solid var(--fm-clean-line, #8885); border-radius: 10px;
        color: inherit; font: 500 13px/1.5 Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif;
      }
      ${scope('commentComposer')} details[data-fm-clean-comment-composer] > summary {
        display: flex; align-items: center; justify-content: space-between; list-style: none;
        min-height: 36px; padding: 7px 10px; box-sizing: border-box; cursor: pointer;
      }
      ${scope('commentComposer')} details[data-fm-clean-comment-composer] > summary::-webkit-details-marker { display: none; }
      ${scope('commentComposer')} details[data-fm-clean-comment-composer] > summary::after {
        content: ''; width: 6px; height: 6px; margin: 0 3px 3px 10px;
        border-right: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor; transform: rotate(45deg);
      }
      ${scope('commentComposer')} details[data-fm-clean-comment-composer][open] > summary::after { transform: rotate(225deg); }
      ${scope('commentComposer')} details[data-fm-clean-comment-composer] > summary:focus-visible {
        outline: 2px solid var(--fm-clean-accent, #9a4e26); outline-offset: 2px;
      }
      ${scope('commentComposer')} details[data-fm-clean-comment-composer] > .cmt_editor {
        margin: 0 !important; padding: 8px 10px !important;
      }
      #${HOST_ID} {
        all: initial !important; display: block !important; position: fixed !important;
        --fm-control-edge: max(100px, env(safe-area-inset-left, 0px));
        inset: 0 !important;
        z-index: 2147483647 !important; pointer-events: none !important;
      }
      #${HOST_ID}[data-side="right"] {
        --fm-control-edge: max(100px, env(safe-area-inset-right, 0px));
      }
    `
  ].join('\n');
  const styleText = style.textContent;

  const BRIGHT_IMAGE_SELECTOR = '.rd_body article .xe_content img:not(table.invertl img):not([style*="filter" i])';
  const brightImages = {
    sources: new WeakMap(), cache: new Map(), visible: new WeakSet(), tracked: new Set(),
    observer: null, listening: false
  };

  function brightImageModeActive() {
    return settings.enabled && settings.appearance && document.body?.classList.contains('night_mode') &&
      document.documentElement.getAttribute('data-fm-clean-mobile') === 'true';
  }

  function inspectBrightImage(url) {
    return new Promise(resolve => {
      // 원본 이미지의 CORS·로딩 속성은 바꾸지 않고 분석용 복사본만 읽습니다.
      const probe = new Image();
      const finish = value => {
        window.clearTimeout(timeout);
        probe.onload = probe.onerror = null;
        resolve(value);
      };
      const timeout = window.setTimeout(() => finish(false), 8000);
      probe.crossOrigin = 'anonymous';
      probe.decoding = 'async';
      probe.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 32;
          const context = canvas.getContext('2d', { willReadFrequently: true });
          if (!context) return finish(false);
          context.drawImage(probe, 0, 0, 32, 32);
          const pixels = context.getImageData(0, 0, 32, 32).data;
          let white = 0;
          for (let i = 0; i < pixels.length; i += 4) {
            const low = Math.min(pixels[i], pixels[i + 1], pixels[i + 2]);
            const high = Math.max(pixels[i], pixels[i + 1], pixels[i + 2]);
            if (pixels[i + 3] >= 230 && low >= 220 && high - low <= 30) white++;
          }
          finish(white / (32 * 32) >= .5);
        } catch (error) {
          // 픽셀 읽기를 허용하지 않는 외부 이미지는 원래 밝기를 유지합니다.
          finish(false);
        }
      };
      probe.onerror = () => finish(false);
      probe.src = url;
    });
  }

  function classifyBrightImage(image) {
    if (!brightImageModeActive() || !image.isConnected || !image.complete ||
        image.naturalWidth < 64 || image.naturalHeight < 64) return;
    const url = image.currentSrc || image.src;
    if (!url || brightImages.sources.get(image) === url) return;
    brightImages.sources.set(image, url);
    image.removeAttribute('data-fm-clean-bright-image');
    if (!brightImages.cache.has(url)) brightImages.cache.set(url, inspectBrightImage(url));
    brightImages.cache.get(url).then(bright => {
      if (image.isConnected && brightImages.sources.get(image) === url && (image.currentSrc || image.src) === url) {
        image.toggleAttribute('data-fm-clean-bright-image', bright);
      }
    });
  }

  function syncBrightImages() {
    if (!brightImageModeActive()) return;
    if (!brightImages.listening) {
      brightImages.listening = true;
      if (window.IntersectionObserver) {
        brightImages.observer = new IntersectionObserver(entries => {
          for (const { target, isIntersecting } of entries) {
            if (isIntersecting) {
              brightImages.visible.add(target);
              classifyBrightImage(target);
            } else brightImages.visible.delete(target);
          }
        }, { rootMargin: '600px 0px' });
      }
      document.addEventListener('load', event => {
        const image = event.target;
        if (image instanceof HTMLImageElement && image.matches(BRIGHT_IMAGE_SELECTOR) &&
            (!brightImages.observer || brightImages.visible.has(image))) classifyBrightImage(image);
      }, true);
    }
    for (const image of brightImages.tracked) {
      if (image.isConnected && image.matches(BRIGHT_IMAGE_SELECTOR)) continue;
      brightImages.observer?.unobserve(image);
      brightImages.tracked.delete(image);
      image.removeAttribute('data-fm-clean-bright-image');
    }
    document.querySelectorAll(BRIGHT_IMAGE_SELECTOR).forEach(image => {
      if (brightImages.sources.get(image) !== (image.currentSrc || image.src)) {
        brightImages.sources.delete(image);
        image.removeAttribute('data-fm-clean-bright-image');
      }
      if (!brightImages.tracked.has(image)) {
        brightImages.tracked.add(image);
        brightImages.observer?.observe(image);
      }
      if (!brightImages.observer || brightImages.visible.has(image)) classifyBrightImage(image);
    });
  }

  function syncCommentCounts() {
    const active = settings.enabled && settings.commentActions &&
      document.documentElement.getAttribute('data-fm-clean-mobile') === 'true';
    document.querySelectorAll('[data-fm-clean-comment-stats]').forEach(stats => {
      if (!active || !stats.closest('.fdb_itm')?.querySelector('.fdb_nav .vote')) stats.remove();
    });
    if (!active) return;
    document.querySelectorAll('.fdb_itm').forEach(item => {
      const meta = item.querySelector(':scope > .meta');
      const nav = item.querySelector(':scope > .fdb_nav');
      if (!meta || !nav?.querySelector('.vote')) return;
      let stats = meta.querySelector('[data-fm-clean-comment-stats]');
      if (!stats) {
        stats = document.createElement('span');
        stats.setAttribute('data-fm-clean-comment-stats', '');
        stats.setAttribute('role', 'group');
        stats.innerHTML = '<span data-stat="up" aria-hidden="true"></span> <span data-stat="down" aria-hidden="true"></span>';
        meta.appendChild(stats);
      }
      const up = readCount(nav.querySelector('.voted_count')) ?? '0';
      const down = readCount(nav.querySelector('.blamed_count')) ?? '0';
      const upLabel = `↑ ${up}`;
      const downLabel = `↓ ${down}`;
      const upText = stats.querySelector('[data-stat="up"]');
      const downText = stats.querySelector('[data-stat="down"]');
      if (upText.textContent !== upLabel) upText.textContent = upLabel;
      if (downText.textContent !== downLabel) downText.textContent = downLabel;
      const label = `추천 ${up}, 비추천 ${down}`;
      if (stats.getAttribute('aria-label') !== label) stats.setAttribute('aria-label', label);
    });
  }

  function syncCommentAuthors() {
    const active = settings.enabled && settings.appearance &&
      document.documentElement.getAttribute('data-fm-clean-mobile') === 'true';
    document.querySelectorAll('.fdb_itm').forEach(item => {
      const name = item.querySelector(':scope > .meta .member_plate');
      const author = active && name && item.querySelector(':scope > .comment-content.document_writer');
      const badge = item.querySelector('[data-fm-clean-author]');
      if (!author) { badge?.remove(); return; }
      if (badge) return;
      const label = document.createElement('span');
      label.setAttribute('data-fm-clean-author', '');
      label.textContent = '작성자';
      name.after(label);
    });
  }

  const readingState = {
    host: null, bar: null, title: null, progress: null, fill: null, percent: null,
    heading: null, end: null, frame: 0, resizeObserver: null, body: null
  };

  function scheduleReadingProgress() {
    if (!readingState.frame) readingState.frame = window.requestAnimationFrame(updateReadingProgress);
  }

  function updateReadingProgress() {
    readingState.frame = 0;
    const { bar, heading, progress, fill, percent } = readingState;
    if (!bar) return;
    const active = settings.enabled && settings.readingHeader && heading?.isConnected &&
      document.documentElement.getAttribute('data-fm-clean-mobile') === 'true';
    const wasHidden = bar.hidden;
    bar.hidden = !active || heading.getBoundingClientRect().bottom > 0;
    if (bar.hidden) {
      bar.removeAttribute('data-ready');
      return;
    }
    if (wasHidden) bar.removeAttribute('data-ready');
    // 댓글을 제외한 본문 끝이 화면 하단에 도달하면 100%입니다.
    const end = readingState.end?.isConnected ? readingState.end : heading;
    const endY = window.scrollY + end.getBoundingClientRect().bottom;
    const range = Math.max(0, endY - window.innerHeight);
    const value = range ? Math.round(Math.min(1, Math.max(0, window.scrollY / range)) * 1000) / 10 : 100;
    if (progress.value !== value) progress.value = value;
    const scale = `scaleX(${value / 100})`;
    if (fill.style.transform !== scale) fill.style.transform = scale;
    const label = `${Math.round(value)}%`;
    if (percent.textContent !== label) percent.textContent = label;
    if (wasHidden) window.requestAnimationFrame(() => {
      if (!bar.hidden) bar.setAttribute('data-ready', '');
    });
  }

  function syncReadingHeader() {
    const active = settings.enabled && settings.readingHeader && document.body &&
      document.documentElement.getAttribute('data-fm-clean-mobile') === 'true';
    const heading = active ? document.querySelector('.rd .rd_hd h1') : null;
    readingState.heading = heading;
    const article = heading?.closest('.rd');
    readingState.end = article?.querySelector('.rd_body article') || article?.querySelector('.rd_body') || heading;
    if (!heading) {
      if (readingState.bar) readingState.bar.hidden = true;
      return;
    }
    if (!readingState.host) {
      const host = document.createElement('div');
      host.id = 'fm-clean-reading-header';
      const shadow = host.attachShadow({ mode: 'open' });
      shadow.innerHTML = `
        <style>
          :host {
            all: initial !important; display: block !important; position: fixed !important;
            top: 0 !important; left: 0 !important; right: 0 !important;
            z-index: 2147483646 !important; pointer-events: none !important;
            --reader-surface: var(--fm-clean-surface, #fff);
            --reader-title: var(--fm-clean-title, #1c1b19);
            --reader-muted: var(--fm-clean-muted, #6b6862);
            --reader-line: var(--fm-clean-line, #e7e4de);
            --reader-accent: var(--fm-clean-accent, #9a4e26);
          }
          :host([data-night]) {
            --reader-surface: var(--fm-clean-surface, #1b1b1a);
            --reader-title: var(--fm-clean-title, #dad7d1);
            --reader-muted: var(--fm-clean-muted, #b0ada6);
            --reader-line: var(--fm-clean-line, #2f2e2b);
            --reader-accent: var(--fm-clean-accent, #f0b58f);
          }
          [hidden] { display: none !important; }
          .bar { background: var(--reader-surface); border-bottom: 1px solid var(--reader-line); }
          .row {
            display: flex; align-items: center; gap: 12px; padding: 9px 12px 8px;
            padding-top: calc(9px + env(safe-area-inset-top, 0px));
            font-family: Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif;
          }
          .title {
            flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            pointer-events: auto; cursor: pointer; touch-action: manipulation; text-align: left;
            border: 0; padding: 0; background: transparent; font-family: inherit;
            color: var(--reader-title); font-size: 12px; font-weight: 600; line-height: 1.5;
          }
          .title:focus-visible { outline: 2px solid var(--reader-accent); outline-offset: 2px; }
          .percent { flex: none; color: var(--reader-muted); font-size: 10px; font-variant-numeric: tabular-nums; }
          progress {
            position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; border: 0;
            overflow: hidden; clip: rect(0, 0, 0, 0); clip-path: inset(50%);
          }
          .track { height: 3px; overflow: hidden; background: var(--reader-line); }
          .fill {
            display: block; width: 100%; height: 100%; background: var(--reader-accent);
            transform: scaleX(0); transform-origin: left center;
            transition: transform 200ms cubic-bezier(.22, .61, .36, 1);
          }
          .bar:not([data-ready]) .fill { transition: none; }
          @media (prefers-reduced-motion: reduce) { .fill { transition: none; } }
        </style>
        <div class="bar" hidden>
          <div class="row"><button class="title" type="button"></button><span class="percent" aria-hidden="true">0%</span></div>
          <progress max="100" value="0" aria-label="본문 끝까지의 스크롤 진행률"></progress>
          <div class="track" aria-hidden="true"><span class="fill"></span></div>
        </div>
      `;
      readingState.host = host;
      readingState.bar = shadow.querySelector('.bar');
      readingState.title = shadow.querySelector('.title');
      readingState.progress = shadow.querySelector('progress');
      readingState.fill = shadow.querySelector('.fill');
      readingState.percent = shadow.querySelector('.percent');
      readingState.title.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      });
      window.addEventListener('scroll', scheduleReadingProgress, { passive: true });
      window.addEventListener('resize', scheduleReadingProgress, { passive: true });
      if (window.ResizeObserver) readingState.resizeObserver = new ResizeObserver(scheduleReadingProgress);
    }
    if (!readingState.host.isConnected) document.body.appendChild(readingState.host);
    readingState.host.toggleAttribute('data-night', document.body.classList.contains('night_mode'));
    const original = heading.querySelector('.np_18px_span');
    const text = (original ? original.textContent : Array.from(heading.childNodes)
      .filter(node => !(node instanceof Element && node.matches('[data-fm-clean-board], [data-fm-clean-badge]')))
      .map(node => node.textContent).join('')).replace(/\s+/g, ' ').trim();
    if (!text) {
      readingState.heading = null;
      readingState.bar.hidden = true;
      return;
    }
    if (readingState.title.textContent !== text) {
      readingState.title.textContent = text;
      readingState.title.title = `${text} · 맨 위로 이동`;
      readingState.title.setAttribute('aria-label', `${text} · 맨 위로 이동`);
    }
    if (readingState.body !== document.body) {
      readingState.resizeObserver?.disconnect();
      readingState.resizeObserver?.observe(document.body);
      readingState.body = document.body;
    }
    scheduleReadingProgress();
  }

  function mountLauncherNavigation() {
    const dragSlop = 16;
    let gesture = null;
    let clickUntil = 0;
    let suppressNextClick = false;
    const active = () => settings.enabled &&
      document.documentElement.getAttribute('data-fm-clean-mobile') === 'true';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const direction = (dx, dy) => {
      const inwardX = settings.launcherRight ? -dx : dx;
      if (-inwardX >= 20 && -inwardX > Math.abs(dy) * 1.2) return 'reload';
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 32) return null;
      if (Math.abs(dy) > Math.abs(dx) * 1.2) return dy < 0 ? 'top' : 'bottom';
      return inwardX > Math.abs(dy) * 1.2 ? 'comments' : null;
    };
    const reset = () => {
      const pointer = gesture?.id;
      gesture = null;
      launcher.removeAttribute('data-dragging');
      launcher.removeAttribute('data-ready');
      launcher.style.removeProperty('transform');
      if (pointer !== undefined && launcher.hasPointerCapture(pointer)) launcher.releasePointerCapture(pointer);
    };
    const suppressClick = () => {
      clickUntil = performance.now() + 500;
      suppressNextClick = true;
      window.clearTimeout(launcherClickTimer);
      launcherClickTimer = null;
    };
    const navigate = destination => {
      if (!active()) return;
      if (destination === 'reload') { window.location.reload(); return; }
      let top = 0;
      if (destination === 'bottom') top = document.scrollingElement.scrollHeight;
      else if (destination === 'comments') {
        const article = document.querySelector('.rd:has(.rd_hd h1)');
        if (!article) return;
        const board = article.closest('.bd') || document;
        const comments = board.querySelector('.fdb_lst_wrp') || board.querySelector('#comment, .fdb_lst, .cmt_editor');
        if (!comments) return;
        const headerHeight = readingState.bar && !readingState.bar.hidden ? readingState.bar.getBoundingClientRect().height : 0;
        top = window.scrollY + comments.getBoundingClientRect().top - Math.max(56, headerHeight + 8);
      }
      window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    };
    launcher.addEventListener('pointerdown', event => {
      if (gesture || !event.isPrimary || event.button !== 0) { reset(); return; }
      if (!active() || !panel.hidden) return;
      suppressNextClick = false;
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, dragged: false };
      launcher.setPointerCapture(event.pointerId);
    });
    launcher.addEventListener('pointermove', event => {
      if (gesture?.id !== event.pointerId) return;
      if (!active()) { reset(); return; }
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      if (Math.hypot(dx, dy) >= dragSlop) gesture.dragged = true;
      if (!gesture.dragged) return;
      suppressClick();
      launcher.setAttribute('data-dragging', '');
      const destination = direction(dx, dy);
      launcher.toggleAttribute('data-ready', Boolean(destination &&
        (destination !== 'comments' || document.querySelector('.rd .rd_hd h1'))));
      if (!reducedMotion.matches) {
        const moveX = Math.max(-40, Math.min(40, dx * .45));
        launcher.style.transform = `translate3d(${moveX}px, ${Math.max(-40, Math.min(40, dy * .45))}px, 0)`;
      }
    });
    launcher.addEventListener('pointerup', event => {
      if (gesture?.id !== event.pointerId) return;
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      const dragged = gesture.dragged || Math.hypot(dx, dy) >= dragSlop;
      const destination = dragged ? direction(dx, dy) : null;
      if (dragged) suppressClick();
      reset();
      if (destination) navigate(destination);
    });
    launcher.addEventListener('pointercancel', event => {
      if (gesture?.id !== event.pointerId) return;
      if (gesture.dragged) suppressClick();
      reset();
    });
    launcher.addEventListener('lostpointercapture', event => {
      if (gesture?.id !== event.pointerId || launcher.hasPointerCapture(event.pointerId)) return;
      if (gesture.dragged) suppressClick();
      reset();
    });
    launcher.addEventListener('click', event => {
      if (!event.detail || !suppressNextClick || performance.now() >= clickUntil) return;
      suppressNextClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
    launcher.addEventListener('keydown', event => { if (event.key === 'Escape') reset(); });
    window.addEventListener('pagehide', reset);
    let viewportWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      if (window.innerWidth !== viewportWidth) { viewportWidth = window.innerWidth; reset(); }
    }, { passive: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
  }

  const swipeBackState = { host: null, reset: null };

  function syncSwipeBack() {
    const enabled = () => settings.enabled && settings.swipeBack && document.body &&
      document.documentElement.getAttribute('data-fm-clean-mobile') === 'true';
    if (!enabled()) {
      swipeBackState.reset?.();
      return;
    }
    if (swipeBackState.host) {
      if (!swipeBackState.host.isConnected) document.body.appendChild(swipeBackState.host);
      swipeBackState.host.toggleAttribute('data-night', document.body.classList.contains('night_mode'));
      return;
    }
    const host = document.createElement('div');
    host.id = 'fm-clean-swipe-back';
    host.setAttribute('aria-hidden', 'true');
    host.toggleAttribute('data-night', document.body.classList.contains('night_mode'));
    const shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host {
          all: initial !important; position: fixed !important; inset: 0 !important;
          z-index: 2147483645 !important; pointer-events: none !important;
          --swipe-surface: var(--fm-clean-surface, #fff);
          --swipe-line: var(--fm-clean-line, #e7e4de);
          --swipe-accent: var(--fm-clean-accent, #9a4e26);
          --swipe-soft: var(--fm-clean-soft, #fff0e7);
        }
        :host([data-night]) {
          --swipe-surface: var(--fm-clean-surface, #1b1b1a);
          --swipe-line: var(--fm-clean-line, #2f2e2b);
          --swipe-accent: var(--fm-clean-accent, #f0b58f);
          --swipe-soft: var(--fm-clean-soft, #3b2a23);
        }
        .cue {
          position: absolute; left: 12px; top: 50%; width: 44px; height: 44px;
          display: grid; place-items: center; box-sizing: border-box; border-radius: 50%;
          border: 1px solid var(--swipe-line); background: var(--swipe-surface);
          color: var(--swipe-accent); box-shadow: 0 4px 16px #0002;
          opacity: 0; transform: translate3d(-64px, 0, 0) scale(.9);
        }
        .cue[data-ready] { background: var(--swipe-soft); border-color: var(--swipe-accent); }
        @media (prefers-reduced-motion: reduce) { .cue { transition: none !important; } }
      </style>
      <div class="cue"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 5-7 7 7 7M5 12h14"/></svg></div>
    `;
    const cue = shadow.querySelector('.cue');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let gesture = null;
    let frame = 0;
    let backTimer = 0;
    let clickUntil = 0;
    let clickTarget = null;
    const reset = () => {
      window.clearTimeout(backTimer);
      window.cancelAnimationFrame(frame);
      backTimer = 0; frame = 0; gesture = null; clickTarget = null; clickUntil = 0;
      cue.style.transition = 'none';
      cue.style.opacity = '0';
      cue.style.transform = 'translate3d(-64px, 0, 0) scale(.9)';
      cue.removeAttribute('data-ready');
    };
    const paint = () => {
      frame = 0;
      if (!gesture?.claimed) return;
      const ratio = Math.min(1, Math.max(0, gesture.dx / gesture.threshold));
      cue.style.opacity = String(Math.min(1, Math.max(0, gesture.dx / 32)));
      cue.style.transform = reducedMotion.matches ? 'none' :
        `translate3d(${-64 + Math.min(100, Math.max(0, gesture.dx) * .65)}px, 0, 0) scale(${.9 + ratio * .1})`;
      cue.toggleAttribute('data-ready', ratio === 1);
    };
    const settle = commit => {
      const claimed = gesture?.claimed;
      const target = gesture?.target;
      window.cancelAnimationFrame(frame);
      frame = 0; gesture = null;
      if (!claimed) return;
      clickUntil = performance.now() + 450;
      clickTarget = target;
      cue.style.transition = 'transform 180ms cubic-bezier(.22,.61,.36,1), opacity 180ms ease-out';
      cue.style.transform = reducedMotion.matches ? 'none' :
        `translate3d(${commit ? 62 : -64}px, 0, 0) scale(${commit ? 1.04 : .9})`;
      cue.style.opacity = '0';
      if (commit) backTimer = window.setTimeout(() => {
        if (enabled() && history.length > 1) history.back();
        // 동일 문서의 history 항목이나 이동이 취소된 경우에도 다시 사용할 수 있습니다.
        backTimer = window.setTimeout(reset, 700);
      }, reducedMotion.matches ? 0 : 150);
    };
    const ignoredTarget = event => event.composedPath().some(element => {
      if (!(element instanceof Element)) return false;
      if (element.matches(`#${HOST_ID}, #fm-clean-reading-header, nav, #gnb, .fm-recent-visited,
        input, textarea, select, button, summary, video, audio, iframe, canvas,
        [contenteditable]:not([contenteditable="false"]), [role="slider"], a[download],
        .swiper, .swiper-container, .swiper-wrapper, .slick-slider, [data-fm-clean-swipe-ignore]`)) return true;
      return element !== document.body && element !== document.documentElement &&
        element.scrollWidth > element.clientWidth + 4 && /auto|scroll/.test(getComputedStyle(element).overflowX) &&
        (element.scrollLeft > 2 || getComputedStyle(element).direction === 'rtl');
    });
    document.addEventListener('touchstart', event => {
      clickTarget = null;
      if (event.touches.length !== 1) { settle(false); return; }
      if (!enabled() || backTimer || history.length < 2 || document.hidden ||
        (panel && !panel.hidden) || document.querySelector('dialog[open], [aria-modal="true"]') ||
        window.getSelection()?.isCollapsed === false || ignoredTarget(event)) return;
      const touch = event.touches[0];
      // 가장자리 제스처는 브라우저에 맡기고 화면 가운데에서 시작한 동작만 처리합니다.
      if (touch.clientX < 32 || touch.clientX > window.innerWidth - 48 ||
        touch.clientY < 48 || touch.clientY > window.innerHeight - 40) return;
      gesture = { id: touch.identifier, x: touch.clientX, y: touch.clientY,
        target: event.target.closest?.('a') || event.target,
        scrollY: window.scrollY, start: performance.now(), dx: 0, dy: 0, claimed: false,
        threshold: Math.min(88, Math.max(64, window.innerWidth * .2), window.innerWidth - touch.clientX - 12) };
    }, { passive: true, capture: true });
    document.addEventListener('touchmove', event => {
      if (!gesture) return;
      const touch = Array.from(event.touches).find(item => item.identifier === gesture.id);
      if (!enabled() || event.touches.length !== 1 || !touch) { settle(false); return; }
      gesture.dx = touch.clientX - gesture.x;
      gesture.dy = touch.clientY - gesture.y;
      const dx = gesture.dx;
      const dy = Math.abs(gesture.dy);
      if (!event.cancelable) {
        if (gesture.claimed || Math.abs(window.scrollY - gesture.scrollY) > 12) settle(false);
        return;
      }
      if (!gesture.claimed) {
        if (Math.max(Math.abs(dx), dy) < 10) return;
        // 작은 대각선 흔들림은 기다리고, 가로 방향이 분명해지면 제스처를 잡습니다.
        if (dx < -10 || dy > Math.max(18, Math.abs(dx) * 1.25) ||
          Math.abs(window.scrollY - gesture.scrollY) > 12) { settle(false); return; }
        if (dx < 10 || dx < dy * 1.25) return;
        gesture.claimed = true;
        cue.style.transition = 'none';
        cue.style.top = `${Math.max(60, Math.min(window.innerHeight - 84, gesture.y - 22))}px`;
      }
      if (dx < -8 || dy > Math.max(36, Math.abs(dx) * .85)) { settle(false); return; }
      event.preventDefault();
      if (!frame) frame = window.requestAnimationFrame(paint);
    }, { passive: false, capture: true });
    document.addEventListener('touchend', event => {
      if (!gesture) return;
      const touch = Array.from(event.changedTouches).find(item => item.identifier === gesture.id);
      if (!touch) return;
      gesture.dx = touch.clientX - gesture.x;
      gesture.dy = touch.clientY - gesture.y;
      const duration = Math.max(1, performance.now() - gesture.start);
      const distance = gesture.dx >= gesture.threshold || (gesture.dx >= 44 && gesture.dx / duration >= .5);
      const commit = enabled() && gesture.claimed && distance &&
        Math.abs(gesture.dy) <= gesture.dx * .8 && duration < 4000;
      if (gesture.claimed && event.cancelable) event.preventDefault();
      settle(commit);
    }, { passive: false, capture: true });
    document.addEventListener('touchcancel', () => settle(false), { passive: true, capture: true });
    document.addEventListener('click', event => {
      if (event.detail && clickTarget && performance.now() < clickUntil && event.composedPath().includes(clickTarget)) {
        clickTarget = null;
        event.preventDefault(); event.stopImmediatePropagation();
      }
    }, true);
    window.addEventListener('pageshow', reset);
    window.addEventListener('pagehide', reset);
    window.addEventListener('popstate', reset);
    let viewportWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      // Safari 주소창이 접히는 높이 변화로 진행 중인 스와이프를 취소하지 않습니다.
      if (window.innerWidth !== viewportWidth) { viewportWidth = window.innerWidth; reset(); }
    }, { passive: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
    swipeBackState.host = host;
    swipeBackState.reset = reset;
    document.body.appendChild(host);
  }

  function savedMenuLinks() {
    const seen = new Set();
    const links = [];
    document.querySelectorAll('.fm-recent-visited .list .item.bookmark > a[href]').forEach(link => {
      const text = link.textContent.replace(/\s+/g, ' ').trim();
      if (!text) return;
      try {
        const url = new URL(link.getAttribute('href'), location.href);
        if (!/^https?:$/.test(url.protocol) ||
          !(url.hostname === location.hostname || /(^|\.)fmkorea\.com$/i.test(url.hostname))) return;
        const key = url.pathname + url.search;
        if (seen.has(key)) return;
        seen.add(key);
        links.push({ text, href: url.href });
      } catch (error) { /* 유효한 저장 메뉴만 표시합니다. */ }
    });
    return links;
  }

  function compactDetailLink() {
    const article = document.querySelector('.rd:has(.rd_hd h1)');
    if (!article) return null;
    let id = article.getAttribute('data-docsrl')?.trim();
    if (!/^\d+$/.test(id || '')) {
      const content = article.querySelector('.rd_body article .xe_content');
      id = Array.from(content?.classList || []).map(name => name.match(/^document_(\d+)_/))
        .find(Boolean)?.[1];
    }
    if (!id) {
      const sources = [
        article.querySelector('.document_address a[href]')?.getAttribute('href'),
        article.querySelector('.document_address [data-clipboard-text]')?.getAttribute('data-clipboard-text'),
        document.querySelector('link[rel="canonical"]')?.href,
        document.querySelector('meta[property="og:url"]')?.content,
        location.href
      ];
      for (const source of sources) {
        if (!source) continue;
        try {
          const url = new URL(source, location.href);
          if (!/^https?:$/.test(url.protocol) ||
            !(url.hostname === location.hostname || /(^|\.)fmkorea\.com$/i.test(url.hostname))) continue;
          const queryId = url.searchParams.get('document_srl');
          id = /^\d+$/.test(queryId || '') ? queryId : url.pathname.split('/').find(part => /^\d+$/.test(part));
          if (id) break;
        } catch (error) { /* 다음 상세 주소를 확인합니다. */ }
      }
    }
    return id ? `https://www.fmkorea.com/${id}` : null;
  }

  function menuBoardKey(href) {
    if (!href) return null;
    try {
      const url = new URL(href, location.href);
      if (!/^https?:$/.test(url.protocol) ||
        !(url.hostname === location.hostname || /(^|\.)fmkorea\.com$/i.test(url.hostname))) return null;
      const key = url.searchParams.get('mid') || url.pathname.split('/').filter(Boolean)[0] || 'home';
      return /^[A-Za-z_][A-Za-z0-9_-]*$/.test(key) ? key.toLowerCase() : null;
    } catch (error) { return null; }
  }

  function currentMenuBoard() {
    const page = menuBoardKey(location.href);
    const article = document.querySelector('.rd:has(.rd_hd h1)');
    if (page === 'home' && !article) return null;
    if (article) {
      const board = article.closest('.bd');
      const headingLink = board?.querySelector(':scope > .tl_srch .bd_tl h1 a[href]');
      const fromHeading = menuBoardKey(headingLink?.getAttribute('href'));
      if (fromHeading && fromHeading !== 'home') return fromHeading;
      for (const menu of document.querySelectorAll('nav.fmkorea_navi, #gnb')) {
        const link = menu.querySelector(
          'li.on > a, li.active > a, a.on, a.active, a[aria-current]:not([aria-current="false"]), [aria-current]:not([aria-current="false"]) > a'
        );
        const fromMenu = menuBoardKey(link?.getAttribute('href'));
        if (fromMenu && fromMenu !== 'home') return fromMenu;
      }
    }
    return page === 'home' ? null : page;
  }

  function syncMenuPanel() {
    if (!panel) return;
    const list = panel.querySelector('[data-saved-menus]');
    const links = savedMenuLinks();
    const signature = JSON.stringify(links);
    if (list.getAttribute('data-menu-signature') !== signature) {
      const items = links.map(({ text, href }) => {
        const link = document.createElement('a');
        link.textContent = text;
        link.href = href;
        return link;
      });
      list.replaceChildren(...items);
      list.setAttribute('data-menu-signature', signature);
    }
    const current = currentMenuBoard();
    list.querySelectorAll('a').forEach(link => {
      if (current && menuBoardKey(link.href) === current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    panel.querySelector('[data-menu-empty]').hidden = links.length > 0;
    const url = compactDetailLink();
    panel.querySelector('.copy-area').hidden = !url;
    panel.querySelector('[data-copy-url]').textContent = url || '';
  }

  async function copyDetailLink() {
    const url = compactDetailLink();
    if (!url) return;
    const status = panel.querySelector('[data-copy-status]');
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        copied = true;
      }
    } catch (error) { /* 클립보드 API가 막히면 브라우저의 복사 명령을 사용합니다. */ }
    if (!copied) {
      const input = document.createElement('textarea');
      input.value = url;
      input.readOnly = true;
      input.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px';
      const focused = host.shadowRoot.activeElement || document.activeElement;
      const selection = window.getSelection();
      const ranges = Array.from({ length: selection?.rangeCount || 0 }, (_, index) => selection.getRangeAt(index).cloneRange());
      try {
        document.body.appendChild(input);
        input.focus({ preventScroll: true });
        input.select();
        input.setSelectionRange(0, url.length);
        copied = document.execCommand('copy');
      } catch (error) { /* 실패 여부는 패널 안에서 안내합니다. */ }
      finally {
        input.remove();
        if (focused?.isConnected) focused.focus({ preventScroll: true });
        if (selection && ranges.length) {
          selection.removeAllRanges();
          ranges.filter(range => range.commonAncestorContainer.isConnected).forEach(range => selection.addRange(range));
        }
      }
    }
    status.textContent = copied ? '링크를 복사했습니다.' : '복사하지 못했습니다. 아래 주소를 길게 눌러 복사해 주세요.';
  }

  function applySettings() {
    for (const [key, value] of Object.entries(settings)) {
      document.documentElement.setAttribute(`data-fm-clean-${key}`, String(value));
    }
    document.querySelectorAll('.rd .rd_hd h1').forEach(syncDetailTitle);
    syncReadingHeader();
    syncBrightImages();
    syncCommentCounts();
    syncCommentAuthors();
    syncSwipeBack();
    if (!launcher) return;
    launcher.toggleAttribute('data-off', !settings.enabled);
    host.setAttribute('data-side', settings.launcherRight ? 'right' : 'left');
    host.toggleAttribute('data-night', Boolean(document.body?.classList.contains('night_mode')));
    launcher.title = `${settings.enabled ? '' : '화면 정리 꺼짐 · '}한 번 누르면 FM코리아 메인, 두 번 누르면 저장 메뉴 · 위/아래로 끌면 맨 위/아래, 상세에서 ${settings.launcherRight ? '왼쪽' : '오른쪽'}으로 끌면 댓글 · ${settings.launcherRight ? '오른쪽' : '왼쪽'}으로 밀면 새로고침`;
    launcher.setAttribute('aria-label', launcher.title);
    for (const input of panel.querySelectorAll('input')) input.checked = settings[input.name];
    if (!panel.hidden) syncMenuPanel();
  }

  function setPanelOpen(open) {
    if (open) {
      syncMenuPanel();
      panel.querySelector('[data-copy-status]').textContent = '';
    }
    panel.hidden = !open;
    backdrop.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) panel.focus({ preventScroll: true });
    else launcher.focus({ preventScroll: true });
  }

  function handleLauncherClick() {
    if (launcherClickTimer !== null) {
      window.clearTimeout(launcherClickTimer);
      launcherClickTimer = null;
      setPanelOpen(panel.hidden);
      return;
    }
    // 첫 탭에서 바로 이동하면 두 번째 탭을 받을 수 없어 잠깐 기다립니다.
    launcherClickTimer = window.setTimeout(() => {
      launcherClickTimer = null;
      window.location.assign(MAIN_URL);
    }, DOUBLE_TAP_MS);
  }

  function mountControls() {
    if (!document.body) return;
    if (host) {
      if (!host.isConnected) document.body.appendChild(host);
      return;
    }
    host = document.createElement('div');
    host.id = HOST_ID;
    host.setAttribute('data-fm-clean-version', SCRIPT_VERSION);
    const shadow = host.attachShadow({ mode: 'open' });
    // Shadow DOM으로 사이트의 버튼/입력 스타일과 충돌하지 않게 합니다.
    shadow.innerHTML = `
      <style>
        :host {
          color-scheme: light;
          --fm-control-bg: var(--fm-clean-bg, #f6f5f2);
          --fm-control-surface: var(--fm-clean-surface, #fff);
          --fm-control-raised: var(--fm-clean-raised, #faf9f7);
          --fm-control-text: var(--fm-clean-text, #1c1b19);
          --fm-control-muted: var(--fm-clean-muted, #6b6862);
          --fm-control-line: var(--fm-clean-line, #e7e4de);
          --fm-control-accent: var(--fm-clean-accent, #9a4e26);
          --fm-control-soft: var(--fm-clean-soft, #fff0e7);
        }
        :host([data-night]) {
          color-scheme: dark;
          --fm-control-bg: var(--fm-clean-bg, #121211);
          --fm-control-surface: var(--fm-clean-surface, #1b1b1a);
          --fm-control-raised: var(--fm-clean-raised, #232321);
          --fm-control-text: var(--fm-clean-text, #f0efeb);
          --fm-control-muted: var(--fm-clean-muted, #b0ada6);
          --fm-control-line: var(--fm-clean-line, #2f2e2b);
          --fm-control-accent: var(--fm-clean-accent, #f0b58f);
          --fm-control-soft: var(--fm-clean-soft, #3b2a23);
        }
        * { box-sizing: border-box; }
        button, a { font: inherit; touch-action: manipulation; }
        button { cursor: pointer; }
        .backdrop {
          position: absolute; inset: 0; z-index: 0; pointer-events: auto; touch-action: none;
        }
        .control-anchor {
          position: absolute; left: var(--fm-control-edge, 100px); z-index: 1; pointer-events: none;
          /* svh와 정적 안전 영역으로 주소창 변화에 따른 좌표 이동을 막습니다. */
          top: calc(100vh - 200px - env(safe-area-max-inset-bottom, 0px));
          top: calc(100svh - 200px - env(safe-area-max-inset-bottom, 0px));
          transform: translateY(-100%);
        }
        :host([data-side="right"]) .control-anchor { left: auto; right: var(--fm-control-edge, 100px); }
        .launcher {
          pointer-events: auto;
          display: grid; place-items: center; width: 44px; min-width: 44px; height: 44px; padding: 0;
          border: 1px solid var(--fm-control-line); border-radius: 999px;
          background: var(--fm-control-surface); color: var(--fm-control-accent);
          box-shadow: 0 4px 16px #0003; opacity: .7; touch-action: none;
          user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent;
          transition: transform 180ms ease-out, opacity 120ms, background 120ms;
        }
        .launcher[data-dragging] { opacity: .92; transition: opacity 120ms, background 120ms; }
        .launcher[data-ready] { background: var(--fm-control-soft); border-color: var(--fm-control-accent); }
        .launcher:focus-visible { opacity: .92; }
        @media (prefers-reduced-motion: reduce) { .launcher { transition: none; } }
        :host([data-side="right"]) .launcher { margin-left: auto; }
        .launcher svg { display: block; width: 20px; height: 20px; }
        .launcher[data-off] {
          background: var(--fm-control-raised); color: var(--fm-control-muted);
          border-color: var(--fm-control-line);
        }
        button:focus-visible, a:focus-visible {
          outline: 2px solid var(--fm-control-accent); outline-offset: 2px;
        }
        .panel {
          position: relative; width: 256px; margin-bottom: 8px; pointer-events: auto;
          max-width: calc(100vw - var(--fm-control-edge, 100px) - 12px); max-height: calc(100svh - 284px - env(safe-area-max-inset-bottom, 0px));
          overflow-y: auto; padding: 13px; border: 1px solid var(--fm-control-line);
          border-radius: 14px; background: var(--fm-control-surface); color: var(--fm-control-text);
          box-shadow: 0 12px 36px #0004;
          font: 13px/1.5 Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif;
        }
        [hidden] { display: none !important; }
        .panel:focus { outline: none; }
        header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px; }
        strong { font-size: 13px; }
        .close {
          width: 34px; height: 34px; padding: 0; border: 0; border-radius: 999px;
          background: transparent; color: var(--fm-control-muted); font-size: 20px;
        }
        .close:hover { background: var(--fm-control-soft); color: var(--fm-control-accent); }
        [data-saved-menus] { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
        [data-saved-menus] a {
          display: flex; align-items: center; min-height: 36px; padding: 7px 10px;
          border: 1px solid transparent; border-radius: 10px;
          background: var(--fm-control-raised); color: var(--fm-control-text);
          text-decoration: none; overflow-wrap: anywhere; font-size: 12px; font-weight: 500;
        }
        [data-saved-menus] a:hover {
          background: var(--fm-control-soft); color: var(--fm-control-accent);
        }
        [data-saved-menus] a[aria-current="page"] {
          border-color: var(--fm-control-accent); background: var(--fm-control-soft); color: var(--fm-control-accent);
        }
        [data-saved-menus] a:focus-visible {
          outline: none;
        }
        .position-control {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
          margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--fm-control-line);
          color: var(--fm-control-muted); font-size: 11px;
        }
        .position-toggle { display: flex; align-items: center; gap: 6px; min-height: 32px; cursor: pointer; }
        .position-toggle input {
          appearance: none; -webkit-appearance: none; position: relative; flex: none;
          width: 34px; height: 20px; margin: 0; border: 1px solid var(--fm-control-line); border-radius: 999px;
          background: var(--fm-control-raised); cursor: pointer; accent-color: var(--fm-control-accent);
        }
        .position-toggle input::before {
          content: ''; position: absolute; top: 3px; left: 3px; width: 12px; height: 12px; border-radius: 50%;
          background: var(--fm-control-muted); transition: transform 140ms ease-out;
        }
        .position-toggle input:checked { background: var(--fm-control-soft); border-color: var(--fm-control-accent); }
        .position-toggle input:checked::before { transform: translateX(14px); background: var(--fm-control-accent); }
        .position-toggle .left { color: var(--fm-control-accent); }
        .position-toggle:has(input:checked) .left { color: var(--fm-control-muted); }
        .position-toggle:has(input:checked) .right { color: var(--fm-control-accent); }
        .position-toggle input:focus-visible { outline: 2px solid var(--fm-control-accent); outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) { .position-toggle input::before { transition: none; } }
        .copy-area { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--fm-control-line); }
        .copy-link {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          width: 100%; min-height: 36px; padding: 8px 10px; border: 0; border-radius: 10px;
          background: var(--fm-control-soft); color: var(--fm-control-accent); font-size: 12px; font-weight: 600;
        }
        p { font-size: 11px; color: var(--fm-control-muted); margin: 8px 0 0; }
        [data-copy-status]:empty { display: none; }
        [data-copy-url] {
          display: block; margin-top: 7px; color: var(--fm-control-muted); font-size: 10px;
          overflow-wrap: anywhere; user-select: all; -webkit-user-select: all;
        }
      </style>
      <div class="backdrop" aria-hidden="true" hidden></div>
      <div class="control-anchor">
        <section class="panel" id="fm-clean-panel" aria-label="저장한 메뉴" tabindex="-1" hidden>
          <header><strong>저장한 메뉴</strong><button class="close" type="button" aria-label="메뉴 닫기">×</button></header>
          <nav data-saved-menus aria-label="내 게시판 메뉴"></nav>
          <p data-menu-empty hidden>저장한 메뉴가 없습니다.</p>
          <div class="copy-area" hidden>
            <button class="copy-link" type="button"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>링크 복사</button>
            <p data-copy-status role="status"></p><span data-copy-url></span>
          </div>
          <!-- 저장된 설정과 기존 DOM 연동은 유지하되 메뉴 화면에는 설정 UI를 노출하지 않습니다. -->
          <div hidden data-settings-compat>
            ${options.map(([key, label]) => `<label><input type="checkbox" name="${key}">${label}</label>`).join('')}
            <p data-save-status>설정이 자동 저장됩니다.</p>
          </div>
          <div class="position-control"><span>버튼 위치</span>
            <label class="position-toggle"><span class="left">왼쪽</span>
              <input type="checkbox" role="switch" name="launcherRight" aria-label="홈 버튼 오른쪽에 두기">
              <span class="right">오른쪽</span></label>
          </div>
        </section>
        <button class="launcher" type="button" aria-label="한 번 누르면 FM코리아 메인, 두 번 누르면 저장 메뉴" aria-expanded="false" aria-controls="fm-clean-panel">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/></svg>
        </button>
      </div>
    `;
    backdrop = shadow.querySelector('.backdrop');
    panel = shadow.querySelector('.panel');
    launcher = shadow.querySelector('.launcher');
    launcher.addEventListener('click', handleLauncherClick);
    mountLauncherNavigation();
    launcher.addEventListener('keydown', event => {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault();
      window.clearTimeout(launcherClickTimer);
      launcherClickTimer = null;
      setPanelOpen(true);
    });
    shadow.querySelector('.close').addEventListener('click', () => setPanelOpen(false));
    shadow.querySelector('.copy-link').addEventListener('click', copyDetailLink);
    // 패널 안의 터치는 사이트의 전역 메뉴·새로고침 처리로 전파하지 않습니다.
    for (const type of ['pointerdown', 'pointermove', 'pointerup', 'touchstart', 'touchmove', 'touchend', 'click', 'dblclick']) {
      shadow.addEventListener(type, event => event.stopPropagation(), { passive: true });
    }
    panel.addEventListener('change', event => {
      const input = event.target;
      if (!Object.prototype.hasOwnProperty.call(defaults, input.name)) return;
      settings[input.name] = input.checked;
      applySettings();
      saveSettings();
      refresh();
    });
    // 클릭이 끝날 때까지 배경을 유지해 닫기 터치가 뒤쪽 링크에 전달되지 않게 합니다.
    backdrop.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      setPanelOpen(false);
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

  function syncDetailTitle(title) {
    const active = settings.enabled && (
      (settings.boardLabel && title.querySelector('[data-fm-clean-board]')) ||
      (settings.count && title.querySelector('[data-fm-clean-badge]'))
    );
    title.toggleAttribute('data-fm-clean-title', Boolean(active));
  }

  function updateBoardLabels() {
    function fromLink(link) {
      const text = link?.textContent.replace(/\s+/g, ' ').trim();
      if (!text) return null;
      const href = link.getAttribute('href');
      try {
        if (href && /^https?:$/.test(new URL(href, location.href).protocol)) return { text, href };
      } catch (error) { /* URL이 없거나 잘못된 경우 게시판 이름만 표시합니다. */ }
      return { text, href: null };
    }

    document.querySelectorAll('.rd').forEach(article => {
      const board = article.closest('.bd');
      let identity = fromLink(board?.querySelector('.tl_srch .bd_tl h1 a'));
      if (!identity) {
        for (const menu of document.querySelectorAll('nav.fmkorea_navi, #gnb')) {
          identity = fromLink(menu.querySelector(
            'li.on > a, li.active > a, a.on, a.active, a[aria-current]:not([aria-current="false"]), [aria-current]:not([aria-current="false"]) > a'
          ));
          if (identity) break;
        }
      }
      if (!identity) {
        const parts = document.title.split(' - ').map(part => part.trim()).filter(Boolean);
        if (parts.length > 1 && /에펨코리아|fmkorea/i.test(parts[parts.length - 1])) {
          identity = { text: parts[parts.length - 2], href: null };
        }
      }

      article.querySelectorAll('.rd_hd h1').forEach(title => {
        let chip = title.querySelector('[data-fm-clean-board]');
        if (!identity) {
          chip?.remove();
          syncDetailTitle(title);
          return;
        }
        const tag = identity.href ? 'a' : 'span';
        if (!chip || chip.localName !== tag) {
          const replacement = document.createElement(tag);
          replacement.setAttribute('data-fm-clean-board', '');
          if (chip) chip.replaceWith(replacement);
          chip = replacement;
        }
        if (chip.textContent !== identity.text) chip.textContent = identity.text;
        if (identity.href && chip.getAttribute('href') !== identity.href) chip.setAttribute('href', identity.href);
        if (title.firstChild !== chip) title.insertBefore(chip, title.firstChild);
        syncDetailTitle(title);
      });
    });
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
        syncDetailTitle(title);
        metadata?.removeAttribute('data-fm-clean-original-count');
        return;
      }
      if (!badge) {
        badge = document.createElement('span');
        badge.setAttribute('data-fm-clean-badge', '');
        title.appendChild(badge);
      }
      const text = count;
      if (badge.textContent !== text) badge.textContent = text;
      badge.setAttribute('aria-label', `포텐수 ${count}`);
      syncDetailTitle(title);
      metadata?.setAttribute('data-fm-clean-original-count', '');
    });
  }

  const commentComposers = new Map();

  function updateCommentComposers(active) {
    for (const [editor, disclosure] of commentComposers) {
      if (active && editor.isConnected && disclosure.isConnected && editor.parentElement === disclosure) continue;
      // 원본 에디터를 그대로 되돌려 입력값·업로드·사이트 이벤트를 유지합니다.
      if (editor.parentElement === disclosure) disclosure.replaceWith(editor);
      else disclosure.remove();
      commentComposers.delete(editor);
    }
    if (!active || document.readyState === 'loading') return;
    document.querySelectorAll('.bd .cmt_editor').forEach(editor => {
      if (editor.closest('#re_cmt, [data-fm-clean-comment-composer], [data-fm-clean-ad-original]') ||
          editor.hidden || getComputedStyle(editor).display === 'none') return;
      const disclosure = document.createElement('details');
      disclosure.setAttribute('data-fm-clean-comment-composer', '');
      const summary = document.createElement('summary');
      summary.textContent = '댓글 쓰기';
      editor.before(disclosure);
      disclosure.append(summary, editor);
      commentComposers.set(editor, disclosure);
    });
  }

  const bestAlertOriginalText = new Map();

  function updateBestAlerts(active) {
    for (const [node, record] of bestAlertOriginalText) {
      if (!node.isConnected || !active) {
        if (node.isConnected && node.nodeValue === record.cleaned) node.nodeValue = record.original;
        bestAlertOriginalText.delete(node);
      } else if (node.nodeValue !== record.cleaned) bestAlertOriginalText.delete(node);
    }

    const messages = document.querySelectorAll('#fm_alert .fm_alert_wrap.best .fm_alert .msg');
    messages.forEach(message => {
      const elements = message.querySelectorAll('*');
      if (!active) {
        message.removeAttribute('data-fm-clean-alert');
        elements.forEach(element => {
          element.removeAttribute('data-fm-clean-alert-path');
          element.removeAttribute('data-fm-clean-alert-hidden');
          element.removeAttribute('data-fm-clean-alert-title');
        });
        return;
      }

      const links = Array.from(message.querySelectorAll('a[href]'));
      const label = /^\s*(?:\[\s*포텐\s*터짐\s*\]|【\s*포텐\s*터짐\s*】|포텐\s*터짐)\s*(?:[!！:：|·•\-–—]\s*)?/u;
      const titleLinks = links.filter(link => {
        const text = link.textContent.trim();
        return text && (text.replace(label, '').trim() || !label.test(text));
      });
      const documentLink = titleLinks.find(link => {
        try {
          const url = new URL(link.getAttribute('href'), location.href);
          return /^https?:$/.test(url.protocol) && (
            /(?:^|\/)\d+(?:\/|$)/.test(url.pathname) ||
            /^\d+$/.test(url.searchParams.get('document_srl') || '')
          );
        } catch (error) { return false; }
      });
      const title = documentLink || titleLinks[titleLinks.length - 1];

      elements.forEach(element => {
        element.removeAttribute('data-fm-clean-alert-path');
        element.removeAttribute('data-fm-clean-alert-hidden');
        element.removeAttribute('data-fm-clean-alert-title');
      });

      const stripLeadingLabel = root => {
        const text = root.textContent;
        const match = text.match(label);
        if (!match || !text.slice(match[0].length).trim()) return;
        let remaining = match[0].length;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node;
        while (remaining > 0 && (node = walker.nextNode())) {
          const current = node.nodeValue;
          const length = Math.min(remaining, current.length);
          if (!length) continue;
          const cleaned = current.slice(length);
          const previous = bestAlertOriginalText.get(node);
          const original = previous && previous.cleaned === current ? previous.original : current;
          bestAlertOriginalText.set(node, { original, cleaned });
          node.nodeValue = cleaned;
          remaining -= length;
        }
      };

      if (!title) {
        message.setAttribute('data-fm-clean-alert', 'plain');
        stripLeadingLabel(message);
        return;
      }

      message.setAttribute('data-fm-clean-alert', 'linked');
      const path = new Set();
      for (let node = title; node && node !== message; node = node.parentElement) path.add(node);
      title.querySelectorAll('*').forEach(node => path.add(node));
      elements.forEach(element => {
        element.setAttribute(path.has(element) ? 'data-fm-clean-alert-path' : 'data-fm-clean-alert-hidden', '');
      });
      title.setAttribute('data-fm-clean-alert-title', '');
      stripLeadingLabel(title);
    });
  }

  const observer = new MutationObserver(records => {
    // 같은 작업 안에서 링크가 삽입·교체·제거돼도 광고 클래스의 단서를 놓치지 않습니다.
    for (const record of records) {
      if (record.type === 'attributes' && record.target.matches('link[href], script[src]')) {
        rememberAdResource(record.target.getAttribute('href') || record.target.getAttribute('src'));
        if (['href', 'src'].includes(record.attributeName) && record.oldValue) rememberAdResource(record.oldValue);
      }
      for (const node of [...record.addedNodes, ...record.removedNodes]) {
        rememberAdNode(node);
      }
    }
    scheduleRefresh();
  });
  let booting = document.readyState === 'loading';

  function finishBoot() {
    booting = false;
    document.documentElement.removeAttribute('data-fm-clean-boot');
  }

  function refresh() {
    pending = false;
    observer.disconnect();
    if (style.textContent !== styleText) style.textContent = styleText;
    if (!style.isConnected) (document.head || document.documentElement).appendChild(style);
    const mobile = isMobileView();
    document.documentElement.setAttribute('data-fm-clean-mobile', String(mobile));
    if (booting && mobile && settings.enabled) document.documentElement.setAttribute('data-fm-clean-boot', 'true');
    else document.documentElement.removeAttribute('data-fm-clean-boot');
    applySettings();
    currentAdSelectors = discoverAdSelectors();
    const adTargets = collectAdTargets();
    const headerTargets = collectHeaderTargets(adTargets);
    syncHiddenElements('header', mobile && settings.enabled && settings.header, headerTargets);
    syncHiddenElements('ads', mobile && settings.enabled && settings.ads, adTargets);
    updateBestAlerts(mobile && settings.enabled && settings.appearance);
    updateCommentComposers(mobile && settings.enabled && settings.commentComposer);
    if (mobile) {
      mountControls();
      if (host) host.hidden = false;
      if (settings.enabled && settings.boardLabel) updateBoardLabels();
      if (settings.enabled && settings.count) updateDetailCounts();
    } else if (host) {
      // host의 display: block !important에 가려지지 않게 모바일이 아니면 제거합니다.
      host.remove();
      window.clearTimeout(launcherClickTimer);
      launcherClickTimer = null;
    }
    observer.observe(document.documentElement, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeOldValue: true,
      attributeFilter: ['class', 'id', 'src', 'href', 'style', 'rel', 'media', 'disabled', 'hidden']
    });
  }

  function scheduleRefresh() {
    if (pending) return;
    pending = true;
    // DOM 변경을 다음 화면이 그려지기 전에 정리해, 로딩 후 사라지는 깜빡임을 줄입니다.
    queueMicrotask(refresh);
  }

  function start() {
    booting = document.readyState === 'loading';
    // 초기 정리에 오류가 나거나 외부 스크립트가 늦어도 빈 화면에 머물지 않습니다.
    if (booting) window.setTimeout(finishBoot, 1500);
    applySettings();
    refresh();
    document.addEventListener('DOMContentLoaded', () => {
      try { refresh(); }
      finally { finishBoot(); }
    }, { once: true });
    document.addEventListener('load', event => {
      if (event.target instanceof HTMLLinkElement && event.target.relList.contains('stylesheet')) scheduleRefresh();
    }, true);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) scheduleRefresh();
    });
    window.addEventListener('pageshow', scheduleRefresh);
    window.addEventListener('resize', scheduleRefresh);
    narrowScreen.addEventListener('change', scheduleRefresh);
  }
  if (document.documentElement) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
}());
