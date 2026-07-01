'use client';

import { useRef, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// ─── Config ───────────────────────────────────────────────────────────────────
const N = 12; // max simultaneous ripples in the shader uniform array

// ─── Vertex shader ────────────────────────────────────────────────────────────
// Full-screen triangle pair; v_uv has y=0 at top so it matches CSS coords.
const VERT = `
attribute vec2 a_pos;
varying   vec2 v_uv;
void main() {
  v_uv        = vec2(a_pos.x * 0.5 + 0.5, -a_pos.y * 0.5 + 0.5);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// ─── Fragment shader ──────────────────────────────────────────────────────────
const FRAG = `
precision mediump float;
varying vec2 v_uv;

uniform float u_time;   // elapsed seconds
uniform vec2  u_res;    // canvas pixel dimensions
uniform float u_dark;   // 0 = light mode, 1 = dark mode
uniform vec4  u_rip[${N}]; // (uvX, uvY, birthTime, strength) per ripple

// ─── Gradient noise ──────────────────────────────────────────────────────────
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
  mat2  m = mat2(1.6, 1.2, -1.2, 1.6); // 2x scale + rotation each octave
  v += a * gnoise(p); p = m * p; a *= 0.5;
  v += a * gnoise(p); p = m * p; a *= 0.5;
  v += a * gnoise(p);
  return v;
}

// ─── Caustic pattern ──────────────────────────────────────────────────────────
// Two FBM fields moving at different rates; their difference, fed through
// sin(), produces interference bands that look like sunlight caustics.
float caustic(vec2 uv, float t) {
  float ar = u_res.x / u_res.y;
  vec2 p   = uv * vec2(ar, 1.0) * 2.6;
  float f1 = fbm(p * 0.9  + vec2(t * 0.038, t * 0.027));
  float f2 = fbm(p * 1.1  - vec2(t * 0.031, t * 0.048) + vec2(3.7, 1.9));
  float c  = sin((f1 - f2) * 10.0 + t * 0.38) * 0.5 + 0.5;
  // Two-tier power: broad glow (3.5) + sharp focal spots (8.0)
  return pow(c, 3.5) * 0.78 + pow(c, 8.0) * 0.22;
}

// ─── Ambient traveling waves ──────────────────────────────────────────────────
// Five sine waves at different angles, speeds, and frequencies —
// produces natural-looking open-water surface motion.
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

// ─── Mouse/touch ripples ──────────────────────────────────────────────────────
// Each ripple expands outward at 0.36 UV/s with a sin carrier (30 rad/UV),
// decays in space (exp(-d*2.4)) and time (exp(-age*1.1)).
// Branchless: inactive ripples gate to 0.0 via the 'gate' multiplier.
float rippleH(vec2 uv, float t) {
  float ar = u_res.x / u_res.y;
  vec2 sc  = vec2(ar, 1.0); // aspect-correct distance
  float h  = 0.0;
  for (int i = 0; i < ${N}; i++) {
    vec4  r   = u_rip[i];
    float age = t - r.z;
    // gate: r.w > 0 AND 0 <= age < 4.5
    float gate = step(0.001, r.w) * step(0.0, age) * (1.0 - step(4.5, age));
    float d   = length((uv - r.xy) * sc);
    float wf  = d - age * 0.36;              // signed distance from wavefront
    float env = exp(-d * 2.4) * exp(-age * 1.1) * r.w;
    float osc = sin(wf * 30.0) * smoothstep(0.025, 0.0, wf); // zero ahead of front
    h += osc * env * gate;
  }
  return h;
}

