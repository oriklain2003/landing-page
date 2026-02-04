
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WaitlistForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 2000);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="py-6 px-10 rounded-[32px] bg-cyan-500/5 border border-cyan-500/20 backdrop-blur-xl text-center"
          >
            <p className="text-white font-medium mb-1 tracking-tight">Access request logged.</p>
            <p className="text-cyan-400/60 text-[10px] tracking-[0.2em] font-bold uppercase">Check your terminal soon</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 p-2 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-md"
          >
            <div className="flex-grow relative group">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="w-full bg-transparent border-none rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none transition-all duration-300"
                required
              />
              {/* Internal glow line */}
              <motion.div 
                className="absolute bottom-2 left-6 right-6 h-[1px] bg-cyan-500/0 group-focus-within:bg-cyan-500/40 transition-all duration-500"
                layoutId="underline"
              />
            </div>
            
            <button
              type="submit"
              disabled={status === 'loading'}
              className="relative group bg-white text-black font-bold px-10 py-4 rounded-[24px] overflow-hidden active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-[0_10px_20px_-10px_rgba(255,255,255,0.3)] hover:shadow-cyan-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-white to-neutral-200 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <span className="relative z-10 flex items-center justify-center gap-3">
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    Request Access
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      
      {/* Decorative Blur around form */}
      <div className="absolute -inset-4 bg-cyan-500/5 blur-2xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};

export default WaitlistForm;
