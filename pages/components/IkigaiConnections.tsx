import React from 'react';
import styles from './IkigaiConnections.module.css';

interface ItemCoordinates {
  [key: string]: { x: number, y: number };
}

interface Connection {
  image: string;
  tag: string;
}

interface IkigaiConnectionsProps {
  hoveredItem: string | null;
  connections: Connection[];
  itemCoordinates: ItemCoordinates;
}

const IkigaiConnections: React.FC<IkigaiConnectionsProps> = ({ hoveredItem, connections, itemCoordinates }) => {
  return (
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
  );
};

export default IkigaiConnections;
