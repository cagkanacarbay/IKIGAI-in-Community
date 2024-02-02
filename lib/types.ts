
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

export type AspectType = "skill" | "knowledge" | "expertise" | "strength" | "interest" | "value" | "dream" | "influence" | "global" | "societal" | "communal" | "personal" | "business-idea" | "career" | "freelance" | "industry";

export const aspectTypes: AspectType[] = ["skill", "knowledge", "expertise", "strength", "interest", "value", "dream", "influence", "global", "societal", "communal", "personal", "business-idea", "career", "freelance", "industry"];

export type ZoneName = "The Heart" | "The Craft" | "The Path" | "The Cause";

type ZoneAspectTypes = {
  [key in ZoneName]: AspectType[];
}


export const zoneAspectTypes: ZoneAspectTypes = {
  "The Heart": ["interest", "value", "dream", "influence"],
  "The Craft": ["skill", "knowledge", "expertise", "strength"], 
  "The Cause": ["global", "societal", "communal", "personal"], 
  "The Path": ["business-idea", "career", "freelance", "industry"]
}

export const getZoneName = (aspectType: AspectType): ZoneName | undefined => {
  const zoneName = Object.keys(zoneAspectTypes).find((zoneName) => {
    return zoneAspectTypes[zoneName as ZoneName].includes(aspectType);
  });
  return zoneName as ZoneName | undefined;
}