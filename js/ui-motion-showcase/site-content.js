// Standalone website patterns. Wire is intentionally self-contained so the gallery can serialize it.
import {productImages} from './product-assets.js?v=20261019-refine5';
export function contentMarkup(item) {
  const id = item && item.id;
  const wrap = (key, html) => `<div class="site-study study-${key}">${html}</div>`;
  if (id === 'light-project--chart') return wrap('chart', `<section class="site-content site-chart" aria-label="매출 분석">
    <div class="sc-dashboard"><div class="sc-chart-main"><header class="sc-head"><h3>매출 현황</h3><div class="sc-segment" role="group" aria-label="조회 기간"><button type="button" data-period="week" aria-pressed="true">최근 7일</button><button type="button" data-period="month" aria-pressed="false">최근 4주</button></div></header>
    <div class="sc-stat"><div><span>선택 기간 매출</span><strong data-total>₩0</strong><small data-comparison></small></div></div>
    <div class="sc-chart-area"><div class="sc-y-axis" aria-hidden="true"><span data-ymax></span><span data-ymid></span><span>0</span></div><div class="sc-chart-graph"><div class="sc-plot" role="group" aria-label="매출 막대 차트" data-bars></div><div class="sc-axis" data-labels></div></div></div>
    <div class="sc-foot"><span>결제 완료 주문 기준</span><span>KRW · 매출액</span></div></div>
    <aside class="sc-context" aria-label="매출 요약"><h4>기간 요약</h4><div class="sc-context-metric"><span>주문 건수</span><strong data-orders></strong></div><div class="sc-context-detail"><span>선택한 구간</span><p class="sc-tooltip" data-tooltip role="status"></p></div></aside></div></section>`);
  if (id === 'light-project--tasks') return wrap('tasks', `<section class="site-content site-faq" aria-label="구독 서비스 자주 묻는 질문">
    <header class="sc-head"><div><span class="sc-kicker">고객 지원</span><h3>구독 안내</h3></div></header>
    <div class="sc-faq-list">
      <details><summary><span class="sc-faq-question">무료 체험이 끝나면 자동으로 결제되나요?</span><span class="sc-faq-plus" aria-hidden="true">+</span></summary><div class="sc-answer"><p>체험 시작 시 등록한 결제 수단으로 다음 날 첫 요금이 청구됩니다. 체험 종료 하루 전 이메일로 안내하며, 그 전에 해지하면 요금이 청구되지 않습니다.</p></div></details>
      <details><summary><span class="sc-faq-question">구독 요금제는 언제든 바꿀 수 있나요?</span><span class="sc-faq-plus" aria-hidden="true">+</span></summary><div class="sc-answer"><p>계정 설정의 요금제 관리에서 언제든 변경할 수 있습니다. 상위 요금제는 바로 적용되고, 하위 요금제는 다음 결제일부터 적용됩니다.</p></div></details>
      <details><summary><span class="sc-faq-question">결제 영수증은 어디에서 확인하나요?</span><span class="sc-faq-plus" aria-hidden="true">+</span></summary><div class="sc-answer"><p>계정 설정 → 결제 내역에서 월별 영수증을 열거나 내려받을 수 있습니다. 결제 완료 시 등록한 이메일로도 전송됩니다.</p></div></details>
      <details><summary><span class="sc-faq-question">구독을 해지하면 자료는 어떻게 되나요?</span><span class="sc-faq-plus" aria-hidden="true">+</span></summary><div class="sc-answer"><p>현재 결제 기간이 끝날 때까지 서비스를 이용할 수 있습니다. 작성한 자료는 해지 후 30일 동안 보관되어 내보낼 수 있습니다.</p></div></details>
    </div></section>`);
  if (id === 'light-project--filters') return wrap('filters', `<section class="site-content site-orders" aria-label="주문 관리">
    <header class="sc-head"><div><span class="sc-kicker">판매자 센터</span><h3>주문 관리</h3></div><strong class="sc-count" data-total-count></strong></header>
    <div class="sc-filterbar"><label class="sc-search"><span class="sr-only">주문 검색</span><input class="field" type="search" data-search placeholder="고객명 또는 주문번호 검색"></label><label><span class="sr-only">상태 필터</span><select class="field" data-status><option value="all">모든 상태</option><option value="paid">결제 완료</option><option value="ready">배송 준비</option><option value="sent">배송 완료</option></select></label><label><span class="sr-only">정렬 순서</span><select class="field" data-sort><option value="recent">최신순</option><option value="amount">금액 높은순</option><option value="name">고객명순</option></select></label></div>
    <div class="sc-order-summary"><span data-visible-count></span><span data-status-count></span></div>
    <div class="sc-table-wrap"><table><thead><tr><th><label class="sc-check-hit"><input type="checkbox" data-select-all aria-label="보이는 주문 모두 선택"></label></th><th>주문</th><th>고객</th><th>금액</th><th>상태</th></tr></thead><tbody data-rows></tbody></table><p class="sc-empty" data-empty hidden>검색 결과가 없습니다. <button type="button" class="btn" data-clear>조건 초기화</button></p></div>
    <div class="sc-bulk"><span data-selection>선택한 주문 없음</span><button type="button" class="btn primary" data-bulk disabled>선택 주문 배송 완료</button></div><p class="sc-feedback" data-feedback role="status"></p></section>`);
  if (id === 'light-project--calendar') return wrap('calendar', `<section class="site-content site-booking" aria-label="상담 예약">
    <header class="sc-head"><div><span class="sc-kicker">30분 상담</span><h3>방문 상담 예약</h3></div></header>
    <div class="sc-month"><strong>2026년 10월</strong><span>10월 19일 — 11월 1일</span></div><div class="sc-weekdays"><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span><span>일</span></div><div class="sc-dates" data-dates role="group" aria-label="상담 날짜"></div>
    <div class="sc-time-head"><strong>상담 시간</strong><span>한국 시간 (KST)</span></div><div class="sc-times" data-times role="group" aria-label="상담 시간"></div>
    <div class="sc-book-summary"><span>선택한 일정</span><strong data-summary>날짜와 시간을 선택하세요</strong></div><button type="button" class="btn primary sc-book" data-book disabled>예약 확정</button><p class="sc-feedback" data-feedback role="status"></p></section>`);
  if (id === 'dark-ai--dialog') return wrap('dialog', `<section class="site-content site-cart" aria-label="쇼핑 장바구니">
    <header class="sc-head"><h3>오브젝트 스토어</h3><button type="button" class="btn sc-cart-open" data-open>장바구니 <span data-cart-count>3</span></button></header>
    <div class="sc-products"><article><div class="sc-product-mark sc-product-note"><img src="${productImages.note}" data-product-image="note" alt="밝은 표지의 아카이브 노트 제품 사진" width="640" height="640"></div><div class="sc-product-info"><div><strong>아카이브 노트</strong><em>크림 · A5 · 120매</em></div><b>₩18,000</b></div><button type="button" class="btn" data-add="note">장바구니에 담기</button></article><article><div class="sc-product-mark sc-product-tray"><img src="${productImages.tray}" data-product-image="tray" alt="검은색 알루미늄 데스크 트레이 제품 사진" width="640" height="640"></div><div class="sc-product-info"><div><strong>데스크 트레이</strong><em>블랙 · 알루미늄</em></div><b>₩32,000</b></div><button type="button" class="btn" data-add="tray">장바구니에 담기</button></article></div>
    <p class="sr-only" data-add-message role="status" aria-live="polite"></p><dialog class="sc-drawer" aria-label="장바구니"><div class="sc-drawer-head"><h3>장바구니 <span data-dialog-count></span></h3><button type="button" class="btn" data-close aria-label="장바구니 닫기">닫기</button></div><div class="sc-cart-lines" data-lines></div><div class="sc-drawer-foot"><div><span>상품 합계</span><strong data-subtotal></strong></div><p>배송비는 결제 단계에서 확인할 수 있습니다.</p><button type="button" class="btn primary" data-checkout>주문 완료</button><button type="button" class="btn" data-restore hidden>다시 담기</button><p data-cart-message role="status"></p></div></dialog></section>`);
  if (id === 'light-project--dialog') return wrap('dialog', `<section class="site-content site-delete" aria-label="프로젝트 파일 관리">
    <header class="sc-head"><div><span class="sc-kicker">프로젝트 파일</span><h3>공유 자료</h3></div><strong class="sc-count" data-file-count></strong></header>
    <div class="sc-files" data-files></div><div class="sc-undo" data-undo-wrap hidden><span data-result role="status"></span><button type="button" class="btn" data-undo>실행 취소</button></div>
    <dialog class="sc-confirm" aria-labelledby="sc-confirm-title"><div class="sc-confirm-head"><span class="sc-kicker">파일 삭제</span><button type="button" class="btn" data-cancel aria-label="닫기">닫기</button></div><h3 id="sc-confirm-title">이 파일을 삭제할까요?</h3><p><strong data-target-name></strong> 파일이 목록에서 삭제됩니다. 파일 이름을 입력하면 삭제 버튼이 활성화됩니다.</p><label>파일 이름 입력<input class="field" type="text" data-confirm-input autocomplete="off"></label><div class="sc-confirm-actions"><button type="button" class="btn" data-cancel>취소</button><button type="button" class="btn sc-danger" data-confirm disabled>파일 삭제</button></div></dialog></section>`);
  return null;
}

