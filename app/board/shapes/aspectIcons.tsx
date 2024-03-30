import React from 'react';


interface AspectIconProps {
  type: string;
}

const AspectIcon: React.FC<AspectIconProps> = ({ type }) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/icons/aspects/${type}.png`} alt={`${type} icon`} className="w-6 h-6 mt-1"/>
  );
};

interface ZoneIconProps {
  zone: string;
}

const zoneIconSrc = {
  "The Heart": "heart.png",
  "The Craft": "craft.png",
  "The Cause": "cause.png",
  "The Path": "path.png"
}

const ZoneIcon: React.FC<ZoneIconProps> = ({ zone }) => {
  return (
    <>
      {zoneIconSrc[zone as keyof typeof zoneIconSrc] && 
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/icons/zones/${zoneIconSrc[zone as keyof typeof zoneIconSrc]}`} alt={`${zone} icon`} width={20} height={20} className="mt-1"/>
      }
    </>
    
  );
};

export {AspectIcon, ZoneIcon};