import { themes, elementsFor, design, prompt, spec } from './themes.js?v=20261019-motion8';
import { variables, demoCSS, markup, wireDemo, standalone } from './engine.js?v=20261019-motion8';

const host = document.getElementById('ui-motion-guide');
const shadow = host.attachShadow({ mode: 'open' });
const esc = value => String(value).replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[character]));
const colorNames = { background:'배경', surface:'기본 표면', raised:'상위 표면', text:'본문', muted:'보조 정보', accent:'강조', onAccent:'강조 위 글자', border:'경계', soft:'보조 영역', success:'성공', error:'오류', focus:'키보드 초점', hover:'마우스 올림', disabled:'비활성 표면', onDisabled:'비활성 글자' };
let theme = themes[0], cleanups = [], viewCleanup = null, copyKey = 'theme', copyMode = 'prompt', copyOpener = null, viewOpener = null;
const entries = () => elementsFor(theme);
const label = key => key === 'theme' ? '전체 테마' : key === 'hero' ? '대표 화면' : entries().find(item => item.id === key)?.name || key;

function toolsFor(key) { return `<div class="tool-row" aria-label="${esc(label(key))} 가져오기"><button type="button" class="tool" data-copy="prompt" data-key="${key}">프롬프트 복사</button><button type="button" class="tool" data-copy="code" data-key="${key}">실행 HTML 복사</button></div>`; }
function mini(t) {
  const dark = t.id === 'dark-ai', selected = t.id === theme.id;
  return `<button type="button" class="theme-card ${dark?'theme-card--ai':'theme-card--project'}" data-theme="${t.id}" aria-pressed="${selected}"><span class="mini-scene" aria-hidden="true">${dark?'<span class="mini-ai-orb"></span><span class="mini-ai-title">Create what<br>comes next.</span><span class="mini-ai-panel"><i></i><i></i><i></i></span><span class="mini-ai-foot">GENERATING · 78%</span>':'<span class="mini-project-side"></span><span class="mini-project-head"></span><span class="mini-project-metrics"><i></i><i></i><i></i></span><span class="mini-project-chart"></span><span class="mini-project-rows"><i></i><i></i></span>'}</span><span class="theme-card-copy"><span><strong>${esc(t.name)}</strong><small>${esc(t.subtitle)}</small></span><span class="card-index">${esc(t.number||'')} / ${selected?'선택됨':'선택'}</span></span></button>`;
}
function palette() { return `<div class="palette" aria-label="${esc(theme.name)} 색상 역할">${Object.entries(theme.colors).map(([key,value])=>`<div class="swatch"><span class="swatch-color" style="background:${esc(value)}" aria-hidden="true"></span><span><strong>${esc(colorNames[key]||key)}</strong><code>${esc(value)}</code></span></div>`).join('')}</div>`; }
function designRules(t) {
  const sections=[];
  let current=null;
  for(const line of design(t).trim().split(/\r?\n/)) {
    if(line.startsWith('# ')) continue;
    if(line.startsWith('## ')) { current={title:line.slice(3),lines:[]};sections.push(current); }
    else if(current) current.lines.push(line);
  }
  const paragraphs=lines=>lines.join('\n').trim().split(/\n\s*\n/).filter(Boolean).map(block=>`<p>${block.split('\n').map(esc).join('<br>')}</p>`).join('');
  const body=section=>{
    if(section.title==='색상 역할') return `<ul class="rule-colors">${section.lines.filter(Boolean).map(line=>`<li>${esc(line)}</li>`).join('')}</ul>`;
    const groups=[];let group={title:null,lines:[]};groups.push(group);
    section.lines.forEach(line=>{if(line.startsWith('### ')){group={title:line.slice(4),lines:[]};groups.push(group);}else group.lines.push(line);});
    return groups.map(item=>item.title?`<details class="design-subrule"><summary>${esc(item.title)}</summary><div>${paragraphs(item.lines)}</div></details>`:paragraphs(item.lines)).join('');
  };
  const open=new Set(['출처와 확인 수준','타이포그래피','배치','접근성']);
  return `<div class="design-rules">${sections.map(section=>`<details class="design-rule" ${open.has(section.title)?'open':''}><summary>${esc(section.title)}</summary><div class="rule-content">${body(section)}</div></details>`).join('')}</div>`;
}
function specimen(item,index) { return `<section class="specimen" id="${item.id}" aria-labelledby="title-${item.id}"><div class="demo" data-theme="${theme.id}" data-demo-key="${item.id}">${markup(theme,item.id)}</div><div class="specimen-body"><div class="specimen-title"><span class="eyebrow">${String(index+1).padStart(2,'0')} / INTERACTION</span><a href="#ui-${theme.id}-${item.id}" data-jump="${item.id}" aria-label="${esc(item.name)} 직접 링크">#</a></div><h3 id="title-${item.id}">${esc(item.name)}</h3><p>${esc(item.use)}</p><p class="behavior">${esc(item.behavior)}</p><details class="spec"><summary>적용 수치와 동작 사양</summary><div class="spec-content">${esc(spec(theme,item.id))}</div></details>${toolsFor(item.id)}</div></section>`; }

