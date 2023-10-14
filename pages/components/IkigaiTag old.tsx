import React from 'react';
import { motion, PanInfo  } from 'framer-motion';
import debounce from '../../lib/debounce';


interface IkigaiTagProps {
  text: string;
  onDragEnd: (text: string, x: number, y: number) => void;
  setHoveredItem: (text: string | null) => void;

}

const IkigaiTag: React.FC<IkigaiTagProps> = ({ text, onDragEnd, setHoveredItem  }) => {

  const handleDragEnd = (_event: MouseEvent, info: PanInfo) => {
    onDragEnd(text, info.point.x, info.point.y);
  };

  const debouncedSetHoveredItem = debounce(setHoveredItem, 200); 
  
  return (
    <motion.div 
      drag
      dragMomentum={false}
      dragPropagation
      whileHover={{scale: 1.25}}
      whileDrag={{ scale: 1.5 }}  
      onDragEnd={handleDragEnd}
      onHoverStart={() => debouncedSetHoveredItem(text)}
      onHoverEnd={() => debouncedSetHoveredItem(null)}
      className="rounded-2xl flex items-center justify-center z-30" 
    >
      <span className="absolute rounded-md text-white bg-gray-900 bg-opacity-90 px-4 py-1 text-xs sm:text-sm md:text-base text-center">{text}</span>
    </motion.div>
  );
}

export default IkigaiTag;

