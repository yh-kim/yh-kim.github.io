// ==UserScript==
// @name         FM코리아 모바일 정리
// @namespace    https://blog.pickth.com/
// @version      1.3.0
// @description  광고 재삽입 추적, 차분한 모바일 디자인, 상단·글·댓글·사이트 하단 정리, FM 한 번은 메인·두 번은 설정
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
  const AD_STATE_ATTRIBUTE = 'data-fm-clean-ad-original';
  const defaults = {
    enabled: true, header: true, ads: true, icons: true, votes: true,
    count: true, footer: true, commentActions: true, siteFooter: true, appearance: true
  };
  const options = [
    ['enabled', '전체 기능 켜기'],
    ['header', '상단 로고·알림 숨김'],
    ['ads', '광고 영역 숨김'],
    ['icons', '글·댓글 닉네임 아이콘 숨김'],
    ['votes', '포텐·방출 버튼 숨김'],
    ['count', '상세 제목 오른쪽 추천 숫자'],
    ['footer', '상세 하단 버튼·첨부파일 숨김'],
    ['commentActions', '댓글 추천·답글·더보기 숨김'],
    ['siteFooter', '사이트 하단 문의·신고 숨김'],
    ['appearance', '차분한 화면 디자인']
  ];
  const settings = loadSettings();
  let host;
  let panel;
  let launcher;
  let pending = false;
  let launcherClickTimer = null;
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

  function rememberAdStylesheet(href) {
    try {
      const url = new URL(href, location.href);
      const match = url.hostname === 'static.fmkorea.com' && url.pathname.match(/^\/([A-Za-z]{12,})\.css$/);
      if (match) discoveredAdSelectors.add(`.${match[1]}`);
    } catch (error) {
      // 잘못된 외부 리소스 주소는 무시합니다.
    }
  }

  function discoverAdSelectors() {
    // 광고 복구 모듈은 매 요청마다 CSS 파일명과 광고 클래스명을 함께 바꿉니다.
    // /modules/... 등의 일반 스타일은 제외하고 해당 루트 CSS의 클래스만 찾습니다.
    document.querySelectorAll('link[rel~="stylesheet"][href]').forEach(link => rememberAdStylesheet(link.href));
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
    if (active) {
      targets.forEach(element => {
        if (saved.has(element)) return;
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
      if (!active || !targets.has(element)) {
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
    // 사이트 UI만 재정의합니다. 본문 안의 색상·이미지·영상·인용 형식은 그대로 둡니다.
    return `
      ${root} body {
        --fm-clean-bg: #f3f5f2; --fm-clean-surface: #fff; --fm-clean-text: #29332e;
        --fm-clean-muted: #637168; --fm-clean-line: #e3e8e2;
        --fm-clean-accent: #487762; --fm-clean-soft: #e9f0eb;
        background: var(--fm-clean-bg) !important; color: var(--fm-clean-text) !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif !important;
      }
      ${root} body.night_mode {
        --fm-clean-bg: #151a17; --fm-clean-surface: #1c231f; --fm-clean-text: #e0e7e1;
        --fm-clean-muted: #a0ada3; --fm-clean-line: #313c34;
        --fm-clean-accent: #9cc5ac; --fm-clean-soft: #2c3c31;
      }
      ${root} .bd {
        color: var(--fm-clean-text) !important; background: var(--fm-clean-surface) !important;
        border: 0 !important; border-radius: 16px; margin: 10px 8px !important;
        box-shadow: 0 1px 4px #18271c08;
      }
      ${root} :is(nav.fmkorea_navi, .fmkorea_m_navi, #gnb) {
        background: var(--fm-clean-bg) !important; border: 0 !important;
        padding: 8px !important; box-sizing: border-box;
      }
      ${root} :is(nav.fmkorea_navi, .fmkorea_m_navi, #gnb) :is(.list, .expand) {
        background: var(--fm-clean-bg) !important; border-color: var(--fm-clean-line) !important;
      }
      ${root} :is(nav.fmkorea_navi, .fmkorea_m_navi, #gnb) a {
        color: var(--fm-clean-text) !important; background: var(--fm-clean-surface) !important;
        border: 0 !important; border-radius: 9px !important; box-shadow: none !important;
        text-shadow: none !important; font-size: 13px !important; font-weight: 500 !important;
      }
      ${root} .rd_hd {
        margin-bottom: 0 !important; padding: 18px 14px 14px !important;
        background: transparent !important; border-bottom: 1px solid var(--fm-clean-line) !important;
      }
      ${root} .rd_hd :is(.top_area, .btm_area, .board) {
        border: 0 !important; background: transparent !important; box-shadow: none !important;
      }
      ${root} .rd_hd h1 {
        padding: 0 !important; margin: 8px 0 12px !important;
        color: var(--fm-clean-text) !important; font-size: 20px !important;
        font-weight: 700 !important; line-height: 1.5 !important; letter-spacing: -.4px !important;
      }
      ${root} .rd_hd :is(.btm_area, .btm_area span, .btm_area b, .date),
      ${root} .document_address, ${root} .document_address a {
        color: var(--fm-clean-muted) !important; font-size: 12px !important;
      }
      ${root} .rd_hd .member_plate { color: var(--fm-clean-text) !important; }
      ${root} .rd_body { padding: 16px 12px !important; }
      ${root} .document_address { margin: 0 0 14px !important; }
      ${root} :is(.fdb_tag, .fdb_lst, .fdb_itm, .bd_lst, .bd_lst > li, .bd_lst td, .bd_m_lst, .bd_m_lst > li) {
        background: transparent !important; border-color: var(--fm-clean-line) !important;
        color: var(--fm-clean-text) !important; box-shadow: none !important;
      }
      ${root} .fdb_lst_ul { background: var(--fm-clean-surface) !important; }
      ${root} .fdb_tag { border: 0 !important; border-bottom: 1px solid var(--fm-clean-line) !important; border-radius: 0 !important; padding: 12px !important; }
      ${root} .fdb_itm { padding-top: 16px !important; padding-bottom: 16px !important; }
      ${root} .fdb_itm :is(.meta, .meta .date, .meta a, .meta span) {
        color: var(--fm-clean-muted) !important; font-size: 12px !important;
      }
      ${root} .fdb_itm .member_plate { color: var(--fm-clean-text) !important; font-weight: 600; }
      ${root} .fdb_itm .comment-content { color: var(--fm-clean-text) !important; line-height: 1.7; }
      ${root} .fdb_itm .meta :is(.best, .icon-hit) {
        background: var(--fm-clean-soft) !important; color: var(--fm-clean-accent) !important;
        border: 0 !important; border-radius: 4px;
      }
      ${root} .bd_lst :is(.title, .title a, .title a > span) { color: var(--fm-clean-text) !important; }
      ${root} .bd_lst :is(.author, .time, .count, .category) { color: var(--fm-clean-muted) !important; }
      ${root} .bd_m_lst :is(.title, .title a, .title a > span) { color: var(--fm-clean-text) !important; }
      ${root} .bd_m_lst :is(.author, .regdate, .m_no, .category) { color: var(--fm-clean-muted) !important; }
      ${root} body > footer .ft {
        background: var(--fm-clean-bg) !important; padding: 8px 12px !important;
      }
      ${root} body > footer .ft :is(li, a) {
        background: transparent !important; border: 0 !important;
        color: var(--fm-clean-muted) !important; text-shadow: none !important; font-weight: 400 !important;
      }
      ${root} :is(.fm_navi, .fm_navi2, .bd_pg, .fdb_tag) :is(a, button, input) {
        background: transparent !important; color: var(--fm-clean-muted) !important;
        border-color: var(--fm-clean-line) !important; border-radius: 7px !important;
        box-shadow: none !important; text-shadow: none !important;
      }
      ${root} :is(.fm_navi, .bd_pg, .fdb_tag) :is(.this, .active, strong) {
        color: var(--fm-clean-accent) !important; background: var(--fm-clean-soft) !important;
        border-color: transparent !important; border-radius: 7px;
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
    hideRule('footer', ['.rd > .rd_ft', '.rd > .rd_ft_nav']),
    hideRule('commentActions', ['.fdb_itm .fdb_nav']),
    hideRule('siteFooter', ['body > footer .cr', 'body > footer .crhome', '#footer']),
    cleanAppearance(),
    `
      html[data-fm-clean-boot="true"] body { opacity: 0 !important; pointer-events: none !important; }
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
        padding: 4px 8px; border: 0; border-radius: 8px;
        color: var(--fm-clean-accent, #487762); background: var(--fm-clean-soft, #e9f0eb); white-space: nowrap;
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
    launcher.title = `${settings.enabled ? '' : '화면 정리 꺼짐 · '}한 번 누르면 FM코리아 메인, 두 번 누르면 설정`;
    launcher.setAttribute('aria-label', launcher.title);
    for (const input of panel.querySelectorAll('input')) input.checked = settings[input.name];
  }

  function setPanelOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) panel.querySelector('input').focus();
    else launcher.focus();
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
          display: block; min-width: 48px; height: 44px; padding: 0 10px;
          border: 1px solid #64748b66; border-radius: 12px;
          background: #263b30f2; color: #fff; box-shadow: 0 2px 8px #0002;
          font: 600 13px/1 -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .panel {
          position: absolute; left: 0; bottom: 52px; width: 256px;
          max-width: calc(100vw - 24px); max-height: calc(100dvh - 92px);
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
        input { width: 16px; height: 16px; margin: 0; accent-color: #487762; flex-shrink: 0; }
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
      <button class="launcher" type="button" aria-label="한 번 누르면 FM코리아 메인, 두 번 누르면 설정" aria-expanded="false" aria-controls="fm-clean-panel">FM</button>
    `;
    panel = shadow.querySelector('.panel');
    launcher = shadow.querySelector('.launcher');
    launcher.addEventListener('click', handleLauncherClick);
    launcher.addEventListener('keydown', event => {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault();
      window.clearTimeout(launcherClickTimer);
      launcherClickTimer = null;
      setPanelOpen(true);
    });
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
      const text = count;
      if (badge.textContent !== text) badge.textContent = text;
      badge.setAttribute('aria-label', `포텐수 ${count}`);
      title.setAttribute('data-fm-clean-title', '');
      metadata?.setAttribute('data-fm-clean-original-count', '');
    });
  }

  const observer = new MutationObserver(records => {
    // 같은 작업 안에서 링크가 삽입·교체·제거돼도 광고 클래스의 단서를 놓치지 않습니다.
    for (const record of records) {
      if (record.type === 'attributes' && record.target instanceof HTMLLinkElement) {
        rememberAdStylesheet(record.target.href);
        if (record.attributeName === 'href' && record.oldValue) rememberAdStylesheet(record.oldValue);
      }
      for (const node of [...record.addedNodes, ...record.removedNodes]) {
        if (!(node instanceof Element)) continue;
        if (node.matches('link[href]')) rememberAdStylesheet(node.href);
        node.querySelectorAll('link[href]').forEach(link => rememberAdStylesheet(link.href));
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
    if (mobile) {
      mountControls();
      if (host) host.hidden = false;
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
