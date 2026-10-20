/**
 * Four shared, style-neutral component studies. Every markup function returns the
 * same DOM for each visual system. Each wire function is standalone so the
 * gallery can serialize wire.toString() into an exported HTML document.
 *
 * Controller contract: snapshot, restore, reset, replay, destroy. Restore only
 * changes existing controls; switching CSS never replaces an input or panel.
 */

const buttonMarkup = () => `<section class="ui-demo ui-demo--button" aria-labelledby="ui-button-heading">
  <header class="ui-demo-head"><div><p class="ui-meta">편집 중 · 오늘 14:28</p><h3 class="ui-heading" id="ui-button-heading">문서 저장</h3></div><span class="ui-state" data-save-state>저장 전</span></header>
  <div class="ui-content"><div class="ui-document"><span class="ui-document-icon" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="M14 3H5v18h14V8Z M14 3v5h5 M8 12h8 M8 16h6"/></svg></span><div><strong>팀 온보딩 가이드</strong><small>마지막 수정 사항을 저장해 주세요.</small></div><span class="ui-document-type">문서</span></div>
  <div class="ui-actions"><button class="ui-button is-primary" type="button" data-save>변경 사항 저장</button><label class="ui-option"><input type="checkbox" data-fail> 다음 저장 실패 체험</label></div>
  <div class="ui-divider" aria-hidden="true"></div><div class="ui-actions"><button class="ui-button is-secondary" type="button" data-bookmark aria-pressed="false">☆ 북마크</button><button class="ui-button is-secondary" type="button" data-follow aria-pressed="false">＋ 팔로우</button><button class="ui-button is-secondary" type="button" disabled aria-disabled="true">공유 권한 없음</button></div>
  <p class="ui-status" data-status role="status" aria-live="polite">변경 사항은 이 화면에서만 저장됩니다.</p></div></section>`;

const formMarkup = () => `<section class="ui-demo ui-demo--form" aria-labelledby="ui-form-heading"><header class="ui-demo-head"><div><p class="ui-meta">격주 수요일 · 디자인 노트</p><h3 class="ui-heading" id="ui-form-heading">알림 받기</h3></div></header>
  <div class="ui-content"><p class="ui-help">새 글이 발행되면 이메일로 알려드릴게요.</p><form class="ui-form" data-form novalidate>
  <div class="ui-form-fields"><div class="ui-field-group"><label class="ui-label" for="ui-form-name">이름</label><input class="ui-field" id="ui-form-name" name="name" data-name type="text" autocomplete="name" maxlength="30" placeholder="이름 입력" aria-describedby="ui-form-name-error" required><small class="ui-error" id="ui-form-name-error" data-error="name"></small></div>
  <div class="ui-field-group"><label class="ui-label" for="ui-form-email">이메일</label><input class="ui-field" id="ui-form-email" name="email" data-email type="email" autocomplete="email" placeholder="name@example.com" aria-describedby="ui-form-email-error" required><small class="ui-error" id="ui-form-email-error" data-error="email"></small></div></div>
  <label class="ui-option ui-consent"><input type="checkbox" data-consent aria-describedby="ui-form-consent-error" required><span>이메일 수신에 동의합니다.</span></label><small class="ui-error" id="ui-form-consent-error" data-error="consent"></small>
  <div class="ui-actions"><button class="ui-button is-primary" type="submit" data-submit>신청하기</button><button class="ui-button is-secondary" type="reset">초기화</button></div><p class="ui-status" data-status role="status" aria-live="polite">입력한 내용은 서버로 전송되지 않습니다.</p></form></div></section>`;

