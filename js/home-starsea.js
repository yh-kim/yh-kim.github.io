(function () {
  'use strict';

  var canvas = document.querySelector('[data-starsea-canvas]');
  var section = canvas && canvas.closest('.home-ripple');
  if (!canvas || !section) return;

  canvas.style.pointerEvents = 'none';
  canvas.style.opacity = '0';

  var vertexSource = 'attribute vec2 aPosition; void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }';
  var fragmentSource = `precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerStrength;
uniform vec2 uClick;
uniform float uClickAge;
uniform float uIntensity;

// Coordinates use the short screen dimension, so stars stay round at any aspect.
vec3 ssHash3(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.xxy + q.yzz) * q.zyx);
}

float ssHash1(vec2 p) {
  vec2 q = fract(p * vec2(0.1031, 0.11369));
  q += dot(q, q.yx + 19.19);
  return fract((q.x + q.y) * q.x);
}

float ssNoise(vec2 p) {
  vec2 cell = floor(p);
  vec2 t = fract(p);
  t = t * t * (3.0 - 2.0 * t);
  return mix(mix(ssHash1(cell), ssHash1(cell + vec2(1.0, 0.0)), t.x),
             mix(ssHash1(cell + vec2(0.0, 1.0)),
                 ssHash1(cell + vec2(1.0, 1.0)), t.x), t.y);
}

float ssSegmentDistance(vec2 p, vec2 a, vec2 b) {
  vec2 v = b - a;
  return length(p - a - v * clamp(dot(p - a, v) / max(dot(v, v), 0.00001), 0.0, 1.0));
}

vec2 ssBend(vec2 star, float scale) {
  vec2 away = star - uPointer;
  float d2 = dot(away, away);
  // One third of a cell at most: a clear push without cell-boundary popping.
  float push = (0.34 / scale) * uPointerStrength *
               exp(-d2 * 12.0) / sqrt(d2 + 0.006);
  return star + away * push;
}

vec3 ssAtmosphere(vec2 p) {
  vec2 flow = p + vec2(uTime * 0.004, -uTime * 0.0025);
  float broad = ssNoise(flow * vec2(2.7, 3.8));
  float fine = ssNoise(flow * vec2(5.2, 6.8) + vec2(13.0, 7.0));
  float texture = broad * 0.66 + fine * 0.34;
  float arc = p.y + p.x * 0.19 + 0.34 +
              0.12 * sin(p.x * 1.5 + 0.5) +
              0.04 * sin(p.x * 4.2 - 0.8);
  float fold = arc + 0.11 * (texture - 0.5);
  float veil = exp(-fold * fold * 3.0) * (0.32 + texture * 0.68);
  float blueThread = exp(-pow((fold + 0.22) * 10.0, 2.0)) * (0.5 + fine * 0.5);
  float lilacThread = exp(-pow((fold - 0.18) * 12.0, 2.0)) * (0.5 + broad * 0.5);
  return vec3(0.013, 0.025, 0.055) * veil +
         vec3(0.005, 0.017, 0.040) * blueThread +
         vec3(0.017, 0.011, 0.035) * lilacThread;
}

vec3 ssStarLayer(vec2 p, float scale, float seed, float density,
                 float speed, float radius, float gain) {
  vec2 drift = vec2(speed, -speed * 0.31) * uTime;
  vec2 grid = p * scale + drift;
  vec2 base = floor(grid);
  float pxPerUnit = 0.5 * min(uResolution.x, uResolution.y);
  vec3 sum = vec3(0.0);

  for (int iy = -1; iy <= 1; iy++) {
    for (int ix = -1; ix <= 1; ix++) {
      vec2 cell = base + vec2(float(ix), float(iy));
      vec3 h = ssHash3(cell + vec2(seed, seed * 1.731));
      if (h.z > density) continue;

      vec2 position = (cell + 0.14 + h.xy * 0.72 - drift) / scale;
      position = ssBend(position, scale);
      vec2 delta = (p - position) * pxPerUnit;
      float r2 = dot(delta, delta);

      float rare = smoothstep(0.89, 0.985, h.y);
      float sparkle = 0.92 + (0.07 + rare * 0.13) *
                      sin(uTime * (0.7 + h.x * 1.7) + h.y * 27.0);
      float power = gain * sparkle * mix(0.47, 1.15, pow(h.x, 3.0));
      float core = exp(-r2 / (radius * radius)) * (0.75 + rare * 1.3);
      float aura = exp(-r2 / (23.0 + rare * 70.0)) * (0.085 + rare * 0.18);

      // Only the rarest points get four very fine diffraction rays.
      float rays = rare * (
        exp(-abs(delta.x) * 2.0 - abs(delta.y) * 0.14) +
        exp(-abs(delta.y) * 2.0 - abs(delta.x) * 0.14)
      ) * 0.22;

      float nearPointer = exp(-dot(position - uPointer, position - uPointer) * 10.0);
      float response = 1.0 + nearPointer * uPointerStrength * 0.12;
      vec3 tint = mix(vec3(0.55, 0.72, 1.0), vec3(0.91, 0.94, 1.0),
                      smoothstep(0.16, 0.81, h.x));
      tint = mix(tint, vec3(1.0, 0.81, 0.88), rare * 0.34);
      sum += tint * power * response * (core + aura + rays);
    }
  }
  return sum;
}

vec3 ssConstellations(vec2 p) {
  vec2 grid = p * 9.0;
  vec2 base = floor(grid);
  float pxPerUnit = 0.5 * min(uResolution.x, uResolution.y);
  float local = exp(-dot(p - uPointer, p - uPointer) * 5.0) * uPointerStrength;
  float lines = 0.0;
  float knots = 0.0;

  if (local > 0.012) {
    for (int iy = -1; iy <= 1; iy++) {
      for (int ix = -1; ix <= 1; ix++) {
        vec2 cell = base + vec2(float(ix), float(iy));
        vec3 h = ssHash3(cell + vec2(71.3, 39.2));
        if (h.z < 0.43) continue;
        vec2 a = (cell + 0.16 + 0.68 * h.xy) / 9.0;
        vec3 east = ssHash3(cell + vec2(72.3, 39.2));
        vec3 north = ssHash3(cell + vec2(71.3, 40.2));
        vec2 b = (cell + vec2(1.0, 0.0) + 0.16 + 0.68 * east.xy) / 9.0;
        vec2 c = (cell + vec2(0.0, 1.0) + 0.16 + 0.68 * north.xy) / 9.0;
        a = ssBend(a, 9.0);
        b = ssBend(b, 9.0);
        c = ssBend(c, 9.0);

        float da = length((p - a) * pxPerUnit);
        knots += exp(-da * da / 3.0) * 0.08;
        if (east.z > 0.57 && h.x > 0.26) {
          float de = ssSegmentDistance(p, a, b) * pxPerUnit;
          lines += exp(-de * de / 0.52) * 0.045;
        }
        if (north.z > 0.57 && h.y > 0.46) {
          float dn = ssSegmentDistance(p, a, c) * pxPerUnit;
          lines += exp(-dn * dn / 0.52) * 0.045;
        }
      }
    }
  }
  return vec3(0.38, 0.72, 1.0) * (lines + knots) * local;
}

vec3 ssShootingStar(vec2 p) {
  float cycle = floor(uTime / 12.6);
  float phase = fract(uTime / 12.6);
  float active = smoothstep(0.012, 0.045, phase) *
                 (1.0 - smoothstep(0.28, 0.34, phase));
  float aspect = uResolution.x / min(uResolution.x, uResolution.y);
  float height = mix(-0.48, 0.65, ssHash3(vec2(cycle, 18.4)).x);
  vec2 head = vec2(-aspect - 0.35, height + 0.38) +
              vec2(aspect * 2.0 + 1.0, -0.92) * (phase / 0.32);
  vec2 tail = head + vec2(-0.20, 0.064);
  float pxPerUnit = 0.5 * min(uResolution.x, uResolution.y);
  float d = ssSegmentDistance(p, head, tail) * pxPerUnit;
  float behind = clamp(dot(p - head, tail - head) / dot(tail - head, tail - head), 0.0, 1.0);
  float streak = exp(-d * d / 1.5) * (1.0 - behind * 0.78);
  float tip = exp(-dot(p - head, p - head) * pxPerUnit * pxPerUnit / 4.0);
  return vec3(0.48, 0.72, 1.0) * (streak * 0.33 + tip * 0.55) * active;
}

void main() {
  vec2 p = (2.0 * gl_FragCoord.xy - uResolution.xy) /
           min(uResolution.x, uResolution.y);
  float intensity = clamp(uIntensity, 0.4, 1.5);

  // A quiet midnight floor with two translucent, slowly shifting dust threads.
  float height = p.y * 0.5 + 0.5;
  vec3 color = mix(vec3(0.005, 0.014, 0.038), vec3(0.010, 0.030, 0.070),
                   clamp(0.45 - height * 0.24, 0.0, 1.0));
  float centerCalm = 1.0 - 0.42 * exp(-dot(p * vec2(0.9, 1.2),
                                            p * vec2(0.9, 1.2)) * 3.0);
  color += ssAtmosphere(p) * centerCalm;
  float vignette = 1.0 - 0.28 * smoothstep(0.35, 1.7, length(p * vec2(0.75, 1.0)));
  color *= vignette;

  vec3 stars = vec3(0.0);
  stars += ssStarLayer(p, 12.0, 4.7, 0.35, 0.045, 1.26, 0.56);
  stars += ssStarLayer(p, 27.0, 29.1, 0.27, 0.044, 1.04, 0.40);
  stars += ssStarLayer(p, 52.0, 92.7, 0.16, 0.030, 0.77, 0.24);

  // Preserve contrast for the centered greeting while leaving stars visible.
  float centerVeil = 1.0 - 0.29 * exp(-dot(p * vec2(0.95, 1.2),
                                            p * vec2(0.95, 1.2)) * 2.4);
  color += stars * centerVeil * intensity;
  color += ssConstellations(p) * intensity;

  if (uClickAge < 5.0) {
    float radius = 0.46 * uClickAge;
    float distanceToRing = abs(length(p - uClick) - radius);
    float fade = exp(-uClickAge * 1.15);
    float rim = exp(-pow(distanceToRing * 67.0, 2.0)) * 0.13;
    float wash = exp(-dot(p - uClick, p - uClick) * 5.0) *
                 exp(-uClickAge * 3.0) * 0.12;
    color += vec3(0.33, 0.70, 1.0) * (rim * fade + wash) * intensity;
  }

  color += ssShootingStar(p) * intensity;
  float grain = ssHash3(floor(gl_FragCoord.xy * 0.5) + vec2(7.0, 13.0)).x;
  color += (grain - 0.5) * 0.003;
  gl_FragColor = vec4(1.0 - exp(-max(color, vec3(0.0))), 1.0);
}`;

  var gl = null;
  var program = null;
  var quad = null;
  var position = -1;
  var uniforms = null;
  var frameId = 0;
  var lastStamp = 0;
  var elapsed = 10;
  var clickTime = -100;
  var click = [0, 0];
  var target = [0, 0];
  var pointer = [0, 0];
  var pointerStrength = 0;
  var strengthTarget = 0;
  var bounds = null;
  var pointerSeen = false;
  var pageActive = true;
  var contextLost = false;
  var ready = false;
  var motionQuery = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var reducedMotion = Boolean(motionQuery && motionQuery.matches);

  function hideCanvas() {
    ready = false;
    canvas.style.opacity = '0';
    canvas.removeAttribute('data-starsea-ready');
  }

  function discardRenderer() {
    hideCanvas();
    if (gl && !contextLost) {
      if (quad) gl.deleteBuffer(quad);
      if (program) gl.deleteProgram(program);
    }
    quad = null;
    program = null;
    uniforms = null;
  }

  function compileShader(type, source) {
    var shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function initializeRenderer() {
    hideCanvas();
    try {
      gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false }) ||
           canvas.getContext('experimental-webgl', { alpha: false, antialias: false, depth: false, stencil: false });
      if (!gl) return false;

      var precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      if (!precision || !precision.precision) return false;

      var vertex = compileShader(gl.VERTEX_SHADER, vertexSource);
      var fragment = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
      if (!vertex || !fragment) {
        if (vertex) gl.deleteShader(vertex);
        if (fragment) gl.deleteShader(fragment);
        return false;
      }

      program = gl.createProgram();
      if (!program) {
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        return false;
      }
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        program = null;
        return false;
      }

      quad = gl.createBuffer();
      if (!quad) {
        discardRenderer();
        return false;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      position = gl.getAttribLocation(program, 'aPosition');
      if (position < 0) {
        discardRenderer();
        return false;
      }
      uniforms = {
        resolution: gl.getUniformLocation(program, 'uResolution'),
        time: gl.getUniformLocation(program, 'uTime'),
        pointer: gl.getUniformLocation(program, 'uPointer'),
        pointerStrength: gl.getUniformLocation(program, 'uPointerStrength'),
        click: gl.getUniformLocation(program, 'uClick'),
        clickAge: gl.getUniformLocation(program, 'uClickAge'),
        intensity: gl.getUniformLocation(program, 'uIntensity')
      };
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
      resize();
      return true;
    } catch (error) {
      discardRenderer();
      return false;
    }
  }

  function resize() {
    bounds = section.getBoundingClientRect();
    var width = Math.max(1, bounds.width);
    var height = Math.max(1, bounds.height);
    var ratio = Math.min(window.devicePixelRatio || 1, 1.1);
    ratio = Math.min(ratio, Math.sqrt(850000 / (width * height)));
    var pixelWidth = Math.max(1, Math.round(width * ratio));
    var pixelHeight = Math.max(1, Math.round(height * ratio));
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    if (gl && program && !contextLost) gl.viewport(0, 0, pixelWidth, pixelHeight);
  }

  function updatePointer(delta) {
    var pointerEase = 1 - Math.exp(-delta * 23);
    var strengthEase = 1 - Math.exp(-delta * (strengthTarget ? 9 : 3));
    pointer[0] += (target[0] - pointer[0]) * pointerEase;
    pointer[1] += (target[1] - pointer[1]) * pointerEase;
    pointerStrength += (strengthTarget - pointerStrength) * strengthEase;
  }

  function render() {
    if (!gl || !program || contextLost || !pageActive || document.hidden) return;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform1f(uniforms.time, elapsed);
    gl.uniform2f(uniforms.pointer, pointer[0], pointer[1]);
    gl.uniform1f(uniforms.pointerStrength, pointerStrength);
    gl.uniform2f(uniforms.click, click[0], click[1]);
    gl.uniform1f(uniforms.clickAge, Math.max(0, elapsed - clickTime));
    gl.uniform1f(uniforms.intensity, 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!ready && gl.getError() === gl.NO_ERROR) {
      ready = true;
      canvas.style.removeProperty('opacity');
      canvas.setAttribute('data-starsea-ready', '');
    }
  }

  function tick(stamp) {
    frameId = 0;
    if (!pageActive || document.hidden || contextLost || reducedMotion) return;
    var delta = lastStamp ? Math.min(0.05, Math.max(0, (stamp - lastStamp) / 1000)) : 0;
    lastStamp = stamp;
    elapsed += delta;
    updatePointer(delta);
    render();
    schedule();
  }

  function schedule() {
    if (!frameId && !reducedMotion && pageActive && !document.hidden && !contextLost && program) {
      frameId = window.requestAnimationFrame(tick);
    }
  }

  function pause() {
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = 0;
    lastStamp = 0;
  }

  function start() {
    if (!pageActive || document.hidden || contextLost || !program) return;
    if (reducedMotion) {
      render();
    } else {
      schedule();
    }
  }

  function pointFromLocal(x, y) {
    if (!bounds) resize();
    var unit = Math.min(bounds.width, bounds.height) || 1;
    return [
      (2 * x - bounds.width) / unit,
      (bounds.height - 2 * y) / unit
    ];
  }

  function onCursorMove(event) {
    if (reducedMotion || !event.detail) return;
    var detail = event.detail;
    if (detail.active === false) {
      strengthTarget = 0;
      return;
    }
    if (!isFinite(detail.x) || !isFinite(detail.y)) return;
    var point = pointFromLocal(detail.x, detail.y);
    if (!pointerSeen) {
      pointer[0] = point[0];
      pointer[1] = point[1];
      pointerSeen = true;
    }
    target[0] = point[0];
    target[1] = point[1];
    strengthTarget = 1;
  }

  function onPointerDown(event) {
    if (reducedMotion) return;
    if (!bounds) resize();
    var point = pointFromLocal(event.clientX - bounds.left, event.clientY - bounds.top);
    click[0] = point[0];
    click[1] = point[1];
    clickTime = elapsed;
  }

  function onCursorBurst(event) {
    if (reducedMotion || !event.detail) return;
    var detail = event.detail;
    if (!isFinite(detail.x) || !isFinite(detail.y)) return;
    var point = pointFromLocal(detail.x, detail.y);
    click[0] = point[0];
    click[1] = point[1];
    clickTime = elapsed;
  }

  function onResize() {
    resize();
    if (reducedMotion) start();
  }

  section.addEventListener('home-cursor-move', onCursorMove);
  section.addEventListener('home-cursor-burst', onCursorBurst);
  section.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(onResize).observe(section);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) pause();
    else start();
  });
  window.addEventListener('pagehide', function () {
    pageActive = false;
    pause();
  });
  window.addEventListener('pageshow', function () {
    pageActive = true;
    start();
  });
  canvas.addEventListener('webglcontextlost', function (event) {
    event.preventDefault();
    contextLost = true;
    pause();
    hideCanvas();
    program = null;
    quad = null;
    uniforms = null;
  });
  canvas.addEventListener('webglcontextrestored', function () {
    contextLost = false;
    if (initializeRenderer()) start();
  });
  if (motionQuery) {
    var onMotionChange = function () {
      reducedMotion = motionQuery.matches;
      pause();
      if (reducedMotion) {
        pointerStrength = 0;
        strengthTarget = 0;
        pointerSeen = false;
      }
      start();
    };
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', onMotionChange);
    else if (motionQuery.addListener) motionQuery.addListener(onMotionChange);
  }

  if (initializeRenderer()) start();
}());
