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
import IkigaiZoneLogo from './ikigaiZoneLogo';



interface IkigaiZoneProps {
  name: string;
  color: 'red' | 'green' | 'blue' | 'yellow';
  handleAddTag: (position: Position) => void; 
  handleAddIkigaiImage: (imageUrl: string, position: Position) => void; 
}

const IkigaiZone: React.FC<IkigaiZoneProps> = ({ name, color, handleAddTag, handleAddIkigaiImage}) => {

  const colorClass = {
    red: 'bg-red-200 hover:bg-red-500',
    green: 'bg-green-200 hover:bg-green-500',
    blue: 'bg-blue-200 hover:bg-blue-500',
    yellow: 'bg-yellow-200 hover:bg-yellow-500'
  }[color];

  const textPositionClass = {
    red: 'top-6',
    green: "right-6",
    blue: 'left-6',
    yellow: "bottom-6"
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
            <motion.div className={`absolute ${textPositionClass} transform rounded-full`} whileHover={{scale: 1.5}}>
              <IkigaiZoneLogo zoneName={name}/>
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
