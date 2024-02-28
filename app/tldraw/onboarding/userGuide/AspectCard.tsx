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

export const AspectCardSize = { width: 400, height: 400 };

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
            <img src={`/icons/aspects/${aspectType}.png`} alt={aspectType} className='w-20 h-20' />
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
