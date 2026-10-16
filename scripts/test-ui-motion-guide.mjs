#!/usr/bin/env node

// Static contract tests for the guide's shared data, live demo, and copied HTML.
// Browser interaction and layout still need a real browser check.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Script } from 'node:vm';

async function loadModule(relativePath) {
  const source = await readFile(new URL(relativePath, import.meta.url), 'utf8');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}

const [{ themes, elements }, { variables, demoCSS, markup, standalone, wireDemo }] = await Promise.all([
  loadModule('../js/ui-motion-guide/themes.js'),
  loadModule('../js/ui-motion-guide/engine.js')
]);

const failures = [];
let checks = 0;
function check(label, run) {
  checks += 1;
  try { run(); }
  catch (error) { failures.push(`${label}: ${error.message}`); }
}
async function checkAsync(label, run) {
  checks += 1;
  try { await run(); }
  catch (error) { failures.push(`${label}: ${error.message}`); }
}

function rgb(hex) {
  assert.match(hex, /^#[0-9a-f]{6}$/i, `Expected six-digit color, got ${hex}`);
  return [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
}
function luminance(hex) {
  const [r, g, b] = rgb(hex).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const levels = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (levels[0] + 0.05) / (levels[1] + 0.05);
}

const expectedKeys = ['hero', 'button', 'form', 'card', 'tabs', 'accordion', 'dialog', 'scroll'];
const structure = {
  hero: [/<div class="hero">/, /<h3>/, /data-action="open"/, /<dialog\b/, /role="tablist"/],
  button: [/data-state-select/, /data-state-target/, /aria-pressed="false"/, /\bdisabled\b/],
  form: [/<form\b/, /type="email"/, /\brequired\b/, /role="status"/, /type="reset"/],
  card: [/data-entrance/, /data-action="play"/, /data-action="pause"/, /data-action="replay"/, /data-action="reset"/],
  tabs: [/role="tablist"/, /role="tab"/, /role="tabpanel"/, /aria-controls=/, /aria-labelledby=/],
  accordion: [/<details>/, /<summary>/],
  dialog: [/data-action="open"/, /<dialog\b/, /data-action="confirm"/, /data-action="close"/],
  scroll: [/class="scroll-box"/, /data-scroll-item/, /data-action="scroll-reset"/, /data-action="scroll-pause"/, /data-action="scroll-play"/]
};

check('theme count', () => {
  assert.ok(themes.length >= 1, 'At least one theme must exist');
  if (process.argv.includes('--require-four')) {
    assert.deepEqual(themes.map(theme => theme.id), ['warm', 'editorial', 'technical', 'bold']);
  }
});
check('element keys', () => assert.deepEqual(elements.map(element => element.id), expectedKeys.slice(1)));
check('unique theme IDs', () => assert.equal(new Set(themes.map(theme => theme.id)).size, themes.length));

for (const theme of themes) {
  const id = theme.id;
  check(`${id} token CSS`, () => {
    const inline = variables(theme);
    const css = demoCSS(theme);
    assert.ok(css.includes(inline), 'Live CSS must use the same generated token declarations');
    for (const [key, value] of Object.entries(theme.colors)) {
      assert.ok(inline.includes(`--${key}:${value}`), `Missing ${key} color token`);
    }
    for (const [key, value] of Object.entries({
      size: `${theme.type.size}px`, title: `${theme.type.title}px`,
      max: `${theme.layout.max}px`, gap: `${theme.layout.gap}px`,
      height: `${theme.element.height}px`, duration: `${theme.motion.duration}ms`,
      ease: theme.motion.ease
    })) assert.ok(inline.includes(`--${key}:${value}`), `Missing ${key} design token`);
    assert.ok(css.includes(`@container (max-width:${theme.layout.breakpoint}px)`));
    assert.ok(css.includes(`@media (max-width:${theme.layout.breakpoint}px)`));
    assert.match(css, /prefers-reduced-motion:reduce/);
  });

  const c = theme.colors;
  const textPairs = [
    ['text/background', c.text, c.background], ['text/surface', c.text, c.surface],
    ['muted/background', c.muted, c.background], ['muted/surface', c.muted, c.surface],
    ['success/background', c.success, c.background], ['success/surface', c.success, c.surface],
    ['error/background', c.error, c.background], ['error/surface', c.error, c.surface],
    ['onAccent/accent', c.onAccent, c.accent], ['onAccent/hover', c.onAccent, c.hover]
  ];
  for (const [name, foreground, background] of textPairs) {
    check(`${id} contrast ${name}`, () => {
      const ratio = contrast(foreground, background);
      assert.ok(ratio >= 4.5, `${ratio.toFixed(2)}:1, expected at least 4.5:1`);
    });
  }
  for (const [name, background] of [['background', c.background], ['surface', c.surface]]) {
    check(`${id} focus/${name}`, () => {
      const ratio = contrast(c.focus, background);
      assert.ok(ratio >= 3, `${ratio.toFixed(2)}:1, expected at least 3:1`);
    });
  }

  for (const key of expectedKeys) {
    check(`${id}/${key} live markup`, () => {
      const html = markup(theme, key);
      assert.ok(html.length > 100, 'Demo markup is empty');
      for (const expression of structure[key]) assert.match(html, expression);
      const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
      assert.equal(new Set(ids).size, ids.length, `Duplicate IDs: ${ids.join(', ')}`);
      for (const match of html.matchAll(/\baria-(?:controls|labelledby|describedby)="([^"]+)"/g)) {
        for (const reference of match[1].split(/\s+/)) {
          assert.ok(ids.includes(reference), `ARIA reference ${reference} has no matching ID`);
        }
      }
    });

    check(`${id}/${key} copied standalone HTML`, () => {
      const html = standalone(theme, key);
      assert.match(html, /^<!doctype html>\s*<html lang="ko">/i);
      assert.match(html, /<meta name="viewport"/);
      assert.match(html, /<ui-demo><\/ui-demo>/);
      assert.match(html, /<script type="module">([\s\S]*?)<\/script>/i);
      assert.match(html, new RegExp(`background:${c.background}`, 'i'));
      assert.doesNotMatch(html, /<(?:script|link)\b[^>]*(?:src|href)\s*=|@import\s|url\(\s*['"]?https?:|\b(?:fetch|XMLHttpRequest)\s*\(/i,
        'Copied HTML must not require a network or external asset');
      const source = html.match(/<script type="module">([\s\S]*?)<\/script>/i)[1];
      assert.doesNotMatch(source, /^\s*(?:import|export)\s/m, 'Standalone script needs no imports');
      assert.match(source, /function artwork\(/);
      assert.match(source, /function markup\(/);
      assert.match(source, /function wireDemo\(/);
      assert.match(source, /attachShadow\(\{mode:'open'\}\)/);
      assert.match(source, /wireDemo\(shadow\.querySelector\('\.demo'\),t\)/);
      new Script(source, { filename: `${id}-${key}.html inline script` });
    });
  }

  check(`${id} IDs in the complete live gallery`, () => {
    // All live demos share one guide ShadowRoot, unlike the copied single-demo files.
    const ids = expectedKeys.flatMap(key => [...markup(theme, key).matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
    const duplicates = ids.filter((value, index) => ids.indexOf(value) !== index);
    assert.deepEqual(duplicates, [], `Shared ShadowRoot contains duplicate IDs: ${duplicates.join(', ')}`);
  });
}

await checkAsync('hidden memo publication path', async () => {
  const post = await readFile(new URL('../p/hidden-memo/ui-motion-guide/index.md', import.meta.url), 'utf8');
  const hub = await readFile(new URL('../p/hidden-memo/index.html', import.meta.url), 'utf8');
  const publicRegistry = await readFile(new URL('../_data/html_documents.yml', import.meta.url), 'utf8');
  const frontMatter = post.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(frontMatter, 'Guide post needs front matter');
  assert.match(frontMatter[1], /^layout:\s*post\s*$/m);
  assert.match(frontMatter[1], /^permalink:\s*\/p\/hidden-memo\/ui-motion-guide\/\s*$/m);
  assert.match(frontMatter[1], /^hidden:\s*true\s*$/m);
  assert.match(frontMatter[1], /^tags:\s*\[\]\s*$/m);
  assert.match(hub, /class="memo-card"\s+href="\.\/ui-motion-guide\/"/);
  assert.doesNotMatch(publicRegistry, /\/p\/hidden-memo\/ui-motion-guide\//);
});

function fakeCardFixture(reducedMotion) {
  const original = Object.fromEntries(['window', 'document', 'IntersectionObserver', 'innerWidth', 'innerHeight']
    .map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const observers = [];
  const animations = [];
  let action = null;
  const rect = () => ({ top: 0, bottom: 100, left: 0, right: 100 });
  class FakeObserver {
    constructor(callback) { this.callback = callback; this.disconnected = false; this.targets = []; observers.push(this); }
    observe(target) { this.targets.push(target); }
    disconnect() { this.disconnected = true; }
  }
  class FakeAnimation {
    constructor(target) {
      this.effect = { target };
      this.playState = 'running';
      this.cancelled = false;
      this.finished = new Promise((resolve, reject) => { this.resolve = resolve; this.reject = reject; });
    }
    pause() { this.playState = 'paused'; }
    play() { this.playState = 'running'; }
    cancel() { this.cancelled = true; this.playState = 'idle'; this.reject(new Error('cancelled')); }
  }
  const cards = Array.from({ length: 3 }, () => ({
    getBoundingClientRect: rect,
    animate() { const animation = new FakeAnimation(this); animations.push(animation); return animation; }
  }));
  const status = { textContent: '' };
  const root = new EventTarget();
  root.querySelector = selector => selector === '[data-motion-status]' ? status : null;
  root.querySelectorAll = selector => selector === '[data-entrance]' ? cards : [];
  root.getBoundingClientRect = rect;
  root.closest = () => action && { dataset: { action }, disabled: false };
  const media = new EventTarget();
  media.matches = reducedMotion;
  const doc = new EventTarget();
  doc.hidden = false;
  globalThis.window = { matchMedia: () => media };
  globalThis.document = doc;
  globalThis.IntersectionObserver = FakeObserver;
  globalThis.innerWidth = 1000;
  globalThis.innerHeight = 1000;
  return {
    root, status, media, cards, animations, observers,
    click(nextAction) { action = nextAction; root.dispatchEvent(new Event('click')); action = null; },
    restore() {
      for (const [name, descriptor] of Object.entries(original)) {
        if (descriptor) Object.defineProperty(globalThis, name, descriptor);
        else delete globalThis[name];
      }
    }
  };
}

// These tests simulate matchMedia and observer contracts; they do not toggle the OS setting.
await checkAsync('reduced motion card play', async () => {
  const fixture = fakeCardFixture(true);
  try {
    const cleanup = wireDemo(fixture.root, themes[0]);
    fixture.click('play');
    await Promise.resolve();
    assert.equal(fixture.animations.length, 0, 'Reduced motion should skip Web Animations API');
    assert.match(fixture.status.textContent, /동작 줄이기: 최종 상태/);
    cleanup();
  } finally { fixture.restore(); }
});

await checkAsync('card reset invalidates stale completion and cleanup removes listeners', async () => {
  const fixture = fakeCardFixture(false);
  try {
    const cleanup = wireDemo(fixture.root, themes[0]);
    fixture.click('play');
    assert.equal(fixture.animations.length, 3, 'Card play should animate three cards');
    fixture.click('reset');
    assert.ok(fixture.animations.every(animation => animation.cancelled), 'Reset should cancel active animations');
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.match(fixture.status.textContent, /^초기화 완료/, 'Old completion must not overwrite reset');
    fixture.click('play');
    assert.equal(fixture.animations.length, 6);
    cleanup();
    assert.ok(fixture.observers.length >= 2 && fixture.observers.every(observer => observer.disconnected),
      'Cleanup should disconnect both guide and target observers');
    assert.ok(fixture.animations.every(animation => animation.cancelled), 'Cleanup should cancel active animations');
    const before = fixture.status.textContent;
    fixture.click('play');
    assert.equal(fixture.animations.length, 6, 'Aborted click listener must not start new animations');
    assert.equal(fixture.status.textContent, before, 'Aborted listener must not update status');
  } finally { fixture.restore(); }
});


await checkAsync('copy failure selects the complete text for manual copying', async () => {
  const source = await readFile(new URL('../js/ui-motion-guide/index.js', import.meta.url), 'utf8');
  const start = source.indexOf('async function copy()');
  const end = source.indexOf('function navigate(', start);
  assert.ok(start >= 0 && end > start);
  const textarea = { value: '<!doctype html>complete example', focus() { this.focused = true; }, select() { this.selected = true; } };
  const status = { textContent: '' };
  const script = new Script(source.slice(start, end) + '; copy();');
  await script.runInNewContext({
    shadow: { getElementById: id => id === 'copy-content' ? textarea : status },
    navigator: { clipboard: { async writeText() { throw new Error('Permission denied in test'); } } }
  });
  assert.equal(textarea.focused, true);
  assert.equal(textarea.selected, true);
  assert.match(status.textContent, /Ctrl\/Cmd\+C/);
});


await checkAsync('offscreen cards stay paused when user resumes', async () => {
  const fixture = fakeCardFixture(false);
  try {
    fixture.cards[2].getBoundingClientRect = () => ({top:2000,bottom:2100,left:0,right:100});
    const cleanup = wireDemo(fixture.root, themes[0]);
    fixture.click('play');
    assert.equal(fixture.animations[2].playState, 'paused');
    fixture.click('pause');
    fixture.click('play');
    assert.equal(fixture.animations[0].playState, 'running');
    assert.equal(fixture.animations[2].playState, 'paused');
    cleanup();
  } finally { fixture.restore(); }
});
await checkAsync('reset does not restart canceled animations on reentry', async () => {
  const fixture = fakeCardFixture(false);
  try {
    const cleanup = wireDemo(fixture.root, themes[0]);
    fixture.click('play');
    const observer = fixture.observers.find(item => item.targets.includes(fixture.root));
    observer.callback([{target:fixture.root,isIntersecting:false}]);
    assert.ok(fixture.animations.every(animation => animation.playState === 'paused'));
    fixture.click('reset');
    observer.callback([{target:fixture.root,isIntersecting:true}]);
    assert.ok(fixture.animations.every(animation => animation.playState === 'idle'));
    cleanup();
  } finally { fixture.restore(); }
});

if (failures.length) {
  console.error(`FAIL: ${failures.length}/${checks} UI motion guide checks failed`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log(`OK: ${checks} UI motion guide checks passed (${themes.length} themes × ${expectedKeys.length} demos).`);
}
