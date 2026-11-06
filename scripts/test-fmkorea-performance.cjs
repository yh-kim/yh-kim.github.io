const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const source = readFileSync('p/hidden-memo/tampermonkey/userscripts/fmkorea-mobile.user.js', 'utf8');
function between(start, end) { return source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start))); }

class Element {
  constructor(attributes = {}, tag = 'img') { this.attributes = new Map(Object.entries(attributes)); this.tag = tag; this.children = []; this.parentElement = null; }
  getAttribute(key) { return this.attributes.get(key) ?? null; }
  setAttribute(key, value) { this.attributes.set(key, String(value)); }
  removeAttribute(key) { this.attributes.delete(key); }
  querySelectorAll(selector) { return selector === 'source' ? this.children : []; }
  querySelector() { return null; }
  matches(selector) { return selector === 'picture' ? this.tag === 'picture' : selector.startsWith('.') && (this.getAttribute('class') || '').split(/\s+/).includes(selector.slice(1)); }
  closest() { return null; }
}
class Video extends Element {
  constructor(attributes) { super(attributes, 'video'); this.loads = 0; this.pauses = 0; this.muted = true; this.volume = .3; }
  get preload() { return this.getAttribute('preload') || ''; }
  set preload(value) { this.setAttribute('preload', value); }
  load() { this.loads++; }
  pause() { this.pauses++; }
}
const media = vm.createContext({ HTMLVideoElement: Video, Map, Set });
vm.runInContext(between('  function suspendMediaResources(', '  function restoreDetailMedia('), media);
test('hidden video keeps sources available to the site player and restores preload without resetting playback', () => {
  const video = new Video({ src: '/a.mp4', poster: '/poster.jpg', preload: 'auto' });
  const child = new Element({ src: '/b.mp4', type: 'video/mp4' }, 'source');
  child.parentElement = video; video.children.push(child);
  const state = { resources: new Map() };
  media.suspendMediaResources(video, state);
  assert.equal(video.getAttribute('src'), '/a.mp4'); assert.equal(child.getAttribute('src'), '/b.mp4');
  assert.equal(video.getAttribute('poster'), '/poster.jpg');
  assert.equal(video.preload, 'none'); assert.equal(video.loads, 0);
  media.suspendMediaResources(video, state); assert.equal(video.loads, 0);
  media.restoreMediaResources(state, video);
  assert.equal(video.getAttribute('src'), '/a.mp4'); assert.equal(child.getAttribute('src'), '/b.mp4');
  assert.equal(video.getAttribute('poster'), '/poster.jpg'); assert.equal(video.preload, 'auto');
  assert.equal(video.loads, 0); assert.equal(video.muted, true); assert.equal(video.volume, .3);
  assert.equal(state.resources.size, 0);
});
test('picture and lazy image sources stay suspended and restore only the selected item', () => {
  const picture = new Element({}, 'picture');
  const image = new Element({ src: '/photo.jpg', 'data-original': '/photo.jpg', srcset: '/photo2.jpg 2x' });
  const child = new Element({ srcset: '/photo.webp 1x' }, 'source');
  picture.children.push(child); image.parentElement = picture; child.parentElement = picture;
  const other = new Element({ src: '/other.jpg' });
  const state = { resources: new Map() };
  media.suspendMediaResources(image, state); media.suspendMediaResources(other, state);
  assert.equal(child.getAttribute('srcset'), null); assert.equal(image.getAttribute('data-original'), null);
  // A site lazy loader rewrites the URL while the media is hidden.
  image.setAttribute('src', '/updated.jpg'); media.suspendMediaResources(image, state);
  media.restoreMediaResources(state, image);
  assert.equal(image.getAttribute('src'), '/updated.jpg'); assert.equal(child.getAttribute('srcset'), '/photo.webp 1x');
  assert.equal(other.getAttribute('src'), null);
  media.restoreMediaResources(state); assert.equal(other.getAttribute('src'), '/other.jpg');
});
test('missing video preload restores as an absent attribute', () => {
  const video = new Video({}); const state = { resources: new Map() };
  media.suspendMediaResources(video, state); media.restoreMediaResources(state);
  assert.equal(video.getAttribute('preload'), null);
});

