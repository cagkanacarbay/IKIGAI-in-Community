import React, {useState} from 'react';
import { motion } from 'framer-motion';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"
import { Position } from '@/lib/types';


interface IkigaiZoneProps {
  name: string;
  color: 'red' | 'green' | 'blue' | 'yellow';
  textPosition?: string;
  handleAddTag: (position: Position) => void; 
  handleAddIkigaiImage: (imageUrl: string, position: Position) => void; 
}

const IkigaiZone: React.FC<IkigaiZoneProps> = ({ name, color, textPosition, handleAddTag, handleAddIkigaiImage}) => {

  const colorClass = {
    red: 'bg-red-200 hover:bg-red-500',
    green: 'bg-green-200 hover:bg-green-500',
    blue: 'bg-blue-200 hover:bg-blue-500',
    yellow: 'bg-yellow-200 hover:bg-yellow-500'
  }[color];

  const [position, setPosition] = useState<Position>({x: 0, y: 0});
  const imageUploadInputRef = React.useRef<HTMLInputElement>(null); 

  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("in context menu: ", e.clientX, e.clientY )
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleAddImage = () => {
    imageUploadInputRef.current?.click();  
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      // Using current mouse position for new image's position
      handleAddIkigaiImage(imageUrl, position); 
    }
  };

  return (
    <div onContextMenu={handleContextMenu}>
      <ContextMenu>
        <ContextMenuTrigger>
          <motion.div
            className={`w-[55vw] h-[55vw] rounded-full flex items-center justify-center ${colorClass} bg-opacity-40 hover:bg-opacity-20 transition duration-300 ease-in-out `}
            // whileHover={{ scale: 1.1 }}
            style={{ transformOrigin: 'center center' }}
          >
            {/* <span className={`absolute ${textPosition} transform text-white font-bold`}>
              {name}
            </span> */}
            <motion.div className={`absolute ${textPosition} transform rounded-full`} whileHover={{scale: 1.5}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="z-30 w-10 h-10 fill-red-600 md:w-12 md:h-12 lg:w-16 lg:h-16 p-2">
                  <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/>
                </svg>
            </motion.div>
          </motion.div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem inset onClick={() => handleAddTag(position)}>
              New Tag 
            </ContextMenuItem>
            <ContextMenuItem inset onClick={handleAddImage}>New Image</ContextMenuItem>
          </ContextMenuContent>
          <Input id="picture" type="file" ref={imageUploadInputRef} onChange={handleImageChange} style={{ display: 'none' }}/>

        </ContextMenu>
      </div>
  );
};

export default IkigaiZone;
