import {concepts,conceptById,conceptForItem} from './site-concepts.js?v=20261019-concepts4';
import {collectionMarkup} from './collection-home.js?v=20261019-concepts4';
import {siteOrder,websiteItems as catalog,siteKinds as kinds,siteRules as detailRules,sitePrompt as promptFor} from './site-catalog.js?v=20261019-concepts4';
import {designMarkup,designWire} from './gallery-design.js?v=20261019-concepts4';
import {mountSite as mount,standaloneSite as standalone} from './site-runtime.js?v=20261019-concepts4';

const url = new URL(location.href);
const pageConcept = conceptById(document.body.dataset.galleryConcept || url.searchParams.get('concept') || (document.body.dataset.galleryView==='design'?'paper':''));
const items = catalog.filter(item => !pageConcept || pageConcept.componentIds.includes(item.id)).sort((a,b)=>(pageConcept?pageConcept.componentIds:siteOrder).indexOf(a.id)-(pageConcept?pageConcept.componentIds:siteOrder).indexOf(b.id));
const host = document.getElementById('component-gallery');
const shadow = host.attachShadow({ mode: 'open' });
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${({search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',arrow:'<path d="M6 18 18 6M7 6h11v11"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',prev:'<path d="m14 6-6 6 6 6"/>',next:'<path d="m10 6 6 6-6 6"/>',reset:'<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',play:'<path d="m9 5 10 7-10 7Z"/>'})[name]}</svg>`;
const base = new URL(document.body.dataset.galleryBase || './', location.href);
const hrefFor=(id,view='components')=>new URL(id+'/'+(view==='design'?'#design':''),base).href;
const homePage=document.body.dataset.galleryHome==='true';
let homeMode=homePage&&!location.hash&&!url.search;
let section = location.hash === '#design' || (!location.hash && document.body.dataset.galleryView === 'design') ? 'design' : 'components';
let query = url.searchParams.get('q') || '';
let kind = Object.keys(kinds).includes(url.searchParams.get('kind')) ? url.searchParams.get('kind') : 'all';
let active = null, detailAPI = null, opener = null, previousOverflow = '', currentPane = 'guide', savedScroll = 0;
const instances = new Map(), snapshots = new Map(), visible = new Set();
const homeInstances=new Map(),homeVisible=new Set();
const usedKinds = Object.entries(kinds).filter(([key]) => key === 'all' || items.some(item => item.kind === key));
const reducedMedia = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = reducedMedia.matches;

function filterButtons(){return usedKinds.map(([key,name])=>`<button type="button" data-kind="${key}" aria-pressed="${kind===key}">${esc(name)}<span>${key==='all'?items.length:items.filter(i=>i.kind===key).length}</span></button>`).join('');}
function setSection(next,update=true){section=next;shadow.getElementById('collection-view').hidden=next!=='components';shadow.getElementById('design-view').hidden=next!=='design';shadow.querySelector('.side-categories').hidden=next!=='components';shadow.querySelector('.search-form').hidden=next!=='components';shadow.querySelector('[data-breadcrumb]').textContent=next==='design'?'디자인 기준':'컴포넌트';shadow.querySelectorAll('[data-section]').forEach(b=>b.setAttribute('aria-current',b.dataset.section===next?'page':'false'));if(update)history.replaceState(null,'',location.pathname+location.search+(next==='design'?'#design':document.body.dataset.galleryView==='design'?'#components':''));}
function setHome(value){homeMode=value;shadow.getElementById('home-view').hidden=!value;shadow.querySelector('.library').hidden=value;homeInstances.forEach((api,id)=>{if(value&&homeVisible.has(id))api.continue();else api.suspend();});}
shadow.innerHTML = `
<link rel="stylesheet" href="${new URL('./gallery.css?v=20261019-concepts4', import.meta.url).href}">
<a class="skip" href="#home-view">본문으로 건너뛰기</a>
<div class="site-shell" data-concept="${pageConcept?.id||'all'}">
<header class="site-header"><a class="site-brand" href="${base.href}" aria-label="컨셉 컬렉션 홈">UI<span>·</span>모션</a><nav class="site-nav" aria-label="사이트 탐색"><a href="${base.href}" ${homeMode?'aria-current="page"':''}>컨셉 컬렉션</a><a href="${new URL('components/',base)}" ${!pageConcept&&!homePage?'aria-current="page"':''}>모든 컴포넌트 <span>${catalog.length}</span></a></nav></header>
<main id="home-view" tabindex="-1" ${homeMode?'':'hidden'}>${collectionMarkup(concepts,hrefFor)}</main>
<main class="library" data-concept="${pageConcept?.id||'all'}" ${homeMode?'hidden':''}>
  <aside class="sidebar"><div class="concept-switcher"><p>컨셉</p>${concepts.map(c=>`<a class="concept-link" href="${hrefFor(c.id)}" ${c.id===pageConcept?.id?'aria-current="page"':''}><span>${esc(c.name)}</span><small>${esc(c.label)}</small></a>`).join('')}</div>
    <nav class="section-nav" aria-label="${pageConcept?esc(pageConcept.name):'전체'} 탐색"><button type="button" data-section="components">컴포넌트 <span>${items.length}</span></button><button type="button" data-section="design">디자인 기준</button></nav>
    <div class="side-categories" role="group" aria-label="컴포넌트 분류">${filterButtons()}</div>
  </aside>
  <div class="workspace"><header class="topbar"><p class="breadcrumb">${esc(pageConcept?.name||'모든 컨셉')} / <strong data-breadcrumb>컴포넌트</strong></p><form class="search-form" role="search" aria-label="컴포넌트 찾기"><label class="search">${icon('search')}<input id="search" type="search" aria-label="컴포넌트 검색" placeholder="이름이나 용도로 검색" autocomplete="off" value="${esc(query)}"><button type="button" data-clear-query aria-label="검색어 지우기" ${query?'':'hidden'}>${icon('close')}</button></label></form></header>
  <section id="collection-view"><header class="intro"><p class="eyebrow">${esc(pageConcept?.eyebrow||'ALL INTERFACES')}</p><h1 id="gallery-title">${esc(pageConcept?.name||'모든 컴포넌트')}<span>${esc(pageConcept?.label||catalog.length)}</span></h1></header>
  <div class="mobile-filter"><details><summary>컴포넌트 분류</summary><div class="kind-filters" role="group" aria-label="모바일 컴포넌트 분류">${filterButtons()}</div></details></div>
  <div class="results"><p id="result-count" role="status" aria-live="polite" aria-atomic="true"></p><span class="hint">목록에서 직접 조작 · 자세히 보기에서 코드 확인</span></div>
  <section id="component-list" class="grid" aria-label="컴포넌트 목록" tabindex="-1">
    ${items.map((item,i)=>`<article class="specimen" data-id="${item.id}" data-concept="${item.conceptId}" aria-labelledby="name-${item.id}"><header class="card-meta"><span class="card-kicker">${String(i+1).padStart(2,'0')} / ${esc(kinds[item.kind])}${pageConcept?'':' · '+conceptForItem(item).name}</span><h2 id="name-${item.id}">${esc(item.name)}</h2></header><div class="stage"><div class="demo-host" data-demo-host="${item.id}"><p class="pending">${esc(item.name)} 불러오는 중</p></div></div><footer class="card-footer"><div class="card-tools"><button class="reset-card" type="button" data-card-reset="${item.id}" aria-label="${esc(item.name)} 초기화">${icon('reset')}</button><button class="open-demo" type="button" data-open="${item.id}" aria-label="${esc(item.name)} 자세히 보기">자세히 보기 ${icon('arrow')}</button></div></footer></article>`).join('')}
    <div class="empty" hidden><h2>일치하는 컴포넌트가 없습니다.</h2><p>다른 검색어를 입력하거나 분류를 전체로 바꿔보세요.</p><button type="button" class="button" data-clear>검색·필터 초기화</button></div>
  </section></section>
  <section id="design-view" hidden>${pageConcept?designMarkup(pageConcept):`<div class="design-system"><header class="design-lead"><div><p class="eyebrow">THREE VISUAL SYSTEMS</p><h1>컨셉별 디자인 기준</h1></div></header>${collectionMarkup(concepts,hrefFor)}</div>`}</section>
  </div>
</main></div>
<dialog class="viewer" aria-labelledby="detail-title">
  <header class="viewer-head"><div><p class="viewer-kicker" id="detail-position"></p><h2 id="detail-title"></h2></div><nav class="viewer-nav" aria-label="컴포넌트 탐색"><button type="button" data-prev aria-label="이전 컴포넌트">${icon('prev')}</button><button type="button" data-next aria-label="다음 컴포넌트">${icon('next')}</button><button type="button" class="close" data-close aria-label="상세 닫기">${icon('close')}<span>닫기</span></button></nav></header>
  <div class="viewer-body"><section class="viewer-main" aria-label="컴포넌트 체험"><div class="demo-frame"></div><div class="demo-actions"><button type="button" class="button" data-reset>${icon('reset')}초기화</button><button type="button" class="button" data-show-code>실행 코드</button><label class="reduce"><input id="reduced" type="checkbox" ${reduced ? 'checked' : ''}>모션 줄이기</label></div><p class="viewer-status" role="status" id="demo-status"></p></section>
    <details class="inspector" open><summary>사용 방법과 실행 코드</summary><aside class="inspector-inner"><p class="inspector-title">이 컴포넌트 가져가기</p><div class="tabs" role="tablist" aria-label="컴포넌트 정보">${[['guide','사용 방법'],['code','실행 코드'],['prompt','프롬프트']].map(([key,label],i) => `<button type="button" role="tab" id="tab-${key}" aria-selected="${i===0}" aria-controls="pane-${key}" tabindex="${i===0?0:-1}" data-pane="${key}">${label}</button>`).join('')}</div><div class="pane" id="pane-guide" role="tabpanel" aria-labelledby="tab-guide" tabindex="0"></div>${['code','prompt'].map(key => `<div class="pane" id="pane-${key}" role="tabpanel" aria-labelledby="tab-${key}" hidden><p>${key==='code'?'스타일·동작·토큰이 포함된 단일 HTML입니다. 저장해서 브라우저로 열면 바로 동작합니다.':'실제 동작과 수치를 설명하는 구현 명세입니다. 프로젝트의 데이터와 이벤트에 맞게 적용하세요.'}</p><label class="code-label" for="copy-${key}">${key==='code'?'실행 HTML':'구현 프롬프트'}</label><textarea class="code-input" id="copy-${key}" readonly spellcheck="false"></textarea><div class="code-meta" data-size="${key}"></div><div class="copy-actions"><button type="button" class="button primary" data-copy="${key}">복사</button><button type="button" class="button" data-download="${key}">다운로드</button><button type="button" class="button" data-select="${key}">전체 선택</button></div><p class="copy-feedback" role="status" data-copy-status="${key}"></p>${key==='code'?'<p class="code-hint">외부 의존성 없음 · 한국어 샘플 데이터 포함. 실제 서비스에서는 로컬 샘플을 서비스 데이터로 연결하세요.</p>':''}</div>`).join('')}</aside></details>
  </div>
</dialog>`;

const dialog = shadow.querySelector('.viewer');
const input = shadow.getElementById('search');
const inspector = shadow.querySelector('.inspector');
function matching() {
  const text = query.trim().toLocaleLowerCase('ko');
  return items.filter(item => (kind === 'all' || item.kind === kind) && `${item.name} ${item.legacyName} ${item.description} ${item.use} ${item.key} ${kinds[item.kind]}`.toLocaleLowerCase('ko').includes(text));
}
function mountCard(id) {
  if (instances.has(id)) return instances.get(id);
  const item = items.find(item => item.id === id);
  const api = mount(shadow.querySelector(`[data-demo-host="${id}"]`), item);
  api.setReduced(reduced);
  if (snapshots.has(id)) api.restore(snapshots.get(id), true);
  instances.set(id, api);
  return api;
}
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const card = entry.target, id = card.dataset.id;
    if (entry.isIntersecting && !card.hidden) {
      visible.add(id);
      const api = mountCard(id);
      if (!dialog.open) api.continue();
    } else {
      visible.delete(id);
      instances.get(id)?.suspend();
    }
  }
}, { rootMargin: '120px 0px', threshold: 0 });
shadow.querySelectorAll('.specimen').forEach(card => observer.observe(card));
const homeObserver=new IntersectionObserver(entries=>{for(const entry of entries){const host=entry.target,id=host.dataset.homeDemo,item=catalog.find(x=>x.id===id);if(!item)continue;if(entry.isIntersecting&&(homeMode||(!pageConcept&&section==='design'))){homeVisible.add(id);if(!homeInstances.has(id)){const api=mount(host,item);api.setReduced(reduced);homeInstances.set(id,api);}if(!dialog.open)homeInstances.get(id).continue();}else{homeVisible.delete(id);homeInstances.get(id)?.suspend();}}},{rootMargin:'80px 0px'});
shadow.querySelectorAll('[data-home-demo]').forEach(host=>homeObserver.observe(host));
function filter(updateURL = true) {
  const results = matching(), ids = new Set(results.map(item => item.id));
  shadow.querySelectorAll('.specimen').forEach(card => {
    card.hidden = !ids.has(card.dataset.id);
    if (card.hidden) instances.get(card.dataset.id)?.suspend();
  });
  shadow.querySelector('.empty').hidden = results.length > 0;
  shadow.getElementById('result-count').innerHTML = `<strong>${results.length}개</strong> / 전체 ${items.length}개${kind !== 'all' ? ` · ${esc(kinds[kind])}` : ''}`;
  shadow.querySelector('[data-clear-query]').hidden = !query;
  shadow.querySelector('.mobile-filter summary').textContent = kind==='all'?'컴포넌트 분류':kinds[kind]+' · 분류 변경';
  shadow.querySelectorAll('[data-kind]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.kind===kind)));

  if (updateURL) {
    const next = new URL(location.href);
    if (query) next.searchParams.set('q', query); else next.searchParams.delete('q');
    if (kind !== 'all') next.searchParams.set('kind', kind); else next.searchParams.delete('kind');
    history.replaceState(null, '', next);
  }
}
function resetFilters() {
  query = ''; kind = 'all'; input.value = ''; filter(); input.focus();
}
function storeDetail() {
  if (!active || !detailAPI) return;
  const state = detailAPI.snapshot();
  snapshots.set(active.id, state);
  instances.get(active.id)?.restore(state, true);
}
function setPane(key) {
  currentPane = key;
  shadow.querySelectorAll('[data-pane]').forEach(tab => {
    tab.setAttribute('aria-selected', String(tab.dataset.pane === key));
    tab.tabIndex = tab.dataset.pane === key ? 0 : -1;
  });
  for (const name of ['guide','code','prompt']) shadow.getElementById('pane-' + name).hidden = name !== key;
  if (key !== 'guide') {
    const box = shadow.getElementById('copy-' + key);
    box.value = key === 'code' ? standalone(active) : promptFor(active);
    shadow.querySelector(`[data-size="${key}"]`).textContent = `${(new Blob([box.value]).size / 1024).toFixed(1)} KB · ${key==='code'?'외부 파일 없이 실행':'텍스트 명세'}`;
    shadow.querySelector(`[data-copy-status="${key}"]`).textContent = '';
  }
}
function showItem(item) {
  storeDetail(); detailAPI?.destroy(); active = item;
  dialog.dataset.concept=item.conceptId;
  shadow.getElementById('detail-position').textContent = `${String(items.indexOf(item)+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')} · ${kinds[item.kind]}`;
  shadow.getElementById('detail-title').textContent = item.name;
  shadow.getElementById('pane-guide').innerHTML = `<dl class="usage-spec">${detailRules(item).map(([title,text])=>`<div><dt>${esc(title)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl>`;
  detailAPI = mount(shadow.querySelector('.demo-frame'), item, 'full');
  const state = instances.get(item.id)?.snapshot() || snapshots.get(item.id);
  if (state) detailAPI.restore(state, true);
  detailAPI.setReduced(reduced);
  shadow.getElementById('demo-status').textContent = '';
  inspector.open = innerWidth >= 800;
  shadow.querySelector('.viewer-main').scrollTop = 0;
  shadow.querySelector('.viewer-body').scrollTop = 0;
  shadow.querySelector('.inspector-inner').scrollTop = 0;
  setPane('guide');
}
function open(item, trigger = null, update = true) {
  if (!item) return;
  if (dialog.open) { showItem(item); return; }
  opener = trigger || shadow.querySelector(`[data-open="${item.id}"]`);
  savedScroll = scrollY; previousOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  instances.forEach(api => api.suspend());
  showItem(item); dialog.showModal(); shadow.querySelector('[data-close]').focus();
  if (update) history.pushState(null, '', '#' + item.id);
}
function close(update = true) {
  if (!dialog.open) return;
  storeDetail(); detailAPI?.destroy(); detailAPI = null; active = null; dialog.close();
  document.documentElement.style.overflow = previousOverflow;
  if (update) history.replaceState(null, '', location.pathname + location.search + (document.body.dataset.galleryView==='design'?'#components':''));
  opener?.focus({ preventScroll:true }); window.scrollTo({ top:savedScroll, behavior:'auto' });
  visible.forEach(id => instances.get(id)?.continue());
}
function navigate(delta) {
  const list = matching(), use = list.some(item => item.id === active.id) ? list : items;
  const next = use[(use.findIndex(item => item.id === active.id) + delta + use.length) % use.length];
  showItem(next); history.replaceState(null, '', '#' + next.id);
}
function revealCode() {
  inspector.open = true; setPane('code');
  shadow.getElementById('tab-code').focus();
  if (innerWidth < 800) inspector.scrollIntoView({block:'start',behavior:'auto'});
}
async function copy(key) {
  const box = shadow.getElementById('copy-' + key), status = shadow.querySelector(`[data-copy-status="${key}"]`);
  try { await navigator.clipboard.writeText(box.value); status.textContent = '복사했습니다. 프로젝트에서 이어서 사용하세요.'; }
  catch { box.focus(); box.select(); status.textContent = '선택한 내용을 Ctrl/Cmd+C로 복사하세요.'; }
}
function download(key) {
  const value = shadow.getElementById('copy-' + key).value;
  const blob = URL.createObjectURL(new Blob([value], {type:key==='code'?'text/html;charset=utf-8':'text/plain;charset=utf-8'}));
  const anchor = document.createElement('a'); anchor.href = blob; anchor.download = active.id + (key==='code'?'.html':'.txt'); anchor.click();
  setTimeout(() => URL.revokeObjectURL(blob), 1000);
  shadow.querySelector(`[data-copy-status="${key}"]`).textContent = '다운로드를 요청했습니다.';
}
input.addEventListener('input', event => { query = event.target.value; filter(); });
shadow.querySelector('.search-form').addEventListener('submit', event => event.preventDefault());
shadow.addEventListener('click', event => {
  const target = event.target.closest('button,a');
  if (!target) return;
  if (target.matches('.skip')) { event.preventDefault(); shadow.getElementById(homeMode?'home-view':'component-list').focus(); return; }
  if (target.dataset.open) { event.preventDefault(); open(items.find(item => item.id === target.dataset.open), target); return; }
  if (target.dataset.section) {setSection(target.dataset.section);window.scrollTo({top:0,behavior:'auto'});}
  if (target.dataset.cardReset) {mountCard(target.dataset.cardReset).reset();snapshots.delete(target.dataset.cardReset);}
  if (target.dataset.kind) {setSection('components'); kind = target.dataset.kind; filter(); const menu=target.closest('.mobile-filter details');if(menu){menu.open=false;menu.querySelector('summary').focus();} }
  if (target.hasAttribute('data-clear')) resetFilters();
  if (target.hasAttribute('data-clear-query')) { query = ''; input.value = ''; filter(); input.focus(); }
  if (target.hasAttribute('data-close')) close();
  if (target.hasAttribute('data-prev')) navigate(-1);
  if (target.hasAttribute('data-next')) navigate(1);
  if (target.hasAttribute('data-reset')) {detailAPI.reset();shadow.getElementById('demo-status').textContent='초기 상태로 돌아왔습니다.';}
  if (target.hasAttribute('data-show-code')) revealCode();
  if (target.dataset.pane) setPane(target.dataset.pane);
  if (target.dataset.copy) copy(target.dataset.copy);
  if (target.dataset.download) download(target.dataset.download);
  if (target.dataset.select) {
    const key = target.dataset.select, box = shadow.getElementById('copy-' + key); box.focus(); box.select();
    shadow.querySelector(`[data-copy-status="${key}"]`).textContent = '전체 선택했습니다. Ctrl/Cmd+C로 복사하세요.';
  }
});
shadow.querySelector('.tabs').addEventListener('keydown', event => {
  const tabs = [...shadow.querySelectorAll('[data-pane]')]; let index = tabs.indexOf(event.target);
  if (index < 0) return;
  if (event.key === 'ArrowRight') index = (index + 1) % tabs.length;
  else if (event.key === 'ArrowLeft') index = (index + tabs.length - 1) % tabs.length;
  else if (event.key === 'Home') index = 0;
  else if (event.key === 'End') index = tabs.length - 1;
  else return;
  event.preventDefault(); setPane(tabs[index].dataset.pane); tabs[index].focus();
});
shadow.getElementById('reduced').addEventListener('change', event => {
  reduced = event.target.checked || reducedMedia.matches;
  detailAPI?.setReduced(reduced); instances.forEach(api => api.setReduced(reduced)); homeInstances.forEach(api=>api.setReduced(reduced));
});
reducedMedia.addEventListener('change', event => {
  reduced = event.matches || shadow.getElementById('reduced').checked;
  detailAPI?.setReduced(reduced); instances.forEach(api => api.setReduced(reduced)); homeInstances.forEach(api=>api.setReduced(reduced));
});
dialog.addEventListener('cancel', event => { if (event.target === dialog) { event.preventDefault(); close(); } });
function readLocation() {
  const next = new URL(location.href);
  query = next.searchParams.get('q') || ''; kind = Object.keys(kinds).includes(next.searchParams.get('kind')) ? next.searchParams.get('kind') : 'all';
  input.value = query; filter(false);
  const hash=location.hash.slice(1);
  const legacy=catalog.find(item=>'ui-'+item.themeId+'-'+item.key===hash);
  const item = legacy || catalog.find(item => item.id === hash);
  if(item&&(homePage||!items.includes(item))){location.replace(new URL(conceptForItem(item).id+'/#'+item.id,base));return;}
  if(homePage&&['design','guide-sources'].includes(hash)){location.replace(new URL('paper/#design',base));return;}
  setHome(homePage&&!hash&&!next.search);
  if(['ui-dark-ai-hero','ui-light-project-hero','dark-ai--hero','light-project--hero'].includes(hash)){location.replace(new URL((hash.includes('dark-ai')?'ai-workspace/':'project-dashboard/')+'#'+(hash.includes('dark-ai')?'dark-ai':'light-project')+'--hero',base));return;}
  setSection(item?'components':hash==='design'||(!hash&&document.body.dataset.galleryView==='design')?'design':'components',false);
  if (item) { if (dialog.open && active?.id !== item.id) showItem(item); else if (!dialog.open) open(item, null, false); }
  else if (dialog.open) close(false);
  if(hash==='guide-sources')setSection('design',false);
  if(hash==='component-list')shadow.getElementById('component-list').scrollIntoView({block:'start'});
}
window.addEventListener('popstate', readLocation);
window.addEventListener('hashchange', readLocation);
window.addEventListener('pagehide', event => {
  instances.forEach(api => api.suspend()); homeInstances.forEach(api=>api.suspend()); detailAPI?.suspend();
  if (!event.persisted) { observer.disconnect();homeObserver.disconnect();homeInstances.forEach(api=>api.destroy()); instances.forEach(api => api.destroy()); detailAPI?.destroy(); disposeDesign(); }
});
window.addEventListener('pageshow', event => { if (event.persisted) { if (dialog.open) detailAPI?.continue(); else {visible.forEach(id => instances.get(id)?.continue());if(homeMode)homeVisible.forEach(id=>homeInstances.get(id)?.continue());} } });
const disposeDesign=designWire(shadow); filter(false); readLocation();
