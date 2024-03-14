import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button'; 
import { ZoneName, zoneAspectTypes, defaultButtonColors, zoneBgColor, zones, zoneIconPaths } from '@/lib/types'; 
import { useEditor, stopEventPropagation } from 'tldraw'; 
import Image from 'next/image';
import { createAspectAction, addAspectTypeAction, removeAspectTypeAction } from './aspectActions';

interface ToolbarButtonProps {
  zoneName: ZoneName;
  isSelected: (zoneName: ZoneName) => string;
  handleButtonClick: (zoneName: ZoneName) => void;
}

const ToolbarZoneButton: React.FC<ToolbarButtonProps> = ({ zoneName, isSelected, handleButtonClick }) => {
	 
  return (
    <motion.div >
      <button
        onClick={(_event) => handleButtonClick(zoneName)}
        className={`w-10 h-10 rounded-lg ${isSelected(zoneName)} bg-purple-50 hover:bg-purple-200 flex items-center justify-center`}
      >
				<Image src={zoneIconPaths[zoneName]} alt={zoneName} width={24} height={24}/>
			</button>
    </motion.div>
  );
};

interface CreateAspectButtonsProps {
  zoneName: ZoneName;
}


const selectedButtonColors = {
  "The Heart": "bg-red-300",
  "The Craft": "bg-blue-300",
  "The Cause": "bg-green-300",
  "The Path": "bg-yellow-300"
}


const buttonOffsets = {
	// Centers (more or less) the new buttons on the zone button
  "The Heart": "-ml-1",
  "The Craft": "-ml-24",
  "The Cause": "-mr-12",
  "The Path": "ml-44"
}

const CreateAspectButtons: React.FC<CreateAspectButtonsProps> = ({ zoneName }) => {
	const editor = useEditor();
  const [selectedAspect, setSelectedAspect] = useState<string | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<string | null>(null);

  const getButtonClasses = (aspectType: string) => {
    let classes = `w-12 h-12 rounded-lg flex items-center justify-center overflow-visible opacity-100 flex-shrink-0 relative `;
    classes += defaultButtonColors[zoneName]; // Apply base color
    if (selectedAspect === aspectType) {
      classes += ` ${selectedButtonColors[zoneName]}`; // Apply selected color
    }
    if (hoveredAspect === aspectType) {
      // Apply hover effect manually
      classes = classes.replace(defaultButtonColors[zoneName], selectedButtonColors[zoneName]);
    }
    return classes;
  };

	useEffect(() => {
		if (selectedAspect) {
			console.log("setting selected aspect Tool to", selectedAspect)
			console.log("editor", editor)
			

			editor.setCurrentTool(selectedAspect);
		} 
	}, [selectedAspect]);

  return (
    <div className={`flex flex-column bg-white rounded-lg pointer-events-auto p-2 mx-4 space-x-2 mb-2 shadow-md ${buttonOffsets[zoneName]}`}>
      {zoneAspectTypes[zoneName].map((aspectType) => (
        <button
          key={aspectType}
          onMouseEnter={() => setHoveredAspect(aspectType)}
          onMouseLeave={() => setHoveredAspect(null)}
          onClick={() => setSelectedAspect(aspectType)}
          className={getButtonClasses(aspectType)}
        >
          <Image src={`/icons/aspects/${aspectType}.png`} alt={aspectType} width={36} height={36} />
        </button>
      ))}
    </div>
  );
};

export default function CustomToolbar() {
	const [selectedTool, setSelectedTool] = useState<string | null>(null);
	const [selectedZone, setSelectedZone] = useState<ZoneName | null>(null);

	const handleZoneButtonClick = (zoneName: ZoneName) => {
    if (zoneName === selectedZone) {
      setSelectedZone(null);
    } else {
      setSelectedZone(zoneName);
    }
  };

  const isSelected = (zoneName: ZoneName) => {
    return selectedZone === zoneName ? 'bg-purple-500 text-white' : 'text-gray-700';
  };


  return (
    <div className="
      fixed bottom-16 left-1/2 transform -translate-x-1/2 w-48 
      pointer-events-auto 
      flex flex-col justify-end"
			onPointerDown={stopEventPropagation}
      onPointerMove={stopEventPropagation}
		>
			<AnimatePresence>
				{zones.map((zoneName) => 
					selectedZone === zoneName && (
						<motion.div
							key={`${zoneName}-toolbar-button`}
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -50 }}
							className='flex justify-center'
						>
							<CreateAspectButtons zoneName={zoneName} />
						</motion.div>
					)
				)}
			</AnimatePresence>

      <div className="
        bg-white p-2 mx-4 space-x-1 h-auto w-48 
        rounded-lg shadow-md flex items-bottom justify-center 
      ">  
        <ToolbarZoneButton zoneName="The Craft" isSelected={isSelected} handleButtonClick={handleZoneButtonClick} />
        <ToolbarZoneButton zoneName="The Heart" isSelected={isSelected} handleButtonClick={handleZoneButtonClick} />
        <ToolbarZoneButton zoneName="The Cause" isSelected={isSelected} handleButtonClick={handleZoneButtonClick} />
        <ToolbarZoneButton zoneName="The Path" isSelected={isSelected} handleButtonClick={handleZoneButtonClick} />
      </div>
    </div>
  );
}
