# UI·모션 스타일 라이브러리

2026-10-19. 기존 ID·URL을 유지하고 기능(componentId), 표현(styleId), 상태(snapshot)를 분리했다. 콘텐츠 사이트·온라인 스토어·업무 도구는 컴포넌트의 사용 맥락 태그다. Paper/Object/Frame은 업종이 아닌 표현 체계다.

## 탐색과 비교

홈 /p/ui-motion/는 최대 960px의 작은 가로형 링크 3개다. 높이 84px, 간격 10px, 패딩 14×16px, 반경 11px, 썸네일 54px(모바일 50px)을 유지한다. 썸네일은 같은 입력 폼의 실제 렌더링을 크롭했다. 홈은 데모 런타임과 상품 사진을 로드하지 않는다.

/components/에서 컴포넌트를 고른 뒤 세 스타일을 전환한다. /paper/, /object/, /frame/의 스타일 우선 진입도 유지한다. 검색·유형·사용 맥락 필터는 같은 12개 데이터에 연결된다. 자세히 보기만 상세를 열며 목록에서도 데모를 직접 조작한다.

데스크톱 상세는 두 스타일을 나란히 비교한다. 같은 DOM·문구·데이터·snapshot과 동일한 열 폭을 사용한다. 네 가지 대표 데모의 최대 너비는 각각 400px이다. 모바일은 한 위치에서 스타일을 바꾸며 입력 DOM을 유지한다. 포인터로 스타일을 바꿔도 입력값·체크·탭·펼침 상태와 입력 초점을 유지한다. 새로운 스타일별 검증/이벤트 코드를 복제하지 않는다.

탐색 UI는 중립색이다. 스타일은 데모에만 적용한다. 모바일에서 반복되는 제목과 스타일 탐색을 덜어 내고 상세 비교를 작은 두 열로 축소하지 않는다.

### 입력 초점과 모바일 확대

모든 UI·모션 경로의 키보드 입력 필드(`input`의 텍스트 계열·숫자·검색·이메일, `textarea`, `select`, 편집 가능한 영역)는 실제 렌더링 글자 크기를 **최소 16px**로 유지한다. Paper/Object/Frame의 `--input-font-size: 16px`가 같은 규칙을 제공한다. 본문·라벨·버튼·차트 수치는 각 스타일의 위계를 유지하며, 편집 가능한 글자에만 별도 크기를 적용한다. 목록·확대 보기·가이드 예제·복사용 필드·독립 HTML에서 동일하게 적용한다. 기존 AI/대시보드 장면과 숨김 메모의 이전 가이드도 16px를 유지한다. `maximum-scale`, `user-scalable=no`, `transform:scale(...)`를 이용해 확대를 억제하지 않는다. 사용자가 손가락으로 확대하는 기능은 그대로 둔다.

## 실제 색 토큰

| 역할 | Paper | Object | Frame |
| --- | --- | --- | --- |
| 페이지 바탕 | `#f7f7f5` | `#f1efea` | `#f2f5f9` |
| 기본 표면 | `#ffffff` | `#ffffff` | `#ffffff` |
| 제목·본문 | `#171717` | `#242321` | `#17243a` |
| 보조 문구 | `#66645f` | `#625d55` | `#596b80` |
| 비활성 글자 | `#65645f` | `#625e58` | `#586a7d` |
| 구획 경계 | `#deded8` | `#d6d1c8` | `#d8e0e9` |
| 제어 경계 | `#85847e` | `#858078` | `#7d8b9d` |
| 주 행동 | `#a72f24` | `#39352f` | `#1748b8` |
| 주 행동 위 글자 | `#ffffff` | `#ffffff` | `#ffffff` |
| 선택 표면 | `#f8e9e6` | `#e8e3da` | `#e5edff` |
| 오류 | `#a32620` | `#a12622` | `#a3262e` |
| 성공 | `#17633f` | `#17613f` | `#17633f` |

