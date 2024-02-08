import React, {useEffect, useState} from 'react';
import { AspectType, ZoneName, zoneAspectTypes, zones, zoneIconSrc } from '@/lib/types';
import { ikigaiCirclesBoxSize } from '../shapes/ikigaiCircles';
import { stopEventPropagation } from '@tldraw/tldraw';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';

export const zoneDetails = {
  "The Heart": {
    description: "What you love, the passions that drive you and bring you joy.",
    aspects: {
      "interest": "The activities and subjects that captivate your curiosity and attention.",
      "value": "The core principles and ethics that you hold dear and that guide your actions.",
      "dream": "The visions and aspirations that inspire your life's ambitions.",
      "influence": "The people and experiences that have shaped your perspective and growth."
    }
  },
  "The Craft": {
    description: "What you are good at, the skills and talents where you excel.",
    aspects: {
      "skill": "The abilities and expertise you have honed through practice and experience.",
      "knowledge": "The information and understanding you have acquired over time.",
      "tools": "The resources and technologies you utilize to accomplish tasks.",
      "strength": "The personal attributes and qualities that you can reliably leverage."
    }
  },
  "The Cause": {
    description: "What the world needs, the contributions you can make to improve others' lives.",
    aspects: {
      "global": "The worldwide issues and challenges that you feel compelled to address.",
      "societal": "The community and cultural matters that you are motivated to impact.",
      "communal": "The local and group-focused concerns where you can make a difference.",
      "personal": "The individual and intimate areas where you can effect change."
    }
  },
  "The Path": {
    description: "What you can be paid for, the practical opportunities that can sustain you.",
    aspects: {
      "business-idea": "The entrepreneurial concepts and ventures that could yield financial benefit.",
      "career": "The professional journeys and roles that you pursue for a livelihood.",
      "freelance": "The self-employed work and projects that you undertake.",
      "industry": "The sectors and fields where you seek employment and growth."
    }
  }
};

const zoneBackgroundColors: Record<ZoneName, string> = {
  "The Heart": "bg-red-50 hover:bg-red-100",
  "The Craft": "bg-blue-50 hover:bg-blue-100",
  "The Cause": "bg-green-50 hover:bg-green-100",
  "The Path": "bg-yellow-50 hover:bg-yellow-100",
};

export const HelpMenu: React.FC = () => {

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = (): void => setIsVisible(!isVisible);

  const boxHeight = ikigaiCirclesBoxSize.height * 1.5;
  const boxWidth = ikigaiCirclesBoxSize.width * 1.5;

  const offsetY = (boxHeight - ikigaiCirclesBoxSize.height) / 2;
  const offsetX = (boxHeight - ikigaiCirclesBoxSize.height) / 2;

  console.log("New dimensions and offsets for Help Menu: ", boxHeight, boxWidth, offsetX, offsetY);

  return (
    <>
    {/* <Button
      className="bg-purple-200 hover:bg-purple-600 transition-colors duration-300 shadow-lg text-white rounded-full w-16 h-16 flex items-center justify-center cursor-pointer"
      onClick={toggleVisibility}
    >
      <Image src="/icons/question.png" alt="?" width={40} height={40} priority/>
    </Button>
    {isVisible && ( */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute"
        style={{
          width: `${boxHeight}px`,
          height: `${boxWidth}px`,
          top: `-${offsetY}px`, 
          left: `-${offsetX}px`, 
        }}
      >
        {zones.map((zone) => (
          <ZoneHelpContainer
            key={zone}
            zoneName={zone}
          />
        ))}
      </motion.div>
    {/* )} */}
  </>
  )
};
interface ZoneHelpContainerProps {
  zoneName: ZoneName;
}


const ZoneHelpContainer: React.FC<ZoneHelpContainerProps> = ({ zoneName }) => {

  const [selectedAspect, setSelectedAspect] = useState<AspectType | null>(null);

  const handleAspectClick = (aspectType: AspectType) => {
    setSelectedAspect(aspectType);
  };

  const containerSize = { width: 600, height: 600 };
  const zoneInfo = zoneDetails[zoneName];
  const aspects = Object.entries(zoneInfo.aspects).map(([type, text]) => ({ type, text }));
  const backgroundColor = zoneBackgroundColors[zoneName];

  // Calculate the styles for each zone position to place them in the center of each side
  const commonStyles = {
    width: `${containerSize.width}px`,
    height: `${containerSize.height}px`,
    transform: 'translate(-50%, -50%)', // Centers the div relative to its position
  };

  const style = {
    top: zoneName === 'The Heart' ? `0` : zoneName === 'The Path' ? '100%' : '50%',
    bottom: zoneName === 'The Heart' || zoneName === 'The Path' ? undefined : 'auto',
    left: zoneName === 'The Craft' ? '0' : zoneName === 'The Cause' ? '100%' : '50%',
    right: zoneName === 'The Craft' || zoneName === 'The Cause' ? undefined : 'auto',
  };

  return (
    <div className={`
      absolute flex flex-col items-center justify-center pointer-events-auto
      rounded-lg ${backgroundColor} px-16`} 
      style={{...commonStyles, ...style}}
      onPointerMove={stopEventPropagation} onPointerDown={stopEventPropagation}
    > 
      <div className='flex items-center'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/icons/zones/${zoneIconSrc[zoneName]}`} alt={zoneName} className='w-20 h-20 p-2 transition-colors mr-4'/>
        <h2 className='text-5xl font-semibold'>{zoneName}</h2>
      </div>
      <p className='text-xl mt-4'>{zoneInfo.description}</p>
      <div className={`flex flex-col items-center p-4 mt-10 `}>
        <div className='grid grid-cols-2 gap-y-5 gap-x-20'>
          {aspects.map((aspect, index) => (
            <div key={index} className='aspect-container flex flex-col items-center'>
              <Button 
                className='rounded-full w-28 h-28 bg-purple-100 hover:bg-purple-400'
                onClick={() => handleAspectClick(aspect.type as AspectType)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/icons/aspects/${aspect.type}.png`} alt={aspect.type} 
                    className='w-20 h-20 p-2 transition-colors'/>
              </Button>
              <p className='text-center text-lg mt-2'>{aspect.type}</p>
            </div>
          ))}
        </div>
      </div>
      {selectedAspect && (
        <AspectCard
          aspectType={selectedAspect}
          description="SSDSDASDSADSAdsa asddsa sad dsada "
          onClose={() => setSelectedAspect(null)}
        />
      )}
    </div>
  );
};



interface AspectCardProps {
  aspectType: AspectType;
  description: string;
  onClose: () => void;
}

export const AspectCard: React.FC<AspectCardProps> = ({ aspectType, description, onClose }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{aspectType}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/icons/aspects/${aspectType}.png`} alt={aspectType} className='w-40 h-40'/>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button onClick={onClose}>Close</Button>
      </CardFooter>
    </Card>
  );
};
