# UI·모션 스타일 라이브러리

2026-10-20. 기능(componentId), 표현(styleId), 상태(snapshot)를 분리한다. 콘텐츠·스토어·업무는 사용 맥락이다. 기존 ID·URL·상태 전이는 보존한다.

## 탐색·비교·캡처

홈은 최대 960px, 높이 84px, 간격 10px, 패딩 14×16px, 반경 11px의 작은 가로형 링크 세 개다. 54px 미리보기(모바일 50px)는 collection-home.js에서 같은 폼을 현재 토큰으로 그리는 인라인 SVG다. 외부 이미지·폰트·작동하는 폼 컨트롤을 불러오지 않는다. 검증용 캡처 345개는 저장소 밖으로 옮겼다. .gitignore로 기존 캡처 경로의 재추가를 막는다. 서비스에서 사용하는 자체 상품 사진 두 장은 유지한다.

/components/의 컴포넌트 우선 탐색과 /paper/, /object/, /frame/의 스타일 우선 탐색을 유지한다. 검색·필터·코드보기는 중립적인 공통 UI다. 목록에서는 직접 조작하며 명시적인 자세히 보기만 상세를 연다.

대표 4종은 같은 DOM·문구·데이터·상태를 사용한다. 비교는 같은 400px 최대 너비다. 모바일은 한 위치에서 스타일을 전환한다. setStyle은 CSS와 모션 설정만 바꾸므로 입력 노드·선택·포커스를 유지한다. Frame 탭은 실제 데모 컨테이너 340px 이상이면 세로, 작으면 가로다. 시각 방향과 aria-orientation·방향키를 함께 바꾼다.

### 입력 초점과 모바일 확대

모든 UI·모션 경로의 키보드 입력 필드(`input`의 텍스트 계열·숫자·검색·이메일, `textarea`, `select`, 편집 가능한 영역)는 실제 렌더링 글자 크기를 **최소 16px**로 유지한다. Paper/Object/Frame의 `--input-font-size: 16px`가 같은 규칙을 제공한다. 본문·라벨·버튼·차트 수치는 각 스타일의 위계를 유지하며, 편집 가능한 글자에만 별도 크기를 적용한다. 목록·확대 보기·가이드 예제·복사용 필드·독립 HTML에서 동일하게 적용한다. 기존 AI/대시보드 장면과 숨김 메모의 이전 가이드도 16px를 유지한다. `maximum-scale`, `user-scalable=no`, `transform:scale(...)`를 이용해 확대를 억제하지 않는다. 사용자가 손가락으로 확대하는 기능은 그대로 둔다.


## 색과 상태

| 역할 | Paper | Object | Frame |
| --- | --- | --- | --- |
| 페이지 바탕 | `#f7f7f5` | `#f1efea` | `#f2f5f9` |
| 기본 표면 | `#ffffff` | `#ffffff` | `#ffffff` |
| 제목·본문 | `#171717` | `#242321` | `#17243a` |
| 보조 문구 | `#66645f` | `#625d55` | `#596b80` |
| 비활성 글자 | `#65645f` | `#625e58` | `#586a7d` |
| 구획선 | `#deded8` | `#d6d1c8` | `#d8e0e9` |
| 입력·제어 경계 | `#85847e` | `#858078` | `#7d8b9d` |
| 주요 행동 | `#a72f24` | `#39352f` | `#1748b8` |
| 주요 행동 글자 | `#ffffff` | `#ffffff` | `#ffffff` |
| 선택 면 | `#f8e9e6` | `#e8e3da` | `#e5edff` |
| 오류 | `#a32620` | `#a12622` | `#a3262e` |
| 성공 | `#17633f` | `#17613f` | `#17633f` |

본문·보조는 바탕 또는 흰 표면 위에, on-accent는 accent 위에 쓴다. 입력 경계는 구조 구분선보다 진한 control-border를 쓴다. 선택은 표시선/면과 aria-selected·aria-pressed, 오류는 문구·aria-invalid·aria-describedby, 비활성은 disabled와 점선 경계로 구분한다. 색만으로 상태를 전달하지 않는다. 긴 오류는 입력 바로 아래에 놓고 높이를 고정하지 않는다.

## Paper

가는 선과 큰 활자로 읽는 흐름을 만듭니다.

