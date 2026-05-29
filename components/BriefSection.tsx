import React from 'react';
import { motion } from 'framer-motion';

const BriefSection: React.FC = () => {
  return (
    <section
      id="brief"
      className="relative min-h-[100svh] w-full flex items-center justify-center px-safe py-24 md:py-32"
    >
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-3 text-cyan-300/70 text-[10px] tracking-[0.32em] font-bold uppercase">
            <span className="block w-8 h-px bg-cyan-300/40" />
            01 — The brief
          </div>
          <h2 className="font-display text-[clamp(1.75rem,7vw,2.5rem)] md:text-7xl font-light leading-[1.08] md:leading-[1.02] tracking-tight">
            We build the systems that{' '}
            <span className="italic font-normal text-white">decide what's real</span>
            <br />
            in the world's most contested data layer.
          </h2>
        </motion.div>

        <div className="mt-10 md:mt-16 grid md:grid-cols-2 gap-x-16 gap-y-8 md:gap-y-10">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.08, ease: 'easeOut' }}
            className="text-white/65 text-base md:text-xl leading-relaxed font-light"
          >
            <span className="text-white font-normal">ONYX</span> is a defensive-technology
            company building detection layers for infrastructure that was never designed to be
            attacked. We work where the truth is in dispute and the cost of getting it wrong is
            measured in flights, dollars, and headlines.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.16, ease: 'easeOut' }}
            className="text-white/65 text-base md:text-xl leading-relaxed font-light"
          >
            Our research today centers on{' '}
            <span className="text-cyan-300">airspace integrity</span> — proving where aircraft
            really are, exposing fabricated tracks, and giving aggregators and operators the
            same physical-invariant tooling we use ourselves.
          </motion.p>
        </div>

      </div>
    </section>
  );
};

export default BriefSection;
