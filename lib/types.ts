
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