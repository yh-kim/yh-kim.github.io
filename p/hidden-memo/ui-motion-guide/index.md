---
layout:     post
title:      "테마별 인터랙티브 UI·모션 디자인 가이드"
subtitle:   "네 가지 디자인 언어를 조작하고, 수치와 코드까지 가져가는 작은 실험실"
description: "Warm Minimal, Editorial, Technical, Bold Graphic의 대표 화면과 일곱 가지 UI·모션 데모, 디자인 토큰과 재사용 코드를 한 글에서 비교합니다."
date:       2026-10-16 00:00:00 +0900
author:     "Pimi"
header-img: "img/home-bg.jpg"
header-mask: 0.3
catalog:    false
permalink:  /p/hidden-memo/ui-motion-guide/
hidden:     true
tags:       []
---

<p><a href="{{ '/p/hidden-memo/' | relative_url }}">← 히든메모 목록</a></p>
<p>어두운 AI 작업실과 밝은 프로젝트 대시보드. <strong>화면 선택 → 직접 조작 → 모션 다시 보기 → 규칙과 코드 가져가기</strong> 순서로 체험하세요. 모든 데이터는 로컬 샘플입니다.</p>
<div id="ui-motion-guide" lang="ko" aria-label="테마별 UI와 모션 체험"><p>인터랙티브 가이드를 불러오는 중입니다. JavaScript가 필요합니다.</p></div>
<noscript><p>JavaScript를 켜면 두 대표 화면과 12개 인터랙션, 프롬프트·실행 HTML 복사와 다운로드를 사용할 수 있습니다.</p></noscript>
<script type="module" src="{{ '/js/ui-motion-guide/index.js?v=20261016-r2' | relative_url }}"></script>
<h2 id="guide-sources">참고와 제작 기준</h2>
<p>시각 참고: <a href="https://dribbble.com/shots/27748221-AI-Agent-Website-Design">A · Conceptzilla의 AI Agent UI</a>, <a href="https://www.behance.net/gallery/251693759/PlanIQ-SaaS-Project-Management-Dashboard-UIUX">B · PlanIQ 대시보드 포트폴리오</a>. 2026년 10월 16일 실제 브라우저에서 A의 3200×2400 원본 이미지, B의 커버와 캘린더·타이포 모듈을 확대 확인했습니다. 큰 히어로와 작은 제어부의 대비, 겹친 패널, 상단 내비게이션과 데이터 모듈의 정렬을 참고했습니다. 정적 이미지의 내부 비율은 시각적 추정이며 원본 CSS의 실측값은 아닙니다.</p>
<p>체험 흐름 참고: <a href="https://lucianlabs.dev/uxui-prompt/">C · Lucian UX/UI Prompt</a>. 분류별 갤러리, 요소 확대 탐색, 201번 자동화 흐름도의 실행, 프롬프트·코드 탭 전환과 실제 클립보드 복사를 확인했습니다. 전체 400개 요소와 모든 원본 모션을 확인한 것은 아닙니다.</p>
<p>이 글의 FRAME·Orbit은 독립적인 데모 명칭입니다. 원본과 제휴한 공식 구현이 아닙니다. <strong>색·타이포·간격·레이아웃·모션 수치는 의도적으로 새로 설계</strong>했습니다. A·B에서 원본 모션을 확인하지 못했으므로 복원했다고 주장하지 않습니다. 원본 로고·문구·사진·소스는 사용하지 않았고, 고리 조형물은 CSS로 직접 만들었습니다.</p>
<p>복사 코드는 필수 토큰·스타일·동작을 포함한 <strong>완전한 단일 HTML 문서</strong>입니다. 라이브러리·외부 폰트·서버 없이 파일로 열 수 있습니다. 설치된 글꼴이 없으면 지정된 시스템 대체 글꼴로 표시됩니다. 실제 서비스에 옮길 때는 샘플 데이터를 프로젝트의 데이터·이벤트에 연결하세요.</p>
