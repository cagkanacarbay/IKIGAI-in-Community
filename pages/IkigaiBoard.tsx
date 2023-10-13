import React, { useState, useRef, useEffect } from 'react';
import { Inter } from 'next/font/google';
import IkigaiImage from './components/IkigaiImage';
import IkigaiZoneEdit from './components/UserAddIkigaiZone';
import IkigaiTag from './components/IkigaiTag';
import IkigaiConnections from './components/IkigaiConnections';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ItemCoordinates, Connection, Position} from '@/lib/types';


const inter = Inter({ subsets: ['latin'] });

const initialImages = [
  { imageUrl: "/images/dummy/eu4.jpg", text: "eu4", position: { x: 260, y: 550 }},
  { imageUrl: "/images/dummy/neptunespride.png", text: "neptunespride", position: { x: 500, y: 450 } },
  { imageUrl: "/images/dummy/extremeownership.jpg", text: "extreme-ownership", position: { x: 1020, y: 950 } },
  { imageUrl: "/images/dummy/ada symbol opaque.png", text: "Cardano", position: { x: 250, y: 1000 } },
  { imageUrl: "/images/dummy/warpeacewar.jpg", text: "war-peace-war", position: { x: 1000, y: 500 } },
  { imageUrl: "/images/dummy/keynes.jpg", text: "keynes", position: { x: 750, y: 800 } },
];

const initialTags = [
  { tag: "economics", position: {x: 650, y: 150 }},
  { tag: "history", position: {x: 800, y: 380 }},
  { tag: "stoicism", position: {x: 1000, y: 800 }},
  { tag: "strategy games", position: {x: 330, y: 320 }},
];


export default function IkigaiBoard() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [ikigaiImages, setIkigaiImages] = useState(initialImages);
  const [ikigaiTags, setIkigaiTags] = useState(initialTags);
  const [itemCoordinates, setItemCoordinates] = useState<ItemCoordinates>(
    Object.fromEntries([
      ...initialImages.map((image) => [image.text, image.position]),
      ...initialTags.map((tag) => [tag.tag, tag.position]),
    ])
  );  
  const [mousePos, setMousePos] = useState({});


  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );
    };
  }, []);

  const [connections, setConnections] = useState<Connection[]>([
    { image: 'extreme-ownership', tag: 'stoicism' },
    { image: 'eu4', tag: 'strategy games' },
    { image: 'neptunespride', tag: 'strategy games' },
    { image: 'Cardano', tag: 'economics' },
    { image: 'keynes', tag: 'economics' },
    { image: 'keynes', tag: 'history' },
    { image: 'war-peace-war', tag: 'history' },
  ]);

  const handleItemDragEnd = (text: string, x: number, y: number) => {
    setItemCoordinates((prevState) => ({
      ...prevState,
      [text]: { x, y },
    }));
  }; 

  const addConnection = (image: string, tag: string) => {
    setConnections([...connections, { image, tag }]);
  };


  const handleAddTag = (position: Position) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
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
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
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

  
  return (

    <main 
      className={`flex min-h-screen flex-col justify-between ${inter.className} ${hoveredItem ? 'bg-neutral-700 bg-opacity-80' : 'bg-neutral-200'} transition duration-2500 ease-in-out`}
      ref={containerRef}
    >
          <div>
            The mouse is at position{' '}
            <b>
              ({mousePos.x}, {mousePos.y})
            </b>
          </div>


      {ikigaiImages.map((image, index) => (
        <IkigaiImage
          key={index}
          imageUrl={image.imageUrl}
          text={image.text}
          position={image.position}
          onDragEnd={handleItemDragEnd}
          setHoveredItem={setHoveredItem}
        />
      ))}
      {ikigaiTags.map((tag, index) => (
        <IkigaiTag
          key={index}
          text={tag.tag}
          position={tag.position}
          onDragEnd={handleItemDragEnd}
          setHoveredItem={setHoveredItem}
        />
      ))}
      <IkigaiZoneEdit 
        name="What you love" color="red" textPosition="top-12" handleAddTag={handleAddTag} handleAddIkigaiImage={handleAddIkigaiImage}
      />


      <IkigaiConnections hoveredItem={hoveredItem} connections={connections} itemCoordinates={itemCoordinates} />
    </main> 

  );
}