본문/보조는 바탕 또는 흰 표면 위에, onAccent는 accent 위에 쓴다. 구조를 나누는 line은 조용한 선이며, 입력·보조 버튼에는 별도 control-border를 사용한다. 선택은 표시선·aria-selected·aria-pressed, 오류는 문장·aria-invalid·aria-describedby, 비활성은 disabled와 점선 경계를 함께 사용한다. 색만으로 상태를 전달하지 않는다. 비활성 글자를 opacity로 희석하지 않는다.

## Paper

가는 선과 큰 활자로 읽는 흐름을 만듭니다.

- 색 면적 목표: 종이·흰 면 약 78% · 잉크와 선 18% · 빨강 4%. 실제 콘텐츠 면적을 계측한 수치가 아니라 설계 목표다.
- 우선순위: 제목 → 현재 값/핵심 내용 → 주 행동 → 보조 행동/결과. 제목을 위에 두고 구분선 아래에 입력과 행동을 세로로 배치합니다.
- 피하기: 넓은 강조색 면, 두꺼운 그림자, 작은 본문을 피합니다. 큰 컬러 카드와 여러 겹의 테두리를 피합니다.
- 타이포: 제목 21px · 본문 14px · 보조 12px · 입력 16px; 본문 14px / 1.65. 외부 폰트 없이 시스템 글꼴을 쓴다.
- 간격: 4 · 8 · 12 · 16 · 24 · 32px; 제목/내용 간격 16px, 내용 묶음 12px. 라벨/입력/오류는 6px 간격으로 세로 배치.
- 형태: 입력 2px · 버튼 2px · 면보다 선으로 구획. 깊이: 없음 · 겹치는 면은 선으로 구분.
- 모바일: 상하 14px, 좌우 12px. 컨트롤 44px 이상. 긴 한글은 keep-all + overflow-wrap:anywhere, 숫자는 tabular-nums로 정렬한다.
- 좋은 예: 제목을 위에 두고 구분선 아래에 입력과 행동을 세로로 배치합니다. 주 행동은 입력/선택 뒤, 보조 행동은 같은 묶음에 둔다.
- 나쁜 예: 긴 오류를 고정 높이로 자르기, 관련 없는 제어에 같은 그림자 반복하기, 내용이 달라지는 비교.

실제 CSS 변수(`style-tokens.js`의 tokens; 가이드도 같은 값을 렌더링):

```css
--bg: #f7f7f5;
--surface: #ffffff;
--ink: #171717;
--text: #171717;
--muted: #66645f;
--line: #deded8;
--accent: #a72f24;
--on-accent: #ffffff;
--selected: #f8e9e6;
--error: #a32620;
--success: #17633f;
--disabled: #65645f;
--control-border: #85847e;
--radius: 2px;
--pad: 16px;
--gap: 12px;
--font-size: 14px;
--line-height: 1.65;
--label-size: 12px;
--heading-size: 21px;
--heading-weight: 700;
--heading-leading: 1.3;
--meta-size: 12px;
--focus-ring: #a72f24;
--control-radius: 2px;
--control-min-height: 44px;
--input-font-size: 16px;
--mobile-pad-y: 14px;
--mobile-pad-x: 12px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
```

## Object

짙은 재료감과 얕은 깊이로 선택을 드러냅니다.

