
// ==UserScript==
// @name         모바일 네이버 메인
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  피드 항목 숨기기
// @match        https://m.naver.com/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 특정 class를 가진 요소 숨기는 함수
    function hideHomeFeedElements() {
        document.querySelectorAll('[class*="home"]').forEach(el => {
            el.style.display = 'none';
        });
    }

    // 초기 실행 (페이지 로드 후)
    window.addEventListener('load', () => {
        hideHomeFeedElements();
    });

    // DOM 변화 감지 (SPA나 AJAX 로딩 대응)
    const observer = new MutationObserver(() => {
        hideHomeFeedElements();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
