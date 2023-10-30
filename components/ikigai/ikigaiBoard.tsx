import React, {useState, useCallback, useRef, useEffect} from 'react';
import IkigaiZone from './ikigaiZone';
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";
import IkigaiImage from '@/components/ikigai/ikigaiImage';
import IkigaiTag from '@/components/ikigai/ikigaiTag';
import { ItemCoordinates, Connection, Position, IkigaiItems, IkigaiItem, HandleAddIkigaiImageArgs} from '@/lib/types';
// import IkigaiConnections from '@/components/ikigai/ikigaiConnections';
import { computeBoardPositionFromRects, computeBoardPositionFromPixelPosition } from '@/lib/computePosition';
import debounce from '@/lib/debounce';
import { saveIkigaiBoardItems } from "@/lib/saveBoard"
import Toolbar from './toolbar';

type ZoomUpdateParams = {
  x: number;
  y: number;
  scale: number;
};

interface IkigaiBoardProps {
  // items?: IkigaiItems;
  ikigaiItems: IkigaiItems,
  setIkigaiItems: React.Dispatch<React.SetStateAction<IkigaiItems>>;
};


const IkigaiBoard: React.FC<IkigaiBoardProps> = ({ ikigaiItems, setIkigaiItems }) => {

  const mainContainerRef = useRef<HTMLDivElement | null>(null);
  const ikigaiBoardRef = useRef<HTMLDivElement | null>(null);

  // Hovered Item is used to draw SVG animations between connected items.
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  // const [connections, setConnections] = useState<Connection[]>(initialConnections);

  // const [ikigaiItems, setIkigaiItems] = useState<IkigaiItems>(items);

  // Tracking dimensions of the Ikigai Board so we can place all Ikigai Items exactly right.
  const [boardDimensions, setBoardDimensions] = useState({ width: 0, height: 0 });

  // Panning is disabled when a tag/image is hovered or dragged. 
  // This prevents panning while dragging.
  const [panningEnabled, setPanningEnabled] = useState(false);

  // TODO: Remove all this when we get actual data
  const initialImageCount = Object.values(ikigaiItems).filter(item => item.type === 'image').length;
  const initialTagCount = Object.values(ikigaiItems).filter(item => item.type === 'tag').length;
  const [imageCount, setImageCount] = useState(initialImageCount);
  const [tagCount, setTagCount] = useState(initialTagCount);

  
  const [boardSizeClass, setBoardSizeClass] = useState('w-[100vw] h-[100vw]');

  useEffect(() => {
    // Update the size of the board so it matches the shorter size edge of the viewport
    const updateSize = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      if (vh < vw) {
        setBoardSizeClass('w-[100vh] h-[100vh]');
      } else {
        setBoardSizeClass('w-[100vw] h-[100vw]');
      }
      console.log("updated board size to", boardSizeClass)

    };

    // Initial update
    updateSize();

    // Listen for window resize
    window.addEventListener('resize', updateSize);

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', updateSize);
  }, []);


  const onZoomUpdate = useCallback(({ x, y, scale }: ZoomUpdateParams) => {
    // function for zoomin/out
    const { current: container } = mainContainerRef;
    
    if (container) {
      const value = make3dTransformValue({ x, y, scale });
      container.style.setProperty("transform", value);
    }
  }, []);

  useEffect(() => {
    // We use board dimensions to compute the placement of each item on the IKIGAI board
    const debouncedUpdate = debounce(() => {
      if (ikigaiBoardRef.current) {
        const { width, height } = ikigaiBoardRef.current.getBoundingClientRect();
        setBoardDimensions({ width, height });
      }
    }, 200);  
  
    // Initially set dimensions
    debouncedUpdate();
  
    // Add resize listener
    window.addEventListener('resize', debouncedUpdate);
  
    // Cleanup - remove listener on unmount
    return () => {
      window.removeEventListener('resize', debouncedUpdate);
    };
  }, []); 

  const handleAddIkigaiTag = (position: Position, tagText: string) => {
    if (mainContainerRef.current) {
      const computedPosition = computeBoardPositionFromPixelPosition(position, mainContainerRef);
      const tagId = `Tag ${Date.now()}`;  // TODO: replace with actual IDs from db
      const newTag: IkigaiItem = {
        type: 'tag',
        text: tagText,
        position: computedPosition,
      };
  
      setIkigaiItems({
        ...ikigaiItems,
        [tagId]: newTag,
      });
  
      setTagCount(tagCount + 1);
    }
  };

  const handleAddIkigaiImage = ({
    imageUrl,
    position,
    replacedImageId
  }: HandleAddIkigaiImageArgs) => {
    console.log(position)
      if (mainContainerRef.current) {
      const computedPosition = computeBoardPositionFromPixelPosition(position, mainContainerRef);
      // const imageId = `image ${imageCount}`; // TODO: replace with actual IDs from db
      const imageId = replacedImageId || `image ${Date.now()}`; // Use provided imageId or generate one

      const newImage: IkigaiItem = {
        type: 'image',
        imageUrl: imageUrl,
        position: computedPosition,
      };
  
      setIkigaiItems({
        ...ikigaiItems,
        [imageId]: newImage,
      });

      setImageCount(imageCount + 1);

    }
  };

  const handleItemDragEnd = (itemId: string) => {
    setTimeout(() => {

      setIkigaiItems((prevState) => {

        if (!ikigaiBoardRef.current) {
          return { ...prevState};
        }

        const tagElement = document.getElementById(`ikigai-item-${itemId}`);
        if (!tagElement) {
          return { ...prevState};
        }
        
        const itemRect = tagElement.getBoundingClientRect();
        const ikigaiBoardRect = ikigaiBoardRef.current.getBoundingClientRect();
  
        const positionInPercentage = computeBoardPositionFromRects(itemRect, ikigaiBoardRect);
        const updatedItem = { ...prevState[itemId], position: positionInPercentage };
        
        return { ...prevState, [itemId]: updatedItem };

      });
      // 200ms delay this delay makes sure the position of the item is correct. 
      // otherwise due to dragging and hover we get some crazy positions
    }, 10); 

  };

  const handleDeleteItem = (itemId: string) => {
    if (ikigaiItems[itemId]) {
      const updatedIkigaiItems = { ...ikigaiItems };
      delete updatedIkigaiItems[itemId];
      setIkigaiItems(updatedIkigaiItems)
    }
  }

  const handleSaveBoard = async () => {
      // Saves ikigaiItems in a zip file with a JSON that refers to items prop
      // Images are also saved in the zip to images/...
      const updatedIkigaiItems = JSON.parse(JSON.stringify(ikigaiItems));
      await saveIkigaiBoardItems(updatedIkigaiItems);
  };

  

  return (

    <QuickPinchZoom 
      onUpdate={onZoomUpdate} wheelScaleFactor={500} inertia={false} 
      tapZoomFactor={0.75} doubleTapToggleZoom draggableUnZoomed={false}
      verticalPadding={200} horizontalPadding={200}
      enabled={panningEnabled}  // disable panning so drag/drop images takes priority when zoomed in
      setOffsetsOnce={false}    // refresh image and tag positions when zoomed in
    >
      <div className="flex justify-center items-center h-screen w-screen border-4 border-slate-500" 
            ref={mainContainerRef}>
        <Toolbar handleSaveBoard={handleSaveBoard} />
        
        <div ref={ikigaiBoardRef} className={`relative ${boardSizeClass} max-height-[1200px] max-width-[1200px] border-4 border-slate-900`}>
        {/* if you change xl:h-[1200px] xl:w-[1200px] above you must also change the ikigai zone size so things dont go mad. */}
        

          {Object.entries(ikigaiItems)
            .filter(([itemId, item]) => item.type === 'image')
            .map(([itemId, image], index) => (
              <IkigaiImage
                key={itemId}
                itemId={itemId}
                imageUrl={image.imageUrl!}
                position={image.position}
                onDragEnd={handleItemDragEnd}
                setPanningEnabled={setPanningEnabled}
                setHoveredItem={setHoveredItem}
                boardDimensions={boardDimensions}
                handleReplaceIkigaiImage={handleAddIkigaiImage}
                handleDeleteImage={handleDeleteItem}
              />
            ))}


          {Object.entries(ikigaiItems)
            .filter(([itemId, item]) => item.type === 'tag')
            .map(([itemId, tag], index) => (
              <IkigaiTag
                key={itemId}
                tagItem={tag}
                itemId={itemId}
                position={tag.position}
                onDragEnd={handleItemDragEnd}
                setPanningEnabled={setPanningEnabled}
                setHoveredItem={setHoveredItem}
                containerRef={mainContainerRef}
                boardDimensions={boardDimensions}
                handleDeleteTag={handleDeleteItem}
                ikigaiItems={ikigaiItems}
                setIkigaiItems={setIkigaiItems}
              />
            ))}

          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 hover:z-20">
            <IkigaiZone
              name="What you love"
              color="red"
              handleAddTag={handleAddIkigaiTag} handleAddIkigaiImage={handleAddIkigaiImage}
            />
          </div>
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 hover:z-20">
            <IkigaiZone
              name="What you are good at"
              color="blue"
              handleAddTag={handleAddIkigaiTag} handleAddIkigaiImage={handleAddIkigaiImage}
            />
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 hover:z-20">
            <IkigaiZone
              name="What you can be paid for"
              color="yellow"
              handleAddTag={handleAddIkigaiTag} handleAddIkigaiImage={handleAddIkigaiImage}
            />
          </div>
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 hover:z-20">
            <IkigaiZone
              name="What the world needs"
              color="green"
              handleAddTag={handleAddIkigaiTag} handleAddIkigaiImage={handleAddIkigaiImage}
            />
          </div>
        </div>
        {/* <IkigaiConnections hoveredItem={hoveredItem} connections={connections} itemCoordinates={itemCoordinates} /> */}
        
      </div>

    </QuickPinchZoom>
  );
};

export default IkigaiBoard;