import React from 'react';
import { motion } from 'framer-motion';

const OverlappedZone: React.FC = () => {
  const colorClass = `hover:bg-purple-500`;

  return (
    <motion.div
      className={`w-[600px] h-[600px] rounded-full flex items-center justify-center ${colorClass} hover:bg-opacity-10 transition duration-300 ease-in-out`}
      whileHover={{ scale: 1.0 }}
      style={{ transformOrigin: 'center center' }}
    >
      <span className={`absolute transform text-white font-bold`}>IKIGAI</span>
    </motion.div>
  );
};

export default OverlappedZone;
