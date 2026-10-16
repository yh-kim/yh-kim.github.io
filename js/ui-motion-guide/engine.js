// Live demos and downloaded HTML use these same functions, without a framework.
export function variables(t) {
  const values = { ...t.colors, font:t.type.body, display:t.type.display, mono:t.type.mono,
    size:t.type.size+'px', title:t.type.title+'px', 'mobile-title':t.type.mobileTitle+'px', weight:t.type.weight,
    line:t.type.line, 'title-line':t.type.titleLine, tracking:t.type.tracking,
    max:t.layout.max+'px', pad:t.layout.padding+'px', 'mobile-pad':t.layout.mobilePadding+'px', gap:t.layout.gap+'px', section:t.layout.section+'px', columns:t.layout.columns,
    height:t.element.height+'px', 'control-pad':t.element.padding+'px', radius:t.element.radius+'px', bw:t.element.border+'px', shadow:t.element.shadow,
    'hover-y':t.element.hoverY+'px', press:t.element.press+'px', 'disabled-opacity':t.element.disabledOpacity,
    'card-pad':t.element.cardPadding+'px', 'image-radius':t.element.imageRadius+'px', filter:t.element.imageFilter,
    duration:t.motion.duration+'ms', ease:t.motion.ease, 'dialog-width':t.element.dialogWidth+'px' };
  return Object.entries(values).map(([k,v])=>`--${k}:${v}`).join(';');
}
export function demoCSS(t) {
  return `
.demo { ${variables(t)}; container-type:inline-size; font:400 var(--size)/var(--line) var(--font); color:var(--text); background:var(--background); padding:var(--pad); border-radius:var(--radius); isolation:isolate; overflow-wrap:anywhere; word-break:keep-all; color-scheme:light; }
.demo *, .demo *::before, .demo *::after { box-sizing:border-box; }
.demo [hidden] { display:none!important; }
.demo h3,.demo h4,.demo p,.demo figure { margin:0; }
.demo h3,.demo h4 { font-family:var(--display);font-weight:var(--weight);letter-spacing:var(--tracking);line-height:var(--title-line); }
.demo h3 { font-size:var(--title); }
.demo h4 { font-size:23px; }
.demo button,.demo input,.demo select { font:inherit; }
.demo button { cursor:pointer; }
.demo :is(button,input,select,summary,[tabindex]):focus-visible,.demo [data-state="focus"] { outline:3px solid var(--focus);outline-offset:4px; }
.demo .meta { font:500 11px/1.6 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted); }
.demo .muted { color:var(--muted); }
.demo .stack { display:grid;gap:16px; }
.demo .row { display:flex;gap:12px;align-items:center;flex-wrap:wrap; }
.demo .spread { justify-content:space-between; }
.demo .btn { min-height:var(--height);padding:10px var(--control-pad);border:var(--bw) solid var(--accent);border-radius:var(--radius);background:var(--accent);color:var(--onAccent);font-weight:650;line-height:1.4;transition:background var(--duration) var(--ease),transform var(--duration) var(--ease),box-shadow var(--duration) var(--ease);text-align:center;box-shadow:var(--shadow); }
.demo .btn.secondary { color:var(--text);background:var(--surface);border-color:var(--border);box-shadow:none; }
.demo .btn:hover:not(:disabled),.demo .btn[data-state="hover"] { background:var(--hover);color:var(--onAccent);transform:translateY(var(--hover-y)); }
.demo .btn:active:not(:disabled),.demo .btn[data-state="active"] { transform:translate(var(--press),var(--press));box-shadow:none; }
.demo .btn:disabled { background:var(--disabled);color:var(--onDisabled);border-color:var(--border);opacity:var(--disabled-opacity);cursor:not-allowed;transform:none;box-shadow:none; }
.demo .btn[aria-pressed="true"] { background:var(--text);color:var(--surface); }
.demo .state-label { display:grid;gap:8px;font-size:13px;color:var(--muted); }
.demo select { min-height:44px;max-width:100%;padding:8px 32px 8px 12px;border:var(--bw) solid var(--border);border-radius:var(--radius);color:var(--text);background:var(--surface); }
.demo label { display:block;font-weight:600; }
.demo input { width:100%;min-width:0;min-height:var(--height);border:var(--bw) solid var(--border);border-radius:var(--radius);padding:10px 14px;color:var(--text);background:var(--surface); }
.demo input[aria-invalid="true"] { border-color:var(--error);border-width:2px; }
.demo input[data-valid="true"] { border-color:var(--success);border-width:2px; }
.demo .feedback { min-height:24px;font-size:13px; }
.demo .feedback[data-tone="error"] { color:var(--error); }
.demo .feedback[data-tone="success"] { color:var(--success); }
.demo .form-row { display:grid;grid-template-columns:1fr auto;gap:12px;align-items:start; }
.demo .hero { max-width:var(--max);margin:auto;display:grid;gap:var(--gap); }
.demo .hero-nav { padding-bottom:20px;border-bottom:var(--bw) solid var(--border); }
.demo .wordmark { font-family:var(--display);font-weight:800;letter-spacing:.12em; }
.demo .hero-layout { display:grid;grid-template-columns:var(--columns);align-items:center;gap:var(--gap);padding-top:12px; }
.demo .hero-copy { display:grid;gap:20px; }
.demo .hero-copy p { font-size:14px; }
.demo .art { display:block;width:100%;height:auto;aspect-ratio:4/3;background:var(--soft);border-radius:var(--image-radius);filter:var(--filter); }
.demo figcaption { font:11px/1.7 var(--mono);color:var(--muted);padding-top:8px; }
.demo .hero-bottom { display:grid;grid-template-columns:1fr 1fr;gap:var(--gap);border-top:var(--bw) solid var(--border);padding-top:20px;margin-top:var(--section); }
.demo .metric { font:500 22px/1.4 var(--display); }
.demo .card-set { display:grid;grid-template-columns:1fr;gap:14px; }
.demo .space-card { display:grid;grid-template-columns:92px 1fr;gap:18px;align-items:center;padding:var(--card-pad);background:var(--surface);border:var(--bw) solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow); }
.demo .space-card .art { aspect-ratio:1; }
.demo .space-card h4 { font-size:20px; }
.demo .space-card .btn { min-height:44px;font-size:12px;padding:7px 12px; }
.demo .space-card .card-info { display:grid;gap:9px; }
.demo .motion-controls { margin-bottom:18px; }
.demo .motion-controls button { font-size:12px;min-height:44px;padding:8px 12px; }
.demo .tablist { display:flex;gap:6px;border-bottom:var(--bw) solid var(--border);padding-bottom:10px; }
.demo [role="tab"] { flex:1;min-height:44px;padding:10px;border:var(--bw) solid transparent;background:transparent;color:var(--muted);border-radius:var(--radius); }
.demo [role="tab"][aria-selected="true"] { background:var(--surface);border-color:var(--border);color:var(--text);box-shadow:var(--shadow);font-weight:700; }
.demo .tab-panel { padding:24px 0 0;min-height:125px; }
.demo .tab-panel h4 { margin-bottom:12px; }
.demo details { border-bottom:var(--bw) solid var(--border);padding:4px 0; }
.demo summary { cursor:pointer;min-height:var(--height);padding:14px 4px;font-weight:650; }
.demo details p { padding:8px 4px 20px;color:var(--muted); }
.demo dialog { max-width:calc(100vw - 32px);width:var(--dialog-width);max-height:85dvh;overflow:auto;margin:auto;border:var(--bw) solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);padding:28px;box-shadow:var(--shadow);font-family:var(--font); }
.demo dialog::backdrop { background:#14182188; }
.demo dialog h4 { font-size:26px; }
.demo .scroll-box { height:240px;overflow-y:auto;overscroll-behavior:contain;border:var(--bw) solid var(--border);background:var(--surface);border-radius:var(--radius);padding:18px; }
.demo .scroll-intro { min-height:240px;display:grid;align-content:center;gap:10px; }
.demo .scroll-item { margin:12px 0;padding:24px 16px;border-left:3px solid var(--accent);background:var(--soft);min-height:110px; }
.demo[data-theme="editorial"] .hero-nav { border-top:3px solid var(--text);padding-top:15px; }
.demo[data-theme="editorial"] .hero-layout { align-items:start; }
.demo[data-theme="editorial"] .hero-copy { grid-column:2;grid-row:1; }
.demo[data-theme="editorial"] .hero-layout figure { grid-column:1;grid-row:1;padding-top:36px; }
.demo[data-theme="editorial"] .hero-copy h3 { border-bottom:1px solid var(--border);padding-bottom:22px; }
.demo[data-theme="editorial"] .space-card { grid-template-columns:1fr 1.6fr;border-width:0 0 1px;padding-left:0;padding-right:0; }
.demo[data-theme="editorial"] [role="tab"][aria-selected="true"] { border-color:transparent transparent var(--accent);border-bottom-width:3px;background:transparent; }
.demo[data-theme="technical"] .hero { background-image:linear-gradient(var(--soft) 1px,transparent 1px),linear-gradient(90deg,var(--soft) 1px,transparent 1px);background-size:24px 24px; }
.demo[data-theme="technical"] .hero-nav { background:var(--surface);padding:12px; }
.demo[data-theme="technical"] .hero-copy { padding:16px;background:var(--surface);border-left:3px solid var(--accent); }
.demo[data-theme="technical"] .hero-bottom { padding:16px;border:1px solid var(--border);background:var(--surface); }
.demo[data-theme="technical"] .space-card { grid-template-columns:60px 1fr;gap:12px;border-left:3px solid var(--accent); }
.demo[data-theme="technical"] .space-card .meta { font-size:10px; }
.demo[data-theme="technical"] .tablist { gap:0;padding:0; }
.demo[data-theme="technical"] [role="tab"][aria-selected="true"] { border-bottom:3px solid var(--accent); }
.demo[data-theme="bold"] .hero-layout { grid-template-columns:1fr; }
.demo[data-theme="bold"] .hero-copy { position:relative;z-index:1; }
.demo[data-theme="bold"] .hero-copy h3 { max-width:9em;text-transform:uppercase; }
.demo[data-theme="bold"] .hero-layout figure { margin-left:18%;transform:rotate(-2deg);border:var(--bw) solid var(--text);box-shadow:var(--shadow);background:var(--surface); }
.demo[data-theme="bold"] figcaption { padding:10px; }
.demo[data-theme="bold"] .hero-bottom { border-top:3px solid var(--text); }
.demo[data-theme="bold"] .space-card { grid-template-columns:1fr; }
.demo[data-theme="bold"] .space-card .art { aspect-ratio:3/1; }
.demo[data-theme="bold"] .card-info { grid-template-columns:1fr auto; }
.demo[data-theme="bold"] .card-info .meta { grid-column:1/-1; }
.demo[data-theme="bold"] [role="tab"][aria-selected="true"] { background:var(--accent);border-color:var(--text);color:var(--onAccent); }
@container (max-width:${t.layout.breakpoint}px) {
 .demo .hero-layout { grid-template-columns:1fr;gap:22px; }
 .demo .hero-copy,.demo[data-theme="editorial"] .hero-copy { grid-column:auto;grid-row:auto; }
 .demo .hero-copy h3 { font-size:var(--mobile-title); }
 .demo[data-theme="editorial"] .hero-layout figure { grid-column:auto;grid-row:auto;padding-top:0; }
 .demo[data-theme="bold"] .hero-layout figure { margin-left:8%; }
 .demo .hero-bottom { grid-template-columns:1fr;gap:16px; }
 .demo .form-row { grid-template-columns:1fr; }
 .demo .space-card { padding:16px; }
 .demo .hero-nav .meta { display:none; }
}
@media (max-width:${t.layout.breakpoint}px) {
 .demo { padding:var(--mobile-pad); }
 .demo dialog { position:fixed;inset:auto 0 0;margin:0 auto;max-width:100vw;width:100%;border-radius:var(--radius) var(--radius) 0 0; }
}
@media (prefers-reduced-motion:reduce) { .demo *,.demo *::before,.demo *::after { transition:none!important;animation:none!important;scroll-behavior:auto!important; } }
`;
}
export function artwork() {
  return `<svg class="art" viewBox="0 0 480 360" role="img" aria-label="아치 창으로 빛이 들어오는 작업실 일러스트"><rect width="480" height="360" fill="#dcd4c4"/><path d="M75 270V130a80 80 0 0 1 160 0v140" fill="#b7c5ba"/><path d="M155 50v220M75 155h160" fill="none" stroke="#f9f6eb" stroke-width="9"/><path d="M0 292l480-50v118H0" fill="#c0ae93"/><path d="M145 270l120-52 188 35-125 68z" fill="#9b7653"/><path d="M161 274v62m264-78v70m-105-17v49" stroke="#655746" stroke-width="9"/><path d="M276 223v-51h31v56" fill="#435c49"/><ellipse cx="291" cy="173" rx="38" ry="31" fill="#687b5a"/><path d="M217 233l44-15 47 9-44 17z" fill="#faf4e5"/><path d="M58 288l58-8v47l-58 8z" fill="#745b48"/><path d="M63 327v30m47-34v28" stroke="#584c3f" stroke-width="7"/><path d="M320 42h115m-68 0v105" stroke="#a99d88" stroke-width="3"/><path d="M334 147h67l-12-35h-43z" fill="#faf4e5"/><circle cx="381" cy="245" r="9" fill="#eee4d1"/></svg>`;
}
export function markup(t, key) {
  const btn=(label,action,extra='')=>`<button type="${action==='submit'?'submit':'button'}" class="btn" data-action="${action}" ${extra}>${label}</button>`;
  const dialog=`<dialog aria-labelledby="confirm-title-${key}"><div class="stack"><span class="meta">LOCAL PREVIEW / 확인</span><h4 id="confirm-title-${key}">나를 위한 두 시간</h4><p>창가의 작업실 · 10:00–12:00<br>1인 / 2시간 / 12,000원</p><p class="muted">연습 화면입니다. 실제 예약·결제는 발생하지 않습니다.</p><div class="row">${btn('선택 완료','confirm')}${btn('취소','close')}</div></div></dialog>`;
  const tabs=(prefix)=>`<div data-tabs><div class="tablist" role="tablist" aria-label="작업실 정보"><button type="button" role="tab" id="${prefix}-tab-0" aria-selected="true" aria-controls="${prefix}-panel-0" tabindex="0">공간 소개</button><button type="button" role="tab" id="${prefix}-tab-1" aria-selected="false" aria-controls="${prefix}-panel-1" tabindex="-1">이용 일정</button></div><div class="tab-panel" id="${prefix}-panel-0" role="tabpanel" tabindex="0" aria-labelledby="${prefix}-tab-0"><h4>작은 일에 깊이 몰입하기</h4><p>자연광, 넓은 책상, 조용한 두 시간. Wi-Fi와 차 한 잔을 준비합니다.</p></div><div class="tab-panel" id="${prefix}-panel-1" role="tabpanel" tabindex="0" aria-labelledby="${prefix}-tab-1" hidden><h4>오늘의 이용 시간</h4><p>오전 10:00–12:00 / 오후 14:00–16:00<br>각 시간대 최대 4명 · 입실 10분 전 안내</p></div></div>`;
  if(key==='hero') return `<div class="hero"><div class="hero-nav row spread"><span class="wordmark">MORI.</span><span class="meta">SPACE FOR YOUR NEXT IDEA</span><button type="button" class="btn secondary" data-action="open">이용 안내 ↗</button></div><div class="hero-layout"><div class="hero-copy"><span class="meta">작은 작업실 / 서울 · 연남</span><h3>생각이<br>머무는 자리.</h3><p>분주한 하루에서 잠깐 벗어나,<br>당신의 다음 아이디어를 위한 공간을 만나세요.</p><div class="row">${btn('공간 선택하기 ↗','open')}<span class="meta">2시간 · 12,000원</span></div></div><figure>${artwork()}<figcaption>01 — 창가의 작업실 / 직접 그린 공간 일러스트</figcaption></figure></div><div class="hero-bottom"><div><span class="meta">오늘의 공간</span><p class="metric">창가의 작업실</p><p class="muted">자연광 · 1–4명 · 차 한 잔</p></div><div>${tabs('hero')}</div></div>${dialog}<p class="feedback" role="status" data-result></p></div>`;
  if(key==='button') return `<div class="stack"><span class="meta">PRIMARY ACTION / 상태를 골라보세요</span><div class="row">${btn('공간 저장하기','toggle','aria-pressed="false" data-state-target')}${btn('선택 불가','none','disabled')}</div><label class="state-label">버튼 상태 <select data-state-select><option value="default">기본</option><option value="hover">Hover · 올림</option><option value="focus">Focus · 초점 표시</option><option value="active">Active · 누름</option><option value="disabled">Disabled · 비활성</option></select></label><p class="feedback" role="status" data-result>아직 저장하지 않았습니다.</p></div>`;
  if(key==='form') return `<form novalidate class="stack"><span class="meta">KEEP IN TOUCH / 예약 알림</span><label for="demo-email">이메일</label><div class="form-row"><input id="demo-email" type="email" autocomplete="email" placeholder="you@example.com" aria-describedby="email-feedback" required>${btn('알림 신청','submit')}</div><p class="feedback" id="email-feedback" role="status">체험용입니다. 이메일은 전송되지 않습니다.</p><button type="reset" class="btn secondary">입력 초기화</button></form>`;
  if(key==='card') return `<div class="row motion-controls">${btn('재생','play')}${btn('일시정지','pause')}${btn('다시 보기','replay')}${btn('초기화','reset')}</div><label class="state-label">재생 속도 <select data-speed><option value="1">1× · 실제 속도</option><option value="4">0.25× · 느리게 관찰</option></select></label><p class="feedback" role="status" data-motion-status>재생 버튼을 눌러 등장 순서를 확인하세요.</p><div class="card-set">${['창가의 작업실','오후의 테이블','고요한 코너'].map((n,i)=>`<div class="space-card" data-entrance>${artwork()}<div class="card-info"><span class="meta">SPACE 0${i+1} / 2H</span><h4>${n}</h4>${btn('공간 저장','toggle','aria-pressed="false"')}</div></div>`).join('')}</div>`;
  if(key==='tabs') return tabs('gallery');
  if(key==='accordion') return `<div class="stack"><span class="meta">BEFORE YOUR VISIT / 이용 규칙</span>${[['어떤 물건이 준비되어 있나요?','콘센트, 무선 인터넷, 물과 차를 제공합니다. 개인 노트북과 필기구만 가져오세요.'],['일정을 바꾸고 싶어요.','이 화면은 조작 연습용입니다. 실제 서비스에서는 이용 하루 전 변경 가능 여부를 명확히 안내하세요.'],['조용히 통화할 수 있나요?','집중을 위해 작업 공간에서는 이어폰을 사용하고, 통화는 바깥 휴게 공간을 이용하세요.']].map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`;
  if(key==='dialog') return `<div class="stack"><span class="meta">A MOMENT TO CONFIRM / 선택 확인</span><h4>잠시 멈추고, 한 번 더.</h4><p class="muted">이용 시간과 공간을 확인하는 짧은 단계입니다.</p>${btn('예약 내용 확인','open')}${dialog}<p class="feedback" role="status" data-result>버튼을 눌러 열기와 닫기를 체험하세요.</p></div>`;
  if(key==='scroll') return `<div class="row motion-controls">${btn('다시 보기','scroll-reset')}${btn('일시정지','scroll-pause')}${btn('재생','scroll-play')}</div><p class="feedback" role="status" data-motion-status>아래 영역 안에서 스크롤하세요.</p><div class="scroll-box" tabindex="0" role="region" aria-label="공간 목록 스크롤 체험"><div class="scroll-intro"><span class="meta">SCROLL TO DISCOVER ↓</span><h4>다음 공간을<br>만나러 가는 길.</h4><p class="muted">이 상자 안에서만 스크롤됩니다.</p></div>${['창가의 작업실','오후의 테이블','고요한 코너','빛이 드는 라운지'].map((n,i)=>`<div class="scroll-item" data-scroll-item><span class="meta">0${i+1} / 공간 발견</span><h4>${n}</h4></div>`).join('')}</div>`;
  return '';
}

