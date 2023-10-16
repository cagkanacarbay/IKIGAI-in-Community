import React, {useState, useCallback, useRef, useEffect} from 'react';
import IkigaiZone from './IkigaiZone';
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";
import IkigaiImage from '@/components/ikigai/ikigaiImage';
// import IkigaiTag from '@/components/ikigai/IkigaiTag';
import IkigaiTag from '@/components/ikigai/ikigaiTag';
import { ItemCoordinates, Connection, Position} from '@/lib/types';
import IkigaiConnections from '@/components/ikigai/ikigaiConnections';


const initialImages = [
  { imageUrl: "/images/dummy/eu4.jpg", text: "eu4", position: { x: -0, y: -0 }},
  // { imageUrl: "/images/dummy/neptunespride.png", text: "neptunespride", position: { x: -200, y: 50 } },
  // { imageUrl: "/images/dummy/extremeownership.jpg", text: "extreme-ownership", position: { x: -120, y: -250 } },
  // { imageUrl: "/images/dummy/ada symbol opaque.png", text: "Cardano", position: { x: -250, y: 300 } },
  // { imageUrl: "/images/dummy/warpeacewar.jpg", text: "war-peace-war", position: { x: 300, y: 300 } },
  // { imageUrl: "/images/dummy/keynes.jpg", text: "keynes", position: { x: 0, y: -250 } },
];

const initialTags = [
  { tag: "economics", position: {x: 0, y: 0 }},
  { tag: "history", position: {x: 50, y: 15 }},
  { tag: "stoicism", position: {x: 25, y: 25 }},
  { tag: "strategy games", position: {x: 50, y: 100 }},
];

const IkigaiBoard: React.FC = () => {
  const mainContainerRef = useRef<HTMLDivElement | null>(null);
  const itemContainerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [ikigaiImages, setIkigaiImages] = useState(initialImages);
  const [ikigaiTags, setIkigaiTags] = useState(initialTags);
  const [itemCoordinates, setItemCoordinates] = useState<ItemCoordinates>(
    Object.fromEntries([
      ...initialImages.map((image) => [image.text, image.position]),
      ...initialTags.map((tag) => [tag.tag, tag.position]),
    ])
  );  
  const [connections, setConnections] = useState<Connection[]>([
    { image: 'extreme-ownership', tag: 'stoicism' },
    { image: 'eu4', tag: 'strategy games' },
    { image: 'neptunespride', tag: 'strategy games' },
    { image: 'Cardano', tag: 'economics' },
    { image: 'keynes', tag: 'economics' },
    { image: 'keynes', tag: 'history' },
    { image: 'war-peace-war', tag: 'history' },
  ]);

  // Tracking dimensions of the Ikigai Board so we can place all Ikigai Items exactly right.
  const [boardDimensions, setBoardDimensions] = useState({ width: 0, height: 0 });

  const [mousePos, setMousePos] = useState<{ x: number, y: number }>({x: 0, y:0});

  const onUpdate = useCallback(({ x, y, scale }) => {
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
    if (mainContainerRef.current) {
      const { width, height } = mainContainerRef.current.getBoundingClientRect();
      setBoardDimensions({ width, height });
    }
  }, []); 

  
  const handleAddTag = (position: Position) => {
    if (mainContainerRef.current) {
      const rect = mainContainerRef.current.getBoundingClientRect();
      const offsetX = position.x - rect.left;
      const offsetY = position.y - rect.top;
      console.log(position.x, position.y)
      console.log(offsetX, offsetY)

      const newTag = {
        tag: "New Tag",
        position: {
          x: offsetX,
          y: offsetY,
        }
      };

      setIkigaiTags([...ikigaiTags, newTag]);
      setItemCoordinates({
        ...itemCoordinates,
        [newTag.tag]: { x: offsetX, y: offsetY },
      });
    }
  };

  const handleAddIkigaiImage = (imageUrl: string, position: Position) => {
    if (mainContainerRef.current) {
      const rect = mainContainerRef.current.getBoundingClientRect();
      const offsetX = position.x - rect.left;
      const offsetY = position.y - rect.top;
      console.log(position.x, position.y)
      console.log(offsetX, offsetY)

      const newImage = {
        imageUrl: imageUrl,
        text: "new image", 
        position: { x: position.x, y: position.y },
      };
    
      setIkigaiImages(prevImages => [...prevImages, newImage]);
      setItemCoordinates({
        ...itemCoordinates,
        [newImage.text]: { x: mousePos.x, y: mousePos.y },
      });
    }
  };

  const handleItemDragEnd = (text: string, x: number, y: number) => {
    setItemCoordinates((prevState) => ({
      ...prevState,
      [text]: { x, y },
    }));
  }; 

  const addConnection = (image: string, tag: string) => {
    setConnections([...connections, { image, tag }]);
  };


  return (
    <QuickPinchZoom onUpdate={onUpdate} wheelScaleFactor={500} inertia={false} tapZoomFactor={0.75} doubleTapToggleZoom >
      <div className="flex justify-center items-center h-screen w-screen border-4 border-slate-500" 
            ref={mainContainerRef}>
        <div className='absolute top-0'>
            The mouse is at position{' '}
            <b>
              ({mousePos.x}, {mousePos.y})
            </b>
          </div>

        <div className="relative w-[70vw] h-[70vw] border-4 border-slate-900" ref={itemContainerRef}>
          {ikigaiImages.map((image, index) => (
            <IkigaiImage
              key={index}
              imageUrl={image.imageUrl}
              text={image.text}
              position={image.position}
              onDragEnd={handleItemDragEnd}
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
              setHoveredItem={setHoveredItem}
              containerRef={itemContainerRef}
              boardDimensions={boardDimensions}
            />
          ))}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-10">
            <IkigaiZone
              name="What you love"
              color="red"
              textPosition="top-12"
              handleAddTag={handleAddTag} handleAddIkigaiImage={handleAddIkigaiImage}
            />
          </div>
          <div className="absolute top-1/2 left-4 transform -translate-x-1/4 -translate-y-1/2 z-10">
            <IkigaiZone
              name="What you are good at"
              color="blue"
              textPosition="left-12"
              handleAddTag={handleAddTag} handleAddIkigaiImage={handleAddIkigaiImage}
            />
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-1/4 z-10">
            <IkigaiZone
              name="What you can be paid for"
              color="yellow"
              textPosition="bottom-12"
              handleAddTag={handleAddTag} handleAddIkigaiImage={handleAddIkigaiImage}
            />
          </div>
          <div className="absolute top-1/2 right-4 transform translate-x-1/4 -translate-y-1/2 z-10">
            <IkigaiZone
              name="What the world needs"
              color="green"
              textPosition="right-12"
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

