
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import WaitlistForm from './WaitlistForm';
import TracerDispatch from './TracerDispatch';

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

const ComingSoonContent: React.FC<ComingSoonContentProps> = ({ onLoginClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full">

      {/* Hero fold */}
      <div className="relative max-w-7xl mx-auto px-6 py-12 flex flex-col items-center min-h-screen">

      {/* Header */}
      <header className="w-full relative flex items-center justify-center py-8 z-10">
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           whileHover={{ scale: 1.02 }}
           className="flex items-center gap-4 cursor-default group"
        >
          <div className="w-10 h-10 border border-white/20 flex items-center justify-center p-2 rounded-xl backdrop-blur-xl bg-white/5 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-500">
             <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-white group-hover:text-cyan-400 transition-colors">
                <path d="M50 10L20 35V65L50 90L80 65V35L50 10ZM50 10V90M50 50L20 35M50 50L80 35" stroke="currentColor" strokeWidth="3" />
             </svg>
          </div>
          <span className="font-heading font-bold text-xl tracking-[0.2em] group-hover:tracking-[0.25em] transition-all duration-500">ONYX</span>
        </motion.div>

        {/* Log In Button - Retains glow on hover */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute right-0"
        >
          <button 
            onClick={onLoginClick}
            className="group relative overflow-hidden text-white/60 hover:text-white text-[10px] tracking-[0.2em] font-bold uppercase py-3 px-8 border border-white/10 hover:border-cyan-500/30 rounded-full transition-all duration-500 backdrop-blur-md bg-white/5 active:scale-95 shadow-lg hover:shadow-cyan-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">Terminal Access</span>
          </button>
        </motion.div>
      </header>

      {/* Hero Body */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center max-w-4xl space-y-12 mx-auto">
        <div className="space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-5xl md:text-8xl font-heading font-light tracking-tight leading-none selection:bg-cyan-500/30"
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

        <motion.a
          href="#dispatch"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="group flex flex-col items-center gap-2.5 pt-6 text-white/30 hover:text-cyan-300/80 transition-colors duration-500"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
            First Dispatch · Tracer Cyber
          </span>
          <motion.span
            className="block w-px h-7 bg-gradient-to-b from-white/30 to-transparent group-hover:from-cyan-400/80"
            animate={{ scaleY: [0.6, 1, 0.6], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top' }}
          />
        </motion.a>
      </main>
      </div>

      {/* Tracer Cyber product dispatch */}
      <TracerDispatch />

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-white/5">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-white/20 text-[10px] tracking-[0.3em] font-bold uppercase"
        >
          &copy; 2026 ONYX DEFENSIVE TECHNOLOGIES TLDR. ALL RIGHTS RESERVED.
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
        </motion.div>
      </footer>
    </div>
  );
};

export default ComingSoonContent;
