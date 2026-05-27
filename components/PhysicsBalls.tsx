import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

export interface BallSpec {
  label: string;
  /** Optional weight 0.7-1.4 to scale this ball relative to base size */
  weight?: number;
}

interface PhysicsBallsProps {
  items: BallSpec[];
  className?: string;
}

const PhysicsBalls: React.FC<PhysicsBallsProps> = ({ items, className = '' }) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shouldInit, setShouldInit] = useState(false);

  // Lazy-init: only mount the matter engine when the wrapper first enters view
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (shouldInit) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldInit(true);
          io.disconnect();
        }
      },
      { rootMargin: '120px', threshold: 0.05 }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [shouldInit]);

  useEffect(() => {
    if (!shouldInit) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initialRect = wrap.getBoundingClientRect();
    let w = initialRect.width;
    let h = initialRect.height;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1, scale: 0.0009 } });
    const render = Matter.Render.create({
      canvas,
      engine,
      options: {
        width: w,
        height: h,
        wireframes: false,
        background: 'transparent',
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      },
    });

    // Thick walls — overlap heavily into the world so high-velocity bodies cannot tunnel through
    const WALL_T = 200;
    const wallOpts: Matter.IChamferableBodyDefinition = {
      isStatic: true,
      render: { visible: false },
    };
    const makeWalls = () => [
      Matter.Bodies.rectangle(w / 2, -WALL_T / 2, w + WALL_T * 2, WALL_T, wallOpts),
      Matter.Bodies.rectangle(w / 2, h + WALL_T / 2, w + WALL_T * 2, WALL_T, wallOpts),
      Matter.Bodies.rectangle(-WALL_T / 2, h / 2, WALL_T, h + WALL_T * 2, wallOpts),
      Matter.Bodies.rectangle(w + WALL_T / 2, h / 2, WALL_T, h + WALL_T * 2, wallOpts),
    ];
    let walls = makeWalls();
    Matter.Composite.add(engine.world, walls);

    const ctx2d = canvas.getContext('2d');
    const measureText = (label: string, fontPx: number) => {
      if (!ctx2d) return label.length * fontPx * 0.55;
      ctx2d.font = `600 ${fontPx}px Oxanium, system-ui, sans-serif`;
      return ctx2d.measureText(label).width;
    };

    type PillBody = Matter.Body & { __label: string; __fontPx: number; __halfW: number; __halfH: number };
    const balls: PillBody[] = [];

    // Conservative font sizing — keep pills small enough that several fit horizontally
    const baseFont = Math.max(11, Math.min(16, w / 36));
    const padX = baseFont * 1.4;
    const padY = baseFont * 1.0;

    // Hard cap on pill dimensions so nothing dominates the box
    const maxHalfW = w * 0.32;
    const maxHalfH = h * 0.10;

    // Pre-build all pill bodies but ADD them to the world one at a time so they don't overlap at spawn
    const pending: PillBody[] = items.map((it, idx) => {
      const weight = Math.min(1.15, Math.max(0.85, it.weight ?? 1));
      const fontPx = baseFont * weight;
      const textW = measureText(it.label, fontPx);
      let halfW = (textW + padX) / 2;
      let halfH = (fontPx + padY) / 2;
      halfW = Math.min(halfW, maxHalfW);
      halfH = Math.min(halfH, maxHalfH);
      const chamfer = Math.min(halfH * 0.95, halfW * 0.95);
      // Spread spawn x across the panel deterministically — but pseudo-random ordering
      const xJitter = ((idx * 0.6180339887) % 1) * (w - halfW * 2 - 40) + halfW + 20;
      const startX = xJitter;
      const startY = -halfH - 30;
      const body = Matter.Bodies.rectangle(startX, startY, halfW * 2, halfH * 2, {
        chamfer: { radius: chamfer },
        restitution: 0.4,
        friction: 0.1,
        frictionAir: 0.02,
        density: 0.0022,
        render: {
          fillStyle: 'rgba(255,255,255,0.94)',
          strokeStyle: 'rgba(94,234,212,0.4)',
          lineWidth: 1.5,
        },
      }) as PillBody;
      body.__label = it.label;
      body.__fontPx = fontPx;
      body.__halfW = halfW;
      body.__halfH = halfH;
      return body;
    });

    // Drop them in sequence so they never overlap on spawn
    const dropTimers: ReturnType<typeof setTimeout>[] = [];
    pending.forEach((body, i) => {
      const t = setTimeout(() => {
        Matter.Composite.add(engine.world, body);
        balls.push(body);
      }, 180 * i);
      dropTimers.push(t);
    });

    // Remove the dev debug global if it was set previously
    delete (window as unknown as { __pb?: unknown }).__pb;
    // Cap any runaway velocity to prevent tunneling on first contact
    Matter.Events.on(engine, 'beforeUpdate', () => {
      const maxV = 25;
      for (const b of balls) {
        if (b.speed > maxV) {
          const s = maxV / b.speed;
          Matter.Body.setVelocity(b, { x: b.velocity.x * s, y: b.velocity.y * s });
        }
      }
    });

    // Mouse interaction — keep references so we can tear down cleanly
    const mouse = Matter.Mouse.create(canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.18,
        damping: 0.2,
        render: { visible: false },
      },
    });
    Matter.Composite.add(engine.world, mouseConstraint);
    // matter.Mouse hijacks wheel events on the element; remove them so the page can scroll
    const mAny = mouse as unknown as {
      element: HTMLElement;
      mousewheel: EventListener;
    };
    mAny.element.removeEventListener('mousewheel', mAny.mousewheel);
    mAny.element.removeEventListener('DOMMouseScroll', mAny.mousewheel);

    // Label drawing in afterRender — keep a named handler ref so we can remove it
    const labelDraw = () => {
      const ctx = render.context;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      balls.forEach((b) => {
        ctx.save();
        ctx.translate(b.position.x, b.position.y);
        ctx.rotate(b.angle);
        ctx.font = `600 ${b.__fontPx}px Oxanium, system-ui, sans-serif`;
        ctx.fillStyle = 'rgb(8,12,15)';
        ctx.fillText(b.__label, 0, 0);
        ctx.restore();
      });
      ctx.restore();
    };
    Matter.Events.on(render, 'afterRender', labelDraw);

    const runner = Matter.Runner.create();
    // Only start running if not in reduced-motion mode
    if (!reduceMotion) {
      Matter.Runner.run(runner, engine);
      Matter.Render.run(render);
    } else {
      // Render once so the user sees the balls at their starting state
      Matter.Render.world(render);
    }

    // Pause when off-screen
    let isVisible = true;
    let isRunning = !reduceMotion;
    const pause = () => {
      if (!isRunning) return;
      Matter.Runner.stop(runner);
      Matter.Render.stop(render);
      isRunning = false;
    };
    const resume = () => {
      if (isRunning || reduceMotion) return;
      Matter.Runner.run(runner, engine);
      Matter.Render.run(render);
      isRunning = true;
    };
    const updateRun = () => {
      if (isVisible && !document.hidden) resume();
      else pause();
    };

    const ioRun = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
        updateRun();
      },
      { threshold: 0.05 }
    );
    ioRun.observe(wrap);
    const onVis = () => updateRun();
    document.addEventListener('visibilitychange', onVis);

    // Resize
    const ro = new ResizeObserver(() => {
      const r2 = wrap.getBoundingClientRect();
      if (Math.abs(r2.width - w) < 1 && Math.abs(r2.height - h) < 1) return;
      w = r2.width;
      h = r2.height;
      const pr = render.options.pixelRatio || 1;
      canvas.width = w * pr;
      canvas.height = h * pr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      render.options.width = w;
      render.options.height = h;
      Matter.Composite.remove(engine.world, walls);
      walls = makeWalls();
      Matter.Composite.add(engine.world, walls);
    });
    ro.observe(wrap);

    return () => {
      ioRun.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      dropTimers.forEach((t) => clearTimeout(t));
      // Stop simulation + rendering
      Matter.Runner.stop(runner);
      Matter.Render.stop(render);
      Matter.Events.off(render, 'afterRender', labelDraw);
      Matter.Events.off(engine, 'beforeUpdate');
      // Tear down mouse listeners that matter.Mouse installed on the canvas
      const m = mouse as unknown as {
        element: HTMLElement;
        mousemove: EventListener;
        mousedown: EventListener;
        mouseup: EventListener;
        mousewheel: EventListener;
      };
      try {
        m.element.removeEventListener('mousemove', m.mousemove);
        m.element.removeEventListener('mousedown', m.mousedown);
        m.element.removeEventListener('mouseup', m.mouseup);
        m.element.removeEventListener('mousewheel', m.mousewheel);
        m.element.removeEventListener('DOMMouseScroll', m.mousewheel);
        m.element.removeEventListener('touchmove', m.mousemove);
        m.element.removeEventListener('touchstart', m.mousedown);
        m.element.removeEventListener('touchend', m.mouseup);
      } catch {}
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      // Clear canvas pixels, but don't detach it — React owns the node
      if (ctx2d) ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [shouldInit, items]);

  return (
    <div
      ref={wrapRef}
      className={`relative w-full ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

export default PhysicsBalls;
