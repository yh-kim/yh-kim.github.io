# UI·모션 요소 갤러리 인벤토리

새 요소 갤러리는 `/p/ui-motion/components/`에서 두 테마의 개별 요소 12개를 보여 준다. 대표 화면 두 개는 기존 테마 화면에 남는다. 카탈로그의 기존 01–12 순서와 ID는 유지하고, 빠져 있던 두 검토 다이얼로그를 13–14로 추가했다. 카드·큰 보기·독립 HTML 내보내기는 같은 카탈로그 항목과 실행 함수를 사용한다.

| 번호 | ID | 이름 | 분류 | 새 갤러리 주소 | 기존 가이드 해시 | 구현 상태 | 브라우저 동작 | 시각 확인 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | `dark-ai--hero` | Dark AI Workspace | 완성 화면 | 범위 밖: `/p/ui-motion/ai-workspace/` | `#ui-dark-ai-hero` | 기존 화면 유지 | 별도 확인 대상 | 별도 확인 대상 |
| 02 | `light-project--hero` | Light Project Dashboard | 완성 화면 | 범위 밖: `/p/ui-motion/project-dashboard/` | `#ui-light-project-hero` | 기존 화면 유지 | 별도 확인 대상 | 별도 확인 대상 |
| 03 | `dark-ai--process` | 처리 상태 | 처리·피드백 | `/p/ui-motion/components/#dark-ai--process` | `#ui-dark-ai-process` | 소스 연결됨: 카탈로그·공유 엔진 | 1440px: 완료 100%·취소 0%; 1180·390px 조작 확인 | 1440·1180·390px 카드·상세 확인 |
| 04 | `dark-ai--layers` | 레이어 패널 | 패널 | `/p/ui-motion/components/#dark-ai--layers` | `#ui-dark-ai-layers` | 소스 연결됨: 카탈로그·공유 엔진 | 1440px: 다시 재생; 1180·390px 조작 확인 | 1440·1180·390px 카드·상세 확인 |
| 05 | `light-project--chart` | 막대 차트 | 목록·차트 | `/p/ui-motion/components/#light-project--chart` | `#ui-light-project-chart` | 소스 연결됨: 카탈로그·공유 엔진 | 1440px: 누적값·End·툴팁·Escape; 1180·390px 조작 확인 | 1440·1180·390px 카드·상세 확인 |
| 06 | `dark-ai--controls` | 프리셋 | 선택·전환 | `/p/ui-motion/components/#dark-ai--controls` | `#ui-dark-ai-controls` | 소스 연결됨: 카탈로그·공유 엔진 | 1440px: 화살표로 포스터 전환; 1180·390px 조작 확인 | 1440·1180·390px 카드·상세 확인 |
| 07 | `light-project--tasks` | 작업 상세 | 패널 | `/p/ui-motion/components/#light-project--tasks` | `#ui-light-project-tasks` | 소스 연결됨: 카탈로그·공유 엔진 | 1440px: T-03 선택·상세; 1180·390px 조작 확인 | 1440·1180·390px 카드·상세 확인 |
| 08 | `light-project--filters` | 작업 필터 | 목록·차트 | `/p/ui-motion/components/#light-project--filters` | `#ui-light-project-filters` | 소스 연결됨: 카탈로그·공유 엔진 | 1440px: 완료 2건·행 2개; 1180·390px 조작 확인 | 1440·1180·390px 카드·상세 확인 |
| 09 | `light-project--calendar` | 캘린더 | 일정 | `/p/ui-motion/components/#light-project--calendar` | `#ui-light-project-calendar` | 소스 연결됨: 카탈로그·공유 엔진 | 1440px: 20일 일정 0건; 1180·390px 조작 확인 | 1440·1180·390px 카드·상세 확인 |
| 10 | `dark-ai--beam` | 선택 상태 | 선택·전환 | `/p/ui-motion/components/#dark-ai--beam` | `#ui-dark-ai-beam` | 소스 연결됨: 카탈로그·공유 엔진 | 1440px: 두 번째 선택·비활성 상태; 1180·390px 조작 확인 | 1440·1180·390px 카드·상세 확인 |
| 11 | `dark-ai--prompt` | 프롬프트 입력 | 입력 | `/p/ui-motion/components/#dark-ai--prompt` | `#ui-dark-ai-prompt` | 소스 연결됨: 카탈로그·공유 엔진 | 1440px: 빈 값 오류·유효한 문장 성공; 1180·390px 조작 확인 | 1440·1180·390px 카드·상세 확인 |
| 12 | `light-project--quick-add` | 작업 추가 | 입력 | `/p/ui-motion/components/#light-project--quick-add` | `#ui-light-project-quick-add` | 소스 연결됨: 카탈로그·공유 엔진 | 1440px: 오류·7번째 작업·중복 오류; 1180·390px 조작 확인 | 1440·1180·390px 카드·상세 확인 |
| 13 | `dark-ai--dialog` | 결과 검토 | 확인창 | `/p/ui-motion/components/#dark-ai--dialog` | `#ui-dark-ai-dialog` | 소스 연결됨: 카탈로그·공유 엔진 | 1440px: Escape·초점 복귀·확인·초기화; 1180px: 열기·Escape; 390px: Escape·열기 버튼 초점 복귀 | 1440·1180·390px 카드·상세 확인, 모바일 상단 0px·가로 넘침 없음 |
| 14 | `light-project--dialog` | 작업 검토 | 확인창 | `/p/ui-motion/components/#light-project--dialog` | `#ui-light-project-dialog` | 소스 연결됨: 카탈로그·공유 엔진 | 1440px: T-03 검토·Escape·초점 복귀; 1180px: 열기·Escape; 390px: Escape·열기 버튼 초점 복귀 | 1440·1180·390px 카드·상세 확인, 모바일 상단 0px·가로 넘침 없음 |

기존 가이드 해시는 `/p/hidden-memo/ui-motion-guide/` 뒤에 붙인다. 위 `구현 상태` 열은 소스 연결만 기록한다. 1440px에서 12개, 1180px에서 12개, 390px에서 12개 카드·상세 화면과 조작을 확인했다. 390px 화면에는 가로 넘침이 없었고, 두 내부 다이얼로그는 Escape로 닫힌 뒤 열기 버튼에 초점이 돌아왔다.

독립 HTML 내보내기는 `light-project--chart`와 `dark-ai--prompt` 두 개를 실제 브라우저에서 실행했다. 차트는 누적 19일 툴팁 6건, 프롬프트는 유효 입력 성공을 확인했고 두 페이지에서 콘솔 오류가 없었다. 프롬프트 HTML의 다운로드와 복사 동작도 확인했다. 나머지 10개 내보내기는 인라인 스크립트 구문 검사와 외부 의존성 검사만 통과했으며, 브라우저 실행은 확인하지 않았다. 390px 전체 화면은 인앱 브라우저에서 확인했다. 별도 Chrome 캡처는 페이지 스크롤 오프셋 때문에 위치 기록이 일치하지 않아 교차 브라우저 시각 판정에 사용하지 않았다.