- 타이포와 선으로 묶는 편집형 표현이다. 제목은 시스템 명조 26px/1.22, 본문은 산세리프 14px/1.65다. 명조가 없는 환경은 serif로 대체하며 외부 폰트를 내려받지 않는다.
- 헤더와 본문 사이 검은 규칙선, 상자 없는 48px 입력과 하단 경계, 수직 리듬으로 묶는다. 라벨/입력/오류 사이 3px, 필드 묶음은 8px 위·6px 아래다. 리셋은 텍스트와 선으로 약하게 둔다.
- 탭은 가로 제목과 2px 밑줄이다. 패널은 이동 없이 밝기만 이어진다. 드로어는 24px 내부 여백과 직선 경계가 있는 종이 면이다.
- 권장: 긴 설명은 본문 폭 안에서 자연스럽게 줄 바꿈하고 입력은 아래로 늘린다. 피하기: 모든 필드를 별도 카드에 넣거나 면 전체를 강조색으로 채우기.
- 색 면적 설계 목표: 종이·흰 면 약 78% · 잉크와 선 18% · 빨강 4%. 실제 화면의 면적을 계측한 값은 아니다.
- 아이콘 18px/선 1.7px, 제어 터치 높이 44px 이상. 긴 한국어는 keep-all + overflow-wrap:anywhere, 오류/결과는 자르지 않는다.

실제 실행과 가이드가 공유하는 tokens(style-tokens.js):

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
--radius: 0px;
--pad: 16px;
--gap: 12px;
--font-size: 14px;
--line-height: 1.65;
--label-size: 12px;
--heading-size: 26px;
--heading-weight: 600;
--heading-leading: 1.22;
--heading-font: "Iowan Old Style", "AppleMyungjo", "Batang", Georgia, serif;
--meta-size: 11px;
--focus-ring: #a72f24;
--control-radius: 0px;
--control-min-height: 44px;
--input-font-size: 16px;
--button-radius: 0px;
--panel-radius: 0px;
--shell-radius: 0px;
--field-min-height: 48px;
--field-surface: transparent;
--chrome-surface: #ffffff;
--mobile-pad-y: 14px;
--mobile-pad-x: 12px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
```

| 트리거 → 대상 | 시작 → 종료·공간 관계 | 시간 |
| --- | --- | --- |
| 탭 선택 → 표시 | 밑줄이 가로로 이동 | 220ms |
| 탭 선택 → 내용 | 이동 없이 opacity .36 → 1 | 200ms |
| 제출 완료 → 결과 | opacity .45 → 1, 같은 결과 위치 | 180ms |
| 드로어 열기 → 패널 | x 40px · opacity 0 → x 0px, scale 1 · opacity 1 | 230ms |
| 드로어 닫기 → 패널 | 현재 x·scale·opacity → x 40px, scale 1, opacity 0 | 150ms |

easing: `cubic-bezier(.2,.8,.2,1)`. 버튼은 y 1px 눌림 150ms, 저장 버튼의 즉각 반응은 scale .97→1 150ms다. 탭 표시와 드로어는 현재 transform·opacity·width·height를 읽은 뒤 이전 실행을 취소한다. 방향을 바꾸면 현재 위치에서 새 목표로 간다. 드로어는 퇴장 후 닫고 열었던 버튼으로 초점을 복귀한다. reduced-motion은 이동을 생략하고 선택·오류·성공 문구를 즉시 반영한다.

## Object

짙은 재료감과 얕은 깊이로 선택을 드러냅니다.

- 묶인 제어와 얕은 깊이를 사용하는 재료형 표현이다. 제목은 산세리프 22px/1.22·700, 본문은 14px/1.55다.
- 바탕 16px 반경, 흰 제어 묶음 14px, 입력 8px·48px 높이, 버튼 9px를 구분한다. 라벨/입력/오류 7px, 필드 사이 14px, 흰 면 내부 18px다. 입력의 내부 음영과 주요 버튼의 낮은 그림자로 손에 잡히는 경계를 만든다.
- 탭은 흰 선택 면이 홈 안에서 옆으로 이동한다. 내용은 선택 방향으로 10px만 이동한다. 드로어는 화면에서 12px 떨어진 반경 16px 패널이며 .98→1 확대로 들어온다.
- 권장: 관련 입력만 하나의 흰 면으로 묶고 동의와 행동을 뒤에 둔다. 피하기: 모든 문구·상품·상태를 각각 중첩 카드로 감싸기.
- 색 면적 설계 목표: 밝은 면 약 76% · 차콜과 경계 20% · 강조 4%. 실제 화면의 면적을 계측한 값은 아니다.
- 아이콘 18px/선 1.7px, 제어 터치 높이 44px 이상. 긴 한국어는 keep-all + overflow-wrap:anywhere, 오류/결과는 자르지 않는다.

실제 실행과 가이드가 공유하는 tokens(style-tokens.js):

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
--heading-size: 22px;
--heading-weight: 700;
--heading-leading: 1.22;
--heading-font: system-ui, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", sans-serif;
--meta-size: 12px;
--focus-ring: #39352f;
--control-radius: 8px;
--control-min-height: 44px;
--input-font-size: 16px;
--button-radius: 9px;
--panel-radius: 14px;
--shell-radius: 16px;
--field-min-height: 48px;
--field-surface: #f7f5f1;
--chrome-surface: #f1efea;
--mobile-pad-y: 14px;
--mobile-pad-x: 12px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
```

