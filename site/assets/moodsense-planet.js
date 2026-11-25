/* The MoodSense community planet, ported from the app (src/modules/community/MoodPlanet.tsx, planet.ts and
   planetShaders.ts): a watercolor world with one continent per mood, a pastel sky with small planets, a ring
   with a moon ("You"), twinkling sparkles and a count label on each continent. The app's Skia shaders run
   here as WebGL fragment shaders on one shared offscreen context; each panel composites on a 2D canvas.
   window.MSPlanet.mount(el, getCounts) -> { draw(), wake(), setVisible(bool) } */
(function () {
  'use strict';
  var SCENE_W = 350, SCENE_H = 300, WORLD = { x: 175, y: 150, r: 100, ringR: 140 };
  var MOON_PER_S = 0.22, FRICTION = 2.6, MAX_FLICK = 5, DRAG_PX = 56, IDLE_FRAME_MS = 83, AMBIENT_MS = 20000, HOME_AFTER_MS = 2500;
  var LABELS = ['Calm', 'Good', 'Stressed', 'Low', 'Tired'];
  var COLORS = ['#9ccbb0', '#f0d27a', '#f2b592', '#adb6de', '#c9b8d8'];
  var PALE_INK = ['#1f4e38', '#6b5108', '#7a3a1e', '#3a4380', '#54406a'];
  var SMALL = [['#efe8da', '#b8ad99'], ['#e6d8c9', '#b4a18f'], ['#e2e2ea', '#a6a8bb'], ['#e6dcec', '#ad9fbb'], ['#e8e3d8', '#b5ac9c'], ['#dfe0ee', '#a3a6c0'], ['#ecdfd3', '#b9a696']];
  var BG_PLANETS = [[26, 30, 11, 0, 0, 21], [314, 40, 13, 1, 1, 24], [330, 124, 6, 0, 0, 22], [18, 136, 7, 0, 0, 25], [28, 264, 10, 0, 0, 26], [322, 262, 12, 1, 0, 23], [96, 284, 6, 1, 0, 27]];
  var SPARKLES = [[48, 84, 15, 0], [70, 36, 12, 0.27], [158, 18, 11, 0.54], [294, 96, 16, 0.12], [330, 206, 12, 0.73], [66, 182, 13, 0.42], [222, 282, 13, 0.19], [292, 258, 11, 0.81], [24, 62, 9, 0.35], [118, 40, 8, 0.63], [212, 30, 10, 0.9], [262, 58, 8, 0.05], [338, 82, 9, 0.48], [22, 212, 10, 0.58], [56, 252, 8, 0.31], [120, 276, 9, 0.68], [178, 290, 7, 0.95], [262, 272, 8, 0.38], [96, 18, 7, 0.12], [250, 14, 8, 0.76], [306, 14, 7, 0.44], [14, 100, 7, 0.22], [344, 156, 8, 0.66], [340, 240, 7, 0.09], [14, 176, 7, 0.84], [148, 296, 6, 0.51], [232, 296, 7, 0.29], [40, 290, 7, 0.6]];
  var SPARKLE_COLORS = ['#d9ad3f', '#e39abd', '#f0c24e', '#a493e0'];
  var LAND_SHAPES = [[2, -0.5, -0.3, 0.6, 0.37, 0.55, 0.32], [1, 0.3, -0.6, 0.56, 0.35, -0.28, 0.29], [0, 0.46, 0.26, 0.42, 0.52, 0.35, 0.28], [3, -0.34, 0.6, 0.36, 0.21, -0.4, 0.11], [4, 0.0, 0.05, 0.3, 0.22, 0.9, 0.12]];

  /* ---- 3D helpers (planet.ts) ---- */
  function mul(a, b) { var r = function (i, j) { return a[i * 3] * b[j] + a[i * 3 + 1] * b[j + 3] + a[i * 3 + 2] * b[j + 6]; }; return [r(0, 0), r(0, 1), r(0, 2), r(1, 0), r(1, 1), r(1, 2), r(2, 0), r(2, 1), r(2, 2)]; }
  function rotY(t) { var c = Math.cos(t), s = Math.sin(t); return [c, 0, s, 0, 1, 0, -s, 0, c]; }
  function rotX(t) { var c = Math.cos(t), s = Math.sin(t); return [1, 0, 0, 0, c, s, 0, -s, c]; }
  function rotZ(t) { var c = Math.cos(t), s = Math.sin(t); return [c, -s, 0, s, c, 0, 0, 0, 1]; }
  var IDENTITY = [1, 0, 0, 0, 1, 0, 0, 0, 1], RING_TILT = mul(rotZ(-0.28), rotX(0.24));
  function orthonormal(m) {
    var n = function (v) { var l = Math.hypot(v[0], v[1], v[2]) || 1; return v.map(function (x) { return x / l; }); };
    var a = n([m[0], m[1], m[2]]), d = a[0] * m[3] + a[1] * m[4] + a[2] * m[5], b = n([m[3] - d * a[0], m[4] - d * a[1], m[5] - d * a[2]]);
    var c = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    return [a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]];
  }
  function dragRotation(m, dx, dy) { return orthonormal(mul(mul(rotY(dx), rotX(dy)), m)); }
  function rotate(m, x, y, z) { return [m[0] * x + m[1] * y + m[2] * z, m[3] * x + m[4] * y + m[5] * z, m[6] * x + m[7] * y + m[8] * z]; }
  function homeRotation(m, dt, t) {
    var p = rotate(m, 0, 0, 1);
    if (p[2] < 0) return dragRotation(m, (p[0] >= 0 ? -1 : 1) * 0.9 * dt, 0);
    return dragRotation(m, (0.16 * Math.sin(t * 0.25) - p[0]) * 0.9 * dt, (0.05 * Math.sin(t * 0.17) - p[1]) * 0.9 * dt);
  }
  function cross(p, q) { return [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]]; }
  function unit(p) { var l = Math.hypot(p[0], p[1], p[2]) || 1; return [p[0] / l, p[1] / l, p[2] / l]; }
  function worldLands(counts) {
    var total = counts.reduce(function (a, b) { return a + b; }, 0); if (!total) return [];
    return LAND_SHAPES.filter(function (s) { return counts[s[0]] > 0; }).map(function (s) {
      var k = Math.min(1.3, Math.max(0.55, Math.sqrt(counts[s[0]] / total / s[6])));
      var v = [s[1], s[2], Math.sqrt(1 - s[1] * s[1] - s[2] * s[2])], e1 = unit(cross([0, 1, 0], v)), e2 = cross(v, e1), c = Math.cos(s[5]), sn = Math.sin(s[5]);
      return { group: s[0], v: v, u: [c * e1[0] + sn * e2[0], c * e1[1] + sn * e2[1], c * e1[2] + sn * e2[2]], w: [-sn * e1[0] + c * e2[0], -sn * e1[1] + c * e2[1], -sn * e1[2] + c * e2[2]], a: s[3] * k, b: s[4] * k };
    });
  }
  function rgb(h) { return [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255]; }

  /* ---- shaders (planetShaders.ts, SkSL -> GLSL ES 1.0) ---- */
  var HEAD = 'precision highp float;\nuniform vec2 res;\nvec2 XY(){ return vec2(gl_FragCoord.x, res.y - gl_FragCoord.y); }\n';
  var NOISE = [
    'float h3(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }',
    'float noise(vec3 p){ vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);',
    ' return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),',
    '  mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }',
    'float octave(vec3 p, int count){ float a = 0.5; float s = 0.0; float t = 0.0;',
    ' for (int i = 0; i < 6; i++) { if (i >= count) { break; } s += a * noise(p); t += a;',
    '  p = vec3((p.x * 0.8 - p.y * 0.6) * 2.03 + 11.3, (p.x * 0.6 + p.y * 0.8) * 2.03 + 7.1, p.z * 2.03 + 3.7); a *= 0.5; }',
    ' return s / t; }',
    'const vec3 LIGHT = vec3(-0.5, -0.5, 0.707);',
    'vec3 lightHalf(){ return normalize(LIGHT + vec3(0.0, 0.0, 1.0)); }'
  ].join('\n') + '\n';
  var SKY = HEAD + 'uniform float scale; uniform vec3 base; uniform vec3 cloudA; uniform vec3 cloudB; uniform vec3 cloudC;\n' + NOISE + [
    'float stars(vec2 v, float cell, float density, float size, float layer){ vec2 g = floor(v / cell); float h = h3(vec3(g, layer));',
    ' if (h < 1.0 - density) { return 0.0; }',
    ' vec2 at = 0.15 + 0.7 * vec2(h3(vec3(g, layer + 1.0)), h3(vec3(g, layer + 2.0)));',
    ' float r = size * (0.6 + 0.8 * h3(vec3(g, layer + 3.0))); float dist = length((fract(v / cell) - at) * cell);',
    ' return (1.0 - smoothstep(0.0, r, dist)) * (0.45 + 0.55 * h3(vec3(g, layer + 4.0))); }',
    'void main(){ vec2 xy = XY(); vec2 v = xy / scale;',
    ' float a = octave(vec3(v.x / 105.0 + 1.0, v.y / 105.0 + 4.0, 1.1), 5);',
    ' float b = octave(vec3(v.x / 75.0 + 8.0, v.y / 95.0 + 2.0, 3.3), 5);',
    ' float c = octave(vec3(v.x / 130.0 + 5.0, v.y / 65.0 + 7.0, 6.1), 4);',
    ' float off = v.y - (270.0 - v.x * 0.75); float band = exp(-(off * off) / (130.0 * 130.0));',
    ' vec3 col = base;',
    ' col = mix(col, cloudA, 0.8 * smoothstep(0.4, 0.72, a) * (0.45 + 0.55 * band));',
    ' col = mix(col, cloudB, 0.64 * smoothstep(0.46, 0.76, b) * (0.4 + 0.6 * band));',
    ' col = mix(col, cloudC, 0.56 * smoothstep(0.5, 0.76, c));',
    ' float dust = stars(v, 5.0, 0.42, 0.75, 20.0); float mid = stars(v, 13.0, 0.5, 1.0, 30.0); float bright = stars(v, 34.0, 0.55, 1.7, 40.0);',
    ' float tint = h3(vec3(floor(v / 13.0), 31.0));',
    ' col = mix(col, vec3(0.86, 0.68, 0.25), dust * 0.6);',
    ' col = mix(col, tint < 0.5 ? vec3(0.89, 0.6, 0.74) : vec3(0.64, 0.58, 0.88), mid * 0.85);',
    ' col = mix(col, vec3(0.9, 0.7, 0.2), bright);',
    ' col += (h3(vec3(xy, 9.0)) - 0.5) * 1.6 / 255.0;',
    ' gl_FragColor = vec4(col, 1.0); }'
  ].join('\n');
  var SMALL_PLANET = HEAD + 'uniform vec2 center; uniform float radius; uniform vec3 lightColor; uniform vec3 darkColor; uniform float band; uniform float seed; uniform float haze;\n' + NOISE + [
    'void main(){ vec2 xy = XY(); vec2 d = (xy - center) / radius; float rr = length(d);',
    ' if (rr > 1.05) { gl_FragColor = vec4(0.0); return; }',
    ' float z = sqrt(max(0.0, 1.0 - rr * rr)); vec3 n = vec3(d, z);',
    ' float lit = smoothstep(-0.25, 0.85, dot(n, normalize(LIGHT)));',
    ' float tex = band > 0.5 ? 0.5 + 0.5 * sin((d.y + 0.3 * d.x) * (7.0 + mod(seed, 3.0)) + (octave(vec3(d * 1.5 + seed, 1.0), 3) - 0.5) * 3.0)',
    '  : octave(vec3(d * 2.6 + seed, z * 2.6), 4);',
    ' vec3 col = mix(darkColor, lightColor, clamp(lit * (0.72 + 0.42 * tex), 0.0, 1.0));',
    ' float a = clamp((1.0 - rr) * radius + 0.5, 0.0, 1.0) * haze;',
    ' gl_FragColor = vec4(col * a, a); }'
  ].join('\n');
  var LAND_U = '';
  for (var li = 0; li < 5; li++) LAND_U += 'uniform vec3 v' + li + '; uniform vec3 u' + li + '; uniform vec3 w' + li + '; uniform vec2 ab' + li + '; uniform vec3 c' + li + ';\n';
  var WORLD_PLANET = HEAD + 'uniform vec2 center; uniform float radius; uniform vec3 r0; uniform vec3 r1; uniform vec3 r2; uniform vec3 seaLight; uniform vec3 seaDark; uniform vec3 seaCloud; uniform vec3 rimColor;\n' + LAND_U + NOISE + [
    'float land(vec3 local, vec3 warped, vec3 q, vec3 v, vec3 u, vec3 w, vec2 ab, float off){',
    ' if (ab.x <= 0.0) { return 9.0; }',
    ' float du = dot(warped - v, u); float dw = dot(warped - v, w); float back = dot(local, v) > 0.0 ? 0.0 : 3.0;',
    ' return length(vec2(du / (ab.x * 0.86), dw / (ab.y * 0.86))) + back + (octave(vec3(q.x * 0.8 + off, q.y * 0.8 + off, q.z * 0.8), 3) - 0.5) * 0.8; }',
    'void pick(float d, vec3 c, inout float d1, inout float d2, inout vec3 mood){ if (d < d1) { d2 = d1; d1 = d; mood = c; } else if (d < d2) { d2 = d; } }',
    'void main(){ vec2 xy = XY(); vec2 d = (xy - center) / radius; float rr = length(d);',
    ' if (rr > 1.02) { gl_FragColor = vec4(0.0); return; }',
    ' float z = sqrt(max(0.0, 1.0 - rr * rr)); vec3 n = vec3(d, z);',
    ' vec3 local = r0 * n.x + r1 * n.y + r2 * n.z; vec3 q = local * 2.0 + 5.0; float nl = dot(n, normalize(LIGHT));',
    ' vec3 warped = local + 0.34 * (vec3(octave(q * 0.55, 3), octave(q * 0.55 + vec3(5.1, 2.3, 7.7), 3), octave(q * 0.55 + vec3(10.2, 4.6, 15.4), 3)) - 0.5);',
    ' float d1 = 9.0; float d2 = 9.0; vec3 mood = c0;',
    ' pick(land(local, warped, q, v0, u0, w0, ab0, 0.0), c0, d1, d2, mood);',
    ' pick(land(local, warped, q, v1, u1, w1, ab1, 3.7), c1, d1, d2, mood);',
    ' pick(land(local, warped, q, v2, u2, w2, ab2, 7.4), c2, d1, d2, mood);',
    ' pick(land(local, warped, q, v3, u3, w3, ab3, 11.1), c3, d1, d2, mood);',
    ' pick(land(local, warped, q, v4, u4, w4, ab4, 14.8), c4, d1, d2, mood);',
    ' float m = smoothstep(1.3, 0.7, d1) * smoothstep(0.0, 0.4, d2 - d1);',
    ' float shallow = smoothstep(1.9, 0.95, d1) * smoothstep(0.0, 0.7, d2 - d1);',
    ' float lit = 0.88 + 0.12 * smoothstep(-0.4, 0.95, nl);',
    ' vec3 sea = mix(seaDark, seaLight, pow(clamp(nl * 0.5 + 0.5, 0.0, 1.0), 1.3));',
    ' float cloud = smoothstep(0.44, 0.8, octave(vec3(local.x * 1.4 + 2.0, local.y * 2.4 + 4.0, local.z * 1.4 + 6.0), 3));',
    ' sea = mix(sea, seaCloud, cloud * 0.5); sea = mix(sea, mood, shallow * 0.26);',
    ' float pig = octave(q * 0.8, 3);',
    ' vec3 ink = mix(mood, vec3(1.0, 0.99, 0.96), smoothstep(0.4, 0.72, pig) * 0.34);',
    ' vec3 col = mix(sea, ink, m * 0.88) * lit;',
    ' float veil = smoothstep(0.5, 0.82, octave(vec3(local.x * 1.3 + 7.0, local.y * 2.6 + 1.0, local.z * 1.3 + 3.0), 4));',
    ' col = mix(col, vec3(1.0, 0.995, 0.975), veil * 0.42);',
    ' col += pow(clamp(dot(n, lightHalf()), 0.0, 1.0), 30.0) * 0.1;',
    ' col = mix(col, rimColor, clamp(pow(1.0 - z, 2.6) * 0.5, 0.0, 1.0));',
    ' float a = clamp((1.0 - rr) * radius + 0.5, 0.0, 1.0);',
    ' gl_FragColor = vec4(clamp(col, 0.0, 1.0) * a, a); }'
  ].join('\n');

  /* ---- one shared WebGL context ---- */
  var GL = null;
  function gl() {
    if (GL !== null) return GL;
    var cv = document.createElement('canvas'), g = cv.getContext('webgl', { premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: false });
    if (!g) return (GL = false);
    function prog(src) {
      var vs = g.createShader(g.VERTEX_SHADER); g.shaderSource(vs, 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }'); g.compileShader(vs);
      var fs = g.createShader(g.FRAGMENT_SHADER); g.shaderSource(fs, src); g.compileShader(fs);
      if (!g.getShaderParameter(fs, g.COMPILE_STATUS)) { if (window.console) console.warn('MoodSense planet shader:', g.getShaderInfoLog(fs)); return null; }
      var p = g.createProgram(); g.attachShader(p, vs); g.attachShader(p, fs); g.linkProgram(p);
      return { p: p, u: {}, loc: function (n) { return this.u[n] !== undefined ? this.u[n] : (this.u[n] = g.getUniformLocation(p, n)); } };
    }
    var buf = g.createBuffer(); g.bindBuffer(g.ARRAY_BUFFER, buf); g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
    var P = { sky: prog(SKY), small: prog(SMALL_PLANET), world: prog(WORLD_PLANET) };
    if (!P.sky || !P.small || !P.world) return (GL = false);
    return (GL = { cv: cv, g: g, P: P });
  }
  function use(G, pr, w, h) {
    var g = G.g; g.useProgram(pr.p);
    var a = g.getAttribLocation(pr.p, 'p'); g.enableVertexAttribArray(a); g.vertexAttribPointer(a, 2, g.FLOAT, false, 0, 0);
    g.uniform2f(pr.loc('res'), w, h);
  }
  function size(G, w, h) { if (G.cv.width !== w || G.cv.height !== h) { G.cv.width = w; G.cv.height = h; } G.g.viewport(0, 0, w, h); G.g.clearColor(0, 0, 0, 0); G.g.clear(G.g.COLOR_BUFFER_BIT); }
  function u3(g, pr, n, v) { g.uniform3f(pr.loc(n), v[0], v[1], v[2]); }

  function ellipseArc(c, cx, cy, rx, ry, deg, front) {
    var t = deg * Math.PI / 180; c.save(); c.translate(cx, cy); c.rotate(t); c.beginPath(); c.ellipse(0, 0, rx, ry, 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2); c.restore();
  }
  var skyCache = {};
  function skyImage(W, H, s) { // device pixels, scale = s * dpr
    var key = W + 'x' + H; if (skyCache[key]) return skyCache[key];
    var out = document.createElement('canvas'); out.width = W; out.height = H;
    var c = out.getContext('2d'), G = gl();
    if (G) {
      size(G, W, H); use(G, G.P.sky, W, H); var g = G.g, pr = G.P.sky;
      g.uniform1f(pr.loc('scale'), s); u3(g, pr, 'base', rgb('#f8f2e8')); u3(g, pr, 'cloudA', rgb('#f3dbe6')); u3(g, pr, 'cloudB', rgb('#f8dcc8')); u3(g, pr, 'cloudC', rgb('#e0dcf5'));
      g.drawArrays(g.TRIANGLE_STRIP, 0, 4); c.drawImage(G.cv, 0, 0);
    } else { var gr = c.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#f8f2e8'); gr.addColorStop(0.6, '#f3dbe6'); gr.addColorStop(1, '#e0dcf5'); c.fillStyle = gr; c.fillRect(0, 0, W, H); }
    BG_PLANETS.forEach(function (p, i) {
      var cx = p[0] * s, cy = p[1] * s, r = p[2] * s, col = SMALL[i % SMALL.length];
      c.strokeStyle = 'rgba(162,151,138,0.5)'; c.lineWidth = r * 0.26;
      if (p[4]) { ellipseArc(c, cx, cy, r * 1.7, r * 0.5, 24, false); c.stroke(); }
      if (G) {
        size(G, W, H); use(G, G.P.small, W, H); var g2 = G.g, pr2 = G.P.small;
        g2.uniform2f(pr2.loc('center'), cx, cy); g2.uniform1f(pr2.loc('radius'), r); u3(g2, pr2, 'lightColor', rgb(col[0])); u3(g2, pr2, 'darkColor', rgb(col[1]));
        g2.uniform1f(pr2.loc('band'), p[3]); g2.uniform1f(pr2.loc('seed'), p[5]); g2.uniform1f(pr2.loc('haze'), 0.9);
        g2.drawArrays(g2.TRIANGLE_STRIP, 0, 4); c.drawImage(G.cv, 0, 0);
      } else { c.fillStyle = col[0]; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.fill(); }
      if (p[4]) { ellipseArc(c, cx, cy, r * 1.7, r * 0.5, 24, true); c.stroke(); }
    });
    return (skyCache[key] = out);
  }
  var STAR = typeof Path2D !== 'undefined' ? new Path2D('M12 0C12.7 8 16 11.3 24 12C16 12.7 12.7 16 12 24C11.3 16 8 12.7 0 12C8 11.3 11.3 8 12 0Z') : null;

  function mount(el, getCounts) {
    var cv = document.createElement('canvas'); el.appendChild(cv);
    var ctx = cv.getContext('2d'), st = { m: IDENTITY, moon: 0.6, clock: 0, flick: [0, 0], dragging: false, touchedAt: 0, raf: 0, prev: 0, drawnAt: 0, ambientUntil: 0, visible: false };
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function draw() {
      var Wc = el.clientWidth; if (!Wc) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2), s = Wc / SCENE_W, Hc = SCENE_H * s, W = Math.round(Wc * dpr), H = Math.round(Hc * dpr), k = s * dpr;
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; cv.style.height = Hc + 'px'; el.style.height = Hc + 'px'; }
      var counts = getCounts(), lands = worldLands(counts), m = st.m;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(skyImage(W, H, k), 0, 0);
      // ring (back half), moon if behind
      var ringPts = [];
      for (var i = 0; i <= 72; i++) { var a = i / 72 * Math.PI * 2, p = rotate(RING_TILT, Math.cos(a), 0, Math.sin(a)); ringPts.push([(WORLD.x + p[0] * WORLD.ringR) * k, (WORLD.y + p[1] * WORLD.ringR) * k, p[2] >= 0]); }
      function ring(front, alpha) { ctx.strokeStyle = 'rgba(154,134,184,' + alpha + ')'; ctx.lineWidth = 1.3 * k; ctx.lineCap = 'round'; ctx.beginPath(); for (var j = 1; j < ringPts.length; j++) if (ringPts[j][2] === front) { ctx.moveTo(ringPts[j - 1][0], ringPts[j - 1][1]); ctx.lineTo(ringPts[j][0], ringPts[j][1]); } ctx.stroke(); }
      var mp = rotate(RING_TILT, Math.cos(st.moon), 0, Math.sin(st.moon)), moon = { x: (WORLD.x + mp[0] * WORLD.ringR) * k, y: (WORLD.y + mp[1] * WORLD.ringR) * k, behind: mp[2] < 0, hidden: mp[2] < 0 && Math.hypot(mp[0], mp[1]) * WORLD.ringR < WORLD.r };
      function moonDot() { ctx.fillStyle = '#fffdf8'; ctx.beginPath(); ctx.arc(moon.x, moon.y, 5.5 * k, 0, 7); ctx.fill(); ctx.strokeStyle = '#9a86b8'; ctx.lineWidth = 2 * k; ctx.stroke(); }
      ring(false, 0.45); if (moon.behind) moonDot();
      // halo
      var R = WORLD.r * 1.45 * k, cx = WORLD.x * k, cy = WORLD.y * k, halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      halo.addColorStop(0, 'rgba(216,200,224,0)'); halo.addColorStop(0.66, 'rgba(216,200,224,0)'); halo.addColorStop(0.69, 'rgba(216,200,224,0.53)'); halo.addColorStop(1, 'rgba(216,200,224,0)');
      ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
      // world
      var G = gl(), wr = WORLD.r * k;
      if (G) {
        var box = Math.ceil(wr * 2 + 4); size(G, box, box); use(G, G.P.world, box, box); var g = G.g, pr = G.P.world;
        g.uniform2f(pr.loc('center'), box / 2, box / 2); g.uniform1f(pr.loc('radius'), wr);
        u3(g, pr, 'r0', [m[0], m[1], m[2]]); u3(g, pr, 'r1', [m[3], m[4], m[5]]); u3(g, pr, 'r2', [m[6], m[7], m[8]]);
        u3(g, pr, 'seaLight', rgb('#fffdf8')); u3(g, pr, 'seaDark', rgb('#ece2d6')); u3(g, pr, 'seaCloud', rgb('#eadfe8')); u3(g, pr, 'rimColor', rgb('#d8c8e0'));
        for (var L = 0; L < 5; L++) { var land = lands[L]; u3(g, pr, 'v' + L, land ? land.v : [0, 0, 1]); u3(g, pr, 'u' + L, land ? land.u : [0, 0, 1]); u3(g, pr, 'w' + L, land ? land.w : [0, 0, 1]); g.uniform2f(pr.loc('ab' + L), land ? land.a : 0, land ? land.b : 0); u3(g, pr, 'c' + L, land ? rgb(COLORS[land.group]) : [1, 1, 1]); }
        g.drawArrays(g.TRIANGLE_STRIP, 0, 4); ctx.drawImage(G.cv, cx - box / 2, cy - box / 2);
      } else { ctx.fillStyle = '#fffdf8'; ctx.beginPath(); ctx.arc(cx, cy, wr, 0, 7); ctx.fill(); }
      ring(true, 0.75); if (!moon.behind) moonDot();
      // sparkles
      if (STAR) SPARKLES.forEach(function (sp, i) {
        var wave = reduce ? 0.7 : 0.5 + 0.5 * Math.sin((st.clock / 1.8 + sp[3]) * Math.PI * 2), sc = (0.55 + 0.6 * wave) * sp[2] * k / 24;
        ctx.save(); ctx.globalAlpha = 0.15 + 0.85 * wave; ctx.translate(sp[0] * k, sp[1] * k); ctx.scale(sc, sc); ctx.translate(-12, -12); ctx.fillStyle = SPARKLE_COLORS[i % 4]; ctx.fill(STAR); ctx.restore();
      });
      // labels
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '600 ' + (11 * dpr) + 'px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
      lands.forEach(function (land) {
        var p = rotate(m, land.v[0], land.v[1], land.v[2]); if (p[2] < 0.2) return;
        ctx.globalAlpha = Math.min(1, (p[2] - 0.2) * 5); ctx.fillStyle = PALE_INK[land.group];
        ctx.fillText(counts[land.group] + ' ' + LABELS[land.group], (WORLD.x + p[0] * WORLD.r * 0.96) * k, (WORLD.y + p[1] * WORLD.r * 0.96) * k);
      });
      ctx.globalAlpha = 1;
      if (!moon.hidden) { ctx.font = '700 ' + (11 * dpr) + 'px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif'; ctx.textAlign = 'left'; ctx.fillStyle = '#4f3f6e'; ctx.fillText('You', moon.x > (Wc - 40) * dpr ? moon.x - 34 * dpr : moon.x + 9 * dpr, moon.y); }
    }
    function frame(now) {
      st.raf = 0; if (!st.visible) return;
      var dt = st.prev ? Math.min((now - st.prev) / 1000, 0.05) : 0; st.prev = now;
      var v = st.flick, flicking = !st.dragging && Math.abs(v[0]) + Math.abs(v[1]) > 0.01, ambient = !reduce && now < st.ambientUntil;
      if (!st.dragging) {
        if (flicking) { st.m = dragRotation(st.m, v[0] * dt, v[1] * dt); var dec = Math.exp(-FRICTION * dt); st.flick = [v[0] * dec, v[1] * dec]; }
        if (ambient) { if (now - st.touchedAt > HOME_AFTER_MS) st.m = homeRotation(st.m, dt, now / 1000); st.moon += MOON_PER_S * dt; st.clock = now / 1000; }
        if (flicking || (ambient && now - st.drawnAt > IDLE_FRAME_MS)) { st.drawnAt = now; draw(); }
      }
      if (st.dragging || flicking || ambient) st.raf = requestAnimationFrame(frame);
    }
    function wake() { st.ambientUntil = performance.now() + AMBIENT_MS; if (!st.raf && st.visible) { st.prev = 0; st.raf = requestAnimationFrame(frame); } }
    // Only a touch that starts on the world turns it, as in the app.
    var last = null, lastT = 0, vel = [0, 0];
    el.addEventListener('pointerdown', function (e) {
      var r = el.getBoundingClientRect(), s = r.width / SCENE_W, x = (e.clientX - r.left) / s, y = (e.clientY - r.top) / s;
      if (Math.hypot(x - WORLD.x, y - WORLD.y) > WORLD.r) return;
      st.dragging = true; st.flick = [0, 0]; last = [e.clientX, e.clientY]; lastT = performance.now(); el.setPointerCapture(e.pointerId); e.preventDefault(); wake();
    });
    el.addEventListener('pointermove', function (e) {
      if (!st.dragging) return;
      var r = el.getBoundingClientRect(), z = (r.width / SCENE_W) || 1, dx = (e.clientX - last[0]) / z, dy = (e.clientY - last[1]) / z, now = performance.now(), dtm = Math.max(1, now - lastT);
      st.m = dragRotation(st.m, dx / DRAG_PX, dy / DRAG_PX); vel = [dx / dtm, dy / dtm]; last = [e.clientX, e.clientY]; lastT = now; draw();
    });
    function up() { if (!st.dragging) return; st.dragging = false; st.touchedAt = performance.now(); var c = function (x) { return Math.max(-MAX_FLICK, Math.min(MAX_FLICK, x)); }; st.flick = [c(vel[0] * 1000 / DRAG_PX), c(vel[1] * 1000 / DRAG_PX)]; wake(); }
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    return {
      draw: draw,
      wake: wake,
      setVisible: function (v) { st.visible = v; if (v) { draw(); wake(); } else if (st.raf) { cancelAnimationFrame(st.raf); st.raf = 0; } }
    };
  }
  window.MSPlanet = { mount: mount };
})();
