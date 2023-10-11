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
    <div className="absolute top-0 transform z-10">
      <motion.div
        // className={`w-[1200px] h-[1200px] rounded-full shadow-inner shadow-lg flex items-center justify-center ${colorClass} bg-opacity-40 transition duration-300 ease-in-out `}
        className={`w-[350px] sm:w-[640px] md:w-[740px] lg:w-[1000px] xl:w-[1200px] h-[350px] sm:h-[640px] md:h-[740px] lg:h-[1000px] xl:h-[1200px] aspect-w-1 aspect-h-1 rounded-full shadow-inner shadow-lg flex items-center justify-center ${colorClass} bg-opacity-40 transition duration-300 ease-in-out`}
        style={{ transformOrigin: 'center center' }}
        // whileHover={{scale: 0.9}}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-10 h-10 fill-red-600 md:w-12 md:h-12 lg:w-16 lg:h-16">
            <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/>
          </svg>      
        </div>
      </motion.div>
    </div>
  );
};

export default IkigaiZoneEdit;
