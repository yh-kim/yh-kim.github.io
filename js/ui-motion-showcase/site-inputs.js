// Reusable website controls. Each study owns its own local, restorable state.
const icon = name => {
  const paths={upload:'<path d="M12 16V4m-4 4 4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',duplicate:'<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',edit:'<path d="m4 16 11-11 4 4-11 11-5 1 1-5Zm9-9 4 4"/>',archive:'<rect x="4" y="4" width="16" height="4" rx="1"/><path d="M6 8v11a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8m-9 4h6"/>',menu:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',star:'<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.7l6.2-.9L12 3Z"/>',plus:'<path d="M12 5v14M5 12h14"/>',empty:'<path d="M4 12h4l2-4 4 8 2-4h4"/>',account:'<circle cx="12" cy="8" r="3"/><path d="M5 20a7 7 0 0 1 14 0"/>',security:'<path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z"/>'};
  return `<svg class="si-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||''}</svg>`;
};

export function inputsMarkup(item) {
  switch (item.id) {
    case 'dark-ai--process': return `<section class="site-study study-process si-upload">
      <div class="si-workspace"><div class="si-utility-heading"><span class="si-overline">자료실</span><strong>파일 업로드</strong></div><label class="si-drop" data-drop><span class="si-upload-glyph" aria-hidden="true">${icon('upload')}</span><strong>파일을 이곳에 놓으세요</strong><span>또는 눌러 파일 선택 · PNG, JPG, PDF · 최대 5MB</span><input type="file" accept="image/png,image/jpeg,application/pdf" data-file aria-label="업로드할 파일 선택"></label>
      <div class="si-upload-inline"><button type="button" class="si-link" data-action="sample">샘플 파일 사용</button></div>
      <div class="si-queue-wrap"><div class="si-queue-title"><strong>업로드 목록</strong></div><div class="si-queue" data-queue aria-live="polite"><span class="si-empty-icon" aria-hidden="true">${icon('empty')}</span><strong>대기 중인 파일이 없습니다</strong><small>파일을 고르면 검증 후 업로드가 시작됩니다.</small></div></div>
      <p class="si-message" data-message role="status">업로드 파일은 서버에 전송되지 않습니다.</p></div></section>`;
    case 'dark-ai--layers': return `<section class="site-study study-layers si-menu">
      <div class="si-workspace"><div class="si-project-head"><span class="si-project-mark" aria-hidden="true">N</span><div><span class="si-overline">웹사이트 프로젝트</span><strong data-title>노바 웹사이트</strong><small data-subtitle>최근 수정 · 오늘</small></div><button class="si-menu-trigger" type="button" data-menu-trigger aria-haspopup="menu" aria-expanded="false" aria-label="프로젝트 메뉴 열기">${icon('menu')}</button></div>
      <div class="si-action-menu" data-menu role="menu" aria-label="프로젝트 작업" hidden><button role="menuitem" type="button" data-menu-action="duplicate">${icon('duplicate')}<span><strong>복제하기</strong></span></button><button role="menuitem" type="button" data-menu-action="rename">${icon('edit')}<span><strong>이름 바꾸기</strong></span></button><button role="menuitem" type="button" data-menu-action="archive">${icon('archive')}<span><strong>보관하기</strong></span></button></div>
      <div class="si-menu-result"><div class="si-result-head"><span>프로젝트 상태</span><b data-count>1개</b></div><div data-project-list></div></div><p class="si-message" data-message role="status">메뉴를 열어 프로젝트를 관리해 보세요.</p></div></section>`;
    case 'dark-ai--controls': return `<section class="site-study study-controls si-settings">
      <div class="si-workspace"><div class="si-utility-heading"><span class="si-overline">워크스페이스</span><strong>환경 설정</strong></div><div class="si-tabbar" role="tablist" aria-label="설정 카테고리"><button type="button" role="tab" data-tab="account" aria-selected="true" tabindex="0">계정</button><button type="button" role="tab" data-tab="notify" aria-selected="false" tabindex="-1">알림</button><button type="button" role="tab" data-tab="security" aria-selected="false" tabindex="-1">보안</button></div>
      <div class="si-settings-pane" role="tabpanel" data-panel><div class="si-setting-top"><div><span class="si-overline" data-pane-index>개인 정보</span><h4 data-pane-title>계정 환경</h4></div><span class="si-setting-glyph" aria-hidden="true" data-pane-glyph>${icon('account')}</span></div><label class="si-setting-row"><span><strong data-setting-label>프로필 공개</strong><small data-setting-copy>내 프로필을 팀원에게 표시합니다.</small></span><input type="checkbox" data-setting checked><i aria-hidden="true"></i></label></div>
      <div class="si-settings-foot"><span data-save-state>저장된 상태입니다.</span><button class="si-solid" type="button" data-save>변경 사항 저장</button></div><p class="si-message" data-message role="status">설정 변경은 이 화면에만 적용됩니다.</p></div></section>`;
    case 'dark-ai--beam': return `<section class="site-study study-beam si-actions">
      <div class="si-workspace"><div class="si-object-edition"><span>내 컬렉션</span><span>상품 보관함</span></div><div class="si-save-panel"><div><span class="si-overline">상품 선택</span><strong>보관함에 담은 물건</strong></div><span class="si-save-indicator" data-save-indicator>저장 전</span></div>
      <div class="si-action-row"><button type="button" class="si-solid si-save-button" data-action="save">변경 사항 저장</button><button type="button" class="si-outline" data-action="fail">오류 상태 보기</button></div>
      <div class="si-divider"></div><span class="si-actions-label">빠른 작업</span><div class="si-secondary-actions"><button type="button" class="si-toggle" data-action="bookmark" aria-pressed="false">${icon('star')} 북마크</button><button type="button" class="si-toggle" data-action="follow" aria-pressed="false">${icon('plus')} 팔로우</button><button type="button" class="si-toggle" disabled aria-disabled="true">권한 없음</button></div><p class="si-message" data-message role="status">버튼 상태는 로컬 시뮬레이션입니다.</p></div></section>`;
    case 'dark-ai--prompt': return `<section class="site-study study-prompt si-signup">
      <form class="si-workspace si-signup-form" data-form novalidate><div class="si-publication-masthead"><span>디자인 노트</span><span>격주 수요일 발행</span></div>
      <div class="si-signup-layout"><article class="si-editorial"><div class="si-editorial-meta"><span>이번 호 · 인터페이스</span><span>5분 읽기</span></div><h4>좋은 인터페이스는<br>무엇을 덜어내는가</h4><p class="si-editorial-lead">화면에 더 많은 기능을 담을수록, 사용자가 해야 할 판단도 늘어납니다.</p><p>이번 글에서는 설정 화면의 정보 순서와 행동 버튼의 위치를 살펴봅니다. 읽는 흐름을 방해하는 요소를 걷어내고, 필요한 선택이 제때 보이게 만드는 방법을 정리했습니다.</p></article>
      <div class="si-subscribe-panel"><div class="si-subscribe-heading"><span>뉴스레터 구독</span><strong>다음 글을 이메일로 받아보세요</strong></div><div class="si-form-fields"><label>이름<input data-name type="text" name="name" autocomplete="name" aria-label="이름" aria-describedby="si-name-error" placeholder="이름 입력" maxlength="30" required><small id="si-name-error" data-error="name"></small></label><label>이메일<input data-email type="email" name="email" autocomplete="email" aria-label="이메일" aria-describedby="si-email-error" placeholder="name@example.com" required><small id="si-email-error" data-error="email"></small></label></div>
      <label class="si-consent"><input data-consent type="checkbox" aria-label="이메일 수신 동의" aria-describedby="si-consent-error" required><span>이메일 수신에 동의합니다. 언제든 구독을 취소할 수 있습니다.</span></label><p class="si-inline-error" id="si-consent-error" data-error="consent"></p><div class="si-form-actions"><button class="si-solid" type="submit" data-submit>구독 신청</button><button class="si-link" type="reset">초기화</button></div></div></div><p class="si-message" data-message role="status">실제 이메일은 발송되지 않습니다.</p></form></section>`;
    case 'light-project--quick-add': return `<section class="site-study study-quick-add si-tags">
      <div class="si-workspace"><div class="si-tag-heading"><div><h4>이 글의 키워드</h4></div><span data-count>2 / 6</span></div><div class="si-chip-editor" data-chip-editor><div class="si-chips" data-chips></div><input data-tag-input type="text" maxlength="24" aria-label="새 태그 입력" placeholder="태그 입력 후 Enter" autocomplete="off"></div><p class="si-tag-hint">Enter 또는 쉼표로 추가 · 비어 있을 때 Backspace로 마지막 태그 삭제</p><div class="si-suggestions"><span>추천 태그</span><div><button type="button" data-suggest="접근성">+ 접근성</button><button type="button" data-suggest="컴포넌트">+ 컴포넌트</button><button type="button" data-suggest="반응형">+ 반응형</button></div></div><div class="si-tag-preview"><span>글 미리보기</span><strong>새로운 인터페이스를 만드는 방법</strong><div data-preview></div></div><p class="si-message" data-message role="status">최대 6개까지 추가할 수 있습니다.</p></div></section>`;
    default: return null;
  }
}

export function inputsWire(root,item,helpers={}) {
  // This function is serialized into exported HTML; keep all dependencies local.
  const $ = selector => root.querySelector(selector);
  const $$ = selector => [...root.querySelectorAll(selector)];
  const cleanups=[];
  const listen=(node,type,fn,opts)=>{if(!node)return;node.addEventListener(type,fn,opts);cleanups.push(()=>node.removeEventListener(type,fn,opts));};
  const message=(value,tone='')=>{const el=$('[data-message]');if(el){el.textContent=value;el.dataset.tone=tone;if(tone)animate(el,[{opacity:.5},{opacity:1}],180);}if(helpers.say)helpers.say(value);};
  const animate=(el,frames,duration=230)=>{if(!el||helpers.reduced?.()||matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(helpers.animate)return helpers.animate(el,frames,duration);return el.animate(frames,{duration,easing:'cubic-bezier(.2,.75,.2,1)'});};
  const wireIcon=name=>{const paths={account:'<circle cx="12" cy="8" r="3"/><path d="M5 20a7 7 0 0 1 14 0"/>',notify:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',security:'<path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z"/>',star:'<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.7l6.2-.9L12 3Z"/>',plus:'<path d="M12 5v14M5 12h14"/>',check:'<path d="m5 12 5 5L19 7"/>',empty:'<path d="M4 12h4l2-4 4 8 2-4h4"/>'};return `<svg class="si-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||''}</svg>`;};
  let state={},timer=0,serial=0,suspended=false;
  const stop=()=>{clearInterval(timer);clearTimeout(timer);timer=0;serial++;};
  let reset=()=>{},render=()=>{},replay=()=>{},resumeRestored=()=>{},announceRestored=()=>{};

  if(item.id==='dark-ai--process'){
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
  }
  if(item.id==='dark-ai--layers'){
    state={open:false,projects:[{name:'노바 웹사이트',archived:false}],active:0};const trigger=$('[data-menu-trigger]'),menu=$('[data-menu]');
    const close=()=>{state.open=false;render();};
    render=()=>{trigger.setAttribute('aria-expanded',String(state.open));menu.hidden=!state.open;const current=state.projects[state.active];$('[data-title]').textContent=current.name;$('[data-subtitle]').textContent=current.archived?'보관함에 있음':'최근 수정 · 오늘';$('[data-count]').textContent=`${state.projects.length}개`;$('[data-project-list]').innerHTML='';state.projects.forEach((p,i)=>{const row=document.createElement('div');row.className='si-project-row';row.innerHTML=`<span class="si-project-dot"></span><strong></strong><small>${p.archived?'보관됨':'활성'}</small>`;row.querySelector('strong').textContent=p.name;if(i===state.active)row.dataset.active='true';$('[data-project-list]').append(row);});};
    listen(trigger,'click',()=>{state.open=!state.open;render();if(state.open){animate(menu,[{opacity:0,transform:'translateY(-7px)'},{opacity:1,transform:'translateY(0)'}],170);menu.querySelector('button')?.focus();}});listen(menu,'click',e=>{const action=e.target.closest('[data-menu-action]')?.dataset.menuAction;if(!action)return;const current=state.projects[state.active];if(action==='duplicate'){state.projects.push({name:`${current.name} 사본`,archived:false});state.active=state.projects.length-1;message('프로젝트 사본을 목록에 추가했습니다.','success');}if(action==='rename'){current.name=current.name.endsWith(' · 수정됨')?current.name.replace(' · 수정됨',''):current.name+' · 수정됨';message('프로젝트 이름을 변경했습니다.','success');}if(action==='archive'){current.archived=!current.archived;message(current.archived?'프로젝트를 보관함으로 옮겼습니다.':'프로젝트를 활성화했습니다.','success');}close();trigger.focus();});listen(menu,'keydown',e=>{const buttons=$$('[data-menu-action]');const n=buttons.indexOf(root.getRootNode().activeElement);if(e.key==='Escape'){e.preventDefault();close();trigger.focus();}if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const index=e.key==='Home'?0:e.key==='End'?buttons.length-1:(n+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;buttons[index].focus();}});listen(document,'pointerdown',e=>{if(state.open&&!e.composedPath().includes(root))close();});listen(root,'keydown',e=>{if(e.key==='Escape'&&state.open){close();trigger.focus();}});
    reset=()=>{state={open:false,projects:[{name:'노바 웹사이트',archived:false}],active:0};render();message('메뉴를 열어 프로젝트를 관리해 보세요.');};replay=()=>{state.open=true;render();menu.querySelector('button')?.focus();};render();
  }
  if(item.id==='dark-ai--controls'){
    const tabs=['account','notify','security'];const content={account:['개인 정보','계정 환경','프로필에 표시할 설정을 선택하세요.','프로필 공개','내 프로필을 팀원에게 표시합니다.','account'],notify:['소식 받기','알림 관리','업데이트를 받을 방법을 선택하세요.','이메일 알림','중요한 활동을 이메일로 받습니다.','notify'],security:['접근과 보안','보안 설정','계정 접근을 안전하게 관리하세요.','로그인 알림','새 기기의 로그인을 알려드립니다.','security']};state={tab:'account',values:{account:true,notify:false,security:true},saved:{account:true,notify:false,security:true}};
    render=()=>{const d=content[state.tab];$$('[data-tab]').forEach(b=>{const active=b.dataset.tab===state.tab;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});$('[data-pane-index]').textContent=d[0];$('[data-pane-title]').textContent=d[1];$('[data-setting-label]').textContent=d[3];$('[data-setting-copy]').textContent=d[4];$('[data-pane-glyph]').innerHTML=wireIcon(d[5]);$('[data-setting]').checked=state.values[state.tab];const dirty=tabs.some(k=>state.values[k]!==state.saved[k]);$('[data-save-state]').textContent=dirty?'저장되지 않은 변경 사항':'저장된 상태입니다.';$('[data-save]').textContent=dirty?'변경 사항 저장':'저장됨 ✓';};
    listen(root,'click',e=>{const tab=e.target.closest('[data-tab]');if(tab){state.tab=tab.dataset.tab;render();animate($('[data-panel]'),[{opacity:.45,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],180);}if(e.target.closest('[data-save]')){const dirty=tabs.some(k=>state.values[k]!==state.saved[k]);if(dirty){state.saved={...state.values};render();message('설정을 저장했습니다 · 이 화면에서만 유지됩니다.','success');}else message('이미 저장된 상태입니다.','success');}});listen(root,'change',e=>{if(e.target.matches('[data-setting]')){state.values[state.tab]=e.target.checked;render();message('변경 사항을 저장해 주세요.');}});listen($('[role=tablist]'),'keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const i=tabs.indexOf(state.tab);state.tab=tabs[e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3];render();$(`[data-tab=${state.tab}]`).focus();});reset=()=>{state={tab:'account',values:{account:true,notify:false,security:true},saved:{account:true,notify:false,security:true}};render();message('설정 변경은 이 화면에만 적용됩니다.');};replay=()=>{$('[data-tab=notify]').click();};render();
  }
  if(item.id==='dark-ai--beam'){
    state={status:'idle',bookmark:false,follow:false};const save=$('[data-action=save]');
    render=()=>{save.disabled=state.status==='loading';save.textContent=state.status==='loading'?'저장 중…':state.status==='error'?'다시 시도':state.status==='success'?'저장됨 ✓':'변경 사항 저장';$('[data-save-indicator]').textContent={idle:'저장 전',loading:'처리 중',success:'저장 완료',error:'저장 실패'}[state.status];$('[data-save-indicator]').dataset.status=state.status;for(const key of ['bookmark','follow']){const b=$(`[data-action=${key}]`);b.setAttribute('aria-pressed',String(state[key]));b.innerHTML=wireIcon(key==='bookmark'?'star':state[key]?'check':'plus')+' '+(key==='bookmark'?'북마크':'팔로우');}};
    const run=fail=>{stop();state.status='loading';state.pendingFail=!!fail;render();message('저장 상태를 확인하는 중…');const id=serial;const finish=()=>{if(id!==serial)return;if(suspended||helpers.active?.()===false){timer=setTimeout(finish,100);return;}state.status=fail?'error':'success';render();message(fail?'저장에 실패했습니다. 다시 시도할 수 있습니다.':'변경 사항을 저장했습니다 · 로컬 시뮬레이션입니다.',fail?'error':'success');};timer=setTimeout(finish,900);};listen(root,'click',e=>{const action=e.target.closest('[data-action]')?.dataset.action;if(action==='save')run(false);if(action==='fail')run(true);if(action==='bookmark'||action==='follow'){state[action]=!state[action];render();message(`${action==='bookmark'?'북마크':'팔로우'}를 ${state[action]?'선택':'해제'}했습니다.`);}});reset=()=>{stop();state={status:'idle',bookmark:false,follow:false};render();message('버튼 상태는 로컬 시뮬레이션입니다.');};replay=()=>run(false);
    resumeRestored=()=>{if(state.status==='loading'){run(!!state.pendingFail);return true;}return false;};
    announceRestored=()=>{if(state.status==='success')message('변경 사항을 저장했습니다 · 로컬 시뮬레이션입니다.','success');else if(state.status==='error')message('저장에 실패했습니다. 다시 시도할 수 있습니다.','error');else message('버튼 상태는 로컬 시뮬레이션입니다.');};render();
  }
  if(item.id==='dark-ai--prompt'){
    state={name:'',email:'',consent:false,status:'idle',errors:{}};const form=$('[data-form]');
    render=()=>{if($('[data-name]').value!==state.name)$('[data-name]').value=state.name;if($('[data-email]').value!==state.email)$('[data-email]').value=state.email;$('[data-consent]').checked=state.consent;for(const key of ['name','email','consent']){const el=$(`[data-error=${key}]`);el.textContent=state.errors[key]||'';const field=$(`[data-${key}]`);field?.setAttribute('aria-invalid',String(!!state.errors[key]));}$('[data-submit]').disabled=state.status==='pending';$('[data-submit]').textContent=state.status==='pending'?'처리 중…':state.status==='success'?'구독 신청 완료 ✓':'구독 신청';};
    const beginPending=()=>{stop();state.status='pending';render();message('구독 신청을 확인하는 중…');const id=serial;const name=state.name.trim();const finish=()=>{if(id!==serial)return;if(suspended||helpers.active?.()===false){timer=setTimeout(finish,100);return;}state.status='success';render();message(`${name}님, 구독 신청이 완료되었습니다 · 실제 이메일 발송 없음.`,'success');};timer=setTimeout(finish,900);};
    const values=()=>{state.name=$('[data-name]').value;state.email=$('[data-email]').value;state.consent=$('[data-consent]').checked;};listen(form,'input',()=>{values();state.errors={};if(state.status==='success')state.status='idle';render();});listen(form,'change',()=>{values();render();});listen(form,'submit',e=>{e.preventDefault();values();const name=state.name.trim(),email=state.email.trim();state.errors={};if(name.length<2||name.length>30)state.errors.name='이름을 2–30자로 입력해 주세요.';if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))state.errors.email='올바른 이메일 주소를 입력해 주세요.';if(!state.consent)state.errors.consent='이메일 수신 동의가 필요합니다.';if(Object.keys(state.errors).length){state.status='idle';render();message('입력 내용을 확인해 주세요.','error');form.querySelector('[aria-invalid=true]')?.focus();return;}beginPending();});listen(form,'reset',e=>{e.preventDefault();reset();});reset=()=>{stop();state={name:'',email:'',consent:false,status:'idle',errors:{}};render();message('실제 이메일은 발송되지 않습니다.');};replay=()=>{$('[data-name]').focus();};resumeRestored=()=>{if(state.status==='pending'){beginPending();return true;}return false;};announceRestored=()=>{if(state.status==='success')message(`${state.name.trim()}님, 구독 신청이 완료되었습니다 · 실제 이메일 발송 없음.`,'success');else if(Object.keys(state.errors||{}).length)message('입력 내용을 확인해 주세요.','error');else message('실제 이메일은 발송되지 않습니다.');};render();
  }
  if(item.id==='light-project--quick-add'){
    state={tags:['디자인','UI'],draft:'',error:''};const input=$('[data-tag-input]');
    render=()=>{const chips=$('[data-chips]'),preview=$('[data-preview]');chips.innerHTML='';preview.innerHTML='';state.tags.forEach((tag,i)=>{const chip=document.createElement('span');chip.className='si-chip';const label=document.createElement('span');label.textContent=tag;const remove=document.createElement('button');remove.type='button';remove.dataset.remove=String(i);remove.setAttribute('aria-label',`${tag} 태그 삭제`);remove.textContent='×';chip.append(label,remove);chips.append(chip);const p=document.createElement('span');p.textContent='#'+tag;preview.append(p);});$('[data-count]').textContent=`${state.tags.length} / 6`;input.value=state.draft;input.setAttribute('aria-invalid',String(!!state.error));input.placeholder=state.tags.length>=6?'태그 최대 6개':'태그 입력 후 Enter';$$('[data-suggest]').forEach(b=>{b.disabled=state.tags.includes(b.dataset.suggest)||state.tags.length>=6;});if(state.error)message(state.error,'error');};
    const add=value=>{const tag=value.trim().replace(/^#/,'');if(!tag){state.error='태그를 입력해 주세요.';render();return;}if(tag.length>20){state.error='태그는 20자 이하여야 합니다.';render();return;}if(state.tags.some(x=>x.toLocaleLowerCase()===tag.toLocaleLowerCase())){state.error='이미 추가된 태그입니다.';render();return;}if(state.tags.length>=6){state.error='태그는 최대 6개까지 추가할 수 있습니다.';render();return;}state.tags.push(tag);state.draft='';state.error='';render();message(`${tag} 태그를 추가했습니다.`,'success');animate($('[data-chips] .si-chip:last-child'),[{opacity:0,transform:'scale(.85)'},{opacity:1,transform:'scale(1)'}],180);};listen(input,'input',()=>{state.draft=input.value;state.error='';input.setAttribute('aria-invalid','false');});listen(input,'keydown',e=>{if(e.key==='Enter'||e.key===','){e.preventDefault();add(input.value.replace(/,$/,''));}if(e.key==='Backspace'&&!input.value&&state.tags.length){state.tags.pop();render();message('마지막 태그를 삭제했습니다.');}});listen(root,'click',e=>{const remove=e.target.closest('[data-remove]');if(remove){const [tag]=state.tags.splice(Number(remove.dataset.remove),1);render();message(`${tag} 태그를 삭제했습니다.`);input.focus();}const suggest=e.target.closest('[data-suggest]');if(suggest)add(suggest.dataset.suggest);});reset=()=>{state={tags:['디자인','UI'],draft:'',error:''};render();message('최대 6개까지 추가할 수 있습니다.');};replay=()=>{input.focus();};render();
  }
  return {reset,replay,suspend(){suspended=true;},continue(){suspended=false;},snapshot(){return JSON.parse(JSON.stringify(state));},restore(saved){if(!saved)return;stop();state=JSON.parse(JSON.stringify(saved));render();if(!resumeRestored())announceRestored();},destroy(){stop();cleanups.forEach(fn=>fn());}};
}

export function inputsCSS(){return `
/* Shared controls inherit the active concept tokens from the demo runtime. */
.site-study{display:flex;flex-direction:column;min-width:0;min-height:0;padding:var(--space-6,24px);background:var(--surface);color:var(--ink);font:400 14px/1.55 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",sans-serif;word-break:keep-all;overflow-wrap:anywhere}
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
.site-study .si-message[data-tone=error],.site-study .si-inline-error:not(:empty),.site-study .si-form-fields small:not(:empty){color:var(--error)}
.site-study .si-link{min-height:44px;padding:8px 0;border:0;background:transparent;color:var(--accent);font-size:12px;font-weight:650;text-decoration:underline;text-underline-offset:3px}
.site-study :is(.si-solid,.si-outline,.si-toggle){display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2,8px);min-height:44px;padding:9px var(--space-4,16px);border:1px solid var(--line);border-radius:var(--control-radius,0);font-size:13px;font-weight:700;line-height:1.4;text-align:center;transition:background-color 150ms ease-out,border-color 150ms ease-out,transform 140ms ease-out}
.site-study :is(.si-solid,.si-outline,.si-toggle):active:not(:disabled){transform:translateY(1px)}
.site-study .si-solid{border-color:var(--accent);background:var(--accent);color:var(--surface)}
.site-study .si-solid:not(:disabled):hover{border-color:var(--ink);background:var(--ink)}
.site-study :is(.si-outline,.si-toggle){background:var(--surface);color:var(--ink)}
.site-study :is(.si-outline,.si-toggle):not(:disabled):hover{border-color:var(--ink)}
.site-study .si-toggle[aria-pressed=true]{border-color:var(--accent);background:var(--concept-paper);color:var(--ink)}

/* Frame: a flat upload work area with one clear drop target. */
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

/* Paper: project actions stay close to their project and list. */
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

/* Frame: settings read as a continuous tool panel, not cards within cards. */
.study-controls .si-workspace{gap:0}
.study-controls .si-utility-heading{margin-bottom:var(--space-4,16px)}
.study-controls .si-tabbar{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-bottom:1px solid var(--line)}
.study-controls .si-tabbar button{min-height:44px;padding:10px var(--space-2,8px);border:0;border-bottom:2px solid transparent;background:transparent;color:var(--muted);font-size:13px;font-weight:600}
.study-controls .si-tabbar button[aria-selected=true]{border-bottom-color:var(--accent);color:var(--accent);font-weight:750}
.study-controls .si-settings-pane{display:grid;gap:var(--space-4,16px);padding:var(--space-6,24px) 0}
.study-controls .si-setting-top{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-3,12px)}
.study-controls .si-setting-top h4{margin:var(--space-1,4px) 0 0;font-size:21px;font-weight:720;line-height:1.25;letter-spacing:-.04em}
.study-controls .si-setting-glyph{display:grid;place-items:center;flex:none;width:36px;height:36px;color:var(--accent)}
.study-controls .si-setting-row{display:flex;align-items:center;justify-content:space-between;gap:var(--space-4,16px);min-height:64px;padding:var(--space-3,12px) 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);cursor:pointer}
.study-controls .si-setting-row>span{min-width:0}
.study-controls .si-setting-row :is(strong,small){display:block}
.study-controls .si-setting-row strong{font-size:13px;font-weight:700}
.study-controls .si-setting-row small{margin-top:2px;font-size:11px;line-height:1.45;color:var(--muted)}
.study-controls .si-setting-row input{position:absolute;opacity:0}
.study-controls .si-setting-row i{position:relative;flex:none;width:40px;height:24px;border-radius:20px;background:var(--line);transition:background .18s}
.study-controls .si-setting-row i:after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:var(--surface);box-shadow:0 1px 3px color-mix(in srgb,var(--ink) 20%,transparent);transition:transform .18s}
.study-controls .si-setting-row input:checked+i{background:var(--accent)}
.study-controls .si-setting-row input:checked+i:after{transform:translateX(16px)}
.study-controls .si-setting-row input:focus-visible+i{outline:3px solid var(--focus);outline-offset:3px}
.study-controls .si-settings-foot{display:flex;align-items:center;justify-content:space-between;gap:var(--space-4,16px);padding:var(--space-4,16px) 0}
.study-controls .si-settings-foot span{font-size:11px;color:var(--muted)}

/* Object: collection actions use a warm surface and compact purchase controls. */
.study-beam{background:var(--concept-paper)}
.study-beam .si-workspace{gap:0;overflow:hidden;border:1px solid var(--line);border-radius:var(--control-radius,14px)}
.study-beam .si-object-edition{display:flex;align-items:center;justify-content:space-between;gap:var(--space-3,12px);padding:var(--space-3,12px) var(--space-6,24px);background:var(--accent);color:var(--surface);font-size:11px;font-weight:650}
.study-beam .si-save-panel{display:flex;align-items:center;justify-content:space-between;gap:var(--space-4,16px);margin:0 var(--space-6,24px);padding:var(--space-6,24px) 0 var(--space-4,16px);border-bottom:1px solid var(--line)}
.study-beam .si-save-panel>div{display:flex;flex-direction:column;gap:var(--space-1,4px)}
.study-beam .si-save-panel strong{font-size:24px;font-weight:660;line-height:1.25;letter-spacing:-.045em}
.study-beam .si-save-indicator{flex:none;padding:6px 10px;border-radius:999px;background:var(--concept-paper);color:var(--muted);font-size:11px}
.study-beam .si-save-indicator[data-status=success]{color:var(--success)}
.study-beam .si-save-indicator[data-status=error]{color:var(--error)}
.study-beam .si-action-row{display:flex;flex-wrap:wrap;gap:var(--space-2,8px);padding:var(--space-4,16px) var(--space-6,24px)}
.study-beam .si-action-row .si-solid{min-width:155px}
.study-beam .si-action-row :is(.si-solid,.si-outline),.study-beam .si-secondary-actions .si-toggle{border-radius:var(--control-radius)}
.study-beam .si-divider{height:1px;margin:0 var(--space-6,24px);background:var(--line)}
.study-beam .si-actions-label{display:block;padding:var(--space-4,16px) var(--space-6,24px) var(--space-2,8px);color:var(--muted);font-size:11px;font-weight:700}
.study-beam .si-secondary-actions{display:flex;flex-wrap:wrap;gap:var(--space-2,8px);padding:0 var(--space-6,24px) var(--space-4,16px)}
.study-beam .si-secondary-actions .si-toggle{flex:1;min-width:100px}
.study-beam .si-secondary-actions .si-toggle:disabled{border-style:dashed}
.study-beam .si-message{margin:0;padding:var(--space-3,12px) var(--space-6,24px);background:var(--concept-paper)}

/* Paper: an actual issue excerpt sits beside its subscription form. */
.study-prompt .si-workspace{gap:0}
.study-prompt .si-publication-masthead{display:flex;align-items:baseline;justify-content:space-between;gap:var(--space-4,16px);padding-bottom:var(--space-4,16px);border-bottom:1px solid var(--ink);font-size:11px;line-height:1.4;color:var(--muted)}
.study-prompt .si-publication-masthead span:first-child{font-size:17px;font-weight:780;letter-spacing:-.045em;color:var(--ink)}
.study-prompt .si-signup-layout{display:grid;grid-template-columns:minmax(0,1.18fr) minmax(0,1fr);min-width:0}
.study-prompt .si-editorial{display:flex;flex-direction:column;align-items:flex-start;min-width:0;padding:var(--space-6,24px) var(--space-6,24px) var(--space-4,16px) 0}
.study-prompt .si-editorial-meta{display:flex;align-items:center;justify-content:space-between;gap:var(--space-3,12px);width:100%;font-size:11px;line-height:1.5;color:var(--muted)}
.study-prompt .si-editorial-meta span:first-child{color:var(--accent);font-weight:700}
.study-prompt .si-editorial h4{margin:var(--space-4,16px) 0 var(--space-3,12px);font-size:clamp(28px,3.3vw,34px);font-weight:760;line-height:1.2;letter-spacing:-.06em;color:var(--ink)}
.study-prompt .si-editorial p{max-width:45ch;margin:0 0 var(--space-3,12px);font-size:14px;line-height:1.72;color:var(--muted)}
.study-prompt .si-editorial .si-editorial-lead{font-size:15px;line-height:1.65;font-weight:600;color:var(--ink)}
.study-prompt .si-subscribe-panel{display:flex;flex-direction:column;min-width:0;padding:var(--space-6,24px) 0 var(--space-4,16px) var(--space-6,24px);border-left:1px solid var(--line)}
.study-prompt .si-subscribe-heading{display:flex;flex-direction:column;gap:var(--space-2,8px);padding-bottom:var(--space-4,16px)}
.study-prompt .si-subscribe-heading>span{font-size:11px;font-weight:700;color:var(--accent)}
.study-prompt .si-subscribe-heading strong{max-width:15ch;font-size:20px;font-weight:720;line-height:1.35;letter-spacing:-.045em;color:var(--ink)}
.study-prompt .si-form-fields{display:grid;grid-template-columns:1fr;gap:var(--space-3,12px)}
.study-prompt .si-form-fields label{display:flex;flex-direction:column;gap:var(--space-1,4px);font-size:13px;font-weight:650;color:var(--ink)}
.site-study.study-prompt .si-form-fields input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]){width:100%;min-height:44px;padding:9px 0;border:0;border-bottom:1px solid var(--line);border-radius:0;background:var(--surface);color:var(--ink);font-size:14px;line-height:1.5}
.study-prompt .si-form-fields input::placeholder{color:var(--muted);opacity:.8}
.site-study.study-prompt .si-form-fields input[aria-invalid=true]{border-bottom-color:var(--error)}
.site-study.study-prompt .si-form-fields input:focus{border-bottom-color:var(--accent)}
.site-study.study-prompt .si-form-fields input:focus-visible{outline:3px solid var(--focus);outline-offset:3px}
.study-prompt .si-form-fields small:not(:empty),.study-prompt .si-inline-error:not(:empty){font-size:11px;line-height:1.5}
.study-prompt .si-consent{display:flex;align-items:flex-start;gap:var(--space-2,8px);margin-top:var(--space-4,16px);font-size:12px;line-height:1.6;color:var(--muted)}
.study-prompt .si-consent input{flex:none;width:18px;height:18px;margin:1px 0 0;accent-color:var(--accent)}
.study-prompt .si-inline-error{margin:0}
.study-prompt .si-form-actions{display:flex;align-items:center;gap:var(--space-4,16px);margin-top:var(--space-4,16px)}
.study-prompt .si-form-actions .si-solid{flex:none;min-height:44px;padding:10px var(--space-6,24px)}
.study-prompt .si-form-actions .si-link{flex:none;color:var(--muted)}

/* Paper: tags are edited on one side and previewed on the other. */
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

@container (max-width:650px){
  .site-study{padding:var(--space-4,16px)}
  .study-prompt .si-signup-layout,.study-quick-add .si-workspace{grid-template-columns:1fr}
  .study-prompt .si-editorial{padding:var(--space-6,24px) 0}
  .study-prompt .si-editorial h4{font-size:28px}
  .study-prompt .si-subscribe-panel{padding:var(--space-6,24px) 0;border-left:0;border-top:1px solid var(--line)}
  .study-prompt .si-subscribe-heading strong{max-width:none}
  .study-quick-add .si-chip-editor,.study-quick-add .si-tag-hint,.study-quick-add .si-suggestions,.study-quick-add .si-tag-preview{grid-column:1;grid-row:auto}
  .study-quick-add .si-tag-preview{padding:var(--space-4,16px) 0;border-left:0;border-top:1px solid var(--line)}
}
@container (max-width:390px){
  .study-controls .si-settings-foot{align-items:stretch;flex-direction:column}
  .study-controls .si-settings-foot .si-solid{width:100%}
  .study-beam .si-save-panel{align-items:flex-start;flex-direction:column}
  .study-beam .si-action-row{flex-direction:column}
  .study-beam .si-action-row button{width:100%}
  .study-prompt .si-publication-masthead{align-items:flex-start;flex-direction:column;gap:var(--space-1,4px)}
}
@media(prefers-reduced-motion:reduce){.site-study *{transition-duration:0s!important;animation-duration:0s!important}}
`;}
