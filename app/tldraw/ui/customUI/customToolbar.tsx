import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button'; 
import { ZoneName, zoneAspectTypes, defaultButtonColors, zoneBgColor, zones, zoneIconPaths } from '@/lib/types'; 
import { 
  useEditor, stopEventPropagation, DefaultToolbar, TLUiToolItem, TldrawUiMenuItem, TldrawUiMenuGroup,
  useTools, useValue, GeoShapeGeoStyle, TldrawUiMenuSubmenu, defaultTools
} from 'tldraw'; 
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


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
				{/* <Image src={zoneIconPaths[zoneName]} alt={zoneName} width={24} height={24}/> */}
        <img src={zoneIconPaths[zoneName]} alt={zoneName} width="24" height="24" />

			</button>
    </motion.div>
  );
};



const selectedButtonColors = {
  "The Heart": "bg-red-300",
  "The Craft": "bg-blue-300",
  "The Cause": "bg-green-300",
  "The Path": "bg-yellow-300"
}


const softBgColors = {
  "The Heart": "bg-red-100",
  "The Craft": "bg-blue-100",
  "The Cause": "bg-green-100",
  "The Path": "bg-yellow-100"
}

const buttonOffsets = {
	// Centers (more or less) the new buttons on the zone button
  "The Heart": "-ml-1",
  "The Craft": "-ml-24",
  "The Cause": "-mr-12",
  "The Path": "ml-44"
}

interface CreateAspectButtonsProps {
  zoneName: ZoneName;
}


const CreateAspectButtons: React.FC<CreateAspectButtonsProps> = ({ zoneName }) => {
	const editor = useEditor();
  const [selectedAspect, setSelectedAspect] = useState<string | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<string | null>(null);

  const getButtonClasses = (aspectType: string) => {
    let classes = ``;
    classes += defaultButtonColors[zoneName]; // Apply base color
    if (selectedAspect === aspectType || hoveredAspect === aspectType) {
      // Apply selected color or hover effect
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

  useEffect(() => {
    if (editor.getCurrentTool().id != selectedAspect) {
      setSelectedAspect(null);
    }
  }, [editor.getCurrentTool()]);
  

  return (
    <div className={`flex flex-column bg-white rounded-lg pointer-events-auto p-2 mx-4 space-x-2 mb-2 shadow-md ${buttonOffsets[zoneName]}`}>
      {zoneAspectTypes[zoneName].map((aspectType) => (
          <TooltipProvider key={aspectType}>
            <Tooltip>
              <TooltipTrigger
                  onMouseEnter={() => setHoveredAspect(aspectType)}
                  onMouseLeave={() => setHoveredAspect(null)}
                  onClick={() => setSelectedAspect(prevAspect => prevAspect === aspectType ? null : aspectType)}
                  className={`
                  relative w-12 h-12 inline-flex items-center justify-center rounded-lg 
                  ${getButtonClasses(aspectType)}`}
                >     
                  <img src={`/icons/aspects/${aspectType}.png`} alt={aspectType} className="w-10 h-10"/>
              </TooltipTrigger>
              <TooltipContent sideOffset={5}>
                <p className={`text-lg font-medium -ml-2 px-2 `}>{aspectType}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
      ))}
    </div>
  );
};

function useIsToolSelected(tool: TLUiToolItem) {
	const editor = useEditor()
	const geo = tool.meta?.geo
	return useValue(
		'is tool selected',
		() => {
			const activeToolId = editor.getCurrentToolId()
			const geoState = editor.getSharedStyles().getAsKnownValue(GeoShapeGeoStyle)
			return geo ? activeToolId === 'geo' && geoState === geo : activeToolId === tool.id
		},
		[editor, tool.id, geo]
	)
}



const CustomToolbar: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<ZoneName | null>(null);

  const handleZoneButtonClick = (zoneName: ZoneName) => {
    setSelectedZone(zoneName === selectedZone ? null : zoneName);
  };

  const isSelected = (zoneName: ZoneName) => {
    return selectedZone === zoneName ? 'bg-purple-500 text-white' : 'text-gray-700';
  };

  return (
    <div className="
      fixed bottom-16 left-1/2 transform -translate-x-1/2 w-48 
      pointer-events-auto 
      flex flex-col justify-end z-10"
			onPointerDown={stopEventPropagation}
      onPointerMove={stopEventPropagation}
		>
      {/* Container for elements that should stay fixed */}
      <div className="absolute bottom-0 left-0 right-0 z-50">
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
          bg-white py-2 space-x-1 h-auto w-full mb-16 border border-gray-200
          rounded-xl shadow-md flex items-bottom justify-center z-50
        ">  
          <ToolbarZoneButton zoneName="The Craft" isSelected={isSelected} handleButtonClick={handleZoneButtonClick} />
          <ToolbarZoneButton zoneName="The Heart" isSelected={isSelected} handleButtonClick={handleZoneButtonClick} />
          <ToolbarZoneButton zoneName="The Cause" isSelected={isSelected} handleButtonClick={handleZoneButtonClick} />
          <ToolbarZoneButton zoneName="The Path" isSelected={isSelected} handleButtonClick={handleZoneButtonClick} />
        </div>
      </div>

			<DefaultToolbar />
    </div>
  );
};

export default CustomToolbar;
