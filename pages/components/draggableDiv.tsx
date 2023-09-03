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
      whileDrag={{ scale: 1.5 }}  
      className="w-64 h-64 rounded-lg flex items-center justify-center resize overflow-visible" // Added overflow-visible
    >
      <div className="w-9/10 h-9/10 relative rounded-lg overflow-hidden">
        <Image 
          src={imageUrl}  
          alt="Profile Image"
          layout="responsive"
          width={100}  
          height={100}
          className="object-contain rounded-lg pointer-events-none" 
        />
        <span className="absolute bottom-2 left-2 text-white font-bold bg-black bg-opacity-50 px-2 py-1 rounded text-shadow-md">{text}</span> 
      </div>
    </motion.div>
  );
}

export default DraggableDiv;