const tabsMarkup = () => `<section class="ui-demo ui-demo--tabs" aria-labelledby="ui-tabs-heading"><header class="ui-demo-head"><div><p class="ui-meta">내 프로필 · 환경 설정</p><h3 class="ui-heading" id="ui-tabs-heading">계정 설정</h3></div></header>
  <div class="ui-content"><div class="ui-tablist" role="tablist" aria-label="계정 설정 항목"><button class="ui-tab" type="button" id="ui-tab-profile" role="tab" data-tab="profile" aria-controls="ui-panel-profile" aria-selected="true" tabindex="0">개인정보</button><button class="ui-tab" type="button" id="ui-tab-notify" role="tab" data-tab="notify" aria-controls="ui-panel-notify" aria-selected="false" tabindex="-1">알림</button><button class="ui-tab" type="button" id="ui-tab-security" role="tab" data-tab="security" aria-controls="ui-panel-security" aria-selected="false" tabindex="-1">보안</button><span class="ui-tab-indicator" data-indicator aria-hidden="true"></span></div>
  <div class="ui-panel" id="ui-panel-profile" role="tabpanel" aria-labelledby="ui-tab-profile" data-panel="profile" tabindex="0"><label class="ui-label" for="ui-setting-display">표시 이름</label><input class="ui-field" id="ui-setting-display" data-value="display" type="text" maxlength="30" value="김하늘"><p class="ui-help">프로필과 댓글에 표시할 이름입니다.</p></div>
  <div class="ui-panel" id="ui-panel-notify" role="tabpanel" aria-labelledby="ui-tab-notify" data-panel="notify" tabindex="0" hidden><label class="ui-option"><input type="checkbox" data-value="email" checked><span><strong>이메일 알림</strong><small>새 활동을 이메일로 받습니다.</small></span></label></div>
  <div class="ui-panel" id="ui-panel-security" role="tabpanel" aria-labelledby="ui-tab-security" data-panel="security" tabindex="0" hidden><label class="ui-option"><input type="checkbox" data-value="login" checked><span><strong>로그인 알림</strong><small>새 기기에서 로그인하면 알려드립니다.</small></span></label></div>
  <div class="ui-actions"><span class="ui-help" data-save-state>저장된 상태입니다.</span><button class="ui-button is-primary" type="button" data-save>변경 사항 저장</button></div><p class="ui-status" data-status role="status" aria-live="polite">설정은 이 화면에서만 유지됩니다.</p></div></section>`;

const drawerMarkup = () => `<section class="ui-demo ui-demo--drawer" aria-labelledby="ui-drawer-heading"><header class="ui-demo-head"><div><p class="ui-meta">데스크 컬렉션 · 2개 상품</p><h3 class="ui-heading" id="ui-drawer-heading">장바구니</h3></div><button class="ui-button is-secondary" type="button" data-open>장바구니 보기 <span data-cart-count>3</span></button></header>
  <div class="ui-content"><div class="ui-products"><article class="ui-product"><div><strong>데스크 노트</strong><small>₩18,000 · 1권</small></div><button class="ui-button is-secondary" type="button" data-add="note">담기</button></article><article class="ui-product"><div><strong>금속 트레이</strong><small>₩32,000 · 1개</small></div><button class="ui-button is-secondary" type="button" data-add="tray">담기</button></article></div><p class="ui-status" data-add-status role="status" aria-live="polite">상품을 담고 수량을 조정해 보세요.</p></div>
  <dialog class="ui-dialog" aria-labelledby="ui-cart-heading"><div class="ui-drawer-panel" data-drawer-panel><header class="ui-dialog-head"><div><p class="ui-meta">선택한 상품</p><h3 class="ui-heading" id="ui-cart-heading">장바구니 <span data-dialog-count>(3)</span></h3></div><button class="ui-button is-secondary" type="button" data-close aria-label="장바구니 닫기">닫기</button></header><div class="ui-cart-lines" data-lines></div><footer class="ui-dialog-foot"><div class="ui-cart-total"><span>상품 합계</span><strong data-subtotal>₩82,000</strong></div><div class="ui-actions"><button class="ui-button is-primary" type="button" data-checkout>주문 완료</button><button class="ui-button is-secondary" type="button" data-restore hidden>다시 담기</button></div><p class="ui-status" data-cart-status role="status" aria-live="polite">결제 없이 주문 흐름을 체험합니다.</p></footer></div></dialog></section>`;

