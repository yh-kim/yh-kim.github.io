# UI·모션 스타일 라이브러리 구현·검증

2026-10-19. 기준 커밋 e9a8fb9의 실제 배포 화면과 저장소를 확인하고 수정했다. 이전 작업의 업종별 컨셉을 기능/스타일/상태로 분리했다. 기존 12개 항목과 14개 legacy ID, 홈·components·paper·object·frame·두 대표 화면·숨김 가이드 URL을 보존했다.

## 실제 화면에서 확인한 문제 5개

1. 업종별로 서로 다른 컴포넌트를 배정해 같은 기능의 스타일 비교가 불가능했다. 코드의 componentIds도 스타일당 4개로 나뉘었다.
2. 홈 썸네일은 구독 폼·노트 사진·차트처럼 서로 다른 내용을 보여줬다. 현재는 같은 입력 폼을 세 스타일로 렌더링한 크롭이다.
3. [기존 Object 1180px](assets/ui-motion-gallery/style-library/before-object-1180.png)에서 큰 상품 사진 두 장이 첫 화면을 차지했다. 장바구니의 제어·상태가 시각적 주제가 되도록 이미지 없는 동일 상품/가격 데이터로 교체했다. 기존 자체 생성 사진 파일은 삭제하지 않았다.
4. Frame의 워크스페이스→환경 설정→계정→개인 정보→계정 환경 제목이 반복됐다. 새 탭 데모는 계정 설정과 실제 패널 라벨로 정리했다.
5. 선택 항목의 내보내기에 여섯 컴포넌트의 CSS와 분기 JS가 함께 포함됐다. 이제 12개 모두 선택된 정의와 스타일만 직렬화한다.

## 변경 화면

- 홈: [이전 1180px](assets/ui-motion-gallery/style-library/before-home-1180.png) → [현재 1180px](assets/ui-motion-gallery/style-library/after-home-1180.png), [390px](assets/ui-motion-gallery/style-library/after-home-390.png). 작은 가로형 단일 링크 리스트를 유지했다.
- 대표 4종을 같은 데이터로 비교: [1440px](assets/ui-motion-gallery/style-library/matrix-1440.png), [1180px](assets/ui-motion-gallery/style-library/matrix-1180.png), [390px](assets/ui-motion-gallery/style-library/matrix-390.png).
- 나머지 8종: [390px 1](assets/ui-motion-gallery/style-library/extended-390-1.png), [390px 2](assets/ui-motion-gallery/style-library/extended-390-2.png), [1440px 1](assets/ui-motion-gallery/style-library/extended-1440-1.png), [1440px 2](assets/ui-motion-gallery/style-library/extended-1440-2.png).
- 실제 비교/가이드/내보내기: [폼 비교](assets/ui-motion-gallery/style-library/compare-form-1180.png), [드로어 비교](assets/ui-motion-gallery/style-library/compare-drawer-1440.png), [스타일 가이드](assets/ui-motion-gallery/style-library/guide-object-1180.png), [독립 HTML 폼 완료](assets/ui-motion-gallery/style-library/export-form-390.png).

전체 캡처는 assets/ui-motion-gallery/style-library/에 있다. 지정한 값은 CSS 뷰포트이며 브라우저의 스크린샷 출력 픽셀은 스크롤바/리사이즈 처리에 따라 다를 수 있다. 비교 매트릭스는 실제 캡처를 DOM 경계에 맞춰 크롭한 검토용 이미지이며 서비스 UI 자체를 합성한 것이 아니다.

## 구현 구조·변경 파일

