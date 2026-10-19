#!/usr/bin/env node
// Exercise the real inline home cursor with a deterministic DOM/canvas/RAF.
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const source = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .map(match => match[1])
  .find(script => script.includes("document.querySelector('[data-ripple-canvas]')"));
assert(source, 'home cursor controller must be an inline script in index.html');

function emitter() {
  const listeners = new Map();
  return {
    addEventListener(type, listener) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(listener);
    },
    dispatchEvent(event) {
      for (const listener of listeners.get(event.type) || []) listener(event);
      return true;
    }
  };
}

function fixture(frameMs = 1000 / 60) {
  let now = 1;
  let nextFrame = 1;
  const frames = new Map();
  let scene = [];
  let currentPath = [];
  const saved = [];
  const events = [];
  const section = Object.assign(emitter(), {
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 })
  });
  const ctx = {
    fillStyle: '#000', globalAlpha: 1,
    setTransform() {}, resetTransform() {}, translate() {}, scale() {},
    save() { saved.push({ fillStyle: this.fillStyle, globalAlpha: this.globalAlpha }); },
    restore() {
      if (saved.length) {
        const state = saved.pop();
        this.fillStyle = state.fillStyle;
        this.globalAlpha = state.globalAlpha;
      }
    },
    clearRect() { scene = []; },
    beginPath() { currentPath = []; },
    arc(x, y, radius) { currentPath.push({ op: 'arc', x, y, radius }); },
    fill() {
      if (!currentPath.length) return;
      const circle = currentPath.length === 1 && currentPath[0].op === 'arc';
      scene.push({ kind: circle ? 'arc' : 'path',
        ...(circle ? currentPath[0] : { points: currentPath.slice() }),
        alpha: this.globalAlpha, color: this.fillStyle, time: now });
    },
    stroke() { if (currentPath.length) scene.push({ kind: 'stroke', points: currentPath.slice(),
      alpha: this.globalAlpha, color: this.strokeStyle, time: now }); },
    fillRect(x, y, width, height) { scene.push({ kind: 'rect', x, y, width, height,
      alpha: this.globalAlpha, color: this.fillStyle, time: now }); },
    moveTo(x, y) { currentPath.push({ op: 'move', x, y }); },
    lineTo(x, y) { currentPath.push({ op: 'line', x, y }); },
    quadraticCurveTo(cx, cy, x, y) { currentPath.push({ op: 'quadratic', cx, cy, x, y }); },
    bezierCurveTo(c1x, c1y, c2x, c2y, x, y) {
      currentPath.push({ op: 'bezier', c1x, c1y, c2x, c2y, x, y });
    },
    closePath() { currentPath.push({ op: 'close' }); },
    createRadialGradient() { return { kind: 'radial', addColorStop() {} }; },
    createLinearGradient(x0, y0, x1, y1) {
      assert([x0, y0, x1, y1].every(Number.isFinite), 'non-finite ribbon gradient');
      return { kind: 'linear', stops: [], addColorStop(at, color) {
        this.stops.push({ at, color });
      } };
    }
  };
  const canvas = { closest: () => section, getContext: () => ctx };
  const document = Object.assign(emitter(), {
    hidden: false,
    querySelector: selector => selector === '[data-ripple-canvas]' ? canvas : null
  });
  const motionQuery = Object.assign(emitter(), { matches: false, addListener() {} });
  const window = Object.assign(emitter(), {
    devicePixelRatio: 1,
    PointerEvent: function PointerEvent() {},
    matchMedia: () => motionQuery
  });
  const globals = {
    document, window, performance: { now: () => now },
    requestAnimationFrame(callback) { const id = nextFrame++; frames.set(id, callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    CustomEvent: function CustomEvent(type, options) { this.type = type; this.detail = options.detail; },
    Math, isFinite
  };
  section.addEventListener('home-cursor-burst', event => events.push(event));
  vm.runInNewContext(source, globals, { filename: 'index.html cursor controller' });

  function tick(ms = frameMs) {
    now += ms;
    const callbacks = [...frames.values()];
    frames.clear();
    for (const callback of callbacks) callback(now);
    for (const shape of scene) {
      assert(Number.isFinite(shape.alpha) && shape.alpha >= 0,
        'canvas drew invalid opacity');
      if (shape.kind === 'arc') {
        assert([shape.x, shape.y, shape.radius].every(Number.isFinite) && shape.radius >= 0,
          'canvas drew non-finite circle geometry');
      }
      if (shape.points) {
        assert(shape.points.length < 4096, 'canvas path point count is unbounded');
        for (const point of shape.points) for (const [key, value] of Object.entries(point))
          if (key !== 'op') assert(Number.isFinite(value), 'canvas drew non-finite path geometry');
      }
    }
    assert(scene.length < 200, 'canvas draw count is unbounded');
    return scene.slice();
  }
  function advance(ms) {
    const until = now + ms;
    while (now + frameMs < until - 0.001) tick(frameMs);
    if (now < until) tick(until - now);
    return scene.slice();
  }
  function pointer(type, x, y, extra = {}) {
    section.dispatchEvent({ type, isPrimary: true, clientX: x, clientY: y,
      timeStamp: now, ...extra });
  }
  function key(type, code) {
    window.dispatchEvent({ type, code, target: null, altKey: false, ctrlKey: false,
      metaKey: false, repeat: false, preventDefault() {} });
  }
  function latest() { return scene.filter(shape => shape.kind === 'arc').at(-1) || null; }
  function ribbons() { return scene.filter(shape => shape.kind === 'path' || shape.kind === 'stroke'); }
  return { tick, advance, pointer, key, latest, ribbons, scene: () => scene.slice(),
    events, window, document, motionQuery };
}

function visibleSize(circle) {
  return circle ? circle.radius * Math.sqrt(circle.alpha) : 0;
}

function pathPoints(shapes) {
  return shapes.flatMap(shape => (shape.points || []).flatMap(command => {
    const points = [];
    if (Number.isFinite(command.x) && Number.isFinite(command.y))
      points.push({ x: command.x, y: command.y });
    if (Number.isFinite(command.cx) && Number.isFinite(command.cy))
      points.push({ x: command.cx, y: command.cy });
    if (Number.isFinite(command.c1x) && Number.isFinite(command.c1y))
      points.push({ x: command.c1x, y: command.c1y });
    if (Number.isFinite(command.c2x) && Number.isFinite(command.c2y))
      points.push({ x: command.c2x, y: command.c2y });
    return points;
  }));
}

function tailExtent(f) {
  const head = f.latest();
  if (!head) return 0;
  const points = pathPoints(f.ribbons());
  return points.length ? Math.max(...points.map(point =>
    Math.hypot(point.x - head.x, point.y - head.y))) : 0;
}

function spanEdges(shape) {
  const commands = shape.points || [];
  const crossing = commands.findIndex(command => command.op === 'line');
  if (crossing < 2) return null;
  const left = commands.slice(0, crossing).filter(command => command.op === 'quadratic');
  const right = commands.slice(crossing + 1).filter(command => command.op === 'quadratic');
  if (!left.length || !right.length) return null;
  return {
    leftStart: commands[0], leftEnd: left.at(-1), rightEnd: commands[crossing],
    rightStart: right.at(-1), leftFirst: left[0], leftLast: left.at(-1),
    rightFirst: right[0], rightLast: right.at(-1)
  };
}

function tangent(a, b) {
  const length = Math.hypot(b.x - a.x, b.y - a.y);
  return length > 0.001 ? { x: (b.x - a.x) / length, y: (b.y - a.y) / length } : null;
}

function assertSameTangent(first, second, label) {
  if (!first || !second) return;
  assert(Math.hypot(first.x - second.x, first.y - second.y) < 0.15,
    `ribbon ${label} tangent is discontinuous across spans`);
}

function stopAlpha(stop) {
  const match = /^rgba\([^,]+,[^,]+,[^,]+,\s*([^)]+)\)$/.exec(stop.color);
  assert(match && Number.isFinite(Number(match[1])), 'invalid ribbon opacity stop');
  return Number(match[1]);
}

