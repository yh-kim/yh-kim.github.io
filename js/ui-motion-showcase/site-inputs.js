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
      <div class="si-settings-pane" role="tabpanel" data-panel><div class="si-setting-top"><div><span class="si-overline" data-pane-index>01 / ACCOUNT</span><h4 data-pane-title>계정 환경</h4></div><span class="si-setting-glyph" aria-hidden="true" data-pane-glyph>${icon('account')}</span></div><label class="si-setting-row"><span><strong data-setting-label>프로필 공개</strong><small data-setting-copy>내 프로필을 팀원에게 표시합니다.</small></span><input type="checkbox" data-setting checked><i aria-hidden="true"></i></label></div>
      <div class="si-settings-foot"><span data-save-state>저장된 상태입니다.</span><button class="si-solid" type="button" data-save>변경 사항 저장</button></div><p class="si-message" data-message role="status">설정 변경은 이 화면에만 적용됩니다.</p></div></section>`;
    case 'dark-ai--beam': return `<section class="site-study study-beam si-actions">
      <div class="si-workspace"><div class="si-object-edition"><span>내 컬렉션</span><span>상품 보관함</span></div><div class="si-save-panel"><div><span class="si-overline">상품 선택</span><strong>보관함에 담은 물건</strong></div><span class="si-save-indicator" data-save-indicator>저장 전</span></div>
      <div class="si-action-row"><button type="button" class="si-solid si-save-button" data-action="save">변경 사항 저장</button><button type="button" class="si-outline" data-action="fail">오류 상태 보기</button></div>
      <div class="si-divider"></div><span class="si-actions-label">빠른 작업</span><div class="si-secondary-actions"><button type="button" class="si-toggle" data-action="bookmark" aria-pressed="false">${icon('star')} 북마크</button><button type="button" class="si-toggle" data-action="follow" aria-pressed="false">${icon('plus')} 팔로우</button><button type="button" class="si-toggle" disabled aria-disabled="true">권한 없음</button></div><p class="si-message" data-message role="status">버튼 상태는 로컬 시뮬레이션입니다.</p></div></section>`;
    case 'dark-ai--prompt': return `<section class="site-study study-prompt si-signup">
      <form class="si-workspace si-signup-form" data-form novalidate><div class="si-publication-masthead"><span>디자인 노트</span><span>격주 수요일 발행</span></div><div class="si-form-top"><div><strong>다음 호를 받아보세요</strong></div></div>
      <div class="si-form-fields"><label>이름<input data-name type="text" name="name" autocomplete="name" aria-label="이름" aria-describedby="si-name-error" placeholder="홍길동" maxlength="30" required><small id="si-name-error" data-error="name"></small></label><label>이메일<input data-email type="email" name="email" autocomplete="email" aria-label="이메일" aria-describedby="si-email-error" placeholder="hello@example.com" required><small id="si-email-error" data-error="email"></small></label></div>
      <label class="si-consent"><input data-consent type="checkbox" aria-label="이메일 수신 동의" aria-describedby="si-consent-error" required><span>이메일 수신에 동의합니다. 언제든 구독을 취소할 수 있습니다.</span></label><p class="si-inline-error" id="si-consent-error" data-error="consent"></p><div class="si-form-actions"><button class="si-solid" type="submit" data-submit>구독 신청</button><button class="si-link" type="reset">초기화</button></div><p class="si-message" data-message role="status">실제 이메일은 발송되지 않습니다.</p></form></section>`;
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
  const message=(value,tone='')=>{const el=$('[data-message]');if(el){el.textContent=value;el.dataset.tone=tone;}if(helpers.say)helpers.say(value);};
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
    const tabs=['account','notify','security'];const content={account:['01 / ACCOUNT','계정 환경','프로필에 표시할 설정을 선택하세요.','프로필 공개','내 프로필을 팀원에게 표시합니다.','account'],notify:['02 / NOTIFICATIONS','알림 관리','업데이트를 받을 방법을 선택하세요.','이메일 알림','중요한 활동을 이메일로 받습니다.','notify'],security:['03 / SECURITY','보안 설정','계정 접근을 안전하게 관리하세요.','로그인 알림','새 기기의 로그인을 알려드립니다.','security']};state={tab:'account',values:{account:true,notify:false,security:true},saved:{account:true,notify:false,security:true}};
    render=()=>{const d=content[state.tab];$$('[data-tab]').forEach(b=>{const active=b.dataset.tab===state.tab;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});$('[data-pane-index]').textContent=d[0];$('[data-pane-title]').textContent=d[1];$('[data-setting-label]').textContent=d[3];$('[data-setting-copy]').textContent=d[4];$('[data-pane-glyph]').innerHTML=wireIcon(d[5]);$('[data-setting]').checked=state.values[state.tab];const dirty=tabs.some(k=>state.values[k]!==state.saved[k]);$('[data-save-state]').textContent=dirty?'저장되지 않은 변경 사항':'저장된 상태입니다.';$('[data-save]').textContent=dirty?'변경 사항 저장':'저장됨 ✓';};
    listen(root,'click',e=>{const tab=e.target.closest('[data-tab]');if(tab){state.tab=tab.dataset.tab;render();animate($('[data-panel]'),[{opacity:.45,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}]);}if(e.target.closest('[data-save]')){const dirty=tabs.some(k=>state.values[k]!==state.saved[k]);if(dirty){state.saved={...state.values};render();message('설정을 저장했습니다 · 이 화면에서만 유지됩니다.','success');}else message('이미 저장된 상태입니다.','success');}});listen(root,'change',e=>{if(e.target.matches('[data-setting]')){state.values[state.tab]=e.target.checked;render();message('변경 사항을 저장해 주세요.');}});listen($('[role=tablist]'),'keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const i=tabs.indexOf(state.tab);state.tab=tabs[e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3];render();$(`[data-tab=${state.tab}]`).focus();});reset=()=>{state={tab:'account',values:{account:true,notify:false,security:true},saved:{account:true,notify:false,security:true}};render();message('설정 변경은 이 화면에만 적용됩니다.');};replay=()=>{$('[data-tab=notify]').click();};render();
  }
  if(item.id==='dark-ai--beam'){
    state={status:'idle',bookmark:false,follow:false};const save=$('[data-action=save]');
    render=()=>{save.disabled=state.status==='loading';save.textContent=state.status==='loading'?'저장 중…':state.status==='error'?'다시 시도':state.status==='success'?'저장됨 ✓':'변경 사항 저장';$('[data-save-indicator]').textContent={idle:'저장 전',loading:'처리 중',success:'저장 완료',error:'저장 실패'}[state.status];$('[data-save-indicator]').dataset.status=state.status;for(const key of ['bookmark','follow']){const b=$(`[data-action=${key}]`);b.setAttribute('aria-pressed',String(state[key]));b.innerHTML=wireIcon(key==='bookmark'?'star':state[key]?'check':'plus')+' '+(key==='bookmark'?'북마크':'팔로우');}};
    const run=fail=>{stop();state.status='loading';state.pendingFail=!!fail;render();message('저장 상태를 확인하는 중…');const id=serial;const finish=()=>{if(id!==serial)return;if(suspended||helpers.active?.()===false){timer=setTimeout(finish,100);return;}state.status=fail?'error':'success';render();message(fail?'저장에 실패했습니다. 다시 시도할 수 있습니다.':'변경 사항을 저장했습니다 · 로컬 시뮬레이션입니다.',fail?'error':'success');};timer=setTimeout(finish,900);};listen(root,'click',e=>{const action=e.target.closest('[data-action]')?.dataset.action;if(action==='save')run(false);if(action==='fail')run(true);if(action==='bookmark'||action==='follow'){state[action]=!state[action];render();message(`${action==='bookmark'?'북마크':'팔로우'} ${state[action]?'선택':'해제'}했습니다.`);}});reset=()=>{stop();state={status:'idle',bookmark:false,follow:false};render();message('버튼 상태는 로컬 시뮬레이션입니다.');};replay=()=>run(false);
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
    const add=value=>{const tag=value.trim().replace(/^#/,'');if(!tag){state.error='태그를 입력해 주세요.';render();return;}if(tag.length>20){state.error='태그는 20자 이하여야 합니다.';render();return;}if(state.tags.some(x=>x.toLocaleLowerCase()===tag.toLocaleLowerCase())){state.error='이미 추가된 태그입니다.';render();return;}if(state.tags.length>=6){state.error='태그는 최대 6개까지 추가할 수 있습니다.';render();return;}state.tags.push(tag);state.draft='';state.error='';render();message(`${tag} 태그를 추가했습니다.`,'success');animate($('[data-chips] .si-chip:last-child'),[{opacity:0,transform:'scale(.85)'},{opacity:1,transform:'scale(1)'}]);};listen(input,'input',()=>{state.draft=input.value;state.error='';input.setAttribute('aria-invalid','false');});listen(input,'keydown',e=>{if(e.key==='Enter'||e.key===','){e.preventDefault();add(input.value.replace(/,$/,''));}if(e.key==='Backspace'&&!input.value&&state.tags.length){state.tags.pop();render();message('마지막 태그를 삭제했습니다.');}});listen(root,'click',e=>{const remove=e.target.closest('[data-remove]');if(remove){const [tag]=state.tags.splice(Number(remove.dataset.remove),1);render();message(`${tag} 태그를 삭제했습니다.`);input.focus();}const suggest=e.target.closest('[data-suggest]');if(suggest)add(suggest.dataset.suggest);});reset=()=>{state={tags:['디자인','UI'],draft:'',error:''};render();message('최대 6개까지 추가할 수 있습니다.');};replay=()=>{input.focus();};render();
  }
  return {reset,replay,suspend(){suspended=true;},continue(){suspended=false;},snapshot(){return JSON.parse(JSON.stringify(state));},restore(saved){if(!saved)return;stop();state=JSON.parse(JSON.stringify(saved));render();if(!resumeRestored())announceRestored();},destroy(){stop();cleanups.forEach(fn=>fn());}};
}

export function inputsCSS(){return `
.site-study{--si-ink:#191c22;--si-muted:#67717e;--si-line:#e1e5eb;--si-accent:#4d55d9;color:var(--si-ink);font:14px/1.45 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;display:flex;flex-direction:column;gap:17px;min-height:0;padding:22px;box-sizing:border-box;background:#f8f9fb}.site-study *{box-sizing:border-box}.site-study button,.site-study input{font:inherit}.site-study button{cursor:pointer}.site-study button:disabled{cursor:not-allowed;opacity:.52}.site-study :is(button,input,label):focus-visible{outline:3px solid #737bf0;outline-offset:2px}.site-study [hidden]{display:none!important}.si-head{display:grid;gap:4px}.si-eyebrow,.si-overline{font-size:11px;font-weight:750;letter-spacing:.12em;color:#666dbe}.si-head h3{font-size:21px;line-height:1.2;letter-spacing:-.05em;margin:0}.si-head p{font-size:12px;color:var(--si-muted);margin:0}.si-workspace{background:white;border:1px solid var(--si-line);border-radius:14px;padding:19px;box-shadow:0 14px 30px -28px #263553;display:flex;flex-direction:column;gap:14px;min-width:0}.si-message{font-size:12px;color:var(--si-muted);min-height:18px;margin:0}.si-message[data-tone=success]{color:#216b55}.si-message[data-tone=error],.si-inline-error,.si-form-fields small{color:#bd4052}.si-link{border:0;background:none;color:#444dc3;font-size:12px;font-weight:700;min-height:44px;padding:8px 0}.si-solid,.si-outline,.si-toggle{min-height:44px;border-radius:9px;padding:10px 14px;font-size:13px;font-weight:700}.si-solid{background:#343cc1;color:white;border:1px solid #343cc1;box-shadow:0 5px 12px #4d55d91e}.si-solid:not(:disabled):hover{background:#252da8}.si-outline{background:white;color:#303751;border:1px solid #d5dae4}.si-toggle{background:white;color:#3d4658;border:1px solid #dce1e9}.si-toggle[aria-pressed=true]{color:#343cc1;border-color:#aeb4ed;background:#f5f5ff}.si-upload .si-drop{border:1.5px dashed #aeb7d2;border-radius:11px;background:#f8f9ff;min-height:132px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;text-align:center;cursor:pointer;position:relative;padding:15px}.si-drop[data-over=true]{background:#eceeff;border-color:#5059ce}.si-drop input{position:absolute;inset:0;opacity:0;width:100%;height:100%;cursor:pointer}.si-drop strong{font-size:14px}.si-drop>span:last-of-type{font-size:12px;color:#707a8b}.si-upload-glyph,.si-mail-glyph{display:grid;place-items:center;width:35px;height:35px;background:#e9eaff;color:#4d55d9;border-radius:9px;font-weight:800;font-size:20px}.si-upload-inline{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:12px;color:var(--si-muted)}.si-queue{border-top:1px solid var(--si-line);padding-top:15px;min-height:81px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center}.si-empty-icon{color:#9aa4b3;font-size:20px}.si-queue>strong{font-size:12px}.si-queue>small{font-size:11px;color:var(--si-muted)}.si-file-row{width:100%;display:flex;align-items:center;gap:10px;text-align:left}.si-file-icon{flex:none;border-radius:6px;background:#edf0fc;color:#4c54c6;font:700 10px ui-monospace,monospace;padding:11px 6px}.si-file-meta{min-width:0;flex:1}.si-file-meta strong,.si-file-meta small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.si-file-meta strong{font-size:12px}.si-file-meta small{font-size:11px;color:var(--si-muted)}.si-file-row button{border:0;background:none;color:#4048b8;font-size:12px;min-height:44px}.si-progress{width:100%;height:5px;background:#e9ebf4;border-radius:9px;overflow:hidden;margin-top:9px}.si-progress span{display:block;width:100%;height:100%;background:#4d55d9;transform-origin:left;transition:transform .13s linear}.si-progress-caption{width:100%;display:flex;justify-content:space-between;font-size:11px;color:var(--si-muted)}
.si-project-head{display:flex;align-items:center;gap:12px;padding:3px 0 13px;border-bottom:1px solid var(--si-line)}.si-project-mark{display:grid;place-items:center;width:42px;height:42px;border-radius:10px;background:#202840;color:white;font:800 20px Georgia,serif}.si-project-head>div{flex:1;display:flex;flex-direction:column;min-width:0}.si-project-head strong{font-size:16px;letter-spacing:-.03em}.si-project-head small{font-size:11px;color:var(--si-muted)}.si-menu-trigger{min-width:44px;height:44px;border:1px solid var(--si-line);border-radius:9px;background:white;font-size:20px;line-height:1}.si-menu .si-workspace{position:relative}.si-action-menu{position:absolute;z-index:5;right:18px;top:72px;width:min(260px,calc(100% - 36px));background:white;border:1px solid #dce1e8;border-radius:12px;box-shadow:0 18px 38px #20283a22;padding:6px}.si-action-menu button{display:flex;align-items:center;gap:10px;width:100%;border:0;background:white;border-radius:7px;text-align:left;min-height:49px;padding:6px 9px}.si-action-menu button:hover,.si-action-menu button:focus-visible{background:#f2f3fb}.si-action-menu button>span:first-child{color:#5b63ce;font-size:18px;width:23px;text-align:center}.si-action-menu strong,.si-action-menu small{display:block}.si-action-menu strong{font-size:12px}.si-action-menu small{font-size:10px;color:var(--si-muted)}.si-menu-result{display:grid;gap:5px}.si-result-head{display:flex;justify-content:space-between;font-size:12px;color:var(--si-muted);margin-bottom:3px}.si-result-head b{color:#252a38}.si-project-row{display:flex;align-items:center;gap:8px;padding:8px 1px;border-bottom:1px solid #eef0f4;font-size:12px}.si-project-row:last-child{border:0}.si-project-row strong{flex:1}.si-project-row small{color:var(--si-muted)}.si-project-dot{width:7px;height:7px;border-radius:50%;background:#7d86b6}.si-project-row[data-active=true] .si-project-dot{background:#4d55d9}
.si-tabbar{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid var(--si-line);gap:3px}.si-tabbar button{border:0;background:none;min-height:44px;font-size:13px;color:#6b7483;border-bottom:2px solid transparent}.si-tabbar button[aria-selected=true]{color:#343cc1;font-weight:750;border-bottom-color:#4d55d9}.si-settings-pane{display:grid;gap:13px}.si-setting-top{display:flex;align-items:center;justify-content:space-between}.si-setting-top h4{font-size:17px;letter-spacing:-.035em;margin:3px 0 2px}.si-setting-top p{font-size:12px;color:var(--si-muted);margin:0}.si-setting-glyph{display:grid;place-items:center;width:42px;height:42px;border-radius:10px;background:#eef0fa;color:#5960bf;font-size:22px}.si-setting-row{border-top:1px solid var(--si-line);padding-top:12px;display:flex;align-items:center;justify-content:space-between;gap:12px;cursor:pointer;min-height:54px}.si-setting-row strong,.si-setting-row small{display:block}.si-setting-row strong{font-size:13px}.si-setting-row small{font-size:11px;color:var(--si-muted)}.si-setting-row input{position:absolute;opacity:0}.si-setting-row i{width:39px;height:23px;border-radius:20px;background:#c9cfda;position:relative;flex:none;transition:background .2s}.si-setting-row i:after{content:'';position:absolute;top:3px;left:3px;width:17px;height:17px;border-radius:50%;background:white;box-shadow:0 1px 4px #0002;transition:transform .2s}.si-setting-row input:checked+i{background:#4d55d9}.si-setting-row input:checked+i:after{transform:translateX(16px)}.si-setting-row input:focus-visible+i{outline:3px solid #737bf0;outline-offset:3px}.si-settings-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid var(--si-line);padding-top:12px}.si-settings-foot span{font-size:11px;color:var(--si-muted)}
.si-save-panel{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-bottom:12px;border-bottom:1px solid var(--si-line)}.si-save-panel>div{display:flex;flex-direction:column}.si-save-panel strong{font-size:17px;letter-spacing:-.03em}.si-save-panel small{font-size:11px;color:var(--si-muted)}.si-save-indicator{border-radius:6px;background:#f1f2f5;padding:5px 7px;font-size:11px;color:#737d8c;white-space:nowrap}.si-save-indicator[data-status=success]{background:#e8f5ee;color:#237553}.si-save-indicator[data-status=error]{background:#fff0f1;color:#b23f52}.si-action-row,.si-secondary-actions{display:flex;gap:8px;flex-wrap:wrap}.si-save-button{flex:1}.si-divider{border-top:1px solid var(--si-line)}.si-secondary-actions{margin-top:-2px}.si-secondary-actions .si-toggle{flex:1;min-width:100px}.si-secondary-actions .si-toggle:disabled{border-style:dashed}
.si-form-top{display:flex;gap:11px;align-items:center;padding-bottom:12px;border-bottom:1px solid var(--si-line)}.si-form-top>div{display:flex;flex-direction:column}.si-form-top strong{font-size:14px}.si-form-top small{font-size:11px;color:var(--si-muted)}.si-form-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px}.si-form-fields label{font-size:12px;font-weight:700;display:flex;flex-direction:column;gap:5px}.si-form-fields input,.si-chip-editor input{border:1px solid #d9dee7;border-radius:8px;background:white;color:var(--si-ink);min-height:44px;padding:9px 11px;width:100%;min-width:0}.si-form-fields input[aria-invalid=true]{border-color:#c84d5c}.si-form-fields small{font-size:11px;font-weight:400;min-height:0}.si-consent{display:flex;align-items:start;gap:8px;font-size:11px;color:#4e5766;cursor:pointer}.si-consent input{width:17px;height:17px;accent-color:#4d55d9;flex:none;margin:0}.si-inline-error{font-size:11px;min-height:0;margin:-10px 0 0}.si-form-actions{display:flex;align-items:center;gap:15px}.si-form-actions .si-solid{flex:1}
.si-tag-heading{display:flex;align-items:center;justify-content:space-between}.si-tag-heading h4{margin:3px 0 0;font-size:17px;letter-spacing:-.03em}.si-tag-heading>span{font-size:12px;color:var(--si-muted)}.si-chip-editor{border:1px solid #cbd2dd;border-radius:9px;padding:7px;min-height:90px;display:flex;flex-direction:column;gap:7px;cursor:text}.si-chips{display:flex;gap:6px;flex-wrap:wrap}.si-chip{display:inline-flex;align-items:center;gap:5px;background:#eef0fb;border-radius:6px;color:#343bb1;font-size:12px;font-weight:700;padding:3px 4px 3px 9px}.si-chip button{border:0;background:none;color:#5961af;min-width:44px;min-height:44px;font-size:16px}.site-study .si-chip-editor input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]){border:0;min-height:44px;padding:3px 4px;font-size:12px;outline:0}.si-chip-editor:focus-within{outline:3px solid #737bf0;outline-offset:2px}.si-tag-hint{font-size:11px;color:var(--si-muted);margin:-7px 0 0}.si-suggestions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.si-suggestions>span{font-size:11px;color:var(--si-muted)}.si-suggestions>div{display:flex;gap:5px;flex-wrap:wrap}.si-suggestions button{min-height:44px;background:white;border:1px solid #dfe3ea;border-radius:6px;color:#4b5571;font-size:11px;padding:4px 8px}.si-tag-preview{background:#f7f8fa;border-left:3px solid #777edf;padding:10px 12px;display:flex;flex-direction:column;gap:3px}.si-tag-preview>span{font-size:10px;color:var(--si-muted)}.si-tag-preview strong{font-size:13px}.si-tag-preview>div{display:flex;gap:7px;font-size:11px;color:#535cc6}
/* The gallery supplies the title; the usable component begins immediately. */
.site-study .si-head{display:none}.site-study{padding:18px;background:#fff}.si-workspace{border:0;border-radius:0;box-shadow:none;padding:0;background:transparent}.si-icon{display:inline-block;vertical-align:middle;flex:none}.si-menu-trigger{display:grid;place-items:center}.si-action-menu button>.si-icon{color:#5b63ce}.si-toggle{display:inline-flex;align-items:center;justify-content:center;gap:6px}.si-toggle[aria-pressed=true] .si-icon{fill:#d9dcfa}.si-empty-icon{display:grid;place-items:center}.si-solid{background:#454da4;border-color:#454da4;box-shadow:none}.si-solid:not(:disabled):hover{background:#353d91}.si-signup .si-solid{background:#252b38;border-color:#252b38}.si-actions .si-solid{background:#303b50;border-color:#303b50}.si-upload .si-drop{background:#f7f8fc}.si-menu .si-workspace{border-top:2px solid #e5e7ee;padding-top:10px}.si-settings .si-workspace{border-top:2px solid #e5e7ee}.si-tag-preview{background:#f7f8fa}
@container (max-width:390px){.site-study{padding:17px;gap:13px}.si-workspace{padding:0}.si-form-fields{grid-template-columns:1fr}.si-upload-inline{align-items:flex-start}.si-settings-foot{align-items:flex-start;flex-direction:column}.si-settings-foot .si-solid{width:100%}}@media(max-width:500px){.site-study{padding:17px}.si-workspace{padding:0}.si-form-fields{grid-template-columns:1fr}.si-action-row{flex-direction:column}.si-action-row button{width:100%}}
/* Purpose-built visual languages for the six complete controls. */
.site-study{gap:18px;padding:24px;line-height:1.5}
.site-study .si-workspace{gap:18px}
.site-study .si-message{font-size:11px;line-height:1.5;min-height:0;margin:0}
.site-study .si-overline{font-size:10px;letter-spacing:.14em;color:var(--si-accent)}
.site-study :is(button,input,label):focus-visible{outline-color:var(--si-accent);outline-offset:3px}
.site-study .si-icon{width:17px;height:17px}
.study-process,.study-controls{--si-ink:#172d44;--si-muted:#607289;--si-line:#cfd9e5;--si-accent:#3e62db;background:#edf2f7;color:var(--si-ink)}
.study-layers,.study-prompt,.study-quick-add{--si-ink:#302820;--si-muted:#786d5f;--si-line:#d6c8b5;--si-accent:#b54d36;background:#f6efe5;color:var(--si-ink)}
.study-beam{--si-ink:#183c32;--si-muted:#5c7065;--si-line:#bdc9b8;--si-accent:#235548;background:#eff2e8;color:var(--si-ink)}
.site-study .si-solid{background:var(--si-accent);border-color:var(--si-accent);color:#fff;border-radius:3px;box-shadow:none;font-size:12px}
.site-study .si-solid:not(:disabled):hover{background:var(--si-ink);border-color:var(--si-ink)}
.site-study .si-outline,.site-study .si-toggle{border-radius:3px;color:var(--si-ink);border-color:var(--si-line);background:transparent;font-size:12px}
.site-study .si-link{color:var(--si-accent);text-decoration:underline;text-underline-offset:3px}
.site-study .si-message[data-tone=success]{color:#17634b}
.site-study .si-message[data-tone=error],.site-study .si-inline-error,.site-study .si-form-fields small:not(:empty){color:#a63632}
.si-utility-heading{display:flex;flex-direction:column;gap:2px;padding-bottom:16px;border-bottom:1px solid var(--si-line)}
.si-utility-heading strong{font-size:21px;letter-spacing:-.045em;line-height:1.25}
.si-utility-heading small{font-size:12px;color:var(--si-muted)}
/* Frame: asset intake and settings have clear work rails. */
.study-process .si-workspace,.study-controls .si-workspace{background:#fff;border:1px solid var(--si-line);padding:24px;box-shadow:0 5px 22px #172d440b}
.study-process .si-drop{border:1.5px dashed #8ba6ca;background:#f4f7fb;border-radius:4px;min-height:162px;gap:7px}
.study-process .si-drop[data-over=true],.study-process .si-drop:focus-within{background:#e8efff;border-color:var(--si-accent)}
.study-process .si-drop strong{font-size:15px}
.study-process .si-drop>span:last-of-type{font-size:11px;color:var(--si-muted)}
.study-process .si-upload-glyph{width:42px;height:42px;border:1px solid #c3d1e9;background:#fff;border-radius:50%;color:var(--si-accent)}
.study-process .si-upload-inline{font-size:11px;border-bottom:1px solid var(--si-line);padding-bottom:10px}
.si-queue-wrap{display:grid;gap:9px}
.si-queue-title{display:flex;justify-content:space-between;gap:10px;align-items:center}
.si-queue-title strong{font-size:12px}
.si-queue-title span{font-size:10px;color:var(--si-muted)}
.study-process .si-queue{border:1px solid #e0e7ef;background:#fafcfe;padding:13px;min-height:90px}
.study-process .si-queue>strong{font-size:12px}
.study-process .si-queue>small{font-size:10px}
.study-process .si-file-icon{background:#e7edff;color:#314eb3;border-radius:2px}
.study-process .si-file-row button{color:var(--si-accent);text-decoration:underline;text-underline-offset:3px}
.study-process .si-progress{height:4px;border-radius:0;background:#dce5f5}
.study-process .si-progress span{background:var(--si-accent);border-radius:0}
.study-controls .si-workspace{gap:0}
.study-controls .si-utility-heading{margin-bottom:18px}
.study-controls .si-tabbar{gap:0;border-bottom:1px solid var(--si-line)}
.study-controls .si-tabbar button{font-size:12px;font-weight:650;transition:color .16s,border-color .16s}
.study-controls .si-tabbar button[aria-selected=true]{color:var(--si-accent);border-bottom-color:var(--si-accent)}
.study-controls .si-settings-pane{padding:21px 0 5px;gap:20px}
.study-controls .si-setting-top h4{font-size:20px}
.study-controls .si-setting-top p{line-height:1.6}
.study-controls .si-setting-glyph{background:#e9efff;color:var(--si-accent);border-radius:4px;width:45px;height:45px}
.study-controls .si-setting-row{border:1px solid #dce5ef;background:#f7f9fc;padding:13px 15px;min-height:69px}
.study-controls .si-setting-row input:checked+i{background:var(--si-accent)}
.study-controls .si-settings-foot{margin-top:20px;padding:17px 0 12px}
/* Paper: a project desk with a deliberate action menu. */
.study-layers .si-workspace{position:relative;background:#fffaf1;border:1px solid #d7cab9;box-shadow:7px 7px 0 #dfd4c2;padding:20px 22px 16px;gap:15px}
.si-project-context,.si-editor-bar,.si-publication-masthead,.si-object-edition{display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:10px;letter-spacing:.13em;font-weight:700}
.si-project-context{color:#766755;border-bottom:1px solid var(--si-line);padding-bottom:11px}
.study-layers .si-project-head{border:0;padding:2px 0 10px;align-items:flex-start}
.study-layers .si-project-mark{width:46px;height:46px;background:var(--si-ink);border-radius:0;font:700 26px Georgia,serif}
.study-layers .si-project-head strong{font:normal 25px/1.2 Georgia,"AppleMyungjo","Batang",serif;letter-spacing:-.035em;margin:3px 0}
.study-layers .si-project-head small{font-size:11px}
.study-layers .si-menu-trigger{background:transparent;border-color:var(--si-line);border-radius:50%;flex:none;color:var(--si-ink)}
.study-layers .si-menu-trigger[aria-expanded=true]{background:var(--si-ink);color:#fff}
.study-layers .si-action-menu{top:103px;right:21px;width:min(275px,calc(100% - 42px));border:1px solid #b8a891;border-radius:2px;box-shadow:7px 7px 0 #30282020;padding:7px;background:#fffaf1}
.study-layers .si-action-menu button{background:transparent;border-radius:0;border-bottom:1px solid #e8dfd3;min-height:58px;padding:7px 11px}
.study-layers .si-action-menu button:last-child{border-bottom:0}
.study-layers .si-action-menu button:hover,.study-layers .si-action-menu button:focus-visible{background:#f3e7d9}
.study-layers .si-action-menu button>.si-icon{color:var(--si-accent)}
.study-layers .si-action-menu strong{font-size:12px}
.study-layers .si-action-menu small{font-size:10px}
.study-layers .si-menu-result{border-top:2px solid var(--si-ink);padding-top:11px}
.study-layers .si-result-head{font-size:10px;letter-spacing:.08em}
.study-layers .si-project-row{font-size:11px;border-color:#e9e0d4}
.study-layers .si-project-dot{background:#a79883;border-radius:0}
.study-layers .si-project-row[data-active=true] .si-project-dot{background:var(--si-accent)}
/* Object: collection controls use product label and brass detail. */
.study-beam .si-workspace{background:#f8faf3;border:1px solid var(--si-line);padding:0;gap:0;box-shadow:7px 7px 0 #b9a26a36}
.si-object-edition{padding:10px 20px;background:#183c32;color:#ecf2e8;font-size:9px}
.study-beam .si-save-panel{margin:0 20px;padding:25px 0 22px;align-items:flex-start;border-color:var(--si-line)}
.study-beam .si-save-panel strong{font:normal 27px/1.22 Georgia,"AppleMyungjo","Batang",serif;letter-spacing:-.04em;margin:4px 0 7px}
.study-beam .si-save-panel small{font-size:11px;line-height:1.5}
.study-beam .si-save-indicator{background:#e7ece1;color:#426151;border-radius:0;font-size:10px;padding:6px 8px;margin-top:4px}
.study-beam .si-save-indicator[data-status=success]{background:#d5e8dc;color:#1a6147}
.study-beam .si-save-indicator[data-status=error]{background:#f9e4df;color:#a1322a}
.study-beam .si-action-row{padding:18px 20px;gap:9px}
.study-beam .si-action-row .si-solid{background:var(--si-ink);border-color:var(--si-ink)}
.study-beam .si-outline{background:#f8faf3;border-color:#91aa98}
.study-beam .si-divider{border-color:var(--si-line)}
.si-actions-label{color:#6a786a;font-size:9px;letter-spacing:.13em;font-weight:750;padding:17px 20px 8px}
.study-beam .si-secondary-actions{padding:0 20px 15px;gap:7px}
.study-beam .si-toggle{border-color:#aec0b0;background:transparent}
.study-beam .si-toggle[aria-pressed=true]{background:#dce7d9;border-color:#235548;color:#183c32}
.study-beam .si-toggle[aria-pressed=true] .si-icon{fill:#b9a26a}
.study-beam .si-message{padding:11px 20px;background:#e6ecdf;border-top:1px solid var(--si-line)}
/* Paper: the letter has a masthead and generous type. */
.study-prompt .si-workspace{background:#fffaf1;border:1px solid #d6c7b3;padding:0 25px 20px;gap:17px;box-shadow:7px 7px 0 #e0d5c4}
.si-publication-masthead{border-bottom:2px solid var(--si-ink);padding:15px 0 11px;font-family:Georgia,serif;font-size:10px;color:var(--si-ink)}
.si-publication-masthead span:first-child{font-size:13px;letter-spacing:.09em}
.study-prompt .si-form-top{padding:16px 0 21px;border-color:var(--si-line);align-items:flex-start;gap:16px}
.study-prompt .si-mail-glyph{width:37px;height:37px;border:1px solid var(--si-accent);border-radius:50%;background:transparent;color:var(--si-accent);flex:none}
.study-prompt .si-form-top>div{gap:4px}
.study-prompt .si-form-top strong{font:normal 32px/1.13 Georgia,"AppleMyungjo","Batang",serif;letter-spacing:-.045em;color:var(--si-ink)}
.study-prompt .si-form-top small{font-size:11px;line-height:1.6;margin-top:7px;max-width:260px}
.study-prompt .si-form-fields{gap:14px}
.study-prompt .si-form-fields label{font-size:11px;letter-spacing:.03em}
.study-prompt .si-form-fields input{border:0;border-bottom:1px solid #9d8c77;background:transparent;border-radius:0;padding:10px 1px;font-size:13px}
.study-prompt .si-form-fields input:focus{border-color:var(--si-accent);outline:0}
.study-prompt .si-form-fields input::placeholder{color:#968d83}
.study-prompt .si-consent{font-size:11px;line-height:1.5}
.study-prompt .si-consent input{accent-color:var(--si-accent)}
.study-prompt .si-form-actions{gap:20px}
.study-prompt .si-form-actions .si-solid{font-size:12px;background:var(--si-ink);border-color:var(--si-ink)}
.study-prompt .si-form-actions .si-solid:hover{background:var(--si-accent)}
/* Paper: article taxonomy is an editor, with the result always in view. */
.study-quick-add .si-workspace{background:#fffaf1;border:1px solid #d6c7b3;padding:20px 23px;gap:15px}
.si-editor-bar{border-bottom:1px solid var(--si-ink);padding-bottom:11px;color:#7d705e;font-size:9px}
.study-quick-add .si-tag-heading h4{font:normal 24px/1.25 Georgia,"AppleMyungjo","Batang",serif;letter-spacing:-.04em;margin-top:4px}
.study-quick-add .si-tag-heading>span{font-size:10px;color:#8a7b69}
.study-quick-add .si-chip-editor{border:1px solid #bda990;border-radius:0;background:#fffdf8;min-height:100px;padding:9px;gap:4px}
.study-quick-add .si-chip{background:#ead8c7;color:#633f32;border:1px solid #d1b69f;border-radius:0;padding:1px 2px 1px 9px;font-size:11px}
.study-quick-add .si-chip button{color:#734b3b}
.study-quick-add .si-chip-editor:focus-within{outline-color:var(--si-accent)}
.study-quick-add .si-tag-hint{font-size:10px;margin:-7px 0 0}
.study-quick-add .si-suggestions{align-items:flex-start}
.study-quick-add .si-suggestions>span{font-size:10px;min-width:50px;padding-top:11px}
.study-quick-add .si-suggestions button{background:transparent;border-color:#c9b7a0;border-radius:0;color:#794833}
.study-quick-add .si-suggestions button:not(:disabled):hover{background:#f1e5d5}
.study-quick-add .si-tag-preview{background:transparent;border-left:0;border-top:1px solid var(--si-ink);padding:14px 0 2px;gap:7px}
.study-quick-add .si-tag-preview>span{font-size:9px;letter-spacing:.15em}
.study-quick-add .si-tag-preview strong{font:normal 18px/1.35 Georgia,"AppleMyungjo","Batang",serif}
.study-quick-add .si-tag-preview>div{color:#a44834;flex-wrap:wrap}
@container (max-width:390px){
  .site-study{padding:14px}
  .study-process .si-workspace,.study-controls .si-workspace{padding:17px}
  .study-layers .si-workspace,.study-quick-add .si-workspace{padding:16px}
  .study-prompt .si-workspace{padding:0 17px 17px}
  .study-prompt .si-form-top strong{font-size:27px}
  .study-beam .si-save-panel{flex-wrap:wrap}
  .study-beam .si-action-row{flex-direction:column}
  .study-beam .si-action-row button{width:100%}
}
@media(max-width:500px){
  .site-study{padding:15px}
  .study-process .si-workspace,.study-controls .si-workspace{padding:17px}
  .study-layers .si-workspace,.study-quick-add .si-workspace{padding:16px}
  .study-prompt .si-workspace{padding:0 17px 17px}
  .study-prompt .si-form-top strong{font-size:27px}
  .study-beam .si-save-panel{flex-wrap:wrap}
}
@media(prefers-reduced-motion:reduce){.site-study *{transition-duration:0s!important;animation-duration:0s!important}}
.site-study.study-prompt .si-form-fields input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]){border:0;border-bottom:1px solid #9d8c77;background:transparent;border-radius:0;padding:10px 1px;font-size:13px;color:var(--si-ink)}
.site-study.study-prompt .si-form-fields input[aria-invalid=true]{border-bottom-color:#a63632}
.site-study.study-prompt .si-form-fields input:focus{border-bottom-color:var(--si-accent);outline:0}
/* Paper refinement: real editorial controls on one clean surface. */
.study-layers .si-workspace,.study-quick-add .si-workspace{background:#fff;border:0;box-shadow:none}
.study-prompt .si-workspace{background:#fff;border:0;box-shadow:none;padding:20px 24px 22px;gap:0}
.study-beam .si-workspace{box-shadow:none}
.study-layers .si-project-head strong{font:650 19px/1.3 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",sans-serif;letter-spacing:-.035em}
.study-layers .si-project-mark{width:42px;height:42px;font:700 20px/1 Georgia,serif;border-radius:3px}
.study-layers .si-action-menu{box-shadow:0 10px 28px #3028201c}
.study-prompt .si-publication-masthead{font-family:inherit;font-size:10px;letter-spacing:0;padding:0 0 13px;border-bottom:2px solid var(--si-ink)}
.study-prompt .si-publication-masthead span:first-child{font-size:15px;letter-spacing:-.035em;font-weight:800}
.study-prompt .si-publication-masthead span:last-child{color:var(--si-muted);font-weight:500;letter-spacing:0}
.study-prompt .si-form-top{padding:26px 0 21px;border-bottom:1px solid var(--si-line)}
.study-prompt .si-form-top>div{gap:6px}
.study-prompt .si-form-top strong{font:750 27px/1.22 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",sans-serif;letter-spacing:-.055em}
.study-prompt .si-form-top small{max-width:none;font-size:12px;line-height:1.6;margin-top:2px}
.study-prompt .si-form-fields{padding-top:17px;margin-bottom:15px;gap:18px}
.study-prompt .si-form-fields label{font-size:11px;gap:1px}
.study-prompt .si-form-fields input{font-size:13px}
.study-prompt .si-consent{margin:0;line-height:1.6}
.study-prompt .si-inline-error{margin:0}
.study-prompt .si-form-actions{margin-top:17px;gap:19px}
.study-prompt .si-form-actions .si-solid{flex:0 1 180px;background:var(--si-accent);border-color:var(--si-accent)}
.study-prompt .si-form-actions .si-solid:hover{background:var(--si-ink);border-color:var(--si-ink)}
.study-prompt .si-message{margin-top:19px;padding-top:11px;border-top:1px solid var(--si-line)}
.study-quick-add .si-tag-heading h4{font:650 20px/1.3 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",sans-serif;letter-spacing:-.045em}
.study-quick-add .si-tag-preview strong{font:650 14px/1.45 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",sans-serif}
.study-quick-add .si-tag-preview{border-top-color:var(--si-line)}
.study-quick-add .si-editor-bar{border-bottom-color:var(--si-line);letter-spacing:0}
.study-quick-add .si-chip{background:#f2e6d9}
.study-quick-add .si-chip-editor{background:#fff;border-color:#c9bdaf}
.study-beam .si-save-panel strong{font:650 23px/1.3 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",sans-serif;letter-spacing:-.05em}
.study-beam .si-object-edition{letter-spacing:.01em;font-size:10px}
.study-beam .si-actions-label{letter-spacing:0;font-size:10px}
@container (max-width:390px){.study-prompt .si-workspace{padding:18px}.study-prompt .si-form-top strong{font-size:23px}.study-beam .si-save-panel strong{font-size:21px}}
@media(max-width:500px){.study-prompt .si-workspace{padding:18px}.study-prompt .si-form-top strong{font-size:23px}.study-beam .si-save-panel strong{font-size:21px}}
/* Distinct silhouettes for the three product contexts. */
.study-layers,.study-prompt,.study-quick-add{--si-ink:#171717;--si-muted:#66645f;--si-line:#deded8;--si-accent:#be3c2d;background:#fff;color:var(--si-ink)}
.study-layers .si-workspace,.study-prompt .si-workspace,.study-quick-add .si-workspace{background:#fff;border:0;box-shadow:none}
.study-layers .si-workspace{padding:23px 24px;gap:15px}
.study-layers .si-project-head{border-bottom:2px solid var(--si-ink);padding:0 0 16px;align-items:center}
.study-layers .si-project-mark{background:var(--si-ink);color:#fff;border-radius:0}
.study-layers .si-project-head strong{font-size:19px;font-weight:750}
.study-layers .si-menu-trigger{border-radius:0;border:1px solid var(--si-ink);width:44px;height:44px}
.study-layers .si-action-menu{top:74px;right:24px;background:#fff;border:1px solid var(--si-ink);border-radius:0;box-shadow:5px 5px 0 #17171717}
.study-layers .si-action-menu button{border-radius:0}
.study-layers .si-menu-result{border-top:0;padding-top:0}
.study-layers .si-project-row{border-color:var(--si-line)}
.study-layers .si-project-row[data-active=true] .si-project-dot{background:var(--si-accent)}
.study-prompt .si-workspace{padding:24px 26px 22px}
.study-prompt .si-publication-masthead{border-bottom:2px solid var(--si-ink);padding:0 0 13px}
.study-prompt .si-publication-masthead span:first-child{font-size:16px}
.study-prompt .si-publication-masthead span:last-child{font-size:10px}
.study-prompt .si-form-top{padding:31px 0 25px;border:0}
.study-prompt .si-form-top strong{font-size:29px;line-height:1.15;letter-spacing:-.06em}
.study-prompt .si-form-fields{padding-top:0;margin-bottom:20px;gap:20px}
.study-prompt .si-form-fields label{font-size:11px;color:var(--si-ink)}
.site-study.study-prompt .si-form-fields input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]){border:0;border-bottom:1px solid #aaa9a3;border-radius:0;background:#fff;padding:11px 0;color:var(--si-ink)}
.site-study.study-prompt .si-form-fields input:focus{border-bottom-color:var(--si-accent)}
.study-prompt .si-consent input{accent-color:var(--si-accent)}
.study-prompt .si-form-actions .si-solid{background:var(--si-accent);border-color:var(--si-accent);border-radius:0;flex:0 1 154px}
.study-prompt .si-form-actions .si-solid:hover{background:var(--si-ink);border-color:var(--si-ink)}
.study-prompt .si-form-actions .si-link{color:var(--si-muted)}
.study-prompt .si-message{border-color:var(--si-line)}
.study-quick-add .si-workspace{padding:23px 24px;gap:15px}
.study-quick-add .si-tag-heading{border-bottom:2px solid var(--si-ink);padding-bottom:14px}
.study-quick-add .si-tag-heading h4{font-size:21px}
.study-quick-add .si-chip-editor{border:1px solid #aaa9a3;border-radius:0;background:#fff}
.study-quick-add .si-chip{background:#f1efea;color:var(--si-ink);border:1px solid #deded8;border-radius:0}
.study-quick-add .si-chip button{color:var(--si-ink)}
.study-quick-add .si-suggestions button{border:1px solid #a5a39e;border-radius:0;color:var(--si-ink);background:#fff}
.study-quick-add .si-suggestions button:not(:disabled):hover{background:#f5f5f2}
.study-quick-add .si-tag-preview{border-top:1px solid var(--si-line)}
.study-quick-add .si-tag-preview>div{color:var(--si-accent)}
.study-beam{--si-ink:#26231f;--si-muted:#716a61;--si-line:#ded9d0;--si-accent:#40382f;background:#f5f3ef;color:var(--si-ink)}
.study-beam .si-workspace{background:#fff;border:1px solid var(--si-line);border-radius:14px;overflow:hidden}
.study-beam .si-object-edition{background:var(--si-accent);color:#fff;font-size:10px;letter-spacing:.01em;padding:12px 21px}
.study-beam .si-save-panel{margin:0 21px;padding:24px 0 19px}
.study-beam .si-save-panel strong{font-size:22px;margin:4px 0 0}
.study-beam .si-save-indicator{border-radius:999px;background:#f0eee9;color:#555049;padding:6px 11px}
.study-beam .si-save-indicator[data-status=success]{background:#e1e9df;color:#235b42}
.study-beam .si-save-indicator[data-status=error]{background:#f6e2dc;color:#a1322a}
.study-beam .si-action-row{padding:18px 21px;gap:8px}
.study-beam .si-action-row .si-solid,.study-beam .si-action-row .si-outline,.study-beam .si-toggle{border-radius:999px;min-height:44px;padding:10px 17px}
.study-beam .si-action-row .si-solid{background:var(--si-accent);border-color:var(--si-accent)}
.study-beam .si-action-row .si-outline{border-color:#bbb3a8;color:var(--si-ink);background:#fff}
.study-beam .si-actions-label{color:var(--si-muted);padding:15px 21px 8px}
.study-beam .si-secondary-actions{padding:0 21px 17px}
.study-beam .si-toggle{border-color:#bbb3a8;background:#fff;color:var(--si-ink)}
.study-beam .si-toggle[aria-pressed=true]{background:#ece8e1;border-color:var(--si-accent);color:var(--si-ink)}
.study-beam .si-toggle[aria-pressed=true] .si-icon{fill:#bda77e}
.study-beam .si-message{background:#f8f6f2;border-color:var(--si-line)}
.study-process,.study-controls{--si-ink:#17243a;--si-muted:#617087;--si-line:#d4dce8;--si-accent:#2558d9;background:#f3f5f9;color:var(--si-ink)}
.study-process .si-workspace,.study-controls .si-workspace{border-radius:6px;border-color:var(--si-line);box-shadow:none}
.study-process .si-upload-inline{justify-content:flex-end}
.study-process .si-drop,.study-controls .si-setting-row,.study-controls .si-setting-glyph,.study-process .si-upload-glyph{border-radius:6px}
.study-process .si-solid,.study-controls .si-solid{border-radius:6px;background:var(--si-accent);border-color:var(--si-accent)}
.study-process .si-progress span{background:var(--si-accent)}
.study-controls .si-setting-row input:checked+i{background:var(--si-accent)}
@container (max-width:390px){.study-prompt .si-workspace,.study-layers .si-workspace,.study-quick-add .si-workspace{padding:18px}.study-prompt .si-form-top strong{font-size:25px}}
@media(max-width:500px){.study-prompt .si-workspace,.study-layers .si-workspace,.study-quick-add .si-workspace{padding:18px}.study-prompt .si-form-top strong{font-size:25px}}
`;}
