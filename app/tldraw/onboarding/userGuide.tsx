import React, {useEffect, useState} from 'react';
import { AspectType, ZoneName, zoneAspectTypes, zones, zoneIconSrc, zoneBgColor } from '@/lib/types';
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
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useBoardContext } from '../boardContext';

export const zoneDetails = {
  "The Heart": {
    ikigaiQuestion: "What you love",
    description: [
      "The Heart is the core of who you are, the sanctuary of your deepest passions and joys. It's where your interests, values, dreams, and influences converge, forming the essence of your Ikigai. This zone is about what sets your soul alight and gives your life its most vibrant colors.",
      "Approaching The Heart: Delve into The Heart with an open spirit. Reflect on what brings you pure joy and energy. Share the hobbies that fascinate you, the values that define you, the dreams that propel you, and the influences that have molded your perspective. It’s the canvas where you paint the picture of what you genuinely love. ",
      "Connecting The Heart to Other Zones: Your journey through The Heart illuminates the path ahead. The passions you unearth here will guide you towards fulfilling opportunities in The Path, resonate with the contributions you aspire to make in The Cause, and enhance the talents you cultivate in The Craft."
    ],
    aspects: {
      "interest": "The activities and subjects that captivate your curiosity and attention.",
      "value": "The core principles and ethics that you hold dear and that guide your actions.",
      "dream": "The visions and aspirations that inspire your life's ambitions.",
      "influence": "The people and experiences that have shaped your perspective and growth."
    }
  },
  "The Craft": {
    description: ["What you are good at, the skills and talents where you excel."],
    aspects: {
      "skill": "The abilities and expertise you have honed through practice and experience.",
      "knowledge": "The information and understanding you have acquired over time.",
      "tools": "The resources and technologies you utilize to accomplish tasks.",
      "strength": "The personal attributes and qualities that you can reliably leverage."
    }
  },
  "The Cause": {
    description: ["What the world needs, the contributions you can make to improve others' lives."],
    aspects: {
      "global": "The worldwide issues and challenges that you feel compelled to address.",
      "societal": "The community and cultural matters that you are motivated to impact.",
      "communal": "The local and group-focused concerns where you can make a difference.",
      "personal": "The individual and intimate areas where you can effect change."
    }
  },
  "The Path": {
    description: ["What you can be paid for, the practical opportunities that can sustain you."],
    aspects: {
      "business-idea": "The entrepreneurial concepts and ventures that could yield financial benefit.",
      "career": "The professional journeys and roles that you pursue for a livelihood.",
      "freelance": "The self-employed work and projects that you undertake.",
      "industry": "The sectors and fields where you seek employment and growth."
    }
  }
};

const zoneBackgroundColors: Record<ZoneName, string> = {
  // "The Heart": "bg-red-50 hover:bg-red-100",
  // "The Craft": "bg-blue-50 hover:bg-blue-100",
  // "The Cause": "bg-green-50 hover:bg-green-100",
  // "The Path": "bg-yellow-50 hover:bg-yellow-100",
  "The Heart": "bg-red-50",
  "The Craft": "bg-blue-50",
  "The Cause": "bg-green-50",
  "The Path": "bg-yellow-50",
};


// This box wraps around the circles with the center at the center of the circles, so we can place the 
// help menus for each zone right next to each zone.
const boxMultiplier = 1.4; // Multiplier to increase the size of the box containing ikigaiCircles

