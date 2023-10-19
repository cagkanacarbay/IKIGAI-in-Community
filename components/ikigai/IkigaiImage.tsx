/* eslint-disable @next/next/no-img-element */
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
import {HandleAddIkigaiImageArgs} from "@/lib/types"
import { Input } from "@/components/ui/input"


interface IkigaiImageProps {
  imageUrl: string;
  itemId: string;
  position: Position;
  onDragEnd: (text: string) => void;
  setPanningEnabled: (dragging: boolean) => void;
  setHoveredItem: (text: string | null) => void;
  boardDimensions: {width: number, height: number};
  handleReplaceIkigaiImage: (args: HandleAddIkigaiImageArgs) => void;
  handleDeleteImage: (itemId: string) => void;
}

const IkigaiImage: React.FC<IkigaiImageProps> = ({ 
    imageUrl, itemId, position, onDragEnd, 
    setPanningEnabled, setHoveredItem, boardDimensions, 
    handleReplaceIkigaiImage, handleDeleteImage  
  }) => {

  const imageUploadInputRef = React.useRef<HTMLInputElement>(null); 

  const handleAddImage = () => {
    imageUploadInputRef.current?.click();  
  }

  const handleImageReplace = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      // Using current mouse position for new image's position
      handleReplaceIkigaiImage({imageUrl, position: {x: xCoordinateInPixel, y: yCoordinateInPixel}, replacedImageId: itemId}); 
    }
  };
  
  const handleImageDelete = (_event: React.MouseEvent<HTMLDivElement>) => {
      handleDeleteImage(itemId);
  };

  const xCoordinateInPixel = (position.x / 100) * boardDimensions.width;
  const yCoordinateInPixel = (position.y / 100) * boardDimensions.height;
  const debouncedSetHoveredItem = debounce(setHoveredItem, 200); 
  
  return (
    <ContextMenu>
        <motion.div 
          id={`ikigai-item-${itemId}`}
          drag
          dragMomentum={false}
          whileHover={{scale: 1.1}}
          // whileDrag={{ scale: 1.2 }}  
          onDragStart={() =>{
            setPanningEnabled(false);
          }}
          onDragEnd={() => {
            onDragEnd(itemId);
            setPanningEnabled(true);
          }}
          onHoverStart={() => {
            setPanningEnabled(false);
            debouncedSetHoveredItem(itemId);
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
           <img 
              src={imageUrl}  
              alt=""
              style={{
                // width: '100%',
                height: 'auto',
              }}
              className="
                object-contain pointer-events-none
                rounded-sm md:rounded-md xl:rounded-xl 
                w-7 sm:w-12 md:w-16 lg:w-24 xl:w-28 
              " 
            />
          </ContextMenuTrigger>
            {/* <span className="absolute bottom-4 left-6 rounded-md text-white bg-gray-900 bg-opacity-70 h-8 px-4 py-1">{text}</span> */}
        {/* </div> */}
        </motion.div>
        <ContextMenuContent>
              {/* <ContextMenuItem inset>
                Rescale (TODO)
              </ContextMenuItem> */}
              <ContextMenuItem inset onClick={handleAddImage}>
                Replace
              </ContextMenuItem>
              {/* <ContextMenuItem inset >
                Connect (TODO)
              </ContextMenuItem> */}
              <ContextMenuItem inset onClick={handleImageDelete}>
                Delete
              </ContextMenuItem>
        </ContextMenuContent>
        <Input id="picture" type="file" ref={imageUploadInputRef} onChange={handleImageReplace} style={{ display: 'none' }}/>

      </ContextMenu>
  );
}

export default IkigaiImage;


// <Image 
//  src={imageUrl}  
//  alt=""
//  sizes="
//    // these work only with an srcset. which would work fine with nextjs images but not blobs.
//    (max-width: 640px) 6vw,     /* Tailwind's sm breakpoint */
//    (min-width: 641px) and (max-width: 768px) 8vw,  /* Between sm and md */
//    (min-width: 769px) and (max-width: 1024px) 9vw, /* Between md and lg */
//    (min-width: 1025px) and (max-width: 1280px) 10vw, /* Between lg and xl */
//    120px /* Max size */
//    "
//  style={{
//    width: '100%',
//    height: 'auto',
//  }}
//  width={100}  
//  height={100}
//  priority={true}
//  className="object-contain rounded-xl pointer-events-none " 
///>