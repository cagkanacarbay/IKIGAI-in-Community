import React, { useState } from 'react';
import { Inter } from 'next/font/google';
import AnimatedIkigaiItem from './components/animatedIkigaiItem';
import IkigaiZoneEdit from './components/ikigaiZoneEdit';
import styles from './animations.module.css';

const inter = Inter({ subsets: ['latin'] });

interface ItemCoordinates {
  [key: string]: { x: number, y: number };
}

export default function Animations() {
  const [itemCoordinates, setItemCoordinates] = useState<ItemCoordinates>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleItemDragEnd = (text: string, x: number, y: number) => {
    setItemCoordinates((prevState) => ({
      ...prevState,
      [text]: { x, y },
    }));
  };

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className} ${hoveredItem ? 'bg-neutral-700 bg-opacity-80' : 'bg-neutral-200'} transition duration-1500 ease-in-out`}>
      <div className="absolute top-0 transform z-10">
        <IkigaiZoneEdit name="What you love" color="red" textPosition="top-12" />
      </div>

      <svg className="absolute top-0 left-0 w-full h-full z-0">
        {hoveredItem && itemCoordinates[hoveredItem] && Object.keys(itemCoordinates).map((key) => (
          key !== hoveredItem && (
            <>
              <line
                className={styles.staticLine}
                key={`${key}-static`}
                x1={itemCoordinates[hoveredItem].x}
                y1={itemCoordinates[hoveredItem].y}
                x2={itemCoordinates[key].x}
                y2={itemCoordinates[key].y}
                stroke="#d1d5db"
                strokeWidth="5"
              />
              <line
                className={styles.animatedLine}
                key={`${key}-animated`}
                x1={itemCoordinates[hoveredItem].x}
                y1={itemCoordinates[hoveredItem].y}
                x2={itemCoordinates[key].x}
                y2={itemCoordinates[key].y}
                stroke="#171717"
                strokeWidth="10"
              />
            </>
          )
        ))}
      </svg>

      <AnimatedIkigaiItem imageUrl="/images/dummy/profile.jpg" text="profile" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
      <AnimatedIkigaiItem imageUrl="/images/dummy/economy.png" text="circular-economy" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
      <AnimatedIkigaiItem imageUrl="/images/dummy/ada symbol opaque.png" text="Cardano" onDragEnd={handleItemDragEnd} setHoveredItem={setHoveredItem} />
    </main>
  );
}
