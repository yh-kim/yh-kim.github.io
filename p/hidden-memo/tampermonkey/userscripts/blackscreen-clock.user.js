
// ==UserScript==
// @name         BlackScreen Clock + Minimal Text (Clock Bottom 40vh, Auto-Expand Fix, Hidden Scrollbar, No Zoom)
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  Clock at bottom of 40vh; text area 60vh; textarea auto-expands without stretching; hidden scrollbar; tap clock→input, click outside→read; zoom disabled
// @match        https://blackscreen.app/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const LS_KEY = 'tm_blackscreen_minimal_text_v1';
  let timerId = null;
  let saveTimer = null;
  let isInputMode = false;

  // ---------- Disable zoom ----------
  function disableZoom() {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    );
  }
  disableZoom();

  // ---------- Utils ----------
  const fmtTime = (d) => {
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };
  const loadText = () => {
    try { return localStorage.getItem(LS_KEY) || ''; } catch (_) { return ''; }
  };
  const saveTextDebounced = (val) => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(LS_KEY, val); } catch (_) {}
    }, 250);
  };

  // ---------- UI ----------
  function createOverlay() {
    if (document.getElementById('tm-hard-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'tm-hard-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'black',
      zIndex: '2147483647',
      display: 'flex',
      flexDirection: 'column',
      pointerEvents: 'auto'
    });

    // Top 40%: clock at bottom
    const topZone = document.createElement('div');
    Object.assign(topZone.style, {
      height: '40vh',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingBottom: '10px'
    });

    const clock = document.createElement('div');
    clock.id = 'tm-center-clock';
    Object.assign(clock.style, {
      color: 'white',
      fontFamily: 'monospace',
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: '1',
      userSelect: 'none',
      fontSize: 'clamp(40px, 12vw, 120px)',
      textShadow: '0 0 8px rgba(255,255,255,0.45)',
      cursor: 'pointer'
    });
    clock.textContent = fmtTime(new Date());
    topZone.appendChild(clock);

    // Bottom 60%: text container
    const bottomZone = document.createElement('div');
    Object.assign(bottomZone.style, {
      height: '60vh',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '8px 0'
    });

    const textWrap = document.createElement('div');
    Object.assign(textWrap.style, {
      width: 'min(92vw, 800px)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'   // ✅ stretch 방지: 자식들을 위쪽에 맞춤
    });

    // Hide scrollbars
    const hideScrollCss = document.createElement('style');
    hideScrollCss.textContent = `
      #tm-min-read::-webkit-scrollbar,
      #tm-min-textarea::-webkit-scrollbar { display: none; }
    `;
    document.head.appendChild(hideScrollCss);

    // Read view (fills zone; only it scrolls)
    const rd = document.createElement('div');
    rd.id = 'tm-min-read';
    rd.textContent = loadText() || '';
    Object.assign(rd.style, {
      display: 'block',
      width: '100%',
      height: '100%',
      overflowY: 'scroll',
      color: 'white',
      textAlign: 'center',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      fontSize: '16px',
      lineHeight: '1.5',
      userSelect: 'text',
      padding: '0 6px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    });

    // Input (auto-expand; no stretch)
    const ta = document.createElement('textarea');
    ta.id = 'tm-min-textarea';
    ta.placeholder = '텍스트를 입력하세요…';
    ta.value = rd.textContent;
    Object.assign(ta.style, {
      display: 'none',                 // start in read mode
      width: '100%',
      background: 'black',
      color: 'white',
      border: '1px solid rgba(255,255,255,0.35)',
      borderRadius: '10px',
      padding: '8px 10px',
      fontSize: '16px',
      lineHeight: '1.5',
      boxSizing: 'border-box',
      outline: 'none',
      overflowY: 'hidden',            // autosize default
      resize: 'none',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      minHeight: '44px',
      alignSelf: 'flex-start',        // ✅ 부모 flex의 stretch 무시
      maxHeight: '100%'               // ✅ 60vh 컨테이너 높이까지만
    });

    // prevent bubbling from textarea
    ['pointerdown','pointerup','click','touchstart','touchend','mousedown','mouseup']
      .forEach(ev => ta.addEventListener(ev, (e)=> e.stopPropagation(), {passive:false}));

    textWrap.appendChild(ta);
    textWrap.appendChild(rd);
    bottomZone.appendChild(textWrap);

    overlay.appendChild(topZone);
    overlay.appendChild(bottomZone);
    document.documentElement.appendChild(overlay);

    // ---------- Autosize (includes border & padding) ----------
    function autosize() {
      const maxPx = textWrap.clientHeight || Math.floor(window.innerHeight * 0.6);
      ta.style.height = 'auto';

      const cs = window.getComputedStyle(ta);
      const border = parseInt(cs.borderTopWidth) + parseInt(cs.borderBottomWidth);
      const padding = parseInt(cs.paddingTop) + parseInt(cs.paddingBottom);
      const extra = border + padding;

      const desired = Math.min(ta.scrollHeight + extra, maxPx);
      ta.style.height = desired + 'px';
      ta.style.overflowY = (ta.scrollHeight + extra > maxPx) ? 'scroll' : 'hidden';
    }

    // ---------- Mode switch ----------
    function switchToRead() {
      if (!isInputMode) return;
      isInputMode = false;
      ta.style.display = 'none';
      rd.style.display = 'block';
      rd.textContent = ta.value || '';
    }
    function switchToInput() {
      if (isInputMode) return;
      isInputMode = true;
      rd.style.display = 'none';
      ta.style.display = 'block';
      ta.value = rd.textContent;
      autosize();                 // ensure compact height when empty
      setTimeout(() => ta.focus(), 0);
    }

    // tap clock → input
    clock.addEventListener('click', (e) => {
      e.stopPropagation();
      switchToInput();
    });

    // input mode: click outside → read
    overlay.addEventListener('click', (e) => {
      if (!isInputMode) return;
      if (!ta.contains(e.target)) switchToRead();
    });

    // input sync + autosize
    const syncAndResize = () => {
      saveTextDebounced(ta.value);
      autosize();
    };
    ta.addEventListener('input', syncAndResize);
    ta.addEventListener('paste', () => setTimeout(autosize, 0));
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') requestAnimationFrame(autosize);
      if (e.key === 'Escape') {
        e.preventDefault();
        switchToRead();
      }
    });

    window.addEventListener('resize', () => {
      if (isInputMode) autosize();
    });

    window.__tm_min_text = { switchToRead, switchToInput, ta, rd, autosize };
  }

  // ---------- Clock loop ----------
  function startClock() {
    if (timerId) return;
    const tick = () => {
      const el = document.getElementById('tm-center-clock');
      if (el && document.visibilityState === 'visible') {
        el.textContent = fmtTime(new Date());
      }
    };
    tick();
    timerId = setInterval(tick, 1000);
  }

  // ---------- Bootstrap ----------
  function init() {
    disableZoom();
    createOverlay();
    startClock();
  }

  init();
  document.addEventListener('DOMContentLoaded', init, { once: true });
  window.addEventListener('pageshow', init);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') init();
  });
})();
