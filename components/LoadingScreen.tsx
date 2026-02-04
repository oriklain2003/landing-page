
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 35);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-24 h-24 mb-4"
        >
          {/* Recreating the logo with SVG for sharpness in loading state */}
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
             <motion.path 
                d="M50 10L20 35V65L50 90L80 65V35L50 10Z" 
                stroke="currentColor" 
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
             />
             <motion.path 
                d="M50 10V90M20 35L80 35M20 65L80 65" 
                stroke="currentColor" 
                strokeWidth="0.5" 
                opacity="0.3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1, duration: 1 }}
             />
             <motion.path 
                d="M50 50L20 35M50 50L80 35M50 50L50 90" 
                stroke="currentColor" 
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
             />
          </svg>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5 }}
           className="text-center"
        >
          <h2 className="text-white text-2xl font-bold tracking-[0.4em] font-heading ml-[0.4em]">ONYX</h2>
        </motion.div>
      </div>

      <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ x: '-100%' }}
          animate={{ x: `${progress - 100}%` }}
          transition={{ ease: "linear" }}
        />
      </div>
      
      <motion.span 
        className="text-white/40 text-xs tracking-widest font-medium"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ESTABLISHING CONNECTION
      </motion.span>
    </div>
  );
};

export default LoadingScreen;