function render() {
  if (viewCleanup) { viewCleanup(); viewCleanup=null; }
  cleanups.forEach(fn=>fn()); cleanups=[];
  const items=entries();
  shadow.innerHTML=`<link rel="stylesheet" href="${new URL('./guide.css?v=20261019-motion8',import.meta.url).href}"><style>${demoCSS(theme)}</style>
  <header class="guide-intro"><div><span class="eyebrow">INTERACTIVE DESIGN FIELD GUIDE</span><h2>두 화면, 두 가지 작업의 리듬.</h2><p>아래 디자인을 선택해 직접 조작하세요. 요소의 움직임을 다시 보고, 실제 수치와 실행 코드를 가져갈 수 있습니다.</p></div><span class="edition">02 SCENES<br>12 LIVE ELEMENTS</span></header>
  <div class="theme-cards" role="group" aria-label="디자인 선택">${themes.map(mini).join('')}</div>
  <nav class="guide-nav" aria-label="가이드 목차"><a href="#ui-${theme.id}-hero" data-jump="hero">완성된 화면</a><a href="#ui-${theme.id}-${items[0].id}" data-jump="${items[0].id}">인터랙션</a><a href="#ui-${theme.id}-rules" data-jump="rules">디자인 규칙</a><a href="#ui-${theme.id}-export" data-jump="export">가져가기</a></nav>
  <section class="guide-section" id="hero" aria-labelledby="hero-title"><div class="section-head"><div><span class="eyebrow">01 / COMPLETE SCENE</span><h2 id="hero-title">${esc(theme.name)}</h2><p>${esc(theme.intent)}</p></div><div class="head-actions"><a href="#ui-${theme.id}-hero" data-jump="hero" aria-label="대표 화면 직접 링크">#</a><button type="button" class="tool" data-expand>화면 크게 보기 ↗</button></div></div><div class="hero-stage"><div class="demo" data-theme="${theme.id}" data-demo-key="hero">${markup(theme,'hero')}</div></div><div class="hero-inspector"><p><strong>직접 조작해 보세요.</strong> 이 화면의 데이터와 상태는 브라우저 안에서만 바뀝니다.</p><details class="spec"><summary>대표 화면의 디자인·상태·모션 사양</summary><div class="spec-content">${esc(spec(theme,'hero'))}</div></details>${toolsFor('hero')}</div></section>
  <section class="guide-section" id="elements" aria-labelledby="elements-title"><div class="section-head"><div><span class="eyebrow">02 / INTERACTION STUDIES</span><h2 id="elements-title">움직임을 분해해서 체험하기</h2><p>각 예시를 조작한 다음 수치·상태·복사 도구를 확인하세요.</p></div></div><div class="gallery">${items.map(specimen).join('')}</div></section>
  <section class="guide-section" id="rules" aria-labelledby="rules-title"><div class="section-head"><div><span class="eyebrow">03 / DESIGN SYSTEM</span><h2 id="rules-title">눈에 보이는 규칙</h2><p>데모와 아래 문서는 같은 테마 데이터를 사용합니다. 원본 포트폴리오의 실측값이 아닌 이 가이드의 설계값입니다.</p></div><a class="section-link" href="#ui-${theme.id}-rules" data-jump="rules" aria-label="디자인 규칙 직접 링크">#</a></div>${palette()}${designRules(theme)}</section>
  <section class="guide-section export-panel" id="export" aria-labelledby="export-title"><div><span class="eyebrow">04 / TAKE IT WITH YOU</span><h2 id="export-title">다음 프로젝트에 적용하기</h2><p>전체 프롬프트와 실행 가능한 HTML, DESIGN.md와 토큰 JSON을 같은 원본에서 만듭니다. 복사 창에서 직접 선택해 가져갈 수도 있습니다.</p></div><div class="tool-row"><button type="button" class="tool tool--primary" data-copy="prompt" data-key="theme">전체 테마 프롬프트</button><button type="button" class="tool" data-copy="code" data-key="theme">전체 테마 실행 HTML</button><button type="button" class="tool" data-download="design">DESIGN.md 다운로드</button><button type="button" class="tool" data-download="tokens">토큰 JSON 다운로드</button></div><a href="#ui-${theme.id}-export" data-jump="export" class="section-link" aria-label="가져가기 직접 링크">#</a></section>
  <p class="guide-status" role="status" aria-live="polite" id="guide-status"></p>
  <dialog class="expanded-dialog" style="--scene-max:${theme.layout.max}px" aria-labelledby="expanded-title"><div class="dialog-top"><div><span class="eyebrow">FULL SCENE / LOCAL DEMO</span><h2 id="expanded-title">${esc(theme.name)}</h2></div><button type="button" class="tool" data-close-view>닫기 <span aria-hidden="true">×</span></button></div><div class="expanded-content"></div></dialog>
  <dialog class="copy-dialog" aria-labelledby="copy-title"><div class="dialog-top"><div><span class="eyebrow">REUSE THIS DESIGN</span><h2 id="copy-title">구현 가져가기</h2></div><button type="button" class="tool" data-close-copy>닫기 <span aria-hidden="true">×</span></button></div><p id="copy-help">실행 HTML은 토큰·스타일·동작을 포함한 단일 파일입니다. 내용을 직접 선택해 복사할 수도 있습니다.</p><div class="tool-row mode-row"><button type="button" class="tool" data-copy-mode="prompt">프롬프트</button><button type="button" class="tool" data-copy-mode="code">실행 HTML</button></div><label class="copy-label" for="copy-content">복사할 내용</label><textarea id="copy-content" readonly spellcheck="false" aria-describedby="copy-help"></textarea><div class="tool-row"><button type="button" class="tool tool--primary" data-do-copy>클립보드에 복사</button><button type="button" class="tool" data-select>전체 선택 · 수동 복사</button><button type="button" class="tool" data-save>현재 내용 다운로드</button></div><p id="copy-status" role="status" aria-live="polite">내용을 확인한 뒤 복사하세요.</p></dialog>`;
  shadow.querySelectorAll('.demo').forEach(demo=>cleanups.push(wireDemo(demo,theme)));
}
function save(content,name,type='text/plain;charset=utf-8') { const url=URL.createObjectURL(new Blob([content],{type})); const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000); }
function setCopyMode(mode) { copyMode=mode; const box=shadow.getElementById('copy-content');box.value=mode==='code'?standalone(theme,copyKey):prompt(theme,copyKey);shadow.getElementById('copy-title').textContent=`${theme.name} / ${label(copyKey)} / ${mode==='code'?'실행 HTML':'프롬프트'}`;shadow.querySelectorAll('.copy-dialog [data-copy-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.copyMode===mode)));shadow.getElementById('copy-status').textContent='내용을 확인한 뒤 복사하거나 전체 선택으로 가져가세요.'; }
async function copy() { const box=shadow.getElementById('copy-content'), status=shadow.getElementById('copy-status');try{await navigator.clipboard.writeText(box.value);status.textContent='복사 완료 — 다른 프로젝트에 붙여넣으세요.';}catch{box.focus();box.select();status.textContent='자동 복사를 사용할 수 없습니다. 선택된 내용을 Ctrl/Cmd+C로 복사하세요.';} }
function openView(opener) { const dialog=shadow.querySelector('.expanded-dialog');if(dialog.open)return;viewOpener=opener;const content=shadow.querySelector('.expanded-content');content.innerHTML=`<div class="demo" data-theme="${theme.id}" data-demo-key="hero">${markup(theme,'hero')}</div>`;viewCleanup=wireDemo(content.querySelector('.demo'),theme);dialog.showModal();dialog.querySelector('[data-close-view]').focus(); }
function closeView() { const dialog=shadow.querySelector('.expanded-dialog');if(!dialog?.open)return;dialog.close();viewCleanup?.();viewCleanup=null;shadow.querySelector('.expanded-content').replaceChildren();viewOpener?.focus();viewOpener=null; }
function closeCopy() { const dialog=shadow.querySelector('.copy-dialog');if(!dialog?.open)return;dialog.close();copyOpener?.focus();copyOpener=null; }
function navigate(key,update=true,scroll=true) { if(update)history.replaceState(null,'',`#ui-${theme.id}-${key}`);if(!scroll)return;const target=shadow.getElementById(key);if(target){target.scrollIntoView({behavior:'auto',block:'start'});target.tabIndex=-1;target.focus({preventScroll:true});} }
function readHash(scroll=true) { const next=themes.find(item=>location.hash.startsWith(`#ui-${item.id}-`));if(!next)return;const key=location.hash.slice(`#ui-${next.id}-`.length);if(!['hero','rules','export',...elementsFor(next).map(item=>item.id)].includes(key))return;if(theme.id!==next.id){theme=next;render();}navigate(key,false,scroll); }
shadow.addEventListener('click',async event=>{const anchor=event.target.closest('[data-jump]');if(anchor){event.preventDefault();navigate(anchor.dataset.jump);return;}const button=event.target.closest('button');if(!button)return;
  if(button.matches('.theme-card')){const next=themes.find(item=>item.id===button.dataset.theme);if(!next||next.id===theme.id)return;theme=next;render();navigate('hero',true,false);shadow.querySelector(`.theme-card[data-theme="${next.id}"]`).focus({preventScroll:true});return;}
  if(button.hasAttribute('data-expand')){openView(button);return;}if(button.hasAttribute('data-close-view')){closeView();return;}if(button.hasAttribute('data-close-copy')){closeCopy();return;}
  if(button.dataset.copy){copyOpener=button;copyKey=button.dataset.key;setCopyMode(button.dataset.copy);shadow.querySelector('.copy-dialog').showModal();shadow.querySelector('[data-do-copy]').focus();await copy();return;}
  if(button.dataset.copyMode && button.closest('.copy-dialog')){setCopyMode(button.dataset.copyMode);return;}if(button.hasAttribute('data-do-copy')){await copy();return;}
  if(button.hasAttribute('data-select')){const box=shadow.getElementById('copy-content');box.focus();box.select();shadow.getElementById('copy-status').textContent='전체 선택됨 · Ctrl/Cmd+C로 복사하세요.';return;}
  if(button.dataset.download==='design'){save(design(theme),`${theme.id}-DESIGN.md`);return;}if(button.dataset.download==='tokens'){save(JSON.stringify(theme,null,2),`${theme.id}-tokens.json`,'application/json');return;}
  if(button.hasAttribute('data-save'))save(shadow.getElementById('copy-content').value,`${theme.id}-${copyKey}.${copyMode==='code'?'html':'txt'}`,`text/${copyMode==='code'?'html':'plain'};charset=utf-8`);
});
shadow.addEventListener('cancel',event=>{if(event.target.matches('.expanded-dialog')){event.preventDefault();closeView();}if(event.target.matches('.copy-dialog')){event.preventDefault();closeCopy();}},true);
render();readHash();window.addEventListener('hashchange',()=>readHash());
