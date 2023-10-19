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
import {HandleAddIkigaiImageArgs} from "@/lib/types"


interface IkigaiZoneProps {
  name: string;
  color: 'red' | 'green' | 'blue' | 'yellow';
  handleAddTag: (position: Position, tagText: string) => void; 
  handleAddIkigaiImage: (args: HandleAddIkigaiImageArgs) => void;
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

  const newTagText = {
    red: 'I love ...',
    green: "The world needs ...",
    blue: 'I am good at ...',
    yellow: "I can be paid for ..."
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      // Using current mouse position for new image's position
      // console.log("sending image to uplaod with pos: ", position)
      handleAddIkigaiImage({imageUrl, position}); 
    }
  };

  return (
    <div onContextMenu={handleContextMenu}>
      <ContextMenu>
        <ContextMenuTrigger>
          <motion.div
            className={
              // at the largest screens we must cap the size of the zones so they dont overflow.
              // zones are capped at 55vw*1200px. 1200 px is the size of ikigai board at xl screens. 
              // if you change xl:h-[660px] xl:w-[660px] you must change the ikigai board size as well
              `w-[55vw] h-[55vw] xl:h-[660px] xl:w-[660px] 
              rounded-full flex items-center justify-center 
              ${colorClass} bg-opacity-40 hover:bg-opacity-20 
              transition duration-300 ease-in-out`}
            style={{ transformOrigin: 'center center' }}
          >
            <motion.div className={`absolute ${textPositionClass} transform rounded-full`} whileHover={{scale: 1.5}}>
              <IkigaiZoneLogo zoneName={name}/>
            </motion.div>
          </motion.div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem inset onClick={() => handleAddTag(position, newTagText)}>
              New Tag 
            </ContextMenuItem>
            <ContextMenuItem inset onClick={handleAddImage}>New Image</ContextMenuItem>
          </ContextMenuContent>
          <Input id="picture" type="file" ref={imageUploadInputRef} onChange={handleImageUpload} style={{ display: 'none' }}/>

        </ContextMenu>
      </div>
  );
};

export default IkigaiZone;