export function contentCSS() { return `
.site-study .site-content{box-sizing:border-box;width:100%;min-width:0;padding:var(--space-8,32px);background:var(--concept-paper,var(--surface,#fff));color:var(--ink,#17243a);font:14px/1.5 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",sans-serif}
.site-study .site-content *{box-sizing:border-box}
.site-study .site-content h3,.site-study .site-content h4,.site-study .site-content p{margin:0}
.site-study .site-content h3{font-size:27px;font-weight:700;line-height:1.22;letter-spacing:-.04em}
.site-study .site-content button,.site-study .site-content input,.site-study .site-content select{font:inherit}
.site-study .site-content button{cursor:pointer}
.site-study .site-content button:disabled{cursor:not-allowed;opacity:.48}
.site-study .site-content button:focus-visible,.site-study .site-content input:focus-visible,.site-study .site-content select:focus-visible,.site-study .site-content summary:focus-visible{outline:3px solid var(--focus,var(--accent));outline-offset:3px}
.site-study .site-content [hidden]{display:none!important}
.site-study .site-content .sc-head{display:flex;align-items:center;justify-content:space-between;gap:var(--space-4,16px);margin-bottom:var(--space-6,24px)}
.site-study .site-content .sc-kicker{display:block;margin-bottom:var(--space-1,4px);color:var(--muted);font-size:11px;font-weight:700}
.site-study .site-content .sc-feedback{min-height:18px;margin-top:var(--space-2,8px);color:var(--accent);font-size:12px}
.site-study .site-content .field{width:100%;min-width:0;min-height:44px;padding:9px 12px;border:1px solid var(--line);border-radius:var(--control-radius,6px);background:var(--surface,#fff);color:var(--ink)}
.site-study .site-content .btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:9px 14px;border:1px solid var(--line);border-radius:var(--control-radius,6px);background:var(--surface,#fff);color:var(--ink);font-size:12px;font-weight:650;line-height:1.35;text-decoration:none}
.site-study .site-content .btn:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}
.site-study .site-content .btn.primary{background:var(--accent);border-color:var(--accent);color:#fff}
.site-study .site-content .btn.primary:hover:not(:disabled){filter:brightness(.9);color:#fff}
.site-study .site-content dialog{color:var(--ink);border:1px solid var(--line);box-shadow:0 24px 70px #15243e35}
.site-study .site-content dialog::backdrop{background:#17202ca8}
/* Reading page */
.site-study .site-faq{background:var(--concept-paper,#f7f7f5);padding:var(--space-8,32px) clamp(24px,5vw,54px)}
.site-study .site-faq .sc-head,.site-study .site-faq .sc-faq-list{max-width:700px;margin-inline:auto}
.site-study .site-faq .sc-head{padding-bottom:var(--space-4,16px);margin-bottom:0;border-bottom:1px solid var(--ink)}
.site-study .site-faq h3{font-size:29px}
.site-study .site-faq details{border-bottom:1px solid var(--line)}
.site-study .site-faq summary{display:grid;grid-template-columns:minmax(0,1fr) 30px;align-items:center;gap:var(--space-4,16px);min-height:68px;cursor:pointer;list-style:none}
.site-study .site-faq summary::-webkit-details-marker{display:none}
.site-study .site-faq .sc-faq-question{font-size:16px;font-weight:650;line-height:1.5;letter-spacing:-.02em}
.site-study .site-faq .sc-faq-plus{display:grid;place-items:center;justify-self:end;width:28px;height:28px;color:var(--accent);font:300 23px/1 Arial,sans-serif;transition:transform .22s ease}
.site-study .site-faq details[open] .sc-faq-plus{transform:rotate(45deg)}
.site-study .site-faq .sc-answer{padding:0 40px var(--space-6,24px) 0}
.site-study .site-faq .sc-answer p{color:var(--muted);font-size:14px;line-height:1.75;word-break:keep-all}
/* Store order table */
.site-study .site-orders{background:var(--concept-paper,#f5f3ef)}
.site-study .site-orders .sc-count{font-size:16px;font-weight:750;font-variant-numeric:tabular-nums}
.site-study .site-orders .sc-filterbar{display:grid;grid-template-columns:minmax(180px,1fr) minmax(135px,auto) minmax(135px,auto);gap:var(--space-2,8px);padding:var(--space-4,16px) 0;border-top:1px solid var(--line)}
.site-study .site-orders .sc-order-summary{display:flex;justify-content:space-between;gap:var(--space-2,8px);padding:0 0 var(--space-3,12px);color:var(--muted);font-size:12px}
.site-study .site-orders .sc-order-summary span:first-child{color:var(--ink);font-weight:700}
.site-study .site-orders .sc-table-wrap{width:100%;overflow-x:auto;background:var(--surface,#fff);border:1px solid var(--line);border-radius:var(--control-radius,6px)}
.site-study .site-orders table{width:100%;min-width:510px;border-collapse:collapse;text-align:left}
.site-study .site-orders th,.site-study .site-orders td{padding:11px 10px;border-bottom:1px solid var(--line);font-size:12px;white-space:nowrap}
.site-study .site-orders th{background:#f7f7f6;color:var(--muted);font-size:11px;font-weight:700}
.site-study .site-orders th:first-child,.site-study .site-orders td:first-child{width:48px;padding:0 2px}
.site-study .site-orders tbody tr:last-child td{border-bottom:0}
.site-study .site-orders tbody tr:hover{background:#f7f8f9}
.site-study .site-orders td:nth-child(2) strong,.site-study .site-orders td:nth-child(4){font-variant-numeric:tabular-nums}
.site-study .site-orders .sc-check-hit{display:grid;place-items:center;width:44px;min-height:44px;cursor:pointer}
.site-study .site-orders input[type=checkbox]{width:18px;height:18px;accent-color:var(--accent);cursor:pointer}
.site-study .site-orders .sc-status{display:inline-block;padding:5px 8px;border-radius:4px;background:#ebedf0;color:#3f4853;font-size:11px}
.site-study .site-orders .sc-status[data-state=ready]{background:#f2ebdc;color:#685428}
.site-study .site-orders .sc-status[data-state=sent]{background:#e5eee8;color:#2c5f40}
.site-study .site-orders .sc-empty{padding:var(--space-6,24px);color:var(--muted);font-size:13px;text-align:center}
.site-study .site-orders .sc-empty .btn{margin-left:var(--space-2,8px)}
.site-study .site-orders .sc-bulk{display:flex;align-items:center;justify-content:space-between;gap:var(--space-3,12px);margin-top:var(--space-4,16px);color:var(--muted);font-size:12px}
/* Appointment picker */
.site-study .site-booking{max-width:720px;margin:auto;background:var(--concept-paper,#f5f3ef)}
.site-study .site-booking .sc-month,.site-study .site-booking .sc-time-head{display:flex;align-items:center;justify-content:space-between;gap:var(--space-2,8px);margin-bottom:var(--space-3,12px)}
.site-study .site-booking .sc-month{padding-top:var(--space-4,16px);border-top:1px solid var(--line)}
.site-study .site-booking .sc-month strong,.site-study .site-booking .sc-time-head strong{font-size:16px}
.site-study .site-booking .sc-month span,.site-study .site-booking .sc-time-head span{color:var(--muted);font-size:11px}
.site-study .site-booking .sc-weekdays,.site-study .site-booking .sc-dates{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:var(--space-1,4px);text-align:center}
.site-study .site-booking .sc-weekdays{margin-bottom:var(--space-1,4px);color:var(--muted);font-size:11px}
.site-study .site-booking .sc-weekdays span{padding:6px 0}
.site-study .site-booking .sc-dates button{min-height:48px;padding:4px;border:1px solid var(--line);border-radius:var(--control-radius,6px);background:var(--surface,#fff);color:var(--ink);font-size:13px;font-variant-numeric:tabular-nums}
.site-study .site-booking .sc-dates button:disabled{background:transparent;color:var(--muted);text-decoration:line-through}
.site-study .site-booking .sc-dates button:hover:not(:disabled),.site-study .site-booking .sc-times button:hover:not(:disabled){border-color:var(--accent)}
.site-study .site-booking .sc-dates button[aria-pressed=true],.site-study .site-booking .sc-times button[aria-pressed=true]{background:var(--accent);border-color:var(--accent);color:#fff}
.site-study .site-booking .sc-time-head{margin-top:var(--space-6,24px)}
.site-study .site-booking .sc-times{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--space-2,8px)}
.site-study .site-booking .sc-times button{min-height:44px;border:1px solid var(--line);border-radius:var(--control-radius,6px);background:var(--surface,#fff);color:var(--ink);font-variant-numeric:tabular-nums}
.site-study .site-booking .sc-book-summary{display:grid;gap:var(--space-1,4px);margin:var(--space-6,24px) 0 var(--space-3,12px);padding-top:var(--space-4,16px);border-top:1px solid var(--line)}
.site-study .site-booking .sc-book-summary span{color:var(--muted);font-size:11px}
.site-study .site-booking .sc-book-summary strong{font-size:16px}
.site-study .site-booking .sc-book{width:100%}
/* Product photography and cart */
.site-study .site-cart{max-width:960px;margin-inline:auto;background:var(--surface,#fff)}
.site-study .site-cart .sc-head{padding-bottom:var(--space-4,16px);border-bottom:1px solid var(--line)}
.site-study .site-cart .sc-head h3{font-size:24px}
.site-study .site-cart .sc-cart-open{white-space:nowrap}
.site-study .site-cart .sc-cart-open span{display:inline-grid;place-items:center;width:22px;height:22px;margin-left:var(--space-2,8px);border-radius:50%;background:var(--ink);color:#fff;font-size:11px;font-weight:750;font-variant-numeric:tabular-nums}
.site-study .site-cart .sc-products{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--space-6,24px)}
.site-study .site-cart .sc-products article{display:flex;flex-direction:column;min-width:0}
.site-study .site-cart .sc-product-mark{width:100%;aspect-ratio:1/1;overflow:hidden;background:#f3f3f1}
.site-study .site-cart .sc-product-mark img{display:block;width:100%;height:100%;object-fit:contain;object-position:center}
.site-study .site-cart .sc-product-info{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--space-3,12px);padding:var(--space-4,16px) 0 var(--space-3,12px)}
.site-study .site-cart .sc-products strong{display:block;margin-bottom:3px;font-size:16px;font-weight:700;line-height:1.3}
.site-study .site-cart .sc-products em{display:block;color:var(--muted);font-size:12px;font-style:normal}
.site-study .site-cart .sc-products b{flex:none;font-size:18px;font-variant-numeric:tabular-nums;line-height:1.3;white-space:nowrap}
.site-study .site-cart .sc-products .btn{width:100%;min-height:44px;margin-top:auto;background:var(--ink);border-color:var(--ink);color:#fff}
.site-study .site-cart .sc-products .btn:hover:not(:disabled){background:#161616;border-color:#161616;color:#fff}
.site-study .site-cart .sc-drawer{position:fixed;inset:0 0 0 auto;display:none;flex-direction:column;width:min(460px,100vw);max-width:none;height:100dvh;max-height:none;margin:0;padding:var(--space-8,32px);background:var(--surface,#fff)}
.site-study .site-cart .sc-drawer[open]{display:flex}
.site-study .site-cart .sc-drawer-head,.site-study .site-cart .sc-drawer-foot>div{display:flex;align-items:center;justify-content:space-between;gap:var(--space-2,8px)}
.site-study .site-cart .sc-drawer-head{padding-bottom:var(--space-4,16px);border-bottom:1px solid var(--line)}
.site-study .site-cart .sc-drawer-head h3{font-size:23px}
.site-study .site-cart .sc-cart-lines{flex:1;overflow:auto}
.site-study .site-cart .sc-cart-line{display:grid;grid-template-columns:72px minmax(0,1fr) auto;align-items:start;gap:var(--space-3,12px);padding:var(--space-4,16px) 0;border-bottom:1px solid var(--line)}
.site-study .site-cart .sc-cart-line img{grid-row:1/3;display:block;width:72px;height:72px;object-fit:contain;background:#f3f3f1}
.site-study .site-cart .sc-cart-line>strong{font-size:13px;font-variant-numeric:tabular-nums;white-space:nowrap}
.site-study .site-cart .sc-cart-line small{display:block;margin-top:var(--space-1,4px);color:var(--muted);font-size:11px}
.site-study .site-cart .sc-quantity{grid-column:2/-1;display:flex;align-items:center;gap:var(--space-2,8px)}
.site-study .site-cart .sc-quantity button{min-width:44px;min-height:44px;padding:0 8px;border:1px solid var(--line);border-radius:var(--control-radius,6px);background:var(--surface,#fff);color:var(--ink)}
.site-study .site-cart .sc-quantity span{min-width:26px;text-align:center;font-variant-numeric:tabular-nums}
.site-study .site-cart .sc-quantity .sc-remove{margin-left:auto}
.site-study .site-cart .sc-drawer-foot{padding-top:var(--space-4,16px);border-top:1px solid var(--line)}
.site-study .site-cart .sc-drawer-foot>div strong{font-size:22px;font-variant-numeric:tabular-nums}
.site-study .site-cart .sc-drawer-foot p{margin:var(--space-2,8px) 0;color:var(--muted);font-size:11px}
.site-study .site-cart .sc-drawer-foot>.btn{width:100%;margin-top:var(--space-2,8px)}
.site-study .site-cart .sc-empty-cart{padding:var(--space-6,24px) 0;color:var(--muted)}
/* Analytics workspace */
.site-study .site-chart{padding:0;background:var(--surface,#fff)}
.site-study .site-chart .sc-dashboard{display:grid;grid-template-columns:minmax(0,3.2fr) minmax(160px,1fr);min-height:470px;border:1px solid var(--line);background:var(--surface,#fff)}
.site-study .site-chart .sc-chart-main{min-width:0;padding:var(--space-8,32px) var(--space-6,24px) var(--space-6,24px)}
.site-study .site-chart .sc-head{margin-bottom:var(--space-6,24px)}
.site-study .site-chart .sc-head h3{font-size:25px}
.site-study .site-chart .sc-segment{display:flex;gap:2px;padding:2px;border:1px solid var(--line);border-radius:var(--control-radius,6px);background:#f4f6f9}
.site-study .site-chart .sc-segment button{min-height:44px;padding:0 var(--space-3,12px);border:0;border-radius:4px;background:transparent;color:var(--muted);font-size:11px;font-weight:700}
.site-study .site-chart .sc-segment button[aria-pressed=true]{background:var(--surface,#fff);color:var(--ink);box-shadow:0 1px 3px #17243a1a}
.site-study .site-chart .sc-stat{margin-bottom:var(--space-6,24px)}
.site-study .site-chart .sc-stat span,.site-study .site-chart .sc-stat small{display:block;color:var(--muted);font-size:11px}
.site-study .site-chart .sc-stat strong{display:block;color:var(--ink);font-size:34px;line-height:1.2;letter-spacing:-.045em;font-variant-numeric:tabular-nums}
.site-study .site-chart .sc-stat small{margin-top:3px}
.site-study .site-chart .sc-chart-area{display:grid;grid-template-columns:38px minmax(0,1fr);gap:var(--space-2,8px)}
.site-study .site-chart .sc-y-axis{display:flex;flex-direction:column;justify-content:space-between;height:220px;color:var(--muted);font-size:10px;font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap}
.site-study .site-chart .sc-chart-graph{min-width:0}
.site-study .site-chart .sc-plot{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));align-items:end;gap:var(--space-3,12px);height:220px;border-bottom:1px solid var(--line);background:repeating-linear-gradient(to top,transparent 0,transparent calc(25% - 1px),#edf0f5 calc(25% - 1px),#edf0f5 25%)}
.site-study .site-chart .sc-bar{display:flex;align-items:end;justify-content:center;height:100%;min-width:0;padding:0 4px;border:0;background:transparent}
.site-study .site-chart .sc-bar span{display:block;width:100%;max-width:40px;height:var(--bar-height);border-radius:3px 3px 0 0;background:color-mix(in srgb,var(--accent) 80%,white)}
.site-study .site-chart .sc-bar:hover span,.site-study .site-chart .sc-bar[aria-pressed=true] span{background:var(--accent)}
.site-study .site-chart .sc-axis{display:grid;grid-template-columns:repeat(7,1fr);gap:var(--space-3,12px);margin-top:var(--space-2,8px);color:var(--muted);font-size:10px;text-align:center}
.site-study .site-chart .sc-foot{display:flex;justify-content:space-between;gap:var(--space-2,8px);margin-top:var(--space-6,24px);padding-top:var(--space-3,12px);border-top:1px solid var(--line);color:var(--muted);font-size:10px}
.site-study .site-chart .sc-context{display:flex;flex-direction:column;min-width:0;padding:var(--space-8,32px) var(--space-4,16px);border-left:1px solid var(--line);background:#fafbfd}
.site-study .site-chart .sc-context h4{margin-bottom:var(--space-8,32px);font-size:14px}
.site-study .site-chart .sc-context-metric,.site-study .site-chart .sc-context-detail{padding-bottom:var(--space-6,24px);margin-bottom:var(--space-6,24px);border-bottom:1px solid var(--line)}
.site-study .site-chart .sc-context-metric span,.site-study .site-chart .sc-context-detail span{display:block;margin-bottom:var(--space-2,8px);color:var(--muted);font-size:11px}
.site-study .site-chart .sc-context-metric strong{display:block;font-size:22px;line-height:1.2;font-variant-numeric:tabular-nums}
.site-study .site-chart .sc-tooltip{font-size:12px;font-weight:650;line-height:1.55;word-break:keep-all}
/* Project files and confirmation */
.site-study .site-delete{background:var(--concept-paper,#f3f5f9)}
.site-study .site-delete .sc-count{padding:6px 9px;border-radius:var(--control-radius,6px);background:#e8eef8;color:var(--ink);font-size:11px}
.site-study .site-delete .sc-files{border-top:1px solid var(--line)}
.site-study .site-delete .sc-files article{display:grid;grid-template-columns:32px minmax(0,1fr) auto;align-items:center;gap:var(--space-3,12px);padding:var(--space-4,16px) var(--space-2,8px);border-bottom:1px solid var(--line)}
.site-study .site-delete .sc-files article:before{content:"";width:28px;height:34px;border:1.5px solid #7b8ba0;border-radius:2px;background:linear-gradient(to bottom,transparent 58%,#c5cfdb 59% 62%,transparent 63% 72%,#c5cfdb 73% 76%,transparent 77%),var(--surface,#fff)}
.site-study .site-delete .sc-files strong,.site-study .site-delete .sc-files small{display:block}
.site-study .site-delete .sc-files strong{font-size:13px;overflow-wrap:anywhere}
.site-study .site-delete .sc-files small{margin-top:var(--space-1,4px);color:var(--muted);font-size:11px}
.site-study .site-delete .sc-files .btn{border-color:#e6c6cb;color:var(--error,#a83143)}
.site-study .site-delete .sc-files .btn:hover:not(:disabled){background:#fbf1f2;border-color:var(--error,#a83143);color:var(--error,#a83143)}
.site-study .site-delete .sc-undo{display:flex;align-items:center;justify-content:space-between;gap:var(--space-2,8px);margin-top:var(--space-4,16px);padding:var(--space-3,12px);border-left:3px solid var(--success,#28785d);background:#e8f3ec;color:#205b49;font-size:12px}
.site-study .site-delete .sc-confirm{width:min(440px,calc(100vw - 30px));max-width:none;padding:var(--space-8,32px);border-radius:var(--control-radius,6px);background:var(--surface,#fff)}
.site-study .site-delete .sc-confirm-head{display:flex;align-items:center;justify-content:space-between}
.site-study .site-delete .sc-confirm h3{margin:var(--space-4,16px) 0 var(--space-2,8px);font-size:25px}
.site-study .site-delete .sc-confirm p{color:var(--muted);font-size:13px;line-height:1.65}
.site-study .site-delete .sc-confirm p strong{color:var(--ink);overflow-wrap:anywhere}
.site-study .site-delete .sc-confirm label{display:grid;gap:var(--space-2,8px);margin:var(--space-6,24px) 0 var(--space-4,16px);font-size:12px;font-weight:700}
.site-study .site-delete .sc-confirm-actions{display:flex;justify-content:flex-end;gap:var(--space-2,8px)}
.site-study .site-delete .sc-danger{background:var(--error,#a83143);border-color:var(--error,#a83143);color:#fff}
.site-study .site-delete .sc-danger:hover:not(:disabled){filter:brightness(.9);color:#fff}
@container (max-width:699px){.site-study .site-chart .sc-dashboard{grid-template-columns:1fr}.site-study .site-chart .sc-context{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4,16px);padding:var(--space-4,16px);border-left:0;border-top:1px solid var(--line)}.site-study .site-chart .sc-context h4{grid-column:1/-1;margin:0}.site-study .site-chart .sc-context-metric,.site-study .site-chart .sc-context-detail{margin:0;padding:0;border:0}}
@container (max-width:520px){
.site-study .site-content{padding:var(--space-4,16px)}
.site-study .site-faq .sc-answer{padding-right:0}
.site-study .site-orders .sc-filterbar{grid-template-columns:1fr 1fr}
.site-study .site-orders .sc-search{grid-column:1/-1}
.site-study .site-orders .sc-order-summary{flex-wrap:wrap}
.site-study .site-orders .sc-table-wrap{overflow-x:hidden}
.site-study .site-orders table,.site-study .site-orders thead,.site-study .site-orders tbody{display:block;min-width:0;width:100%}
.site-study .site-orders thead tr{display:block}
.site-study .site-orders thead th:not(:first-child){position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}
.site-study .site-orders thead th:first-child{display:flex;align-items:center;width:100%;height:44px;padding:0 8px}
.site-study .site-orders thead th:first-child:after{content:"보이는 주문 모두 선택";font-size:11px;letter-spacing:0}
.site-study .site-orders tbody tr{display:grid;grid-template-columns:44px minmax(0,1fr) auto;grid-template-rows:auto auto;align-items:center;column-gap:8px;padding:8px;border-bottom:1px solid var(--line)}
.site-study .site-orders tbody tr:last-child{border-bottom:0}
.site-study .site-orders td{display:block;padding:2px 0;border:0;white-space:normal}
.site-study .site-orders td:first-child{grid-column:1;grid-row:1/3;width:44px;padding:0}
.site-study .site-orders td:nth-child(2){grid-column:2;grid-row:1}
.site-study .site-orders td:nth-child(3){grid-column:2;grid-row:2;color:var(--muted)}
.site-study .site-orders td:nth-child(4){grid-column:3;grid-row:1;text-align:right;white-space:nowrap}
.site-study .site-orders td:nth-child(5){grid-column:3;grid-row:2;text-align:right}
.site-study .site-booking .sc-weekdays,.site-study .site-booking .sc-dates{gap:0}.site-study .site-booking .sc-dates button{min-height:44px;border-color:transparent;background:transparent}.site-study .site-booking .sc-dates button[aria-pressed=true]{background:var(--accent);border-color:var(--accent)}
.site-study .site-cart .sc-products{gap:var(--space-3,12px)}
.site-study .site-cart .sc-product-info{display:block}
.site-study .site-cart .sc-products strong{font-size:14px}
.site-study .site-cart .sc-products b{display:block;margin-top:var(--space-2,8px);font-size:16px}
.site-study .site-cart .sc-drawer{padding:var(--space-4,16px)}
.site-study .site-chart{padding:0}
.site-study .site-chart .sc-chart-main{padding:var(--space-3,12px)}
.site-study .site-chart .sc-chart-area{margin-inline:calc(-1 * var(--space-3,12px));grid-template-columns:28px minmax(0,1fr);gap:var(--space-1,4px)}
.site-study .site-chart .sc-plot,.site-study .site-chart .sc-y-axis{height:185px}
.site-study .site-chart .sc-plot,.site-study .site-chart .sc-axis{gap:0}
.site-study .site-chart .sc-bar{padding:0}
.site-study .site-delete .sc-confirm{padding:var(--space-6,24px)}
}
@media (prefers-reduced-motion:reduce){.site-study .site-faq .sc-faq-plus{transition:none}}
`; }

