
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
  "innovation&progress" | "impact" | "community" | "wellbeing" | 
  "financial-freedom" | "business-idea" | "career" | "growth";


export const zones: ZoneName[] = ['The Heart', 'The Craft', 'The Path', 'The Cause'];

export const aspectTypes: AspectType[] = [
  "interest", "value", "dream", "inspiration", 
  "skill", "accomplishment", "knowledge", "strength", 
  "innovation&progress", "wellbeing", "community", "impact", 
  "financial-freedom", "business-idea", "career", "growth"
]

type ZoneAspectTypes = {
  [key in ZoneName]: AspectType[];
}

export const zoneAspectTypes: ZoneAspectTypes = {
  "The Heart": ["interest", "value", "dream", "inspiration"],
  "The Craft": ["skill", "knowledge", "strength", "accomplishment"], 
  "The Cause": ["innovation&progress", "wellbeing", "impact", "community"], 
  "The Path": ["business-idea", "career", "financial-freedom", "growth"]
}

export const getZoneName = (aspectType: AspectType): ZoneName => {
  const zoneName = Object.keys(zoneAspectTypes).find((zoneName) => {
    return zoneAspectTypes[zoneName as ZoneName].includes(aspectType);
  });
  return zoneName as ZoneName;
}

export const zoneIconSrc = {
  "The Heart": "heart.png",
  "The Craft": "craft.png",
  "The Cause": "cause.png",
  "The Path": "path.png"
}


export const zoneBgColor = {
  "The Heart": "red",
  "The Craft": "blue",
  "The Cause": "green",
  "The Path": "yellow"
}


// export function getBackgroundColorTailwind(zoneName: ZoneName, tailwindColorStrength: number): string {
//   const color = zoneBgColor[zoneName];
//   return `bg-${color}-${tailwindColorStrength}`;
// }