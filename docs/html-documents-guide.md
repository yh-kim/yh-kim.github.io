# HTML 문서 추가 가이드

## 이것만 보면 됨

1. HTML 파일을 `html-documents/` 폴더에 넣는다.
2. 아래 명령어를 실행한다.

   ```bash
   ruby scripts/add-html-document.rb
   ```

3. 검증한다.

   ```bash
   scripts/verify-all.sh
   ```

끝. 스크립트가 `html-documents/*.html`을 읽어서 `_data/html_documents.yml`을 자동으로 맞춘다.

블로그에 독립 실행형 HTML 파일을 추가할 때 이 문서를 기준으로 작업한다.

## 목적

독립 HTML 파일은 `html-documents/` 아래에 그대로 배포한다.
일반 블로그 글로 변환하지 않고, 블로그에서는 HTML 목록 페이지에서 링크만 제공한다.

HTML 목록 페이지:

```text
/daily/html-documents/
```

직접 접근 URL 예시:

```text
/html-documents/example.html
```

## 스크립트로 추가하기

대부분은 아래 방식으로 쓰면 된다.

1. HTML 파일을 `html-documents/` 폴더에 넣는다.
2. 스크립트를 실행한다.

```bash
ruby scripts/add-html-document.rb
```

스크립트가 하는 일:

1. `html-documents/` 폴더 안의 `.html` 파일을 스캔한다.
2. `_data/html_documents.yml`을 폴더 내용에 맞춰 갱신한다.
3. 완료 후 직접 HTML URL과 목록 URL을 출력한다.
4. 기존 등록 정보가 있으면 제목, 설명, 날짜, 태그를 유지한다.
5. 새 HTML은 `<title>` 값을 제목으로 사용한다. `<title>`이 없으면 파일명으로 제목을 만든다.

주요 옵션:

- `--sync`: 폴더 기준 동기화. 파일 경로를 생략하면 기본으로 동작한다.

원본 HTML을 직접 복사까지 하고 싶을 때는 아래 방식도 가능하다.

```bash
ruby scripts/add-html-document.rb ~/Downloads/my-note.html --title "My Note" --slug my-note --description "설명" --tags 맞춤법
```

복사 방식 옵션:

- `--title`: 목록에 표시할 제목. 복사 방식에서는 필수.
- `--slug`: 배포 파일명. 생략하면 원본 파일명을 기준으로 만든다.
- `--description`: 목록에 표시할 짧은 설명.
- `--date`: 문서 날짜. 생략하면 오늘 날짜.
- `--tags`: 쉼표로 구분한 태그. 허용 태그는 `동물`, `다이어트`, `방탈출`, `맞춤법`입니다.
- `--force`: 같은 path가 이미 있을 때 파일과 목록 항목을 교체한다.

스크립트 실행 후 검증:

```bash
scripts/verify-all.sh
```

## 직접 추가하기

1. HTML 파일을 `html-documents/` 아래에 넣는다.

   파일명은 되도록 소문자와 하이픈을 사용해서 안정적으로 만든다.

   ```text
   html-documents/my-study-note.html
   ```

2. `_data/html_documents.yml`에 목록 항목을 추가한다.

   ```yaml
   - title: "My Study Note"
     description: "HTML 문서 목록에 보일 짧은 설명"
     path: "/html-documents/my-study-note.html"
     date: "2026-05-27"
     tags:
       - Study
   ```

3. 검증을 실행한다.

   ```bash
   scripts/verify-all.sh
   ```

4. 빌드 또는 배포 후 아래 URL을 확인한다.

   ```text
   /daily/html-documents/
   /html-documents/my-study-note.html
   ```

## Codex에게 요청할 때

HTML 파일을 전달하고 이런 식으로 요청하면 된다.

```text
이 HTML을 추가해줘. 제목은 "My Study Note"로 하고 HTML 목록에 보이게 해줘.
```

Codex는 다음 순서로 작업한다.

1. HTML 파일을 `html-documents/` 아래에 복사하거나 생성한다.
2. `scripts/add-html-document.rb`를 실행해서 `_data/html_documents.yml`을 동기화한다.
3. 필요한 경우 `_data/html_documents.yml`의 제목, 설명, 날짜, 태그를 다듬는다.
4. `/daily/html-documents/`를 사용자가 보는 목록 페이지로 유지한다.
5. `scripts/verify-all.sh`를 실행한다.
6. 사용자가 명시적으로 요청하지 않으면 커밋 전까지만 작업한다.

## HTML 작성 시 주의사항

일반적인 단일 HTML 파일이면 특별한 제약은 거의 없다.
다만 배포 후 깨지지 않게 아래 항목은 지키는 것이 좋다.

- HTML 주변의 이미지, CSS, JS를 참조할 때는 상대 경로를 사용한다.
- 해당 HTML 전용 이미지, CSS, JS가 있으면 같은 이름의 자산 폴더를 만든다. 예: `html-documents/my-study-note-assets/`.
- `/Users/...` 같은 로컬 절대 경로는 쓰지 않는다. 배포 후 동작하지 않는다.
- 저장소 밖의 파일로 연결하지 않는다.
- 생성된 HTML 안에 개인정보가 들어가지 않게 확인한다.
- 외부 CDN 스크립트나 폰트를 쓰면 네트워크 상태에 따라 표시가 달라질 수 있다.
- HTML이 자체 전체 화면 스타일을 가진 경우, 블로그 테마에 의존하지 않도록 HTML 안에서 필요한 스타일을 독립적으로 관리한다.

좋은 자산 참조 예시:

```html
<img src="./my-study-note-assets/diagram.png" alt="Diagram">
<script src="./my-study-note-assets/app.js"></script>
```

피해야 할 예시:

```html
<img src="/Users/pimi/Desktop/diagram.png">
<a href="../private/file.pdf">Private file</a>
```

## URL 규칙

- `_data/html_documents.yml`의 `path`는 `/html-documents/`로 시작해야 한다.
- `path`는 `.html`로 끝나야 한다.
- 실제 HTML 파일이 `html-documents/` 아래에 존재해야 한다.
- `/daily/html-documents/` 목록 페이지는 `_data/html_documents.yml`을 기준으로 생성된다.

이 규칙은 아래 하네스가 확인한다.

```bash
ruby scripts/verify-html-documents.rb
```

## 기존 예시

현재 등록된 예시 HTML:

```text
html-documents/psp-problems.html
```

현재 목록 데이터:

```text
_data/html_documents.yml
```
