# 테마별 독립 UI·모션 페이지: 구현과 검증


화면 캡처는 개인 로컬 보관소에 저장하며 저장소에는 포함하지 않는다.
2026-10-16 기준. 이 기록의 **자동 검사 결과는 실제로 실행한 명령**을 적었다. 브라우저 시각·조작 검수와 결과 캡처를 포함한다.

## 배포 경로와 변경 범위

| 경로 | 역할 |
| --- | --- |
| `/p/ui-motion/` | 두 완성 화면의 실제 미리보기를 보여 주는 입구 |
| `/p/ui-motion/ai-workspace/` | A 기반 창작 화면과 이 화면에서 분해한 요소·모션 |
| `/p/ui-motion/project-dashboard/` | B 기반 프로젝트 화면과 이 화면에서 분해한 요소·모션 |
| `/p/hidden-memo/ui-motion-guide/` | 기존 URL과 글·메타데이터를 보존하고 세 독립 경로로 연결 |

세 경로는 `p/`의 정적 `index.html`이다. 각 HTML은 `html-document-listing=hidden`이므로 공개 `/daily/p/` 목록에 추가되지 않는다. 블로그 글 레이아웃, 표지, 날짜, 공통 CSS나 라우팅 설정을 사용하지 않는다. 새 페이지는 기존 히든메모 진입점에서 접근할 수 있다.

- `p/ui-motion/index.html`, `p/ui-motion/ai-workspace/index.html`, `p/ui-motion/project-dashboard/index.html`: pathname별 HTML·메타데이터·모듈 진입점.
- `js/ui-motion-showcase/index.js`, `styles.css`: 허브와 테마별 셸, 실제 대표 화면, 5개씩의 요소 카드, 검색·기능 필터, 큰 보기·이전/다음·복사 UI. A의 어두운 셸과 B의 밝은 셸은 분리한다.
- `js/ui-motion-showcase/data.js`, `engine.js`, `ai-scene.js`, `project-scene.js`: 장면 구성·토큰·로컬 샘플 상태·모션·독립 실행 HTML. 카드와 상세에서 같은 실행 함수를 사용한다. A는 광원·프리셋·생성, B는 같은 6개 샘플 작업의 지표·차트·목록·일정을 연결한다.
- `p/hidden-memo/ui-motion-guide/index.md`: 기존 글 상단에 세 독립 경로 링크를 추가. 기존 데모와 제작 기록은 보존한다.
- `scripts/test-ui-motion-showcase.mjs`, `scripts/test-ui-motion-guide.mjs`: 분리 경로, 토큰과 CSS·프롬프트·독립 HTML 일치, 기존 글 보존을 검사한다.

서버 API·로그인·DB·키는 사용하지 않는다. 폼, 처리 상태와 업무 데이터는 브라우저 메모리의 샘플이다.

## 레퍼런스 관찰과 재설계

