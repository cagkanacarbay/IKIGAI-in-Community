import { createShapeId } from "@tldraw/tldraw";

export const ikigaiCircleIds = {
  heart: createShapeId('ikigaiCircle-theHeart'),
  craft: createShapeId('ikigaiCircle-theCraft'),
  cause: createShapeId('ikigaiCircle-theCause'),
  path: createShapeId('ikigaiCircle-thePath')
};

export const zoneNameToId = {
  'The Heart': ikigaiCircleIds.heart,
  'The Craft': ikigaiCircleIds.craft,
  'The Path': ikigaiCircleIds.path,
  'The Cause': ikigaiCircleIds.cause,
};