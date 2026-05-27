import React from 'react';
import { motion } from 'framer-motion';

const CAPABILITIES = [
  'Global airspace coverage',
  'Anomaly detection',
  'Suspicious activity AI agents',
  'GPS interference mapping',
  'Real-time track fusion',
  'Threat scoring & classification',
];

const TracerSection: React.FC = () => {
  return (
    <section
      id="tracer"
      className="relative min-h-screen w-full flex items-center justify-center px-6 py-32"
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
            02 — Tracer 42
            <span className="block w-8 h-px bg-cyan-300/40" />
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
          className="mt-10 mx-auto text-white/65 text-lg md:text-xl leading-relaxed font-light max-w-2xl"
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
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 max-w-2xl mx-auto text-left"
        >
          {CAPABILITIES.map((line) => (
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
      </div>
    </section>
  );
};

export default TracerSection;
