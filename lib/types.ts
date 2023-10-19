
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
};

export type IkigaiItems = Record<string, IkigaiItem>;


export type HandleAddIkigaiImageArgs = {
  imageUrl: string;
  position: Position;
  replacedImageId?: string;
};