// First appearance starts under the pointer. The accepted head spring still
// lags a new target and converges without crossing it.
{
  const f = fixture();
  f.pointer('pointerenter', 160, 180);
  f.pointer('pointermove', 160, 180);
  f.tick();
  assert(f.latest() && f.latest().x > 100 && f.latest().y > 100,
    'first entry animated from the canvas origin');
  assert(f.latest().radius > 0 && f.latest().radius < 2.6 &&
    f.latest().alpha > 0 && f.latest().alpha < 1,
    'first entry must grow and fade in smoothly');
  f.advance(600);
  const initial = f.latest();
  assert(initial, 'pointer entry did not draw a circle');
  assert.equal(initial.color, '#fff3d6', 'meteor is missing its warm white core');
  assert(Math.abs(initial.radius - 2.6) < 0.3, 'settled meteor core has the wrong size');
  assert(Math.abs(initial.alpha - 1) < 0.02, 'settled cursor is not opaque');
  assert.equal(f.scene().filter(shape => shape.kind === 'arc').length, 1,
    'meteor rendered dots along its wake');

  f.pointer('pointermove', 500, 180);
  f.tick();
  const lagged = f.latest();
  assert(lagged.x > 160 && lagged.x < 500, 'cursor did not lag behind pointer motion');
  let previousX = lagged.x;
  for (let i = 0; i < 50; i++) {
    f.tick();
    const circle = f.latest();
    assert(circle.x >= previousX - 0.01 && circle.x <= 500.5,
      'position spring reversed or overshot the target');
    assert.equal(f.scene().filter(shape => shape.kind === 'arc').length, 1,
      'meteor rendered dots along its wake');
    previousX = circle.x;
  }
  assert(Math.abs(f.latest().x - 500) < 1, 'cursor did not settle at the pointer');
  f.advance(1600);
  assert(tailExtent(f) < 8, 'idle meteor tail did not collapse toward the head');
}

