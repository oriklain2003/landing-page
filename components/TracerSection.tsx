import React from 'react';
import { motion } from 'framer-motion';
import PhysicsBalls from './PhysicsBalls';

const CAPABILITIES = [
  { label: 'Monitor', weight: 1.15 },
  { label: 'Detect', weight: 1.1 },
  { label: 'Classify', weight: 1 },
  { label: 'Report', weight: 0.95 },
  { label: 'Anomaly', weight: 1.1 },
  { label: 'AI agents', weight: 1.05 },
  { label: 'GPS interference', weight: 1.05 },
  { label: 'Real-time', weight: 1 },
  { label: 'Suspicious', weight: 0.95 },
  { label: 'Airspace', weight: 1.05 },
  { label: 'Fusion', weight: 0.95 },
  { label: 'Threat scoring', weight: 0.95 },
];

const TracerSection: React.FC = () => {
  return (
    <section
      id="tracer"
      className="relative min-h-screen w-full flex items-center justify-center px-6 py-32"
    >
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-20 items-center">
        {/* LEFT: copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-3 text-cyan-300/70 text-[10px] tracking-[0.32em] font-bold uppercase">
              <span className="block w-8 h-px bg-cyan-300/40" />
              02 — Tracer 42
            </div>
            <h2 className="font-display text-4xl md:text-7xl font-light leading-[1.02] tracking-tight">
              The eye on{' '}
              <span className="italic font-normal text-white">every</span> aircraft.
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
            className="mt-10 text-white/65 text-lg md:text-xl leading-relaxed font-light max-w-xl"
          >
            Tracer 42 monitors, detects, classifies, and reports on anything moving through
            global airspace — in real time. Anomaly detection, live AI agents flagging
            suspicious activity, GPS-interference mapping, and a fused real-time view of every
            track. And so much more.
          </motion.p>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
            }}
            className="mt-10 grid grid-cols-2 gap-x-8 gap-y-3 max-w-xl"
          >
            {[
              'Global airspace coverage',
              'Anomaly detection',
              'Suspicious activity AI agents',
              'GPS interference mapping',
              'Real-time track fusion',
              'Threat scoring & classification',
            ].map((line) => (
              <motion.li
                key={line}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
                }}
                className="flex items-start gap-3 text-white/75 text-sm md:text-base"
              >
                <span className="mt-[7px] block w-1 h-1 rounded-full bg-cyan-300 flex-shrink-0" />
                <span>{line}</span>
              </motion.li>
            ))}
          </motion.ul>

          <div className="mt-12 text-[10px] tracking-[0.32em] uppercase text-white/30">
            Drag the modules — they're alive.
          </div>
        </div>

        {/* RIGHT: physics balls panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[560px] md:h-[640px] rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent overflow-hidden"
        >
          <div className="absolute top-4 left-4 z-10 text-[10px] tracking-[0.3em] uppercase text-cyan-300/70 font-bold">
            Tracer 42 / modules
          </div>
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-white/40">
            <span className="block w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
            live
          </div>
          {/* corner ticks */}
          <CornerTick className="top-0 left-0" />
          <CornerTick className="top-0 right-0 rotate-90" />
          <CornerTick className="bottom-0 right-0 rotate-180" />
          <CornerTick className="bottom-0 left-0 -rotate-90" />
          <PhysicsBalls items={CAPABILITIES} className="h-full" />
        </motion.div>
      </div>
    </section>
  );
};

const CornerTick: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={`absolute w-3 h-3 m-2 ${className}`}
    viewBox="0 0 12 12"
    fill="none"
    stroke="rgba(94,234,212,0.55)"
    strokeWidth="1.5"
  >
    <path d="M 0 4 L 0 0 L 4 0" strokeLinecap="round" />
  </svg>
);

export default TracerSection;
