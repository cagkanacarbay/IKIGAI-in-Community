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
import Icon from '@/components/icons';
import Modal from '@/components/ui/modal';


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
  const [isModalOpen, setModalOpen] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement | null>(null);

  const closeModal = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setModalOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', closeModal);
    return () => {
      document.removeEventListener('mousedown', closeModal);
    };
  }, []);

  const handleViewFull = () => {
    setModalOpen(true);
  };

  const handleAddImage = () => {
    imageUploadInputRef.current?.click();  
  }

  const handleImageReplace = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      // Using current mouse position for new image's position
      handleReplaceIkigaiImage({imageUrl, position: {x: xCoordinateInPixel, y: yCoordinateInPixel}, id: itemId}); 
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
          whileHover={{scale: 1.2}}
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
          className="rounded-2xl flex items-center justify-center z-40 absolute" 
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
                w-9 sm:w-12 md:w-16 lg:w-20 xl:w-24 
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
              <ContextMenuItem onClick={handleViewFull} className="flex justify-between items-center">
                Fullscreen
                <Icon iconName='maximize'/>
              </ContextMenuItem>
              <ContextMenuItem  onClick={handleAddImage} className="flex justify-between items-center">
                Replace
                <Icon iconName='image-replace'/>
              </ContextMenuItem>
              <ContextMenuItem  onClick={handleImageDelete} className="flex justify-between items-center">
                Delete                 
                <Icon iconName='image-delete'/>
              </ContextMenuItem>
        </ContextMenuContent>
        <Input id="picture" type="file" ref={imageUploadInputRef} onChange={handleImageReplace} style={{ display: 'none' }}/>
        {isModalOpen && (
          <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
            <Modal image={imageUrl} onClose={() => setModalOpen(false)} />
          </div>
        )}
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