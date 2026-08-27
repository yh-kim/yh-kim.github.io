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

iPhone/iPad의 홈 화면 웹앱은 Web Share Target API를 지원하지 않으므로 파일 앱의 공유 메뉴에서 Viewer 자체를 선택할 수는 없습니다. 대신 아래 단축어를 공유 시트에 등록하면 HTML 파일을 Viewer로 전달해 바로 열 수 있습니다.

## iOS 단축어로 열기

단축어 이름 예시: **HTML Viewer로 열기**

1. 단축어의 세부사항에서 **공유 시트에서 보기**를 켭니다.
2. 공유 입력 유형은 **파일**만 선택합니다.
3. **파일 세부사항 가져오기** 액션을 추가하고, `단축어 입력`의 **이름**을 가져옵니다.
4. **URL 인코딩** 액션을 추가해 앞 단계의 파일 이름을 인코딩합니다.
5. **Base64 인코딩** 액션을 추가하고 `단축어 입력`을 인코딩합니다. 줄바꿈 옵션이 보이면 **없음**으로 설정합니다.
6. **URL 인코딩** 액션을 하나 더 추가해 Base64 결과를 인코딩합니다. Viewer는 인코딩하지 않은 Base64도 처리하지만, 단축어에서는 이 단계를 유지하는 것을 권장합니다.
7. **텍스트** 액션에 아래 내용을 넣습니다. 대괄호 부분은 각 액션의 매직 변수로 교체합니다.

   ```text
   https://blog.pickth.com/p/hidden-memo/html-viewer/#shortcut=1&name=[URL 인코딩된 파일 이름]&data=[URL 인코딩된 Base64]
   ```

8. **URL 열기** 액션을 추가하고 앞 단계의 텍스트를 엽니다.

이제 파일 앱에서 `.html` 또는 `.htm` 파일을 길게 누른 뒤 **공유 → HTML Viewer로 열기**를 선택합니다. 단축어가 만든 HTML 데이터는 URL의 fragment(`#` 뒤)에만 들어가 서버 요청으로 전송되지 않으며, Viewer가 읽은 직후 주소에서도 제거합니다.

URL로 파일 전체를 전달하는 방식이라 큰 HTML은 iOS 또는 Safari의 URL 처리 한계에 걸릴 수 있습니다. 그 경우 Viewer의 **HTML 파일 선택**을 사용하세요. Viewer 자체 제한은 10MB입니다.

### 큰 파일용 클립보드 방식

파일이 크거나 URL 열기가 실패한다면 Base64 대신 클립보드로 전달합니다. Safari 보안 정책상 자동으로 클립보드를 읽을 수 없어 Viewer에서 **HTML 붙여넣기**를 한 번 눌러야 하지만, HTML 본문을 URL에 넣지 않아 더 안정적입니다.

1. 파일 이름을 가져와 URL 인코딩하는 1-4단계는 위와 같습니다.
2. **텍스트 가져오기** 액션으로 `단축어 입력` 파일의 텍스트를 가져옵니다.
3. **클립보드에 복사** 액션으로 그 텍스트를 복사합니다.
4. **텍스트** 액션에 아래 URL을 만듭니다.

   ```text
   https://blog.pickth.com/p/hidden-memo/html-viewer/#shortcut=clipboard&name=[URL 인코딩된 파일 이름]
   ```

5. **URL 열기**로 Viewer를 연 뒤 **HTML 붙여넣기**를 누릅니다.
6. iPhone이 **붙여넣기** 메뉴를 띄우면 그 메뉴를 선택합니다. 자동 읽기가 차단되면 나타나는 입력칸을 길게 눌러 직접 붙여넣을 수도 있습니다.

클립보드 방식도 Viewer 자체 제한인 10MB까지 처리합니다. 매우 큰 HTML이나 별도 CSS·이미지 파일을 함께 참조하는 HTML은 기존 파일 선택 방식이 더 적합합니다.

앱 경로는 현재 위치 기준 상대 URL만 사용하므로 사용자/프로젝트 GitHub Pages의 하위 경로에서도 동작합니다.

## GitHub Pages

저장소의 GitHub **Settings → Pages**에서 배포할 브랜치와 루트 폴더를 선택해 활성화합니다. 이 저장소에서의 Viewer 경로는 다음과 같습니다.

```text
/p/hidden-memo/html-viewer/
```

HTTPS로 배포해야 Service Worker와 PWA 기능을 사용할 수 있습니다. GitHub Pages 기본 도메인은 HTTPS를 지원합니다.
