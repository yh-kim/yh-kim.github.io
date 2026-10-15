#!/usr/bin/env node
// Deterministic regression test for the actual home-page cursor controller.
// Run with `node scripts/test-home-comet.cjs`; no DOM, browser, or packages needed.
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
const override = process.env.COMET_TEST_SOURCE && fs.readFileSync(process.env.COMET_TEST_SOURCE, 'utf8');
const candidateScripts = override && override.includes('<script')
  ? [...override.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(match => match[1])
  : override ? [override] : inlineScripts.map(match => match[1]);
const controller = candidateScripts.find(source =>
  source.includes("document.querySelector('[data-ripple-canvas]')"));
assert(controller, 'home cursor controller must be an inline script in index.html');
assert(controller.includes('}());'), 'unexpected cursor-controller wrapper');

function emitter() {
  const listeners = new Map();
  return {
    addEventListener(type, callback) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(callback);
    },
    dispatchEvent(event) {
      for (const callback of listeners.get(event.type) || []) callback(event);
    }
  };
}

function fixture(frameMs = 1000 / 60) {
  let now = 0;
  let nextFrame = 1;
  const frames = new Map();
  const painted = [];
  let currentPath = [];
  const section = Object.assign(emitter(), {
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 })
  });
  const context2d = {
    setTransform() {}, clearRect() {}, save() {}, restore() {},
    beginPath() { currentPath = []; },
    moveTo(x, y) { currentPath.push([x, y, 'M']); },
    lineTo(x, y) { currentPath.push([x, y, 'L']); },
    quadraticCurveTo(cx, cy, x, y) { currentPath.push([cx, cy], [x, y]); },
    closePath() {},
    fill() {
      if (currentPath.length) {
        const route = currentPath.slice();
        route.fillStyle = this.fillStyle;
        painted.push(route);
      }
    },
    fillRect() {}, arc(x, y) { currentPath.push([x, y]); },
    createRadialGradient() { return { addColorStop() {} }; },
    createLinearGradient(x0, y0, x1, y1) {
      assert([x0, y0, x1, y1].every(Number.isFinite), 'non-finite gradient endpoint');
      return { kind: 'linear', stops: [], addColorStop(at, color) {
        this.stops.push({ at, color });
      } };
    }
  };
  const canvas = { closest: () => section, getContext: () => context2d };
  const document = Object.assign(emitter(), {
    hidden: false,
    querySelector: selector => selector === '[data-ripple-canvas]' ? canvas : null
  });
  const window = Object.assign(emitter(), {
    devicePixelRatio: 1,
    PointerEvent: function PointerEvent() {},
    matchMedia: () => ({ matches: false, addEventListener() {} })
  });
  const globals = {
    document, window, performance: { now: () => now },
    requestAnimationFrame(callback) { const id = nextFrame++; frames.set(id, callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    CustomEvent: function CustomEvent(type, options) { this.type = type; this.detail = options.detail; },
    isFinite, Math
  };
  // Insert a read-only probe inside the real IIFE. The controller logic itself
  // runs unchanged; this only exposes its state for geometry assertions.
  const probe = `\n  globalThis.__cometSnapshot = function () {\n    return { comet: comet && { x: comet.x, y: comet.y },\n      target: target && { x: target.x, y: target.y },\n      tail: tail.map(function (p) { return { x: p.x, y: p.y, arc: p.arc }; }),\n      headArc: typeof headArc === 'undefined' ? null : headArc,\n      retiredArc: typeof retiredArc === 'undefined' ? null : retiredArc,\n      eraseStartedAt: eraseStartedAt,\n      lastPosition: lastPosition && { x: lastPosition.x, y: lastPosition.y } };\n  };\n  globalThis.__cometCurve = function () {\n    return comet && sampleCurve(centerline(), typeof headArc === 'undefined' ? 540 : Math.max(0, headArc - retiredArc));\n  };\n`;
  const source = controller.replace(/\}\(\)\);\s*$/, probe + '}());');
  assert.notEqual(source, controller, 'could not install read-only state probe');
  vm.runInNewContext(source, globals, { filename: 'index.html cursor controller' });

  function tick(ms = frameMs) {
    now += ms;
    const callbacks = [...frames.values()];
    frames.clear();
    for (const callback of callbacks) callback(now);
    const paths = painted.splice(0);
    for (const route of paths) for (const point of route)
      assert(point.slice(0, 2).every(Number.isFinite), `non-finite canvas point ${point}`);
    return paths;
  }
  function advance(ms) {
    const until = now + ms;
    while (now + frameMs < until - 0.001) tick(frameMs);
    return now < until ? tick(until - now) : [];
  }
  function move(x, y) {
    section.dispatchEvent({ type: 'pointermove', isPrimary: true,
      clientX: x, clientY: y, timeStamp: now });
  }
  function key(type, code) {
    window.dispatchEvent({ type, code, target: null, altKey: false, ctrlKey: false,
      metaKey: false, preventDefault() {} });
  }
  return { tick, advance, move, key, snapshot: () => globals.__cometSnapshot(),
    curve: () => globals.__cometCurve(),
    time: () => now, pending: () => frames.size };
}

