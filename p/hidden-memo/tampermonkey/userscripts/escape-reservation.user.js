// ==UserScript==
// @name            방탈출 예약 자동 입력
// @namespace       http://tampermonkey.net/
// @version         3.1
// @description     지구별, play33, 클레버타운, 둠이스케이프, 키이스케이프, 나비잠, 서울이스케이프룸 예약 정보 자동 입력
// @match           *://*.xn--2e0b040a4xj.com/reservation/create*
// @match           *://*.play33.kr/reservation/create*
// @match           *://*.clevertown.co.kr/layout/res/home.php*
// @match           *://*.doomescape.com/layout/res/home.php*
// @match           *://*.keyescape.com/reservation2.php*
// @match           *://*.nabijam.com/layout/res/home.php*
// @match           *://*.seoul-escape.com/reservation/create*
// @run-at          document-idle
// @grant           none
// ==/UserScript==

(function () {
  'use strict';

  const USER = {
    name: __GUEST_NAME__,
    phone: __GUEST_PHONE__
  };

  const IS_USING_AUTO_SUBMIT = false;
  const THEME_PEOPLE_OVERRIDES = {
    // '테마명': 4
  };

  const PHONE = splitPhone(USER.phone);

  const PROFILES = [
    {
      id: 'earth-star',
      label: '지구별',
      domain: 'xn--2e0b040a4xj.com',
      pathPrefix: '/reservation/create',
      waitSelector: 'div.reservation-form-table',
      autoSubmitSelector: '#eveReservationBtn',
      fields: [
        { selector: 'input[name="name"]', value: USER.name },
        { selector: 'input[name="phone"]', value: PHONE.formatted },
        { selector: 'select[name="people"]', kind: 'people' },
        { selector: 'input[name="policy"]', checked: true },
        { selector: 'input[type="radio"][value="21"]', checked: true, optional: true }
      ],
      hideSelectors: ['div.reservation-form-desc']
    },
    {
      id: 'play33',
      label: 'play33',
      domain: 'play33.kr',
      pathPrefix: '/reservation/create',
      waitSelector: 'div.resform-table',
      autoSubmitSelector: '#eveReservationBtn',
      fields: [
        { selector: 'input[name="name"]', value: USER.name },
        { selector: 'input[name="phone"]', value: PHONE.formatted },
        { selector: 'select[name="people"]', kind: 'people' },
        { selector: 'input[name="policy"]', checked: true }
      ],
      hideSelectors: ['div.resform-desc', 'div.title2']
    },
    {
      id: 'clever-town',
      label: '클레버타운',
      domain: 'clevertown.co.kr',
      pathPrefix: '/layout/res/home.php',
      requiredQuery: { go: 'rev.make.input' },
      waitSelector: 'form[name="register"]',
      autoSubmitSelector: 'button.write_ok',
      manualInputSelector: 'input[name="input_captcha"]',
      fields: [
        { selector: 'input[name="name"]', value: USER.name },
        { selector: 'select[name="mobile1"], input[name="mobile1"]', value: PHONE.first },
        { selector: 'input[name="mobile2"]', value: PHONE.middle },
        { selector: 'input[name="mobile3"]', value: PHONE.last },
        { selector: 'select[name="person"]', kind: 'people' },
        { selector: 'input[name="ck_agree"]', index: 0, checked: true }
      ],
      hideSelectors: ['div.sub_visual', 'textarea'],
      scrollSelector: 'input[name="input_captcha"]'
    },
    {
      id: 'doom-escape',
      label: '둠이스케이프',
      domain: 'doomescape.com',
      pathPrefix: '/layout/res/home.php',
      requiredQuery: { go: 'rev.make.input' },
      waitSelector: 'form[name="register"]',
      autoSubmitSelector: 'a[href="javascript:fun_submit()"]',
      fields: [
        { selector: 'input[name="name"]', value: USER.name },
        { selector: 'select[name="mobile1"], input[name="mobile1"]', value: PHONE.first },
        { selector: 'input[name="mobile2"]', value: PHONE.middle },
        { selector: 'input[name="mobile3"]', value: PHONE.last },
        { selector: 'select[name="person"]', kind: 'people' },
        { selector: 'input[name="ck_agree"]', index: 0, checked: true }
      ],
      hideSelectors: ['div.sub_tit']
    },
    {
      id: 'key-escape',
      label: '키이스케이프',
      domain: 'keyescape.com',
      pathPrefix: '/reservation2.php',
      waitSelector: 'div.reservationForm',
      autoSubmitSelector: '',
      manualInputSelector: '#captcha',
      fields: [
        { selector: 'input[name="name"]', value: USER.name },
        { selector: 'select[name="mobile1"], input[name="mobile1"]', value: PHONE.first },
        { selector: 'input[name="mobile2"]', value: PHONE.middle },
        { selector: 'input[name="mobile3"]', value: PHONE.last },
        { selector: 'select[name="person"]', kind: 'people' },
        { selector: 'input[name="agree_1"]', checked: true },
        { selector: 'input[name="agree_2"]', checked: true },
        { selector: 'input[name="agree_3"]', checked: true, optional: true }
      ],
      hideSelectors: ['div.stepList'],
      scrollSelector: '#captcha'
    },
    {
      id: 'nabi-jam',
      label: '나비잠',
      domain: 'nabijam.com',
      pathPrefix: '/layout/res/home.php',
      requiredQuery: { go: 'rev.make.input' },
      waitSelector: 'form[name="register"]',
      autoSubmitSelector: '',
      manualInputSelector: 'input[name="input_captcha"]',
      fields: [
        { selector: 'input[name="name"]', value: USER.name },
        { selector: 'select[name="mobile1"], input[name="mobile1"]', value: PHONE.first },
        { selector: 'input[name="mobile2"]', value: PHONE.middle },
        { selector: 'input[name="mobile3"]', value: PHONE.last },
        { selector: 'select[name="person"]', kind: 'people' },
        { selector: 'input[name="ck_agree"]', index: 0, checked: true }
      ],
      hideSelectors: ['div.sub_visual', 'div.sub_tit'],
      scrollSelector: 'input[name="input_captcha"]'
    },
    {
      id: 'seoul-escape-room',
      label: '서울이스케이프룸',
      domain: 'seoul-escape.com',
      pathPrefix: '/reservation/create',
      waitSelector: 'article.reservation-from-wrap',
      autoSubmitSelector: '#eveReservationBtn',
      fields: [
        { selector: 'input[name="name"]', value: USER.name },
        { selector: 'input[name="phone"]', value: PHONE.formatted },
        { selector: 'select[name="people"]', kind: 'people' },
        { selector: 'input[name="policy"]', checked: true }
      ],
      hideSelectors: ['#header', '#eveLayerToggleBtn', '#footer'],
      scrollSelector: 'input[name="name"]'
    }
  ];

  function splitPhone(value) {
    const digits = String(value).replace(/\D/g, '');
    const first = digits.slice(0, 3);
    const middle = digits.slice(3, -4);
    const last = digits.slice(-4);
    return {
      first,
      middle,
      last,
      formatted: [first, middle, last].filter(Boolean).join('-')
    };
  }

  function hostnameMatches(hostname, domain) {
    return hostname === domain || hostname.endsWith('.' + domain);
  }

  function matchesProfile(profile, url) {
    if (!hostnameMatches(url.hostname, profile.domain)) return false;
    if (!url.pathname.startsWith(profile.pathPrefix)) return false;
    if (!profile.requiredQuery) return true;

    return Object.entries(profile.requiredQuery).every(([key, value]) => {
      return url.searchParams.get(key) === value;
    });
  }

  function setNativeValue(element, value) {
    const prototype = Object.getPrototypeOf(element);
    const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    setter ? setter.call(element, value) : (element.value = value);
  }

  function dispatch(element, type) {
    element.dispatchEvent(new Event(type, { bubbles: true }));
  }

  function setCheckedAndDispatch(element, checked) {
    if (element.checked === checked) return;

    element.click();
    if (element.checked !== checked) {
      element.checked = checked;
      dispatch(element, 'input');
      dispatch(element, 'change');
    }
  }

  function resolveFieldValue(field, profile, element) {
    if (field.kind !== 'people' || element.tagName !== 'SELECT') {
      return field.value;
    }

    const availableOptions = Array.from(element.options)
      .filter(option => !option.disabled)
      .map(option => {
        const valueNumber = Number(option.value);
        const textNumber = Number((option.textContent.match(/\d+/) || [])[0]);
        return {
          value: option.value,
          people: Number.isFinite(valueNumber) && valueNumber > 0 ? valueNumber : textNumber
        };
      })
      .filter(option => Number.isFinite(option.people) && option.people > 0)
      .sort((a, b) => a.people - b.people);

    if (!availableOptions.length) {
      return element.value;
    }

    const pageText = document.body?.textContent || '';
    const matchedTheme = Object.keys(THEME_PEOPLE_OVERRIDES).find(theme => pageText.includes(theme));
    if (matchedTheme) {
      const overriddenPeople = THEME_PEOPLE_OVERRIDES[matchedTheme];
      const overriddenOption = availableOptions.find(option => option.people === overriddenPeople);
      if (overriddenOption) {
        console.info('[' + profile.label + '] ' + matchedTheme + ' 인원을 ' + overriddenPeople + '명으로 입력합니다.');
        return overriddenOption.value;
      }
    }

    const minimumOption = availableOptions[0];
    console.info('[' + profile.label + '] 예약 가능한 최소 인원인 ' + minimumOption.people + '명으로 입력합니다.');
    return minimumOption.value;
  }

  function applyField(field, profile) {
    const elements = document.querySelectorAll(field.selector);
    const element = elements[field.index || 0];

    if (!element) {
      if (!field.optional) {
        console.warn('[' + profile.label + '] 입력 필드를 찾지 못했습니다:', field.selector);
      }
      return Boolean(field.optional);
    }

    try {
      if (Object.prototype.hasOwnProperty.call(field, 'checked')) {
        setCheckedAndDispatch(element, field.checked);
        return element.checked === field.checked;
      }

      const value = resolveFieldValue(field, profile, element);
      setNativeValue(element, String(value));
      dispatch(element, 'input');
      dispatch(element, 'change');
      return String(element.value) === String(value);
    } catch (error) {
      console.warn('[' + profile.label + '] 입력 필드 적용에 실패했습니다:', field.selector, error);
      return Boolean(field.optional);
    }
  }

  function showResultToast(success) {
    document.getElementById('tm-reservation-result-toast')?.remove();

    const toast = document.createElement('div');
    toast.id = 'tm-reservation-result-toast';
    toast.setAttribute('role', 'status');
    toast.textContent = success ? '예약 정보 입력 완료' : '예약 정보 입력 실패';
    Object.assign(toast.style, {
      position: 'fixed',
      left: '50%',
      bottom: 'calc(22px + env(safe-area-inset-bottom))',
      transform: 'translate(-50%, 8px)',
      zIndex: '2147483647',
      minWidth: '180px',
      maxWidth: 'calc(100vw - 32px)',
      padding: '12px 18px',
      borderRadius: '12px',
      background: success ? '#19724b' : '#b83b3b',
      boxShadow: '0 10px 28px rgba(0, 0, 0, .24)',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: '14px',
      fontWeight: '700',
      lineHeight: '1.4',
      textAlign: 'center',
      opacity: '0',
      pointerEvents: 'none',
      transition: 'opacity .18s ease, transform .18s ease'
    });

    document.documentElement.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translate(-50%, 0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, 8px)';
      setTimeout(() => toast.remove(), 200);
    }, 2_400);
  }

  function waitFor(selector, { root = document, timeout = 30_000, pollMs = 200 } = {}) {
    return new Promise((resolve, reject) => {
      const first = root.querySelector(selector);
      if (first) return resolve(first);

      const target = root === document ? document.documentElement : root;
      const observer = new MutationObserver(() => finish(root.querySelector(selector)));
      const interval = setInterval(() => finish(root.querySelector(selector)), pollMs);
      const timer = setTimeout(() => finish(null, true), timeout);

      function finish(element, timedOut) {
        if (!element && !timedOut) return;
        observer.disconnect();
        clearInterval(interval);
        clearTimeout(timer);
        timedOut ? reject(new Error('waitFor timeout: ' + selector)) : resolve(element);
      }

      observer.observe(target, { childList: true, subtree: true });
    });
  }

  function hideElements(selectors) {
    (selectors || []).forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        element.style.setProperty('display', 'none', 'important');
      });
    });
  }

  async function scrollToTarget(selector) {
    if (!selector) return;

    try {
      const target = await waitFor(selector, { timeout: 2_000 });
      target.scrollIntoView({ block: 'center' });
    } catch (error) {
      console.info('[방탈출 자동 입력] 스크롤 대상을 찾지 못했습니다:', selector);
    }
  }

  function waitForPaint() {
    return new Promise(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
  }

  async function submitIfEnabled(profile) {
    if (!IS_USING_AUTO_SUBMIT) return;

    if (profile.manualInputSelector) {
      console.info('[' + profile.label + '] 캡차 또는 인증코드는 직접 입력해야 하므로 예약 버튼을 자동 클릭하지 않습니다.');
      return;
    }

    if (!profile.autoSubmitSelector) {
      console.warn('[' + profile.label + '] 자동 클릭할 예약 버튼 셀렉터가 설정되지 않았습니다.');
      return;
    }

    await waitForPaint();

    let button;
    try {
      button = await waitFor(profile.autoSubmitSelector, { timeout: 3_000 });
    } catch (error) {
      console.warn('[' + profile.label + '] 자동 클릭할 예약 버튼을 찾지 못했습니다:', profile.autoSubmitSelector);
      return;
    }

    button.click();
  }

  async function run() {
    const url = new URL(location.href);
    const profile = PROFILES.find(candidate => matchesProfile(candidate, url));
    if (!profile) return;

    console.info('[' + profile.label + '] 자동 입력 스크립트 시작:', location.href);

    try {
      await waitFor(profile.waitSelector);
    } catch (error) {
      console.warn('[' + profile.label + '] 예약 입력 폼을 찾지 못했습니다:', error);
      showResultToast(false);
      return;
    }

    hideElements(profile.hideSelectors);
    const succeeded = profile.fields.map(field => applyField(field, profile)).every(Boolean);
    await scrollToTarget(profile.scrollSelector);

    showResultToast(succeeded);
    console.info('[' + profile.label + '] 입력 ' + (succeeded ? '완료' : '실패') + '.');
    if (succeeded) await submitIfEnabled(profile);
  }

  run();
})();