| 트리거 → 대상 | 시작 → 종료·공간 관계 | 시간 |
| --- | --- | --- |
| 탭 선택 → 표시 | 선택 면이 가로로 이동 | 220ms |
| 탭 선택 → 내용 | 선택 방향 x ±10px → 0, opacity .72 → 1 | 220ms |
| 제출 완료 → 결과 | opacity .45 → 1, 같은 결과 위치 | 200ms |
| 드로어 열기 → 패널 | x 28px, scale 0.98 · opacity 0 → x 0px, scale 1 · opacity 1 | 280ms |
| 드로어 닫기 → 패널 | 현재 x·scale·opacity → x 28px, scale 0.98, opacity 0 | 190ms |

easing: `cubic-bezier(.22,1,.36,1)`. 버튼은 y 1px 눌림 150ms, 저장 버튼의 즉각 반응은 scale .97→1 150ms다. 탭 표시와 드로어는 현재 transform·opacity·width·height를 읽은 뒤 이전 실행을 취소한다. 방향을 바꾸면 현재 위치에서 새 목표로 간다. 드로어는 퇴장 후 닫고 열었던 버튼으로 초점을 복귀한다. reduced-motion은 이동을 생략하고 선택·오류·성공 문구를 즉시 반영한다.

## Frame

정렬된 값과 선택 면으로 작업 상태를 보여줍니다.

- 행·열·기준선을 사용하는 도구형 표현이다. 제목은 18px/1.35·700, 본문은 13px/1.55, 라벨은 12px다.
- 면은 평평하게 두고 62px 최소 헤더 밴드, 라벨 92px + 12px 간격 + 가변 입력의 행으로 구성한다. 편집 글자는 16px, 입력 높이는 44px, 행 최소 60px, 오류는 입력 열 아래다. 컨테이너 320px 이하에서 라벨을 위로 옮긴다. 주요 행동은 오른쪽의 내용 크기로 정렬한다.
- 340px 이상에서는 104px 세로 탭 레일과 가변 패널, 작으면 가로 탭을 쓴다. 드로어는 가장자리에 붙고 헤더는 내용 높이, 항목은 위로 정렬, 합계/행동은 하단에 고정된 세 행 grid다. 행을 빈 높이로 늘리지 않는다.
- 권장: 숫자는 tabular-nums, 라벨과 값은 같은 기준선, 상태는 행동 뒤의 같은 결과 영역. 피하기: 각 행에 다른 패딩을 주거나 저장 버튼을 남은 폭 전체로 늘리기.
- 색 면적 설계 목표: 작업 면 약 80% · 잉크와 경계 16% · 파랑 4%. 실제 화면의 면적을 계측한 값은 아니다.
- 아이콘 18px/선 1.7px, 제어 터치 높이 44px 이상. 긴 한국어는 keep-all + overflow-wrap:anywhere, 오류/결과는 자르지 않는다.