function trajectory(frameMs = 1000 / 60) {
  const f = fixture(frameMs);
  f.move(100, 100);
  f.tick();
  f.move(460, 100);
  f.advance(750);
  return f;
}

function assertTailValid(state) {
  assert(Number.isFinite(state.headArc) && Number.isFinite(state.retiredArc));
  assert(state.headArc >= state.retiredArc - 0.01, 'retirement passed the head');
  assert(state.tail.length <= 256, 'tail grew without bound');
  for (let i = 0; i < state.tail.length; i++) {
    const point = state.tail[i];
    assert([point.x, point.y, point.arc].every(Number.isFinite), 'non-finite tail point');
    if (i) assert(point.arc <= state.tail[i - 1].arc + 0.01,
      'recorded tail reversed arc order');
  }
}

function renderedTip(paths) {
  let tip = null;
  for (const route of paths) {
    for (let i = 0; i < route.length - 1; i++) {
      if (route[i][2] === 'L' && route[i + 1][2] === 'L') {
        tip = { x: (route[i][0] + route[i + 1][0]) / 2,
          y: (route[i][1] + route[i + 1][1]) / 2 };
      }
    }
  }
  return tip;
}

// Observe the actual canvas polygon tip. This catches the original bug even
// when the controller has no arc bookkeeping to inspect.
{
  const f = trajectory();
  const before = renderedTip(f.advance(650));
  assert(before && before.x > 140, 'test did not observe a partially erased ribbon');
  f.move(460, 340);
  const after = renderedTip(f.tick());
  assert(after, 'resume did not render a ribbon');
  assert(after.x >= before.x - 8,
    `erased canvas tip jumped backwards on resume (${before.x.toFixed(1)} → ${after.x.toFixed(1)})`);
}

// A fading tail should dissolve along its length: the final tip is transparent
// while nearby pixels retain graduated opacity. Inspect canvas gradients rather
// than requiring a particular number or arrangement of draw calls.
{
  const f = trajectory();
  const paths = f.advance(650);
  const gradients = paths.map(route => route.fillStyle).filter(style => style && style.kind === 'linear');
  assert(gradients.length, 'idle tail has no opacity gradient');
  const stops = gradients.flatMap(gradient => gradient.stops.map(stop => {
    assert(stop.at >= 0 && stop.at <= 1, 'invalid gradient stop');
    const match = /^rgba\([^,]+,[^,]+,[^,]+,\s*([^)]+)\)$/.exec(stop.color);
    assert(match && Number.isFinite(Number(match[1])), `invalid gradient color ${stop.color}`);
    return Number(match[1]);
  }));
  assert(stops.some(alpha => alpha > 0.01), 'fading tail lost its visible body');
  assert(stops.some(alpha => alpha < 0.001), 'fading tail retained an opaque tip');
  assert(new Set(stops.map(alpha => alpha.toFixed(3))).size >= 3,
    'fading tail has no gradual opacity transition');
}

