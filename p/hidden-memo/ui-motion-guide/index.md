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
<p>같은 콘텐츠라도 글자와 여백, 배치와 움직임이 달라지면 전혀 다른 인상을 만듭니다. 아래 실험실은 <strong>하나의 공간 예약 화면을 네 가지 디자인 언어로 비교</strong>하는 가이드입니다.</p>
<p><strong>테마 선택 → 화면 조작 → 요소별 체험 → 규칙 확인 → 프롬프트·코드 복사</strong> 순서로 사용하세요. 모든 입력과 예약은 브라우저 안의 연습이며 전송하거나 저장하지 않습니다.</p>
<div id="ui-motion-guide" lang="ko" aria-label="테마별 UI와 모션 체험">
  <p>인터랙티브 가이드를 불러오는 중입니다. JavaScript가 필요합니다.</p>
</div>
<noscript><p>JavaScript를 켜면 네 테마의 실제 화면과 버튼·입력폼·카드·탭·아코디언·다이얼로그·스크롤 모션, 복사 및 다운로드 도구를 사용할 수 있습니다.</p></noscript>
<script type="module" src="{{ '/js/ui-motion-guide/index.js' | relative_url }}"></script>
<h2 id="guide-sources">참고와 제작 기준</h2>
<p>사용성 참고: <a href="https://lucianlabs.dev/uxui-prompt/">Lucian UX/UI Prompt</a>. 2026년 10월 16일 실제 브라우저에서 분류별 갤러리, 요소 확대 탐색, 201번 자동화 흐름도의 실행, 프롬프트·코드 탭 전환과 클립보드 복사 성공을 확인했습니다. 전체 400개 요소와 모든 원본 모션을 확인한 것은 아닙니다.</p>
<p>이 글의 네 테마, 공간 일러스트와 문구, 색상·간격·타이포·모션 수치는 <strong>의도적으로 새로 설계</strong>했습니다. 참고 사이트의 브랜드, 원문, 구현 코드와 실측 토큰을 옮기지 않았으며 원본 모션의 복원도 아닙니다. 세부 수치는 체험 영역의 규칙표와 같은 데이터에서 생성됩니다.</p>
<p>복사 코드는 외부 라이브러리나 폰트 다운로드가 필요 없는 <strong>완전한 단일 HTML 문서</strong>입니다. 파일로 저장한 뒤 브라우저에서 열 수 있습니다. 실제 서비스에 옮길 때는 예시 데이터와 로컬 완료 동작을 프로젝트의 데이터·이벤트에 연결하세요. 설치된 글꼴에 따라 지정된 대체 글꼴이 사용됩니다.</p>
