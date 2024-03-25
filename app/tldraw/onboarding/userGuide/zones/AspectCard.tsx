import React from 'react';
import { zoneBgColor } from '@/lib/types';
import { stopEventPropagation } from '@tldraw/tldraw';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { AspectType, ZoneName } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useBoardContext } from '../../../boardContext';


export const AspectCardSize = { width: 645, height: 645 };

interface AspectCardProps {
  aspectType: AspectType;
  content: {subtitle: string, description: string};
  position: { x: number, y: number };
  zoneName: ZoneName;
}

const subtitleColors: Record<ZoneName, string> = {
  "The Heart": "text-red-400",
  "The Craft": "text-blue-400",
  "The Cause": "text-green-400",
  "The Path": "text-yellow-800",
};

export const AspectCard: React.FC<AspectCardProps> = ({ aspectType, content, position, zoneName }) => {

  const { setQuestionAspectType, questionHelperVisible, toggleQuestionHelperVisibility } = useBoardContext();

  const bgColor = `bg-${zoneBgColor[zoneName]}-50`;
  const subtitleColor = subtitleColors[zoneName];

  return (
    <div
      className={`
        absolute pointer-events-auto p-6 z-10 rounded-xl bg-purple-50
      `}
      style={{
        width: `${AspectCardSize.width}px`,
        height: `${AspectCardSize.height}px`,
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
      onPointerDown={stopEventPropagation}
      onPointerMove={stopEventPropagation}
      id={`user-guide-${aspectType}`}
    >
      <Card className={`flex flex-col justify-between ${bgColor}`}>
        <CardHeader>
          <CardTitle className="flex items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/icons/aspects/${aspectType}.png`} alt={aspectType} className='w-20 h-20 ml-6' />
            <div className='ml-8 flex flex-col'>
              <div className='text-4xl'>
                {aspectType
                  .replace(/-/g, ' ')
                  .replace(/&\s?/g, ' & ')
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </div>           
              <div className={`text-xl ${subtitleColor}`}>{content.subtitle}</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <CardDescription className='text-lg rounded-xl h-[370px] text-justify hyphens-auto px-8 py-4'>
            {content.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-center ">
          <Button 
            className="text-lg px-10 py-4" 
            onClick={() => {
              setQuestionAspectType(aspectType);
              if (!questionHelperVisible) {
                toggleQuestionHelperVisibility();
              }
            }}          
            >
            Ask me a question
          </Button>          
        </CardFooter>
      </Card>
    </div>
  );
};