| 참고 | 브라우저에서 확인한 정지 화면·체험 | 이번 구현에 반영한 관계 | 확인 수준 |
| --- | --- | --- | --- |
| [A · Dribbble AI Agent Website Design](https://dribbble.com/shots/27748221-AI-Agent-Website-Design) | 확대해 본 3200×2400 정지 이미지. 큰 중앙 제목 → 작은 프롬프트 제어부 → 수평으로 퍼지는 광원 → 뒤·앞 제어 패널 순으로 시선이 이동한다. 깊은 배경, 미세한 선·점 질감, 결과 프리뷰와 작은 상태 표지가 함께 있다. | 창작 화면의 제목과 프롬프트를 광원 위에 두고, 컨텍스트·결과 캔버스·제어부를 서로 다른 깊이의 패널로 묶었다. 프리셋·광원 강도·생성 상태가 실제로 반응한다. | 이미지 크기만 파일 확인. 영역 비율은 시각적 관찰. CSS 길이·투명도·모션은 실측하지 않았다. |
| [B · Behance PlanIQ Dashboard](https://www.behance.net/gallery/251693759/PlanIQ-SaaS-Project-Management-Dashboard-UIUX) | 확대해 본 2800×3814 정지 이미지. 옅은 회색 캔버스에 흰 표면과 제한된 민트 강조를 쓰고, 내비게이션·낮은 지표 3개·차트·작업 영역을 촘촘한 정렬로 연결한다. 작은 아이콘, 상태 라벨, 수치와 날짜가 밀도 있는 업무 화면을 이룬다. | 밝은 프로젝트 화면에 내비게이션, 낮은 KPI, 축·범례가 있는 차트, 작업 목록·선택 상세, 일정과 진척을 연결했다. 필터·기간·날짜 변경은 같은 샘플 작업을 갱신한다. | 이미지 크기만 파일 확인. 실제 제품 동작과 CSS 수치는 확인되지 않았다. |
| [C · UX/UI Prompt](https://lucianlabs.dev/uxui-prompt/) | 실제 브라우저에서 필터로 데모 카드 201을 찾고, 확대해 시연과 프롬프트·코드 접근을 확인했다. 첫 화면에서 데모가 빨리 보이고, 카드는 조작 가능한 영역이 크며 상세는 설명보다 체험에 무게를 둔다. | 허브는 실제 화면 미리보기를 보여 주고, 테마 페이지는 완성 화면을 먼저 둔다. 카드와 큰 보기가 같은 상태·런타임을 쓰며 상세에서 규칙·프롬프트·실행 HTML을 연다. | 201번 카드와 관련 탐색을 조작 확인. 전체 목록의 모든 효과나 내부 소스는 조사하지 않았다. |

위 장면의 숫자 토큰은 **이번 페이지를 위해 직접 설계한 값**이다. 원본 이미지에서 측정한 컴포넌트 CSS값으로 표시하지 않는다. A·B에서 원본 동영상을 확인하지 못했으므로 모든 UI 모션은 **이 디자인에 맞춰 새로 설계한 구현 예시**이며 원본 모션 복원이 아니다. 원본 로고·문구·캡처 이미지·소스를 페이지 자산으로 사용하지 않는다. 참고 캡처는 배포 저장소 밖의 비공개 비교 경로에만 보관한다.

## 자동 검증

| 실행 명령 | 결과 |
| --- | --- |
| `ruby scripts/add-html-document.rb` | 5개 HTML 목록 동기화. 새 세 경로는 숨김 메타를 유지했다. 동기화가 건드린 무관한 HTML 41개는 실행 전 변경이 없음을 확인한 뒤 원본 바이트로 복원했다. |
| `node scripts/test-ui-motion-showcase.mjs --require-full` | 33개 통과. 12/12 카탈로그, 세 직접 경로·자산 상대경로, 테마별 목록, 대표 화면을 포함한 상세 순서, 장면 토큰·가이드·독립 HTML을 검사. |
| `node scripts/test-ui-motion-guide.mjs` | 71개 통과. 기존 글의 URL·메타데이터·테마 데이터와 보존 범위를 검사. |
| `ruby scripts/verify-project-structure.rb` | 통과: 글 6개·Daily 4개·카테고리 태그 9개. |
| `ruby scripts/verify-daily-links.rb` | 통과: Daily 글·URL 각 4개. |
| `ruby scripts/verify-html-documents.rb` | 통과: 공개 HTML 문서 5개 유지. |
| `ruby scripts/verify-content-links.rb` | 통과: 로컬 링크 269개. |
| `ruby scripts/verify-privacy.rb`, `ruby scripts/test-harness.rb` | 모두 통과. |
| `/opt/homebrew/lib/ruby/gems/3.3.0/bin/jekyll build` → `ruby scripts/verify-built-site.rb` | 모두 통과. `_site/p/ui-motion/` 아래 세 `index.html` 생성 확인. |
| `git diff --check` | 통과. |

저장소 지침의 `scripts/verify-all.sh`는 이 체크아웃의 **기존 상태에서 파일이 없어서** 실행하지 못했다. 그 안의 개별 검사와 Jekyll 빌드·빌드 결과 확인은 위와 같이 실행했다.

## 로컬 확인

저장소 루트에서 다음 명령으로 실제 Jekyll 경로를 연다.

```bash
/opt/homebrew/lib/ruby/gems/3.3.0/bin/jekyll serve --host 127.0.0.1 --port 4000
```

브라우저에서 `http://127.0.0.1:4000/p/ui-motion/`, `/p/ui-motion/ai-workspace/`, `/p/ui-motion/project-dashboard/`에 직접 진입하고 새로고침한다. 개발 중 단순 정적 확인은 저장소 루트에서 `python3 -m http.server 4070 --bind 127.0.0.1`을 사용할 수 있다. 후자는 Jekyll 변환을 수행하지 않는다.

## 시각 검수 캡처

아래 경로에는 **직접 만든 결과 화면 캡처만** 둔다. 참고 사이트 캡처는 커밋 대상에서 제외한다. 각 파일은 표시된 실제 viewport에서 렌더링한 결과다.

| 뷰포트 | 허브 | A 완성 화면 | A 상세 | B 완성 화면 | B 상세 |
| --- | --- | --- | --- | --- | --- |
| 1440×900 | hub-desktop | a-desktop | a-detail-desktop | b-desktop | b-detail-desktop |
| 1024×768 | hub-tablet | a-tablet | a-detail-tablet | b-tablet | b-detail-tablet |
| 390×844 | hub-mobile | a-mobile | a-detail-mobile | b-mobile | b-detail-mobile |

## 브라우저 검수 결과

Codex 내장 브라우저에서 실제 렌더링·입력했다. 1440×900, 1024×768, 390×844의 허브·A/B 대표 화면·상세 15장을 저장했다. 문서 너비가 viewport를 넘지 않음을 DOM과 화면으로 확인했다. 모바일은 실제 1열 재배치이며 축소 배율을 쓰지 않는다.

- A: 오브젝트/포스터, 광원 슬라이더 68→67, 입력 오류/성공, 입력 지시 반영, 생성·검토, 모션 반복·초기화를 확인했다. 0.25× 처리 중 일시정지 후 두 번 관측한 progress transform이 같았다. 동작 줄이기 선택 시 처리 결과가 즉시 완료되었다.
- B: 완료 필터에서 작업 2개·완료율 100%·연결된 차트와 일정 갱신, 주간/누적 전환, 날짜 18일의 일정, 작업 선택 상세·중첩 검토 대화상자를 확인했다. Escape는 내부 검토부터 닫고 바깥 체험 화면을 유지했다.
- 탐색: 검색어 `프리뷰`로 1개 결과, 상세 이전/다음, 닫기 후 검색·선택·스크롤·시작 버튼 포커스 복귀, 배경 overflow 복원을 확인했다. 키보드 탭과 Escape, 네이티브 focus 표시를 확인했다.
- 복사: 데스크톱 A 프롬프트 및 B 코드의 textarea와 클립보드 일치. 태블릿 B 코드 복사 완료 및 103,806자 길이 일치. 모바일 수동 전체 선택 8,180/8,180자를 확인했다. 모바일 자동 복사는 브라우저 세션 포커스에 따라 클립보드가 일치하지 않은 사례가 있어 수동 대안도 확인했다.
- 다운로드: B 실행 HTML 다운로드 이벤트를 확인했다. 생성된 B HTML을 별도 경로로 열어 필터·누적 차트·18일 일정·검토 대화상자가 동작하고 콘솔 오류가 없음을 확인했다. 12개 내보내기 코드의 문법과 필수 의존성은 자동 검사로 검증했다.
- 격리: 기존 글의 엔진·테마·전역 CSS·레이아웃은 변경하지 않았다. 새 셸과 데모의 Shadow DOM을 통해 토큰과 스타일을 격리한다. 새 CSS는 블로그에서 로드하지 않는다.

### 비교 후 수정과 남은 차이

A/B/C와 결과를 각각 1440×900으로 캡처해 나란히 비교했다. B는 원본 이미지의 대시보드 영역을 별도로 확대해 작은 제어부까지 확인했다. 원본은 포트폴리오 보드이므로 결과 페이지와 픽셀 단위 동일성이나 원본 CSS 실측을 주장하지 않는다.

검수 후 B의 패널 간격과 KPI 높이를 줄이고, 차트 축을 정수 단위로 맞췄다. 모바일 날짜·수치의 겹침은 2행 라벨로 수정했다. 허브에서는 작은 화면에 전체 작업 목록을 잘라 넣지 않고 실제 필터·차트를 집중해서 보여 준다. A의 모바일 제어부는 1열로 바꾸고 프리뷰와 겹친 보조 캡션을 제거했다.

A의 포트폴리오에 있는 밝은 마케팅 영역과 제품 사진은 재현하지 않았다. 어두운 작업실에 제목·광원·제어 레이어를 결합하고 자체 CSS 금속 조형물을 사용했다. B의 AI 비서·파일 업로드·화상 회의는 가짜 기능으로 채우지 않고, 6개 샘플 작업의 일정·선택 검토로 재설계했다. C의 수백 개 예시나 릴스 탐색은 구현 범위가 아니며, 두 테마의 pathname과 각 5개 구성요소에 집중했다.

운영체제 설정 자체의 reduced-motion 토글, Safari·Firefox·실물 터치 기기·스크린리더는 직접 확인하지 않았다. `prefers-reduced-motion` 분기와 동일한 런타임 감소 옵션은 검사했다. A/B 원본 모션과 C의 모든 예시는 미확인이다. “레퍼런스 수준 완료”라고 판정하지 않는다.
