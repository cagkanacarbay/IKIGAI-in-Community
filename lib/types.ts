export interface Position {
  x: number;
  y: number;
}

export interface ItemCoordinates {
  [key: string]: Position;
}

export interface Connection {
  image: string;
  tag: string;
}

export type IkigaiItem = {
  type: 'image' | 'tag';
  position: Position;
  text?: string;
  imageUrl?: string;
  storageUrl?: string; // holds the blob URL at vercel
};

export type IkigaiItems = Record<string, IkigaiItem>;


export type HandleAddIkigaiImageArgs = {
  imageUrl: string;
  position: Position;
  id?: string;
};


export type UserInDB = {
  id: number;
  username: string;
  email: string;
  created_at: string; 
  updated_at: string; 
}

export type ZoneName = "The Heart" | "The Craft" | "The Path" | "The Cause";

export type AspectType = 
  "interest" | "value" | "dream" | "inspiration" | 
  "skill" | "accomplishment" | "knowledge" | "strength" | 
  "innovation" | "impact" | "community" | "progress" | 
  "financial-freedom" | "business-idea" | "career" | "growth";


export const zones: ZoneName[] = ['The Heart', 'The Craft', 'The Path', 'The Cause'];

export const aspectTypes: AspectType[] = [
  "interest", "value", "dream", "inspiration", 
  "skill", "accomplishment", "knowledge", "strength", 
  "innovation", "progress", "community", "impact", 
  "financial-freedom", "business-idea", "career", "growth"
]

type ZoneAspectTypes = {
  [key in ZoneName]: AspectType[];
}

export const zoneAspectTypes: ZoneAspectTypes = {
  "The Heart": ["interest", "value", "dream", "inspiration"],
  "The Craft": ["skill", "knowledge", "strength", "accomplishment"], 
  "The Cause": ["innovation", "progress", "impact", "community"], 
  "The Path": ["business-idea", "career", "financial-freedom", "growth"]
}

export const getZoneName = (aspectType: AspectType): ZoneName => {
  const zoneName = Object.keys(zoneAspectTypes).find((zoneName) => {
    return zoneAspectTypes[zoneName as ZoneName].includes(aspectType);
  });
  return zoneName as ZoneName;
}

// TODO: merge these path objects 
export const zoneIconSrc = {
  "The Heart": "heart.png",
  "The Craft": "craft.png",
  "The Cause": "cause.png",
  "The Path": "path.png"
}

export const zoneIconPaths = {
  "The Heart": "/icons/zones/heart.png",
  "The Craft": "/icons/zones/craft.png",
  "The Cause": "/icons/zones/cause.png",
  "The Path": "/icons/zones/path.png"
}


// TODO: merge these colors 
export const zoneBgColor = {
  "The Heart": "red",
  "The Craft": "blue",
  "The Cause": "green",
  "The Path": "yellow"
}


export const defaultButtonColors = {
  "The Heart": "bg-red-50 hover:bg-red-300",
  "The Craft": "bg-blue-50 hover:bg-blue-300",
  "The Cause": "bg-green-50 hover:bg-green-300",
  "The Path": "bg-yellow-50 hover:bg-yellow-300"
}

export function getAspectColorByZone(zoneName: ZoneName) {
  // this references the bgColors set in aspect.tsx
  switch (zoneName) {
    case 'The Heart':
      return 'heart';
    case 'The Craft':
      return 'craft';
    case 'The Cause':
      return 'cause';
    case 'The Path':
      return 'path';
    default:
      return 'default';
  }
}



// export function getBackgroundColorTailwind(zoneName: ZoneName, tailwindColorStrength: number): string {
//   const color = zoneBgColor[zoneName];
//   return `bg-${color}-${tailwindColorStrength}`;
// }