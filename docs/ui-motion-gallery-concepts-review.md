# 컨셉 컬렉션 개편과 최종 검증

2026-10-19. 이번 변경은 12개 실사용 컴포넌트의 디자인, 컨셉별 탐색과 기준에 집중했다. AI 작업 공간과 프로젝트 대시보드는 호환 URL을 보존했으며 이번 시각 개선 집계에 넣지 않았다.

## 실제 화면에서 출발한 문제 5개

1. 배포 화면은 서로 다른 용도의 12개 UI를 같은 카드 벽으로 구성했다. `concept-before-1440.jpg`에 실제 1440px 첫 화면을 기록했다.
2. 제목·설명을 카드 바깥과 데모 내부에 반복했다. 이번 초기 시안에도 이 패턴이 남아 사용자가 다시 지적했다. 최종은 홈·목록·데모 헤더·상세 상단의 반복 소개문을 제거했다. 입력 도움말·오류·결과만 유지한다.
3. 초기 컨셉은 큰 Paper/Object/Frame 이름, 가짜 잡지·브랜드 장식으로 나뉘었지만 배치와 버튼이 비슷했다. 사용자 지적 뒤 용도 이름으로 바꾸고 편집 지면·상품 그리드·도구 패널로 구조를 바꿨다.
4. 중첩된 베이지·그린·파란 면과 같은 테두리가 데모를 작게 가뒀다. 첫 시안 `concept-home-1440.png`와 최종 `concept-final-home-1440.png`를 비교해 면적과 위계를 재조정했다. 장식용 커버 대신 실제 작동하는 데모를 홈에 둔다.
5. 전역 디자인 기준은 컨셉이 여러 개일 때 어떤 UI에 적용되는지 모호했다. 컨셉마다 소속 4개와 자기 토큰·활자·간격·모션을 보도록 분리했다. 출처·이전 화면 예제 안내는 제품 화면에서 제거했다. 필요한 법적 고지는 코드에 보존한다.

## 확인한 경로와 보존

| 경로 | 역할 |
| --- | --- |
| `/p/ui-motion/` | 실제 미리보기 3개가 있는 컨셉 컬렉션 |
| `/p/ui-motion/paper/` | 콘텐츠 사이트 4개 + `#design` |
| `/p/ui-motion/object/` | 온라인 스토어 4개 + `#design` |
| `/p/ui-motion/frame/` | 업무 도구 4개 + `#design` |
| `/p/ui-motion/components/` | 전체 12개와 검색·분류·상세 |
| `/p/hidden-memo/ui-motion-guide/` | 옛 가이드 호환, 기본 콘텐츠 디자인 기준 |
| `/p/ui-motion/ai-workspace/`, `/project-dashboard/` | 기존 두 대표 화면 호환 |

14개 카탈로그 ID·번호, 12개 components 해시, `#ui-THEME-KEY` 별칭, 옛 루트 컴포넌트 링크와 hero 전달을 보존한다. 항목 삭제·미완성 항목 숨김 없음. 컨셉 레지스트리에 네 번째 항목을 넣었을 때도 카드·명시적 링크·미리보기 호스트가 생성되는 계약 검사를 추가했다. 실제 네 번째 컨셉을 만들었다는 뜻은 아니다.

## 실제 Behance 확인과 적용

사이트 설명뿐 아니라 브라우저에서 아래 프로젝트 이미지를 직접 봤다. 포트폴리오의 정적 화면이므로 실제 제품 기능·모션을 검증했다고 주장하지 않는다.

