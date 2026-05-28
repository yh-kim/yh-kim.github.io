# Pimi's Blog

개인 블로그 저장소입니다. 작업 후 커밋 전에는 로컬에서 화면과 하네스를 확인합니다.

## 로컬에서 확인하기

Jekyll 없이 빌드 결과만 확인합니다. 아래 명령은 전체 검증으로 `_site`를 만든 뒤, 바로 로컬 서버를 띄웁니다.

```bash
scripts/serve-site.sh 8074
```

브라우저에서 아래 주소로 확인합니다.

```text
http://127.0.0.1:8074
```

서버를 끌 때는 실행 중인 터미널에서 `Ctrl-C`를 누릅니다.

그래도 포트가 살아 있으면 아래 명령으로 종료합니다.

```bash
scripts/stop-site.sh 8074
```

다른 포트를 쓰고 싶으면 숫자만 바꾸면 됩니다.

```bash
scripts/serve-site.sh 8080
scripts/stop-site.sh 8080
```

## 작업 후 검증

전체 검증:

```bash
scripts/verify-all.sh
```

하네스 자체를 수정했을 때:

```bash
ruby scripts/test-harness.rb
```

HTML 문서를 추가했을 때:

```bash
ruby scripts/add-html-document.rb
scripts/verify-all.sh
```

## 기본 규칙

- 사용자가 요청하지 않으면 커밋, 푸시, 배포를 하지 않습니다.
- HTML 파일은 `html-documents/`에 넣고 `ruby scripts/add-html-document.rb`로 목록을 동기화합니다.
- `_posts/`는 dev 글, `_daily/`는 note 글입니다.
