import React, {useState, useEffect} from 'react';
import { motion } from 'framer-motion';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"
import { Position } from '@/lib/types';
import IkigaiZoneIcon from './ikigaiZoneLogo';
import {HandleAddIkigaiImageArgs} from "@/lib/types"
import Icon from '@/components/icons';
import { uploadImageToStorageProvider } from '@/lib/storage';

interface IkigaiZoneProps {
  name: string;
  color: 'red' | 'green' | 'blue' | 'yellow';
  handleAddTag: (position: Position, tagText: string) => void; 
  handleAddIkigaiImage: (args: HandleAddIkigaiImageArgs) => void;
  updateIkigaiImageStorageUrl: (id: string, storageUrl: string) => void; 
}

const IkigaiZone: React.FC<IkigaiZoneProps> = ({ name, color, handleAddTag, handleAddIkigaiImage, updateIkigaiImageStorageUrl}) => {

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

  const [dynamicSizeClass, setDynamicSizeClass] = useState('w-[55vw] h-[55vw]');


  useEffect(() => {
    const updateSize = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      if (vh < vw) {
        setDynamicSizeClass('w-[55vh] h-[55vh]');
      } else {
        setDynamicSizeClass('w-[55vw] h-[55vw]');
      }
      console.log("uodated size to", dynamicSizeClass)

    };

    // Initial update
    updateSize();

    // Listen for window resize
    window.addEventListener('resize', updateSize);

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("in context menu: ", e.clientX, e.clientY )
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleAddImage = () => {
    imageUploadInputRef.current?.click();  
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1048576) {
        alert("File size should not exceed 1MB.");
        return;
      }
  
      // Create a unique ID for the image
      const imageId = `image-${Date.now()}`;
  
      // Save the image as a blob on the client and put the image on the board
      const imageUrl = URL.createObjectURL(file);
      handleAddIkigaiImage({ imageUrl, position, id: imageId });
    
      // Send the image to Vercel Blob
      const uploadedUrl = await uploadImageToStorageProvider(file);
  
      if (uploadedUrl) {
        // Update the storageUrl of the existing image item
        updateIkigaiImageStorageUrl(imageId, uploadedUrl);
      }
    }
  };
  

  // const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     if (file.size > 1048576) {
  //       alert("File size should not exceed 1MB.");
  //       return;
  //     }
  //     // save the image as a blob on the client and put the image on the board
  //     const imageUrl = URL.createObjectURL(file);
  //     handleAddIkigaiImage({ imageUrl, position });
  
  //     // send the image to vercel blob
  //     const uploadedUrl = await uploadImageToStorageProvider(file);
  //     console.log("got the uploaded url", uploadedUrl)
  
  //     if (uploadedUrl) {
  //       // Use the returned URL for the uploaded image
  //       handleAddIkigaiImage({ imageUrl: uploadedUrl, position });
  //     }

  //   }
  // };
  


  return (
    <div onContextMenu={handleContextMenu}>
      <ContextMenu>
        <ContextMenuTrigger>
          <motion.div
            className={
              // at the largest screens we must cap the size of the zones so they dont overflow.
              // zones are capped at 55vw*1200px. 1200 px is the size of ikigai board at xl screens. 
              // if you change xl:h-[660px] xl:w-[660px] you must change the ikigai board size as well
              // `${dynamicSizeClass} xl:h-[660px] xl:w-[660px] 
              `${dynamicSizeClass} max-height-[660px] max-width-[660px]
              rounded-full flex items-center justify-center 
              ${colorClass} bg-opacity-40 hover:bg-opacity-20 
              transition duration-300 ease-in-out`}
            style={{ transformOrigin: 'center center' }}
          >
            <motion.div className={`absolute ${textPositionClass} transform rounded-full`} whileHover={{scale: 1.5}}>
              <IkigaiZoneIcon zoneName={name}/>
            </motion.div>
          </motion.div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => handleAddTag(position, newTagText)} className="flex justify-between items-center">
              New Tag 
              <Icon iconName='tag'/>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleAddImage} className="flex justify-between items-center">
              New Image
              <Icon iconName='image'/>
            </ContextMenuItem>
          </ContextMenuContent>
          <Input id="picture" type="file" ref={imageUploadInputRef} onChange={handleImageUpload} style={{ display: 'none' }}/>

        </ContextMenu>
      </div>
  );
};

export default IkigaiZone;
