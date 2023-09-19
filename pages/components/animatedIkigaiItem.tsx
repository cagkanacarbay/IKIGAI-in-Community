import React from 'react';
import { motion, PanInfo  } from 'framer-motion';
import Image from 'next/image'; 

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};


interface AnimatedIkigaItemProps {
  imageUrl: string;
  text: string;
  onDragEnd: (text: string, x: number, y: number) => void;
  setHoveredItem: (text: string | null) => void;

}

const AnimatedIkigaItem: React.FC<AnimatedIkigaItemProps> = ({ imageUrl, text, onDragEnd, setHoveredItem  }) => {

  const handleDragEnd = (_event: MouseEvent, info: PanInfo) => {
    onDragEnd(text, info.point.x, info.point.y);
  };

  const debouncedSetHoveredItem = debounce(setHoveredItem, 200); 
  
  return (
    <motion.div 
      drag
      dragMomentum={false}
      dragPropagation
      whileHover={{scale: 1.1}}
      whileDrag={{ scale: 1.3 }}  
      onDragEnd={handleDragEnd}
      onHoverStart={() => debouncedSetHoveredItem(text)}
      onHoverEnd={() => debouncedSetHoveredItem(null)}
      className="w-64 h-64 rounded-2xl flex items-center justify-center z-30" 
    >
      <div className="w-9/10 h-9/10 relative overflow-hidden">
        <Image 
          src={imageUrl}  
          alt={text}
          layout="responsive"
          width={100}  
          height={100}
          className="object-contain rounded-3xl pointer-events-none " 
        />
        <span className="absolute bottom-4 left-6 rounded-md text-white bg-gray-900 bg-opacity-70 h-8 px-4 py-1">{text}</span>
      </div>
    </motion.div>
  );
}

export default AnimatedIkigaItem;