- 색 면적 목표: 밝은 면 약 76% · 차콜과 경계 20% · 강조 4%. 실제 콘텐츠 면적을 계측한 수치가 아니라 설계 목표다.
- 우선순위: 제목 → 현재 값/핵심 내용 → 주 행동 → 보조 행동/결과. 관련 상품과 수량을 한 면 안에서 묶고 합계를 가장자리에서 분리합니다.
- 피하기: 모든 면을 베이지로 채우거나 모든 제어에 같은 그림자를 주지 않습니다. 서로 무관한 내용을 한 카드 안에 합치거나 과한 그림자를 피합니다.
- 타이포: 제목 19px · 값 15px · 본문 14px · 보조 12px · 입력 16px; 본문 14px / 1.55. 외부 폰트 없이 시스템 글꼴을 쓴다.
- 간격: 4 · 8 · 12 · 16 · 24 · 32px; 제목/내용 간격 16px, 내용 묶음 12px. 라벨/입력/오류는 6px 간격으로 세로 배치.
- 형태: 버튼·입력 8px · 작은 상태표시 999px. 깊이: 기본 면에 짧은 내부 강조 · 주요 제어에 낮은 그림자.
- 모바일: 상하 14px, 좌우 12px. 컨트롤 44px 이상. 긴 한글은 keep-all + overflow-wrap:anywhere, 숫자는 tabular-nums로 정렬한다.
- 좋은 예: 관련 상품과 수량을 한 면 안에서 묶고 합계를 가장자리에서 분리합니다. 주 행동은 입력/선택 뒤, 보조 행동은 같은 묶음에 둔다.
- 나쁜 예: 긴 오류를 고정 높이로 자르기, 관련 없는 제어에 같은 그림자 반복하기, 내용이 달라지는 비교.

실제 CSS 변수(`style-tokens.js`의 tokens; 가이드도 같은 값을 렌더링):

```css
--bg: #f1efea;
--surface: #ffffff;
--ink: #242321;
--text: #242321;
--muted: #625d55;
--line: #d6d1c8;
--accent: #39352f;
--on-accent: #ffffff;
--selected: #e8e3da;
--error: #a12622;
--success: #17613f;
--disabled: #625e58;
--control-border: #858078;
--radius: 8px;
--pad: 16px;
--gap: 12px;
--font-size: 14px;
--line-height: 1.55;
--label-size: 13px;
--heading-size: 19px;
--heading-weight: 650;
--heading-leading: 1.3;
--meta-size: 12px;
--focus-ring: #39352f;
--control-radius: 8px;
--control-min-height: 44px;
--input-font-size: 16px;
--mobile-pad-y: 14px;
--mobile-pad-x: 12px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
```

## Frame

정렬된 값과 선택 면으로 작업 상태를 보여줍니다.

- 색 면적 목표: 작업 면 약 80% · 잉크와 경계 16% · 파랑 4%. 실제 콘텐츠 면적을 계측한 수치가 아니라 설계 목표다.
- 우선순위: 제목 → 현재 값/핵심 내용 → 주 행동 → 보조 행동/결과. 짧은 라벨과 값을 두 열에 정렬하고 상태를 같은 행 끝에 둡니다.
- 피하기: 카드에 그림자를 더하거나 값과 상태를 서로 다른 기준선에 놓지 않습니다. 라벨·값의 기준선을 섞거나 행마다 다른 패딩을 주지 않습니다.
- 타이포: 제목 18px · 라벨 11px · 값 13px · 보조 11px · 입력 16px; 본문 13px / 1.55. 외부 폰트 없이 시스템 글꼴을 쓴다.
- 간격: 4 · 8 · 12 · 16 · 24 · 32px; 제목/내용 간격 12px, 내용 묶음 8px. 라벨/입력은 가로 12px, 필드 안 세로 7px, 오류는 입력 바로 아래.
- 형태: 입력·선택 6px · 표와 행은 직선 구획. 깊이: 없음 · 선택 상태는 옅은 면과 테두리로 표시.
- 모바일: 상하 14px, 좌우 12px. 컨트롤 44px 이상. 긴 한글은 keep-all + overflow-wrap:anywhere, 숫자는 tabular-nums로 정렬한다.
- 좋은 예: 짧은 라벨과 값을 두 열에 정렬하고 상태를 같은 행 끝에 둡니다. 주 행동은 입력/선택 뒤, 보조 행동은 같은 묶음에 둔다.
- 나쁜 예: 긴 오류를 고정 높이로 자르기, 관련 없는 제어에 같은 그림자 반복하기, 내용이 달라지는 비교.

실제 CSS 변수(`style-tokens.js`의 tokens; 가이드도 같은 값을 렌더링):

