#!/usr/bin/env node

// Data and export contracts. Layout, focus, motion timing and interaction are
// verified in a browser because a source-code assertion cannot prove them.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Script} from 'node:vm';

const source = async path => readFile(new URL(path, import.meta.url), 'utf8');
const asModule = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const themesSource = await source('../js/ui-motion-guide/themes.js');
const themesURL = asModule(themesSource);
const oldEngineSource = (await source('../js/ui-motion-guide/engine.js'))
  .replace(/from ['"]\.\/themes\.js(?:\?[^'"]*)?['"]/, `from '${themesURL}'`);
const oldEngineURL = asModule(oldEngineSource);
const aiSceneURL = asModule(await source('../js/ui-motion-showcase/ai-scene.js'));
const projectSceneURL = asModule(await source('../js/ui-motion-showcase/project-scene.js'));
const componentDesignURL = asModule(await source('../js/ui-motion-showcase/component-design.js'));
const dataSource = (await source('../js/ui-motion-showcase/data.js'))
  .replace(/from ['"]\.\.\/ui-motion-guide\/themes\.js(?:\?[^'"]*)?['"]/, `from '${themesURL}'`)
  .replace(/from ['"]\.\/ai-scene\.js(?:\?[^'"]*)?['"]/, `from '${aiSceneURL}'`)
  .replace(/from ['"]\.\/project-scene\.js(?:\?[^'"]*)?['"]/, `from '${projectSceneURL}'`)
  .replace(/from ['"]\.\/component-design\.js(?:\?[^'"]*)?['"]/, `from '${componentDesignURL}'`);
const dataURL = asModule(dataSource);
const engineSource = (await source('../js/ui-motion-showcase/engine.js'))
  .replace(/from ['"]\.\.\/ui-motion-guide\/engine\.js(?:\?[^'"]*)?['"]/, `from '${oldEngineURL}'`)
  .replace(/from ['"]\.\/data\.js(?:\?[^'"]*)?['"]/, `from '${dataURL}'`)
  .replace(/from ['"]\.\/ai-scene\.js(?:\?[^'"]*)?['"]/, `from '${aiSceneURL}'`)
  .replace(/from ['"]\.\/project-scene\.js(?:\?[^'"]*)?['"]/, `from '${projectSceneURL}'`)
  .replace(/from ['"]\.\/component-design\.js(?:\?[^'"]*)?['"]/, `from '${componentDesignURL}'`);
const engineURL = asModule(engineSource);
const {aiTokens} = await import(aiSceneURL);
const {projectTokens} = await import(projectSceneURL);
const {componentTokens, componentCSS} = await import(componentDesignURL);
const {themes, kinds, catalog, fullCatalog, themeFor, detailRules, promptFor} = await import(dataURL);
const {markup, demoCSS, wire, mount, standalone} = await import(engineURL);
const page = await source('../p/ui-motion/index.html');
const aiPage = await source('../p/ui-motion/ai-workspace/index.html');
const projectPage = await source('../p/ui-motion/project-dashboard/index.html');
const galleryPage = await source('../p/ui-motion/components/index.html');
const archived = await source('../p/hidden-memo/ui-motion-guide/index.md');
const hub = await source('../p/hidden-memo/index.html');
const registry = await source('../_data/html_documents.yml');
const controller = await source('../js/ui-motion-showcase/index.js');
const galleryController = await source('../js/ui-motion-showcase/gallery.js');
const style = await source('../js/ui-motion-showcase/styles.css');
const galleryStyle = await source('../js/ui-motion-showcase/gallery.css');
const inventory = await source('../docs/ui-motion-gallery-inventory.md');

let count = 0;
const failures = [];
function check(name, run) {
  count++;
  try { run(); } catch (error) { failures.push(`${name}: ${error.message}`); }
}