export const UserGuide: React.FC = () => {
  const { userGuideVisible } = useBoardContext(); // Use the context to determine visibility

  // Assuming ikigaiCirclesBoxSize and zones are defined elsewhere in your code

  const boxHeight = ikigaiCirclesBoxSize.height * boxMultiplier;
  const boxWidth = ikigaiCirclesBoxSize.width * boxMultiplier;

  const offsetY = (boxHeight - ikigaiCirclesBoxSize.height) / 2;
  const offsetX = (boxWidth - ikigaiCirclesBoxSize.width) / 2; // Fixed to use boxWidth for offsetX calculation

  console.log("New dimensions and offsets for Help Menu: ", boxHeight, boxWidth, offsetX, offsetY);

  return (
    <>
      <AnimatePresence>
        {userGuideVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute"
            style={{
              width: `${boxWidth}px`,
              height: `${boxHeight}px`,
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
        )}
      </AnimatePresence>
    </>
  );
};


interface ZoneHelpContainerProps {
  zoneName: ZoneName;
}

const ZoneHelpContainer: React.FC<ZoneHelpContainerProps> = ({ zoneName }) => {
  // Places the help menu for each zone right next to it IKIGAI circle. 
  // ie. to the top of THe Heart, left of The Craft, right of The Cause, and bottom of The Path.

  const containerSize = { width: 800, height: 800 };
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

  const calculatePosition = (aspectIndex: number, totalAspects: number) => {
    // Determine the starting angle based on the zone
    const startAngle = zoneName === 'The Heart' ? 1.125 * Math.PI : 
                       zoneName === 'The Craft' ? 0.625 * Math.PI :
                       zoneName === 'The Cause' ? 1.625 * Math.PI :
                       Math.PI * 2.125; // For 'The Path'

    // Angle between cards
    const angleStep = Math.PI / totalAspects;
    const angle = startAngle + (aspectIndex * angleStep);

    // Positioning
    const radius = 1000
    // Adjust x and y to account for the size of the AspectCard and place the center of the card correctly
    const x = (containerSize.width / 2) + (radius * Math.cos(angle)) - (AspectCardSize.width / 2);
    const y = (containerSize.height / 2) + (radius * Math.sin(angle)) - (AspectCardSize.height / 2);
    return { x: x, y: y };
  };



  return (
    <Card className={`absolute flex flex-col justi fy-between items-center pointer-events-auto rounded-lg ${backgroundColor} px-16`} 
      style={{...commonStyles, ...style}}
      onPointerMove={stopEventPropagation} onPointerDown={stopEventPropagation}
    > 
      <CardTitle className='flex items-center mt-10 '>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/icons/zones/${zoneIconSrc[zoneName]}`} alt={zoneName} className='w-24 h-24 p-2 transition-colors mr-4'/>
        <h2 className='text-5xl font-semibold'>{zoneName}</h2>
      </CardTitle>
      <CardContent className='flex-grow bg-white rounded-xl mt-8 p-4'>
        <CardDescription className='mt-2 text-justify hyphens-auto '>
          {zoneInfo.description.map((desc, index) => (
            <div key={index} >
              <p className='text-xl font-semibold mb-1'>Some Headline</p>
              <p className='mb-6 text-lg tracking-tight'>{desc}</p>
            </div>
          ))}
        </CardDescription>
        {/* <p className='text-xl mt-4'>{zoneInfo.description}</p> */}
      </CardContent>
      <div className={`flex flex-col items-center p-4 mt-10 `}>
        <div className='grid grid-cols-2 gap-y-5 gap-x-20'>
          {aspects.map((aspect, index) => (
            <div key={index} className='aspect-container flex flex-col items-center'>
              <AspectCard
                aspectType={aspect.type as AspectType}
                description={aspect.text}
                position={calculatePosition(index, aspects.length)}
                zoneName={zoneName}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>

  );
};

const AspectCardSize = { width: 400, height: 400 };

interface AspectCardProps {
  aspectType: AspectType;
  description: string;
  position: { x: number, y: number };
  zoneName: ZoneName;
}

export const AspectCard: React.FC<AspectCardProps> = ({ aspectType, description, position, zoneName }) => {

  const bgColor = `bg-${zoneBgColor[zoneName]}-50`;

  return (
    <div
      className={`
        absolute pointer-events-auto p-6 z-10 rounded-xl bg-purple-50
        w-[${AspectCardSize.width}px] h-[${AspectCardSize.height}px]
      `}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
      onPointerDown={stopEventPropagation}
      onPointerMove={stopEventPropagation}
    >
      <Card className={`flex flex-col justify-between ${bgColor}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/icons/aspects/${aspectType}.png`} alt={aspectType} className='w-20 h-20'/>
            <div className='ml-8 text-3xl'>{aspectType}</div>
          </CardTitle>  
        </CardHeader>
        <CardContent className="flex-grow h-[180px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <CardDescription>{description}
          
          And more

          <br></br>
          </CardDescription>
        </CardContent>
        <CardFooter>
          I am a footer woo
        </CardFooter>
      </Card>
    </div>
  );
};