export function contentWire(root, item, helpers) {
  const id = item && item.id;
  const cleanups = [];
  const on = (el, type, fn) => { if (!el) return; el.addEventListener(type, fn); cleanups.push(() => el.removeEventListener(type, fn)); };
  const q = s => root.querySelector(s);
  const qa = s => Array.from(root.querySelectorAll(s));
  const money = n => '₩' + Number(n).toLocaleString('ko-KR');
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dialogMotion = (dialog, offset) => {
    let current = null, closing = false, revision = 0;
    const stop = () => { revision++; current?.cancel(); current = null; closing = false; };
    const open = () => {
      const computed = dialog.open ? getComputedStyle(dialog) : null;
      const from = computed ? {opacity:computed.opacity,transform:computed.transform} : {opacity:0,transform:offset};
      stop();
      if (!dialog.open) dialog.showModal();
      current = helpers.animate(dialog, [from,{opacity:1,transform:'translate(0, 0) scale(1)'}], 240);
    };
    const close = () => {
      if (!dialog.open || closing) return;
      const computed = getComputedStyle(dialog);
      const from = {opacity:computed.opacity,transform:computed.transform};
      stop(); closing = true;
      const closeRevision = revision;
      current = helpers.animate(dialog, [from,{opacity:0,transform:offset}], 140);
      if (current) current.finished.then(() => { if (closeRevision===revision && dialog.open) dialog.close(); }, () => {});
      else dialog.close();
    };
    on(dialog, 'cancel', e => { e.preventDefault(); close(); });
    on(dialog, 'close', () => { if (!dialog.open) stop(); });
    return {open,close};
  };
  let state = {};
  let render = () => {};
  let initial = {};
  if (id === 'light-project--chart') {
    const series = {week:[{label:'월',value:420000,orders:7},{label:'화',value:610000,orders:9},{label:'수',value:530000,orders:8},{label:'목',value:840000,orders:12},{label:'금',value:720000,orders:10},{label:'토',value:960000,orders:14},{label:'일',value:580000,orders:8}],month:[{label:'1주',value:2680000,orders:38},{label:'2주',value:3190000,orders:45},{label:'3주',value:2850000,orders:41},{label:'4주',value:3660000,orders:52}]};
    initial = {period:'week',selected:null};
    render = () => {const rows=series[state.period],total=rows.reduce((n,r)=>n+r.value,0),orders=rows.reduce((n,r)=>n+r.orders,0),max=Math.max(...rows.map(r=>r.value)),maxIndex=rows.findIndex(r=>r.value===max),axisMax=state.period==='week'?1000000:4000000;q('[data-total]').textContent=money(total);q('[data-comparison]').textContent=state.period==='week'?'2026년 10월 12일–18일 · 최근 7일':'2026년 9월 21일–10월 18일 · 최근 4주';q('[data-orders]').textContent=orders+'건';q('[data-ymax]').textContent=state.period==='week'?'100만':'400만';q('[data-ymid]').textContent=state.period==='week'?'50만':'200만';q('[data-bars]').style.gridTemplateColumns=`repeat(${rows.length},minmax(0,1fr))`;q('[data-labels]').style.gridTemplateColumns=`repeat(${rows.length},minmax(0,1fr))`;q('[data-bars]').innerHTML=rows.map((r,i)=>`<button type="button" class="sc-bar" data-bar="${i}" aria-label="${r.label} ${money(r.value)}, ${r.orders}건" aria-pressed="${state.selected===i}"><span style="--bar-height:${Math.max(4,r.value/axisMax*100)}%"></span></button>`).join('');q('[data-labels]').innerHTML=rows.map(r=>`<span>${r.label}</span>`).join('');qa('[data-period]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.period===state.period)));const r=rows[state.selected];q('[data-tooltip]').textContent=r?`${r.label} · ${money(r.value)} · 주문 ${r.orders}건`:`최고 매출 ${rows[maxIndex].label} · ${money(rows[maxIndex].value)}`;};
    on(q('[data-bars]'),'click',e=>{const b=e.target.closest('[data-bar]');if(!b)return;state.selected=Number(b.dataset.bar);render();q(`[data-bar="${state.selected}"]`).focus();});
    const tooltip=index=>{state.selected=index;const row=series[state.period][index];qa('[data-bar]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.bar)===index)));q('[data-tooltip]').textContent=row?`${row.label} · ${money(row.value)} · 주문 ${row.orders}건`:`최고 매출 ${series[state.period].reduce((a,b)=>a.value>b.value?a:b).label} · ${money(Math.max(...series[state.period].map(r=>r.value)))}`;};
    for(const event of ['focusin','pointerover'])on(q('[data-bars]'),event,e=>{const b=e.target.closest('[data-bar]');if(b)tooltip(Number(b.dataset.bar));});
    on(q('[data-bars]'),'keydown',e=>{if(e.key==='Escape'){e.preventDefault();tooltip(null);}});
    on(q('[data-bars]'),'keydown',e=>{const b=e.target.closest('[data-bar]');if(!b||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const length=series[state.period].length;state.selected=e.key==='Home'?0:e.key==='End'?length-1:(Number(b.dataset.bar)+(e.key==='ArrowRight'?1:-1)+length)%length;render();q(`[data-bar="${state.selected}"]`).focus();});
    qa('[data-period]').forEach(b=>on(b,'click',()=>{if(state.period===b.dataset.period)return;const before=qa('[data-bar] span').map(bar=>bar.getBoundingClientRect().height);state.period=b.dataset.period;state.selected=null;render();const bars=qa('[data-bar] span');bars.forEach((bar,i)=>{const from=before[Math.min(before.length-1,Math.floor(i*before.length/bars.length))];const to=bar.getBoundingClientRect().height;if(Number.isFinite(from)&&to>0&&from!==to){bar.style.transformOrigin='bottom';helpers.animate(bar,[{transform:`scaleY(${from/to})`},{transform:'scaleY(1)'}],300);}});}));
  } else if (id === 'light-project--tasks') {
    initial={open:[]};
    const details=qa('details');
    render=()=>details.forEach((d,i)=>{d.open=state.open.includes(i);});
    const faqMotion=new WeakMap();
    details.forEach((d,i)=>on(d,'toggle',()=>{state.open=details.flatMap((item,index)=>item.open?[index]:[]);faqMotion.get(d)?.cancel();if(d.open){const answer=d.querySelector('.sc-answer');faqMotion.set(d,helpers.animate(answer,[{opacity:0,transform:'translateY(-7px)'},{opacity:1,transform:'translateY(0)'}],220));}}));
  } else if (id === 'light-project--filters') {
    const rows=[{id:'ORD-1048',name:'김서연',amount:128000,status:'paid',date:6},{id:'ORD-1047',name:'이도윤',amount:54000,status:'ready',date:5},{id:'ORD-1046',name:'박지민',amount:239000,status:'sent',date:4},{id:'ORD-1045',name:'최하린',amount:87000,status:'paid',date:3},{id:'ORD-1044',name:'정민준',amount:167000,status:'ready',date:2},{id:'ORD-1043',name:'강수빈',amount:42000,status:'sent',date:1}];
    const statusLabel={paid:'결제 완료',ready:'배송 준비',sent:'배송 완료'};
    initial={search:'',status:'all',sort:'recent',selected:[],rows:rows.map(r=>({...r})),feedback:''};
    const visible=()=>{let list=state.rows.filter(r=>(state.status==='all'||r.status===state.status)&&(`${r.id} ${r.name}`).toLocaleLowerCase('ko').includes(state.search.toLocaleLowerCase('ko')));return list.sort((a,b)=>state.sort==='amount'?b.amount-a.amount:state.sort==='name'?a.name.localeCompare(b.name,'ko'):b.date-a.date);};
    render=()=>{q('[data-search]').value=state.search;q('[data-status]').value=state.status;q('[data-sort]').value=state.sort;const list=visible();q('[data-total-count]').textContent=state.rows.length+'건';q('[data-visible-count]').textContent=`${list.length}건 표시`;q('[data-status-count]').textContent=`결제 ${state.rows.filter(r=>r.status==='paid').length} · 준비 ${state.rows.filter(r=>r.status==='ready').length} · 완료 ${state.rows.filter(r=>r.status==='sent').length}`;q('[data-rows]').innerHTML=list.map(r=>`<tr><td><label class="sc-check-hit"><input type="checkbox" data-select="${r.id}" aria-label="${r.id} 선택" ${state.selected.includes(r.id)?'checked':''}></label></td><td><strong>${r.id}</strong></td><td>${escape(r.name)}</td><td>${money(r.amount)}</td><td><span class="sc-status" data-state="${r.status}">${statusLabel[r.status]}</span></td></tr>`).join('');q('[data-empty]').hidden=list.length!==0;const all=q('[data-select-all]');all.checked=!!list.length&&list.every(r=>state.selected.includes(r.id));all.indeterminate=list.some(r=>state.selected.includes(r.id))&&!all.checked;q('[data-selection]').textContent=state.selected.length?`${state.selected.length}건 선택됨`:'선택한 주문 없음';q('[data-bulk]').disabled=!state.selected.length;q('[data-feedback]').textContent=state.feedback;};
    on(q('[data-search]'),'input',e=>{state.search=e.target.value;render();q('[data-search]').focus();});on(q('[data-status]'),'change',e=>{state.status=e.target.value;render();});on(q('[data-sort]'),'change',e=>{state.sort=e.target.value;render();});on(q('[data-rows]'),'change',e=>{if(!e.target.matches('[data-select]'))return;const id=e.target.dataset.select;state.selected=e.target.checked?[...state.selected,id]:state.selected.filter(x=>x!==id);render();q(`[data-select="${id}"]`)?.focus();});on(q('[data-select-all]'),'change',e=>{const ids=visible().map(r=>r.id);state.selected=e.target.checked?Array.from(new Set([...state.selected,...ids])):state.selected.filter(id=>!ids.includes(id));render();});on(q('[data-bulk]'),'click',()=>{const count=state.selected.length;state.rows.forEach(r=>{if(state.selected.includes(r.id))r.status='sent';});state.selected=[];state.feedback=`${count}건을 배송 완료로 변경했습니다.`;render();q('[data-select-all]').focus();});on(q('[data-clear]'),'click',()=>{state.search='';state.status='all';state.sort='recent';state.feedback='검색 조건을 초기화했습니다.';render();q('[data-search]').focus();});
  } else if (id === 'light-project--calendar') {
    const dates=Array.from({length:14},(_,i)=>19+i),times=['09:30','11:00','13:30','15:00'],disabled=[24,25,31,32];
    initial={date:null,time:null,confirmed:false};
    render=()=>{q('[data-dates]').innerHTML=dates.map(d=>`<button type="button" data-date="${d}" aria-label="${d===32?'11월 1일':`10월 ${d}일`}" aria-pressed="${state.date===d}" ${disabled.includes(d)?'disabled title="예약 불가"':''}>${d===32?1:d}</button>`).join('');q('[data-times]').innerHTML=times.map(t=>`<button type="button" data-time="${t}" aria-pressed="${state.time===t}" ${!state.date?'disabled':''}>${t}</button>`).join('');q('[data-summary]').textContent=state.date&&state.time?`10월 ${state.date}일 · ${state.time} · 30분`:state.date?`10월 ${state.date}일 · 시간을 선택하세요`:'날짜와 시간을 선택하세요';q('[data-book]').disabled=!(state.date&&state.time)||state.confirmed;q('[data-book]').textContent=state.confirmed?'예약 완료':'예약 확정';q('[data-feedback]').textContent=state.confirmed?`10월 ${state.date}일 ${state.time} 상담 예약이 완료되었습니다.`:'';};
    on(q('[data-dates]'),'click',e=>{const b=e.target.closest('[data-date]');if(!b||b.disabled)return;state.date=Number(b.dataset.date);state.time=null;state.confirmed=false;render();q(`[data-date="${state.date}"]`).focus();});on(q('[data-times]'),'click',e=>{const b=e.target.closest('[data-time]');if(!b||b.disabled)return;state.time=b.dataset.time;state.confirmed=false;render();q(`[data-time="${state.time}"]`).focus();});on(q('[data-book]'),'click',()=>{state.confirmed=true;render();helpers.animate(q('[data-feedback]'),[{opacity:.5},{opacity:1}],{duration:180,easing:'cubic-bezier(.2,.8,.2,1)'});});
  } else if (id === 'dark-ai--dialog') {
    const products={note:{name:'아카이브 노트',price:18000},tray:{name:'데스크 트레이',price:32000}};
    const dialog=q('dialog'),motion=dialogMotion(dialog,'translateX(24px)');let opener=null;
    initial={cart:{note:1,tray:2},message:'',checkedOut:false};
    render=()=>{const count=Object.values(state.cart).reduce((a,b)=>a+b,0),total=Object.entries(state.cart).reduce((sum,[key,qty])=>sum+products[key].price*qty,0);q('[data-cart-count]').textContent=count;q('[data-dialog-count]').textContent=`(${count})`;q('[data-lines]').innerHTML=count?Object.entries(state.cart).filter(([,qty])=>qty>0).map(([key,qty])=>`<div class="sc-cart-line" data-product="${key}"><img src="${q(`[data-product-image="${key}"]`).src}" alt="" width="72" height="72"><div><strong>${products[key].name}</strong><small>${money(products[key].price)} / 개</small></div><strong>${money(products[key].price*qty)}</strong><div class="sc-quantity"><button type="button" data-minus="${key}" aria-label="${products[key].name} 수량 줄이기">−</button><span>${qty}</span><button type="button" data-plus="${key}" aria-label="${products[key].name} 수량 늘리기">+</button><button type="button" class="sc-remove" data-remove="${key}">삭제</button></div></div>`).join(''):'<p class="sc-empty-cart">장바구니가 비었습니다.</p>';q('[data-subtotal]').textContent=money(total);q('[data-checkout]').disabled=!count||state.checkedOut;q('[data-checkout]').textContent='주문 완료';q('[data-restore]').hidden=!!count;q('[data-cart-message]').textContent=state.message;q('[data-add-message]').textContent=state.message.endsWith('상품을 담았습니다.')?state.message:'';};
    on(q('[data-open]'),'click',e=>{opener=e.currentTarget;q('[data-add-message]').textContent='';motion.open();q('[data-close]').focus();});on(q('[data-close]'),'click',motion.close);on(dialog,'close',()=>{if(!dialog.open&&opener?.isConnected)opener.focus();});on(dialog,'click',e=>{const button=e.target.closest('button');if(!button)return;const key=button.dataset.plus||button.dataset.minus||button.dataset.remove;if(!key)return;const selector=button.dataset.plus?`[data-plus="${key}"]`:button.dataset.minus?`[data-minus="${key}"]`:`[data-remove="${key}"]`;if(button.dataset.plus)state.cart[key]=(state.cart[key]||0)+1;if(button.dataset.minus)state.cart[key]=Math.max(0,(state.cart[key]||0)-1);if(button.dataset.remove)state.cart[key]=0;state.message='';state.checkedOut=false;render();(q(selector)||q('[data-lines] button')||q('[data-restore]')||q('[data-close]')).focus();});qa('[data-add]').forEach(b=>on(b,'click',()=>{const key=b.dataset.add;state.cart[key]=(state.cart[key]||0)+1;state.message=`${products[key].name} 상품을 담았습니다.`;state.checkedOut=false;render();const badge=q('[data-cart-count]');helpers.animate(badge,[{opacity:.6,transform:'scale(.82)'},{opacity:1,transform:'scale(1)'}],{duration:160,easing:'cubic-bezier(.2,.8,.2,1)'});}));on(q('[data-checkout]'),'click',()=>{state.checkedOut=true;state.message=`${money(Object.entries(state.cart).reduce((n,[key,qty])=>n+products[key].price*qty,0))} 주문이 완료되었습니다.`;state.cart={note:0,tray:0};render();q('[data-restore]').focus();});on(q('[data-restore]'),'click',()=>{state.cart={note:1,tray:2};state.checkedOut=false;state.message='상품을 다시 담았습니다.';render();q('[data-lines] button')?.focus();});
  } else if (id === 'light-project--dialog') {
    const files=[{id:'brief',name:'프로젝트 제안서.pdf',meta:'PDF · 2.4 MB · 10월 17일'},{id:'budget',name:'2026 예산안.xlsx',meta:'XLSX · 84 KB · 10월 16일'},{id:'notes',name:'회의 기록.docx',meta:'DOCX · 41 KB · 10월 14일'}];
    const dialog=q('dialog'),motion=dialogMotion(dialog,'translateY(12px) scale(.98)');let openerId=null;
    initial={files:files.map(f=>({...f})),pending:null,deleted:null};
    render=()=>{q('[data-file-count]').textContent=state.files.length+'개 파일';q('[data-files]').innerHTML=state.files.length?state.files.map(f=>`<article><div><strong>${escape(f.name)}</strong><small>${escape(f.meta)}</small></div><button type="button" class="btn" data-delete="${f.id}" aria-label="${escape(f.name)} 삭제">삭제</button></article>`).join(''):'<p class="sc-empty">파일이 없습니다.</p>';q('[data-undo-wrap]').hidden=!state.deleted;q('[data-result]').textContent=state.deleted?`${state.deleted.name} 삭제됨`:'';q('[data-target-name]').textContent=state.pending?state.pending.name:'';q('[data-confirm]').disabled=!state.pending||q('[data-confirm-input]').value!==state.pending.name;};
    on(q('[data-files]'),'click',e=>{const b=e.target.closest('[data-delete]');if(!b)return;state.pending=state.files.find(f=>f.id===b.dataset.delete);openerId=b.dataset.delete;q('[data-confirm-input]').value='';render();motion.open();q('[data-confirm-input]').focus();});on(q('[data-confirm-input]'),'input',()=>{q('[data-confirm]').disabled=!state.pending||q('[data-confirm-input]').value!==state.pending.name;});qa('[data-cancel]').forEach(b=>on(b,'click',motion.close));on(dialog,'close',()=>{if(dialog.open)return;state.pending=null;q('[data-confirm-input]').value='';(q(`[data-delete="${openerId}"]`)||q('[data-undo-wrap]:not([hidden]) [data-undo]')||q('[data-files] [data-delete]'))?.focus();});on(q('[data-confirm]'),'click',()=>{if(!state.pending||q('[data-confirm-input]').value!==state.pending.name)return;const index=state.files.findIndex(f=>f.id===state.pending.id);state.deleted={...state.pending,index};state.files.splice(index,1);render();motion.close();});on(q('[data-undo]'),'click',()=>{if(!state.deleted)return;const id=state.deleted.id;state.files.splice(state.deleted.index,0,{id:state.deleted.id,name:state.deleted.name,meta:state.deleted.meta});state.deleted=null;render();q(`[data-delete="${id}"]`)?.focus();});
  }
  const copy = value => JSON.parse(JSON.stringify(value));
  state=copy(initial);render();
  return {reset(){state=copy(initial);const d=q('dialog');if(d?.open)d.close();render();},replay(){state=copy(initial);const d=q('dialog');if(d?.open)d.close();render();},snapshot(){return copy(state);},restore(next){if(next&&typeof next==='object'){state=copy(next);const d=q('dialog');if(d?.open)d.close();render();}},destroy(){cleanups.forEach(fn=>fn());const d=q('dialog');if(d?.open)d.close();}};
}