// The oldest visible point must physically retreat while the comet rests.
{
  const f = trajectory();
  const early = f.snapshot();
  assert(early.tail.length > 2, 'movement did not create a tail');
  const earlyTip = early.tail.at(-1);
  f.advance(650);
  const late = f.snapshot();
  assertTailValid(late);
  assert(late.retiredArc > early.retiredArc + 30, 'idle tail did not erase from its tip');
  assert(late.tail.at(-1).x > earlyTip.x + 25, 'visible oldest tip did not move toward the head');
}

// Turn across the old route after half erasure. No retired point may re-enter
// the rendered/recorded tail, even through repeated pause/resume cycles.
{
  const f = trajectory();
  f.advance(500);
  let previousRetired = f.snapshot().retiredArc;
  assert(previousRetired > 40, 'test did not reach partial erasure');
  for (const [x, y] of [[460, 340], [180, 340], [180, 130], [520, 130]]) {
    f.move(x, y);
    f.advance(500);
    let state = f.snapshot();
    assertTailValid(state);
    assert(state.retiredArc >= previousRetired - 0.01,
      'a retired portion of the tail was resurrected on resume');
    if (state.tail.length) assert(state.tail.at(-1).arc >= state.retiredArc - 0.01,
      'stale geometry remains behind the visible tail tip');
    previousRetired = state.retiredArc;
    f.advance(380);
    state = f.snapshot();
    assertTailValid(state);
    assert(state.retiredArc >= previousRetired - 0.01);
    previousRetired = state.retiredArc;
  }
}

// A completed fade must not return the old route on the next gesture.
{
  const f = trajectory();
  f.advance(2500);
  assert.equal(f.snapshot().tail.length, 0, 'fully faded tail retained geometry');
  f.move(600, 420);
  f.advance(700);
  const state = f.snapshot();
  assertTailValid(state);
  assert(state.tail.every(point => point.x > 390 || point.y > 250),
    'a fresh gesture reintroduced geometry from the old route');
}

// The spring settles at its target and keyboard input starts at the last
// pointer position. Use the emitted head coordinates, not a copied spring.
{
  const f = fixture();
  f.move(220, 240);
  f.tick();
  f.move(480, 240);
  f.advance(600);
  let state = f.snapshot();
  assert(Math.hypot(state.comet.x - 480, state.comet.y - 240) < 0.5,
    'head did not settle at the target');
  f.key('keydown', 'ArrowDown');
  f.advance(100);
  state = f.snapshot();
  assert(state.lastPosition.y > 250 && state.lastPosition.x > 470,
    'keyboard motion did not continue from the pointer');
  f.key('keyup', 'ArrowDown');
}

// The same timed input should land at nearly the same point at both common
// refresh rates. All canvas control points are checked for finite values above.
{
  function sample(frameMs) {
    const f = fixture(frameMs);
    f.move(80, 80);
    f.tick();
    f.move(500, 80);
    f.advance(150);
    f.move(500, 390);
    f.advance(150);
    const state = f.snapshot();
    assertTailValid(state);
    assert(state.tail.length > 3, 'turn produced no ribbon geometry');
    return { head: state.comet, curve: f.curve() };
  }
  const a = sample(1000 / 60), b = sample(1000 / 120);
  assert(Math.hypot(a.head.x - b.head.x, a.head.y - b.head.y) < 5,
    'head motion varies too much between 60 Hz and 120 Hz');
  const vectors = [];
  for (let i = 1; i < a.curve.length; i++) {
    const dx = a.curve[i].x - a.curve[i - 1].x;
    const dy = a.curve[i].y - a.curve[i - 1].y;
    if (Math.hypot(dx, dy) > 0.3) vectors.push([dx, dy]);
  }
  assert(vectors.length > 20, 'turn did not produce enough curve samples');
  for (let i = 1; i < vectors.length; i++) {
    const [ax, ay] = vectors[i - 1], [bx, by] = vectors[i];
    const angle = Math.atan2(Math.abs(ax * by - ay * bx), ax * bx + ay * by);
    assert(angle < 1.1, 'rendered centreline contains a sharp turn');
  }
}

console.log('home comet regression: passed');
