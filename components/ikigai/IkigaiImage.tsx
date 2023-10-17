import React from 'react';
import { motion, PanInfo  } from 'framer-motion';
import Image from 'next/image'; 
import debounce from '@/lib/debounce';
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
  setPanningEnabled: (dragging: boolean) => void;
  setHoveredItem: (text: string | null) => void;
  boardDimensions: {width: number, height: number};
}

const IkigaiImage: React.FC<IkigaiImageProps> = ({ imageUrl, text, position, onDragEnd, setPanningEnabled, setHoveredItem, boardDimensions  }) => {

  const handleDragEnd = (_event: MouseEvent, info: PanInfo) => {
    onDragEnd(text, info.point.x, info.point.y);
    setPanningEnabled(true);
    // TODO: get exact center if image rectangle. same as Ikigai tag
  };

  const handleDragStart = (_event: MouseEvent) => {
    setPanningEnabled(false); 
  };

  const xCoordinateInPixel = (position.x / 100) * boardDimensions.width;
  const yCoordinateInPixel = (position.y / 100) * boardDimensions.height;
  const debouncedSetHoveredItem = debounce(setHoveredItem, 200); 
  
  return (
    <ContextMenu>
        <motion.div 
          drag
          dragMomentum={false}
          whileHover={{scale: 1.5}}
          whileDrag={{ scale: 1.2 }}  
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onHoverStart={() => {
            setPanningEnabled(false);
            debouncedSetHoveredItem(text);
          }}          
          onHoverEnd={() => {
            setPanningEnabled(true);
            debouncedSetHoveredItem(null);
          }}          
          className="rounded-2xl flex items-center justify-center z-50 absolute" 
          initial={{
            x: 0,
            y: 0,
            opacity: 0.5
          }}        
          animate= {{ 
            x: xCoordinateInPixel,
            y: yCoordinateInPixel,
            opacity: 1
          }}        >
        {/* <div className="relative"> */}
          <ContextMenuTrigger>
            <Image 
              src={imageUrl}  
              alt={text}
              sizes="
                (max-width: 640px) 6vw,     /* Tailwind's sm breakpoint */
                (min-width: 641px) and (max-width: 768px) 8vw,  /* Between sm and md */
                (min-width: 769px) and (max-width: 1024px) 9vw, /* Between md and lg */
                (min-width: 1025px) and (max-width: 1280px) 10vw, /* Between lg and xl */
                10vw /* Above Tailwind's xl breakpoint */
              "
              style={{
                width: '100%',
                height: 'auto',
              }}
              width={50}  
              height={50}
              priority={true}
              className="object-contain rounded-xl pointer-events-none " 
            />
          </ContextMenuTrigger>
            {/* <span className="absolute bottom-4 left-6 rounded-md text-white bg-gray-900 bg-opacity-70 h-8 px-4 py-1">{text}</span> */}
        {/* </div> */}
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
