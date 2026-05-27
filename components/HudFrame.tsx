import React, { useEffect, useRef, useState } from 'react';

const INSET = 14;
const NOTCH_W = 240;
const NOTCH_H = 44;
const NOTCH_DIAG = 36;
const RADIUS = 22;

const HudFrame: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth - INSET * 2;
      const h = window.innerHeight - INSET * 2;
      setSize({ w, h });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { w, h } = size;
  if (w <= 0 || h <= 0) return null;

  // Path: start top-left after rounded corner, go around clockwise
  // rounded TL, straight top, notch into top-right, down, rounded BR, straight bottom, notch into bottom-left, up, close
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
      ref={wrapRef}
      className="fixed pointer-events-none z-30"
      style={{ top: INSET, left: INSET, width: w, height: h }}
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
        <circle
          cx={w - NOTCH_W}
          cy={NOTCH_H}
          r={2}
          fill="rgba(94,234,212,0.7)"
        />
        <circle cx={NOTCH_W} cy={h - NOTCH_H} r={2} fill="rgba(94,234,212,0.7)" />
        {/* short outline tick on the long edges */}
        <line
          x1={w - NOTCH_W - NOTCH_DIAG - 90}
          y1={0}
          x2={w - NOTCH_W - NOTCH_DIAG - 8}
          y2={0}
          stroke="rgba(94,234,212,0.35)"
          strokeWidth={1.5}
        />
        <line
          x1={NOTCH_W + NOTCH_DIAG + 8}
          y1={h}
          x2={NOTCH_W + NOTCH_DIAG + 90}
          y2={h}
          stroke="rgba(94,234,212,0.35)"
          strokeWidth={1.5}
        />
      </svg>
    </div>
  );
};

export default HudFrame;