| 파일 | 역할 |
| --- | --- |
| js/ui-motion-showcase/component-model.js | legacy ID, componentId, 기본 styleId 매핑 |
| style-tokens.js / style-system.js | 공통 토큰·가이드 데이터 / 선택 컴포넌트의 스타일 CSS |
| library-components.js | 버튼·폼·탭·드로어의 공통 의미·상태·키보드 |
| legacy-components.js | 나머지 8종의 독립 markup·wire·CSS |
| site-inputs.js / site-content.js | 동일 정의로 전달하는 호환 API, 중복 동작 제거 |
| site-runtime.js | 스타일만 교체, 모션 취소, 모달 초점, 상태 공유, 독립 HTML |
| site-catalog.js / site-concepts.js | 기능 데이터·사용 맥락·스타일 레지스트리의 호환 노출 |
| gallery.js / gallery.css / collection-home.js | 중립 탐색·필터·작은 리스트·비교·코드보기 |
| gallery-design.js / p/ui-motion/DESIGN.md | 실제 토큰·실행 경로와 좋은/나쁜 예 |
| p/ui-motion/{index,components/index,paper/index,object/index,frame/index}.html | 기존 진입점·명칭·캐시 버전 |
| p/hidden-memo/ui-motion-guide/index.md | 기존 숨김 가이드 URL |
| p/ui-motion/assets/style-{paper,object,frame}.png | 동일한 폼의 자체 스크린샷 크롭 |
| component-design.js / data.js / engine.js / index.js | 기존 엔진·대표 화면의 연결과 캐시 버전 유지 |
| scripts/test-ui-motion-{showcase,styles}.mjs | 호환·내보내기·스타일 분리·모션·모달 키보드 계약 |

내부 state는 스타일을 포함하지 않는다. 스타일 전환은 setStyle로 기존 shadow DOM의 스타일 시트만 교체한다. 비교의 두 인스턴스는 snapshot/restore/subscribe를 통해 같은 데이터를 공유한다. 가이드를 바꾸는 경우에도 값을 전달하고 의미가 같은 입력으로 초점·선택 범위를 복원한다. 비교의 두 열은 같은 폭이며 모바일은 한 화면 전환이다.

## 전체 항목·URL·구현 상태

| componentId | 기존 anchor | 기본 호환 스타일 | 구현/주요 동작 |
| --- | --- | --- | --- |
| button | /p/ui-motion/object/#dark-ai--beam | object | 구현됨 · 직접 조작 확인 |
| form | /p/ui-motion/paper/#dark-ai--prompt | paper | 구현됨 · 직접 조작 확인 |
| tabs | /p/ui-motion/frame/#dark-ai--controls | frame | 구현됨 · 직접 조작 확인 |
| drawer | /p/ui-motion/object/#dark-ai--dialog | object | 구현됨 · 직접 조작 확인 |
| menu | /p/ui-motion/paper/#dark-ai--layers | paper | 구현됨 · 직접 조작 확인 |
| accordion | /p/ui-motion/paper/#light-project--tasks | paper | 구현됨 · 직접 조작 확인 |
| tags | /p/ui-motion/paper/#light-project--quick-add | paper | 구현됨 · 직접 조작 확인 |
| upload | /p/ui-motion/frame/#dark-ai--process | frame | 구현됨 · 직접 조작 확인 |
| table | /p/ui-motion/object/#light-project--filters | object | 구현됨 · 직접 조작 확인 |
| calendar | /p/ui-motion/object/#light-project--calendar | object | 구현됨 · 직접 조작 확인 |
| chart | /p/ui-motion/frame/#light-project--chart | frame | 구현됨 · 직접 조작 확인 |
| dialog | /p/ui-motion/frame/#light-project--dialog | frame | 구현됨 · 직접 조작 확인 |

모든 스타일 페이지에서 같은 12개를 제공한다. 기본 호환 스타일은 예전 딥링크의 진입값이며 기능의 소속이 아니다. /p/ui-motion/#dark-ai--beam처럼 루트의 옛 앵커도 기본 스타일 페이지로 연결하고 선택 쿼리를 보존한다. 두 hero ID와 ui- 접두 별칭도 유지한다.

## 참고 → 선택한 원리

[정확한 소스·라이선스 분석](ui-motion-style-source-analysis.md). 기존 Behance 캡처 3장을 다시 시각 검토했고 프로젝트 URL과 대표 모듈 ID를 기록했다. 정렬선·여백·색 면적·정보 밀도의 원리만 적용했다. Behance의 실제 코드를 확인했다고 주장하지 않는다.

Motion Primitives Animated Background의 단일 선택 표시 위치 관계, Animata Fluid Tabs의 의미/키보드 검토, Motion Primitives Dialog의 native dialog와 퇴장 후 닫힘, Animata Status Button의 비동기 상태 표시를 분석했다. React/Motion/Tailwind와 원본 소스를 설치·복사하지 않고 vanilla DOM/WAAPI로 독립 구현했다. 공식 저장소의 main과 MIT는 확인했지만 고정 SHA/릴리스는 확보하지 못했다. 라이선스 전문·출처는 연결 문서에서 구분한다. 기존 Lucian 예제의 MIT 고지는 두 보존 화면에 남겨 두었다.

