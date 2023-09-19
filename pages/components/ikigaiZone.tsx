import React from 'react';
import { motion } from 'framer-motion';

interface IkigaiZoneProps {
  name: string;
  color: 'red' | 'green' | 'blue' | 'yellow';
  textPosition?: string;
  isClicked: boolean;
  onClick: () => void;
}

const IkigaiZone: React.FC<IkigaiZoneProps> = ({ name, color, textPosition, isClicked, onClick }) => {

  const colorClass = {
    red: 'bg-red-200 hover:bg-red-500',
    green: 'bg-green-200 hover:bg-green-500',
    blue: 'bg-blue-200 hover:bg-blue-500',
    yellow: 'bg-yellow-200 hover:bg-yellow-500'
  }[color];


  return (
    <motion.div
      className={`w-[750px] h-[750px] rounded-full flex items-center justify-center ${colorClass} bg-opacity-40 hover:bg-opacity-20 transition duration-300 ease-in-out `}
      whileHover={{ scale: 1.1 }}
      style={{ transformOrigin: 'center center' }}
      animate={{ scale: isClicked ? 3 : 1 }}
      onClick={onClick}

    >
      <span className={`absolute ${textPosition} transform text-white font-bold`}>
        {name}
      </span>
    </motion.div>
  );
};

export default IkigaiZone;
