import React, { useRef, useEffect, useState } from 'react';
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
  onTextChange?: (newText: string) => void; // Added a new prop to handle text change
}

const IkigaiTag: React.FC<IkigaiTagProps> = ({ text, position, onDragEnd, setHoveredItem, onTextChange }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const handleInput = () => {
      if (ref.current && onTextChange) {
        onTextChange(ref.current.innerText);
      }
    };
    ref.current?.addEventListener('input', handleInput);
    return () => ref.current?.removeEventListener('input', handleInput);
  }, [onTextChange]);

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
        whileHover={{ scale: 1.25 }}
        whileDrag={{ scale: 1.5 }}
        onDragEnd={handleDragEnd}
        onHoverStart={() => debouncedSetHoveredItem(text)}
        onHoverEnd={() => debouncedSetHoveredItem(null)}
        className="rounded-2xl flex items-center justify-center z-30 absolute"
        // initial={{x: position.x, y: position.y}}
        onDoubleClick={() => setIsEditable(true)}  // Add this line to enable edit mode on double click
      >
        <ContextMenuTrigger>
          <div
            ref={ref}
            className="absolute rounded-md text-white bg-gray-900 bg-opacity-90 px-4 py-1 text-xs sm:text-sm md:text-base text-center"
            contentEditable={isEditable}  
            onBlur={() => setIsEditable(false)}  // Switch to non-editable mode when focus is lost
          >
            {text}
          </div>
        </ContextMenuTrigger>
      </motion.div>
      <ContextMenuContent>
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