```css
--bg: #f2f5f9;
--surface: #ffffff;
--ink: #17243a;
--text: #17243a;
--muted: #596b80;
--line: #d8e0e9;
--accent: #1748b8;
--on-accent: #ffffff;
--selected: #e5edff;
--error: #a3262e;
--success: #17633f;
--disabled: #586a7d;
--control-border: #7d8b9d;
--radius: 6px;
--pad: 12px;
--gap: 8px;
--font-size: 13px;
--line-height: 1.55;
--label-size: 11px;
--heading-size: 18px;
--heading-weight: 700;
--heading-leading: 1.35;
--meta-size: 11px;
--focus-ring: #1748b8;
--control-radius: 6px;
--control-min-height: 44px;
--input-font-size: 16px;
--mobile-pad-y: 14px;
--mobile-pad-x: 12px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
```

## 모션과 실행 경로

목록의 **모션** 버튼, 상세·독립 HTML의 **다시 재생**은 해당 컴포넌트의 실제 상태 전환을 실행한다. 탭은 다음 탭, 차트는 다른 기간, FAQ는 첫 답변, 주문 표는 전체/결제 완료 필터, 캘린더는 가능한 날짜와 시간 목록을 시연한다. 입력 폼은 현재 값을 검증하며 사용자가 쓴 값을 덮어쓰지 않는다. 확인창은 열기만 하며 자동으로 삭제·주문·예약을 확정하지 않는다. 초기화는 재생과 구분한다.

상세·독립 HTML에는 일시정지/이어 재생, 1×·0.5×·0.25×, 초기화를 제공한다. 느린 속도는 관찰용이고 아래 기본 duration과 구분한다. 화면 밖이나 비활성 탭에서는 실행을 멈추고, 재진입하면 이어 간다. 새 입력은 이전 전환을 취소하고 현재 위치에서 최신 목표로 바꾼다. 오류의 초점·선택·완료 문구는 애니메이션 없이도 이해되어야 한다.

| 동작 | 트리거 → 대상 → 변화·공간 관계 | Paper | Object | Frame |
| --- | --- | --- | --- | --- |
| 누름 | 실행 버튼 → 같은 버튼 → scale .97→1; CSS 눌림 y 1px는 누르고 있는 상태 | 150ms | 150ms | 140ms |
| 선택 표시 | 탭 선택 → 단일 표시 → 현재 x·폭에서 다음 탭 x·폭 | 180ms | 180ms | 180ms |
| 탭 내용·아코디언 | 선택/펼침 → 패널 → y 5→0/opacity .45→1 또는 현재 높이→목표 높이 | 200ms | 220ms | 180ms |
| 결과 | 처리 완료 → 결과 문구 → 같은 위치에서 opacity .45→1 | 180ms | 200ms | 180ms |
| 드로어 열기 | 열기 → 패널 → opacity 0→1, x 거리→0 | 230ms | 240ms | 220ms |
| 드로어 닫기 | 닫기/Escape/바깥 클릭 → 같은 패널 → 현재 위치에서 바깥으로 | 150ms | 150ms | 140ms |
| 입력 오류 | 검증 → 첫 오류 입력 → x 0→-4→4→0px와 오류 문구·초점 | 200ms | 220ms | 180ms |
| 표 재배치·시간 목록 | 필터/정렬 → 같은 주문 ID의 이전→새 행 위치; 새 행 y 8→0px / 날짜 선택 → 시간 목록 y 8→0px | 200ms | 220ms | 180ms |

드로어 이동 거리는 Paper 24px, Object 28px, Frame 20px이다. easing은 Paper `cubic-bezier(.2,.8,.2,1)`, Object `cubic-bezier(.22,1,.36,1)`, Frame `cubic-bezier(.2,.8,.2,1)`. 배경 opacity는 별도 160ms ease-out이며 주 패널과 분리한다.

