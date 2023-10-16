export const initialImages = [
  { imageUrl: "/images/dummy/eu4.jpg", text: "eu4", position: { x: 25, y: 35 } },
  { imageUrl: "/images/dummy/neptunespride.png", text: "neptunespride", position: { x: 80, y: 50 } },
  { imageUrl: "/images/dummy/extremeownership.jpg", text: "extreme-ownership", position: { x: 20, y: 50 } },
  { imageUrl: "/images/dummy/ada symbol opaque.png", text: "Cardano", position: { x: 50, y: 80 } },
  { imageUrl: "/images/dummy/warpeacewar.jpg", text: "war-peace-war", position: { x: 20, y: 10 } },
  { imageUrl: "/images/dummy/keynes.jpg", text: "keynes", position: { x: 52, y: 25 } },
];

export const initialTags = [
  { tag: "economics", position: { x: 40, y: 15 } },
  { tag: "history", position: { x: 0, y: 100 } },
  { tag: "stoicism", position: { x: 50, y: 50 } },
  { tag: "strategy games", position: { x: 90, y: 90 } },
];

export const initialConnections = [
  { image: 'extreme-ownership', tag: 'stoicism' },
  { image: 'eu4', tag: 'strategy games' },
  { image: 'neptunespride', tag: 'strategy games' },
  { image: 'Cardano', tag: 'economics' },
  { image: 'keynes', tag: 'economics' },
  { image: 'keynes', tag: 'history' },
  { image: 'war-peace-war', tag: 'history' },
];
