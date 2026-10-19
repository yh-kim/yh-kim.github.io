import { catalog, kinds, detailRules, promptFor } from './data.js?v=20261019-gallery2';
import { mount, standalone } from './engine.js?v=20261019-gallery2';

const items = catalog.filter(item => item.key !== 'hero');
const host = document.getElementById('component-gallery');
const shadow = host.attachShadow({ mode: 'open' });
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${({search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',arrow:'<path d="M6 18 18 6M7 6h11v11"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',prev:'<path d="m14 6-6 6 6 6"/>',next:'<path d="m10 6 6 6-6 6"/>',reset:'<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',play:'<path d="m9 5 10 7-10 7Z"/>'})[name]}</svg>`;
const url = new URL(location.href);
let query = url.searchParams.get('q') || '';
let kind = Object.keys(kinds).includes(url.searchParams.get('kind')) ? url.searchParams.get('kind') : 'all';
let active = null, detailAPI = null, opener = null, previousOverflow = '', currentPane = 'guide', savedScroll = 0;
const instances = new Map(), snapshots = new Map(), visible = new Set();
const usedKinds = Object.entries(kinds).filter(([key]) => key === 'all' || items.some(item => item.kind === key));
const reducedMedia = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = reducedMedia.matches;
const motionKeys = new Set(['layers', 'controls', 'process', 'chart', 'tasks', 'filters', 'calendar', 'beam']);

shadow.innerHTML = `
<link rel="stylesheet" href="${new URL('./gallery.css?v=20261019-gallery2', import.meta.url).href}">
<a class="skip" href="#component-list">컴포넌트 목록으로 건너뛰기</a>
<main class="library">
  <header class="masthead">
    <a class="wordmark" href="./">컴포넌트 갤러리 <span>UI / MOTION</span></a>
    <nav aria-label="UI·모션 탐색"><a href="../">쇼케이스</a><a href="./" aria-current="page">컴포넌트</a><a href="/">블로그 ${icon('arrow')}</a></nav>
  </header>
  <section class="intro" aria-labelledby="gallery-title">
    <div><h1 id="gallery-title">컴포넌트 갤러리</h1><p>입력·선택·데이터·피드백. 직접 조작하고 코드를 가져가세요.</p></div>
    <p class="collection-note"><strong>${String(items.length).padStart(2, '0')}</strong>컴포넌트 · <span>직접 조작하는 예제</span></p>
  </section>
  <form class="toolbar" role="search" aria-label="컴포넌트 찾기">
    <label class="search">${icon('search')}<input id="search" type="search" aria-label="컴포넌트 검색" placeholder="이름, 용도, 동작으로 찾기" autocomplete="off" value="${esc(query)}"><button type="button" data-clear-query aria-label="검색어 지우기" ${query ? '' : 'hidden'}>${icon('close')}</button></label>
    <div class="filter-select"><label for="kind">분류</label><select id="kind">${usedKinds.map(([key, name]) => `<option value="${key}" ${key === kind ? 'selected' : ''}>${esc(name)} · ${key === 'all' ? items.length : items.filter(i => i.kind === key).length}</option>`).join('')}</select><button type="button" data-clear>초기화</button></div>
  </form>
  <div class="results"><p id="result-count" role="status" aria-live="polite" aria-atomic="true"></p><span class="hint">미리보기에서 직접 조작 · 상세에서 코드 가져가기</span></div>
  <section id="component-list" class="grid" aria-label="컴포넌트 목록" tabindex="-1">
    ${items.map((item, i) => `<article class="specimen" data-id="${item.id}" aria-labelledby="name-${item.id}"><div class="stage"><div class="demo-host" data-demo-host="${item.id}"><p class="pending">${esc(item.name)} 미리보기</p></div></div><div class="card-meta"><div><span class="card-kicker">${String(i + 1).padStart(2,'0')} / ${esc(kinds[item.kind])}</span><h2 id="name-${item.id}">${esc(item.name)}</h2><p>${esc(item.description)}</p></div><a class="open-demo" href="#${item.id}" data-open="${item.id}" aria-label="${esc(item.name)} 상세 보기">살펴보기 ${icon('arrow')}</a></div></article>`).join('')}
    <div class="empty" hidden><h2>일치하는 컴포넌트가 없습니다.</h2><p>다른 검색어를 입력하거나 분류를 전체로 바꿔보세요.</p><button type="button" class="button" data-clear>검색·필터 초기화</button></div>
  </section>
  <footer class="footer"><details><summary>제작 방식과 출처</summary><p>모든 예제는 브라우저 안에서 동작하는 샘플입니다. 입력한 내용은 서버에 전송하거나 영구 저장하지 않습니다. 미리보기·상세·실행 HTML은 같은 구현을 사용합니다.</p><p>기존 <a href="../ai-workspace/">AI Workspace</a> · <a href="../project-dashboard/">Project Dashboard</a>와 <a href="../../hidden-memo/ui-motion-guide/">가이드 글</a>의 경로를 유지했습니다. 외부 라이브러리·웹폰트·사진을 추가하지 않았습니다. 기존 노이즈 표면의 <a href="https://github.com/Seokwoooo/lucian-uxui-prompt/blob/036fe0a67048bc135115ae2ed283130567a15357/LICENSE">MIT © 2026 Seokwoooo</a> 고지는 실행 코드에 보존됩니다.</p></details><p class="footer-note">자동 재생 없이, 필요한 순간에만.</p></footer>
</main>
<dialog class="viewer" aria-labelledby="detail-title">
  <header class="viewer-head"><div><p class="viewer-kicker" id="detail-position"></p><h2 id="detail-title"></h2></div><nav class="viewer-nav" aria-label="컴포넌트 탐색"><button type="button" data-prev aria-label="이전 컴포넌트">${icon('prev')}</button><button type="button" data-next aria-label="다음 컴포넌트">${icon('next')}</button><button type="button" class="close" data-close aria-label="상세 닫기">${icon('close')}<span>닫기</span></button></nav></header>
  <div class="viewer-body"><section class="viewer-main" aria-label="컴포넌트 체험"><div class="demo-context"><p id="detail-description"></p></div><div class="demo-frame"></div><div class="demo-actions"><button type="button" class="button" data-replay>${icon('play')}다시 체험</button><button type="button" class="button" data-pause>일시정지</button><button type="button" class="button" data-reset>${icon('reset')}초기화</button><button type="button" class="button" data-show-code>실행 코드</button><label class="speed">속도 <select id="speed" aria-label="모션 재생 속도"><option value="1">1×</option><option value="4">0.25×</option></select></label><label class="reduce"><input id="reduced" type="checkbox" ${reduced ? 'checked' : ''}>모션 줄이기</label></div><p class="viewer-status" role="status" id="demo-status"></p></section>
    <details class="inspector" open><summary>사용 방법과 실행 코드</summary><aside class="inspector-inner"><p class="inspector-title">이 컴포넌트 가져가기</p><div class="tabs" role="tablist" aria-label="컴포넌트 정보">${[['guide','사용 방법'],['code','실행 코드'],['prompt','프롬프트']].map(([key,label],i) => `<button type="button" role="tab" id="tab-${key}" aria-selected="${i===0}" aria-controls="pane-${key}" tabindex="${i===0?0:-1}" data-pane="${key}">${label}</button>`).join('')}</div><div class="pane" id="pane-guide" role="tabpanel" aria-labelledby="tab-guide" tabindex="0"></div>${['code','prompt'].map(key => `<div class="pane" id="pane-${key}" role="tabpanel" aria-labelledby="tab-${key}" hidden><p>${key==='code'?'스타일·동작·토큰이 포함된 단일 HTML입니다. 저장해서 브라우저로 열면 바로 동작합니다.':'실제 동작과 수치를 설명하는 구현 명세입니다. 프로젝트의 데이터와 이벤트에 맞게 적용하세요.'}</p><label class="code-label" for="copy-${key}">${key==='code'?'실행 HTML':'구현 프롬프트'}</label><textarea class="code-input" id="copy-${key}" readonly spellcheck="false"></textarea><div class="code-meta" data-size="${key}"></div><div class="copy-actions"><button type="button" class="button primary" data-copy="${key}">복사</button><button type="button" class="button" data-download="${key}">다운로드</button><button type="button" class="button" data-select="${key}">전체 선택</button></div><p class="copy-feedback" role="status" data-copy-status="${key}"></p>${key==='code'?'<p class="code-hint">외부 의존성 없음 · 한국어 샘플 데이터 포함. 실제 서비스에서는 로컬 샘플을 서비스 데이터로 연결하세요.</p>':''}</div>`).join('')}</aside></details>
  </div>
</dialog>`;

const dialog = shadow.querySelector('.viewer');
const input = shadow.getElementById('search');
const inspector = shadow.querySelector('.inspector');
function matching() {
  const text = query.trim().toLocaleLowerCase('ko');
  return items.filter(item => (kind === 'all' || item.kind === kind) && `${item.name} ${item.description} ${item.use} ${item.key} ${kinds[item.kind]}`.toLocaleLowerCase('ko').includes(text));
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
function filter(updateURL = true) {
  const results = matching(), ids = new Set(results.map(item => item.id));
  shadow.querySelectorAll('.specimen').forEach(card => {
    card.hidden = !ids.has(card.dataset.id);
    if (card.hidden) instances.get(card.dataset.id)?.suspend();
  });
  shadow.querySelector('.empty').hidden = results.length > 0;
  shadow.getElementById('result-count').innerHTML = `<strong>${results.length}개</strong> / 전체 ${items.length}개${kind !== 'all' ? ` · ${esc(kinds[kind])}` : ''}`;
  shadow.querySelector('[data-clear-query]').hidden = !query;
  shadow.querySelector('.filter-select [data-clear]').disabled = !query && kind === 'all';
  if (updateURL) {
    const next = new URL(location.href);
    if (query) next.searchParams.set('q', query); else next.searchParams.delete('q');
    if (kind !== 'all') next.searchParams.set('kind', kind); else next.searchParams.delete('kind');
    history.replaceState(null, '', next);
  }
}
function resetFilters() {
  query = ''; kind = 'all'; input.value = ''; shadow.getElementById('kind').value = 'all'; filter(); input.focus();
}
function storeDetail() {
  if (!active || !detailAPI) return;
  const state = detailAPI.snapshot();
  snapshots.set(active.id, state);
  instances.get(active.id)?.restore(state, true);
}
function specMarkup(title, text) {
  if (title === '토큰 원본') return `<pre>${esc(text)}</pre>`;
  return `<dl class="spec">${text.split('\n').map(line => {
    const at = line.indexOf(': ');
    return at > 0 ? `<div><dt>${esc(line.slice(0, at))}</dt><dd>${esc(line.slice(at + 2))}</dd></div>` : `<div><dd>${esc(line)}</dd></div>`;
  }).join('')}</dl>`;
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
  shadow.getElementById('detail-position').textContent = `${String(items.indexOf(item)+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')} · ${kinds[item.kind]}`;
  shadow.getElementById('detail-title').textContent = item.name;
  shadow.getElementById('detail-description').textContent = item.use;
  shadow.getElementById('pane-guide').innerHTML = detailRules(item).map(([title,text],i) => `<details ${i===0?'open':''}><summary>${esc(title)}</summary>${specMarkup(title,text)}</details>`).join('');
  detailAPI = mount(shadow.querySelector('.demo-frame'), item, 'full');
  const state = snapshots.get(item.id) || instances.get(item.id)?.snapshot();
  if (state) detailAPI.restore(state, true);
  detailAPI.setReduced(reduced);
  shadow.querySelector('[data-replay]').hidden = !motionKeys.has(item.key);
  shadow.querySelector('[data-pause]').hidden = !['layers','process'].includes(item.key);
  shadow.querySelector('[data-pause]').textContent = '일시정지';
  shadow.querySelector('.speed').hidden = !motionKeys.has(item.key);
  detailAPI.setSpeed(shadow.getElementById('speed').value);
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
  if (update) history.replaceState(null, '', location.pathname + location.search);
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
shadow.querySelector('.toolbar').addEventListener('submit', event => event.preventDefault());
shadow.getElementById('kind').addEventListener('change', event => { kind = event.target.value; filter(); });
shadow.addEventListener('click', event => {
  const target = event.target.closest('button,a');
  if (!target) return;
  if (target.matches('.skip')) { event.preventDefault(); shadow.getElementById('component-list').focus(); return; }
  if (target.dataset.open) { event.preventDefault(); open(items.find(item => item.id === target.dataset.open), target); return; }
  if (target.hasAttribute('data-clear')) resetFilters();
  if (target.hasAttribute('data-clear-query')) { query = ''; input.value = ''; filter(); input.focus(); }
  if (target.hasAttribute('data-close')) close();
  if (target.hasAttribute('data-prev')) navigate(-1);
  if (target.hasAttribute('data-next')) navigate(1);
  if (target.hasAttribute('data-replay')) { shadow.querySelector('[data-pause]').textContent = '일시정지'; detailAPI.replay(); shadow.getElementById('demo-status').textContent = '현재 선택에서 다음 동작을 체험합니다.'; }
  if (target.hasAttribute('data-pause')) { const paused = target.textContent === '계속 재생'; if (paused) detailAPI.resume(); else detailAPI.pause(); target.textContent = paused ? '일시정지' : '계속 재생'; shadow.getElementById('demo-status').textContent = paused ? '이어서 재생합니다.' : '일시정지했습니다.'; }
  if (target.hasAttribute('data-reset')) { shadow.querySelector('[data-pause]').textContent = '일시정지'; detailAPI.reset(); shadow.getElementById('demo-status').textContent = '초기 상태로 돌아왔습니다.'; }
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
shadow.getElementById('speed').addEventListener('change', event => detailAPI?.setSpeed(event.target.value));
shadow.getElementById('reduced').addEventListener('change', event => {
  reduced = event.target.checked || reducedMedia.matches;
  detailAPI?.setReduced(reduced); instances.forEach(api => api.setReduced(reduced));
});
reducedMedia.addEventListener('change', event => {
  reduced = event.matches || shadow.getElementById('reduced').checked;
  detailAPI?.setReduced(reduced); instances.forEach(api => api.setReduced(reduced));
});
dialog.addEventListener('cancel', event => { if (event.target === dialog) { event.preventDefault(); close(); } });
function readLocation() {
  const next = new URL(location.href);
  query = next.searchParams.get('q') || ''; kind = Object.keys(kinds).includes(next.searchParams.get('kind')) ? next.searchParams.get('kind') : 'all';
  input.value = query; shadow.getElementById('kind').value = kind; filter(false);
  const item = items.find(item => item.id === location.hash.slice(1));
  if (item) { if (dialog.open && active?.id !== item.id) showItem(item); else if (!dialog.open) open(item, null, false); }
  else if (dialog.open) close(false);
}
window.addEventListener('popstate', readLocation);
window.addEventListener('hashchange', readLocation);
window.addEventListener('pagehide', event => {
  instances.forEach(api => api.suspend()); detailAPI?.suspend();
  if (!event.persisted) { observer.disconnect(); instances.forEach(api => api.destroy()); detailAPI?.destroy(); }
});
window.addEventListener('pageshow', event => { if (event.persisted) { if (dialog.open) detailAPI?.continue(); else visible.forEach(id => instances.get(id)?.continue()); } });
filter(false); readLocation();