전환 중 새 입력이 들어오면 현재 계산된 transform·opacity·height·width를 읽고 이전 WAAPI를 취소한다. 탭은 표시 노드를 유지하고 경계선 폭을 제외한 실제 탭 위치에서 정렬한다. 드로어는 현재 위치에서 역전환하고 요청 세대가 유효할 때만 퇴장 후 dialog.close를 실행한다. 열림 상태에서 비교 모드를 바꾸면 modal/modeless 상태를 전환하고 데이터와 초점을 유지한다. 실제 모달에는 native dialog의 키보드 격리를 쓰고 닫힌 뒤 트리거로 복원한다. 비교 화면의 두 패널은 modeless/in-flow여서 한쪽이 다른 쪽을 가리지 않는다.

저장/제출은 900ms 로컬 시뮬레이션이다. 저장은 실패/재시도를 포함하며 폼 오류는 로컬 입력 검증이다. 백엔드 연결 또는 서버 실패 처리를 구현했다고 주장하지 않는다. 재입력·초기화·destroy는 이전 타이머를 무효화한다.

prefers-reduced-motion과 수동 모션 줄이기에서 WAAPI 이동은 생략한다. 선택/오류/결과는 즉시 읽힌다. 상세의 0.5×/0.25×는 전환 경로를 살펴보는 재생 도구다. 목록 전체의 순차 등장 효과는 없다. 화면 밖과 문서 비활성 상태에서 실행을 중단한다.

## 구현 위치와 재사용

- component-model.js: 안정된 legacy ID → componentId와 기본 styleId. 기존 dark-ai/light-project 앵커·별칭을 보존한다.
- site-catalog.js: 기능 데이터·사용 맥락·검색·실행 경로 설명. 스타일별 소속 컴포넌트 목록을 중복 작성하지 않는다.
- style-tokens.js: 색·활자·간격·표면·모션의 실제 레지스트리. style-system.js: 선택 컴포넌트의 스타일 CSS.
- library-components.js: 버튼·입력 폼·탭·드로어의 공통 DOM·의미·키보드·상태.
- legacy-components.js: 나머지 8개 컨트롤러·마크업·선택 CSS. 기존 site-inputs.js/site-content.js는 이 구현을 호출하는 호환 API다.
- site-runtime.js: CSS만 바꾸는 setStyle, 모션 취소/가시성, snapshot/restore/subscribe, selected-only 독립 HTML 내보내기.
- gallery.js / gallery.css / collection-home.js: 중립 탐색, 작은 리스트, 직접 조작, 동일 상태 비교와 코드보기.
- gallery-design.js: 같은 토큰과 실제 renderer/controller로 가이드를 렌더링한다.

실행 HTML은 선택한 컴포넌트의 markup·CSS·wire와 현재 스타일의 토큰/규칙을 포함한다. 다른 컴포넌트의 분기 JS나 상품 이미지를 포함하지 않는다. 외부 런타임·폰트·API·이미지 의존성이 없다. 엔진/가이드에서 보존한 두 대표 화면은 원래의 라이선스 고지를 유지한다.

## 출처·검증·수정 기록

[실제 소스 분석](../../docs/ui-motion-style-source-analysis.md)에 정확한 URL, 확인일, 라이선스, 관찰 사실과 우리 선택, 채택/제외 이유를 기록했다. Behance는 구도와 시각 위계만 관찰했다. 원본 코드나 사진·로고·문구는 복제하지 않았다. 새 라이브러리, 유료 구독, API 키, 외부 폰트·Unsplash 이미지를 추가하지 않았다. 새 썸네일은 자체 UI 스크린샷이다.

[현재 검증 및 남은 한계](../../docs/ui-motion-style-library.md)에 1440/1180/390 CSS 뷰포트 렌더링, 실제 조작/연속 역전환, 전후 화면과 이후 수정 이유를 구분한다. node scripts/test-ui-motion-showcase.mjs, node scripts/test-ui-motion-styles.mjs, node scripts/test-ui-motion-guide.mjs 및 scripts/verify-all.sh를 실행한다. 빌드 통과를 시각·모션 검증으로 대신하지 않는다.
