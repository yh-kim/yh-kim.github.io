# UI·모션 갤러리 컴포넌트·스타일·상태 출처 분석

확인일: 2026-10-19. 대상: 버튼·폼·탭·드로어 네 기능과 Paper·Object·Frame 세 시각 스타일. **네 기능 모두 세 스타일에서 같은 의미와 상태를 유지**하며, 스타일만 달라진다. 이 문서는 공개 프로젝트의 실제 컴포넌트 소스를 읽고 구현 원리를 추린 기록이다. 외부 코드·자산을 배포 파일로 복사하지 않는다. 아래 GitHub 링크는 확인 당시 `main`이며 고정 커밋 SHA나 릴리스 버전은 확인하지 못했다. 따라서 이 문서의 소스 판독 기준은 링크와 확인일이다.

## 시각 자료와 코드 자료의 경계

| 스타일 | 기존 시각 관찰 | 이번 구현에서 선택하는 규칙 |
| --- | --- | --- |
| Paper | [October Custom Publishing](https://www.behance.net/gallery/179562053/Modern-Web-Design-for-a-Leading-Magazine-Design-Studio)의 큰 제목·정렬된 두 패널·작은 단일 CTA. [기존 관찰 기록](ui-motion-gallery-refinement-v2.md)의 약 46:54는 대표 이미지 한 장의 육안 추정이다. | 큰 제목, 선명한 구분선, 좁은 반경과 충분한 읽기 여백을 버튼·폼·탭·드로어 모두에 적용한다. |
| Object | [Homevo](https://www.behance.net/gallery/247907919/Homevo-Modern-Ecommerce-Furniture-Website-UIUX-Design)의 중성색 여백·제품 중심·구매 행동의 묶음. | 따뜻한 중성색, 부드러운 모서리와 표면 깊이를 네 기능 모두에 적용한다. |
| Frame | [APX](https://www.behance.net/gallery/243179235/APX-UXUI-Case-for-SaaS-IT-Management-Platform)의 조용한 표면·촘촘한 데이터/제어 관계. | 차분한 청색 강조, 명료한 제어 밀도와 작은 반경을 네 기능 모두에 적용한다. |

Behance 작품은 정적 화면의 **시각 원칙** 근거다. 해당 페이지에서 동작 코드, 원본 CSS 토큰, 실제 모션 타이밍을 얻거나 검증하지 않았다. 위 구현 규칙과 수치는 작품 제작자의 명세가 아니라 이 저장소의 선택이다. 기존 대조에 기록된 대표 이미지 모듈 ID는 위 표 순서대로 `1014297309`·`1434317651`·`1402933193`이다. 이번 문서에서는 해당 이미지의 직접 URL을 복구하지 못했으며, 참조 캡처는 [기존 정제 기록](ui-motion-gallery-refinement-v2.md)에 설명된 세션 로컬 시각화 공간에만 있다. 저장소의 [Paper 화면](assets/ui-motion-gallery/refinement-v2/after-paper-1440.png)·[Object 화면](assets/ui-motion-gallery/refinement-v2/after-object-1440.png)·[Frame 화면](assets/ui-motion-gallery/refinement-v2/after-frame-1440.png)은 **자체 구현 캡처**이지 Behance 원본 캡처가 아니다. [컨셉 검토](ui-motion-gallery-concepts-review.md)의 접근 범위도 따른다. [스타일 시스템](../js/ui-motion-showcase/style-system.js)의 `contexts`는 각 스타일이 잘 맞는 사용 맥락의 예시이며, 기능 배정이나 제한이 아니다.

## 실제 오픈소스 구현 4개

### 1. Motion Primitives · Animated Background → 선택 표시의 이동

- **출처·기준:** [공식 소스 `components/core/animated-background.tsx`](https://github.com/ibelick/motion-primitives/blob/main/components/core/animated-background.tsx), [공식 문서](https://motion-primitives.com/docs/animated-background), `main` 확인일 2026-10-19. [저장소 MIT 라이선스](https://github.com/ibelick/motion-primitives/blob/main/LICENCE.md)는 원문 또는 상당 부분을 복사할 경우 고지 보존을 요구한다.
- **DOM·레이아웃·스타일:** 고유 `data-id`를 가진 자식마다 `relative inline-flex` 호스트를 두고, 활성 자식 안에 `absolute inset-0` 배경과 앞쪽 내용 레이어를 둔다. 색·반경은 호출자의 `className`으로 주며 고정된 제품 토큰이 없다.
- **상태·이벤트:** `activeId`는 내부 상태이며 `defaultValue` 변경을 관찰한다. 기본은 자식 클릭으로 변경; `enableHover`이면 mouseenter 선택·mouseleave 해제. `onValueChange`를 호출한다. 이 기본 구현 자체는 `tablist`/`tab` ARIA, 키보드 이동, 실제 패널 전환을 만들지 않는다.
- **모션:** 활성 배경을 고유 `layoutId`로 이어 붙여 위치를 옮긴다. 처음부터 기본 선택이 있으면 초기 불투명도 1, 없으면 0→1이며 이전 배경은 1→0으로 퇴장한다. `transition`은 호출자가 제공한다. 다시 고르면 Motion의 같은 레이아웃 애니메이션 대상이 새 위치로 향하지만 명시적인 취소·역방향·`prefers-reduced-motion` 분기는 소스에 없다.
- **의존성·성능·접근성:** React, `motion/react`, `cn`/Tailwind 체계가 필요하다. 항목마다 배경 노드를 만들기보다 활성 항목에만 배경을 렌더한다. `layoutId`는 시각 표시만 해결하므로 우리 공통 탭에는 독립적인 탭 의미·포커스·패널 상태가 필수다.

### 2. Animata · Fluid Tabs → 공통 설정 탭의 상호작용

- **출처·기준:** [공식 소스 `animata/tabs/fluid-tabs.tsx`](https://github.com/codse/animata/blob/main/animata/tabs/fluid-tabs.tsx), 함께 설치되는 [공식 공유 키보드 헬퍼와 전체 예제](https://www.animata.design/docs/tabs/fluid-tabs), `main`/문서 확인일 2026-10-19. [Animata MIT 라이선스](https://github.com/codse/animata/blob/main/LICENSE.md) 확인.
- **DOM·레이아웃·스타일:** `nav` 안 `role="tablist"`, 각 `button role="tab" aria-selected` 구조다. `rounded-full bg-muted p-1`, 내부 `gap-1`, 각 버튼 `px-4 py-2.5`; 활성 버튼의 `absolute inset-0` pill과 위쪽 텍스트 레이어를 겹친다. 이 색·간격은 Animata의 Tailwind 토큰이며 우리 세 스타일의 값으로 그대로 복사하지 않는다.
- **상태·이벤트:** 제어형 `activeIndex`/`onActiveIndexChange` 또는 내부 인덱스를 지원한다. 클릭은 곧 선택한다. 방향키와 Home/End는 포커스만 이동하며 Enter/Space가 선택을 확정하는 **수동 활성화**다. 선택·포커스 인덱스는 별도로 관리된다. 선택마다 `aria-selected`가 바뀐다.
- **모션:** 인스턴스별 `layoutId`로 표시 pill이 새 버튼으로 이동한다. 소스의 spring은 stiffness 380, damping 34, mass 0.75; 레이블은 scale 0.98↔1을 0.28초로 전환한다. 이 숫자는 **참고 소스의 값**이며 갤러리 권장 토큰이 아니다. 역선택은 같은 메커니즘으로 반대 방향 이동한다. 연속 선택 시 Motion의 현재 위치를 새 목표로 보낼 수 있지만 소스에 별도 취소 API는 없다. `motion-reduce:transition-none` 클래스가 버튼에 있으나 Motion pill/scale 애니메이션을 명시적으로 0으로 만드는 분기는 보이지 않는다.
- **의존성·성능·접근성:** React, `motion/react`, Tailwind, `cn`, 같은 폴더의 `shared.ts`가 필요하다. 고유 레이아웃 ID가 여러 탭 막대 간 간섭을 막는다. 문서는 시각적 탭 막대와 키보드 선택을 설명하지만 제공 소스에 대응 `tabpanel`, `aria-controls`, `aria-labelledby`는 없다. 우리 공통 구현은 패널 연결과 숨김 상태를 별도로 제공한다. 아래에 적은 자동 활성화는 이 소스의 수동 활성화와 다른 선택이다.

### 3. Motion Primitives · Dialog → 공통 장바구니 드로어의 생명주기

- **출처·기준:** [공식 소스 `components/core/dialog.tsx`](https://raw.githubusercontent.com/ibelick/motion-primitives/main/components/core/dialog.tsx), [공식 문서](https://motion-primitives.com/docs/dialog), `main` 확인일 2026-10-19. 라이선스는 위 Motion Primitives MIT 링크와 같다.
- **DOM·레이아웃·스타일:** 트리거는 진짜 `button`; 내용은 포털의 `<dialog>`이며 제목·설명 ID를 `aria-labelledby`/`aria-describedby`로 연결한다. 기본 모양은 화면 중앙, 둥근 패널, 어두운 backdrop이다. 장바구니처럼 오른쪽에서 나오는 드로어는 이 **상태/생명주기 원리**를 참고하고 위치·크기·스타일은 새로 만든다.
- **상태·이벤트:** 내부/제어형 `open`, `onOpenChange` 지원. 열림에 `showModal()`; `cancel`(Escape)은 기본 동작을 막고 상태를 닫힘으로 바꾼다. 내용 바깥 클릭과 닫기 버튼도 닫는다. 열릴 때 본문 스크롤을 잠그고 정리한다. 닫기 모션 완료 콜백은 여전히 닫힌 상태일 때만 `<dialog>.close()`를 호출한다.
- **모션:** 기본 initial opacity 0/scale .9 → animate opacity 1/scale 1, ease-out 0.2초. `exit` 상태는 전달 가능한 variants에 의존한다. 즉, 기본 코드만으로 오른쪽으로 빠지는 드로어 궤적을 얻는다고 주장할 수 없다. 열림 중 재열림의 취소 안전성을 소스만 보고 단정할 수 없다. `prefers-reduced-motion` 분기도 없다.
- **의존성·성능·접근성:** React, `motion/react`, 포털, Tailwind, Lucide, 별도 `usePreventScroll` 훅. 포털은 마운트 때 생성된다. 네이티브 모달 대화상자를 쓰지만 갤러리 구현은 닫힌 뒤 원 트리거 초점 복귀, 빠른 닫기/재열기, 여러 드로어와 스크롤 잠금 해제를 직접 확인해야 한다.

### 4. Animata · Status Button → 공통 저장과 제출 피드백

- **출처·기준:** [공식 소스 `animata/button/status-button.tsx`](https://github.com/codse/animata/blob/main/animata/button/status-button.tsx), [공식 문서](https://animata.design/docs/button/status-button), `main` 확인일 2026-10-19. 라이선스는 위 Animata MIT 링크와 같다.
- **DOM·레이아웃·스타일:** 고정 최소 폭의 `button` 안 상태 `span`을 교체한다. 원본 색은 teal, 크기는 `h-10 min-w-40`, 아이콘은 Lucide다. 갤러리에서는 각 스타일의 색과 44px 이상 터치 높이로 다시 정한다.
- **상태·이벤트:** 클릭 후 `loading`으로 전환하고 버튼을 비활성화한다. 데모에서는 1.5초 뒤 `Added to cart`, 다시 1.5초 뒤 초기 문구로 돌아간다. 이는 진짜 네트워크 결과가 아닌 타이머 시뮬레이션이며 실패 상태가 없다. 우리 폼은 유효성 오류와 로컬 타이머의 진행→완료를 제공한다. 저장 버튼에는 실패 체험과 재시도를 별도로 구현했다.
- **모션:** 상태 문구는 key 교체와 `AnimatePresence mode="wait"`로 이전 opacity 1→0, y 0→15 퇴장 후 다음 opacity 0→1, y -15→0 진입; 각 구간 0.075초. 성공 아이콘은 scale 0→1 spring. 로딩 아이콘은 계속 회전한다. 원본에는 중단·역방향·모션 줄이기·비동기 예외 처리·언마운트 타이머 정리 분기가 없다.
- **의존성·성능·접근성:** React, Motion, Lucide, Tailwind, `cn`. 버튼의 `disabled`는 중복 실행을 막는다. 그러나 처리/성공의 텍스트 변경이 스크린리더에 확실히 공지되도록 하는 live region은 소스에 없다. 우리 구현에는 버튼과 별도 `role="status"`/`aria-live="polite"`를 넣고, 폼 오류는 입력과 연결한다.

## 이 저장소의 독립 구현 계약

공개 소스의 모양·원리를 [공통 컴포넌트 구현](../js/ui-motion-showcase/library-components.js)과 [스타일 시스템](../js/ui-motion-showcase/style-system.js)에서 **독립적으로 재해석**했다. React, Motion, Tailwind, Lucide 또는 원본 소스 파일은 도입하지 않았다. 아래 네 기능은 Paper·Object·Frame 어디서나 같은 마크업과 상태 제어기를 쓰며, 색·서체·간격·반경·시간·이동 거리는 스타일 토큰이 정한다. 수치는 새 설계 토큰이며 Behance나 공개 컴포넌트의 검증된 값이 아니다.

| 공통 기능 | 실제 상태·DOM | 실제 모션·역전환 |
| --- | --- | --- |
| 버튼 | 문서 저장은 `idle → loading → success / error`이며 실패 체험 체크박스로 다음 시도의 결과를 고른다. 실패 후 다시 시도할 수 있다. 북마크와 팔로우는 서로 독립적인 `aria-pressed` 토글이다. 공유 버튼은 권한 없는 상태로 비활성화돼 있다. 결과는 `role="status"`에 표시한다. | 저장 요청은 900ms 로컬 타이머로 시뮬레이션한다. 새 요청·초기화·파괴가 이전 완료 타이머를 취소한다. 누름과 결과 상태에 짧은 애니메이션이 있다. 저장 해제나 서버 저장은 제공하지 않는다. |
| 폼 | 이름·이메일·동의 오류를 각 필드의 `aria-describedby` 대상과 `aria-invalid`로 표시하고 첫 오류에 초점을 옮긴다. 유효하면 `idle → pending → success`로 진행하며 결과를 `role="status"`에 알린다. 입력을 다시 하면 오류 집합을 지우고 `idle`로 돌아간다. | pending 동안 제출 버튼을 비활성화하고 900ms 로컬 타이머가 완료한다. 재입력·초기화·파괴는 이전 타이머를 취소한다. 결과 메시지에 짧은 투명도 전환이 있다. 서버 전송 및 모의 서버 실패는 없다. |
| 탭 | `tablist`/`tab`/`tabpanel`, 고유 ID, `aria-selected`·`aria-controls`·`aria-labelledby`와 숨긴 패널을 연결한다. 클릭과 방향키/Home/End는 **초점과 선택 패널을 함께 이동**한다. 패널의 설정 값은 다른 탭으로 갔다 와도 유지된다. | 선택 표시의 x/폭은 실제 탭 경계에서 계산한다. 연속 선택에서는 앞 애니메이션을 취소하고 현재 표시 위치에서 새 목표로 보낸다. 모션 줄이기에서는 표시를 즉시 맞춘다. 참고한 Animata 소스는 방향키로 초점만 이동하는 수동 활성화지만, 우리 패널은 즉시 표시되는 로컬 콘텐츠라 자동 활성화를 택했다. |
| 드로어 | 네이티브 `<dialog>`의 제목·닫기 버튼·Escape를 사용하고 닫힌 뒤 트리거로 초점을 돌린다. 상품 추가, 수량 변경, 삭제, 합계, 주문 완료와 다시 담기를 로컬 상태로 처리한다. 열고 닫아도 장바구니 값이 남는다. | 패널이 오른쪽에서 `translateX`로 진입·퇴장한다. 빠른 닫기→재열기는 진행 중 애니메이션을 취소하고 계산된 현재 위치에서 다시 열린다. 닫힘 애니메이션이 끝난 뒤 `dialog.close()`를 호출하며 모션 줄이기에서는 즉시 닫는다. 배경은 스타일별 반투명 `::backdrop`이다. |

컴포넌트의 `snapshot`·`restore`·`reset`·`replay`·`destroy` 계약으로 스타일 전환과 내보내기에서도 상태를 다룬다. 공통 검증 범위는 클릭·키보드·연속 역전환·오류/재시도·모션 줄이기·모바일 좁은 폭이다. 원본 소스의 완성도를 갤러리의 접근성/성능 보증으로 간주하지 않는다.
