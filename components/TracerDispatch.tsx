import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const STATS = [
  { num: '32', label: 'cases catalogued' },
  { num: '17,378', label: 'candidates surfaced last week' },
  { num: '0', label: 'cryptographic guarantees in ADS-B' },
];

const Radar: React.FC = () => {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 340 340" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="dispatch-sweep" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5eead4" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dispatch-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5eead4" stopOpacity="0.12" />
          <stop offset="65%" stopColor="#5eead4" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="170" cy="170" r="158" fill="url(#dispatch-halo)" />

      <circle cx="170" cy="170" r="60" fill="none" stroke="rgba(94,234,212,0.14)" strokeWidth="1" strokeDasharray="2 5" />
      <circle cx="170" cy="170" r="120" fill="none" stroke="rgba(94,234,212,0.32)" strokeWidth="1" />

      <line x1="170" y1="44" x2="170" y2="58" stroke="rgba(94,234,212,0.55)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="170" y1="282" x2="170" y2="296" stroke="rgba(94,234,212,0.55)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="44" y1="170" x2="58" y2="170" stroke="rgba(94,234,212,0.55)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="282" y1="170" x2="296" y2="170" stroke="rgba(94,234,212,0.55)" strokeWidth="1.4" strokeLinecap="round" />

      <circle cx="170" cy="170" r="2.5" fill="rgba(94,234,212,0.9)" />

      <motion.g
        style={{ transformOrigin: '170px 170px' }}
        animate={reduced ? undefined : { rotate: 360 }}
        transition={reduced ? undefined : { duration: 9, repeat: Infinity, ease: 'linear' }}
      >
        <path d="M170 170 L170 50 A120 120 0 0 1 290 170 Z" fill="url(#dispatch-sweep)" />
      </motion.g>

      <motion.circle
        cx="138" cy="104" r="3" fill="#5eead4"
        animate={reduced ? undefined : { opacity: [0, 1, 1, 0] }}
        transition={reduced ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 6px rgba(94,234,212,0.7))' }}
      />
      <motion.circle
        cx="218" cy="128" r="2.5" fill="#5eead4"
        animate={reduced ? undefined : { opacity: [0, 1, 1, 0] }}
        transition={reduced ? undefined : { duration: 5, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 6px rgba(94,234,212,0.7))' }}
      />
      <motion.circle
        cx="206" cy="236" r="3.5" fill="#ef4444"
        animate={reduced ? undefined : { opacity: [0, 1, 1, 0] }}
        transition={reduced ? undefined : { duration: 3.4, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.7))' }}
      />
    </svg>
  );
};

const TracerDispatch: React.FC = () => {
  const reduced = useReducedMotion();
  return (
    <section
      id="dispatch"
      className="relative w-full px-6 py-32 md:py-40 overflow-hidden"
      aria-labelledby="dispatch-title"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-cyan-500/[0.04] blur-[140px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1.35fr_1fr] gap-16 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          className="space-y-10"
        >
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.28em] uppercase text-cyan-400/80">
            <span className="w-7 h-px bg-cyan-400/60" />
            <span>Dispatch 01 · 2026</span>
          </div>

          <div className="space-y-7">
            <div className="space-y-3">
              <div className="text-[11px] font-mono tracking-[0.24em] uppercase text-white/30">
                Tracer / Cyber
              </div>
              <h2
                id="dispatch-title"
                className="font-heading font-light text-5xl md:text-7xl leading-[0.95] tracking-tight"
              >
                The maps lie.{' '}
                <span className="block italic font-normal text-cyan-300/90">We can prove where.</span>
              </h2>
            </div>

            <p className="text-white/55 text-base md:text-lg max-w-xl leading-relaxed">
              ADS-B has no authentication. Anyone with a{' '}
              <span className="text-white/90">$300 software radio</span> can broadcast a fake airliner into the
              public flight-tracking networks. We catalogued the spoofs the aggregators silently scrubbed, and
              built the first detection layer they can deploy against their own data.
            </p>
          </div>

          <div className="grid grid-cols-3 border-t border-b border-white/[0.06] divide-x divide-white/[0.06]">
            {STATS.map((s) => (
              <div key={s.label} className="py-5 px-1 first:pl-0">
                <div className="font-mono text-2xl md:text-3xl text-white tabular-nums tracking-tight">
                  {s.num}
                </div>
                <div className="mt-2 text-[10px] font-mono tracking-[0.12em] text-white/40 leading-snug">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 pt-2">
            <motion.a
              href="/cyber/"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-4 pl-7 pr-5 py-4 rounded-full border border-cyan-400/30 bg-cyan-500/[0.04] backdrop-blur-md text-cyan-300 hover:text-white hover:border-cyan-400/60 hover:bg-cyan-500/[0.10] transition-all duration-500 shadow-[0_0_40px_-12px_rgba(94,234,212,0.4)]"
            >
              <span className="text-[11px] font-bold tracking-[0.28em] uppercase">Read the brief</span>
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-400/10 border border-cyan-400/30 group-hover:bg-cyan-400 group-hover:border-cyan-300 transition-all duration-500">
                <svg className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l5 5-5 5" />
                </svg>
              </span>
            </motion.a>

            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-[0.18em] uppercase text-white/25">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-red-500"
                animate={reduced ? undefined : { opacity: [1, 0.3, 1] }}
                transition={reduced ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ boxShadow: '0 0 8px rgba(239,68,68,0.8)' }}
              />
              <span>live · 8 cases on the page</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative aspect-square max-w-[420px] mx-auto w-full"
          style={{ filter: 'drop-shadow(0 0 80px rgba(94,234,212,0.18))' }}
        >
          <Radar />

          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-[9.5px] font-mono tracking-[0.18em] uppercase text-white/50 whitespace-nowrap">
            <span className="text-cyan-400">adfdf9</span>
            <span className="mx-1.5 text-white/20">·</span>
            <span>VANCE Mar-a-Lago</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TracerDispatch;
