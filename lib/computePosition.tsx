import { Position } from "./types";


export const computeBoardPosition = (position: Position, ikigaiBoardRef: React.RefObject<HTMLDivElement>): Position => {  // Computes the position of a tag or image on the IKIGAI board, relative to the container
  if (!ikigaiBoardRef.current) {
    return { x: 0, y: 0 };
  }

  const rect = ikigaiBoardRef.current.getBoundingClientRect();
  const offsetX = position.x - rect.left;
  const offsetY = position.y - rect.top;
  const percentageX = (offsetX / rect.width) * 100;
  const percentageY = (offsetY / rect.height) * 100

  console.log("Item position:  x: ", offsetX, "/", percentageX, ", ", offsetY, ":", percentageY)
  
  return { x: percentageX, y: percentageY };
};