function scheduler() {
  const microtasks = [], frames = new Map(), calls = [];
  const root = new Element(); let frameId = 0;
  const context = vm.createContext({ Element, Set, Map,
    document: { hidden: false, documentElement: root, head: { appendChild() {} } },
    window: { requestAnimationFrame(fn) { frames.set(++frameId, fn); return frameId; }, cancelAnimationFrame(id) { frames.delete(id); }, clearTimeout() {} },
    queueMicrotask(fn) { microtasks.push(fn); },
    observer: { disconnect() {}, observe() {} }, observerOptions: {},
    style: { textContent: '', isConnected: true }, styleText: '', booting: false,
    isMobileView: () => true, settings: { enabled: true },
    applySettings(sections) { calls.push(sections ? [...sections].sort() : ['all']); },
    discoverAdSelectors: () => [], currentAdSelectors: [], collectAdTargets: () => [], collectHeaderTargets: () => [],
    syncHiddenElements() {}, updateBestAlerts() {}, updateCommentComposers() {}, mountControls() {},
    updateBoardLabels() {}, updateDetailCounts() {}, host: null, launcherClickTimer: null,
  });
  vm.runInContext('let pending=false, refreshFrame=0; const dirtySections=new Set();' +
    between('  function refresh(scheduled', '  function start() {') +
    between('  function mutationSections(', '  const observerOptions'), context);
  return { context, microtasks, frames, calls, drain() { while (microtasks.length) microtasks.shift()(); }, frame() { const tasks = [...frames.values()]; frames.clear(); tasks.forEach(fn => fn()); } };
}
test('many ordinary changes coalesce into one frame and only run their sections', () => {
  const s = scheduler();
  for (let i = 0; i < 100; i++) s.context.scheduleRefresh(new Set(['comments']));
  s.context.scheduleRefresh(new Set(['list', 'read']));
  assert.equal(s.frames.size, 1); assert.equal(s.microtasks.length, 0);
  s.frame(); assert.deepEqual(s.calls, [['comments', 'list', 'read']]);
});
test('new hidden media and alerts preempt the frame before painting', () => {
  const s = scheduler(); s.context.scheduleRefresh(new Set(['comments']));
  s.context.scheduleRefresh(new Set(['media'])); s.context.scheduleRefresh(new Set(['alerts']));
  assert.equal(s.frames.size, 0); assert.equal(s.microtasks.length, 1);
  s.drain(); assert.deepEqual(s.calls, [['alerts', 'comments', 'media']]);
});
test('background work is deferred and returning runs one full update', () => {
  const s = scheduler(); s.context.document.hidden = true;
  for (let i = 0; i < 100; i++) s.context.scheduleRefresh(new Set(['media']));
  assert.equal(s.frames.size, 0); assert.equal(s.microtasks.length, 0); assert.equal(s.calls.length, 0);
  s.context.document.hidden = false; s.context.scheduleRefresh(); s.drain();
  assert.deepEqual(s.calls, [['all']]);
});
test('queued work does not run while hidden and explicit setting changes always refresh all sections', () => {
  const s = scheduler(); s.context.scheduleRefresh(new Set(['comments']));
  s.context.document.hidden = true; s.frame(); assert.equal(s.calls.length, 0);
  s.context.document.hidden = false; s.context.refresh(); assert.deepEqual(s.calls, [['all']]);
  s.context.scheduleRefresh(new Set(['comments'])); s.context.refresh(); s.frame();
  assert.deepEqual(s.calls, [['all'], ['all']]);
});
test('playback control mutations are ignored, while content and alerts choose specific sections', () => {
  const s = scheduler(); const target = new Element();
  const record = { target, type: 'characterData', addedNodes: [], removedNodes: [] };
  target.closest = selector => selector === '.rd_body article' || selector.includes('.mejs__controls') ? target : null;
  assert.deepEqual([...s.context.mutationSections(record)], []);
  target.closest = selector => selector === '#fm_alert' ? target : null;
  assert.deepEqual([...s.context.mutationSections(record)], ['alerts']);
  target.closest = selector => selector === '.rd_body article' ? target : null;
  assert.deepEqual([...s.context.mutationSections(record)], ['media', 'bright']);
});

