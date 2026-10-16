# UI·모션 가이드 구현 및 검증

## 위치와 격리

- 글 원본: `p/hidden-memo/ui-motion-guide/index.md`.
- 주소: `/p/hidden-memo/ui-motion-guide/`.
- 진입점: 기존 히든메모 목록의 카드. 일반 note/dev/HTML 문서 목록에는 등록하지 않는다.
- 기존 Jekyll `post` 레이아웃·헤더·내비게이션을 그대로 사용한다. 새 사이트나 레이아웃을 만들지 않는다.
- 본문 호스트 `#ui-motion-guide`의 Shadow DOM 안에만 UI CSS와 데모를 렌더한다. 기존 글과 전역 자산은 수정하지 않는다.
- 네 테마와 7개 요소를 하나의 글에서 전환한다. 대표 화면은 공간 선택·안내 dialog·공간/일정 탭을 제공한다.

## 재사용 데이터

- `js/ui-motion-guide/themes.js`: 직접 설계한 색상, 폰트, 간격, 열, 요소와 모션 수치.
- `engine.js`: 실제 화면과 내보낸 HTML이 함께 쓰는 마크업·CSS·동작 함수.
- `index.js`: 같은 데이터에서 규칙, 전체/개별 프롬프트, DESIGN.md, 토큰 JSON 생성.
- HTML 내보내기는 공통 스타일과 토큰, SVG, 이벤트 함수를 모두 포함한 독립 문서다. 외부 라이브러리·폰트·서버·API 키가 필요 없다.
- 카드 관찰용 0.25× 옵션만 duration/delay를 4배로 재생한다. 기본 테마 수치는 변하지 않는다.

## 작업 순서

Warm Minimal 1개를 먼저 완성했다. 실제 브라우저에서 폼 오류/성공, 모달, 키보드 탭, 카드 일시정지, 복사와 HTML 다운로드를 확인하고 첫 33개 계약 검사를 통과한 뒤 Editorial/Technical/Bold Graphic을 추가했다.

## 참고 사이트 확인

2026-10-16에 실제 브라우저로 `https://lucianlabs.dev/uxui-prompt/`를 열었다. 분류별 갤러리, 요소 확대 탐색, 201번 데모의 실행/완료, 프롬프트·코드 탭, 실제 클립보드 복사와 완료 알림을 확인했다. 전체 요소나 모든 모션은 확인하지 않았다. 이 가이드의 화면, 문구, 일러스트와 수치는 독립 설계이며 원본 모션 복원 또는 실측이라고 주장하지 않는다.

## 브라우저 확인

Codex 내장 Chromium 브라우저에서 Jekyll 빌드 결과의 실제 경로를 사용했다.

- 360/768/1440px에서 네 테마의 대표 화면을 각각 확인했다. 좁은 화면은 실제 1열로 재배치되고 Bold는 포스터 구도를 유지한다. 각 너비에서 페이지와 데모의 가로 넘침이 없었다.
- 네 테마 모두 버튼 저장과 비활성, hover/focus/active 상태 선택, 이메일 오류/성공과 Enter 제출, 탭 화살표/Home/End, 아코디언, dialog 확인/취소/Esc를 조작했다.
- 모바일 dialog의 하단 시트, 키보드 Tab 이동과 닫기, 카드 재생/일시정지/재개/다시 보기/초기화, 내부 목록 스크롤 및 초기화를 확인했다.
- 네 테마 전체 프롬프트와 개별 실행 HTML을 실제 클립보드에서 읽어 확인했다. 수동 전체 선택 도구도 확인했다.
- 네 테마의 DESIGN.md·토큰 JSON 다운로드 버튼을 조작했다. 대표 파일인 Warm Minimal 토큰 JSON과 Editorial DESIGN.md의 실제 저장을 확인했다. JSON 전체가 테마 원본과 같고, DESIGN.md의 모든 색상/모션 수치가 원본과 일치했다. 나머지 테마 파일은 브라우저 다운로드 처리 도구의 제한으로 디스크 저장 완료까지 별도 확인하지 못했다.
- 내려받은 Warm Minimal 버튼 HTML을 별도 문서로 열어 저장/비활성을 조작했다.
- `#ui-editorial-tabs`로 새로고침해 테마·요소 직접 접근을 확인했다.
- 기존 `/start-docker/` 글에 가이드 호스트나 가이드 자산이 로드되지 않음을 확인했다. 기존 글의 헤더와 본문을 시각적으로 확인했다.

## 자동 검사

```text
node scripts/test-ui-motion-guide.mjs --require-four
ruby scripts/test-harness.rb
ruby scripts/verify-project-structure.rb
ruby scripts/verify-daily-links.rb
ruby scripts/verify-html-documents.rb
ruby scripts/verify-content-links.rb
ruby scripts/verify-privacy.rb
jekyll build
ruby scripts/verify-built-site.rb
git diff --check
```

가이드 계약 검사 129개 통과. 네 테마 × 8개 화면의 내보내기 문법, 전체 갤러리 고유 ID/ARIA 참조, 토큰과 CSS, 대비, 숨김 경로를 검사한다. 추가로 동작 줄이기, 복사 거부 시 수동 선택, 모션 초기화의 비동기 경합, 화면 밖 재생 중단과 cleanup을 모의 DOM에서 검사한다. 본문/보조/성공/오류/버튼 대비 4.5:1 이상, 초점 대비 3:1 이상이다.

기존 전체 하네스 진입점 `scripts/verify-all.sh`는 저장소에 없어 실행할 수 없다. 위 개별 검사와 Jekyll 빌드로 대체했다. 문서 동기화 명령이 만든 기존 HTML의 공백 변경은 되돌렸으며, 기존 파일 수정은 히든메모 카드 추가뿐이다.

## 확인하지 않은 범위

- 실제 OS의 ‘동작 줄이기’ 설정 전환, Safari/Firefox 실기기, 스크린리더 낭독은 확인하지 않았다. 동작 줄이기와 클립보드 권한 거부는 계약 시뮬레이션으로 확인했다.
- 입력과 예약은 로컬 데모이며 실제 예약·메일 전송·결제·영구 저장을 구현하지 않는다.