새 외부 폰트·Unsplash/Unsplash+·유료 이미지·API·라이브러리는 쓰지 않았다. 자체 상품 사진은 보존하되 새 비교 데모와 홈에서 불러오지 않는다. 새 썸네일은 우리 UI를 촬영했다.

## 렌더링·실제 조작 검증

- 수정: 12종, 36개 스타일 조합.
- 실제 시각 확인: 12종 × 3스타일 × 1440/1180/390 = **108개 렌더링 사례**. [기계 판독 기록](ui-motion-style-qa.json). 미렌더링 스타일 조합 0개. 모든 대표 4종에서 한글 줄바꿈·입력 경계·터치 크기·가로 넘침을 확인했다. 긴 표/예약/차트는 세로 스크롤이 필요하며 아래 상태/행동은 별도 조작으로 확인했다.
- 실제 상태 조작: 대표 4종 × 3스타일 = 12조합; 나머지 8종도 Frame 8조합과 Paper/Object 모바일 16조합에서 주요 흐름을 확인했다. 총 36조합이다. 모든 가능한 상태의 조합을 전수 회귀한 것은 아니다.
- 버튼: 세 스타일 모두 loading에서 중복 차단, 실패, 재시도, 성공. 북마크·팔로우는 별도 상태.
- 폼: 세 스타일에서 오류 3개, 첫 오류 초점, 긴 한국어/긴 이메일, 동의·제출·성공. 스타일 전환 뒤 값과 입력 초점 유지. 가이드 전환에서도 값/초점 확인.
- 탭: 세 스타일에서 개인정보/알림/보안, Home/End·방향키, 긴 표시 이름과 선택 값 유지. 단일 표시 노드를 현재 위치에서 옮긴다.
- 드로어: 세 스타일에서 수량 합계 ₩100,000, 삭제 후 empty, 다시 담기, ₩82,000 로컬 완료, Escape와 초점 복원. 390px에서 Tab/Shift+Tab 순환을 확인했다.
- 나머지 8종: 메뉴 복제 2개, 태그 추가 3/6와 삭제, 업로드 취소/재시도/완료, 여러 FAQ 열림과 빠른 역전환, 차트 4주 ₩12,380,000와 키보드 구간 선택, 주문 empty/초기화/2건 배송 완료, 예약 10월 20일 13:30, 파일명 검증/삭제/실행 취소. 삭제 비교에서 양쪽 pending 파일명과 입력 동기화도 확인했다.
- 검색·유형·사용 맥락 필터: 콘텐츠 맥락 9개, 없는 검색 결과, 전체 초기화 12개. 리스트 빈 영역은 상세 이동을 하지 않으며 명시적 버튼만 연다.
- 독립 HTML: 4종을 별도 로컬 서버에서 실행해 폼/탭/오류 버튼/드로어 합계·Escape·포커스 확인. 실제 코드보기의 Object/form HTML 복사와 완료 피드백 확인, 이전 빈 클립보드 복원.
- 실제 파일 선택: unsupported.txt는 형식 오류, 5MB+1B oversize.pdf는 용량 오류, 작은 valid.pdf 테스트 파일은 로컬 완료.
- 현재 갤러리와 독립 HTML의 오류/경고 콘솔 0건.

정지 화면으로 모션 검증을 대신하지 않았다. 정상 속도로 연속 탭·접기·열기·닫기를 조작했고, 드로어는 0.25×에서 실제 computed 값을 읽었다. 열림 중 opacity .792601 / x 4.14799px, 닫힘 중 .076536 / x 18.4693px, 반대 입력 뒤 .798226 / x 4.03548px를 확인했다(Frame 거리 20px). 이는 관찰 순간의 값이며 프레임 성능 계측이 아니다. 수동 모션 줄이기에서 즉시 열기/닫힘과 상태 전달을 확인했다.

## 비교 후 수정한 것

