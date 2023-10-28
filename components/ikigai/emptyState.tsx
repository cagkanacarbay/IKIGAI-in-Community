import React, {useRef} from 'react';
import IkigaiZoneIcon from './ikigaiZoneLogo';
import { Button } from '../ui/button';
import styles from "./emptyState.module.css";
import { Input } from "@/components/ui/input";

const IkigaiEmptyState: React.FC<{ 
    onCreateBoard: () => void, 
    onLoadBoard: (file: File) => void
  }> = ({ onCreateBoard, onLoadBoard }) => {

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadBoardClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onLoadBoard(file);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 backdrop-blur-sm">
      <div className="bg-cyan-500 bg-opacity-80 p-1 rounded-lg max-w-xl mx-auto mt-10 shadow-md">
        <div className={`p-6 rounded-t-lg z-20 ${styles.backgroundImageContainer}`}>
          <div className="flex justify-center ">
            <h2 className="text-xl font-bold mb-4 text-center bg-slate-300 bg-opacity-40 w-48 rounded-lg align-center">IKIGAI is what</h2>
          </div>
          <div className="relative h-60 w-100 mx-auto mb-4">
            <div className="absolute top-0 left-1/2 flex flex-col items-center transform -translate-x-1/2">
              <IkigaiZoneIcon zoneName='What you love'></IkigaiZoneIcon>
              <p className="text-center text-red-500 whitespace-nowrap">you love</p>
            </div>
            <div className="absolute bottom-0 left-1/2 flex flex-col items-center transform -translate-x-1/2">
              <IkigaiZoneIcon zoneName="What you can be paid for"></IkigaiZoneIcon>
              <p className="text-center text-yellow-500 whitespace-nowrap">you can earn from</p>
            </div>
            <div className="absolute left-4 top-1/2 flex flex-col items-center transform -translate-y-1/2">
              <IkigaiZoneIcon zoneName='What you are good at'></IkigaiZoneIcon>
              <p className="text-center text-blue-500 whitespace-nowrap">you are good at</p>
            </div>
            <div className="absolute right-4 top-1/2 flex flex-col items-center transform -translate-y-1/2">
              <IkigaiZoneIcon zoneName="What the world needs"></IkigaiZoneIcon>
              <p className="text-center text-green-500 whitespace-nowrap">the world needs</p>
            </div>
          </div>
        </div>
        <div className="bg-cyan-50 p-6 rounded-b-lg ">
          <h3 className="text-xl font-semibold mb-4 text-center mt-2">Discover your Ikigai!</h3>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.67 18.9501L7.6 15.6401C8.39 15.1101 9.53 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>Add images</p>
            </div>
            <div className="flex flex-col items-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3L8 21" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3L14 21" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 9H21.5" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.5 15H20.5" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>Create tags</p>
            </div>
            <div className="flex flex-col items-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_9_9276)">
                <path d="M16 13L22.964 17.062L19.991 17.912L22.116 21.593L20.384 22.593L18.259 18.913L16.036 21.063L16 13ZM14 6H16V8H21C21.2652 8 21.5196 8.10536 21.7071 8.29289C21.8946 8.48043 22 8.73478 22 9V13H20V10H10V20H14V22H9C8.73478 22 8.48043 21.8946 8.29289 21.7071C8.10536 21.5196 8 21.2652 8 21V16H6V14H8V9C8 8.73478 8.10536 8.48043 8.29289 8.29289C8.48043 8.10536 8.73478 8 9 8H14V6ZM4 14V16H2V14H4ZM4 10V12H2V10H4ZM4 6V8H2V6H4ZM4 2V4H2V2H4ZM8 2V4H6V2H8ZM12 2V4H10V2H12ZM16 2V4H14V2H16Z" fill="black"/>
                </g>
                <defs>
                <clipPath id="clip0_9_9276">
                <rect width="24" height="24" fill="white"/>
                </clipPath>
                </defs>
              </svg>
              <p>Drag & Drop</p>
            </div>
            <div className="flex flex-col items-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 3L16.44 5.34003L8.48999 5.32001C4.91999 5.32001 1.98999 8.25003 1.98999 11.84C1.98999 13.63 2.71998 15.26 3.89998 16.44" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.0001 21L7.56006 18.66L15.5101 18.68C19.0801 18.68 22.0101 15.75 22.0101 12.16C22.0101 10.37 21.2801 8.74 20.1001 7.56" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12H15" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>Revisit</p>
            </div>
          </div>
          <div className="flex justify-center p-4 space-x-4 mt-4">
            <Button className="px-6 py-6 text-lg rounded-lg bg-cyan-600" onClick={onCreateBoard}>Create board</Button>
            <Input 
              type="file"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <Button className="px-6 py-6 text-lg rounded-lg" variant="secondary" onClick={handleLoadBoardClick}>Load board</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IkigaiEmptyState;
