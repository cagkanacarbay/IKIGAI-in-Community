import React from 'react';
import { motion } from 'framer-motion';

interface IkigaiEllipseZoneProps {
  name: string;
  color: 'yellow' | 'cyan' | 'lime' | 'teal';
  textPosition?: string;
}

const IkigaiEllipseZone: React.FC<IkigaiEllipseZoneProps> = ({ name, color, textPosition }) => {
  const colorClass = `bg-${color}-200 hover:bg-${color}-500`;

  return (
    <motion.div
      className={`flex items-center justify-center ${colorClass} bg-opacity-40 hover:bg-opacity-40 transition duration-300 ease-in-out`}
      whileHover={{ scale: 1.1 }}
      style={{
        transformOrigin: 'center center',
        width: '400px',
        height: '750px',
        borderRadius: '80%',
        transform: 'rotate(45deg)'
      }}
    >
      <span className={`absolute ${textPosition} transform text-white font-bold`}>
        {name}
      </span>
    </motion.div>
  );
};

export default IkigaiEllipseZone;
