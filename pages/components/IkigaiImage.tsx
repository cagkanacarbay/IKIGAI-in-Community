import React from 'react';
import { motion, PanInfo  } from 'framer-motion';
import Image from 'next/image'; 
import debounce from '../utils/debounce';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Position } from '@/lib/types';


interface IkigaiImageProps {
  imageUrl: string;
  text: string;
  position: Position;
  onDragEnd: (text: string, x: number, y: number) => void;
  setHoveredItem: (text: string | null) => void;

}

const IkigaiImage: React.FC<IkigaiImageProps> = ({ imageUrl, text, position, onDragEnd, setHoveredItem  }) => {

  const handleDragEnd = (_event: MouseEvent, info: PanInfo) => {
    console.log(info)
    onDragEnd(text, info.point.x, info.point.y);
  };

  const debouncedSetHoveredItem = debounce(setHoveredItem, 200); 
  
  return (
    <ContextMenu>
        <motion.div 
          drag
          dragMomentum={false}
          dragPropagation
          whileHover={{scale: 1.25}}
          whileDrag={{ scale: 1.5 }}  
          onDragEnd={handleDragEnd}
          onHoverStart={() => debouncedSetHoveredItem(text)}
          onHoverEnd={() => debouncedSetHoveredItem(null)}
          className="w-40 h-40 rounded-2xl flex items-center justify-center z-50 absolute" 
          initial={{x: position.x, y: position.y}}
        >
          <div className="relative">
          <ContextMenuTrigger>
            <Image 
              src={imageUrl}  
              alt={text}
              layout="responsive"
              width={100}  
              height={100}
              className="object-contain rounded-xl pointer-events-none " 
            />
          </ContextMenuTrigger>
            {/* <span className="absolute bottom-4 left-6 rounded-md text-white bg-gray-900 bg-opacity-70 h-8 px-4 py-1">{text}</span> */}
          </div>
        </motion.div>
        <ContextMenuContent>
              <ContextMenuItem inset>
                Rescale (TODO)
              </ContextMenuItem>
              <ContextMenuItem inset>
                Replace (TODO)
              </ContextMenuItem>
              <ContextMenuItem inset >
                Connect (TODO)
              </ContextMenuItem>
              <ContextMenuItem inset >
                Delete (TODO)
              </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
  );
}

export default IkigaiImage;