void main() {
  float t  = u_time * 0.50; // slow-motion ambient waves
  vec2  uv = v_uv;

  // Height field at uv and two neighbours for finite-difference normals.
  // waveH uses the slowed 't'; rippleH uses raw elapsed (u_time).
  float e  = 0.003;
  float h  = waveH(uv,             t) + rippleH(uv,             u_time);
  float hx = waveH(uv+vec2(e,0.0), t) + rippleH(uv+vec2(e,0.0), u_time);
  float hy = waveH(uv+vec2(0.0,e), t) + rippleH(uv+vec2(0.0,e), u_time);

  // Surface normal — dz controls how much tilt modulates the colour
  vec3 norm = normalize(vec3((h - hx) / e * 0.020, (h - hy) / e * 0.020, 1.0));

  // Caustics evaluated at the refraction-shifted UV
  float c = caustic(uv + norm.xy * 0.016, t * 1.5);

  // Reflection intensity from surface tilt
  float tilt = 1.0 - abs(norm.z);
  float refl = clamp(tilt * 7.0, 0.0, 1.0);

  // ─── Theme-aware palette ──────────────────────────────────────────────────
  // Light: white base + pale sky reflection
  // Dark:  deep navy base + faint blue reflection
  vec3 baseL = vec3(0.986, 0.991, 0.999);
  vec3 skyL  = vec3(0.750, 0.840, 0.940);
  vec3 baseD = vec3(0.038, 0.052, 0.088);
  vec3 skyD  = vec3(0.120, 0.220, 0.420);

  vec3 base      = mix(baseL, baseD, u_dark);
  vec3 sky       = mix(skyL,  skyD,  u_dark);
  float skyMix   = mix(0.062, 0.140, u_dark);
  float caustAmt = mix(0.030, 0.020, u_dark);
  float shadowAmt= mix(0.012, 0.009, u_dark);

  vec3 col = mix(base, sky, refl * skyMix);
  col += (c - 0.45) * caustAmt;   // caustic bright patches
  col -= (1.0 - c)  * shadowAmt;  // subtle inter-caustic shadow
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
export default function WaterHeroBackground() {
  const canvasRef      = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Reduced motion: single static fill, no animation ─────────────────────
    if (prefersReduced) {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const ctx2   = canvas.getContext('2d');
      if (ctx2) {
        const rect    = canvas.getBoundingClientRect();
        canvas.width  = Math.round(rect.width);
        canvas.height = Math.round(rect.height);
        ctx2.fillStyle = isDark ? 'rgb(10,13,22)' : 'rgb(252,253,255)';
        ctx2.fillRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    // ── WebGL context ─────────────────────────────────────────────────────────
    const ctxOpts = { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' };
    const gl = canvas.getContext('webgl', ctxOpts) || canvas.getContext('experimental-webgl', ctxOpts);
    if (!gl) return; // transparent canvas → HomeAtmosphere shows through

    const vert = makeShader(gl, gl.VERTEX_SHADER,   VERT);
    const frag = makeShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    const prog = makeProgram(gl, vert, frag);
    if (!prog) return;
    gl.useProgram(prog);

    // Full-screen quad (two triangles)
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,   1, -1,  -1,  1,
      -1,  1,   1, -1,   1,  1,
    ]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes  = gl.getUniformLocation(prog, 'u_res');
    const uDark = gl.getUniformLocation(prog, 'u_dark');
    const uRip  = gl.getUniformLocation(prog, 'u_rip[0]');

    // ── Ripple ring buffer ────────────────────────────────────────────────────
    // Float32Array laid out as [x0,y0,t0,str0, x1,y1,t1,str1, ...]
    // Inactive slots have str=0 (gate = 0 in shader).
    const ripData = new Float32Array(N * 4);
    let   ripIdx  = 0;
    let   elapsed = 0;

    function addRipple(uvX, uvY, strength) {
      const s      = (ripIdx % N) * 4;
      ripData[s]   = uvX;
      ripData[s+1] = uvY;
      ripData[s+2] = elapsed;
      ripData[s+3] = strength;
      ripIdx++;
    }

    // ── Resize ────────────────────────────────────────────────────────────────
    // Render at CSS pixel resolution (no DPR); subtle blur from upscaling
    // suits the diffuse water aesthetic and keeps the GPU load low.
    function resize() {
      const rect    = canvas.getBoundingClientRect();
      canvas.width  = Math.round(rect.width);
      canvas.height = Math.round(rect.height);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }

    // ── Theme watcher ─────────────────────────────────────────────────────────
    let isDark = document.documentElement.dataset.theme === 'dark' ? 1.0 : 0.0;
    const mo = new MutationObserver(() => {
      isDark = document.documentElement.dataset.theme === 'dark' ? 1.0 : 0.0;
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // ── Ambient ripple sources ─────────────────────────────────────────────────
    // [uvX, uvY, intervalMs, nextFireMs] — staggered so multiple sources
    // don't fire in the same frame and look like a single event.
    const AMBIENT = [
      [0.22, 0.32, 2400, 0],
      [0.68, 0.58, 3100, 900],
      [0.44, 0.74, 1850, 1700],
      [0.78, 0.22, 3650, 420],
    ];

    // ── Animation loop ────────────────────────────────────────────────────────
    let rafId  = 0;
    let paused = false;
    const t0   = performance.now();

    function loop(nowMs) {
      rafId   = requestAnimationFrame(loop);
      if (paused) return;

      elapsed = (nowMs - t0) / 1000;

      for (const src of AMBIENT) {
        if (nowMs >= src[3]) {
          // Subtle strength variation for organic feel
          const str = 0.20 + Math.sin(elapsed * 0.7 + src[0] * 6.3) * 0.07;
          addRipple(src[0], src[1], str);
          src[3] = nowMs + src[2] + Math.sin(elapsed * 1.1 + src[1] * 4.7) * 200;
        }
      }

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
      addRipple(x / rect.width, y / rect.height, 0.72);
    }

    function onTouch(e) {
      const rect = canvas.getBoundingClientRect();
      for (let i = 0; i < e.touches.length; i++) {
        const t  = e.touches[i];
        const x  = t.clientX - rect.left;
        const y  = t.clientY - rect.top;
        if (x < 0 || y < 0 || x > rect.width || y > rect.height) continue;
        addRipple(x / rect.width, y / rect.height, 0.60);
      }
    }

    function onVisible() { paused = document.hidden; }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    resize();
    rafId = requestAnimationFrame(loop);

    if (isFine) window.addEventListener('mousemove',  onMouseMove, { passive: true });
    window.addEventListener('touchstart',         onTouch,     { passive: true });
    window.addEventListener('touchmove',          onTouch,     { passive: true });
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      mo.disconnect();
      if (isFine) window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('touchstart',         onTouch);
      window.removeEventListener('touchmove',          onTouch);
      document.removeEventListener('visibilitychange', onVisible);
      // WebGL resource cleanup
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
