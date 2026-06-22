import React from 'react';
import { motion } from 'framer-motion';

const INDICATORS = [
  {
    title: 'Base activity anomaly',
    body: 'An abnormal rise in sorties from a single base, the earliest signature of an operational deployment.',
  },
  {
    title: 'Air bridge',
    body: 'A sustained run of one-directional transport flights, the logistics tail that precedes the operation.',
  },
  {
    title: 'Capability grouping',
    body: 'Fighters, tankers and control aircraft launching together: a complete force package forming up.',
  },
];

const CUBES = [
  'Transponder-shutoff detection',
  'Origin / destination verification',
  'Time & route deviation',
  'Missing-takeoff detection',
  'Flight-line volume baselines',
  'Natural-language intelligence chat',
];

const TwelveSection: React.FC = () => {
  return (
    <section
      id="twelve"
      className="relative min-h-[100svh] w-full flex items-center justify-center px-safe py-24 md:py-32"
    >
      <div className="max-w-4xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-3 text-cyan-300/70 text-[10px] tracking-[0.32em] font-bold uppercase">
            <span className="block w-8 h-px bg-cyan-300/40" />
            03 — Twelve
            <span className="block w-8 h-px bg-cyan-300/40" />
          </div>
          <h2 className="font-display text-[clamp(1.875rem,8vw,2.75rem)] md:text-7xl font-light leading-[1.05] md:leading-[1.02] tracking-tight">
            Tracer sees the aircraft.{' '}
            <span className="italic font-normal text-white">Twelve</span> sees the operation.
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
          className="mt-8 md:mt-10 mx-auto text-white/65 text-base md:text-xl leading-relaxed font-light max-w-2xl"
        >
          Twelve is the strategic layer above the track. It correlates thousands of individual
          flights into operational indicators, surfacing the early signatures of an operation
          before it begins. A modular analysis engine you extend with new detection cubes, and
          query in plain language.
        </motion.p>

        {/* Operational indicators */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
          }}
          className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 text-left"
        >
          {INDICATORS.map((item) => (
            <motion.div
              key={item.title}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
              }}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6 backdrop-blur-sm hover:border-cyan-400/30 hover:bg-cyan-500/[0.03] transition-all duration-500"
            >
              <span className="block w-1.5 h-1.5 rounded-full bg-cyan-300 mb-4 shadow-[0_0_12px_rgba(94,234,212,0.7)]" />
              <h3 className="font-heading text-white text-sm md:text-base font-semibold tracking-wide mb-2">
                {item.title}
              </h3>
              <p className="text-white/55 text-xs md:text-sm leading-relaxed font-light">
                {item.body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Modular cubes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mt-14 inline-flex items-center gap-3 text-cyan-300/70 text-[10px] tracking-[0.32em] font-bold uppercase"
        >
          <span className="block w-8 h-px bg-cyan-300/40" />
          A modular engine you extend with new cubes
          <span className="block w-8 h-px bg-cyan-300/40" />
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
          }}
          className="mt-6 flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto"
        >
          {CUBES.map((cube) => (
            <motion.li
              key={cube}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
              className="text-white/60 text-[11px] md:text-xs tracking-wide rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5"
            >
              {cube}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};

export default TwelveSection;
