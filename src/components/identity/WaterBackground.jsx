'use client';

import { useRef, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// ─── Config ───────────────────────────────────────────────────────────────────
const N = 12; // max simultaneous ripples in the shader uniform array

// ─── Vertex shader ────────────────────────────────────────────────────────────
const VERT = `
attribute vec2 a_pos;
varying   vec2 v_uv;
void main() {
  v_uv        = vec2(a_pos.x * 0.5 + 0.5, -a_pos.y * 0.5 + 0.5);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// ─── Fragment shader ──────────────────────────────────────────────────────────
// #ifdef GL_FRAGMENT_PRECISION_HIGH — defined as 1 on hardware that supports
// 32-bit highp floats in the fragment stage. Android mediump is genuinely
// 16-bit on Mali/Adreno: at |x| > ~100 the sin/cos arguments used in the
// caustic loop lose 0.2–0.4 rad of precision, turning the fine caustic net
// into visible banding. highp fixes this with no extra shader cost.
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
varying vec2 v_uv;

uniform float u_time;
uniform vec2  u_res;
uniform float u_dark;
uniform vec4  u_rip[${N}];

vec2 h2(vec2 p) {
  p = vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)));
  return fract(sin(p) * 43758.5453);
}
float gnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = dot(h2(i)            - 0.5, f            );
  float b = dot(h2(i+vec2(1,0))  - 0.5, f-vec2(1,0) );
  float c = dot(h2(i+vec2(0,1))  - 0.5, f-vec2(0,1) );
  float d = dot(h2(i+vec2(1,1))  - 0.5, f-vec2(1,1) );
  return 0.5 + mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2  m = mat2(1.6, 1.2, -1.2, 1.6);
  v += a * gnoise(p); p = m * p; a *= 0.5;
  v += a * gnoise(p); p = m * p; a *= 0.5;
  v += a * gnoise(p);
  return v;
}

float caustic(vec2 uv, float t) {
  float ar  = u_res.x / u_res.y;
  vec2  uv2 = uv * vec2(ar, 1.0);
  vec2  p   = mod(uv2 * 6.28318, 6.28318) - 250.0;
  vec2  i   = p;
  float c   = 1.0;
  float inten = 0.005;
  for (int n = 0; n < 5; n++) {
    float tn = t * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tn - i.x) + sin(tn + i.y), sin(tn - i.y) + cos(tn + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tn) / inten), p.y / (cos(i.y + tn) / inten)));
  }
  c /= 5.0;
  c = 1.17 - pow(c, 1.4);
  return clamp(pow(abs(c), 8.0), 0.0, 1.0);
}

float waveH(vec2 uv, float t) {
  float ar = u_res.x / u_res.y;
  vec2 p   = uv * vec2(ar, 1.0);
  float h  = 0.0;
  h += sin(dot(p, vec2( 2.1,  1.7)) + t * 0.55) * 0.22;
  h += sin(dot(p, vec2(-1.4,  2.5)) + t * 0.42) * 0.16;
  h += sin(dot(p, vec2( 3.2, -1.1)) + t * 0.72) * 0.10;
  h += sin(dot(p, vec2( 0.9,  3.3)) + t * 0.50) * 0.12;
  h += sin(dot(p, vec2(-2.6,  0.8)) - t * 0.60) * 0.08;
  return h;
}

float rippleH(vec2 uv, float t) {
  float ar = u_res.x / u_res.y;
  vec2 sc  = vec2(ar, 1.0);
  float h  = 0.0;
  for (int i = 0; i < ${N}; i++) {
    vec4  r   = u_rip[i];
    float age = t - r.z;
    float gate = step(0.001, r.w) * step(0.0, age) * (1.0 - step(4.5, age));
    float d   = length((uv - r.xy) * sc);
    float wf  = d - age * 0.36;
    float env = exp(-d * 2.4) * exp(-age * 1.1) * r.w;
    float osc = sin(wf * 30.0) * smoothstep(0.025, 0.0, wf);
    h += osc * env * gate;
  }
  return h;
}

void main() {
  float t  = u_time * 0.50;
  vec2  uv = v_uv;

  float e  = 0.003;
  float h  = waveH(uv,             t) + rippleH(uv,             u_time);
  float hx = waveH(uv+vec2(e,0.0), t) + rippleH(uv+vec2(e,0.0), u_time);
  float hy = waveH(uv+vec2(0.0,e), t) + rippleH(uv+vec2(0.0,e), u_time);

  vec3 norm = normalize(vec3((h - hx) / e * 0.034, (h - hy) / e * 0.034, 1.0));

  float c = caustic(uv + norm.xy * 0.016, t * 1.5);

  float tilt = 1.0 - abs(norm.z);
  float refl = clamp(tilt * 8.0, 0.0, 1.0);

  vec3 baseL = vec3(0.986, 0.991, 0.999);
  vec3 skyL  = vec3(0.750, 0.840, 0.940);
  vec3 baseD = vec3(0.038, 0.052, 0.088);
  vec3 skyD  = vec3(0.120, 0.220, 0.420);

  vec3 base       = mix(baseL, baseD, u_dark);
  vec3 sky        = mix(skyL,  skyD,  u_dark);
  float skyMix    = mix(0.028, 0.090, u_dark);
  float causticFloor = mix(0.940, 0.560, u_dark);
  float sparkleAmt   = mix(0.050, 0.130, u_dark);

  vec3 col = mix(base, sky, refl * skyMix);
  col *= mix(causticFloor, 1.0, c);
  col += pow(c, 6.0) * sparkleAmt;
  col  = clamp(col, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

// ─── WebGL helpers ─────────────────────────────────────────────────────────────
function makeShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[WaterBg] Shader compile error:', gl.getShaderInfoLog(s));
    }
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function makeProgram(gl, vert, frag) {
  const p = gl.createProgram();
  gl.attachShader(p, vert);
  gl.attachShader(p, frag);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[WaterBg] Program link error:', gl.getProgramInfoLog(p));
    }
    gl.deleteProgram(p);
    return null;
  }
  return p;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function WaterBackground({ strength = 0.72 }) {
  const canvasRef      = useRef(null);
  const prefersReduced = useReducedMotion();
  const strengthRef    = useRef(strength);
  useEffect(() => { strengthRef.current = strength; }, [strength]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Reduced motion: single static fill ───────────────────────────────────
    if (prefersReduced) {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const ctx2   = canvas.getContext('2d');
      if (ctx2) {
        const rect    = canvas.getBoundingClientRect();
        canvas.width  = Math.round(rect.width  || canvas.offsetWidth  || 360);
        canvas.height = Math.round(rect.height || canvas.offsetHeight || 600);
        ctx2.fillStyle = isDark ? 'rgb(10,13,22)' : 'rgb(252,253,255)';
        ctx2.fillRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    // ── WebGL context ─────────────────────────────────────────────────────────
    // alpha:true — canvas stays transparent on shader-compile failure so
    // HomeAtmosphere shows through cleanly instead of going black.
    // powerPreference omitted ('default') — 'low-power' on some Android
    // drivers selects reduced-precision rendering paths.
    const ctxOpts = { alpha: true, antialias: false, depth: false, stencil: false };
    const gl = canvas.getContext('webgl', ctxOpts)
            || canvas.getContext('experimental-webgl', ctxOpts);
    if (!gl) return;

    const vert = makeShader(gl, gl.VERTEX_SHADER,   VERT);
    const frag = makeShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    const prog = makeProgram(gl, vert, frag);
    if (!prog) return;
    gl.useProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,   1, -1,  -1,  1,
      -1,  1,   1, -1,   1,  1,
    ]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes  = gl.getUniformLocation(prog, 'u_res');
    const uDark = gl.getUniformLocation(prog, 'u_dark');
    const uRip  = gl.getUniformLocation(prog, 'u_rip[0]');

    // ── Ripple ring buffer ────────────────────────────────────────────────────
    const ripData = new Float32Array(N * 4);
    let   ripIdx  = 0;
    let   elapsed = 0;

    function addRipple(uvX, uvY, str) {
      const s      = (ripIdx % N) * 4;
      ripData[s]   = uvX;
      ripData[s+1] = uvY;
      ripData[s+2] = elapsed;
      ripData[s+3] = str;
      ripIdx++;
    }

    // ── Resize ────────────────────────────────────────────────────────────────
    // DPR strategy:
    //   desktop  → cap 2.5 (retina, never needed higher for this shader)
    //   mobile   → cap 2   (matches DPR=2 Android cleanly, no upscale blur)
    //   low-end  → cap 1.5 (≤4 CPU cores or ≤2 GB RAM, detected via Navigator)
    // Rendering at DPR < device ratio previously caused the browser to upscale
    // the small backing store over the CSS 100% size — the main source of
    // blurriness on Android mid-range and flagship devices.
    const mobileMq = window.matchMedia('(max-width: 767px)');
    function resize() {
      const rect = canvas.getBoundingClientRect();
      // Guard: ResizeObserver can fire before layout is complete on Android
      // (returns 0×0). Fall back to offsetWidth/Height which settle sooner.
      const w = rect.width  || canvas.offsetWidth  || 0;
      const h = rect.height || canvas.offsetHeight || 0;
      if (!w || !h) return;

      const isLowEnd =
        (navigator.hardwareConcurrency || 8) <= 4 ||
        (navigator.deviceMemory        || 8) <= 2;
      const maxDpr = mobileMq.matches ? (isLowEnd ? 1.5 : 2) : 2.5;
      const dpr    = Math.min(window.devicePixelRatio || 1, maxDpr);

      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }

    // ── Theme watcher ─────────────────────────────────────────────────────────
    let isDark = document.documentElement.dataset.theme === 'dark' ? 1.0 : 0.0;
    const mo = new MutationObserver(() => {
      isDark = document.documentElement.dataset.theme === 'dark' ? 1.0 : 0.0;
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // ── Animation loop ────────────────────────────────────────────────────────
    let rafId  = 0;
    let paused = false;
    const t0   = performance.now();

    function loop(nowMs) {
      rafId   = requestAnimationFrame(loop);
      if (paused) return;

      elapsed = (nowMs - t0) / 1000;

      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uDark, isDark);
      gl.uniform4fv(uRip,  ripData);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // ── Events ────────────────────────────────────────────────────────────────
    const isFine = window.matchMedia('(pointer: fine)').matches;

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      addRipple(x / rect.width, y / rect.height, strengthRef.current);
    }

    function onTouchStart(e) {
      const rect = canvas.getBoundingClientRect();
      const t    = e.touches[0];
      if (!t) return;
      const x = t.clientX - rect.left;
      const y = t.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      addRipple(x / rect.width, y / rect.height, strengthRef.current * 0.55);
    }

    function onVisible() { paused = document.hidden; }

    // ── ResizeObserver — debounced 80ms ───────────────────────────────────────
    // On Android, ResizeObserver can fire several times during a resize/
    // rotation before the layout settles. Debouncing avoids thrashing the
    // canvas dimensions and avoids the intermediate 0×0 reads.
    let resizeTimer = 0;
    function scheduleResize(delay) {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, delay);
    }

    // ── Orientation change ─────────────────────────────────────────────────────
    // On Android Chrome, getBoundingClientRect() returns stale dimensions for
    // up to ~150ms after orientationchange fires. Give it 200ms to settle.
    const onOrient = () => scheduleResize(200);

    const ro = new ResizeObserver(() => scheduleResize(80));
    const io = new IntersectionObserver(
      ([entry]) => {
        paused = !entry.isIntersecting;
        // Kick a resize when the canvas first becomes visible — ensures
        // viewport/u_res are correct after late layout (e.g. Android startup).
        if (entry.isIntersecting) scheduleResize(0);
      },
      { threshold: 0 }
    );

    ro.observe(canvas);
    io.observe(canvas);

    resize();
    rafId = requestAnimationFrame(loop);

    if (isFine) window.addEventListener('mousemove',  onMouseMove, { passive: true });
    window.addEventListener('touchstart',         onTouchStart, { passive: true });
    window.addEventListener('orientationchange',  onOrient);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      if (isFine) window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('touchstart',        onTouchStart);
      window.removeEventListener('orientationchange', onOrient);
      document.removeEventListener('visibilitychange', onVisible);
      gl.deleteProgram(prog);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteBuffer(quad);
    };
  }, [prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'absolute',
        inset:         0,
        width:         '100%',
        height:        '100%',
        display:       'block',
        pointerEvents: 'none',
        zIndex:        0,
      }}
    />
  );
}