실제 실행과 가이드가 공유하는 tokens(style-tokens.js):

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
--radius: 4px;
--pad: 12px;
--gap: 8px;
--font-size: 13px;
--line-height: 1.55;
--label-size: 12px;
--heading-size: 18px;
--heading-weight: 700;
--heading-leading: 1.35;
--heading-font: system-ui, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", sans-serif;
--meta-size: 11px;
--focus-ring: #1748b8;
--control-radius: 4px;
--control-min-height: 44px;
--input-font-size: 16px;
--button-radius: 4px;
--panel-radius: 0px;
--shell-radius: 3px;
--field-min-height: 44px;
--field-surface: #ffffff;
--chrome-surface: #f7f9fc;
--mobile-pad-y: 14px;
--mobile-pad-x: 12px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
```

| 트리거 → 대상 | 시작 → 종료·공간 관계 | 시간 |
| --- | --- | --- |
| 탭 선택 → 표시 | 선택 선이 세로 목록을 따라 이동 · 좁은 폭에서는 가로 이동 | 160ms |
| 탭 선택 → 내용 | x 4px → 0, opacity .84 → 1 | 160ms |
| 제출 완료 → 결과 | opacity .45 → 1, 같은 결과 위치 | 160ms |
| 드로어 열기 → 패널 | x 20px · opacity 0 → x 0px, scale 1 · opacity 1 | 180ms |
| 드로어 닫기 → 패널 | 현재 x·scale·opacity → x 20px, scale 1, opacity 0 | 140ms |

easing: `cubic-bezier(.2,.7,.2,1)`. 버튼은 y 1px 눌림 140ms, 저장 버튼의 즉각 반응은 scale .97→1 140ms다. 탭 표시와 드로어는 현재 transform·opacity·width·height를 읽은 뒤 이전 실행을 취소한다. 방향을 바꾸면 현재 위치에서 새 목표로 간다. 드로어는 퇴장 후 닫고 열었던 버튼으로 초점을 복귀한다. reduced-motion은 이동을 생략하고 선택·오류·성공 문구를 즉시 반영한다.

## 재생 제어

목록의 **모션** 버튼, 상세·독립 HTML의 **다시 재생**은 해당 컴포넌트의 실제 상태 전환을 실행한다. 탭은 다음 탭, 차트는 다른 기간, FAQ는 첫 답변, 주문 표는 전체/결제 완료 필터, 캘린더는 가능한 날짜와 시간 목록을 시연한다. 입력 폼은 현재 값을 검증하며 사용자가 쓴 값을 덮어쓰지 않는다. 확인창은 열기만 하며 자동으로 삭제·주문·예약을 확정하지 않는다. 초기화는 재생과 구분한다.

상세·독립 HTML에는 일시정지/이어 재생, 1×·0.5×·0.25×, 초기화를 제공한다. 느린 속도는 관찰용이고 아래 기본 duration과 구분한다. 화면 밖이나 비활성 탭에서는 실행을 멈추고, 재진입하면 이어 간다. 새 입력은 이전 전환을 취소하고 현재 위치에서 최신 목표로 바꾼다. 오류의 초점·선택·완료 문구는 애니메이션 없이도 이해되어야 한다.


## 공통 동작과 코드 연결

- style-tokens.js: 역할 색·타입·표면·크기·모션의 정본. gallery-design.js도 같은 값을 읽는다.
- style-system.js: 공통 기본선과 컴포넌트별 Paper/Object/Frame 표현. field-surface, chrome-surface, heading-font, button-radius, panel-radius, shell-radius, field-min-height는 실제 CSS에서 사용한다.
- library-components.js: 폼 검증·탭 값·드로어 수량/상태·키보드·focus 처리. 스타일마다 컨트롤러를 복제하지 않는다. 탭은 CSS --ui-tab-axis를 읽고 현재 방향을 aria-orientation에 반영한다.
- site-runtime.js: setStyle, snapshot/restore/subscribe, 현재 위치를 읽는 취소 처리, reduced-motion, native modal Tab 순환. 비교 패널은 modeless로 두어 두 열의 탐색을 허용한다.
- standaloneSite: 선택한 컴포넌트의 실제 markup/CSS/wire와 선택 스타일의 토큰·모션만 직렬화한다. 별도 가짜 예제나 관련 없는 분기·외부 의존성이 없다.

## 출처·판정과 검증

[실제 소스·라이선스 분석](../../docs/ui-motion-style-source-analysis.md)의 Motion Primitives Animated Background/Dialog, Animata Fluid Tabs/Status Button은 2026-10-19 main 소스와 MIT를 확인했다. React/Motion/Tailwind 코드를 복사·설치하지 않고 원리를 vanilla DOM·WAAPI로 독립 구현했다. 고정 SHA·릴리스는 확인하지 못했다. Behance는 정확한 프로젝트 URL과 관찰한 시각 원리만 기록했고 코드를 확인했다고 주장하지 않는다. 기존 Lucian 예제의 MIT 고지는 보존한다. 이번 수정에 새 외부 코드·폰트·사진·API·결제는 없다.

실제 렌더링/조작 범위, 두 차례 비교 뒤 수정한 이유, 캡처 정리는 [구현·검증 보고서](../../docs/ui-motion-style-library.md)에 기록한다. 과거 108건 기록과 이번 27건 렌더링을 같은 검증 횟수로 합치지 않는다. 자동 계약은 scripts/test-ui-motion-{showcase,styles,guide}.mjs, 전체 사이트는 scripts/verify-all.sh로 확인한다. 정지 캡처를 모션 검증으로 대체하지 않는다.