| 사례 | 본 화면과 취한 원칙 |
| --- | --- |
| [Homevo — Orbillo](https://www.behance.net/gallery/247907919/Homevo-Modern-Ecommerce-Furniture-Website-UIUX-Design) | 379개 평가가 표시된 프로젝트. 실제 히어로·소개 모듈에서 따뜻한 중성색, 상품 중심 여백, 비대칭 구성을 확인했다. 스토어의 진열·가격·구매를 명료하게 분리했다. 로고·사진·영문 장식은 사용하지 않았다. |
| [October Custom Publishing — Chris Atkins](https://www.behance.net/gallery/179562053/Modern-Web-Design-for-a-Leading-Magazine-Design-Studio) | 데스크톱·모바일 화면 이미지와 두 화면 비교를 확인했다. 굵은 sans 제목·명확한 구분선·정렬된 편집 그리드를 콘텐츠 컨셉에 참고했다. |
| [APX — Filipe Carvalho](https://www.behance.net/gallery/243179235/APX-UXUI-Case-for-SaaS-IT-Management-Platform) | 장비 관리 화면이 나온 실제 모듈 이미지를 확인했다. 조용한 표면과 촘촘한 데이터/제어의 관계를 업무 도구에 참고했다. |
| [Minimal Furniture Brand — Yana Yafimava](https://www.behance.net/gallery/244441209/Minimal-Furniture-Brand-E-commerce-UXUI-Case) | 첫 이미지와 리서치 모듈을 확인했다. 아래 일부 모듈은 빈 상태라 전체 프로젝트를 확인했다고 하지 않는다. |
| [Woodora — Jahangir Hussain](https://www.behance.net/gallery/231810111/Website-Design-eCommerce-furniture-ui-ux) | 상품 진열이 나온 히어로 이미지를 확인했다. 과한 그라데이션 제목과 홍보형 구성은 채택하지 않았다. |

Behance 작품은 열람만 했으며 재사용 허락이 확인되지 않은 코드·이미지·폰트·로고를 가져오지 않았다. 자체 HTML/CSS/JS, 시스템 글꼴과 자체 상품 실루엣만 사용한다. 의존성 설치·유료 구매·가입·API 키 연결 없음. 기존 Lucian #280 MIT 고지는 해당 원본 장면과 내보내기에 유지한다. 이전 17개 사이트의 접근·라이선스 기록은 `ui-motion-resource-audit.md`에 있으며 이번에 모두 재방문했다고 주장하지 않는다. Unsplash 무료/Unsplash+ 모두 미사용이다.

## 검증 범위

- 수정 데모 12개. 최종 목록 시각 검증 12개. 목록 미검증 0개. 보존 대표 화면 2개는 이번 새 디자인 집계 제외.
- 실제 `innerWidth` 1440·1180·390에서 세 컨셉 각 4개를 렌더링하고 화면을 확인했다. 전체 스크롤 너비 초과 없음. 390px의 본문은 브라우저 스크롤바를 제외한 375px다.
- 1180px에서 폼 오류/정상 제출, FAQ 두 답변, 태그 Enter, 메뉴 복제, 저장 오류, 예약 확정, 주문 빈 결과/초기화/일괄 처리, 장바구니 수량/합계/Escape/초점 복귀, 차트 기간, 설정 방향키/저장, 업로드 취소/재시도/완료, 삭제/실행 취소를 확인했다.
- 최종 390px에서 메뉴 열기, 예약 확정, 주문 선택을 재확인했다. 날짜 버튼 44.4×48px, 주문 선택 label 44×44px를 실측했다. 한글 질문·파일명·고객·금액·상태가 잘리지 않게 확인했다.
- 독립 HTML 12개를 현재 소스로 생성해 실제 브라우저에서 각각 주요 행동을 실행했다. 업로드 취소, 메뉴 복제, 설정 저장, 북마크, 폼 오류, 태그 추가, FAQ 펼침, 4주 매출, 주문 일괄 처리, 예약 확정, 장바구니 합계, 삭제 복원 확인. 이 실행에서 콘솔 오류 0건.
- 검색 빈 결과/초기화, 이전 이름 검색, 명시적 자세히 보기, 복사 완료 피드백과 textarea/클립보드 값 일치, 상세 Escape와 열기 버튼 초점 복귀 확인.
- 세 컨셉의 디자인 모션을 직접 조작했다. 모바일에서 연속 선택/역전환과 모션 줄이기 결과 표시를 확인했다.
- Jekyll 빌드 결과에서 옛 가이드 캘린더 별칭→object 상세, 옛 루트 prompt→paper 상세, hero→기존 AI 경로 전달을 실제 브라우저에서 확인했다.
- 초기 홈에서 대형 대표 장면 모듈을 불러오지 않으며 IntersectionObserver로 미리보기와 목록을 마운트/중단한다. 390px 초기 화면은 인접한 2개 미리보기를 준비하고 나머지는 지연했다. 새 이미지·웹폰트 네트워크 요청 없음.

## 증거와 한계

대표 최종 화면은 `assets/ui-motion-gallery/concept-final-{home,paper,object,frame}-1440.png`, 각 컴포넌트 컨셉의 `-1180.png`, `-390.png`다. `concept-final-home-390.png`, `concept-final-guide-1180.png`, `concept-final-guide-390.png`도 기록했다. `concept-home-*`, `concept-inputs-*`, `concept-content-*`는 이번 턴의 중간 수정 기록이며 최종 디자인 증거와 구별한다.

Safari/Firefox, 화면 읽기 프로그램, 실제 터치 하드웨어, 모든 상태·OS 조합은 미검증이다. 모든 모션의 프레임 계측은 하지 않았다. 실서비스 전송·업로드·결제·예약 API는 구현 범위가 아니며 화면 내 로컬 시뮬레이션이다. 빌드 성공을 디자인 검증으로 대신하지 않았다.

통합 검증 결과와 커밋·배포 상태는 아래 완료 기록에 추가한다.

## 완료 검증

- `scripts/verify-all.sh`: 구조·Daily URL·HTML 목록 5개·로컬 링크 281개·Jekyll build·빌드 결과·개인정보 검사 통과.
- `ruby scripts/test-harness.rb`: 통과.
- `node scripts/test-ui-motion-guide.mjs`: 71건 통과.
- `node scripts/test-ui-motion-showcase.mjs --require-full`: 55건 통과. 새 컨셉 소속·미래 항목 노출·자기 토큰·경로·제목 부가설명 제거·코드 고지 보존을 포함한다.
- `node --check js/ui-motion-showcase/*.js`에 해당하는 각 파일 구문 검사, `git diff --check`: 통과.
- 별도 TypeScript·ESLint 설정이 없어 해당 검사는 실행하지 않았다. 구문 검사로 이를 대신했다고 주장하지 않는다.
- 실제 브라우저·독립 실행·복사·포커스·모바일·딥링크 결과는 위 표와 범위에 구분했다. 콘솔 오류 0건.
- 세 작업 스트림은 Hermes로 나눴으며 실제 사용 모델은 GPT-6 Sol/high였다. 셸, 입력·제어, 콘텐츠·오버레이로 파일 소유권을 분리했고 통합/시각 판단은 루트가 담당했다.
