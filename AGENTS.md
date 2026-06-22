# AGENTS.md

이 파일은 어떤 에이전트가 이 저장소를 열어도 같은 방식으로 작업하게 하는 운영 규칙이다.

## 기본 원칙

- 사용자가 명시적으로 요청하지 않으면 커밋, 푸시, 배포를 하지 않는다.
- 작업은 기본적으로 "파일 수정 + 검증 + 보고"까지만 한다.
- 작업을 시작하기 전에 `docs/project-harness.md`를 읽고, 요청 유형별 절차와 검증 규칙을 따른다.
- 사용자가 되돌린 구조 변경을 다시 시도하지 않는다.
- Jekyll 내부 규칙이 있으므로 `_posts`, `_daily`, `_layouts`, `_includes`, `_data`는 이동하지 않는다.
- 사용자가 "HTML 추가"라고 하면 일반 글이 아니라 독립 HTML 문서로 취급한다.

## 자주 쓰는 명령

전체 검증:

```bash
scripts/verify-all.sh
```

하네스 자체를 수정했을 때:

```bash
ruby scripts/test-harness.rb
```

HTML 문서 목록 동기화:

```bash
ruby scripts/add-html-document.rb
```

## HTML 문서 작업 규칙

1. HTML 파일은 `p/`에 둔다.
2. `ruby scripts/add-html-document.rb`를 실행해서 `_data/html_documents.yml`을 동기화한다.
3. HTML 목록 페이지는 `/daily/p/`를 사용한다.
4. HTML을 Daily 글 안에 iframe으로 넣지 않는다.
5. HTML 파일 안에는 `/Users/...` 같은 로컬 절대 경로를 넣지 않는다.

## 검증 하네스

하네스 진입점은 항상 아래 두 개다.

```bash
scripts/verify-all.sh
ruby scripts/test-harness.rb
```

개별 검증 스크립트는 `scripts/verify-*.rb`에 있다. 직접 실행해도 되지만, 기본은 `scripts/verify-all.sh`를 사용한다.

`scripts/verify-all.sh`는 다음 순서로 실행된다.

1. 프로젝트 구조 검증
2. Daily URL 검증
3. HTML 문서 목록 검증
4. 로컬 링크 검증
5. Jekyll build
6. 빌드 결과 검증
7. 개인정보 노출 검증

Jekyll이 없는 환경에서는 build 검증을 건너뛸 수 있다. 릴리스 전에는 Jekyll이 설치된 환경에서 반드시 다시 검증한다.

## 블로그 구조 요약

| 경로 | 역할 |
| --- | --- |
| `_posts/` | 개발 글. `dev` 메뉴에 노출된다. |
| `_daily/` | 노트 글. `note` 메뉴에 노출된다. |
| `p/` | 독립 HTML 문서 배포 위치. |
| `_data/html_documents.yml` | HTML 문서 목록 데이터. |
| `_layouts/`, `_includes/` | 블로그 화면 구조. |
| `css/`, `js/`, `img/`, `fonts/` | 테마 자산. |
| `scripts/` | 검증 및 작업 자동화 스크립트. |
| `docs/` | 작업 가이드 문서. |

## 보고 방식

작업 완료 후에는 다음을 짧게 보고한다.

- 바꾼 파일
- 실행한 검증 명령
- 실패 또는 건너뛴 검증
- 커밋 여부. 기본값은 "커밋하지 않음"이다.
