import { Position } from "./types";

export const computeBoardPositionFromPixelPosition = (position: Position, ikigaiBoardRef: React.RefObject<HTMLDivElement>): Position => {  // Computes the position of a tag or image on the IKIGAI board, relative to the container
  if (!ikigaiBoardRef.current) {
    return { x: 0, y: 0 };
  }

  console.log(position)

  const rect = ikigaiBoardRef.current.getBoundingClientRect();
  const offsetX = position.x - rect.left;
  const offsetY = position.y - rect.top;
  const percentageX = (offsetX / rect.width) * 100;
  const percentageY = (offsetY / rect.height) * 100

  console.log("Item position:  x: ", offsetX, "/", percentageX, ", ", offsetY, ":", percentageY)
  
  return { x: percentageX, y: percentageY };
};


export const computeBoardPositionFromRects = (itemRect: DOMRect, ikigaiBoardRect: DOMRect): Position => {  
  // Computes the position of a tag or image on the IKIGAI board, relative to the container

  // console.log(itemRect)

  const offsetX = itemRect.x - ikigaiBoardRect.left;
  const offsetY = itemRect.y - ikigaiBoardRect.top;
  const percentageX = (offsetX / ikigaiBoardRect.width) * 100;
  const percentageY = (offsetY / ikigaiBoardRect.height) * 100

  // console.log("Item position:  x: ", offsetX, "/", percentageX, ", ", offsetY, ":", percentageY)
  
  return { x: percentageX, y: percentageY };
};



type ItemDivRefs = {
  [itemId: string]: React.RefObject<HTMLDivElement>;
};


export const getItemPositions = (
  itemDivRefs: ItemDivRefs,
  boardContainer: React.RefObject<HTMLDivElement>
): { [itemId: string]: Position } => {

  const container = boardContainer.current;
  const positions: { [itemId: string]: Position } = {};

  if (container) {
    const containerRect = container.getBoundingClientRect();

    for (const [itemId, itemRef] of Object.entries(itemDivRefs)) {
      const itemDiv = itemRef.current;

      if (itemDiv) {
        // TODO: consolidate with computeBoardPosition function

        const itemRect = itemDiv.getBoundingClientRect();
        // get the middle point

        const xPercentage = ((itemRect.left + itemRect.width / 2 - containerRect.left) / containerRect.width) * 100;
        const yPercentage = ((itemRect.top + itemRect.height / 2 - containerRect.top) / containerRect.height) * 100;

        positions[itemId] = { x: xPercentage, y: yPercentage };
      }
    }
  }

  return positions;
};

// export const getItemPositions = (itemDivRefs: Array<HTMLDivElement>, boardContainer: React.RefObject<HTMLDivElement>) : Array<Position> =>
//     // TODO: Get EXACT CENTER OF rectangle. 
//     const container = boardContainer.current;
//     const itemDivs = tagDivRef.current;

//   if (container && tagDiv) {
//     // Calculate position as a percentage of the parent container's dimensions
//     const containerRect = container.getBoundingClientRect();
//     const rect = tagDiv.getBoundingClientRect();
//     const xPercentage = ((rect.left + rect.width / 2) / containerRect.width) * 100;
//     const yPercentage = ((rect.top + rect.height / 2) / containerRect.height) * 100;
//     console.log(rect)
//     console.log(itemId, xPercentage, yPercentage);

//   return []