# 콘텐츠 컴포넌트 QA · 2026-10-19

`/p/ui-motion/paper/`, `/object/`, `/frame/`의 여섯 콘텐츠 데모를 브라우저에서 확인했다. 데스크톱 상세 화면(약 1264px 브라우저 창)과 390px 임베드 뷰포트를 사용했다. 모바일에서는 기능을 숨기지 않고 날짜, 상품, 파일과 주문 정보가 읽히는지 확인했다.

| 컴포넌트 | 확인한 동작 | 390px 확인 |
| --- | --- | --- |
| 구독 안내 FAQ | 두 답변을 동시에 열고 접기, 읽기 순서 | 질문과 긴 답변 영역의 줄바꿈 |
| 주문 관리 | 검색, 행 선택, 일괄 배송 완료 후 상태·건수 갱신 | 가로 스크롤 없이 주문·고객·금액·상태를 두 줄 행에 표시 |
| 방문 상담 예약 | 날짜와 시간 선택, 요약·확정 결과 | 7열 날짜와 네 개 시간 버튼 표시 |
| 장바구니 | 수량 증가 시 합계 갱신, 주문 완료 후 빈 상태·다시 담기, Escape 닫기와 열기 버튼 초점 복귀 | 상품 두 개와 드로어 수량 제어 표시 |
| 매출 현황 | 기간 변경, 막대 선택, Escape 선택 해제 | 차트 7개 막대와 라벨 표시 |
| 공유 자료 | 파일명 일치 시에만 삭제, 삭제 후 실행 취소 | 파일명·형식·크기·삭제 버튼과 확인창 표시 |

화면 예시: [구독 안내](assets/ui-motion-gallery/concept-content-paper.png) · [390px](assets/ui-motion-gallery/concept-content-paper-mobile.png), [장바구니](assets/ui-motion-gallery/concept-content-object.png) · [390px](assets/ui-motion-gallery/concept-content-object-mobile.png), [매출 현황](assets/ui-motion-gallery/concept-content-frame.png) · [390px](assets/ui-motion-gallery/concept-content-frame-mobile.png).

정적 검증: `node --check js/ui-motion-showcase/site-content.js`, `git diff --check -- js/ui-motion-showcase/site-content.js` 통과. 전체 하네스는 최종 통합 단계에서 실행한다.
