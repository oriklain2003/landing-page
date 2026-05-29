
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface LoginFormProps {
  onBack: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  return (
    <div className="w-full max-w-[460px] relative">
      {/* 
        Background Blur/Glow effects
        Dynamic background glow that reacts slightly to which field is focused
      */}
      <motion.div 
        animate={{
          x: focusedField === 'email' ? -15 : focusedField === 'password' ? 15 : 0,
          opacity: focusedField ? 0.8 : 0.5
        }}
        className="absolute top-[-40px] left-[-40px] w-72 h-72 bg-cyan-600/20 blur-[90px] rounded-full z-0 pointer-events-none" 
      />
      
      {/* Deep Blue Tone Base Glow */}
      <div className="absolute inset-0 bg-blue-900/10 blur-[130px] -z-10 rounded-[48px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 rounded-[36px] sm:rounded-[48px] bg-black/50 backdrop-blur-[60px] border border-white/10 p-6 sm:p-10 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] flex flex-col"
      >
        {/* Molten blue highlight on the top-left edge */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-transparent blur-3xl pointer-events-none" />
        
        {/* Glass border highlights */}
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-0 left-0 w-[1.5px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        <div className="text-center mb-10">
          <motion.h2 
            animate={{ color: focusedField ? '#fff' : 'rgba(255,255,255,0.9)' }}
            className="text-4xl font-semibold mb-2 tracking-tight transition-colors duration-500"
          >
            Welcome back
          </motion.h2>
          <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.3em]">Secure Node Access</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            {/* Email Input Field */}
            <div className="relative">
              <motion.div
                animate={{ 
                  opacity: focusedField === 'email' ? 0.6 : 0.2,
                  color: focusedField === 'email' ? '#22d3ee' : '#fff'
                }}
                className="absolute top-3 left-6 text-[10px] uppercase tracking-[0.2em] font-bold z-10 pointer-events-none transition-colors duration-300"
              >
                Identifier:
              </motion.div>
              <input
                type="email"
                value={email}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="terminal@onyx.vision"
                className="w-full bg-white/[0.03] border border-white/5 rounded-[28px] pt-9 pb-4 px-7 text-white placeholder:text-white/5 outline-none focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] focus:ring-4 focus:ring-cyan-500/10 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 shadow-inner"
              />
            </div>

            {/* Password Input Field */}
            <div className="relative">
              <motion.div
                animate={{ 
                  opacity: focusedField === 'password' ? 0.6 : 0.2,
                  color: focusedField === 'password' ? '#22d3ee' : '#fff'
                }}
                className="absolute top-3 left-6 text-[10px] uppercase tracking-[0.2em] font-bold z-10 pointer-events-none transition-colors duration-300"
              >
                Access Key:
              </motion.div>
              <input
                type="password"
                value={password}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/[0.03] border border-white/5 rounded-[28px] pt-9 pb-4 px-7 pr-16 text-white placeholder:text-white/5 outline-none focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] focus:ring-4 focus:ring-cyan-500/10 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 shadow-inner"
              />
              
              {/* Circular Blue Arrow Button - Fixed Alignment */}
              <motion.button
                type="submit"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: '#0891b2',
                  boxShadow: '0 0 25px rgba(6, 182, 212, 0.5), inset 0 0 10px rgba(255,255,255,0.2)' 
                }}
                whileTap={{ scale: 0.92 }}
                className="absolute right-2.5 top-[calc(50%+6px)] -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg transition-all duration-300 z-20"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </motion.button>
            </div>

            <div className="flex justify-end pr-2">
              <a href="#" className="text-[11px] text-white/15 hover:text-cyan-400 transition-all duration-300 font-medium">Forgot Credentials?</a>
            </div>
          </div>

          <div className="pt-10 text-center flex flex-col items-center">
            <div className="text-[11px] text-white/20 font-medium mb-12 flex items-center gap-1">
              New to the ecosystem? 
              <motion.button 
                animate={{
                  textShadow: [
                    "0 0 5px rgba(6, 182, 212, 0.1)",
                    "0 0 15px rgba(6, 182, 212, 0.4)",
                    "0 0 5px rgba(6, 182, 212, 0.1)"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ 
                  scale: 1.05,
                  color: "#22d3ee",
                  textShadow: "0 0 20px rgba(34, 211, 238, 0.6)"
                }}
                whileTap={{ scale: 0.95 }}
                className="text-cyan-500 font-bold border-b border-cyan-500/10 hover:border-cyan-500/50 transition-all ml-1 outline-none pb-0.5"
              >
                Request Auth
              </motion.button>
            </div>
            
            <motion.button 
              onClick={(e) => { e.preventDefault(); onBack(); }}
              whileHover={{ 
                color: 'rgba(255,255,255,0.7)',
                scale: 1.02,
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.03)'
              }}
              whileTap={{ scale: 0.98 }}
              className="px-10 sm:px-12 py-3.5 rounded-full text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.4em] font-bold text-white/10 border border-white/5 transition-all duration-500 outline-none"
            >
              Disconnect
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginForm;
