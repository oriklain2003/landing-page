import React, { useEffect, useRef } from 'react';

interface ParticleOrbProps {
  count?: number;
  color?: string;
  className?: string;
}

const ParticleOrb: React.FC<ParticleOrbProps> = ({
  count = 600,
  color = '94,234,212',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect reduced-motion: render once, don't animate
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let running = false;
    let visible = false;
    let docVisible = !document.hidden;
    let rafId: number | null = null;
    let lastFrame = 0;
    const targetFps = 45; // cap to save CPU
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

    type P = { theta: number; phi: number; offR: number; jitter: number; baseSize: number };
    const particles: P[] = Array.from({ length: count }, () => ({
      theta: Math.random() * Math.PI * 2,
      phi: (Math.random() - 0.5) * 0.9,
      offR: (Math.random() - 0.5) * 32,
      jitter: Math.random() * Math.PI * 2,
      baseSize: 0.5 + Math.random() * 1.6,
    }));

    const start = performance.now();
    const tilt = -0.55;
    const tiltSin = Math.sin(tilt);
    const tiltCos = Math.cos(tilt);

    const drawFrame = (now: number) => {
      const t = (now - start) / 1000;
      const spin = t * 0.18;
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.6);

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const R = Math.min(width, height) * 0.42;
      const tubeR = R * 0.22;
      const persp = R * 2.6;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const wobble = Math.sin(t * 0.9 + p.jitter) * 0.04;
        const angle = p.theta + spin + wobble;
        const ringR = R + p.offR + Math.sin(t * 0.5 + p.jitter) * 2;
        const y0 = Math.sin(p.phi) * tubeR;
        const x = Math.cos(angle) * ringR;
        const z = Math.sin(angle) * ringR;
        const ty = y0 * tiltCos - z * tiltSin;
        const tz = y0 * tiltSin + z * tiltCos;
        const scale = persp / (persp + tz);
        const sx = cx + x * scale;
        const sy = cy + ty * scale;
        const size = p.baseSize * scale;
        const depthAlpha = Math.min(1, Math.max(0.08, (scale - 0.38) * 1.4));
        const a = depthAlpha * (0.7 + pulse * 0.25);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color},${a.toFixed(3)})`;
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (now: number) => {
      if (!running) return;
      // Throttle to targetFps
      if (now - lastFrame >= frameInterval) {
        lastFrame = now;
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

    // Initial static draw so it doesn't appear blank when off-screen
    drawFrame(performance.now());

    // IntersectionObserver: only animate when canvas is at least partially visible
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        maybeStart();
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    // Pause when tab hidden
    const onVis = () => {
      docVisible = !document.hidden;
      maybeStart();
    };
    document.addEventListener('visibilitychange', onVis);

    const ro = new ResizeObserver(() => {
      resize();
      // Redraw a single frame at the new size if paused
      if (!running) drawFrame(performance.now());
    });
    ro.observe(canvas);

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [count, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};

export default ParticleOrb;