// Kept closure-free so copied examples run with the exact same behavior.
export function wireDemo(root,t) {
  const controller=new AbortController(), signal=controller.signal;
  const listen=(el,event,fn)=>el?.addEventListener(event,fn,{signal});
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const allAnimations=new Set(); let entrance=[], paused=false, opener=null, closing=false, scrollPaused=false, runGeneration=0;
  const say=(text)=>{ const el=root.querySelector('[data-motion-status]'); if(el) el.textContent=text; };
  function animate(el,kind='in',delay=0) {
    if(reduced.matches) return null;
    const start={opacity:0,transform:`translate(${kind==='tab'?t.motion.tabX:0}px,${t.motion.y}px) scale(${t.motion.scale})`};
    const end={opacity:1,transform:'translate(0,0) scale(1)'};
    const rate=Number(root.querySelector('[data-speed]')?.value||1);
    const animation=el.animate(kind==='out'?[end,start]:[start,end],{duration:(kind==='out'?t.motion.close:t.motion.duration)*rate,easing:t.motion.ease,delay:delay*rate,fill:'backwards'});
    allAnimations.add(animation);targetObserver.observe(el);if(!inView(el)){animation.pause();suspended.add(animation);}
    const release=()=>{allAnimations.delete(animation);suspended.delete(animation);};animation.finished.then(release,release); return animation;
  }
  function cancelAll(){ runGeneration++;allAnimations.forEach(a=>a.cancel());allAnimations.clear();suspended.clear();entrance=[]; }
  function play(restart=false) {
    if(!restart && paused && entrance.some(a=>a.playState==='paused')) { paused=false;entrance.forEach(resume);say('재생 중');return; }
    cancelAll();paused=false;const generation=runGeneration;
    entrance=[...root.querySelectorAll('[data-entrance]')].map((el,i)=>animate(el,'in',i*t.motion.stagger)).filter(Boolean);
    say(reduced.matches?'동작 줄이기: 최종 상태를 바로 표시합니다.':'재생 중');
    Promise.all(entrance.map(a=>a.finished.catch(()=>null))).then(()=>{ if(!signal.aborted && !paused && generation===runGeneration) say(reduced.matches?'동작 줄이기: 최종 상태입니다.':'재생 완료 · 다시 볼 수 있습니다.'); });
  }
  const dialog=root.querySelector('dialog');
  function open(trigger) { if(!dialog || dialog.open)return;opener=trigger;closing=false;dialog.showModal();animate(dialog);dialog.querySelector('button')?.focus(); }
  function close() { if(!dialog?.open || closing)return;closing=true;const a=animate(dialog,'out');const done=()=>{if(!signal.aborted){dialog.close();closing=false;opener?.focus();}};if(a)a.finished.then(done,done);else done(); }
  listen(dialog,'cancel',e=>{e.preventDefault();close();});
  listen(dialog,'click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
  listen(root,'click',e=>{
    const button=e.target.closest('button[data-action]');if(!button || button.disabled)return;
    const action=button.dataset.action;
    if(action==='open')open(button);
    if(action==='close')close();
    if(action==='confirm'){ const out=root.querySelector('[data-result]');if(out)out.textContent='선택 완료 — 로컬 체험이 끝났습니다. 실제 예약은 발생하지 않았습니다.';close(); }
    if(action==='toggle'){const yes=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(yes));button.textContent=yes?'저장됨 ✓':'공간 저장';const out=root.querySelector('[data-result]');if(out)out.textContent=yes?'이 체험에서 공간을 저장했습니다.':'저장을 해제했습니다.';}
    if(action==='play')play();
    if(action==='replay')play(true);
    if(action==='pause'){entrance.forEach(a=>a.pause());paused=true;say('일시정지 · 재생으로 이어보세요.');}
    if(action==='reset'){cancelAll();paused=false;say('초기화 완료 · 콘텐츠는 보이는 상태입니다.');root.querySelectorAll('[aria-pressed]').forEach(b=>{b.setAttribute('aria-pressed','false');b.textContent='공간 저장';});}
    if(action==='scroll-reset'){cancelAll();seen.clear();root.querySelector('.scroll-box').scrollTop=0;scrollPaused=false;say('처음으로 돌아왔습니다. 다시 스크롤하세요.');}
    if(action==='scroll-pause'){scrollPaused=true;allAnimations.forEach(a=>a.pause());say('스크롤 모션 일시정지');}
    if(action==='scroll-play'){scrollPaused=false;allAnimations.forEach(resume);checkScroll();say('스크롤 모션 재생');}
  });
  const state=root.querySelector('[data-state-select]');
  listen(state,'change',()=>{const target=root.querySelector('[data-state-target]');target.dataset.state=state.value;target.disabled=state.value==='disabled';});
  const form=root.querySelector('form'), input=form?.querySelector('input'), feedback=form?.querySelector('.feedback');
  listen(form,'submit',e=>{e.preventDefault();const ok=input.value.trim()!==''&&input.validity.valid;input.setAttribute('aria-invalid',String(!ok));input.dataset.valid=String(ok);feedback.dataset.tone=ok?'success':'error';feedback.textContent=ok?'신청 완료 — 전송하지 않은 로컬 성공 상태입니다.':'입력 오류 — 올바른 이메일을 입력하세요. 예: you@example.com';if(!ok)input.focus();});
  listen(input,'input',()=>{input.removeAttribute('aria-invalid');delete input.dataset.valid;feedback.removeAttribute('data-tone');feedback.textContent='입력을 마친 뒤 알림 신청을 눌러주세요.';});
  listen(form,'reset',()=>{input.removeAttribute('aria-invalid');delete input.dataset.valid;feedback.removeAttribute('data-tone');feedback.textContent='체험용입니다. 이메일은 전송되지 않습니다.';});
  root.querySelectorAll('[data-tabs]').forEach(group=>{
    const tabs=[...group.querySelectorAll('[role="tab"]')],panels=[...group.querySelectorAll('[role="tabpanel"]')];
    function select(i,focus=false){tabs.forEach((tab,k)=>{tab.setAttribute('aria-selected',String(i===k));tab.tabIndex=i===k?0:-1;panels[k].hidden=i!==k;});if(focus)tabs[i].focus();animate(panels[i],'tab');}
    tabs.forEach((tab,i)=>{listen(tab,'click',()=>select(i));listen(tab,'keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();select(next,true);}});});
  });
  root.querySelectorAll('details').forEach(el=>listen(el,'toggle',()=>{if(el.open)animate(el.querySelector('p'));}));
  const seen=new Set(), scrollBox=root.querySelector('.scroll-box');
  function checkScroll(){if(!scrollBox||scrollPaused)return;const r=scrollBox.getBoundingClientRect();root.querySelectorAll('[data-scroll-item]').forEach(el=>{const b=el.getBoundingClientRect();if(!seen.has(el)&&Math.min(r.bottom,b.bottom)-Math.max(r.top,b.top)>=b.height*.25){seen.add(el);animate(el);}});}
  listen(scrollBox,'scroll',checkScroll);
  const suspended=new Set();
  function inView(el){const r=el.getBoundingClientRect();return !document.hidden&&(el.tagName==='DIALOG'&&el.open||r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth);}
  function resume(a){if(inView(a.effect.target)){a.play();suspended.delete(a);}else{a.pause();suspended.add(a);}}
  const targetObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{allAnimations.forEach(a=>{if(a.effect?.target!==entry.target)return;if(!entry.isIntersecting&&!(entry.target.tagName==='DIALOG'&&entry.target.open)){if(a.playState==='running'){a.pause();suspended.add(a);}}else if(suspended.has(a)&&!paused&&!scrollPaused&&!document.hidden){a.play();suspended.delete(a);}});});},{threshold:0});
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting){allAnimations.forEach(a=>{if(a.playState==='running'&&!(a.effect?.target?.tagName==='DIALOG'&&a.effect.target.open)){a.pause();suspended.add(a);}});}else {suspended.forEach(a=>{if(!paused&&!scrollPaused&&inView(a.effect.target)){a.play();suspended.delete(a);}});checkScroll();}});},{threshold:0});observer.observe(root);
  listen(document,'visibilitychange',()=>{if(document.hidden){allAnimations.forEach(a=>{if(a.playState==='running'){a.pause();suspended.add(a);}});}else{const r=root.getBoundingClientRect();if((r.bottom>0&&r.top<innerHeight)||dialog?.open){suspended.forEach(a=>{if(!paused&&!scrollPaused&&inView(a.effect.target)){a.play();suspended.delete(a);}});}}});
  listen(reduced,'change',()=>{if(reduced.matches){cancelAll();say('동작 줄이기: 최종 상태를 바로 표시합니다.');}});
  return ()=>{controller.abort();observer.disconnect();targetObserver.disconnect();cancelAll();if(dialog?.open)dialog.close();};
}

export function standalone(t,key) {
  // The bundle embeds config, artwork, markup, styles and behavior. No network dependency.
  const script=`const t=${JSON.stringify(t).replace(/</g,'\\u003c')};\n${artwork.toString()}\n${markup.toString()}\n${wireDemo.toString()}\nconst host=document.querySelector('ui-demo');const shadow=host.attachShadow({mode:'open'});shadow.innerHTML=${JSON.stringify(`<style>:host{display:block} ${demoCSS(t)}</style><section class="demo" data-theme="${t.id}">${markup(t,key)}</section>`).replace(/</g,'\\u003c')};wireDemo(shadow.querySelector('.demo'),t);`;
  return `<!doctype html>\n<html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${t.name} · ${key}</title>\n<!-- 단일 HTML. 최신 Chrome/Edge/Firefox/Safari. 외부 의존성 없음. Shadow DOM·dialog·WAAPI·container query 사용. -->\n<body style="margin:0;padding:16px;background:${t.colors.background}"><ui-demo></ui-demo><script type="module">${script.replace(/<\/script/gi,'<\\/script')}<\/script></body></html>`;
}
