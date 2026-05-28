
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WaitlistForm from './WaitlistForm';
import BriefSection from './BriefSection';
import TracerSection from './TracerSection';

const WORDS = ["control", "autonomy", "airspace", "prediction", "detection", "intelligence"];

const TypewriterText: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    if (reverse) {
      if (subIndex === 0) {
        setReverse(false);
        setIndex((prev) => (prev + 1) % WORDS.length);
        return;
      }
      const timeout = setTimeout(() => {
        setSubIndex((prev) => prev - 1);
      }, 40);
      return () => clearTimeout(timeout);
    } else {
      if (subIndex === WORDS[index].length) {
        const timeout = setTimeout(() => {
          setReverse(true);
        }, 1800);
        return () => clearTimeout(timeout);
      }
      const timeout = setTimeout(() => {
        setSubIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [subIndex, index, reverse]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-white font-medium">
      {WORDS[index].substring(0, subIndex)}
      <span className={`${blink ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 inline-block w-[2px] h-[1.1em] bg-white align-middle ml-1 -mt-1`}></span>
    </span>
  );
};

interface ComingSoonContentProps {
  onLoginClick?: () => void;
}

const navLinkClass =
  "group relative text-white/55 hover:text-white text-[10px] tracking-[0.28em] font-bold uppercase transition-colors duration-300";

const ComingSoonContent: React.FC<ComingSoonContentProps> = ({ onLoginClick }) => {
  return (
    <div className="relative w-full">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.a
            href="#hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 cursor-pointer group"
          >
            <div className="w-10 h-10 border border-white/20 flex items-center justify-center p-2 rounded-xl backdrop-blur-xl bg-white/5 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-500">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-white group-hover:text-cyan-400 transition-colors">
                <path d="M50 10L20 35V65L50 90L80 65V35L50 10ZM50 10V90M50 50L20 35M50 50L80 35" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>
            <span className="font-heading font-bold text-xl tracking-[0.2em] group-hover:tracking-[0.25em] transition-all duration-500">ONYX</span>
          </motion.a>

          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            aria-label="Primary"
            className="flex items-center gap-1 sm:gap-2 p-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md shadow-lg"
          >
            <a
              href="#brief"
              className={`${navLinkClass} px-3 sm:px-5 py-2.5 rounded-full hover:bg-white/[0.05] hidden sm:inline-block`}
            >
              <span className="relative z-10">Brief</span>
            </a>
            <a
              href="#tracer"
              className={`${navLinkClass} px-3 sm:px-5 py-2.5 rounded-full hover:bg-white/[0.05] hidden sm:inline-block`}
            >
              <span className="relative z-10">Tracer 42</span>
            </a>
            <a
              href="/cyber/"
              className={`${navLinkClass} px-3 sm:px-5 py-2.5 rounded-full hover:bg-white/[0.05]`}
            >
              <span className="relative z-10">Cyber</span>
            </a>

            <button
              onClick={onLoginClick}
              className="group relative overflow-hidden text-cyan-300/90 hover:text-white text-[10px] tracking-[0.28em] font-bold uppercase py-2.5 px-3 sm:px-5 rounded-full border border-cyan-400/30 bg-cyan-500/[0.06] hover:border-cyan-400/60 hover:bg-cyan-500/[0.12] transition-all duration-500 active:scale-95 shadow-[0_0_24px_-8px_rgba(94,234,212,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Access
                <svg className="w-2.5 h-2.5 transition-transform duration-500 group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l5 5-5 5" />
                </svg>
              </span>
            </button>
          </motion.nav>
        </div>
      </header>

      {/* HERO */}
      <section
        id="hero"
        className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden"
      >
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl space-y-12 w-full">
          <div className="space-y-8 relative">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-5xl md:text-8xl font-display font-light tracking-tight leading-[0.95] selection:bg-cyan-500/30"
            >
              Something <span className="italic font-normal text-white">extraordinary</span> is brewing.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
              className="text-white/40 text-lg md:text-3xl max-w-2xl mx-auto font-light leading-relaxed"
            >
              <p className="tracking-tight">
                We're building the future of... <TypewriterText />
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="w-full max-w-md pt-8"
          >
            <WaitlistForm />
          </motion.div>
        </div>

        {/* Scroll affordance */}
        <motion.a
          href="#brief"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] tracking-[0.32em] uppercase text-white/30 hover:text-cyan-300 transition-colors"
        >
          scroll
          <span className="block w-px h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </motion.a>
      </section>

      {/* BRIEF */}
      <BriefSection />

      {/* TRACER 42 */}
      <TracerSection />

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 py-12 border-t border-white/5 mt-12">
        <div className="text-white/20 text-[10px] tracking-[0.3em] font-bold uppercase">
          &copy; 2026 ONYX DEFENSIVE TECHNOLOGIES TLDR. ALL RIGHTS RESERVED.
        </div>
        <div className="text-white/20 text-[10px] tracking-[0.3em] font-bold uppercase">
          v0.1 · pre-release
        </div>
      </footer>
    </div>
  );
};

export default ComingSoonContent;