function wireButton(root, item, helpers = {}) {
  const q = selector => root.querySelector(selector);
  const cleanup = [];
  const on = (node, type, fn) => { if (helpers.listen) helpers.listen(node, type, fn); else { node.addEventListener(type, fn); cleanup.push(() => node.removeEventListener(type, fn)); } };
  const copy = value => JSON.parse(JSON.stringify(value));
  const initial = {status:'idle', bookmark:false, follow:false, fail:false, pendingFail:false, message:'변경 사항은 이 화면에서만 저장됩니다.', tone:''};
  let state=copy(initial), timer=0, revision=0;
  const motion=()=>item?.styleMotion||{};
  const stop=()=>{clearTimeout(timer);timer=0;revision++;};
  const status=(message,tone='')=>{state.message=message;state.tone=tone;const node=q('[data-status]');node.textContent=message;node.dataset.tone=tone;helpers.say?.(message);if(tone&&helpers.animate)helpers.animate(node,[{opacity:.45},{opacity:1}],{duration:motion().result||180});};
  const render=()=>{const save=q('[data-save]');save.disabled=state.status==='loading';save.textContent={idle:'변경 사항 저장',loading:'저장 중…',success:'다시 저장',error:'다시 시도'}[state.status]||'변경 사항 저장';q('[data-save-state]').textContent={idle:'저장 전',loading:'처리 중',success:'저장 완료',error:'저장 실패'}[state.status];q('[data-save-state]').dataset.phase=state.status;q('[data-bookmark]').setAttribute('aria-pressed',String(state.bookmark));q('[data-bookmark]').textContent=state.bookmark?'★ 북마크됨':'☆ 북마크';q('[data-follow]').setAttribute('aria-pressed',String(state.follow));q('[data-follow]').textContent=state.follow?'✓ 팔로우 중':'＋ 팔로우';q('[data-fail]').checked=state.fail;q('[data-status]').textContent=state.message;q('[data-status]').dataset.tone=state.tone;};
  const finish=token=>{if(token!==revision)return;if(helpers.active?.()===false){timer=setTimeout(()=>finish(token),100);return;}state.status=state.pendingFail?'error':'success';render();status(state.pendingFail?'저장에 실패했습니다. 다시 시도할 수 있습니다.':'문서를 저장했습니다. 로컬 시뮬레이션입니다.',state.pendingFail?'error':'success');};
  const save=()=>{stop();state.pendingFail=state.fail;state.fail=false;state.status='loading';render();status('문서를 저장하는 중…');const token=revision;timer=setTimeout(()=>finish(token),900);helpers.animate?.(q('[data-save]'),[{transform:'scale(.97)'},{transform:'scale(1)'}],{duration:motion().press||150});};
  on(q('[data-save]'),'click',save);
  on(q('[data-fail]'),'change',e=>{state.fail=e.target.checked;});
  const toggleMotion=node=>helpers.animate?.(node,[{transform:'scale(.94)'},{transform:'scale(1)'}],{duration:motion().press||150});
  on(q('[data-bookmark]'),'click',()=>{state.bookmark=!state.bookmark;render();toggleMotion(q('[data-bookmark]'));status(state.bookmark?'북마크에 추가했습니다.':'북마크를 해제했습니다.');});
  on(q('[data-follow]'),'click',()=>{state.follow=!state.follow;render();toggleMotion(q('[data-follow]'));status(state.follow?'팔로우를 시작했습니다.':'팔로우를 해제했습니다.');});
  const announce=()=>status(state.status==='success'?'문서를 저장했습니다. 로컬 시뮬레이션입니다.':state.status==='error'?'저장에 실패했습니다. 다시 시도할 수 있습니다.':'변경 사항은 이 화면에서만 저장됩니다.',state.status==='success'?'success':state.status==='error'?'error':'');
  render();
  return {snapshot(){return copy(state);},restore(next){if(!next||JSON.stringify(next)===JSON.stringify(state))return;stop();state={...copy(initial),...copy(next)};render();if(state.status==='loading'){const token=revision;timer=setTimeout(()=>finish(token),900);}},reset(){stop();state=copy(initial);render();},replay(){save();},destroy(){stop();cleanup.forEach(fn=>fn());}};
}

