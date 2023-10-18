import React, {useState, useCallback, useRef, useEffect} from 'react';
import IkigaiZone from './IkigaiZone';
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";
import IkigaiImage from '@/components/ikigai/ikigaiImage';
// import IkigaiTag from '@/components/ikigai/IkigaiTag';
import IkigaiTag from '@/components/ikigai/ikigaiTag';
import { ItemCoordinates, Connection, Position, IkigaiItems, IkigaiItem} from '@/lib/types';
import IkigaiConnections from '@/components/ikigai/ikigaiConnections';
import { initialImages, initialTags, initialConnections, initialItems } from '@/lib/dummyData';
import { computeBoardPosition, getItemPositions } from '@/lib/computePosition';
import debounce from '@/lib/debounce';


type ZoomUpdateParams = {
  x: number;
  y: number;
  scale: number;
};


const IkigaiBoard: React.FC = () => {

  const mainContainerRef = useRef<HTMLDivElement | null>(null);
  const ikigaiBoardRef = useRef<HTMLDivElement | null>(null);

  // Hovered Item is used to draw SVG animations between connected items.
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  // const [connections, setConnections] = useState<Connection[]>(initialConnections);

  // All images and tags are initialized with the dummy data. TODO: initialize from database entries later.
  const [ikigaiItems, setIkigaiItems] = useState<IkigaiItems>(initialItems);
  // Each motion div is reffed to compute their locations. 


  // Define the type for ikigaiItemRefs
  const ikigaiItemRefs = useRef<{ [itemId: string]: React.RefObject<HTMLDivElement> }>({});

  const tagRef = useRef(null);


  useEffect(() => {
    // initialize item refs at mount
    Object.keys(initialItems).forEach((itemId) => {
      ikigaiItemRefs.current[itemId] = React.createRef();
    });
    console.log("created item refs:", ikigaiItemRefs)
  }, [initialItems]);



  const [ikigaiImages, setIkigaiImages] = useState(initialImages);
  const [ikigaiTags, setIkigaiTags] = useState(initialTags);
  const [itemCoordinates, setItemCoordinates] = useState<ItemCoordinates>(
    Object.fromEntries([
      ...initialImages.map((image) => [image.text, image.position]),
      ...initialTags.map((tag) => [tag.tag, tag.position]),
    ])
  );  

  // Tracking dimensions of the Ikigai Board so we can place all Ikigai Items exactly right.
  const [boardDimensions, setBoardDimensions] = useState({ width: 0, height: 0 });

  // Panning is disabled when a tag/image is hovered or dragged. 
  // This prevents panning while dragging.
  const [panningEnabled, setPanningEnabled] = useState(false);

  // TODO: Remove all this when we get actual data
  const initialImageCount = Object.values(initialItems).filter(item => item.type === 'image').length;
  const initialTagCount = Object.values(initialItems).filter(item => item.type === 'tag').length;
  const [imageCount, setImageCount] = useState(initialImageCount);
  const [tagCount, setTagCount] = useState(initialTagCount);

  // Helper mousePos. TODO: remove whenever
  const [mousePos, setMousePos] = useState<{ x: number, y: number }>({x: 0, y:0});


  const onUpdate = useCallback(({ x, y, scale }: ZoomUpdateParams) => {
    // function for zoomin/out
    const { current: container } = mainContainerRef;
    
    if (container) {
      const value = make3dTransformValue({ x, y, scale });
      container.style.setProperty("transform", value);
    }
  }, []);


  useEffect(() => {
    // Helper to get mouse position
    const handleMouseMove = (event: MouseEvent) => {
      if (mainContainerRef.current) {
        const rect = mainContainerRef.current.getBoundingClientRect();
        const centeredX = event.clientX - (rect.left + rect.width / 2);
        const centeredY = event.clientY - (rect.top + rect.height / 2);
        setMousePos({ x: centeredX, y: centeredY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );
    };
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

  const handleAddTag = (position: Position, tagText: string) => {
    if (mainContainerRef.current) {
      const computedPosition = computeBoardPosition(position, mainContainerRef);
      const tagId = `Tag ${tagCount}`;  // TODO: replace with actual IDs from db
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

  const handleAddIkigaiImage = (imageUrl: string, position: Position) => {
    if (mainContainerRef.current) {
      const computedPosition = computeBoardPosition(position, mainContainerRef);
      const imageId = `image ${imageCount}`; // TODO: replace with actual IDs from db
      const newImage: IkigaiItem = {
        type: 'image',
        imageUrl: imageUrl,
        position: computedPosition,
      };
  
      setIkigaiItems({
        ...ikigaiItems,
        [imageId]: newImage,
      });
    }
  };



  useEffect(() => {
    console.log('Parent component rendered');
  }, []);

  const handleItemDragEnd = (itemKey: string, position: Position) => {
    setIkigaiItems((prevState) => {
      const positionInPercentage = computeBoardPosition(position, mainContainerRef);
      const updatedItem = { ...prevState[itemKey], position: positionInPercentage };
      console.log("updating the item", updatedItem)
      // console.log(ikigaiItems)
      return { ...prevState};
      // return { ...prevState, [itemKey]: updatedItem };

    });
  };


 


  return (

    <QuickPinchZoom 
      onUpdate={onUpdate} wheelScaleFactor={500} inertia={false} 
      tapZoomFactor={0.75} doubleTapToggleZoom draggableUnZoomed={false}
      verticalPadding={200} horizontalPadding={200}
      enabled={panningEnabled}  // disable panning so drag/drop images takes priority when zoomed in
      setOffsetsOnce={false}    // refresh image and tag positions when zoomed in
    >
      <div className="flex justify-center items-center h-screen w-screen border-4 border-slate-500" 
            ref={mainContainerRef}>
        <div className='absolute top-0'>
            The mouse is at position{' '}
            <b>
              ({mousePos.x}, {mousePos.y})
            </b>
          </div>

        <button onClick={() => {
          console.log(ikigaiItemRefs.current)
          const positions = getItemPositions(ikigaiItemRefs.current, mainContainerRef);
          console.log(positions);
        }}>
          Get Positions
        </button>


        <div className="relative w-[100vw] h-[100vw] xl:h-[1200px] xl:w-[1200px] border-4 border-slate-900" ref={ikigaiBoardRef}>
          {/* if you change xl:h-[1200px] xl:w-[1200px] above you must also change the ikigai zone size so things dont go mad. */}

          {Object.entries(ikigaiItems)
            .filter(([itemId, item]) => item.type === 'image')
            .map(([itemId, image], index) => (
              <IkigaiImage
                key={index}
                itemId={itemId}
                imageUrl={image.imageUrl!}
                position={image.position}
                onDragEnd={handleItemDragEnd}
                setPanningEnabled={setPanningEnabled}
                setHoveredItem={setHoveredItem}
                boardDimensions={boardDimensions}
              />
            ))}


          {Object.entries(ikigaiItems)
            .filter(([itemId, item]) => item.type === 'tag')
            .map(([itemId, tag], index) => (
              <IkigaiTag
                key={index}
                text={itemId}
                position={tag.position}
                onDragEnd={handleItemDragEnd}
                setPanningEnabled={setPanningEnabled}
                setHoveredItem={setHoveredItem}
                containerRef={mainContainerRef}
                ref={ikigaiItemRefs.current[itemId]}  
                // ref={tagRef}
                boardDimensions={boardDimensions}
              />
            ))}

          {/* {ikigaiImages.map((image, index) => (
            <IkigaiImage
              key={index}
              imageUrl={image.imageUrl}
              text={image.text}
              position={image.position}
              onDragEnd={handleItemDragEnd}
              setPanningEnabled={setPanningEnabled}
              setHoveredItem={setHoveredItem}
              boardDimensions={boardDimensions}
            />
          ))}
          {ikigaiTags.map((tag, index) => (
            <IkigaiTag
              key={index}
              text={tag.tag}
              position={tag.position}
              onDragEnd={handleItemDragEnd}
              setPanningEnabled={setPanningEnabled}
              setHoveredItem={setHoveredItem}
              containerRef={ikigaiBoardRef}
              boardDimensions={boardDimensions}
            />
          ))} */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 hover:z-20">
            <IkigaiZone
              name="What you love"
              color="red"
              handleAddTag={handleAddTag} handleAddIkigaiImage={handleAddIkigaiImage}
            />
          </div>
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 hover:z-20">
            <IkigaiZone
              name="What you are good at"
              color="blue"
              handleAddTag={handleAddTag} handleAddIkigaiImage={handleAddIkigaiImage}
            />
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 hover:z-20">
            <IkigaiZone
              name="What you can be paid for"
              color="yellow"
              handleAddTag={handleAddTag} handleAddIkigaiImage={handleAddIkigaiImage}
            />
          </div>
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 hover:z-20">
            <IkigaiZone
              name="What the world needs"
              color="green"
              handleAddTag={handleAddTag} handleAddIkigaiImage={handleAddIkigaiImage}
            />
          </div>
        </div>
        {/* <IkigaiConnections hoveredItem={hoveredItem} connections={connections} itemCoordinates={itemCoordinates} /> */}
        
      </div>

    </QuickPinchZoom>
  );
};

export default IkigaiBoard;

 // const handleAddTag = (position: Position) => {
  //   if (mainContainerRef.current) {
  //     const computedPosition = computeBoardPosition(position, mainContainerRef);

  //     const newTag = {
  //       tag: `New Tag ${newTagCounter}`,
  //       position: computedPosition
  //     };

  //     setIkigaiTags([...ikigaiTags, newTag]);
  //     setItemCoordinates({
  //       ...itemCoordinates,
  //       [newTag.tag]: computedPosition,
  //     });

  //     setNewTagCounter(newTagCounter+1);

  //   }
  // };

  // const handleAddIkigaiImage = (imageUrl: string, position: Position) => {
  //   if (mainContainerRef.current) {
  //     const computedPosition = computeBoardPosition(position, mainContainerRef);

  //     const newImage = {
  //       imageUrl: imageUrl,
  //       text: "new image", 
  //       position: computedPosition,
  //     };
    
  //     setIkigaiImages(prevImages => [...prevImages, newImage]);
  //     setItemCoordinates({
  //       ...itemCoordinates,
  //       [newImage.text]: computedPosition,
  //     });
  //   }
  // };
  
  // const handleItemDragEnd = (text: string, x: number, y: number) => {
  //   setItemCoordinates((prevState) => ({
  //     ...prevState,
  //     [text]: { x, y },
  //   }));
  // }; 

  // const addConnection = (image: string, tag: string) => {
  //   setConnections([...connections, { image, tag }]);
  // };