function brightness(sample) {
  let probes = 0, samples = 0;
  const context = vm.createContext({ Map, Promise,
    brightImages: { cache: new Map(), requests: new Map(), queue: [] },
    sampleImageBrightness() { samples++; return sample; }, pumpBrightImageQueue() { probes++; },
  });
  vm.runInContext('const MAX_BRIGHT_IMAGE_PIXELS=4_000_000;' +
    between('  function rememberImageBrightness(', '  function pumpBrightImageQueue('), context);
  return { context, probes: () => probes, samples: () => samples };
}
test('loaded readable images use no extra image probe and share cached results', async () => {
  const b = brightness(false); const image = { src: '/dark.jpg', naturalWidth: 128, naturalHeight: 128 };
  assert.equal(await b.context.inspectBrightImage(image), false);
  assert.equal(await b.context.inspectBrightImage(image), false);
  assert.equal(b.probes(), 0); assert.equal(b.samples(), 1);
});
test('large images remain dim without another decode; small CORS failures share a single queued probe', async () => {
  const b = brightness(null);
  assert.equal(await b.context.inspectBrightImage({ src: '/huge.jpg', naturalWidth: 5000, naturalHeight: 4000 }), true);
  assert.equal(b.probes(), 0); assert.equal(b.samples(), 0);
  const image = { src: '/cors.jpg', naturalWidth: 128, naturalHeight: 128 };
  const first = b.context.inspectBrightImage(image), second = b.context.inspectBrightImage(image);
  assert.equal(first, second); assert.equal(b.probes(), 1);
  b.context.brightImages.queue[0].resolve(true); assert.equal(await first, true);
});

test('brightness sampling frees its canvas after readable and CORS-blocked results', () => {
  const canvas = { width: 0, height: 0, getContext() { return { drawImage() {}, getImageData() {
    if (blocked) throw new Error('SecurityError');
    return { data: new Uint8ClampedArray(32 * 32 * 4).fill(255) };
  } }; } };
  let blocked = false;
  const context = vm.createContext({ document: { createElement: () => canvas } });
  vm.runInContext(between('  function sampleImageBrightness(', '  function rememberImageBrightness('), context);
  assert.equal(context.sampleImageBrightness({}), true);
  assert.equal(canvas.width, 0); assert.equal(canvas.height, 0);
  blocked = true; assert.equal(context.sampleImageBrightness({}), null);
  assert.equal(canvas.width, 0); assert.equal(canvas.height, 0);
});

for (const [className, expectedPlays] of [['video-with-sound', 0], ['video-without-sound', 1], ['video-with-sound video-without-sound', 0], ['', 0]]) test(`reveal playback: ${className || 'unknown'} requests play ${expectedPlays} time(s)`, () => {
  const video = new Video({ class: className, preload: 'none', poster: '/preview.webp' });
  const source = new Element({ src: '/movie.mp4', type: 'video/mp4' }, 'source');
  source.parentElement = video; video.children.push(source);
  const root = { contains: () => true };
  const state = { resources: new Map(), placeholders: new Map(), frames: new Map(), revealedItems: new WeakSet() };
  let shown = false, plays = 0, refreshes = 0;
  video.play = () => {
    assert.equal(shown, true);
    assert.equal(source.getAttribute('src'), '/movie.mp4');
    assert.equal(video.muted, true);
    plays++;
    return Promise.resolve();
  };
  video.before = () => {};
  const context = vm.createContext({ HTMLVideoElement: Video, Map, Set, Node: {},
    document: { createElement() { return { isConnected: true, setAttribute() {},
      addEventListener(name, callback) { this[name] = callback; }, remove() {} }; } },
    detailMedia: new Map([[root, state]]), prepareDetailImages() {},
    syncDetailMedia() { shown = true; }, scheduleRefresh() { refreshes++; }
  });
  vm.runInContext(between('  function isSilentVideo(', '  function restoreDetailMedia('), context);
  context.suspendMediaResources(video, state);
  // Mirrors the site's deferred initializer: the original source is present before reveal.
  assert.equal(source.getAttribute('src'), '/movie.mp4');
  context.syncMediaPlaceholders(root, state, [{ key: video, target: video, kind: 'video', sources: [video] }], new Set());
  const button = state.placeholders.get(video).button;
  button.click({ preventDefault() {}, stopPropagation() {} });
  assert.equal(shown, true); assert.equal(plays, expectedPlays); assert.equal(refreshes, 1); assert.equal(video.loads, 0);
  assert.equal(state.revealedItems.has(video), true);
});

