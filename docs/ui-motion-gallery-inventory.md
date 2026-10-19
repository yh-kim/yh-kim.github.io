# UI·모션 요소 갤러리 인벤토리

2026-10-19 실사용 UI 개편 기준. 메인 `/p/ui-motion/`와 `/p/ui-motion/components/`는 같은12개 목록을 연다. 카탈로그14개 ID·번호·기존 경로는 보존한다. 이전 이름은 검색 별칭으로 유지했다. 아래 기능은 브라우저 내부의 로컬 시뮬레이션이며 서버 기능 구현을 뜻하지 않는다.

| 번호 | ID | 현재 이름·이전 이름 | 분류 | URL | 기존 가이드 해시 | 구현 상태 | 브라우저 동작 | 시각 확인 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | `dark-ai--hero` | Dark AI Workspace | 완성 화면 | `/p/ui-motion/ai-workspace/` | `#ui-dark-ai-hero` | 보존: 별도 경로 | 기존 대표 화면 유지, 이번 품질 집계 제외 | 이번 집계 제외 |
| 02 | `light-project--hero` | Light Project Dashboard | 완성 화면 | `/p/ui-motion/project-dashboard/` | `#ui-light-project-hero` | 보존: 별도 경로 | 기존 대표 화면 유지, 이번 품질 집계 제외 | 이번 집계 제외 |
| 03 | `dark-ai--process` | 파일 업로더 (이전: 처리 상태) | 입력 | `/p/ui-motion/components/#dark-ai--process` | `#ui-dark-ai-process` | 파일 큐·형식·크기·취소·재시도 | 샘플 진행·취소·재시도·완료; 독립 HTML 실행 | 1440·1180·390px 목록 확인 |
| 04 | `dark-ai--layers` | 드롭다운 액션 메뉴 (레이어 패널) | 탐색·설정 | `/p/ui-motion/components/#dark-ai--layers` | `#ui-dark-ai-layers` | 복제·이름 변경·보관·키보드 메뉴 | 복제·이름 변경·보관·방향키·Escape; 독립 HTML 실행 | 1440·1180·390px 목록 확인 |
| 05 | `light-project--chart` | 매출 분석 차트 (막대 차트) | 데이터 | `/p/ui-motion/components/#light-project--chart` | `#ui-light-project-chart` | 7일/4주·매출·주문·키보드 상세 값 | 기간·막대·방향키; 독립 HTML 실행 | 1440·1180·390px 목록 확인 |
| 06 | `dark-ai--controls` | 계정 설정 탭 (프리셋) | 탐색·설정 | `/p/ui-motion/components/#dark-ai--controls` | `#ui-dark-ai-controls` | 계정·알림·보안·변경·저장 | 방향키 탭·설정·저장·초점 유지; 독립 HTML 실행 | 1440·1180·390px 목록 확인 |
| 07 | `light-project--tasks` | 자주 묻는 질문 (작업 상세) | 콘텐츠 | `/p/ui-motion/components/#light-project--tasks` | `#ui-light-project-tasks` | 독립적으로 열리는 질문·긴 답변 | 여러 답변 열기·닫기; 독립 HTML 실행 | 1440·1180·390px 목록 확인 |
| 08 | `light-project--filters` | 주문 검색과 필터 (작업 필터) | 데이터 | `/p/ui-motion/components/#light-project--filters` | `#ui-light-project-filters` | 검색·상태·정렬·선택·일괄 처리 | 빈 결과·초기화·일괄 처리; 독립 HTML 실행 | 1440·1180·390px 목록 확인 |
| 09 | `light-project--calendar` | 상담 예약 피커 (캘린더) | 예약 | `/p/ui-motion/components/#light-project--calendar` | `#ui-light-project-calendar` | 가능 날짜·시간·요약·확정 | 날짜·시간·예약 완료; 독립 HTML 실행 | 1440·1180·390px 목록 확인 |
| 10 | `dark-ai--beam` | 버튼과 저장 상태 (선택 상태) | 피드백 | `/p/ui-motion/components/#dark-ai--beam` | `#ui-dark-ai-beam` | 진행·성공·오류·재시도·선택·비활성 | 저장·오류·재시도·토글; 독립 HTML 실행 | 1440·1180·390px 목록 확인 |
| 11 | `dark-ai--prompt` | 뉴스레터 구독 폼 (프롬프트 입력) | 입력 | `/p/ui-motion/components/#dark-ai--prompt` | `#ui-dark-ai-prompt` | 이름·이메일·동의·오류·제출·완료 | 잘못된/올바른 입력·완료; 독립 HTML 실행 | 1440·1180·390px 목록 확인 |
| 12 | `light-project--quick-add` | 태그 입력 (작업 추가) | 입력 | `/p/ui-motion/components/#light-project--quick-add` | `#ui-light-project-quick-add` | 추가·중복·최대6개·삭제·추천 | Enter·중복·추천·삭제; 독립 HTML 실행 | 1440·1180·390px 목록 확인 |
| 13 | `dark-ai--dialog` | 장바구니 드로어 (결과 검토) | 확인창 | `/p/ui-motion/components/#dark-ai--dialog` | `#ui-dark-ai-dialog` | 상품·수량·삭제·합계·주문·빈 상태 | 수량·합계·완료·Escape·초점; 독립 HTML 실행 | 1440·1180·390px 목록 확인 |
| 14 | `light-project--dialog` | 삭제 확인 다이얼로그 (작업 검토) | 확인창 | `/p/ui-motion/components/#light-project--dialog` | `#ui-light-project-dialog` | 이름 검증·취소·삭제·복구 | 검증·삭제·실행 취소·초점; 독립 HTML 실행 | 1440·1180·390px 목록 확인 |

시각 검증한 목록12개, 목록 미검증0개. 보존한 대표 화면2개는 새 디자인 집계에서 제외한다. 독립 HTML12개는 각각 실제 브라우저에서 주요 행동을 실행하고 콘솔 오류0건을 확인했다. 모든 상태·OS·브라우저의 조합까지 검증한 것은 아니다. 상세 가이드는 공유 템플릿을 사용하며 전체12개 상세의 모든 상태를 별도로 시각 검증했다고 주장하지 않는다.

모달은 목록에서도 열리며 갤러리 상세로 이동하지 않는다. 갤러리 상세는 자세히 보기 버튼으로만 연다. 코드·시각·브라우저 증거와 한계는 `docs/ui-motion-gallery-site-review.md`, inputs/content/design QA 기록에 구분했다.