// The meteor's wake grows during travel, rounds a right-angle turn, then
// collapses toward the stopped head. A resumed turn cannot reveal an older tip.
{
  const f = fixture();
  f.pointer('pointerenter', 100, 100);
  f.pointer('pointermove', 100, 100);
  f.advance(400);
  f.pointer('pointermove', 460, 100);
  f.advance(150);
  assert(f.ribbons().length > 0 && tailExtent(f) > 35,
    'meteor did not grow a continuous wake while moving');
  assert.equal(f.scene().filter(shape => shape.kind === 'arc').length, 1,
    'meteor tail was rendered as a chain of dots');
  const spans = f.ribbons().filter(shape => shape.kind === 'path' && shape.color.kind === 'linear');
  assert(spans.length >= 2, 'meteor tail has no connected gradient ribbon spans');
  const groups = new Map();
  for (const span of spans) {
    const color = span.color.stops[0]?.color || '';
    const rgb = color.match(/^rgba\(([^,]+,[^,]+,[^,]+),/);
    assert(rgb, 'invalid ribbon gradient color');
    if (!groups.has(rgb[1])) groups.set(rgb[1], []);
    groups.get(rgb[1]).push(span);
  }
  let tapered = false;
  let feathered = false;
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    for (let i = 1; i < group.length; i++) {
      const previous = spanEdges(group[i - 1]);
      const next = spanEdges(group[i]);
      assert(previous && next &&
        Math.hypot(previous.leftEnd.x - next.leftStart.x,
          previous.leftEnd.y - next.leftStart.y) < 0.5 &&
        Math.hypot(previous.rightEnd.x - next.rightStart.x,
          previous.rightEnd.y - next.rightStart.y) < 0.5,
        'ribbon spans have a visible geometry gap');
      assertSameTangent(
        tangent({ x: previous.leftLast.cx, y: previous.leftLast.cy }, previous.leftEnd),
        tangent(next.leftStart, { x: next.leftFirst.cx, y: next.leftFirst.cy }), 'left');
      assertSameTangent(
        tangent(previous.rightEnd, { x: previous.rightFirst.cx, y: previous.rightFirst.cy }),
        tangent({ x: next.rightLast.cx, y: next.rightLast.cy }, next.rightStart), 'right');
    }
    const first = spanEdges(group[0]), last = spanEdges(group.at(-1));
    const firstWidth = Math.hypot(first.leftEnd.x - first.rightEnd.x,
      first.leftEnd.y - first.rightEnd.y);
    const lastWidth = Math.hypot(last.leftEnd.x - last.rightEnd.x,
      last.leftEnd.y - last.rightEnd.y);
    if (firstWidth > lastWidth + 1) tapered = true;
    const firstAlpha = stopAlpha(group[0].color.stops[0]);
    const lastAlpha = stopAlpha(group.at(-1).color.stops.at(-1));
    if (firstAlpha > 0.01 && lastAlpha < 0.001) feathered = true;
  }
  assert(tapered, 'meteor wake does not taper toward its old end');
  assert(feathered, 'meteor wake does not fade toward its old end');
  f.advance(450);
  const restingPoints = pathPoints(f.ribbons());
  assert(restingPoints.length, 'wake vanished before the partial-collapse test');
  const tipBefore = Math.min(...restingPoints.map(point => point.x));
  f.pointer('pointermove', 460, 350);
  f.tick();
  const resumedPoints = pathPoints(f.ribbons());
  assert(resumedPoints.length, 'perpendicular resume did not render a wake');
  const tipAfter = Math.min(...resumedPoints.map(point => point.x));
  assert(tipAfter >= tipBefore - 8,
    `collapsed wake tip jumped backward on resume (${tipBefore.toFixed(1)} → ${tipAfter.toFixed(1)})`);
  f.advance(150);
  const curve = pathPoints(f.ribbons());
  assert(curve.length > 20, 'turn produced too little ribbon geometry');
  const hasDiagonal = curve.some((point, i) => i > 0 &&
    Math.abs(point.x - curve[i - 1].x) > 1 &&
    Math.abs(point.y - curve[i - 1].y) > 1);
  assert(hasDiagonal, 'right-angle pointer turn has no diagonal tangent');
  f.advance(2000);
  assert(tailExtent(f) < 8, 'wake did not collapse after motion stopped');
}

