import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, PanInfo } from 'framer-motion';
import debounce from '@/lib/debounce';
import { Position } from '@/lib/types';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

interface IkigaiTagProps {
  text: string;
  position: Position;
  onDragEnd: (text: string, x: number, y: number) => void;
  setHoveredItem: (text: string | null) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  boardDimensions: {width: number, height: number};
}

const IkigaiTag: React.FC<IkigaiTagProps> = ({ text, position, onDragEnd, setHoveredItem, containerRef, boardDimensions }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const tagDivRef = useRef<HTMLDivElement>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [editableText, setEditableText] = useState<string>(text);

  useEffect(() => {
    if (isEditable) {
      inputRef.current?.focus();
    }
  }, [isEditable]);

  const handleDragEnd = (_event: MouseEvent, info: PanInfo) => {
    onDragEnd(text, info.point.x, info.point.y);

    // TODO: Get EXACT CENTER OF rectangle. 
    // const container = containerRef.current;
    // const tagDiv = tagDivRef.current;
  
    // if (container && tagDiv) {
    //   // Calculate position as a percentage of the parent container's dimensions
    //   const containerRect = container.getBoundingClientRect();
    //   const rect = tagDiv.getBoundingClientRect();
    //   const xPercentage = ((rect.left + rect.width / 2) / containerRect.width) * 100;
    //   const yPercentage = ((rect.top + rect.height / 2) / containerRect.height) * 100;
    //   console.log(rect)
    //   console.log(text, xPercentage, yPercentage);
    //   onDragEnd(text, xPercentage, yPercentage);
    // }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditable(false);
    }
    // if (e.key === 'Escape') {
    //   e.preventDefault();
    //   setIsEditable(false);
  };

  const enterEditMode = () => {
    setIsEditable(true);
    setEditableText(editableText);
    setTimeout(() => {
      inputRef.current?.focus(); // Set focus after a brief delay to ensure the input is rendered
    }, 100);
  };

  const handleHoverStart = useCallback(() => {
    setHoveredItemDebounced.current(editableText);
  }, [editableText]);
  
  const handleHoverEnd = useCallback(() => {
    setHoveredItemDebounced.current(null);
  }, []);

  const xCoordinateInPixel = (position.x / 100) * boardDimensions.width;
  const yCoordinateInPixel = (position.y / 100) * boardDimensions.height;

  const setHoveredItemDebounced = useRef(debounce(setHoveredItem, 200));
  console.log(text, xCoordinateInPixel, yCoordinateInPixel, boardDimensions);


  return (
    <ContextMenu>
      <motion.div
        drag
        dragMomentum={false}
        whileHover={{ scale: 1.25 }}
        whileDrag={{ scale: 1.5 }}
        onDragEnd={handleDragEnd}
        onHoverStart={() => handleHoverStart()}
        onHoverEnd={() => handleHoverEnd()}
        className="rounded-2xl flex items-center justify-center z-30 absolute"
        initial={{
          x: 0,
          y: 0,
          opacity: 0.5
        }}        
        animate= {{ 
          x: xCoordinateInPixel,
          y: yCoordinateInPixel,
          opacity: 1
        }}
        ref={tagDivRef}
        // transition={{ delay: 0.5, duration: 2}}
      >
    <ContextMenuTrigger>
          {isEditable ? (
            <input
              ref={inputRef}
              className="absolute rounded-md text-white bg-gray-600 px-4 py-1 text-xs sm:text-sm md:text-base text-center border-2 border-slate-100 "
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              onBlur={(e) => {
                setIsEditable(false);
              }}
              onKeyUp={handleKeyPress}
            />
          ) : (
            <div
              ref={inputRef}
              className="absolute rounded-md text-white bg-gray-900 bg-opacity-90 px-4 py-1 text-xs sm:text-sm md:text-base text-center"
            >
              {editableText}
            </div>
          )}
        </ContextMenuTrigger>
      </motion.div>
      <ContextMenuContent>
        <ContextMenuItem inset onClick={() => enterEditMode()}>
          Edit 
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
};

export default IkigaiTag;




