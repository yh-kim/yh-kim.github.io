#!/usr/bin/env node

// Static contracts. Browser interactions and layout are checked separately.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Script } from 'node:vm';
import { execFileSync } from 'node:child_process';

const themesSource = await readFile(new URL('../js/ui-motion-guide/themes.js', import.meta.url), 'utf8');
const themesURL = `data:text/javascript;base64,${Buffer.from(themesSource).toString('base64')}`;
const engineSource = (await readFile(new URL('../js/ui-motion-guide/engine.js', import.meta.url), 'utf8'))
  .replace(/from ['"]\.\/themes\.js(?:\?[^'"]*)?['"]/, `from '${themesURL}'`);
const engineURL = `data:text/javascript;base64,${Buffer.from(engineSource).toString('base64')}`;
const { themes, projectData, elementsFor, design, prompt, spec } = await import(themesURL);
const { variables, demoCSS, markup, standalone, wireDemo } = await import(engineURL);
const expected = {
  'dark-ai': ['layers','controls','process','beam','prompt','dialog'],
  'light-project': ['tasks','filters','chart','calendar','quick-add','dialog']
};
const failures = [];
let count = 0;
function check(name, fn) {
  count++;
  try { fn(); } catch (error) { failures.push(`${name}: ${error.message}`); }
}
function luminance(hex) {
  assert.match(hex, /^#[0-9a-f]{6}$/i);
  const [r,g,b] = [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255)
    .map(c => c <= .04045 ? c/12.92 : ((c+.055)/1.055)**2.4);
  return .2126*r+.7152*g+.0722*b;
}
function contrast(a,b) {
  const [hi,lo] = [luminance(a),luminance(b)].sort((x,y)=>y-x);
  return (hi+.05)/(lo+.05);
}
check('two distinct scenes', () => assert.deepEqual(themes.map(t=>t.id), Object.keys(expected)));
check('engine API', () => [variables,demoCSS,markup,standalone,wireDemo]
  .forEach(fn => assert.equal(typeof fn,'function')));
check('sample project data', () => {
  assert.equal(projectData.tasks.length,6);
  assert.equal(new Set(projectData.tasks.map(t=>t.id)).size,6);
  assert.equal(new Set(projectData.tasks.map(t=>t.title)).size,6);
  assert.ok(projectData.tasks.every(t=>projectData.dates.includes(t.date)));
});
for (const t of themes) {
  const keys = expected[t.id];
  check(`${t.id} element contracts`, () => {
    assert.deepEqual(elementsFor(t).map(e=>e.id), keys);
    assert.deepEqual(Object.keys(t.motion.records), keys);
    assert.ok(elementsFor(t).every(e=>e.name && e.use && e.behavior));
  });
  check(`${t.id} tokens used by CSS`, () => {
    const vars=variables(t),css=demoCSS(t);
    assert.ok(css.includes(vars));
    for(const [key,value] of Object.entries(t.colors))
      assert.ok(vars.includes(`--${key}:${value}`),`Missing ${key}`);
    for(const [key,value] of Object.entries(t.material))
      assert.ok(vars.includes(`--${key}:${value}`),`Missing material ${key}`);
    for(const [key,value] of Object.entries({max:`${t.layout.max}px`,gap:`${t.layout.gap}px`,height:`${t.element.height}px`,radius:`${t.element.radius}px`,duration:`${t.motion.duration}ms`,ease:t.motion.ease}))
      assert.ok(vars.includes(`--${key}:${value}`),`Missing ${key}`);
    assert.ok(css.includes(String(t.layout.breakpoint)));
    assert.match(css,/prefers-reduced-motion/);
    assert.doesNotMatch(css,/(?:^|})\s*(?:body|html)\s*\{/i);
  });
  check(`${t.id} altered layout tokens reach live CSS`,()=>{
    const changed=structuredClone(t);
    changed.layout.columns='2fr 1fr';
    changed.layout.breakpoint=719;
    changed.type.title=63;
    const css=demoCSS(changed);
    assert.match(css,/--columns:2fr 1fr/);
    assert.match(css,/grid-template-columns:var\(--columns\)/);
    assert.match(css,/@container\s*\(max-width:719px\)/);
    assert.match(css,/--title:63px/);
    assert.match(css,/var\(--title\)/);
  });
  check(`${t.id} guide and prompt share source`, () => {
    const guide=design(t),whole=prompt(t);
    assert.ok(whole.includes(guide));
    for(const value of Object.values(t.colors)) assert.ok(guide.includes(value),`Missing ${value}`);
    for(const value of Object.values(t.material)) assert.ok(guide.includes(value),`Missing material ${value}`);
    for(const value of [t.layout.max,t.layout.padding,t.layout.gap,t.layout.breakpoint,t.type.title,t.type.mobileTitle])
      assert.ok(guide.includes(String(value)),`Missing ${value}`);
    for(const record of Object.values(t.motion.records)) {
      assert.ok(guide.includes(`${record.duration}ms`));
      assert.ok(guide.includes(record.trigger));
    }
    assert.match(guide,/모션.*미확인|모션.*실측이 아님/);
    assert.match(whole,/서버|DB|API/);
  });
  if(t.id==='light-project') check('dashboard initial values match task data',()=>{
    const html=markup(t,'hero');
    const total=t.data.tasks.length,done=t.data.tasks.filter(x=>x.status==='done').length;
    assert.match(html,new RegExp(`data-metric="total">${total}<`));
    assert.match(html,new RegExp(`data-metric="done">${done}<`));
    assert.match(html,new RegExp(`data-metric="active">${total-done}<`));
    const dates=[...html.matchAll(/data-date="(\d+)"/g)].map(x=>Number(x[1]));
    assert.deepEqual(dates,t.data.dates);
  });
  for(const [name,front,back,min] of [
    ['body/background',t.colors.text,t.colors.background,4.5],
    ['body/surface',t.colors.text,t.colors.surface,4.5],
    ['muted/background',t.colors.muted,t.colors.background,4.5],
    ['muted/surface',t.colors.muted,t.colors.surface,4.5],
    ['accent label',t.colors.onAccent,t.colors.accent,4.5],
    ['success/background',t.colors.success,t.colors.background,4.5],
    ['success/surface',t.colors.success,t.colors.surface,4.5],
    ['error/background',t.colors.error,t.colors.background,4.5],
    ['error/surface',t.colors.error,t.colors.surface,4.5],
    ['focus/background',t.colors.focus,t.colors.background,3],
    ['focus/surface',t.colors.focus,t.colors.surface,3]
  ]) check(`${t.id} contrast ${name}`,()=>{
    const ratio=contrast(front,back);
    assert.ok(ratio>=min,`${ratio.toFixed(2)}:1 < ${min}:1`);
  });
  if(t.id==='light-project') for(const [name,front,back] of [
    ['done state',t.material.doneText,t.material.doneSurface],
    ['review state',t.material.reviewText,t.material.reviewSurface]
  ]) check(`${t.id} contrast ${name}`,()=>{
    const ratio=contrast(front,back);
    assert.ok(ratio>=4.5,`${ratio.toFixed(2)}:1 < 4.5:1`);
  });
  const allIds=[];
  for(const key of ['hero',...keys]) {
    check(`${t.id}/${key} live preview`,()=>{
      const html=markup(t,key);
      assert.ok(html.length>300);
      assert.match(html,/<button\b/);
      assert.doesNotMatch(html,/MORI|공간 예약|준비 중/);
      const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
      assert.equal(new Set(ids).size,ids.length);
      allIds.push(...ids);
      for(const match of html.matchAll(/\baria-(?:controls|labelledby|describedby)="([^"]+)"/g))
        for(const id of match[1].split(/\s+/)) assert.ok(ids.includes(id),`Missing ARIA target ${id}`);
      const detail=spec(t,key);
      assert.ok(detail.includes(`${t.element.height}px`));
      if(key!=='hero') assert.ok(detail.includes(`${t.motion.records[key].duration}ms`));
      if(key!=='hero') assert.ok(prompt(t,key).includes(detail));
    });
    check(`${t.id}/${key} standalone code`,()=>{
      const html=standalone(t,key);
      assert.match(html,/^<!doctype html>\s*<html lang="ko">/i);
      assert.match(html,/<meta name="viewport"/);
      assert.ok(html.includes(t.colors.background));
      assert.ok(html.includes(`${t.motion.duration}ms`));
      assert.doesNotMatch(html,/MORI|공간 예약|준비 중/);
      assert.doesNotMatch(html,/<(?:script|link)\b[^>]*(?:src|href)\s*=|@import\s|url\(\s*['"]?https?:|\b(?:fetch|XMLHttpRequest)\s*\(/i);
      const script=html.match(/<script(?: type="module")?>([\s\S]*?)<\/script>/i);
      assert.ok(script,'Missing self-contained script');
      assert.doesNotMatch(script[1],/^\s*(?:import|export)\s/m);
      new Script(script[1],{filename:`${t.id}-${key}.html`});
    });
  }
  check(`${t.id} IDs across gallery`,()=>assert.equal(new Set(allIds).size,allIds.length));
  check(`${t.id} complete gallery standalone`,()=>{
    const html=standalone(t,'theme');
    assert.equal((html.match(/class="demo"/g)||[]).length,7);
    assert.match(html,/^<!doctype html>/i);
    assert.doesNotMatch(html,/MORI|공간 예약|준비 중/);
    assert.ok(html.includes(t.colors.background));
    const script=html.match(/<script(?: type="module")?>([\s\S]*?)<\/script>/i);
    assert.ok(script);
    new Script(script[1],{filename:`${t.id}-theme.html`});
    const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(new Set(ids).size,ids.length);
  });
}
const post=await readFile(new URL('../p/hidden-memo/ui-motion-guide/index.md',import.meta.url),'utf8');
const hub=await readFile(new URL('../p/hidden-memo/index.html',import.meta.url),'utf8');
const registry=await readFile(new URL('../_data/html_documents.yml',import.meta.url),'utf8');
check('stable archived guide route and current metadata',()=>{
  const front=post.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(front);
  assert.match(front[1],/^layout:\s*post\s*$/m);
  assert.match(front[1],/^title:\s*"테마별 인터랙티브 UI·모션 디자인 가이드"\s*$/m);
  assert.match(front[1],/^permalink:\s*\/p\/hidden-memo\/ui-motion-guide\/\s*$/m);
  assert.match(front[1],/^hidden:\s*true\s*$/m);
  assert.match(front[1],/^tags:\s*\[\]\s*$/m);
  assert.match(front[1],/^subtitle:\s*"[^"]*두 디자인 화면[^"]*"\s*$/m);
  assert.match(front[1],/^description:\s*"[^"]*Dark AI Workspace와 Light Project Dashboard[^"]*12개[^"]*"\s*$/m);
  assert.doesNotMatch(front[1],/네 가지|Warm Minimal|Editorial|Technical|Bold Graphic|일곱 가지/);
  assert.match(post,/href="\{\{ '\/p\/ui-motion\/' \| relative_url \}\}"/);
  assert.match(hub,/href="\.\.\/ui-motion\/"/);
  assert.match(hub,/2개 대표 화면[\s\S]*전체 12개 예시/);
  assert.doesNotMatch(hub,/네 가지 화면|4개 테마|28개 요소 데모/);
  assert.doesNotMatch(registry,/\/p\/hidden-memo\/ui-motion-guide\//);
});
check('blog global files untouched',()=>{
  const changed=execFileSync('git',['diff','--name-only','HEAD'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
  const allowed=/^(?:p\/hidden-memo\/ui-motion-guide\/index\.md|p\/hidden-memo\/index\.html|p\/ui-motion\/(?:index\.html|ai-workspace\/index\.html|project-dashboard\/index\.html)|js\/ui-motion-guide\/(?:engine|index|themes|guide|showcase)\.(?:js|css)|js\/ui-motion-showcase\/[^/]+\.(?:js|css)|docs\/ui-motion-(?:guide|showcase)-[^/]+\.md|docs\/assets\/ui-motion-(?:guide|showcase)(?:-review)?\/[^/]+|scripts\/test-ui-motion-(?:guide|showcase)\.mjs)$/;
  assert.deepEqual(changed.filter(path=>!allowed.test(path)),[],
    'Guide work must not change other posts, routing, navigation, or global styles');
});
const controller=await readFile(new URL('../js/ui-motion-guide/index.js',import.meta.url),'utf8');
check('copy failure provides manual selection',()=>assert.match(controller,/catch\s*\{\s*box\.focus\(\);box\.select\(\)/));
if(failures.length){console.error(`FAIL: ${failures.length}/${count} checks`);failures.forEach(f=>console.error(`- ${f}`));process.exitCode=1;}
else console.log(`OK: ${count} UI motion guide checks passed (2 scenes × 7 views).`);
