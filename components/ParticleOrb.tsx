import React, { useEffect, useRef } from 'react';

/**
 * Scroll-aware particle field. Particles morph between three forms as the
 * user scrolls between named sections:
 *   #hero    — orbital torus ring
 *   #brief   — globe / 3D sphere shell
 *   #tracer  — horizontal flight-trail streams flowing across the viewport
 *
 * Same particles persist across forms (smooth lerp). One full-viewport canvas.
 */

interface ParticleOrbProps {
  count?: number;
  color?: string;
  className?: string;
  /** Section IDs whose y-positions drive the form transitions, in order. */
  sectionIds?: string[];
}

const ParticleOrb: React.FC<ParticleOrbProps> = ({
  count = 600,
  color = '94,234,212',
  className = '',
  sectionIds = ['hero', 'brief', 'tracer'],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let running = false;
    let visible = true;
    let docVisible = !document.hidden;
    let rafId: number | null = null;
    let lastFrame = 0;
    const targetFps = 45;
    const frameInterval = 1000 / targetFps;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // ---- particle data ---------------------------------------------------
    type P = {
      theta: number;
      phi: number;
      offR: number;
      jitter: number;
      baseSize: number;
      // trail-form parameters
      lane: number;     // which horizontal lane (0..1)
      laneDepth: number; // pseudo-z for depth shading in trail form
      tOffset: number;  // phase along the trail
      speed: number;    // x-speed scalar in trail form
    };
    const particles: P[] = Array.from({ length: count }, (_, i) => ({
      theta: Math.random() * Math.PI * 2,
      phi: (Math.random() - 0.5) * 0.9,
      offR: (Math.random() - 0.5) * 32,
      jitter: Math.random() * Math.PI * 2,
      baseSize: 0.5 + Math.random() * 1.5,
      lane: (i / count) + (Math.random() - 0.5) / count, // even-ish but jittered
      laneDepth: Math.random(),
      tOffset: Math.random(),
      speed: 0.4 + Math.random() * 0.8,
    }));

    const start = performance.now();
    const tilt = -0.55;
    const tiltSin = Math.sin(tilt);
    const tiltCos = Math.cos(tilt);

    // ---- scroll → form mixing -------------------------------------------
    // formIndex is a float in [0, sectionIds.length - 1]. We blend the two
    // forms it lies between.
    let formIndex = 0;
    const computeFormIndex = () => {
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);
      if (sections.length < 2) {
        formIndex = 0;
        return;
      }
      // Anchor at viewport centre; each section's centre is a pure form
      const anchorY = window.scrollY + window.innerHeight * 0.5;
      const centers = sections.map((s) => s.offsetTop + s.offsetHeight * 0.5);
      if (anchorY <= centers[0]) {
        formIndex = 0;
        return;
      }
      if (anchorY >= centers[centers.length - 1]) {
        formIndex = centers.length - 1;
        return;
      }
      for (let i = 0; i < centers.length - 1; i++) {
        if (anchorY >= centers[i] && anchorY < centers[i + 1]) {
          const span = centers[i + 1] - centers[i];
          const t = (anchorY - centers[i]) / span;
          // ease the blend so each section "sits" in its pure form a little
          const e = t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
          formIndex = i + e;
          return;
        }
      }
    };
    computeFormIndex();

    // ---- form position functions ---------------------------------------
    // Each returns [x, y, z] in a roughly unit-ish local space; render scales.
    const torusPos = (p: P, t: number, R: number, tubeR: number) => {
      const wobble = Math.sin(t * 0.9 + p.jitter) * 0.04;
      const angle = p.theta + t * 0.18 + wobble;
      const ringR = R + p.offR + Math.sin(t * 0.5 + p.jitter) * 2;
      const y0 = Math.sin(p.phi) * tubeR;
      const x = Math.cos(angle) * ringR;
      const z = Math.sin(angle) * ringR;
      const ty = y0 * tiltCos - z * tiltSin;
      const tz = y0 * tiltSin + z * tiltCos;
      return [x, ty, tz];
    };

    const spherePos = (p: P, t: number, R: number) => {
      // Sphere uses (theta, phi) but maps phi to full elevation
      const fullPhi = p.phi * Math.PI; // [-pi/2, pi/2] roughly
      const angle = p.theta + t * 0.08;
      const r = R * (0.88 + 0.08 * Math.sin(t * 0.6 + p.jitter));
      const cosP = Math.cos(fullPhi);
      const x = r * cosP * Math.cos(angle);
      const z = r * cosP * Math.sin(angle);
      const y0 = r * Math.sin(fullPhi);
      // Slight self-rotation around y so the globe spins
      const ty = y0 * tiltCos - z * tiltSin;
      const tz = y0 * tiltSin + z * tiltCos;
      return [x, ty, tz];
    };

    const trailsPos = (p: P, t: number, w: number, h: number) => {
      // Lanes spread across vertical with subtle perspective by laneDepth
      const laneY = (p.lane - 0.5) * h * 0.72;
      // Particle flows right; wraps. Mix x in world-space (relative to centre).
      const period = w * 1.4;
      const phase = (p.tOffset + t * 0.18 * p.speed) % 1;
      const x = phase * period - period / 2;
      const z = (p.laneDepth - 0.5) * 60; // small z so depth-fade looks alive
      // Subtle vertical jitter
      const y = laneY + Math.sin(t * 1.4 + p.jitter) * 6;
      return [x, y, z];
    };

    const formPos = (p: P, t: number, fIdx: number, R: number, tubeR: number, w: number, h: number) => {
      const lo = Math.floor(fIdx);
      const hi = Math.min(lo + 1, 2);
      const frac = fIdx - lo;
      const a = positionForForm(p, t, lo, R, tubeR, w, h);
      if (lo === hi) return a;
      const b = positionForForm(p, t, hi, R, tubeR, w, h);
      // smooth ease
      const e = frac * frac * (3 - 2 * frac);
      return [
        a[0] + (b[0] - a[0]) * e,
        a[1] + (b[1] - a[1]) * e,
        a[2] + (b[2] - a[2]) * e,
      ];
    };

    const positionForForm = (p: P, t: number, form: number, R: number, tubeR: number, w: number, h: number) => {
      switch (form) {
        case 0:
          return torusPos(p, t, R, tubeR);
        case 1:
          return spherePos(p, t, R * 0.78);
        case 2:
        default:
          return trailsPos(p, t, w, h);
      }
    };

    // ---- frame ----------------------------------------------------------
    const drawFrame = (now: number) => {
      const t = (now - start) / 1000;
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.6);

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseR = Math.min(width, height) * 0.42;
      const tubeR = baseR * 0.22;
      const persp = baseR * 2.6;

      // When in trails form, anchor vertically near the middle of the viewport
      // (not the middle of the document) — but our canvas IS fixed-fullscreen,
      // so cx/cy are already viewport-centred. Good.

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const [x, y, z] = formPos(p, t, formIndex, baseR, tubeR, width, height);
        const scale = persp / (persp + z);
        const sx = cx + x * scale;
        const sy = cy + y * scale;
        const size = p.baseSize * scale;
        const depthAlpha = Math.min(1, Math.max(0.05, (scale - 0.36) * 1.4));
        const a = depthAlpha * (0.62 + pulse * 0.28);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color},${a.toFixed(3)})`;
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (now: number) => {
      if (!running) return;
      if (now - lastFrame >= frameInterval) {
        lastFrame = now;
        computeFormIndex();
        drawFrame(now);
      }
      rafId = requestAnimationFrame(tick);
    };

    const maybeStart = () => {
      const shouldRun = visible && docVisible && !reduceMotion;
      if (shouldRun && !running) {
        running = true;
        lastFrame = 0;
        rafId = requestAnimationFrame(tick);
      } else if (!shouldRun && running) {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    // initial draw so the canvas isn't blank during paused state
    drawFrame(performance.now());
    maybeStart();

    // IntersectionObserver: pause when canvas truly off-screen (it's
    // fixed-viewport, so this basically only fires if display:none).
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        maybeStart();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVis = () => {
      docVisible = !document.hidden;
      maybeStart();
    };
    document.addEventListener('visibilitychange', onVis);

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) drawFrame(performance.now());
    });
    ro.observe(canvas);

    // Re-measure section tops if window resizes (already triggers ro)
    // Note: we don't subscribe to scroll directly — we sample scrollY each
    // frame inside computeFormIndex, which is cheap and avoids passive
    // listener thrash.

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [count, color, sectionIds]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};

export default ParticleOrb;
