import React from 'react';
import { AspectType, zoneIconSrc } from '@/lib/types';
import { stopEventPropagation } from '@tldraw/tldraw';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { guideContent } from './guideContent';
import { AspectCard, AspectCardSize } from './AspectCard';
import { ZoneName } from '@/lib/types';


export const zoneBackgroundColors: Record<ZoneName, string> = {
  // "The Heart": "bg-red-50 hover:bg-red-100",
  // "The Craft": "bg-blue-50 hover:bg-blue-100",
  // "The Cause": "bg-green-50 hover:bg-green-100",
  // "The Path": "bg-yellow-50 hover:bg-yellow-100",
  "The Heart": "bg-red-50",
  "The Craft": "bg-blue-50",
  "The Cause": "bg-green-50",
  "The Path": "bg-yellow-50",
};

export const subtitleColors: Record<ZoneName, string> = {
  "The Heart": "text-red-300",
  "The Craft": "text-blue-300",
  "The Cause": "text-green-300",
  "The Path": "text-yellow-700",
};

export interface ZoneHelpContainerProps {
  zoneName: ZoneName;
}

export const ZoneHelpContainer: React.FC<ZoneHelpContainerProps> = ({ zoneName }) => {
  // Places the help menu for each zone right next to it IKIGAI circle. 
  // ie. to the top of THe Heart, left of The Craft, right of The Cause, and bottom of The Path.
  const containerSize = { width: 800, height: 900 };
  const zoneInfo = guideContent[zoneName];
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
    const radius = 1000;
    // Adjust x and y to account for the size of the AspectCard and place the center of the card correctly
    const x = (containerSize.width / 2) + (radius * Math.cos(angle)) - (AspectCardSize.width / 2);
    const y = (containerSize.height / 2) + (radius * Math.sin(angle)) - (AspectCardSize.height / 2);
    return { x: x, y: y };
  };



  return (
    <Card className={`absolute flex flex-col justify-between items-center pointer-events-auto rounded-lg ${backgroundColor} px-16`}
      style={{ ...commonStyles, ...style }}
      onPointerMove={stopEventPropagation} onPointerDown={stopEventPropagation}
    >
      <CardTitle className='flex items-center mt-10 '>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/icons/zones/${zoneIconSrc[zoneName]}`} alt={zoneName} className='w-24 h-24 p-2 transition-colors mr-4' />
        <div>
          <h1 className='text-5xl font-semibold'>{zoneName}</h1>
          <h2 className={`text-xl font-semibold ml-1 ${subtitleColors[zoneName]}`}>{zoneInfo.ikigaiQuestion}</h2>
        </div>
      </CardTitle>
      <CardContent className='bg-white rounded-xl mt-8 p-4'>
        <blockquote className='border-gray-500 border-l-4 italic mb-10 mt-4 px-6 text-xl text-center font-medium'>
          {zoneInfo.quote}
          <cite className='block text-right text-lg mt-2 font-normal'>{zoneInfo.quoteAuthor}</cite>
        </blockquote>
        <CardDescription className='mt-2 text-justify hyphens-auto px-4 mx-4'>
          <div className='text-lg font-semibold mb-1 mt-2'>
            {Object.keys(zoneInfo.accordion)[0]}
          </div>
          <div className='text-lg'>
            {Object.values(zoneInfo.accordion)[0]}
          </div>
          <div className='text-lg font-semibold mb-1 mt-6'>
            {Object.keys(zoneInfo.accordion)[1]}
          </div>
          <div className='text-lg mb-4'>
            {Object.values(zoneInfo.accordion)[1]}
          </div>
          {/* <Accordion type="single" collapsible className="w-full">
            {Object.entries(zoneInfo.accordion).map(([subtitle, desc], index) => {
              return (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className='text-lg'>{subtitle}</AccordionTrigger>
                  <AccordionContent className='text-lg box-content'>
                    {desc}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion> */}
        </CardDescription>
      </CardContent>
      <div className={`flex flex-col items-center p-4 mt-10 `}>
        <div className='grid grid-cols-2 gap-y-5 gap-x-20'>
          {aspects.map((aspect, index) => (
            <div key={index} className='aspect-container flex flex-col items-center'>
              <AspectCard
                aspectType={aspect.type as AspectType}
                description={aspect.text}
                position={calculatePosition(index, aspects.length)}
                zoneName={zoneName} />
            </div>
          ))}
        </div>
      </div>
    </Card>

  );
};
