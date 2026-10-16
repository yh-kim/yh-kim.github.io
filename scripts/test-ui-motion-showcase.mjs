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
const dataSource = (await source('../js/ui-motion-showcase/data.js'))
  .replace(/from ['"]\.\.\/ui-motion-guide\/themes\.js(?:\?[^'"]*)?['"]/, `from '${themesURL}'`);
const dataURL = asModule(dataSource);
const engineSource = (await source('../js/ui-motion-showcase/engine.js'))
  .replace(/from ['"]\.\.\/ui-motion-guide\/engine\.js(?:\?[^'"]*)?['"]/, `from '${oldEngineURL}'`)
  .replace(/from ['"]\.\/data\.js(?:\?[^'"]*)?['"]/, `from '${dataURL}'`);
const engineURL = asModule(engineSource);
const {themes, kinds, catalog, fullCatalog, themeFor, detailRules, promptFor} = await import(dataURL);
const {markup, demoCSS, wire, mount, standalone} = await import(engineURL);
const page = await source('../p/ui-motion/index.html');
const archived = await source('../p/hidden-memo/ui-motion-guide/index.md');
const hub = await source('../p/hidden-memo/index.html');
const registry = await source('../_data/html_documents.yml');
const controller = await source('../js/ui-motion-showcase/index.js');
const style = await source('../js/ui-motion-showcase/styles.css');

let count = 0;
const failures = [];
function check(name, run) {
  count++;
  try { run(); } catch (error) { failures.push(`${name}: ${error.message}`); }
}

check('independent HTML has no blog layout or article shell', () => {
  assert.match(page, /^<!doctype html>/i);
  assert.match(page, /<meta name="html-document-listing" content="hidden">/);
  assert.match(page, /<div id="ui-showcase"/);
  assert.match(page, /js\/ui-motion-showcase\/index\.js/);
  assert.doesNotMatch(page, /^(?:---|layout:)|post-container|post-heading|header-img|article max-width/im);
  assert.doesNotMatch(registry, /\/p\/ui-motion\//);
});
check('archived guide and hidden memo route are preserved', () => {
  assert.match(archived, /^title:\s*"테마별 인터랙티브 UI·모션 디자인 가이드"\s*$/m);
  assert.match(archived, /^permalink:\s*\/p\/hidden-memo\/ui-motion-guide\/\s*$/m);
  assert.match(archived, /href="\{\{ '\/p\/ui-motion\/' \| relative_url \}\}"/);
  assert.match(hub, /href="\.\.\/ui-motion\/"/);
  assert.doesNotMatch(hub, /4개 테마|28개 요소 데모|네 가지 화면/);
});
check('twelve unique real examples', () => {
  assert.deepEqual(themes.map(t => t.id), ['dark-ai', 'light-project']);
  assert.equal(fullCatalog.length, 12);
  assert.equal(new Set(fullCatalog.map(x => x.id)).size, 12);
  assert.equal(fullCatalog.filter(x => x.key === 'hero').length, 2);
  assert.equal(fullCatalog.filter(x => x.themeId === 'dark-ai').length, 6);
  assert.equal(fullCatalog.filter(x => x.themeId === 'light-project').length, 6);
  assert.ok(fullCatalog.every(x => x.name && x.description && x.use && x.behavior));
  assert.ok(fullCatalog.every(x => Object.hasOwn(kinds, x.kind) && x.kind !== 'all'));
  assert.ok(fullCatalog.every(x => x.key === 'hero' || x.key !== 'dialog'));
  assert.deepEqual(new Set(catalog.map(x => x.id)).size, catalog.length);
  assert.ok(catalog.every(x => fullCatalog.includes(x)));
});
check('published catalog is complete', () => {
  if (process.argv.includes('--require-full')) assert.equal(catalog.length, fullCatalog.length);
  else assert.ok(catalog.length >= 3 && catalog.length <= fullCatalog.length);
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
    const root = {dataset: {demoKey: 'hero'}, querySelector: () => null, querySelectorAll: () => [], addEventListener() {}};
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
check('search/filter/detail/copy controls exist', () => {
  for (const marker of ['type="search"', 'data-theme="all"', 'data-kind=', 'data-open=', 'data-prev', 'data-next', 'data-close', 'data-replay', 'data-reset', 'data-copy=', 'data-select=', 'data-save='])
    assert.ok(controller.includes(marker), `Missing ${marker}`);
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

for (const item of fullCatalog) {
  const theme = themeFor(item);
  check(`${item.id} has source-backed motion and descriptive rules`, () => {
    assert.ok(theme);
    assert.equal(item.motion.ease, theme.motion.ease);
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
    assert.ok(text.includes(theme.colors.accent));
    assert.ok(text.includes(String(theme.layout.max)));
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
    assert.ok(html.includes(theme.colors.accent));
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
  console.log(`OK: ${count} UI motion showcase checks passed (${catalog.length}/${fullCatalog.length} published).`);
}