function wireForm(root, item, helpers = {}) {
  const q = selector => root.querySelector(selector);
  const cleanup=[];
  const on=(node,type,fn)=>{if(helpers.listen)helpers.listen(node,type,fn);else{node.addEventListener(type,fn);cleanup.push(()=>node.removeEventListener(type,fn));}};
  const copy=value=>JSON.parse(JSON.stringify(value));
  const initial={name:'',email:'',consent:false,status:'idle',errors:{},message:'입력한 내용은 서버로 전송되지 않습니다.',tone:''};
  let state=copy(initial),timer=0,revision=0;
  const stop=()=>{clearTimeout(timer);timer=0;revision++;};
  const status=(value,tone='')=>{state.message=value;state.tone=tone;const node=q('[data-status]');node.textContent=value;node.dataset.tone=tone;helpers.say?.(value);if(tone)helpers.animate?.(node,[{opacity:.45},{opacity:1}],{duration:item?.styleMotion?.result||180});};
  const values=()=>{state.name=q('[data-name]').value;state.email=q('[data-email]').value;state.consent=q('[data-consent]').checked;};
  const render=()=>{if(q('[data-name]').value!==state.name)q('[data-name]').value=state.name;if(q('[data-email]').value!==state.email)q('[data-email]').value=state.email;q('[data-consent]').checked=state.consent;for(const key of ['name','email','consent']){q(`[data-error="${key}"]`).textContent=state.errors[key]||'';q(`[data-${key}]`).setAttribute('aria-invalid',String(!!state.errors[key]));}q('[data-submit]').disabled=state.status==='pending';q('[data-submit]').dataset.phase=state.status;q('[data-submit]').textContent=state.status==='pending'?'신청 중…':state.status==='success'?'신청 완료 ✓':'신청하기';q('[data-status]').textContent=state.message;q('[data-status]').dataset.tone=state.tone;};
  const finish=token=>{if(token!==revision)return;if(helpers.active?.()===false){timer=setTimeout(()=>finish(token),100);return;}state.status='success';render();status(`${state.name.trim()}님, 알림 신청이 완료되었습니다. 실제 이메일은 발송되지 않습니다.`,'success');};
  const start=()=>{stop();state.status='pending';render();status('알림 신청을 확인하는 중…');const token=revision;timer=setTimeout(()=>finish(token),900);};
  on(q('[data-form]'),'input',()=>{values();state.errors={};if(state.status==='pending')stop();state.status='idle';status('입력 내용을 확인한 뒤 신청해 주세요.');render();});
  on(q('[data-form]'),'change',()=>{values();render();});
  on(q('[data-form]'),'submit',e=>{e.preventDefault();values();state.errors={};const name=state.name.trim(),email=state.email.trim();if(name.length<2||name.length>30)state.errors.name='이름을 2–30자로 입력해 주세요.';if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))state.errors.email='올바른 이메일 주소를 입력해 주세요.';if(!state.consent)state.errors.consent='이메일 수신 동의가 필요합니다.';if(Object.keys(state.errors).length){stop();state.status='idle';render();status('입력 내용을 확인해 주세요.','error');const invalid=q('[aria-invalid="true"]');invalid?.focus();helpers.animate?.(invalid,[{transform:'translateX(0)'},{transform:'translateX(-4px)',offset:.25},{transform:'translateX(4px)',offset:.6},{transform:'translateX(0)'}],{duration:item?.styleMotion?.content||200});return;}start();});
  on(q('[data-form]'),'reset',e=>{e.preventDefault();stop();state=copy(initial);render();status('입력한 내용은 서버로 전송되지 않습니다.');});
  render();
  return {snapshot(){return copy(state);},restore(next){if(!next||JSON.stringify(next)===JSON.stringify(state))return;stop();state={...copy(initial),...copy(next)};render();if(state.status==='pending'){const token=revision;timer=setTimeout(()=>finish(token),900);}},reset(){stop();state=copy(initial);render();},replay(){q('[data-form]').requestSubmit();},destroy(){stop();cleanup.forEach(fn=>fn());}};
}