test('native and site viewport autoplay are disabled, while manual playback survives later refreshes', () => {
  const video = new Video({ class: 'video-with-sound', autoplay: '', 'data-autoplay': 'true', src: '/movie.mp4' });
  const silent = new Video({ class: 'video-without-sound', autoplay: '', 'data-autoplay': 'true' });
  silent.paused = false;
  video.paused = false;
  const settings = { enabled: true };
  const context = vm.createContext({ Map, Set, settings, HTMLVideoElement: Video,
    manualVideos: new Map(), document: { documentElement: { getAttribute: () => 'true' }, querySelectorAll: () => [video, silent] }
  });
  vm.runInContext(between('  function isSilentVideo(', '  function syncMediaPlaceholders(') + between('  function syncManualVideos(', '  function syncDetailMedia('), context);
  context.syncManualVideos();
  assert.equal(video.getAttribute('autoplay'), null);
  assert.equal(video.getAttribute('data-autoplay'), 'false');
  assert.equal(video.pauses, 1);
  assert.equal(silent.getAttribute('autoplay'), '');
  assert.equal(silent.getAttribute('data-autoplay'), 'true');
  assert.equal(silent.pauses, 0);
  context.syncManualVideos(); assert.equal(video.pauses, 1);
  assert.equal(video.getAttribute('src'), '/movie.mp4'); assert.equal(video.muted, true);
  settings.enabled = false; context.syncManualVideos();
  assert.equal(video.getAttribute('autoplay'), ''); assert.equal(video.getAttribute('data-autoplay'), 'true');
  assert.equal(context.manualVideos.size, 0);
});

test('article photos missed by the site lazy loader resume near the viewport and keep night dimming', () => {
  const listSelector = 'list-images', lazySelector = 'list-and-article-lazy-images';
  const photo = new Element({ src: '/transparent.gif', 'data-original': '/fourth-photo.webp', 'data-fm-clean-bright-image': '' });
  photo.complete = true; photo.naturalWidth = 1; photo.near = false; photo.isConnected = true;
  photo.getClientRects = () => photo.hidden ? [] : [{}];
  photo.getBoundingClientRect = () => ({ width: 390, height: 220, top: photo.near ? 10 : 3000, bottom: photo.near ? 230 : 3220, right: 390, left: 0 });
  photo.matches = selector => selector === lazySelector;
  let callback; const observed = new Set();
  const context = vm.createContext({ LIST_IMAGE_SELECTOR: listSelector, LAZY_IMAGE_SELECTOR: lazySelector, AD_STATE_ATTRIBUTE: 'data-ad',
    settings: { enabled: true }, listImages: { observer: null, tracked: new Set(), listening: false },
    URL, location: { href: 'https://m.fmkorea.com/best/123' }, getComputedStyle: () => ({ visibility: 'visible' }),
    document: { hidden: false, documentElement: { getAttribute: () => 'true' }, querySelectorAll: () => [photo] },
    window: { innerWidth: 390, innerHeight: 800, addEventListener() {},
      IntersectionObserver: true },
    IntersectionObserver: class { constructor(fn) { callback = fn; } observe(img) { observed.add(img); } unobserve(img) { observed.delete(img); } }
  });
  vm.runInContext(between('  function imageNearViewport(', '  function brightImageModeActive('), context);
  context.syncListImages();
  assert.equal(photo.getAttribute('src'), '/transparent.gif'); assert.equal(observed.has(photo), true);
  photo.near = true; callback([{ target: photo, isIntersecting: true }]);
  assert.equal(photo.getAttribute('src'), '/fourth-photo.webp'); assert.equal(photo.loading, 'eager');
  assert.equal(photo.getAttribute('data-fm-clean-bright-image'), ''); assert.equal(observed.has(photo), false);
  // Hidden photos must not be loaded, even if their recorded position is close.
  photo.setAttribute('src', '/transparent.gif'); photo.hidden = true;
  context.syncListImages(); callback([{ target: photo, isIntersecting: true }]);
  assert.equal(photo.getAttribute('src'), '/transparent.gif');
  photo.hidden = false; context.syncListImages();
  assert.equal(photo.getAttribute('src'), '/fourth-photo.webp');
});
