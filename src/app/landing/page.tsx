'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleEnterPlaza = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        className="text-center max-w-4xl mx-auto"
      >
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal text-black mb-12 sm:mb-16 lowercase"
          style={{ 
            fontFamily: "'Union Helvetica', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            lineHeight: 0.8
          }}
        >
          PLAZA
        </motion.h1>
        
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ 
            scale: 1.05, 
            backgroundColor: '#000000',
            color: '#ffffff'
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEnterPlaza}
          className="bg-white text-black py-4 sm:py-5 lg:py-6 font-normal text-base sm:text-lg lg:text-xl uppercase tracking-wider border-4 border-black transition-all duration-300 hover:shadow-lg min-h-[56px] flex items-center justify-center mx-auto"
          style={{ 
            fontFamily: "'Union Helvetica', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            width: 'fit-content',
            paddingLeft: '2rem',
            paddingRight: '2rem'
          }}
        >
          ENTER PLAZA
        </motion.button>
      </motion.div>
    </div>
  );
}
