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
  setHoveredItem: (text: string | null) => void;
  boardDimensions: {width: number, height: number};
}

const IkigaiImage: React.FC<IkigaiImageProps> = ({ imageUrl, text, position, onDragEnd, setHoveredItem, boardDimensions  }) => {

  const handleDragEnd = (_event: MouseEvent, info: PanInfo) => {
    onDragEnd(text, info.point.x, info.point.y);
    // TODO: get exact center if image rectangle. same as Ikigai tag
  };

  const xCoordinateInPixel = (position.x / 100) * boardDimensions.width;
  const yCoordinateInPixel = (position.y / 100) * boardDimensions.height;
  const debouncedSetHoveredItem = debounce(setHoveredItem, 200); 
  
  return (
    <ContextMenu>
        <motion.div 
          drag
          dragMomentum={false}
          whileHover={{scale: 2}}
          whileDrag={{ scale: 1.2 }}  
          onDragEnd={handleDragEnd}
          onHoverStart={() => debouncedSetHoveredItem(text)}
          onHoverEnd={() => debouncedSetHoveredItem(null)}
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
               
                16vw /* Above Tailwind's xl breakpoint */
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