1. 첫 Frame 폼에서 보조 문구가 바깥 grid 두 번째 열을 만들어 폼이 좁아졌다. 필드 그룹에만 열 규칙을 적용했다.
2. 버튼 badge의 data-status가 결과 문구 훅과 충돌했다. data-phase로 분리하고 실제 화면에서 결과 훅 1개를 확인했다.
3. Object 탭 표시가 height 2px에 눌리고 Paper에 세로 스크롤바가 생겼다. pill 높이를 auto로, 위치는 실제 경계선 폭을 제외해 계산하고 overflow-y를 막았다.
4. 모바일 차트의 높은 specificity가 기존 한 열 전환을 덮어썼다. 같은 우선순위의 container 규칙으로 한 열/아래 요약을 만들고 숫자·기간 제어의 세로 쪼개짐을 수정했다. Object 주문 필터도 두 열과 전체 폭 검색으로 복구했다.
5. 열린 드로어를 비교 모드로 바꾸는 경우 native modal/modeless 모드도 전환하도록 고쳤다. 삭제 확인도 같은 상태/포커스 규칙을 적용했다.
6. Shadow DOM의 모달 첫 요소에서 Shift+Tab이 브라우저 영역으로 나가던 동작을 공통 runtime의 키보드 순환으로 보강했고 재조작했다.
7. 본문 크기·행간·패딩 일부가 가이드와 달랐다. 실제 적용 경로를 확인한 뒤 font/line-height/padding 토큰으로 연결했다. 입력 경계도 별도 control-border로 분리했다.

## 대비와 비용

| 스타일 | 보조/바탕 | 흰 글자/행동 | 제어 경계/바탕 |
| --- | --- | --- | --- |
| Paper | 5.51:1 | 6.83:1 | 3.50:1 |
| Object | 5.68:1 | 12.18:1 | 3.41:1 |
| Frame | 5.00:1 | 7.91:1 | 3.17:1 |

색 토큰의 sRGB 계산이다. 모든 글자·이미지·상태의 자동 WCAG 인증이 아니다. 구조 구분선은 제어 경계와 역할이 다르다.

홈 정적 모듈+CSS는 기존 68,956B → 현재 약 83,519B, 파일별 gzip 합 추정 23,628B → 26,575B다(실제 CDN 전송량 아님). 상태/비교/가이드 데이터가 늘어난 비용이다. 스타일 CSS와 가이드는 홈에서 지연 로딩하며 홈 실행 데모는 실제 DOM 0개를 확인했다. 상품 사진 data URI 약 44KB는 일반 런타임의 import에서 제거했다. 썸네일 세 장은 총 35155B. 새 폰트·WebGL·캔버스·무한 등장 애니메이션은 없다. 런타임 정의는 모듈 단위로 한 번 로드하고 보이는 항목만 실행한다.

## 실행한 검증과 남은 한계

- node scripts/test-ui-motion-showcase.mjs --require-full --export-previews: 57 PASS.
- node scripts/test-ui-motion-styles.mjs: 12 PASS(스타일 분리·내보내기·현재 위치 취소·modal/modeless 키보드 포함).
- node scripts/test-ui-motion-guide.mjs: 기존 2장면×7뷰 71 PASS.
- node --check: 변경/신규 JavaScript 문법 확인. TypeScript·ESLint 구성은 없어서 별도 타입/린트 명령은 실행하지 않았다.
- ruby scripts/test-harness.rb: PASS. scripts/verify-all.sh: 구조·Daily·HTML 목록·281 로컬 링크·Jekyll build·출력·개인정보 검사 PASS. faraday-retry 선택 경고는 빌드 실패가 아니다.
- 전체 스크린리더 실사용, Safari/Firefox·실제 iOS/Android 터치, OS reduced-motion 에뮬레이션, Lighthouse/Web Vitals·프레임 타임 측정은 하지 않았다. 수동 reduce와 동일 JS 경로 및 CSS media 규칙은 확인했다.
- 모든 가능한 상태 조합의 전수 회귀는 남아 있다. 업로더는 실제 파일 선택으로 .txt 형식 오류, 5MB+1B PDF 용량 오류, 작은 PDF 테스트 파일의 로컬 완료를 추가 확인했다. 문서 내용을 파싱하거나 서버 업로드한 검증은 아니다.
- 두 보존 hero 화면은 71개 계약 검증만 수행했으며 이번 전체 시각 매트릭스에 포함하지 않았다.
- 네트워크/결제/메일/실제 예약 API는 요청 범위가 아닌 로컬 데모다.

구현·출처 분석: GPT-6 Sol/high 에이전트. 스타일·계약 보강: GPT-6 Luna/high 에이전트. 통합·실제 브라우저 검증·수정은 주 에이전트가 수행했다.
