import React, { useEffect, useRef, useState } from 'react';

/**
 * Decorative HUD outline framing the whole viewport. Two notched corners
 * (top-right for the nav, bottom-left for the scroll cue) give it the
 * targeting-reticle feel.
 *
 * Mobile considerations:
 *  - The notch geometry scales down under 640px so the two notches don't
 *    swallow a narrow frame (a 240px notch on a 347px-wide frame reads broken).
 *  - Per-side insets respect the iPhone safe areas (Dynamic Island / notch and
 *    the home indicator) via env(safe-area-inset-*), measured with a probe el.
 */

type Insets = { top: number; right: number; bottom: number; left: number };

const readSafeAreaInsets = (): Insets => {
  if (typeof document === 'undefined') return { top: 0, right: 0, bottom: 0, left: 0 };
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;pointer-events:none;' +
    'padding-top:env(safe-area-inset-top);padding-right:env(safe-area-inset-right);' +
    'padding-bottom:env(safe-area-inset-bottom);padding-left:env(safe-area-inset-left);';
  document.body.appendChild(probe);
  const cs = getComputedStyle(probe);
  const insets = {
    top: parseFloat(cs.paddingTop) || 0,
    right: parseFloat(cs.paddingRight) || 0,
    bottom: parseFloat(cs.paddingBottom) || 0,
    left: parseFloat(cs.paddingLeft) || 0,
  };
  probe.remove();
  return insets;
};

const HudFrame: React.FC = () => {
  const [box, setBox] = useState<{ w: number; h: number; offset: Insets } | null>(null);

  useEffect(() => {
    const measure = () => {
      const safe = readSafeAreaInsets();
      const isMobile = window.innerWidth < 640;
      // Base gap between the frame and the screen edge.
      const base = isMobile ? 10 : 14;
      const offset: Insets = {
        top: Math.max(base, safe.top),
        right: Math.max(base, safe.right),
        bottom: Math.max(base, safe.bottom),
        left: Math.max(base, safe.left),
      };
      const w = window.innerWidth - offset.left - offset.right;
      const h = window.innerHeight - offset.top - offset.bottom;
      setBox({ w, h, offset });
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, []);

  if (!box || box.w <= 0 || box.h <= 0) return null;
  const { w, h, offset } = box;

  const isMobile = w < 620;
  const RADIUS = isMobile ? 16 : 22;
  const NOTCH_H = isMobile ? 34 : 44;
  const NOTCH_DIAG = isMobile ? 22 : 36;
  // Keep notches from ever exceeding ~42% of the frame width on small screens.
  const NOTCH_W = Math.min(isMobile ? 132 : 240, Math.round(w * 0.42));
  // Edge ticks scale with the notch so they never run off a short edge.
  const TICK = Math.min(90, Math.round(w * 0.22));

  const d = [
    `M ${RADIUS} 0`,
    `L ${w - NOTCH_W - NOTCH_DIAG} 0`,
    `L ${w - NOTCH_W} ${NOTCH_H}`,
    `L ${w} ${NOTCH_H}`,
    `L ${w} ${h - RADIUS}`,
    `A ${RADIUS} ${RADIUS} 0 0 1 ${w - RADIUS} ${h}`,
    `L ${NOTCH_W + NOTCH_DIAG} ${h}`,
    `L ${NOTCH_W} ${h - NOTCH_H}`,
    `L 0 ${h - NOTCH_H}`,
    `L 0 ${RADIUS}`,
    `A ${RADIUS} ${RADIUS} 0 0 1 ${RADIUS} 0`,
    'Z',
  ].join(' ');

  return (
    <div
      className="fixed pointer-events-none z-30"
      style={{ top: offset.top, left: offset.left, width: w, height: h }}
      aria-hidden="true"
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="block"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="hud-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(94,234,212,0.45)" />
            <stop offset="50%" stopColor="rgba(94,234,212,0.18)" />
            <stop offset="100%" stopColor="rgba(94,234,212,0.45)" />
          </linearGradient>
        </defs>
        <path d={d} fill="none" stroke="url(#hud-stroke)" strokeWidth={1} />
        {/* tick marks at the two notched corners */}
        <circle cx={w - NOTCH_W} cy={NOTCH_H} r={2} fill="rgba(94,234,212,0.7)" />
        <circle cx={NOTCH_W} cy={h - NOTCH_H} r={2} fill="rgba(94,234,212,0.7)" />
        {/* short outline ticks on the long edges */}
        <line
          x1={w - NOTCH_W - NOTCH_DIAG - TICK}
          y1={0}
          x2={w - NOTCH_W - NOTCH_DIAG - 8}
          y2={0}
          stroke="rgba(94,234,212,0.35)"
          strokeWidth={1.5}
        />
        <line
          x1={NOTCH_W + NOTCH_DIAG + 8}
          y1={h}
          x2={NOTCH_W + NOTCH_DIAG + TICK}
          y2={h}
          stroke="rgba(94,234,212,0.35)"
          strokeWidth={1.5}
        />
      </svg>
    </div>
  );
};

export default HudFrame;