// Leaving fades and shrinks over multiple frames, eventually clearing.
{
  const f = fixture();
  f.pointer('pointerenter', 300, 250);
  f.pointer('pointermove', 300, 250);
  f.advance(600);
  f.pointer('pointerleave', 300, 250);
  const sizes = [];
  const radii = [];
  const opacities = [];
  for (let i = 0; i < 10; i++) {
    f.tick();
    const circle = f.latest();
    sizes.push(visibleSize(circle));
    radii.push(circle ? circle.radius : 0);
    opacities.push(circle ? circle.alpha : 0);
  }
  assert(sizes[0] > 0 && sizes[0] < 2.6,
    'leave must begin a smooth fade and shrink');
  assert(sizes.at(-1) < sizes[0], 'leave animation did not progress');
  for (let i = 1; i < sizes.length; i++)
    assert(sizes[i] <= sizes[i - 1] + 0.1, 'leave animation reversed');
  assert(radii.at(-1) < radii[0] && opacities.at(-1) < opacities[0],
    'leave must reduce both scale and opacity');
  f.advance(1200);
  assert(visibleSize(f.latest()) < 0.5, 'pointer leave did not hide the cursor');
}

// The same timed input should yield comparable positions on common displays.
{
  function sample(frameMs) {
    const f = fixture(frameMs);
    f.pointer('pointerenter', 80, 80);
    f.pointer('pointermove', 80, 80);
    f.advance(400);
    f.pointer('pointermove', 500, 360);
    f.advance(180);
    return f.latest();
  }
  const a = sample(1000 / 60), b = sample(1000 / 120);
  assert(a && b && Math.hypot(a.x - b.x, a.y - b.y) < 5,
    'spring position varies too much between 60 Hz and 120 Hz');
}

// Keyboard movement and Space burst continue from the last pointer location.
{
  const f = fixture();
  f.pointer('pointerenter', 240, 260);
  f.pointer('pointermove', 240, 260);
  f.advance(500);
  f.key('keydown', 'ArrowRight');
  f.advance(120);
  const circle = f.latest();
  assert(circle && circle.x > 245 && circle.y > 250,
    'keyboard cursor did not move from the last pointer location');
  f.key('keydown', 'Space');
  assert.equal(f.events.length, 1, 'Space did not publish a burst');
  assert(Math.hypot(f.events[0].detail.x - circle.x, f.events[0].detail.y - circle.y) < 5,
    'Space burst did not use the current cursor position');
  f.key('keyup', 'ArrowRight');
}

// Touch end, blur, and reduced motion clear their respective cursor sessions.
{
  const f = fixture();
  f.pointer('pointerenter', 350, 350);
  f.pointer('pointermove', 350, 350);
  f.advance(500);
  f.pointer('pointerup', 350, 350, { pointerType: 'touch' });
  f.advance(1200);
  assert(visibleSize(f.latest()) < 0.5, 'touch end left the cursor visible');
  f.pointer('pointerenter', 370, 370);
  f.pointer('pointermove', 370, 370);
  f.advance(500);
  f.window.dispatchEvent({ type: 'blur' });
  assert(visibleSize(f.latest()) < 0.5, 'blur did not clear the cursor');
  f.pointer('pointerenter', 380, 380);
  f.pointer('pointermove', 380, 380);
  f.advance(500);
  f.motionQuery.matches = true;
  f.motionQuery.dispatchEvent({ type: 'change' });
  assert(visibleSize(f.latest()) < 0.5, 'reduced motion did not clear the cursor');
}

console.log('home cursor regression: passed');
