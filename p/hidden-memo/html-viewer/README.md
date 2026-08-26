# HTML Viewer

iPhone Safari의 파일 선택 UI로 `.html` 또는 `.htm` 파일을 골라 브라우저 안에서 바로 렌더링하는 정적 웹앱입니다. 별도 백엔드, 빌드 과정, 외부 분석 도구가 없습니다.

> 선택한 HTML 파일은 브라우저 내부에서만 처리되며 서버로 업로드되지 않습니다.

## 사용과 개인정보

- Viewer 코드는 선택한 파일을 `File API`로 읽고 메모리에만 보관합니다. 페이지를 닫거나 새로고침하면 선택한 파일은 사라집니다.
- Viewer 자체에는 파일 업로드, 외부 API, 텔레메트리, 분석 도구가 없습니다.
- 렌더링 문서는 `sandbox="allow-scripts allow-modals"` iframe의 별도 출처로 격리합니다. HTML 내부 JavaScript는 실행되지만 부모 페이지의 DOM, localStorage, 쿠키에는 접근할 수 없습니다.
- 선택한 HTML 자체에 외부 이미지·CSS·JavaScript 또는 네트워크 요청 코드가 있으면 해당 원격 서버와 통신할 수 있습니다. 신뢰하기 어려운 HTML은 소스 보기를 먼저 사용하세요.
- 외부 리소스는 원격 서버의 CORS, CSP, 인증, 연결 상태에 따라 로드되지 않을 수 있습니다.
- 별도 상대경로 CSS, JavaScript, 이미지 파일을 함께 여는 기능은 1차 버전에서 지원하지 않습니다. 이런 참조가 발견되면 화면에 안내합니다.
- `p/hidden-memo/`는 일반 문서 목록과 검색엔진에서 숨긴 경로일 뿐 인증된 비공개 영역은 아닙니다. GitHub Pages에 배포한 파일은 URL을 아는 사람이 열 수 있습니다.

## PWA와 오프라인

Safari에서 Viewer를 한 번 연 다음 공유 메뉴의 **홈 화면에 추가**를 선택하면 standalone 앱처럼 실행할 수 있습니다. 전용 Service Worker는 Viewer의 HTML, CSS, JavaScript, manifest, 아이콘만 캐시하며 사용자가 선택한 HTML은 저장하지 않습니다.

앱 경로는 현재 위치 기준 상대 URL만 사용하므로 사용자/프로젝트 GitHub Pages의 하위 경로에서도 동작합니다.

## GitHub Pages

저장소의 GitHub **Settings → Pages**에서 배포할 브랜치와 루트 폴더를 선택해 활성화합니다. 이 저장소에서의 Viewer 경로는 다음과 같습니다.

```text
/p/hidden-memo/html-viewer/
```

HTTPS로 배포해야 Service Worker와 PWA 기능을 사용할 수 있습니다. GitHub Pages 기본 도메인은 HTTPS를 지원합니다.
