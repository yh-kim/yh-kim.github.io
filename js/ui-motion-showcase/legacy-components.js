// Focused legacy demos. Each markup/controller serializes without sibling components.
function markupUpload(item) {
  const icon=name=>{const paths={upload:'<path d="M12 16V4m-4 4 4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',empty:'<path d="M4 12h4l2-4 4 8 2-4h4"/>'};return `<svg class="si-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||''}</svg>`;};
  return `<section class="site-study study-process si-upload">
      <div class="si-workspace"><div class="si-utility-heading"><span class="si-overline">자료실</span><strong>파일 업로드</strong></div><label class="si-drop" data-drop><span class="si-upload-glyph" aria-hidden="true">${icon('upload')}</span><strong>파일을 이곳에 놓으세요</strong><span>또는 눌러 파일 선택 · PNG, JPG, PDF · 최대 5MB</span><input type="file" accept="image/png,image/jpeg,application/pdf" data-file aria-label="업로드할 파일 선택"></label>
      <div class="si-upload-inline"><button type="button" class="si-link" data-action="sample">샘플 파일 사용</button></div>
      <div class="si-queue-wrap"><div class="si-queue-title"><strong>업로드 목록</strong></div><div class="si-queue" data-queue aria-live="polite"><span class="si-empty-icon" aria-hidden="true">${icon('empty')}</span><strong>대기 중인 파일이 없습니다</strong><small>파일을 고르면 검증 후 업로드가 시작됩니다.</small></div></div>
      <p class="si-message" data-message role="status">업로드 파일은 서버에 전송되지 않습니다.</p></div></section>`;
}
function markupMenu(item) {
  const icon=name=>{const paths={menu:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',duplicate:'<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',edit:'<path d="m4 16 11-11 4 4-11 11-5 1 1-5Zm9-9 4 4"/>',archive:'<rect x="4" y="4" width="16" height="4" rx="1"/><path d="M6 8v11a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8m-9 4h6"/>'};return `<svg class="si-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||''}</svg>`;};
  return `<section class="site-study study-layers si-menu">
      <div class="si-workspace"><div class="si-project-head"><span class="si-project-mark" aria-hidden="true">N</span><div><span class="si-overline">웹사이트 프로젝트</span><strong data-title>노바 웹사이트</strong><small data-subtitle>최근 수정 · 오늘</small></div><button class="si-menu-trigger" type="button" data-menu-trigger aria-haspopup="menu" aria-expanded="false" aria-label="프로젝트 메뉴 열기">${icon('menu')}</button></div>
      <div class="si-action-menu" data-menu role="menu" aria-label="프로젝트 작업" hidden><button role="menuitem" type="button" data-menu-action="duplicate">${icon('duplicate')}<span><strong>복제하기</strong></span></button><button role="menuitem" type="button" data-menu-action="rename">${icon('edit')}<span><strong>이름 바꾸기</strong></span></button><button role="menuitem" type="button" data-menu-action="archive">${icon('archive')}<span><strong>보관하기</strong></span></button></div>
      <div class="si-menu-result"><div class="si-result-head"><span>프로젝트 상태</span><b data-count>1개</b></div><div data-project-list></div></div><p class="si-message" data-message role="status">메뉴를 열어 프로젝트를 관리해 보세요.</p></div></section>`;
}
function markupTags(item) {
  return `<section class="site-study study-quick-add si-tags">
      <div class="si-workspace"><div class="si-tag-heading"><div><h4>이 글의 키워드</h4></div><span data-count>2 / 6</span></div><div class="si-chip-editor" data-chip-editor><div class="si-chips" data-chips></div><input data-tag-input type="text" maxlength="24" aria-label="새 태그 입력" placeholder="태그 입력 후 Enter" autocomplete="off"></div><p class="si-tag-hint">Enter 또는 쉼표로 추가 · 비어 있을 때 Backspace로 마지막 태그 삭제</p><div class="si-suggestions"><span>추천 태그</span><div><button type="button" data-suggest="접근성">+ 접근성</button><button type="button" data-suggest="컴포넌트">+ 컴포넌트</button><button type="button" data-suggest="반응형">+ 반응형</button></div></div><div class="si-tag-preview"><span>글 미리보기</span><strong>새로운 인터페이스를 만드는 방법</strong><div data-preview></div></div><p class="si-message" data-message role="status">최대 6개까지 추가할 수 있습니다.</p></div></section>`;
}
function markupChart(item) {
  return `<div class="site-study study-chart">`+`<section class="site-content site-chart" aria-label="매출 분석">
    <div class="sc-dashboard"><div class="sc-chart-main"><header class="sc-head"><h3>매출 현황</h3><div class="sc-segment" role="group" aria-label="조회 기간"><button type="button" data-period="week" aria-pressed="true">최근 7일</button><button type="button" data-period="month" aria-pressed="false">최근 4주</button></div></header>
    <div class="sc-stat"><div><span>선택 기간 매출</span><strong data-total>₩0</strong><small data-comparison></small></div></div>
    <div class="sc-chart-area"><div class="sc-y-axis" aria-hidden="true"><span data-ymax></span><span data-ymid></span><span>0</span></div><div class="sc-chart-graph"><div class="sc-plot" role="group" aria-label="매출 막대 차트" data-bars></div><div class="sc-axis" data-labels></div></div></div>
    <div class="sc-foot"><span>결제 완료 주문 기준</span><span>KRW · 매출액</span></div></div>
    <aside class="sc-context" aria-label="매출 요약"><h4>기간 요약</h4><div class="sc-context-metric"><span>주문 건수</span><strong data-orders></strong></div><div class="sc-context-detail"><span>선택한 구간</span><p class="sc-tooltip" data-tooltip role="status"></p></div></aside></div></section>`+`</div>`;
}
function markupAccordion(item) {
  return `<div class="site-study study-tasks">`+`<section class="site-content site-faq" aria-label="구독 서비스 자주 묻는 질문">
    <header class="sc-head"><div><span class="sc-kicker">고객 지원</span><h3>구독 안내</h3></div></header>
    <div class="sc-faq-list">
      <details><summary><span class="sc-faq-question">무료 체험이 끝나면 자동으로 결제되나요?</span><span class="sc-faq-plus" aria-hidden="true">+</span></summary><div class="sc-answer"><p>체험 시작 시 등록한 결제 수단으로 다음 날 첫 요금이 청구됩니다. 체험 종료 하루 전 이메일로 안내하며, 그 전에 해지하면 요금이 청구되지 않습니다.</p></div></details>
      <details><summary><span class="sc-faq-question">구독 요금제는 언제든 바꿀 수 있나요?</span><span class="sc-faq-plus" aria-hidden="true">+</span></summary><div class="sc-answer"><p>계정 설정의 요금제 관리에서 언제든 변경할 수 있습니다. 상위 요금제는 바로 적용되고, 하위 요금제는 다음 결제일부터 적용됩니다.</p></div></details>
      <details><summary><span class="sc-faq-question">결제 영수증은 어디에서 확인하나요?</span><span class="sc-faq-plus" aria-hidden="true">+</span></summary><div class="sc-answer"><p>계정 설정 → 결제 내역에서 월별 영수증을 열거나 내려받을 수 있습니다. 결제 완료 시 등록한 이메일로도 전송됩니다.</p></div></details>
      <details><summary><span class="sc-faq-question">구독을 해지하면 자료는 어떻게 되나요?</span><span class="sc-faq-plus" aria-hidden="true">+</span></summary><div class="sc-answer"><p>현재 결제 기간이 끝날 때까지 서비스를 이용할 수 있습니다. 작성한 자료는 해지 후 30일 동안 보관되어 내보낼 수 있습니다.</p></div></details>
    </div></section>`+`</div>`;
}
function markupTable(item) {
  return `<div class="site-study study-filters">`+`<section class="site-content site-orders" aria-label="주문 관리">
    <header class="sc-head"><div><span class="sc-kicker">판매자 센터</span><h3>주문 관리</h3></div><strong class="sc-count" data-total-count></strong></header>
    <div class="sc-filterbar"><label class="sc-search"><span class="sr-only">주문 검색</span><input class="field" type="search" data-search placeholder="고객명 또는 주문번호 검색"></label><label><span class="sr-only">상태 필터</span><select class="field" data-status><option value="all">모든 상태</option><option value="paid">결제 완료</option><option value="ready">배송 준비</option><option value="sent">배송 완료</option></select></label><label><span class="sr-only">정렬 순서</span><select class="field" data-sort><option value="recent">최신순</option><option value="amount">금액 높은순</option><option value="name">고객명순</option></select></label></div>
    <div class="sc-order-summary"><span data-visible-count></span><span data-status-count></span></div>
    <div class="sc-table-wrap"><table><thead><tr><th><label class="sc-check-hit"><input type="checkbox" data-select-all aria-label="보이는 주문 모두 선택"></label></th><th>주문</th><th>고객</th><th>금액</th><th>상태</th></tr></thead><tbody data-rows></tbody></table><p class="sc-empty" data-empty hidden>검색 결과가 없습니다. <button type="button" class="btn" data-clear>조건 초기화</button></p></div>
    <div class="sc-bulk"><span data-selection>선택한 주문 없음</span><button type="button" class="btn primary" data-bulk disabled>선택 주문 배송 완료</button></div><p class="sc-feedback" data-feedback role="status"></p></section>`+`</div>`;
}
function markupCalendar(item) {
  return `<div class="site-study study-calendar">`+`<section class="site-content site-booking" aria-label="상담 예약">
    <header class="sc-head"><div><span class="sc-kicker">30분 상담</span><h3>방문 상담 예약</h3></div></header>
    <div class="sc-month"><strong>2026년 10월</strong><span>10월 19일 — 11월 1일</span></div><div class="sc-weekdays"><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span><span>일</span></div><div class="sc-dates" data-dates role="group" aria-label="상담 날짜"></div>
    <div class="sc-time-head"><strong>상담 시간</strong><span>한국 시간 (KST)</span></div><div class="sc-times" data-times role="group" aria-label="상담 시간"></div>
    <div class="sc-book-summary"><span>선택한 일정</span><strong data-summary>날짜와 시간을 선택하세요</strong></div><button type="button" class="btn primary sc-book" data-book disabled>예약 확정</button><p class="sc-feedback" data-feedback role="status"></p></section>`+`</div>`;
}
function markupDialog(item) {
  return `<div class="site-study study-dialog">`+`<section class="site-content site-delete" aria-label="프로젝트 파일 관리">
    <header class="sc-head"><div><span class="sc-kicker">프로젝트 파일</span><h3>공유 자료</h3></div><strong class="sc-count" data-file-count></strong></header>
    <div class="sc-files" data-files></div><div class="sc-undo" data-undo-wrap hidden><span data-result role="status"></span><button type="button" class="btn" data-undo>실행 취소</button></div>
    <dialog class="sc-confirm" aria-labelledby="sc-confirm-title"><div class="sc-confirm-head"><span class="sc-kicker">파일 삭제</span><button type="button" class="btn" data-cancel aria-label="닫기">닫기</button></div><h3 id="sc-confirm-title">이 파일을 삭제할까요?</h3><p><strong data-target-name></strong> 파일이 목록에서 삭제됩니다. 파일 이름을 입력하면 삭제 버튼이 활성화됩니다.</p><label>파일 이름 입력<input class="field" type="text" data-confirm-input autocomplete="off"></label><div class="sc-confirm-actions"><button type="button" class="btn" data-cancel>취소</button><button type="button" class="btn sc-danger" data-confirm disabled>파일 삭제</button></div></dialog></section>`+`</div>`;
}
function wireUpload(root,item,helpers={}) {
  const $ = selector => root.querySelector(selector);
  const $$ = selector => [...root.querySelectorAll(selector)];
  const cleanups=[];
  const listen=(node,type,fn,opts)=>{if(!node)return;node.addEventListener(type,fn,opts);cleanups.push(()=>node.removeEventListener(type,fn,opts));};
  const message=(value,tone='')=>{const el=$('[data-message]');if(el){el.textContent=value;el.dataset.tone=tone;if(tone)animate(el,[{opacity:.5},{opacity:1}],180);}if(helpers.say)helpers.say(value);};
  const animate=(el,frames,duration=230)=>{if(!el||helpers.reduced?.()||matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(helpers.animate)return helpers.animate(el,frames,duration);return el.animate(frames,{duration,easing:'cubic-bezier(.2,.75,.2,1)'});};
  const wireIcon=()=>'<svg class="si-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h4l2-4 4 8 2-4h4"/></svg>';
  let state={},timer=0,serial=0,suspended=false;
  const stop=()=>{clearInterval(timer);clearTimeout(timer);timer=0;serial++;};
  let reset=()=>{},render=()=>{},replay=()=>{},resumeRestored=()=>{},announceRestored=()=>{};
    const empty={name:'',size:0,type:'',status:'idle',progress:0,sample:false}; state={...empty};
    const queue=$('[data-queue]');
    render=()=>{
      const s=state;
      const hadFocus=queue.contains(root.getRootNode().activeElement);
      if(!s.name){
        queue.innerHTML=`<span class="si-empty-icon" aria-hidden="true">${wireIcon('empty')}</span><strong>대기 중인 파일이 없습니다</strong><small>파일을 고르면 검증 후 업로드가 시작됩니다.</small>`;
        delete queue.dataset.renderKey;
        if(hadFocus)$('[data-action=sample]').focus();
        return;
      }
      const key=`${s.name}|${s.status}|${s.type}|${s.sample}`;
      const label={uploading:'업로드 중',done:'완료',cancelled:'취소됨',error:'오류'}[s.status]||'준비';
      if(queue.dataset.renderKey!==key){
        const size=s.sample?'샘플 파일':`${(s.size/1048576).toFixed(1)} MB`;
        queue.innerHTML=`<div class="si-file-row"><span class="si-file-icon" aria-hidden="true">${s.type==='application/pdf'?'PDF':'IMG'}</span><div class="si-file-meta"><strong></strong><small>${size} · ${label} · 로컬 시뮬레이션</small></div><button type="button" data-queue-action="${s.status==='uploading'?'cancel':s.status==='done'?'clear':'retry'}">${s.status==='uploading'?'취소':s.status==='done'?'지우기':'다시 시도'}</button></div><div class="si-progress"><span></span></div><div class="si-progress-caption"><span>${label}</span><b></b></div>`;
        queue.querySelector('.si-file-meta strong').textContent=s.name;
        queue.dataset.renderKey=key;
        if(hadFocus)queue.querySelector('[data-queue-action]').focus();
      }
      queue.querySelector('.si-progress span').style.transform=`scaleX(${s.progress/100})`;
      queue.querySelector('.si-progress-caption b').textContent=`${s.progress}%`;
    };
    const run=(resume=false)=>{stop();state.status='uploading';if(!resume)state.progress=0;render();message(resume?'업로드 시뮬레이션을 이어서 진행 중…':'업로드 시뮬레이션 진행 중…');const runId=serial;timer=setInterval(()=>{if(runId!==serial||suspended||helpers.active?.()===false)return;state.progress=Math.min(100,state.progress+10);if(state.progress>=100){stop();state.status='done';message('업로드 완료 · 서버 전송 없이 체험했습니다.','success');}render();},130);};
    const load=(file,sample=false)=>{if(!file)return;stop();if(!['image/png','image/jpeg','application/pdf'].includes(file.type)){message('PNG, JPG 또는 PDF 파일만 선택할 수 있습니다.','error');return;}if(file.size>5*1048576){message('파일 크기는 5MB 이하여야 합니다.','error');return;}state={name:file.name,size:file.size,type:file.type,status:'idle',progress:0,sample};run();};
    listen($('[data-file]'),'change',e=>{load(e.target.files?.[0]);e.target.value='';});listen($('[data-action=sample]'),'click',()=>load({name:'brand-guidelines.pdf',size:2457600,type:'application/pdf'},true));listen(queue,'click',e=>{const action=e.target.closest('[data-queue-action]')?.dataset.queueAction;if(action==='cancel'){stop();state.status='cancelled';message('업로드를 취소했습니다.');render();}if(action==='retry')run();if(action==='clear')reset();});const drop=$('[data-drop]');listen(drop,'dragover',e=>{e.preventDefault();drop.dataset.over='true';});listen(drop,'dragleave',()=>{drop.dataset.over='false';});listen(drop,'drop',e=>{e.preventDefault();drop.dataset.over='false';load(e.dataTransfer?.files?.[0]);});
    reset=()=>{stop();state={...empty};render();message('업로드 파일은 서버에 전송되지 않습니다.');};replay=()=>{if(state.name)run();else load({name:'brand-guidelines.pdf',size:2457600,type:'application/pdf'},true);};
    resumeRestored=()=>{if(state.status==='uploading'){run(true);return true;}return false;};
    announceRestored=()=>{if(state.status==='done')message('업로드 완료 · 서버 전송 없이 체험했습니다.','success');else if(state.status==='cancelled')message('업로드를 취소했습니다.');else message('업로드 파일은 서버에 전송되지 않습니다.');};
  return {reset,replay,suspend(){suspended=true;},continue(){suspended=false;},snapshot(){return JSON.parse(JSON.stringify(state));},restore(saved){if(!saved)return;stop();state=JSON.parse(JSON.stringify(saved));render();if(!resumeRestored())announceRestored();},destroy(){stop();cleanups.forEach(fn=>fn());}};
}
function wireMenu(root,item,helpers={}) {
  const $ = selector => root.querySelector(selector);
  const $$ = selector => [...root.querySelectorAll(selector)];
  const cleanups=[];
  const listen=(node,type,fn,opts)=>{if(!node)return;node.addEventListener(type,fn,opts);cleanups.push(()=>node.removeEventListener(type,fn,opts));};
  const message=(value,tone='')=>{const el=$('[data-message]');if(el){el.textContent=value;el.dataset.tone=tone;if(tone)animate(el,[{opacity:.5},{opacity:1}],180);}if(helpers.say)helpers.say(value);};
  const animate=(el,frames,duration=230)=>{if(!el||helpers.reduced?.()||matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(helpers.animate)return helpers.animate(el,frames,duration);return el.animate(frames,{duration,easing:'cubic-bezier(.2,.75,.2,1)'});};
  let state={},timer=0,serial=0,suspended=false;
  const stop=()=>{clearInterval(timer);clearTimeout(timer);timer=0;serial++;};
  let reset=()=>{},render=()=>{},replay=()=>{},resumeRestored=()=>{},announceRestored=()=>{};
    state={open:false,projects:[{name:'노바 웹사이트',archived:false}],active:0};const trigger=$('[data-menu-trigger]'),menu=$('[data-menu]');
    const close=()=>{state.open=false;render();};
    render=()=>{trigger.setAttribute('aria-expanded',String(state.open));menu.hidden=!state.open;const current=state.projects[state.active];$('[data-title]').textContent=current.name;$('[data-subtitle]').textContent=current.archived?'보관함에 있음':'최근 수정 · 오늘';$('[data-count]').textContent=`${state.projects.length}개`;$('[data-project-list]').innerHTML='';state.projects.forEach((p,i)=>{const row=document.createElement('div');row.className='si-project-row';row.innerHTML=`<span class="si-project-dot"></span><strong></strong><small>${p.archived?'보관됨':'활성'}</small>`;row.querySelector('strong').textContent=p.name;if(i===state.active)row.dataset.active='true';$('[data-project-list]').append(row);});};
    listen(trigger,'click',()=>{state.open=!state.open;render();if(state.open){animate(menu,[{opacity:0,transform:'translateY(-7px)'},{opacity:1,transform:'translateY(0)'}],170);menu.querySelector('button')?.focus();}});listen(menu,'click',e=>{const action=e.target.closest('[data-menu-action]')?.dataset.menuAction;if(!action)return;const current=state.projects[state.active];if(action==='duplicate'){state.projects.push({name:`${current.name} 사본`,archived:false});state.active=state.projects.length-1;message('프로젝트 사본을 목록에 추가했습니다.','success');}if(action==='rename'){current.name=current.name.endsWith(' · 수정됨')?current.name.replace(' · 수정됨',''):current.name+' · 수정됨';message('프로젝트 이름을 변경했습니다.','success');}if(action==='archive'){current.archived=!current.archived;message(current.archived?'프로젝트를 보관함으로 옮겼습니다.':'프로젝트를 활성화했습니다.','success');}close();trigger.focus();});listen(menu,'keydown',e=>{const buttons=$$('[data-menu-action]');const n=buttons.indexOf(root.getRootNode().activeElement);if(e.key==='Escape'){e.preventDefault();close();trigger.focus();}if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const index=e.key==='Home'?0:e.key==='End'?buttons.length-1:(n+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;buttons[index].focus();}});listen(document,'pointerdown',e=>{if(state.open&&!e.composedPath().includes(root))close();});listen(root,'keydown',e=>{if(e.key==='Escape'&&state.open){close();trigger.focus();}});
    reset=()=>{state={open:false,projects:[{name:'노바 웹사이트',archived:false}],active:0};render();message('메뉴를 열어 프로젝트를 관리해 보세요.');};replay=()=>{state.open=true;render();menu.querySelector('button')?.focus();};render();
  return {reset,replay,suspend(){suspended=true;},continue(){suspended=false;},snapshot(){return JSON.parse(JSON.stringify(state));},restore(saved){if(!saved)return;stop();state=JSON.parse(JSON.stringify(saved));render();if(!resumeRestored())announceRestored();},destroy(){stop();cleanups.forEach(fn=>fn());}};
}
function wireTags(root,item,helpers={}) {
  const $ = selector => root.querySelector(selector);
  const $$ = selector => [...root.querySelectorAll(selector)];
  const cleanups=[];
  const listen=(node,type,fn,opts)=>{if(!node)return;node.addEventListener(type,fn,opts);cleanups.push(()=>node.removeEventListener(type,fn,opts));};
  const message=(value,tone='')=>{const el=$('[data-message]');if(el){el.textContent=value;el.dataset.tone=tone;if(tone)animate(el,[{opacity:.5},{opacity:1}],180);}if(helpers.say)helpers.say(value);};
  const animate=(el,frames,duration=230)=>{if(!el||helpers.reduced?.()||matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(helpers.animate)return helpers.animate(el,frames,duration);return el.animate(frames,{duration,easing:'cubic-bezier(.2,.75,.2,1)'});};
  let state={},timer=0,serial=0,suspended=false;
  const stop=()=>{clearInterval(timer);clearTimeout(timer);timer=0;serial++;};
  let reset=()=>{},render=()=>{},replay=()=>{},resumeRestored=()=>{},announceRestored=()=>{};
    state={tags:['디자인','UI'],draft:'',error:''};const input=$('[data-tag-input]');
    render=()=>{const chips=$('[data-chips]'),preview=$('[data-preview]');chips.innerHTML='';preview.innerHTML='';state.tags.forEach((tag,i)=>{const chip=document.createElement('span');chip.className='si-chip';const label=document.createElement('span');label.textContent=tag;const remove=document.createElement('button');remove.type='button';remove.dataset.remove=String(i);remove.setAttribute('aria-label',`${tag} 태그 삭제`);remove.textContent='×';chip.append(label,remove);chips.append(chip);const p=document.createElement('span');p.textContent='#'+tag;preview.append(p);});$('[data-count]').textContent=`${state.tags.length} / 6`;input.value=state.draft;input.setAttribute('aria-invalid',String(!!state.error));input.placeholder=state.tags.length>=6?'태그 최대 6개':'태그 입력 후 Enter';$$('[data-suggest]').forEach(b=>{b.disabled=state.tags.includes(b.dataset.suggest)||state.tags.length>=6;});if(state.error)message(state.error,'error');};
    const add=value=>{const tag=value.trim().replace(/^#/,'');if(!tag){state.error='태그를 입력해 주세요.';render();return;}if(tag.length>20){state.error='태그는 20자 이하여야 합니다.';render();return;}if(state.tags.some(x=>x.toLocaleLowerCase()===tag.toLocaleLowerCase())){state.error='이미 추가된 태그입니다.';render();return;}if(state.tags.length>=6){state.error='태그는 최대 6개까지 추가할 수 있습니다.';render();return;}state.tags.push(tag);state.draft='';state.error='';render();message(`${tag} 태그를 추가했습니다.`,'success');animate($('[data-chips] .si-chip:last-child'),[{opacity:0,transform:'scale(.85)'},{opacity:1,transform:'scale(1)'}],180);};listen(input,'input',()=>{state.draft=input.value;state.error='';input.setAttribute('aria-invalid','false');});listen(input,'keydown',e=>{if(e.key==='Enter'||e.key===','){e.preventDefault();add(input.value.replace(/,$/,''));}if(e.key==='Backspace'&&!input.value&&state.tags.length){state.tags.pop();render();message('마지막 태그를 삭제했습니다.');}});listen(root,'click',e=>{const remove=e.target.closest('[data-remove]');if(remove){const [tag]=state.tags.splice(Number(remove.dataset.remove),1);render();message(`${tag} 태그를 삭제했습니다.`);input.focus();}const suggest=e.target.closest('[data-suggest]');if(suggest)add(suggest.dataset.suggest);});reset=()=>{state={tags:['디자인','UI'],draft:'',error:''};render();message('최대 6개까지 추가할 수 있습니다.');};replay=()=>{input.focus();};render();
  return {reset,replay,suspend(){suspended=true;},continue(){suspended=false;},snapshot(){return JSON.parse(JSON.stringify(state));},restore(saved){if(!saved)return;stop();state=JSON.parse(JSON.stringify(saved));render();if(!resumeRestored())announceRestored();},destroy(){stop();cleanups.forEach(fn=>fn());}};
}
function wireChart(root,item,helpers={}) {
  const cleanups = [];
  const on = (el, type, fn) => { if (!el) return; el.addEventListener(type, fn); cleanups.push(() => el.removeEventListener(type, fn)); };
  const q = s => root.querySelector(s);
  const qa = s => Array.from(root.querySelectorAll(s));
  const money = n => '₩' + Number(n).toLocaleString('ko-KR');
  let state = {};
  let render = () => {};
  let initial = {};
    const series = {week:[{label:'월',value:420000,orders:7},{label:'화',value:610000,orders:9},{label:'수',value:530000,orders:8},{label:'목',value:840000,orders:12},{label:'금',value:720000,orders:10},{label:'토',value:960000,orders:14},{label:'일',value:580000,orders:8}],month:[{label:'1주',value:2680000,orders:38},{label:'2주',value:3190000,orders:45},{label:'3주',value:2850000,orders:41},{label:'4주',value:3660000,orders:52}]};
    initial = {period:'week',selected:null};
    render = () => {const rows=series[state.period],total=rows.reduce((n,r)=>n+r.value,0),orders=rows.reduce((n,r)=>n+r.orders,0),max=Math.max(...rows.map(r=>r.value)),maxIndex=rows.findIndex(r=>r.value===max),axisMax=state.period==='week'?1000000:4000000;q('[data-total]').textContent=money(total);q('[data-comparison]').textContent=state.period==='week'?'2026년 10월 12일–18일 · 최근 7일':'2026년 9월 21일–10월 18일 · 최근 4주';q('[data-orders]').textContent=orders+'건';q('[data-ymax]').textContent=state.period==='week'?'100만':'400만';q('[data-ymid]').textContent=state.period==='week'?'50만':'200만';q('[data-bars]').style.gridTemplateColumns=`repeat(${rows.length},minmax(0,1fr))`;q('[data-labels]').style.gridTemplateColumns=`repeat(${rows.length},minmax(0,1fr))`;q('[data-bars]').innerHTML=rows.map((r,i)=>`<button type="button" class="sc-bar" data-bar="${i}" aria-label="${r.label} ${money(r.value)}, ${r.orders}건" aria-pressed="${state.selected===i}"><span style="--bar-height:${Math.max(4,r.value/axisMax*100)}%"></span></button>`).join('');q('[data-labels]').innerHTML=rows.map(r=>`<span>${r.label}</span>`).join('');qa('[data-period]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.period===state.period)));const r=rows[state.selected];q('[data-tooltip]').textContent=r?`${r.label} · ${money(r.value)} · 주문 ${r.orders}건`:`최고 매출 ${rows[maxIndex].label} · ${money(rows[maxIndex].value)}`;};
    on(q('[data-bars]'),'click',e=>{const b=e.target.closest('[data-bar]');if(!b)return;state.selected=Number(b.dataset.bar);render();q(`[data-bar="${state.selected}"]`).focus();});
    const tooltip=index=>{state.selected=index;const row=series[state.period][index];qa('[data-bar]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.bar)===index)));q('[data-tooltip]').textContent=row?`${row.label} · ${money(row.value)} · 주문 ${row.orders}건`:`최고 매출 ${series[state.period].reduce((a,b)=>a.value>b.value?a:b).label} · ${money(Math.max(...series[state.period].map(r=>r.value)))}`;};
    for(const event of ['focusin','pointerover'])on(q('[data-bars]'),event,e=>{const b=e.target.closest('[data-bar]');if(b)tooltip(Number(b.dataset.bar));});
    on(q('[data-bars]'),'keydown',e=>{if(e.key==='Escape'){e.preventDefault();tooltip(null);}});
    on(q('[data-bars]'),'keydown',e=>{const b=e.target.closest('[data-bar]');if(!b||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const length=series[state.period].length;state.selected=e.key==='Home'?0:e.key==='End'?length-1:(Number(b.dataset.bar)+(e.key==='ArrowRight'?1:-1)+length)%length;render();q(`[data-bar="${state.selected}"]`).focus();});
    qa('[data-period]').forEach(b=>on(b,'click',()=>{if(state.period===b.dataset.period)return;const before=qa('[data-bar] span').map(bar=>bar.getBoundingClientRect().height);state.period=b.dataset.period;state.selected=null;render();const bars=qa('[data-bar] span');bars.forEach((bar,i)=>{const from=before[Math.min(before.length-1,Math.floor(i*before.length/bars.length))];const to=bar.getBoundingClientRect().height;if(Number.isFinite(from)&&to>0&&from!==to){bar.style.transformOrigin='bottom';helpers.animate(bar,[{transform:`scaleY(${from/to})`},{transform:'scaleY(1)'}],300);}});}));
  const copy = value => JSON.parse(JSON.stringify(value));
  state=copy(initial);render();
  return {reset(){state=copy(initial);render();},replay(){state=copy(initial);render();},snapshot(){return copy(state);},restore(next){if(next&&typeof next==='object'){state=copy(next);render();}},destroy(){cleanups.forEach(fn=>fn());}};
}
function wireAccordion(root,item,helpers={}) {
  const cleanups = [];
  const on = (el, type, fn) => { if (!el) return; el.addEventListener(type, fn); cleanups.push(() => el.removeEventListener(type, fn)); };
  const q = s => root.querySelector(s);
  const qa = s => Array.from(root.querySelectorAll(s));
  let state = {};
  let render = () => {};
  let initial = {};
    initial={open:[]};
    const details=qa('details');
    const motions=new WeakMap();
    const versions=new WeakMap();
    const reduced=()=>helpers.reduced?.()||matchMedia('(prefers-reduced-motion: reduce)').matches;
    const settle=(detail,target,version)=>{if(versions.get(detail)!==version)return;detail.open=target;detail.style.height='';detail.style.overflow='';motions.delete(detail);};
    const setOpen=(detail,index,target)=>{
      const old=motions.get(detail);
      const from=detail.getBoundingClientRect().height;
      old?.cancel();
      const version=(versions.get(detail)||0)+1;
      versions.set(detail,version);
      state.open=target?Array.from(new Set([...state.open,index])):state.open.filter(i=>i!==index);
      detail.open=true;
      const summary=detail.querySelector('summary');
      const to=target?detail.scrollHeight:summary.getBoundingClientRect().height;
      if(reduced()||Math.abs(to-from)<1){settle(detail,target,version);return;}
      detail.style.height=`${from}px`;
      detail.style.overflow='hidden';
      const frames=[{height:`${from}px`},{height:`${to}px`}];
      const animation=helpers.animate?.(detail,frames,{duration:item.styleMotion?.content||220,easing:item.styleMotion?.ease||'cubic-bezier(.2,.8,.2,1)'})||detail.animate(frames,{duration:item.styleMotion?.content||220,easing:item.styleMotion?.ease||'cubic-bezier(.2,.8,.2,1)'});
      motions.set(detail,animation);
      animation.finished.then(()=>settle(detail,target,version),()=>{});
    };
    render=()=>details.forEach((detail,index)=>{motions.get(detail)?.cancel();versions.set(detail,(versions.get(detail)||0)+1);detail.style.height='';detail.style.overflow='';detail.open=state.open.includes(index);});
    details.forEach((detail,index)=>{
      on(detail.querySelector('summary'),'click',event=>{event.preventDefault();setOpen(detail,index,!state.open.includes(index));});
    });

  const copy = value => JSON.parse(JSON.stringify(value));
  state=copy(initial);render();
  return {reset(){state=copy(initial);render();},replay(){state=copy(initial);render();},snapshot(){return copy(state);},restore(next){if(!next||JSON.stringify(next)===JSON.stringify(state))return;details.forEach((detail,index)=>{const target=(next.open||[]).includes(index);if(state.open.includes(index)!==target)setOpen(detail,index,target);});},destroy(){details.forEach(detail=>{motions.get(detail)?.cancel();detail.style.height='';detail.style.overflow='';});cleanups.forEach(fn=>fn());}};
}
function wireTable(root,item,helpers={}) {
  const cleanups = [];
  const on = (el, type, fn) => { if (!el) return; el.addEventListener(type, fn); cleanups.push(() => el.removeEventListener(type, fn)); };
  const q = s => root.querySelector(s);
  const qa = s => Array.from(root.querySelectorAll(s));
  const money = n => '₩' + Number(n).toLocaleString('ko-KR');
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let state = {};
  let render = () => {};
  let initial = {};
    const rows=[{id:'ORD-1048',name:'김서연',amount:128000,status:'paid',date:6},{id:'ORD-1047',name:'이도윤',amount:54000,status:'ready',date:5},{id:'ORD-1046',name:'박지민',amount:239000,status:'sent',date:4},{id:'ORD-1045',name:'최하린',amount:87000,status:'paid',date:3},{id:'ORD-1044',name:'정민준',amount:167000,status:'ready',date:2},{id:'ORD-1043',name:'강수빈',amount:42000,status:'sent',date:1}];
    const statusLabel={paid:'결제 완료',ready:'배송 준비',sent:'배송 완료'};
    initial={search:'',status:'all',sort:'recent',selected:[],rows:rows.map(r=>({...r})),feedback:''};
    const visible=()=>{let list=state.rows.filter(r=>(state.status==='all'||r.status===state.status)&&(`${r.id} ${r.name}`).toLocaleLowerCase('ko').includes(state.search.toLocaleLowerCase('ko')));return list.sort((a,b)=>state.sort==='amount'?b.amount-a.amount:state.sort==='name'?a.name.localeCompare(b.name,'ko'):b.date-a.date);};
    render=()=>{q('[data-search]').value=state.search;q('[data-status]').value=state.status;q('[data-sort]').value=state.sort;const list=visible();q('[data-total-count]').textContent=state.rows.length+'건';q('[data-visible-count]').textContent=`${list.length}건 표시`;q('[data-status-count]').textContent=`결제 ${state.rows.filter(r=>r.status==='paid').length} · 준비 ${state.rows.filter(r=>r.status==='ready').length} · 완료 ${state.rows.filter(r=>r.status==='sent').length}`;q('[data-rows]').innerHTML=list.map(r=>`<tr><td><label class="sc-check-hit"><input type="checkbox" data-select="${r.id}" aria-label="${r.id} 선택" ${state.selected.includes(r.id)?'checked':''}></label></td><td><strong>${r.id}</strong></td><td>${escape(r.name)}</td><td>${money(r.amount)}</td><td><span class="sc-status" data-state="${r.status}">${statusLabel[r.status]}</span></td></tr>`).join('');q('[data-empty]').hidden=list.length!==0;const all=q('[data-select-all]');all.checked=!!list.length&&list.every(r=>state.selected.includes(r.id));all.indeterminate=list.some(r=>state.selected.includes(r.id))&&!all.checked;q('[data-selection]').textContent=state.selected.length?`${state.selected.length}건 선택됨`:'선택한 주문 없음';q('[data-bulk]').disabled=!state.selected.length;q('[data-feedback]').textContent=state.feedback;};
    on(q('[data-search]'),'input',e=>{state.search=e.target.value;render();q('[data-search]').focus();});on(q('[data-status]'),'change',e=>{state.status=e.target.value;render();});on(q('[data-sort]'),'change',e=>{state.sort=e.target.value;render();});on(q('[data-rows]'),'change',e=>{if(!e.target.matches('[data-select]'))return;const id=e.target.dataset.select;state.selected=e.target.checked?[...state.selected,id]:state.selected.filter(x=>x!==id);render();q(`[data-select="${id}"]`)?.focus();});on(q('[data-select-all]'),'change',e=>{const ids=visible().map(r=>r.id);state.selected=e.target.checked?Array.from(new Set([...state.selected,...ids])):state.selected.filter(id=>!ids.includes(id));render();});on(q('[data-bulk]'),'click',()=>{const count=state.selected.length;state.rows.forEach(r=>{if(state.selected.includes(r.id))r.status='sent';});state.selected=[];state.feedback=`${count}건을 배송 완료로 변경했습니다.`;render();q('[data-select-all]').focus();});on(q('[data-clear]'),'click',()=>{state.search='';state.status='all';state.sort='recent';state.feedback='검색 조건을 초기화했습니다.';render();q('[data-search]').focus();});
  const copy = value => JSON.parse(JSON.stringify(value));
  state=copy(initial);render();
  return {reset(){state=copy(initial);render();},replay(){state=copy(initial);render();},snapshot(){return copy(state);},restore(next){if(next&&typeof next==='object'){state=copy(next);render();}},destroy(){cleanups.forEach(fn=>fn());}};
}
function wireCalendar(root,item,helpers={}) {
  const cleanups = [];
  const on = (el, type, fn) => { if (!el) return; el.addEventListener(type, fn); cleanups.push(() => el.removeEventListener(type, fn)); };
  const q = s => root.querySelector(s);
  const qa = s => Array.from(root.querySelectorAll(s));
  let state = {};
  let render = () => {};
  let initial = {};
    const dates=Array.from({length:14},(_,i)=>19+i),times=['09:30','11:00','13:30','15:00'],disabled=[24,25,31,32];
    initial={date:null,time:null,confirmed:false};
    render=()=>{q('[data-dates]').innerHTML=dates.map(d=>`<button type="button" data-date="${d}" aria-label="${d===32?'11월 1일':`10월 ${d}일`}" aria-pressed="${state.date===d}" ${disabled.includes(d)?'disabled title="예약 불가"':''}>${d===32?1:d}</button>`).join('');q('[data-times]').innerHTML=times.map(t=>`<button type="button" data-time="${t}" aria-pressed="${state.time===t}" ${!state.date?'disabled':''}>${t}</button>`).join('');q('[data-summary]').textContent=state.date&&state.time?`10월 ${state.date}일 · ${state.time} · 30분`:state.date?`10월 ${state.date}일 · 시간을 선택하세요`:'날짜와 시간을 선택하세요';q('[data-book]').disabled=!(state.date&&state.time)||state.confirmed;q('[data-book]').textContent=state.confirmed?'예약 완료':'예약 확정';q('[data-feedback]').textContent=state.confirmed?`10월 ${state.date}일 ${state.time} 상담 예약이 완료되었습니다.`:'';};
    on(q('[data-dates]'),'click',e=>{const b=e.target.closest('[data-date]');if(!b||b.disabled)return;state.date=Number(b.dataset.date);state.time=null;state.confirmed=false;render();q(`[data-date="${state.date}"]`).focus();});on(q('[data-times]'),'click',e=>{const b=e.target.closest('[data-time]');if(!b||b.disabled)return;state.time=b.dataset.time;state.confirmed=false;render();q(`[data-time="${state.time}"]`).focus();});on(q('[data-book]'),'click',()=>{state.confirmed=true;render();helpers.animate(q('[data-feedback]'),[{opacity:.5},{opacity:1}],{duration:180,easing:'cubic-bezier(.2,.8,.2,1)'});});
  const copy = value => JSON.parse(JSON.stringify(value));
  state=copy(initial);render();
  return {reset(){state=copy(initial);render();},replay(){state=copy(initial);render();},snapshot(){return copy(state);},restore(next){if(next&&typeof next==='object'){state=copy(next);render();}},destroy(){cleanups.forEach(fn=>fn());}};
}
function wireDialog(root,item,helpers={}) {
  // Standalone for exported HTML: no module-scope dependencies.
  const cleanups=[];
  const on=(node,type,fn)=>{if(helpers.listen)helpers.listen(node,type,fn);else{node.addEventListener(type,fn);cleanups.push(()=>node.removeEventListener(type,fn));}};
  const q=selector=>root.querySelector(selector);
  const qa=selector=>[...root.querySelectorAll(selector)];
  const copy=value=>JSON.parse(JSON.stringify(value));
  const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const files=[{id:'brief',name:'프로젝트 제안서.pdf',meta:'PDF · 2.4 MB · 10월 17일'},{id:'budget',name:'2026 예산안.xlsx',meta:'XLSX · 84 KB · 10월 16일'},{id:'notes',name:'회의 기록.docx',meta:'DOCX · 41 KB · 10월 14일'}];
  const initial={files:copy(files),pending:null,deleted:null,draft:'',open:false};
  let state=copy(initial),openerId=null,current=null,revision=0;
  const dialog=q('dialog'),input=q('[data-confirm-input]');
  const offset='translateY(12px) scale(.98)';
  const comparison=()=>root.closest('.demo')?.dataset.comparison==='true';
  const stop=()=>{revision++;current?.cancel();current=null;};
  const animate=(frames,duration)=>{if(helpers.reduced?.())return null;if(helpers.animate)return helpers.animate(dialog,frames,duration);return dialog.animate(frames,{duration,easing:'cubic-bezier(.2,.8,.2,1)'});};
  const render=()=>{
    q('[data-file-count]').textContent=state.files.length+'개 파일';
    q('[data-files]').innerHTML=state.files.length?state.files.map(file=>`<article><div><strong>${escape(file.name)}</strong><small>${escape(file.meta)}</small></div><button type="button" class="btn" data-delete="${file.id}" aria-label="${escape(file.name)} 삭제">삭제</button></article>`).join(''):'<p class="sc-empty">파일이 없습니다.</p>';
    q('[data-undo-wrap]').hidden=!state.deleted;
    q('[data-result]').textContent=state.deleted?`${state.deleted.name} 삭제됨`:'';
    q('[data-target-name]').textContent=state.pending?.name||'';
    if(input.value!==state.draft)input.value=state.draft;
    q('[data-confirm]').disabled=!state.pending||state.draft!==state.pending.name;
  };
  const show=(focus=true)=>{
    const wasOpen=dialog.open,computed=wasOpen?getComputedStyle(dialog):null;
    const from=computed?{opacity:computed.opacity,transform:computed.transform}:{opacity:0,transform:offset};
    stop();
    const previous=root.getRootNode().activeElement||document.activeElement;
    if(!wasOpen){if(comparison())dialog.show();else dialog.showModal();}
    state.open=true;
    current=animate([from,{opacity:1,transform:'translate(0, 0) scale(1)'}],240);
    if(focus)input.focus();else if(previous?.isConnected)previous.focus({preventScroll:true});
  };
  const finishClose=(token,focus)=>{
    if(token!==revision||!dialog.open)return;
    dialog.close();state.open=false;state.pending=null;state.draft='';render();
    if(focus)(q(`[data-delete="${openerId}"]`)||q('[data-undo-wrap]:not([hidden]) [data-undo]')||q('[data-files] [data-delete]'))?.focus();
  };
  const hide=(focus=true)=>{
    if(!dialog.open)return;
    const computed=getComputedStyle(dialog),from={opacity:computed.opacity,transform:computed.transform};
    stop();const token=revision;
    current=animate([from,{opacity:0,transform:offset}],140);
    if(current)current.finished.then(()=>finishClose(token,focus),()=>{});
    else finishClose(token,focus);
  };
  on(q('[data-files]'),'click',event=>{
    const button=event.target.closest('[data-delete]');if(!button)return;
    const pending=state.files.find(file=>file.id===button.dataset.delete);if(!pending)return;
    state.pending=copy(pending);state.draft='';openerId=button.dataset.delete;render();show();
  });
  on(input,'input',()=>{state.draft=input.value;q('[data-confirm]').disabled=!state.pending||state.draft!==state.pending.name;});
  qa('[data-cancel]').forEach(button=>on(button,'click',()=>hide()));
  on(dialog,'cancel',event=>{event.preventDefault();hide();});
  on(dialog,'close',()=>{if(dialog.open)return;stop();if(state.open||state.pending||state.draft){state.open=false;state.pending=null;state.draft='';render();}});
  on(q('[data-confirm]'),'click',()=>{
    if(!state.pending||state.draft!==state.pending.name)return;
    const index=state.files.findIndex(file=>file.id===state.pending.id);if(index<0)return;
    state.deleted={...state.pending,index};state.files.splice(index,1);render();hide();
  });
  on(q('[data-undo]'),'click',()=>{
    if(!state.deleted)return;
    const file=state.deleted;state.files.splice(file.index,0,{id:file.id,name:file.name,meta:file.meta});state.deleted=null;render();q(`[data-delete="${file.id}"]`)?.focus();
  });
  render();
  return {
    snapshot(){return copy(state);},
    restore(next){
      if(!next||JSON.stringify(next)===JSON.stringify(state))return;
      stop();state={...copy(initial),...copy(next),open:Boolean(next.open??next.pending)};render();
      if(state.open&&!dialog.open)show(false);
      else if(!state.open&&dialog.open)dialog.close();
    },
    setComparison(value){
      if(!dialog.open)return;
      const next=!!value;if(dialog.matches(':modal')===!next)return;
      const previous=root.getRootNode().activeElement||document.activeElement;
      stop();dialog.close();if(next)dialog.show();else dialog.showModal();state.open=true;
      if(previous?.isConnected&&(next||dialog.contains(previous)))previous.focus({preventScroll:true});
    },
    reset(){stop();if(dialog.open)dialog.close();state=copy(initial);render();},
    replay(){stop();if(dialog.open)dialog.close();state=copy(initial);render();},
    destroy(){stop();if(dialog.open)dialog.close();cleanups.forEach(fn=>fn());}
  };
}
export const legacyDefinitions = {
  upload:{markup:markupUpload,css:`.site-study{display:flex;flex-direction:column;min-width:0;min-height:0;padding:var(--space-6,24px);background:var(--surface);color:var(--ink);font:400 14px/1.55 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",sans-serif;word-break:keep-all;overflow-wrap:anywhere}
.site-study *{box-sizing:border-box}
.site-study [hidden]{display:none!important}
.site-study button,.site-study input{font:inherit}
.site-study button{cursor:pointer}
.site-study button:disabled{cursor:not-allowed;opacity:.5}
.site-study :is(button,input):focus-visible{outline:3px solid var(--focus);outline-offset:3px}
.site-study .si-workspace{display:flex;flex-direction:column;gap:var(--space-4,16px);min-width:0;margin:0;padding:0;border:0;border-radius:0;background:var(--surface);box-shadow:none}
.site-study .si-icon{width:18px;height:18px;display:inline-block;vertical-align:middle;flex:none}
.site-study .si-overline{display:block;font-size:11px;font-weight:700;line-height:1.45;color:var(--accent)}
.site-study .si-utility-heading{display:flex;flex-direction:column;gap:var(--space-1,4px);padding-bottom:var(--space-4,16px);border-bottom:1px solid var(--line)}
.site-study .si-utility-heading strong{font-size:22px;font-weight:740;line-height:1.25;letter-spacing:-.045em}
.site-study .si-message{min-height:0;margin:0;padding-top:var(--space-3,12px);border-top:1px solid var(--line);font-size:11px;line-height:1.55;color:var(--muted)}
.site-study .si-message[data-tone=success]{color:var(--success)}
.site-study .si-message[data-tone=error]{color:var(--error)}
.site-study .si-link{min-height:44px;padding:8px 0;border:0;background:transparent;color:var(--accent);font-size:12px;font-weight:650;text-decoration:underline;text-underline-offset:3px}
.study-process .si-workspace{gap:var(--space-4,16px)}
.study-process .si-drop{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-2,8px);min-height:156px;padding:var(--space-6,24px);border:1px dashed var(--line);border-radius:var(--control-radius,6px);background:var(--concept-paper);text-align:center;cursor:pointer}
.study-process .si-drop[data-over=true],.study-process .si-drop:focus-within{border-color:var(--accent);outline:3px solid var(--focus);outline-offset:2px}
.study-process .si-drop input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}
.study-process .si-drop input:focus-visible{outline:0}
.study-process .si-upload-glyph{display:grid;place-items:center;width:34px;height:34px;color:var(--accent)}
.study-process .si-drop strong{font-size:14px;font-weight:700;line-height:1.4}
.study-process .si-drop>span:last-of-type{max-width:34ch;color:var(--muted);font-size:12px;line-height:1.5}
.study-process .si-upload-inline{display:flex;justify-content:flex-end;align-items:center;min-height:44px;margin-top:calc(-1 * var(--space-3,12px))}
.study-process .si-queue-wrap{min-width:0;border-top:1px solid var(--line);padding-top:var(--space-4,16px)}
.study-process .si-queue-title strong{font-size:13px;font-weight:700}
.study-process .si-queue{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-1,4px);min-height:86px;text-align:center}
.study-process .si-empty-icon{display:grid;place-items:center;color:var(--muted)}
.study-process .si-queue>strong{font-size:12px;font-weight:650}
.study-process .si-queue>small{font-size:11px;color:var(--muted)}
.study-process .si-file-row{display:flex;align-items:center;gap:var(--space-3,12px);width:100%;text-align:left}
.study-process .si-file-icon{display:grid;place-items:center;flex:none;width:38px;height:38px;border:1px solid var(--line);border-radius:var(--control-radius,6px);background:var(--concept-paper);color:var(--accent);font:700 10px ui-monospace,monospace}
.study-process .si-file-meta{flex:1;min-width:0}
.study-process .si-file-meta :is(strong,small){display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.study-process .si-file-meta strong{font-size:12px}
.study-process .si-file-meta small{font-size:11px;color:var(--muted)}
.study-process .si-file-row button{flex:none;min-height:44px;border:0;background:transparent;color:var(--accent);font-size:12px;text-decoration:underline;text-underline-offset:3px}
.study-process .si-progress{width:100%;height:4px;margin-top:var(--space-2,8px);overflow:hidden;background:var(--line)}
.study-process .si-progress span{display:block;width:100%;height:100%;background:var(--accent);transform-origin:left;transition:transform .13s linear}
.study-process .si-progress-caption{display:flex;justify-content:space-between;width:100%;font-size:11px;color:var(--muted)}
@container (max-width:650px){.site-study{padding:var(--space-4,16px)}}
@media(prefers-reduced-motion:reduce){.site-study *{transition-duration:0s!important;animation-duration:0s!important}}`,wire:wireUpload},
  menu:{markup:markupMenu,css:`.site-study{display:flex;flex-direction:column;min-width:0;min-height:0;padding:var(--space-6,24px);background:var(--surface);color:var(--ink);font:400 14px/1.55 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",sans-serif;word-break:keep-all;overflow-wrap:anywhere}
.site-study *{box-sizing:border-box}
.site-study [hidden]{display:none!important}
.site-study button,.site-study input{font:inherit}
.site-study button{cursor:pointer}
.site-study button:disabled{cursor:not-allowed;opacity:.5}
.site-study :is(button,input):focus-visible{outline:3px solid var(--focus);outline-offset:3px}
.site-study .si-workspace{display:flex;flex-direction:column;gap:var(--space-4,16px);min-width:0;margin:0;padding:0;border:0;border-radius:0;background:var(--surface);box-shadow:none}
.site-study .si-icon{width:18px;height:18px;display:inline-block;vertical-align:middle;flex:none}
.site-study .si-overline{display:block;font-size:11px;font-weight:700;line-height:1.45;color:var(--accent)}
.site-study .si-message{min-height:0;margin:0;padding-top:var(--space-3,12px);border-top:1px solid var(--line);font-size:11px;line-height:1.55;color:var(--muted)}
.site-study .si-message[data-tone=success]{color:var(--success)}
.site-study .si-message[data-tone=error]{color:var(--error)}
.study-layers .si-workspace{position:relative;gap:var(--space-4,16px)}
.study-layers .si-project-head{display:flex;align-items:center;gap:var(--space-3,12px);padding-bottom:var(--space-4,16px);border-bottom:1px solid var(--ink)}
.study-layers .si-project-mark{display:grid;place-items:center;flex:none;width:42px;height:42px;background:var(--ink);color:var(--surface);font:700 21px Georgia,serif}
.study-layers .si-project-head>div{display:flex;flex:1;flex-direction:column;min-width:0}
.study-layers .si-project-head strong{font-size:19px;font-weight:730;line-height:1.25;letter-spacing:-.045em}
.study-layers .si-project-head small{font-size:11px;color:var(--muted)}
.study-layers .si-menu-trigger{display:grid;place-items:center;flex:none;width:44px;height:44px;border:1px solid var(--line);border-radius:var(--control-radius,0);background:var(--surface);color:var(--ink)}
.study-layers .si-menu-trigger[aria-expanded=true]{border-color:var(--ink);background:var(--ink);color:var(--surface)}
.study-layers .si-action-menu{position:absolute;z-index:5;top:62px;right:0;width:min(270px,100%);padding:var(--space-2,8px);border:1px solid var(--ink);background:var(--surface);box-shadow:5px 5px 0 color-mix(in srgb,var(--ink) 10%,transparent)}
.study-layers .si-action-menu button{display:flex;align-items:center;gap:var(--space-3,12px);width:100%;min-height:48px;padding:var(--space-2,8px);border:0;border-bottom:1px solid var(--line);background:transparent;color:var(--ink);text-align:left}
.study-layers .si-action-menu button:last-child{border-bottom:0}
.study-layers .si-action-menu button:hover,.study-layers .si-action-menu button:focus-visible{background:var(--concept-paper)}
.study-layers .si-action-menu button>.si-icon{color:var(--accent)}
.study-layers .si-action-menu strong{font-size:12px;font-weight:650}
.study-layers .si-menu-result{display:grid;gap:var(--space-1,4px)}
.study-layers .si-result-head{display:flex;justify-content:space-between;gap:var(--space-3,12px);font-size:12px;color:var(--muted)}
.study-layers .si-result-head b{color:var(--ink);font-weight:700}
.study-layers .si-project-row{display:flex;align-items:center;gap:var(--space-2,8px);min-height:40px;border-bottom:1px solid var(--line);font-size:12px}
.study-layers .si-project-row:last-child{border-bottom:0}
.study-layers .si-project-row strong{flex:1;min-width:0;font-weight:650}
.study-layers .si-project-row small{color:var(--muted)}
.study-layers .si-project-dot{flex:none;width:7px;height:7px;border-radius:50%;background:var(--muted)}
.study-layers .si-project-row[data-active=true] .si-project-dot{background:var(--accent)}
@container (max-width:650px){.site-study{padding:var(--space-4,16px)}}
@media(prefers-reduced-motion:reduce){.site-study *{transition-duration:0s!important;animation-duration:0s!important}}`,wire:wireMenu},
  tags:{markup:markupTags,css:`.site-study{display:flex;flex-direction:column;min-width:0;min-height:0;padding:var(--space-6,24px);background:var(--surface);color:var(--ink);font:400 14px/1.55 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",sans-serif;word-break:keep-all;overflow-wrap:anywhere}
.site-study *{box-sizing:border-box}
.site-study [hidden]{display:none!important}
.site-study button,.site-study input{font:inherit}
.site-study button{cursor:pointer}
.site-study button:disabled{cursor:not-allowed;opacity:.5}
.site-study :is(button,input):focus-visible{outline:3px solid var(--focus);outline-offset:3px}
.site-study .si-workspace{display:flex;flex-direction:column;gap:var(--space-4,16px);min-width:0;margin:0;padding:0;border:0;border-radius:0;background:var(--surface);box-shadow:none}
.site-study .si-message{min-height:0;margin:0;padding-top:var(--space-3,12px);border-top:1px solid var(--line);font-size:11px;line-height:1.55;color:var(--muted)}
.site-study .si-message[data-tone=success]{color:var(--success)}
.site-study .si-message[data-tone=error]{color:var(--error)}
.study-quick-add .si-workspace{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:var(--space-3,12px) var(--space-6,24px)}
.study-quick-add .si-tag-heading{grid-column:1/-1;display:flex;align-items:baseline;justify-content:space-between;gap:var(--space-3,12px);padding-bottom:var(--space-3,12px);border-bottom:1px solid var(--ink)}
.study-quick-add .si-tag-heading h4{margin:0;font-size:22px;font-weight:730;line-height:1.3;letter-spacing:-.045em}
.study-quick-add .si-tag-heading>span{font-size:12px;color:var(--muted)}
.study-quick-add .si-chip-editor{grid-column:1;grid-row:2;display:flex;flex-direction:column;gap:var(--space-2,8px);min-height:118px;padding:var(--space-3,12px);border:1px solid var(--line);background:var(--surface);cursor:text}
.study-quick-add .si-chip-editor:focus-within{outline:3px solid var(--focus);outline-offset:3px}
.study-quick-add .si-chips{display:flex;flex-wrap:wrap;gap:var(--space-1,4px)}
.study-quick-add .si-chip{display:inline-flex;align-items:center;gap:var(--space-1,4px);padding:1px 2px 1px 9px;border:1px solid var(--line);background:var(--concept-paper);color:var(--ink);font-size:12px;font-weight:650}
.study-quick-add .si-chip button{min-width:44px;min-height:44px;padding:0;border:0;background:transparent;color:var(--ink);font-size:17px}
.site-study.study-quick-add .si-chip-editor input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]){width:100%;min-height:44px;padding:5px 2px;border:0;border-radius:0;background:transparent;color:var(--ink);font-size:13px;outline:0}
.study-quick-add .si-tag-hint{grid-column:1;grid-row:3;margin:0;font-size:11px;line-height:1.5;color:var(--muted)}
.study-quick-add .si-suggestions{grid-column:1;grid-row:4;display:flex;flex-wrap:wrap;align-items:center;gap:var(--space-2,8px)}
.study-quick-add .si-suggestions>span{font-size:11px;color:var(--muted)}
.study-quick-add .si-suggestions>div{display:flex;flex-wrap:wrap;gap:var(--space-1,4px)}
.study-quick-add .si-suggestions button{min-height:44px;padding:8px var(--space-3,12px);border:1px solid var(--line);border-radius:0;background:var(--surface);color:var(--ink);font-size:12px}
.study-quick-add .si-suggestions button:not(:disabled):hover{border-color:var(--accent);color:var(--accent)}
.study-quick-add .si-tag-preview{grid-column:2;grid-row:2/5;display:flex;flex-direction:column;gap:var(--space-2,8px);min-width:0;padding:var(--space-3,12px) 0 var(--space-3,12px) var(--space-6,24px);border-left:1px solid var(--line)}
.study-quick-add .si-tag-preview>span{font-size:11px;color:var(--muted)}
.study-quick-add .si-tag-preview strong{font-size:17px;font-weight:680;line-height:1.4;letter-spacing:-.035em}
.study-quick-add .si-tag-preview>div{display:flex;flex-wrap:wrap;gap:var(--space-2,8px);font-size:12px;color:var(--accent)}
.study-quick-add .si-message{grid-column:1/-1}
@container (max-width:650px){.site-study{padding:var(--space-4,16px)}.study-quick-add .si-workspace{grid-template-columns:1fr}.study-quick-add .si-chip-editor,.study-quick-add .si-tag-hint,.study-quick-add .si-suggestions,.study-quick-add .si-tag-preview{grid-column:1;grid-row:auto}.study-quick-add .si-tag-preview{padding:var(--space-4,16px) 0;border-left:0;border-top:1px solid var(--line)}}
@media(prefers-reduced-motion:reduce){.site-study *{transition-duration:0s!important;animation-duration:0s!important}}`,wire:wireTags},
  chart:{markup:markupChart,css:`.site-study .site-content{box-sizing:border-box;width:100%;min-width:0;padding:var(--space-8,32px);background:var(--concept-paper,var(--surface,#fff));color:var(--ink,#17243a);font:14px/1.5 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",sans-serif}
.site-study .site-content *{box-sizing:border-box}
.site-study .site-content h3,.site-study .site-content h4,.site-study .site-content p{margin:0}
.site-study .site-content h3{font-size:27px;font-weight:700;line-height:1.22;letter-spacing:-.04em}
.site-study .site-content button,.site-study .site-content input,.site-study .site-content select{font:inherit}
.site-study .site-content button{cursor:pointer}
.site-study .site-content button:disabled{cursor:not-allowed;opacity:.48}
.site-study .site-content button:focus-visible,.site-study .site-content input:focus-visible,.site-study .site-content select:focus-visible,.site-study .site-content summary:focus-visible{outline:3px solid var(--focus,var(--accent));outline-offset:3px}
.site-study .site-content [hidden]{display:none!important}
.site-study .site-content .sc-head{display:flex;align-items:center;justify-content:space-between;gap:var(--space-4,16px);margin-bottom:var(--space-6,24px)}
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
@container (max-width:699px){.site-study .site-chart .sc-dashboard{grid-template-columns:1fr}.site-study .site-chart .sc-context{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4,16px);padding:var(--space-4,16px);border-left:0;border-top:1px solid var(--line)}.site-study .site-chart .sc-context h4{grid-column:1/-1;margin:0}.site-study .site-chart .sc-context-metric,.site-study .site-chart .sc-context-detail{margin:0;padding:0;border:0}}@container (max-width:520px){.site-study .site-chart{padding:0}.site-study .site-chart .sc-chart-main{padding:var(--space-3,12px)}.site-study .site-chart .sc-chart-area{margin-inline:calc(-1 * var(--space-3,12px));grid-template-columns:28px minmax(0,1fr);gap:var(--space-1,4px)}.site-study .site-chart .sc-plot,.site-study .site-chart .sc-y-axis{height:185px}.site-study .site-chart .sc-plot,.site-study .site-chart .sc-axis{gap:0}.site-study .site-chart .sc-bar{padding:0}}`,wire:wireChart},
  accordion:{markup:markupAccordion,css:`.site-study .site-content{box-sizing:border-box;width:100%;min-width:0;padding:var(--space-8,32px);background:var(--concept-paper,var(--surface,#fff));color:var(--ink,#17243a);font:14px/1.5 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",sans-serif}
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
@container (max-width:520px){.site-study .site-content{padding:var(--space-4,16px)}.site-study .site-faq .sc-answer{padding-right:0}}@media (prefers-reduced-motion:reduce){.site-study .site-faq .sc-faq-plus{transition:none}}`,wire:wireAccordion},
  table:{markup:markupTable,css:`.site-study .site-content{box-sizing:border-box;width:100%;min-width:0;padding:var(--space-8,32px);background:var(--concept-paper,var(--surface,#fff));color:var(--ink,#17243a);font:14px/1.5 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",sans-serif}
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
@container (max-width:520px){.site-study .site-content{padding:var(--space-4,16px)}.site-study .site-orders .sc-filterbar{grid-template-columns:1fr 1fr}
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
.site-study .site-orders td:nth-child(5){grid-column:3;grid-row:2;text-align:right}}`,wire:wireTable},
  calendar:{markup:markupCalendar,css:`.site-study .site-content{box-sizing:border-box;width:100%;min-width:0;padding:var(--space-8,32px);background:var(--concept-paper,var(--surface,#fff));color:var(--ink,#17243a);font:14px/1.5 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",sans-serif}
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
.site-study .site-content .btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:9px 14px;border:1px solid var(--line);border-radius:var(--control-radius,6px);background:var(--surface,#fff);color:var(--ink);font-size:12px;font-weight:650;line-height:1.35;text-decoration:none}
.site-study .site-content .btn:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}
.site-study .site-content .btn.primary{background:var(--accent);border-color:var(--accent);color:#fff}
.site-study .site-content .btn.primary:hover:not(:disabled){filter:brightness(.9);color:#fff}
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
@container (max-width:520px){.site-study .site-content{padding:var(--space-4,16px)}.site-study .site-booking .sc-weekdays,.site-study .site-booking .sc-dates{gap:0}.site-study .site-booking .sc-dates button{min-height:44px;border-color:transparent;background:transparent}.site-study .site-booking .sc-dates button[aria-pressed=true]{background:var(--accent);border-color:var(--accent)}}`,wire:wireCalendar},
  dialog:{markup:markupDialog,css:`.site-study .site-content{box-sizing:border-box;width:100%;min-width:0;padding:var(--space-8,32px);background:var(--concept-paper,var(--surface,#fff));color:var(--ink,#17243a);font:14px/1.5 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",sans-serif}
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
.site-study .site-content .field{width:100%;min-width:0;min-height:44px;padding:9px 12px;border:1px solid var(--line);border-radius:var(--control-radius,6px);background:var(--surface,#fff);color:var(--ink)}
.site-study .site-content .btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:9px 14px;border:1px solid var(--line);border-radius:var(--control-radius,6px);background:var(--surface,#fff);color:var(--ink);font-size:12px;font-weight:650;line-height:1.35;text-decoration:none}
.site-study .site-content .btn:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}
.site-study .site-content .btn.primary{background:var(--accent);border-color:var(--accent);color:#fff}
.site-study .site-content .btn.primary:hover:not(:disabled){filter:brightness(.9);color:#fff}
.site-study .site-content dialog{color:var(--ink);border:1px solid var(--line);box-shadow:0 24px 70px #15243e35}
.site-study .site-content dialog::backdrop{background:#17202ca8}
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
@container (max-width:520px){.site-study .site-content{padding:var(--space-4,16px)}.site-study .site-delete .sc-confirm{padding:var(--space-6,24px)}}`,wire:wireDialog},
};
