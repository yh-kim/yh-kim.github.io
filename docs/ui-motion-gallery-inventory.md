# UI·모션 요소 갤러리 인벤토리

2026-10-19 현재 구성. `/p/ui-motion/`은 세 콘셉트를 직접 체험하는 홈이다. [콘텐츠 사이트](/p/ui-motion/paper/), [온라인 스토어](/p/ui-motion/object/), [업무 도구](/p/ui-motion/frame/)에 각각 네 개 컴포넌트가 있다. `/p/ui-motion/components/`는 전체 12개를 한곳에서 찾는 목록으로 남는다. 예전 ID와 번호는 호환성을 위해 유지한다. ID 앞부분의 `dark-ai`·`light-project`는 현재 콘셉트를 뜻하지 않는다.

| 번호 | ID | 현재 이름 (이전 이름) | 분류 | 콘셉트 | 정식 상세 URL | 기존 전체 목록 URL | 기존 가이드 해시 | 구현 범위 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | `dark-ai--hero` | Dark AI Workspace | 대표 화면 | 호환 화면 | `/p/ui-motion/ai-workspace/` | — | `#ui-dark-ai-hero` | 기존 경로 보존 |
| 02 | `light-project--hero` | Light Project Dashboard | 대표 화면 | 호환 화면 | `/p/ui-motion/project-dashboard/` | — | `#ui-light-project-hero` | 기존 경로 보존 |
| 03 | `dark-ai--process` | 파일 업로더 (처리 상태) | 입력 | 업무 도구 | `/p/ui-motion/frame/#dark-ai--process` | `/p/ui-motion/components/#dark-ai--process` | `#ui-dark-ai-process` | 파일 형식·크기 검증, 진행·취소·재시도 |
| 04 | `dark-ai--layers` | 드롭다운 액션 메뉴 (레이어 패널) | 탐색·설정 | 콘텐츠 사이트 | `/p/ui-motion/paper/#dark-ai--layers` | `/p/ui-motion/components/#dark-ai--layers` | `#ui-dark-ai-layers` | 복제·이름 변경·보관, 키보드 메뉴 |
| 05 | `light-project--chart` | 매출 분석 차트 (막대 차트) | 데이터 | 업무 도구 | `/p/ui-motion/frame/#light-project--chart` | `/p/ui-motion/components/#light-project--chart` | `#ui-light-project-chart` | 7일·4주 매출과 주문 수, 막대 상세 값 |
| 06 | `dark-ai--controls` | 계정 설정 탭 (프리셋) | 탐색·설정 | 업무 도구 | `/p/ui-motion/frame/#dark-ai--controls` | `/p/ui-motion/components/#dark-ai--controls` | `#ui-dark-ai-controls` | 계정·알림·보안 설정과 저장 |
| 07 | `light-project--tasks` | 자주 묻는 질문 (작업 상세) | 콘텐츠 | 콘텐츠 사이트 | `/p/ui-motion/paper/#light-project--tasks` | `/p/ui-motion/components/#light-project--tasks` | `#ui-light-project-tasks` | 독립적으로 열리는 질문과 긴 답변 |
| 08 | `light-project--filters` | 주문 검색과 필터 (작업 필터) | 데이터 | 온라인 스토어 | `/p/ui-motion/object/#light-project--filters` | `/p/ui-motion/components/#light-project--filters` | `#ui-light-project-filters` | 검색·상태·정렬·선택·일괄 처리 |
| 09 | `light-project--calendar` | 상담 예약 피커 (캘린더) | 예약 | 온라인 스토어 | `/p/ui-motion/object/#light-project--calendar` | `/p/ui-motion/components/#light-project--calendar` | `#ui-light-project-calendar` | 가능 날짜·시간 선택, 요약·확정 |
| 10 | `dark-ai--beam` | 버튼과 저장 상태 (선택 상태) | 피드백 | 온라인 스토어 | `/p/ui-motion/object/#dark-ai--beam` | `/p/ui-motion/components/#dark-ai--beam` | `#ui-dark-ai-beam` | 저장 진행·성공·오류·재시도, 선택 |
| 11 | `dark-ai--prompt` | 뉴스레터 구독 폼 (프롬프트 입력) | 입력 | 콘텐츠 사이트 | `/p/ui-motion/paper/#dark-ai--prompt` | `/p/ui-motion/components/#dark-ai--prompt` | `#ui-dark-ai-prompt` | 이름·이메일·동의 검증과 완료 |
| 12 | `light-project--quick-add` | 태그 입력 (작업 추가) | 입력 | 콘텐츠 사이트 | `/p/ui-motion/paper/#light-project--quick-add` | `/p/ui-motion/components/#light-project--quick-add` | `#ui-light-project-quick-add` | 추가·중복·최대 6개·삭제·추천 |
| 13 | `dark-ai--dialog` | 장바구니 드로어 (결과 검토) | 확인창 | 온라인 스토어 | `/p/ui-motion/object/#dark-ai--dialog` | `/p/ui-motion/components/#dark-ai--dialog` | `#ui-dark-ai-dialog` | 상품·수량·삭제·합계·주문·빈 상태 |
| 14 | `light-project--dialog` | 삭제 확인 다이얼로그 (작업 검토) | 확인창 | 업무 도구 | `/p/ui-motion/frame/#light-project--dialog` | `/p/ui-motion/components/#light-project--dialog` | `#ui-light-project-dialog` | 파일 이름 검증·취소·삭제·복구 |

두 대표 화면의 경로는 기존 링크 호환을 위해 유지한다. 세 콘셉트와 12개 컴포넌트의 새 기능·디자인 범위에는 포함하지 않는다. 컴포넌트 동작은 브라우저 내부의 예시 데이터로 실행되며 서버의 업로드·주문·예약·저장을 수행하지 않는다. 이름의 예전 표현은 검색 별칭으로 남아 있다.

이 문서의 이전 판에 있던 `1440·1180·390px 목록 확인`, 독립 HTML 12개의 실제 브라우저 실행, 계약 검사 45건은 **이전 UI 구성에서 기록한 결과**다. 현재 콘셉트 구성에서는 이 턴에 1180px로 12개 주요 동작을 다시 확인했고, 에이전트의 1440px·390px 조기 화면 확인 뒤 추가 소스 수정을 진행했다. 최종 소스 상태의 전체 시각 판정과 검증 건수는 최종 통합 QA 보고서에서 기록한다. 이 표는 현재 경로와 구현 범위를 나타내며 모든 상태의 최종 검증 완료를 뜻하지 않는다.
