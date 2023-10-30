import React, {useRef} from 'react';
import IkigaiZoneIcon from './ikigaiZoneLogo';
import { Button } from '../ui/button';
import styles from "./emptyState.module.css";
import { Input } from "@/components/ui/input";
import Icon from '@/components/icons';

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
              <Icon iconName='image' size={36}></Icon>
              <p>Add images</p>
            </div>
            <div className="flex flex-col items-center">
              <Icon iconName='tag' size={36}></Icon>
              <p>Create tags</p>
            </div>
            <div className="flex flex-col items-center">
              <Icon iconName='drag&drop' size={36}></Icon>
              <p>Drag & Drop</p>
            </div>
            <div className="flex flex-col items-center">
              <Icon iconName='revisit' size={36}></Icon>
              <p>Revisit</p>
            </div>
          </div>
          <div className="flex justify-center p-4 space-x-4 mt-4">
            <Button className="px-6 py-6 text-lg rounded-lg" onClick={onCreateBoard}>Create board</Button>
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