check('independent HTML has no blog layout or article shell', () => {
  for (const html of [page, aiPage, projectPage]) {
    assert.match(html, /^<!doctype html>/i);
    assert.match(html, /<meta name="html-document-listing" content="hidden">/);
    assert.match(html, /<div id="ui-showcase"/);
    assert.match(html, /js\/ui-motion-showcase\/index\.js/);
    assert.doesNotMatch(html, /^(?:---|layout:)|post-container|post-heading|header-img|article max-width/im);
  }
  assert.doesNotMatch(registry, /\/p\/ui-motion\//);
});
check('hub and themes have direct, refreshable pathnames and correct assets', () => {
  const routes = [
    ['hub', '/p/ui-motion/', page, '../../js/ui-motion-showcase/index.js'],
    ['ai-workspace', '/p/ui-motion/ai-workspace/', aiPage, '../../../js/ui-motion-showcase/index.js'],
    ['project-dashboard', '/p/ui-motion/project-dashboard/', projectPage, '../../../js/ui-motion-showcase/index.js']
  ];
  for (const [name, path, html, asset] of routes) {
    assert.match(html, new RegExp(`<body data-showcase-page="${name}">`));
    assert.ok(html.includes(`content="https://blog.pickth.com${path}"`), `${name} OG URL`);
    assert.ok(html.includes(`src="${asset}?`), `${name} module path`);
    assert.equal(new URL(asset, `https://blog.pickth.com${path}`).pathname, '/js/ui-motion-showcase/index.js');
  }
  assert.equal(new Set(routes.map(([,path]) => path)).size, 3);
  assert.match(controller, /pageTheme=page==='ai-workspace'\?'dark-ai':page==='project-dashboard'\?'light-project':null/);
  assert.match(controller, /catalog=allCatalog\.filter\(item=>pageTheme\?item\.themeId===pageTheme:item\.key==='hero'\)/);
  assert.match(controller, /x\.key!=='hero'/);
  assert.match(controller, /mount\(shadow\.querySelector\('\.hero-demo'\),hero,'full'\)/);
  assert.match(controller, /themeHref\(item\.themeId==='dark-ai'\?'ai-workspace':'project-dashboard'\)/);
  assert.match(controller, /function detailList\(\)\{return pageTheme\?\[hero,\.\.\.matching\(\)\]:catalog;\}/);
  assert.match(controller, /const list=detailList\(\),index=list\.findIndex/);
  assert.match(controller, /if\(e\.target===dialog\)\{e\.preventDefault\(\);close\(\);\}/);
  assert.match(engineSource, /listen\(dialog,'cancel',e=>\{e\.preventDefault\(\);close\(\);\}\)/);
});
check('archived guide and hidden memo route are preserved', () => {
  assert.match(archived, /^title:\s*"테마별 인터랙티브 UI·모션 디자인 가이드"\s*$/m);
  assert.match(archived, /^permalink:\s*\/p\/hidden-memo\/ui-motion-guide\/\s*$/m);
  assert.match(archived, /href="\{\{ '\/p\/ui-motion\/' \| relative_url \}\}"/);
  assert.match(hub, /href="\.\.\/ui-motion\/"/);
  assert.doesNotMatch(hub, /4개 테마|28개 요소 데모|네 가지 화면/);
});
const originalIds = [
  'dark-ai--hero', 'light-project--hero', 'dark-ai--process', 'dark-ai--layers',
  'light-project--chart', 'dark-ai--controls', 'light-project--tasks',
  'light-project--filters', 'light-project--calendar', 'dark-ai--beam',
  'dark-ai--prompt', 'light-project--quick-add'
];
const elementIds = [...originalIds.filter(id => !id.endsWith('--hero')), 'dark-ai--dialog', 'light-project--dialog'];

check('twelve elements plus two preserved scenes have stable IDs and order', () => {
  assert.deepEqual(themes.map(t => t.id), ['dark-ai', 'light-project']);
  assert.equal(fullCatalog.length, 14);
  assert.deepEqual(fullCatalog.map(x => x.id), [...originalIds, 'dark-ai--dialog', 'light-project--dialog']);
  assert.deepEqual(fullCatalog.map(x => x.number), Array.from({length: 14}, (_, i) => String(i + 1).padStart(2, '0')));
  assert.equal(new Set(fullCatalog.map(x => x.id)).size, 14);
  assert.equal(fullCatalog.filter(x => x.key === 'hero').length, 2);
  assert.equal(fullCatalog.filter(x => x.themeId === 'dark-ai').length, 7);
  assert.equal(fullCatalog.filter(x => x.themeId === 'light-project').length, 7);
  assert.deepEqual(fullCatalog.filter(x => x.key !== 'hero').map(x => x.id), elementIds);
  assert.ok(fullCatalog.every(x => x.name && x.description && x.use && x.behavior));
  assert.ok(fullCatalog.every(x => Object.hasOwn(kinds, x.kind) && x.kind !== 'all'));
  assert.equal(kinds.overlay, '확인창');
  assert.deepEqual(fullCatalog.filter(x => x.kind === 'overlay').map(x => x.id), ['dark-ai--dialog', 'light-project--dialog']);
  assert.deepEqual(new Set(catalog.map(x => x.id)).size, catalog.length);
  assert.ok(catalog.every(x => fullCatalog.includes(x)));
});
check('published catalog is complete', () => {
  if (process.argv.includes('--require-full')) assert.equal(catalog.length, fullCatalog.length);
  else assert.ok(catalog.length >= 3 && catalog.length <= fullCatalog.length);
});
check('dedicated gallery route resolves its local assets and excludes scenes', () => {
  assert.match(galleryPage, /^<!doctype html>/i);
  assert.ok(galleryPage.includes('name="html-document-listing" content="hidden"'));
  assert.ok(galleryPage.includes('id="component-gallery"'));
  assert.ok(galleryPage.includes('js/ui-motion-showcase/gallery.js'));
  assert.equal(new URL('../../../js/ui-motion-showcase/gallery.js', 'https://blog.pickth.com/p/ui-motion/components/').pathname, '/js/ui-motion-showcase/gallery.js');
  assert.ok(galleryController.includes("catalog.filter(item => item.key !== 'hero')"));
  assert.ok(galleryController.includes("./gallery.css"));
  assert.ok(galleryController.includes('data-id="${item.id}"'));
  assert.ok(galleryController.includes('href="#${item.id}"'));
  assert.ok(galleryController.includes("location.hash.slice(1)"));
  assert.ok(galleryController.includes("mount(shadow.querySelector('.demo-frame'), item, 'full')"));
  assert.ok(galleryController.includes('standalone(active)'));
  assert.ok(galleryController.includes('promptFor(active)'));
  assert.ok(galleryController.includes('detailRules(item)'));
  assert.ok(galleryController.includes('api.restore(snapshots.get(id), true)'));
  assert.ok(galleryController.includes('new IntersectionObserver'));
  assert.ok(galleryController.includes('dialog.showModal()'));
  assert.ok(galleryController.includes('opener?.focus'));
  assert.ok(galleryStyle.includes('.grid{display:grid'));
  assert.ok(galleryStyle.includes('.stage{height:430px'));
});
check('inventory records every route and keeps code and browser status distinct', () => {
  assert.equal(inventory.split('\n').filter(line => /^\| \d{2} \|/.test(line)).length, 14);
  for (const item of fullCatalog) {
    assert.ok(inventory.includes('`' + item.id + '`'), `${item.id} missing from inventory`);
    assert.ok(inventory.includes('`#ui-' + item.themeId + '-' + item.key + '`'), `${item.id} original hash missing`);
    if (item.key !== 'hero') assert.ok(inventory.includes('`/p/ui-motion/components/#' + item.id + '`'), `${item.id} gallery URL missing`);
  }
  assert.ok(inventory.includes('구현 상태'));
  assert.ok(inventory.includes('브라우저 동작'));
  assert.ok(inventory.includes('시각 확인'));
});
check('scene tokens reach CSS, rules and independent prompts', () => {
  assert.deepEqual(themes[0].scene, aiTokens);
  assert.deepEqual(themes[1].scene, projectTokens);
  const ai = catalog.find(x => x.id === 'dark-ai--hero');
  const project = catalog.find(x => x.id === 'light-project--hero');
  const aiChanged = structuredClone(themes[0]);
  aiChanged.scene.studioMax = 997;
  assert.ok(demoCSS(aiChanged).includes('--studio-max:997px'), 'AI scene max token is disconnected from CSS');
  const projectChanged = structuredClone(themes[1]);
  projectChanged.scene.navHeight = 61;
  assert.ok(demoCSS(projectChanged).includes('.project-nav{height:61px'), 'Project nav height token is disconnected from CSS');
  for (const [item, token] of [[ai,aiTokens.studioMax], [project,projectTokens.sceneMax]]) {
    assert.ok(detailRules(item).some(([,value]) => value.includes(String(token))));
    assert.ok(promptFor(item).includes(String(token)));
    assert.ok(standalone(item).includes(String(token)));
  }
});
check('compact and full share the same runtime', () => {
  for (const fn of [markup, demoCSS, wire, mount, standalone]) assert.equal(typeof fn, 'function');
  const prior = {matchMedia: globalThis.matchMedia, IntersectionObserver: globalThis.IntersectionObserver, document: globalThis.document, requestAnimationFrame: globalThis.requestAnimationFrame, cancelAnimationFrame: globalThis.cancelAnimationFrame};
  globalThis.matchMedia = () => ({matches: false, addEventListener() {}});
  globalThis.IntersectionObserver = class {observe() {} unobserve() {} disconnect() {}};
  globalThis.document = {hidden: false, addEventListener() {}};
  globalThis.requestAnimationFrame = () => 1;
  globalThis.cancelAnimationFrame = () => {};
  const makeHost = () => {
    const root = {style:{setProperty(){}},dataset: {demoKey: 'hero'}, querySelector: () => null, querySelectorAll: () => [], addEventListener() {}};
    const shadow = {innerHTML: '', querySelector(selector) {
      if (selector !== '.demo') return null;
      root.dataset.presentation = this.innerHTML.includes('data-presentation="full"') ? 'full' : 'compact';
      return root;
    }};
    return {shadowRoot: null, attachShadow() {this.shadowRoot = shadow; return shadow;}};
  };
  try {
    for (const mode of ['compact', 'full']) {
      const host = makeHost();
      const api = mount(host, fullCatalog[0], mode);
      assert.equal(api.root.dataset.presentation, mode);
      assert.ok(host.shadowRoot.innerHTML.includes('data-presentation="'+mode+'"'));
      for (const method of ['replay', 'pause', 'resume', 'reset', 'suspend', 'continue', 'destroy', 'snapshot', 'restore'])
        assert.equal(typeof api[method], 'function', `${mode} missing ${method}`);
      const state = api.snapshot();
      assert.equal(state.mode, 'object');
      api.setReduced(true);
      assert.equal(api.root.dataset.reduced, 'true', `${mode} external reduced-motion toggle is ineffective`);
      api.setReduced(false);
      assert.equal(api.root.dataset.reduced, 'false');
      api.restore(state, true);
      assert.equal(api.root.dataset.interacted, 'true');
      api.destroy();
    }
  } finally {
    for (const [key, value] of Object.entries(prior)) {
      if (value === undefined) delete globalThis[key]; else globalThis[key] = value;
    }
  }
  assert.ok(/\[data-presentation=compact\]/.test(demoCSS(themes[0])), 'Compact CSS missing');
  assert.ok(/\[data-presentation=full\]/.test(demoCSS(themes[0])), 'Full CSS missing');
});
check('theme-local search/filter/detail/copy controls exist', () => {
  for (const marker of ['type="search"', 'data-kind=', 'data-open=', 'data-prev', 'data-next', 'data-close', 'data-replay', 'data-reset', 'data-copy=', 'data-select=', 'data-save='])
    assert.ok(controller.includes(marker), `Missing ${marker}`);
  assert.ok(controller.includes('heroCard.remove()'), 'Theme hero must be outside gallery cards');
  assert.ok(controller.includes('filterBar.querySelector'), 'Theme filter group must be removed');
  assert.ok(/savedScroll=window\.scrollY/.test(controller), 'Scroll position save missing');
  assert.ok(/opener\?\.focus\(\{preventScroll:true\}\)/.test(controller), 'Focus return missing');
  assert.ok(/document\.body\.style\.overflow='hidden'/.test(controller), 'Body scroll lock missing');
  assert.ok(/document\.documentElement\.style\.overflow='hidden'/.test(controller), 'Root scroll lock missing');
  assert.ok(/dialog\.addEventListener\('cancel'/.test(controller), 'Escape handling missing');
  assert.ok(/catch\{box\.focus\(\);box\.select\(\)/.test(controller), 'Manual copy fallback missing');
  assert.ok(/grid-template-columns:\s*repeat\(3,/.test(style), 'Desktop grid must have three columns');
});
check('finite visible-only auto demonstration and user interruption', () => {
  assert.ok(controller.includes('new IntersectionObserver'), 'Visible-card observer missing');
  assert.ok(controller.includes('document.hidden') && controller.includes('dialog.open'), 'Hidden page/detail guard missing');
  assert.ok(controller.includes('visible.has') && controller.includes('instance.done') && controller.includes('dataset.interacted'), 'Auto clock lacks visibility, finite, or user-interaction guard');
  assert.ok(/e\.isTrusted\)touch\(\)/.test(engineSource), 'Trusted user input marker missing');
  assert.ok(/root\.dataset\.interacted='true'/.test(engineSource), 'User-interaction flag missing');
  assert.ok(/suspend\(\)/.test(engineSource) && /continue\(\)/.test(engineSource), 'Offscreen pause/resume API missing');
});
check('motion easing follows purpose and appears in the shared runtime', () => {
  const byId = id => fullCatalog.find(x => x.id === id);
  assert.equal(byId('dark-ai--process').motion.ease, 'linear');
  assert.notEqual(byId('dark-ai--process').motion.ease, byId('dark-ai--layers').motion.ease);
  assert.notEqual(byId('light-project--tasks').motion.ease, byId('light-project--chart').motion.ease);
  assert.ok(/item\.motion\??\.ease/.test(engineSource), 'Shared runtime must use item.motion.ease');
});
check('each gallery item has its own interactive study markup', () => {
  const studies = fullCatalog.filter(x => x.key !== 'hero').map(item => {
    const html = markup(themeFor(item), item.key);
    assert.ok(html.includes('component-lab'), `${item.id} is not a component study`);
    assert.ok(html.includes(`study-${item.key}`), `${item.id} has no component identity`);
    assert.ok(html.includes('<button'), `${item.id} has no control`);
    return html;
  });
  assert.equal(new Set(studies).size, 12, 'Gallery items share duplicate markup');
  for (const id of ['dark-ai--dialog', 'light-project--dialog']) {
    const item = fullCatalog.find(x => x.id === id);
    const html = markup(themeFor(item), item.key);
    assert.ok(html.includes('<dialog>'));
    assert.ok(html.includes('data-action="open"'));
    assert.ok(html.includes('data-action="close"'));
  }
});
check('component rules and prompts match the dedicated gallery palette and dimensions', () => {
  const css = componentCSS();
  for (const token of ['background', 'surface', 'ink', 'muted', 'line', 'accent', 'focus'])
    assert.ok(css.includes(componentTokens[token]), `${token} missing from component CSS`);
  for (const token of ['cardHeight', 'fullMax', 'controlMinHeight', 'controlRadius'])
    assert.ok(css.includes(String(componentTokens[token]) + 'px'), `${token} missing from component CSS`);
  for (const item of fullCatalog.filter(x => x.key !== 'hero')) {
    const text = detailRules(item).map(([, value]) => value).join('\n');
    const prompt = promptFor(item);
    assert.ok(text.includes(componentTokens.accent) && text.includes(componentTokens.background));
    assert.ok(text.includes(componentTokens.cardHeight + 'px'));
    const min = componentTokens.fullMinHeights[item.key];
    assert.ok(text.includes(min ? `최소 ${min}px` : '내용 높이에 맞춤'));
    assert.ok(prompt.includes(componentTokens.accent) && prompt.includes(componentTokens.fullMax + 'px'));
    assert.ok(!prompt.includes(themeFor(item).colors.accent), `${item.id} prompt uses scene accent`);
    assert.ok(!text.includes('보이는 비입력 카드 1회'), `${item.id} claims autoplay`);
  }
});
check('chart exposes focusable points and a dismissible tooltip', () => {
  const item = fullCatalog.find(x => x.id === 'light-project--chart');
  const html = markup(themeFor(item), item.key);
  assert.ok(html.includes('data-chart-tooltip'));
  assert.ok(html.includes('data-chart-values'));
  for (const token of ['<button type="button" class="bar-column" data-chart-point=', "'focusin'", "'pointerover'", "'keydown'", "e.key==='Escape'", "e.key==='Home'", "e.key==='End'"])
    assert.ok(engineSource.includes(token), `Chart missing ${token}`);
});

for (const item of fullCatalog) {
  const theme = themeFor(item);
  check(`${item.id} has source-backed motion and descriptive rules`, () => {
    assert.ok(theme);
    assert.ok(/^linear$|^cubic-bezier\([\d.,\s]+\)$/.test(item.motion.ease));
    assert.ok(item.motion.duration > 0 && item.motion.duration < 5000);
    assert.ok(item.motion.trigger && item.motion.target && item.motion.from && item.motion.to);
    assert.ok(item.auto.every(step => Number.isFinite(step.at) && (step.selector || step.action)));
    const rules = detailRules(item);
    const motion = rules.find(([heading]) => heading === '모션 사양')?.[1];
    assert.ok(motion);
    assert.ok(motion.includes(`duration: ${item.motion.duration}ms`));
    assert.ok(motion.includes(`easing: ${item.motion.ease}`));
    assert.ok(motion.includes(`delay: ${item.motion.delay}ms`));
    assert.ok(motion.includes(item.motion.trigger));
    const text = promptFor(item);
    assert.ok(text.includes(motion));
    assert.ok(text.includes(item.key === 'hero' ? theme.colors.accent : componentTokens.accent));
    assert.ok(text.includes(String(item.key === 'hero' ? theme.layout.max : componentTokens.fullMax)));
    assert.ok(text.includes('모션은') || text.includes('모션'));
    assert.match(text, /원본.*모션|A\/B 모션/);
  });
  check(`${item.id} exports runnable self-contained HTML`, () => {
    const html = standalone(item);
    assert.ok(/^<!doctype html><html lang="ko">/i.test(html), 'Doctype or language missing');
    assert.ok(/<meta name="viewport"/.test(html), 'Viewport missing');
    assert.ok(/data-presentation="full"/.test(html), 'Full mode missing');
    assert.ok(/data-replay/.test(html), 'Replay missing');
    assert.ok(/data-reset/.test(html), 'Reset missing');
    assert.ok(/data-reduced-export/.test(html), 'Reduced-motion control missing');
    assert.ok(html.includes(item.key === 'hero' ? theme.colors.accent : componentTokens.accent));
    assert.ok(html.includes(`body{margin:0;background:${item.key === 'hero' ? theme.colors.background : componentTokens.background}`));
    assert.ok(html.includes(`main{max-width:${item.key === 'hero' ? theme.layout.max : componentTokens.fullMax}px`));
    assert.ok(html.includes(`${theme.motion.duration}ms`));
    assert.ok(html.includes(markup(theme, item.key)));
    assert.ok(!/<(?:script|link)\b[^>]*(?:src|href)\s*=|@import\s|url\(\s*['"]?https?:|\b(?:fetch|XMLHttpRequest)\s*\(/i.test(html), 'External dependency found');
    const match = html.match(/<script>([\s\S]*?)<\/script>/i);
    assert.ok(match, 'Missing inline runtime');
    assert.ok(!/^\s*(?:import|export)\s/m.test(match[1]), 'Module import/export inside standalone script');
    new Script(match[1], {filename: `${item.id}.html`});
  });
}

if (failures.length) {
  console.error(`FAIL: ${failures.length}/${count} checks`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`OK: ${count} UI motion showcase checks passed (${catalog.filter(x => x.key !== 'hero').length} gallery elements, ${catalog.length}/${fullCatalog.length} catalog records).`);
}
