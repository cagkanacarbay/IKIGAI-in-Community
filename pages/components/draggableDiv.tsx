import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image'; 

// Define prop types for the DraggableDiv component
interface DraggableDivProps {
  imageUrl: string;
  text: string;
}

const DraggableDiv: React.FC<DraggableDivProps> = ({ imageUrl, text }) => {
  return (
    <motion.div 
      drag
      dragMomentum={false}
      dragPropagation
      whileHover={{scale: 1.2}}
      whileDrag={{ scale: 1.3 }}  
      className="w-64 h-64 rounded-2xl flex items-center justify-center z-20" 
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

export default DraggableDiv;