function wireTabs(root, item, helpers = {}) {
  const q=selector=>root.querySelector(selector);
  const cleanup=[];
  const on=(node,type,fn)=>{if(helpers.listen)helpers.listen(node,type,fn);else{node.addEventListener(type,fn);cleanup.push(()=>node.removeEventListener(type,fn));}};
  const copy=value=>JSON.parse(JSON.stringify(value));
  const keys=['profile','notify','security'];
  const initial={tab:'profile',values:{display:'김하늘',email:true,login:true},saved:{display:'김하늘',email:true,login:true},message:'설정은 이 화면에서만 유지됩니다.',tone:''};
  let state=copy(initial),indicatorAnimation=null;
  const status=(value,tone='')=>{state.message=value;state.tone=tone;const node=q('[data-status]');node.textContent=value;node.dataset.tone=tone;helpers.say?.(value);};
  const tabAxis=()=>getComputedStyle(q('.ui-tablist')).getPropertyValue('--ui-tab-axis').trim()==='y'?'y':'x';
  const align=(animated=false)=>{
    const active=q(`[data-tab="${state.tab}"]`),bar=q('.ui-tablist'),marker=q('[data-indicator]');
    if(!active||!bar||!marker)return;
    const axis=tabAxis(),base=bar.getBoundingClientRect(),rect=active.getBoundingClientRect();
    const x=axis==='x'?rect.left-base.left+bar.scrollLeft-bar.clientLeft-marker.offsetLeft:0;
    const y=axis==='y'?rect.top-base.top+bar.scrollTop-bar.clientTop-marker.offsetTop:0;
    const prior=getComputedStyle(marker);
    const from={transform:prior.transform==='none'?'translate(0px, 0px)':prior.transform,width:prior.width,height:prior.height};
    indicatorAnimation?.cancel();
    indicatorAnimation=null;
    marker.style.width=axis==='x'?`${rect.width}px`:'';
    marker.style.height=axis==='y'?`${rect.height}px`:'';
    marker.style.transform=`translate(${x}px, ${y}px)`;
    bar.setAttribute('aria-orientation',axis==='y'?'vertical':'horizontal');
    if(animated&&!helpers.reduced?.()&&helpers.animate){
      const target=getComputedStyle(marker);
      indicatorAnimation=helpers.animate(marker,[from,{transform:marker.style.transform,width:target.width,height:target.height}],{duration:item?.styleMotion?.tab||220,easing:item?.styleMotion?.ease||'cubic-bezier(.2,.8,.2,1)'});
    }
  };
  const animatePanel=(key,previous)=>{
    if(helpers.reduced?.()||!helpers.animate)return;
    const motion=item?.styleMotion||{},path=motion.tabPanel||'fade',distance=motion.tabPanelDistance||0;
    const direction=keys.indexOf(key)>=keys.indexOf(previous)?1:-1;
    const from=path==='slide'?{opacity:.72,transform:`translateX(${direction*distance}px)`}:path==='snap'?{opacity:.84,transform:`translateX(${distance}px)`}:{opacity:.36};
    const to=path==='fade'?{opacity:1}:{opacity:1,transform:'translateX(0px)'};
    helpers.animate(q(`[data-panel="${key}"]`),[from,to],{duration:motion.content||180,easing:motion.ease||'cubic-bezier(.2,.8,.2,1)'});
  };
  const render=(animateTab=false)=>{for(const key of keys){const chosen=state.tab===key;const tab=q(`[data-tab="${key}"]`);tab.setAttribute('aria-selected',String(chosen));tab.tabIndex=chosen?0:-1;q(`[data-panel="${key}"]`).hidden=!chosen;}for(const key of ['display','email','login']){const node=q(`[data-value="${key}"]`);if(node.type==='checkbox')node.checked=!!state.values[key];else if(node.value!==state.values[key])node.value=state.values[key]||'';}const dirty=JSON.stringify(state.values)!==JSON.stringify(state.saved);q('[data-save-state]').textContent=dirty?'저장되지 않은 변경 사항':'저장된 상태입니다.';q('[data-save]').textContent=dirty?'변경 사항 저장':'저장됨 ✓';q('[data-status]').textContent=state.message;q('[data-status]').dataset.tone=state.tone;align(animateTab);};
  const select=(key,focus=false)=>{if(!keys.includes(key))return;const previous=state.tab,changed=previous!==key;state.tab=key;render(changed);if(changed)animatePanel(key,previous);if(focus)q(`[data-tab="${key}"]`).focus();};
  on(q('.ui-tablist'),'click',e=>{const tab=e.target.closest('[data-tab]');if(tab)select(tab.dataset.tab);});
  on(q('.ui-tablist'),'keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key)||!e.target.closest('[data-tab]'))return;const axis=tabAxis();if((e.key==='ArrowUp'||e.key==='ArrowDown')&&axis!=='y')return;e.preventDefault();const current=keys.indexOf(e.target.closest('[data-tab]').dataset.tab||state.tab);const next=e.key==='Home'?0:e.key==='End'?keys.length-1:(current+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+keys.length)%keys.length;select(keys[next],true);});
  on(root,'input',e=>{const key=e.target.dataset.value;if(!key)return;state.values[key]=e.target.type==='checkbox'?e.target.checked:e.target.value;render();status('변경 사항을 저장해 주세요.');});
  on(root,'change',e=>{const key=e.target.dataset.value;if(!key)return;state.values[key]=e.target.type==='checkbox'?e.target.checked:e.target.value;render();});
  on(q('[data-save]'),'click',()=>{state.saved=copy(state.values);render();status('설정을 저장했습니다. 이 화면에서만 유지됩니다.','success');helpers.animate?.(q('[data-status]'),[{opacity:.45},{opacity:1}],{duration:item?.styleMotion?.result||180});});
  const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(()=>align(false)):null;for(const node of [q('.ui-tablist'),...root.querySelectorAll('[data-tab]')])observer?.observe(node);
  const styleObserver=typeof MutationObserver!=='undefined'?new MutationObserver(()=>align(false)):null;styleObserver?.observe(root,{attributes:true,attributeFilter:['data-style']});
  render();
  return {snapshot(){return copy(state);},restore(next){if(!next||JSON.stringify(next)===JSON.stringify(state))return;const previous=state.tab,changed=next.tab!==previous;state={...copy(initial),...copy(next)};render(changed);if(changed)animatePanel(state.tab,previous);},reset(){state=copy(initial);render();},replay(){select(keys[(keys.indexOf(state.tab)+1)%keys.length]);},destroy(){indicatorAnimation?.cancel();observer?.disconnect();styleObserver?.disconnect();cleanup.forEach(fn=>fn());}};
}

function wireDrawer(root, item, helpers = {}) {
  const q=selector=>root.querySelector(selector);
  const cleanup=[];
  const on=(node,type,fn)=>{if(helpers.listen)helpers.listen(node,type,fn);else{node.addEventListener(type,fn);cleanup.push(()=>node.removeEventListener(type,fn));}};
  const copy=value=>JSON.parse(JSON.stringify(value));
  const products={note:{name:'데스크 노트',price:18000},tray:{name:'금속 트레이',price:32000}};
  const money=value=>'₩'+Number(value).toLocaleString('ko-KR');
  const initial={cart:{note:1,tray:2},checkedOut:false,message:'',open:false};
  let state=copy(initial),motionAnimation=null,revision=0,opener=null;
  const dialog=q('.ui-dialog'),panel=q('[data-drawer-panel]');
  const focused=()=>{let node=document.activeElement;while(node?.shadowRoot?.activeElement)node=node.shadowRoot.activeElement;return node;};
  const distance=()=>{const value=item?.styleMotion?.drawerDistance;return typeof value==='number'?`${value}px`:value||'32px';};
  const drawerScale=()=>item?.styleMotion?.drawerScale??1;
  const away=()=>`translateX(${distance()}) scale(${drawerScale()})`;
  const settled='translateX(0px) scale(1)';
  const duration=kind=>item?.styleMotion?.[kind]||(kind==='drawerOpen'?240:200);
  const animate=(frames,ms)=>helpers.reduced?.()?null:helpers.animate?.(panel,frames,{duration:ms,easing:item?.styleMotion?.ease||'cubic-bezier(.2,.8,.2,1)'})||panel.animate(frames,{duration:ms,easing:item?.styleMotion?.ease||'cubic-bezier(.2,.8,.2,1)'});
  const cancelMotion=()=>{revision++;motionAnimation?.cancel();motionAnimation=null;};
  const render=()=>{const count=Object.values(state.cart).reduce((sum,n)=>sum+Math.max(0,n||0),0);const total=Object.entries(state.cart).reduce((sum,[key,qty])=>sum+products[key].price*Math.max(0,qty||0),0);q('[data-cart-count]').textContent=String(count);q('[data-dialog-count]').textContent=`(${count})`;const lines=q('[data-lines]');lines.replaceChildren();for(const key of ['note','tray']){const qty=Math.max(0,state.cart[key]||0);if(!qty)continue;const product=products[key],row=document.createElement('div');row.className='ui-cart-line';row.dataset.product=key;const info=document.createElement('div');info.className='ui-cart-info';const name=document.createElement('strong');name.textContent=product.name;const price=document.createElement('small');price.textContent=`${money(product.price)} / 개`;info.append(name,price);const totalNode=document.createElement('strong');totalNode.className='ui-line-total';totalNode.textContent=money(product.price*qty);const quantity=document.createElement('div');quantity.className='ui-quantity';for(const [action,label,text] of [['minus',`${product.name} 수량 줄이기`,'−'],['plus',`${product.name} 수량 늘리기`,'+']]){const button=document.createElement('button');button.type='button';button.className='ui-button is-secondary';button.dataset[action]=key;button.setAttribute('aria-label',label);button.textContent=text;if(action==='minus')quantity.append(button);}const value=document.createElement('span');value.textContent=String(qty);quantity.append(value);const plus=document.createElement('button');plus.type='button';plus.className='ui-button is-secondary';plus.dataset.plus=key;plus.setAttribute('aria-label',`${product.name} 수량 늘리기`);plus.textContent='+';quantity.append(plus);const remove=document.createElement('button');remove.type='button';remove.className='ui-button is-secondary';remove.dataset.remove=key;remove.textContent='삭제';remove.setAttribute('aria-label',`${product.name} 삭제`);quantity.append(remove);row.append(info,totalNode,quantity);lines.append(row);}if(!count){const empty=document.createElement('p');empty.className='ui-empty';empty.textContent='장바구니가 비었습니다.';lines.append(empty);}q('[data-subtotal]').textContent=money(total);q('[data-checkout]').disabled=!count||state.checkedOut;q('[data-restore]').hidden=!!count;q('[data-cart-status]').textContent=state.message||'결제 없이 주문 흐름을 체험합니다.';q('[data-add-status]').textContent=state.message.endsWith('담았습니다.')?state.message:'상품을 담고 수량을 조정해 보세요.';};
  const open=(focus=true)=>{delete dialog.dataset.closing;const wasOpen=dialog.open;const computed=wasOpen?getComputedStyle(panel):null;const from=computed?{opacity:computed.opacity,transform:computed.transform}:{opacity:0,transform:away()};cancelMotion();const previous=root.getRootNode().activeElement||focused();if(!wasOpen){if(root.closest('.demo')?.dataset.comparison==='true')dialog.show();else dialog.showModal();}state.open=true;motionAnimation=animate([from,{opacity:1,transform:settled}],duration('drawerOpen'));if(focus)q('[data-close]').focus();else if(previous?.isConnected)previous.focus({preventScroll:true});};
  const close=(focus=true)=>{if(!dialog.open)return;state.open=false;dialog.dataset.closing='true';const computed=getComputedStyle(panel),from={opacity:computed.opacity,transform:computed.transform};cancelMotion();const token=revision;const finish=()=>{if(token!==revision||!dialog.open)return;const previous=focused();dialog.close();state.open=false;if(focus&&opener?.isConnected)opener.focus();else if(!focus&&previous?.isConnected)previous.focus({preventScroll:true});};if(helpers.reduced?.()){finish();return;}motionAnimation=animate([from,{opacity:0,transform:away()}],duration('drawerClose'));if(!motionAnimation){finish();return;}motionAnimation.finished.then(finish,()=>{});};
  on(q('[data-open]'),'click',e=>{opener=e.currentTarget;open();});
  on(q('[data-close]'),'click',()=>close());
  on(dialog,'cancel',e=>{e.preventDefault();close();});
  on(dialog,'click',e=>{if(e.target!==dialog||root.closest('.demo')?.dataset.comparison==='true')return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();});
  on(dialog,'close',()=>{if(dialog.open)return;cancelMotion();state.open=false;});
  on(q('[data-lines]'),'click',e=>{const button=e.target.closest('button');if(!button)return;const key=button.dataset.plus||button.dataset.minus||button.dataset.remove;if(!key||!products[key])return;const action=button.dataset.plus?'plus':button.dataset.minus?'minus':'remove';if(action==='plus')state.cart[key]=(state.cart[key]||0)+1;else if(action==='minus')state.cart[key]=Math.max(0,(state.cart[key]||0)-1);else state.cart[key]=0;state.checkedOut=false;state.message='';render();(q(`[data-${action}="${key}"]`)||q('[data-lines] button')||q('[data-restore]')||q('[data-close]')).focus();});
  for(const button of root.querySelectorAll('[data-add]'))on(button,'click',()=>{const key=button.dataset.add;state.cart[key]=(state.cart[key]||0)+1;state.checkedOut=false;state.message=`${products[key].name} 상품을 담았습니다.`;render();helpers.animate?.(q('[data-cart-count]'),[{opacity:.6,transform:'scale(.85)'},{opacity:1,transform:'scale(1)'}],{duration:item?.styleMotion?.result||170});});
  on(q('[data-checkout]'),'click',()=>{const total=Object.entries(state.cart).reduce((sum,[key,qty])=>sum+products[key].price*qty,0);state.cart={note:0,tray:0};state.checkedOut=true;state.message=`${money(total)} 주문이 완료되었습니다. 실제 결제는 없습니다.`;render();q('[data-restore]').focus();});
  on(q('[data-restore]'),'click',()=>{state.cart={note:1,tray:2};state.checkedOut=false;state.message='상품을 다시 담았습니다.';render();q('[data-lines] button')?.focus();});
  render();
  return {snapshot(){return copy(state);},restore(next){if(!next||JSON.stringify(next)===JSON.stringify(state))return;state={...copy(initial),...copy(next)};render();if(state.open&&(!dialog.open||dialog.dataset.closing))open(false);else if(!state.open&&dialog.open&&!dialog.dataset.closing)close(false);},setComparison(value){if(!dialog.open)return;if(!state.open){cancelMotion();dialog.close();return;}const next=!!value,isModal=dialog.matches(':modal');if(isModal===!next)return;const previous=root.getRootNode().activeElement||focused();cancelMotion();dialog.close();if(next)dialog.show();else dialog.showModal();state.open=true;if(previous?.isConnected&&(next||dialog.contains(previous)))previous.focus({preventScroll:true});},reset(){cancelMotion();if(dialog.open)dialog.close();state=copy(initial);render();},replay(){opener=q('[data-open]');if(dialog.open&&!dialog.dataset.closing)close(false);else open();},destroy(){cancelMotion();if(dialog.open)dialog.close();cleanup.forEach(fn=>fn());}};
}

// Layout-neutral essentials; visual personality lives in style-system.js.
const commonCSS = `.ui-demo{min-width:0;container-type:inline-size}.ui-demo *{box-sizing:border-box}.ui-demo[hidden],.ui-demo [hidden]{display:none!important}.ui-demo button,.ui-demo input{font:inherit}.ui-demo button{min-height:44px;cursor:pointer}.ui-demo button:disabled{cursor:default}.ui-demo .ui-content{display:grid;gap:var(--ui-space,16px)}.ui-demo .ui-actions{display:flex;align-items:center;flex-wrap:wrap;gap:var(--ui-space,12px)}@container (max-width:460px){.ui-demo .ui-actions>.ui-button{flex:1}}`;
const buttonCSS = `.ui-demo--button .ui-document{display:flex;align-items:center;gap:var(--ui-space,12px)}.ui-demo--button .ui-document>div{min-width:0;flex:1}`;
const formCSS = `.ui-demo--form .ui-form,.ui-demo--form .ui-form-fields{display:grid;gap:var(--ui-space,12px)}`;
const tabsCSS = `.ui-demo--tabs .ui-tablist{position:relative;display:flex;align-items:stretch}.ui-demo--tabs .ui-tab-indicator{position:absolute;left:0;bottom:0;height:2px;pointer-events:none}`;
const drawerCSS = `.ui-demo--drawer .ui-products,.ui-demo--drawer .ui-cart-lines{display:grid;gap:var(--ui-space,12px)}.ui-demo--drawer .ui-product,.ui-demo--drawer .ui-cart-line{display:flex;align-items:center;justify-content:space-between;gap:var(--ui-space,12px)}.ui-demo--drawer .ui-quantity{display:flex;align-items:center;gap:8px}.ui-demo--drawer .ui-dialog{max-height:min(90dvh,680px);overflow:auto}.ui-demo--drawer .ui-drawer-panel{display:grid;gap:var(--ui-space,16px)}.ui-demo--drawer .ui-dialog-head,.ui-demo--drawer .ui-cart-total{display:flex;align-items:center;justify-content:space-between;gap:12px}@container (max-width:460px){.ui-demo--drawer .ui-product,.ui-demo--drawer .ui-cart-line{flex-wrap:wrap}}`;

export const componentDefinitions = {
  button:{markup:buttonMarkup,css:commonCSS+buttonCSS,wire:wireButton},
  form:{markup:formMarkup,css:commonCSS+formCSS,wire:wireForm},
  tabs:{markup:tabsMarkup,css:commonCSS+tabsCSS,wire:wireTabs},
  drawer:{markup:drawerMarkup,css:commonCSS+drawerCSS,wire:wireDrawer}
};
