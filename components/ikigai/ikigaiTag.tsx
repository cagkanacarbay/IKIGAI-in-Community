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
import { IkigaiItems, IkigaiItem } from '@/lib/types';

interface IkigaiTagProps {
  itemId: string;
  tagItem: IkigaiItem;
  position: Position;
  onDragEnd: (text: string) => void;
  setPanningEnabled: (dragging: boolean) => void;
  setHoveredItem: (text: string | null) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  boardDimensions: {width: number, height: number};
  handleDeleteTag: (itemId: string) => void;
  ikigaiItems: IkigaiItems;
  setIkigaiItems: (items: IkigaiItems) => void;
}

const IkigaiTag: React.FC<IkigaiTagProps> = ({ 
    itemId, tagItem, position, onDragEnd, setPanningEnabled, setHoveredItem, 
    containerRef, boardDimensions, handleDeleteTag, ikigaiItems, setIkigaiItems }
  ) => {

  const inputRef = useRef<HTMLInputElement>(null);
  const tagDivRef = useRef<HTMLDivElement>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [editableText, setEditableText] = useState<string>(tagItem.text || "");

  useEffect(() => {
    if (isEditable) {
      inputRef.current?.focus();
    }
  }, [isEditable]);

  // const handleTagDelete()

  const handleDragEnd = (_event: MouseEvent | PointerEvent | TouchEvent, _info: PanInfo) => {
    console.log(_event);

    onDragEnd(itemId);
    setPanningEnabled(true);
  };

  const handleEnterTagText = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditable(false);

      const inputValue = e.target as HTMLInputElement;
      if (itemId in ikigaiItems) {
        const updatedItems = {
          ...ikigaiItems,
          [itemId]: {
            ...ikigaiItems[itemId],
            text: inputValue.value
          }
        };
        setIkigaiItems(updatedItems);
      }
    }
  };

  const enterEditMode = () => {
    setIsEditable(true);
    setEditableText(editableText);
    setTimeout(() => {
      inputRef.current?.focus(); // Set focus after a brief delay to ensure the input is rendered
    }, 250);
  };

  const handleHoverStart = useCallback(() => {
    setHoveredItemDebounced.current(editableText);
  }, [editableText]);
  

  const xCoordinateInPixel = (position.x / 100) * boardDimensions.width;
  const yCoordinateInPixel = (position.y / 100) * boardDimensions.height;

  const setHoveredItemDebounced = useRef(debounce(setHoveredItem, 200));

  return (
    <ContextMenu>
      <motion.div
        id={`ikigai-item-${itemId}`}
        drag
        dragMomentum={false}
        whileHover={{ scale: 1.1 }}
        // whileDrag={{ scale: 1.5 }}
        onDragStart={() => setPanningEnabled(false)}
        onDragEnd={(event, info) => {
            handleDragEnd(event, info);
            setPanningEnabled(true);
        }}
        onHoverStart={() => {
            handleHoverStart();
            setPanningEnabled(false);
        }}
        onHoverEnd={() => {
            setHoveredItemDebounced.current(null);
            setPanningEnabled(true);
        }}
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
              className="absolute rounded-md text-white bg-gray-600 px-4 py-1 text-xs sm:text-sm text-center border-2 border-slate-100 "
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              onBlur={(e) => {
                setIsEditable(false);
              }}
              onKeyUp={handleEnterTagText}
            />
          ) : (
            <div
              ref={inputRef}
              className="absolute rounded-md text-white bg-gray-900 bg-opacity-90 px-4 py-1 text-xs sm:text-sm text-center"
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
        <ContextMenuItem inset onClick={() => handleDeleteTag(itemId)}>
          Delete 
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>

  );
};


export default IkigaiTag;





