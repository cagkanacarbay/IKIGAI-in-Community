import React from 'react';
import { motion } from 'framer-motion';

interface IkigaiZoneProps {
  name: string;
  color: 'red' | 'green' | 'blue' | 'yellow';
  textPosition?: string;
}

const IkigaiZone: React.FC<IkigaiZoneProps> = ({ name, color, textPosition }) => {
  const colorClass = `bg-${color}-200 hover:bg-${color}-500`;

  return (
    <motion.div
      className={`w-[800px] h-[800px] rounded-full flex items-center justify-center ${colorClass} bg-opacity-40 hover:bg-opacity-40 transition duration-300 ease-in-out `}
      whileHover={{ scale: 1.1 }}
      style={{ transformOrigin: 'center center' }}
    >
      <span className={`absolute ${textPosition} transform text-white font-bold`}>
        {name}
      </span>
    </motion.div>
  );
};

export default IkigaiZone;
