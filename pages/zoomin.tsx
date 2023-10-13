import React, { useState } from 'react';
import { Inter } from 'next/font/google';
import IkigaiImage from './components/IkigaiImage';
import IkigaiZoneEdit from './components/IkigaiZoneEdit';
import IkigaiTag from './components/IkigaiTag';
import IkigaiConnections from './components/IkigaiConnections';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


const inter = Inter({ subsets: ['latin'] });

interface ItemCoordinates {
  [key: string]: { x: number, y: number };
}

interface Connection {
  image: string;
  tag: string;
}

export default function Animations() {
  const [itemCoordinates, setItemCoordinates] = useState<ItemCoordinates>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  // const [connections, setConnections] = useState<Connection[]>([]);
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
  

  return (

          <main className={
            `relative flex w-full h-screen items-center justify-center ${inter.className}
            ${hoveredItem ? 'bg-neutral-700 bg-opacity-80' : 'bg-neutral-200'} 
            transition duration-1500 ease-in-out
            border-2 border-solid border-indigo-500
          `}>
            <TransformWrapper initialScale={1} initialPositionX={0} initialPositionY={0}>
              <TransformComponent >
                <IkigaiZoneEdit name="What you love" color="red" textPosition="top-12"/>

                <IkigaiImage imageUrl="/images/dummy/eu4.jpg" text="eu4" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
                  {/* <IkigaiZoneEdit name="What you love" color="blue" textPosition="left-12"/> */}
                <IkigaiImage imageUrl="/images/dummy/neptunespride.png" text="neptunespride" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
                <IkigaiImage imageUrl="/images/dummy/extremeownership.jpg" text="extreme-ownership" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
                <IkigaiImage imageUrl="/images/dummy/ada symbol opaque.png" text="Cardano" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
                <IkigaiImage imageUrl="/images/dummy/warpeacewar.jpg" text="war-peace-war" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
                <IkigaiTag text="economics" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
                <IkigaiImage imageUrl="/images/dummy/keynes.jpg" text="keynes" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
                <IkigaiTag text="history" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
                <IkigaiTag text="stoicism" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
                <IkigaiTag text="strategy games" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
                <IkigaiConnections hoveredItem={hoveredItem} connections={connections} itemCoordinates={itemCoordinates} />
              </TransformComponent>

            </TransformWrapper>
   
            
          </main>






  );
}
