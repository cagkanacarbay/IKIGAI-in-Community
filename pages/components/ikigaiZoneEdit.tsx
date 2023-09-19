import React from 'react';
import { motion } from 'framer-motion';

interface IkigaiZoneEditProps {
  name: string;
  color: 'red' | 'green' | 'blue' | 'yellow';
  textPosition?: string;

}

const IkigaiZoneEdit: React.FC<IkigaiZoneEditProps> = ({ name, color, textPosition }) => {

  const colorClass = {
    red: 'bg-red-200',
    green: 'bg-green-200',
    blue: 'bg-blue-200',
    yellow: 'bg-yellow-200'
  }[color];


  return (
    <motion.div
      className={`w-[1200px] h-[1200px] rounded-full flex items-center justify-center ${colorClass} bg-opacity-40 transition duration-300 ease-in-out `}
      style={{ transformOrigin: 'center center' }}
      // whileHover={{scale: 0.9}}
    >
      <span className={`absolute ${textPosition} transform text-white font-bold`}>
        {name}
      </span>
    </motion.div>
  );
};

export default IkigaiZoneEdit;
