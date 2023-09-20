import React, { useState } from 'react';
import { Inter } from 'next/font/google';
import IkigaiImage from './components/IkigaiImage';
import IkigaiZoneEdit from './components/ikigaiZoneEdit';
import IkigaiTag from './components/IkigaiTag';
import styles from './animations.module.css';

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
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className} ${hoveredItem ? 'bg-neutral-700 bg-opacity-80' : 'bg-neutral-200'} transition duration-1500 ease-in-out`}>
      <div className="absolute top-0 transform z-10">
        <IkigaiZoneEdit name="What you love" color="red" textPosition="top-12" />
      </div>
      <svg className="absolute top-0 left-0 w-full h-full z-0">
        {hoveredItem && 
          connections.filter(connection => connection.image === hoveredItem || connection.tag === hoveredItem)
          .map((connection, index) => {
            const fromCoords = itemCoordinates[connection.image === hoveredItem ? connection.image : connection.tag];
            const toCoords = itemCoordinates[connection.image === hoveredItem ? connection.tag : connection.image];
            return (
              <>
                <line
                  className={styles.staticLine}
                  key={`${connection.image}-${connection.tag}-static-${index}`}
                  x1={fromCoords?.x || 0}
                  y1={fromCoords?.y || 0}
                  x2={toCoords?.x || 0}
                  y2={toCoords?.y || 0}
                  stroke="#d1d5db"
                  strokeWidth="5"
                />
                <line
                  className={styles.animatedLine}
                  key={`${connection.image}-${connection.tag}-animated-${index}`}
                  x1={fromCoords?.x || 0}
                  y1={fromCoords?.y || 0}
                  x2={toCoords?.x || 0}
                  y2={toCoords?.y || 0}
                  stroke="#171717"
                  strokeWidth="10"
                />
              </>
            );
          })
        }
      </svg>

      <IkigaiImage imageUrl="/images/dummy/eu4.jpg" text="eu4" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
      <IkigaiImage imageUrl="/images/dummy/neptunespride.png" text="neptunespride" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
      <IkigaiImage imageUrl="/images/dummy/extremeownership.jpg" text="extreme-ownership" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
      <IkigaiImage imageUrl="/images/dummy/ada symbol opaque.png" text="Cardano" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
      <IkigaiImage imageUrl="/images/dummy/warpeacewar.jpg" text="war-peace-war" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
      <IkigaiTag text="economics" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
      <IkigaiImage imageUrl="/images/dummy/keynes.jpg" text="keynes" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
      <IkigaiTag text="history" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
      <IkigaiTag text="stoicism" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
      <IkigaiTag text="strategy games" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />


    </main>
  );
}
