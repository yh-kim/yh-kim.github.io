# Lucian UX/UI Prompt: rendered audit, IDs 001–100

## Scope and method

Reviewed the live [Lucian UX/UI Prompt interface collection](https://lucianlabs.dev/uxui-prompt/) in a dedicated Chrome tab at 1440×1000, with the “인터페이스 200” filter selected. I scrolled the three-column gallery and visually inspected the rendered card previews and titles for IDs 001–100 in overlapping viewport captures. The table’s render column records the visible preview content; it does not imply every possible state or animation was exhaustively inspected. I then operated 21 demos through their visible controls and checked the resulting accessible state/labels. Search, fill, radio, checkbox, switch, slider, and button actions were local demo interactions; I did not submit a network form, purchase, or invoke an external service. The 001–100 titles/types below were reconciled against a parsed catalog snapshot; screenshot observations came from the live page, not that snapshot.

**Coverage:** catalog inventory 100 / rendered previews observed 100 / demo interactions attempted 21 (20 produced a visible state change; ID 025 is reported as an unsuccessful input-state check). Screenshot captures overlapped; ranges are not an exact screenshot-to-card partition.

## Per-component evidence

| ID | Name | Type | Rendered observation | Interaction evidence |
|---:|---|---|---|---|
| 001 | Liquid Glass 버튼 | 버튼 | Card preview and its identifying UI were visible in the rendered grid. | Clicked “계속하기”; transient “저장하는 중” then saved state. |
| 002 | 자석 화살표 버튼 | 버튼 | Card preview and its identifying UI were visible in the rendered grid. | Clicked primary CTA; button changed to “준비됐어요”. |
| 003 | 길게 눌러 삭제 | 버튼 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 004 | 진행률 다운로드 버튼 | 버튼 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 005 | 종이비행기 전송 버튼 | 버튼 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 006 | 구독 리플 버튼 | 버튼 | Card preview and its identifying UI were visible in the rendered grid. | Clicked subscribe; count changed 1,284→1,285 with subscribed status. |
| 007 | 재생 버튼 모핑 | 버튼 | Card preview and its identifying UI were visible in the rendered grid. | Clicked play; control changed to pause. |
| 008 | 복사 버튼 체크 전환 | 버튼 | Card preview and its identifying UI were visible in the rendered grid. | Selected pnpm tab; command changed from npm to pnpm. |
| 009 | 글자 굴림 버튼 | 버튼 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 010 | 분할 실행 버튼 | 버튼 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 011 | 부채꼴 플로팅 버튼 | 버튼 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 012 | 북마크 리본 | 버튼 | Card preview and its identifying UI were visible in the rendered grid. | Toggled bookmark; count changed 128→129 and action became “저장 해제”. |
| 013 | 늘어나는 스위치 | 토글·선택 | Card preview and its identifying UI were visible in the rendered grid. | Toggled do-not-disturb switch; checked state changed. |
| 014 | 할 일 체크리스트 | 토글·선택 | Card preview and its identifying UI were visible in the rendered grid. | Checked a task; checkbox state changed to checked. |
| 015 | 요금제 라디오 카드 | 토글·선택 | Card preview and its identifying UI were visible in the rendered grid. | Selected Personal plan; summary changed to free plan. |
| 016 | 별점 평가 | 토글·선택 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 017 | 기울어지는 값 말풍선 슬라이더 | 토글·선택 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 018 | 굴러가는 수량 스테퍼 | 토글·선택 | Card preview and its identifying UI were visible in the rendered grid. | Pressed +1; quantity feedback/total visibly transitioned. |
| 019 | 관심사 칩 다중 선택 | 토글·선택 | Card preview and its identifying UI were visible in the rendered grid. | Added Typography chip; selection count increased 3/5→4/5. |
| 020 | 제품 색상 고르기 | 토글·선택 | Card preview and its identifying UI were visible in the rendered grid. | Selected Sage swatch; product label changed to Sage. |
| 021 | 낮·밤 하늘 스위치 | 토글·선택 | Card preview and its identifying UI were visible in the rendered grid. | Toggled night mode; switch checked state changed. |
| 022 | 좋아요 하트 터짐 | 토글·선택 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 023 | 펼쳐지는 알림 설정 | 토글·선택 | Card preview and its identifying UI were visible in the rendered grid. | Turned off Push alerts; switch and summary changed. |
| 024 | 가격 분포 범위 필터 | 토글·선택 | Card preview and its identifying UI were visible in the rendered grid. | Clicked minimum range slider; range and result count updated. |
| 025 | 테두리로 떠오르는 라벨 입력 | 입력·검색 | Card preview and its identifying UI were visible in the rendered grid. | Attempted test email entry; AX still showed empty field and disabled invite, so no successful field-state change confirmed. |
| 026 | 인증번호 6자리 입력 | 입력·검색 | Card preview and its identifying UI were visible in the rendered grid. | Entered six test digits; demo showed “인증됐어요”. Did not submit anywhere. |
| 027 | 펼쳐지는 상단 검색 | 입력·검색 | Card preview and its identifying UI were visible in the rendered grid. | Typed in expanded search; suggestions remained visible; no result selection made. |
| 028 | 늘어나는 댓글 입력창 | 입력·검색 | Card preview and its identifying UI were visible in the rendered grid. | Edited reply draft; character count changed; did not post. |
| 029 | 색 태그 입력 | 입력·검색 | Card preview and its identifying UI were visible in the rendered grid. | Added Accessibility suggested tag; chip appeared and count changed 3/6→4/6. |
| 030 | 기간 선택 달력 | 입력·검색 | Card preview and its identifying UI were visible in the rendered grid. | Moved calendar to November; second month grid appeared. Did not apply dates. |
| 031 | 맞춤 선택 목록 | 입력·검색 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 032 | 끌어다 놓는 업로드 | 입력·검색 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 033 | 제목 바로 고치기 | 입력·검색 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 034 | 공항 자동완성 | 입력·검색 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 035 | 송금 금액 입력 | 입력·검색 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 036 | 비밀번호 강도 미터 | 입력·검색 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 037 | 계정 전환 메뉴 | 메뉴·탭 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 038 | 우클릭 컨텍스트 메뉴 | 메뉴·탭 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 039 | 미끄러지는 알약 탭 | 메뉴·탭 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 040 | 펼쳐지는 사이드 레일 | 메뉴·탭 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 041 | 홈 파인 하단 탭 바 | 메뉴·탭 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 042 | 단계 진행 마법사 | 메뉴·탭 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 043 | 늘어나는 페이지 번호 | 메뉴·탭 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 044 | 자주 묻는 질문 아코디언 | 메뉴·탭 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 045 | 버튼에서 번지는 전체 메뉴 | 메뉴·탭 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 046 | 커맨드 팔레트 | 메뉴·탭 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 047 | 기간 세그먼트 컨트롤 | 메뉴·탭 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 048 | 스와이프와 이어진 밑줄 탭 | 메뉴·탭 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 049 | 겹겹이 움직이는 에디토리얼 카드 | 카드·콘텐츠 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 050 | 빛을 따라 기우는 뉴스 카드 | 카드·콘텐츠 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 051 | 장바구니로 날아가는 상품 카드 | 카드·콘텐츠 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 052 | 돌려 보는 멤버십 카드 | 카드·콘텐츠 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 053 | 넘겨 고르는 카드 더미 | 카드·콘텐츠 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 054 | 팔로우 프로필 카드 | 카드·콘텐츠 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 055 | 레코드가 꺼내지는 플레이어 | 카드·콘텐츠 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 056 | 월·연 요금 전환 카드 | 카드·콘텐츠 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 057 | 얼굴로 넘기는 후기 캐러셀 | 카드·콘텐츠 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 058 | 읽기 진행 기사 카드 | 카드·콘텐츠 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 059 | 참석 응답 이벤트 카드 | 카드·콘텐츠 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 060 | 낮과 밤 비교 슬라이더 | 카드·콘텐츠 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 061 | 썸네일에서 열리는 라이트박스 | 카드·콘텐츠 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 062 | 로그인 카드 피드백 | 로그인·가입 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 063 | 한 문장씩 묻는 가입 폼 | 로그인·가입 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 064 | 봉투로 보내는 로그인 링크 | 로그인·가입 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 065 | 번호 맞추는 기기 승인 | 로그인·가입 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 066 | 소셜 로그인 버튼 묶음 | 로그인·가입 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 067 | 잠금 해제 카운트다운 | 로그인·가입 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 068 | 끝까지 읽고 동의하는 약관 | 로그인·가입 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 069 | 아바타 자르기 편집기 | 로그인·가입 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 070 | 겹쳐 쌓이는 토스트 | 알림·피드백 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 071 | 밀어서 지우고 되돌리는 스낵바 | 알림·피드백 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 072 | 접히는 인라인 알림 | 알림·피드백 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 073 | 굴러가는 공지 배너 | 알림·피드백 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 074 | 알림 벨과 드롭다운 | 알림·피드백 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 075 | 업로드 진행 패널 | 알림·피드백 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 076 | 미끄러지며 따라오는 툴팁 | 알림·피드백 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 077 | 반응 고르는 팝오버 | 알림·피드백 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 078 | 밀어서 답장하는 채팅 | 알림·피드백 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 079 | 뼈대에서 피어나는 게시물 | 로딩·진행 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 080 | 궤도가 모이는 동기화 스피너 | 로딩·진행 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 081 | 결제 링이 그려진 뒤 체크 | 로딩·진행 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 082 | 아이콘을 채우는 설치 진행 | 로딩·진행 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 083 | 대기에서 진행으로 바뀌는 막대 | 로딩·진행 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 084 | 목소리에 춤추는 점 로더 | 로딩·진행 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 085 | 당겨서 새로고침 | 로딩·진행 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 086 | 흘러나오는 AI 답변 | 로딩·진행 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 087 | 트럭이 달리는 배송 단계 | 로딩·진행 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 088 | 종이를 삼키는 빈 폴더 | 빈·오류 상태 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 089 | 오타를 고쳐 주는 404 | 빈·오류 상태 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 090 | 플러그가 다시 꽂히는 오류 위젯 | 빈·오류 상태 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 091 | 오프라인에서 쌓였다 보내지는 메시지 | 빈·오류 상태 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 092 | 필터를 풀어 주는 빈 검색 결과 | 빈·오류 상태 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 093 | 할 일을 다 끝내면 터지는 축하 | 빈·오류 상태 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 094 | 시간을 끌어 보는 날씨 하늘 | 위젯·차트 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 095 | 모양이 바뀌는 막대 차트 | 위젯·차트 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 096 | 훑으면 색이 갈리는 주가 선 | 위젯·차트 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 097 | 항목을 빼면 다시 나뉘는 도넛 | 위젯·차트 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 098 | 자리마다 굴러가는 실시간 지표 | 위젯·차트 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 099 | 한 바퀴를 넘기는 활동 링 | 위젯·차트 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |
| 100 | 반으로 접히는 플립 타이머 | 위젯·차트 | Card preview and its identifying UI were visible in the rendered grid. | Visual only; no direct interaction tested. |

## Lessons for our component gallery

1. **Keep the demo in its natural shape.** The reference uses a three-column card grid, but lets the calendar in 030, article in 058, and long terms panel in 068 take more vertical room than a compact toggle. Our gallery already varies scene heights by component; preserve that decision and check that previews do not crop their date grid, article progress, or content body just to align card bottoms.
2. **Let the state change carry the explanation.** In 006 the follower count and subscribed label change together; 012 updates saved state and count; 015 changes the plan summary; 029 adds a chip and increments the selection count. Our gallery already ties demos to shared data; keep the same source of truth in card, detail, and exported views, and make the nearby status/value update visible with each action.
3. **Use motion to connect related values.** The price range in 024 updates bounds and result count; 030 adds a second calendar grid when the month changes; 018 ties quantity changes to the total. For our gallery, animate only these dependent values, keep the final state readable, and let the action settle quickly. The reference’s glowing ambient surfaces are visually prominent; our paper-and-rust palette should remain calm so motion does not become the focal point by itself.
4. **Keep recovery beside the action.** The undo affordance in 003/012, snackbar in 071, retry panel in 090, and inline alert in 072 show useful outcomes near their trigger. Our gallery has distinct input, console, and dialog scenes; use their available space for confirmation, undo, or retry in the same component rather than adding a detached toast that obscures the preview.
5. **Treat accessible state as part of the motion design.** AX exposed names and roles for radios, switches, checkboxes, sliders, textboxes, and calendar buttons in 013–030; click tests confirmed state changes in several. Keep our existing semantic-control approach and verify that keyboard focus, selected/value announcements, and reduced-motion behavior stay aligned with visual transitions. This audit did not test keyboard navigation or reduced-motion settings.

## Limits

This is a rendered visual and interaction sample of the first 100 interface entries, not an audit of IDs 101–200 or the 200 animation entries, nor a source-code, keyboard, screen-reader, reduced-motion, cross-browser, or licensing review. The page’s demos are illustrative mockups; visible generated copy and simulated counts were treated as UI content, not verified product data. No third-party code or media was copied into our repository.
