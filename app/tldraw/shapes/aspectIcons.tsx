import React from 'react';

interface AspectIconProps {
  type: string;
}

const AspectIcon: React.FC<AspectIconProps> = ({ type }) => {
  return (
    <img src={`/icons/aspects/${type}.png`} alt={`${type} icon`} className="w-5 h-5 mt-1"/>
  );
};

interface ZoneIconProps {
  zone: string;
}

const ZoneIcon: React.FC<ZoneIconProps> = ({ zone }) => {
  return (
    <img src={`/icons/zones/${zone}.png`} alt={`${zone} icon`} className="w-5 h-5 mt-1"/>
  );
};

export {AspectIcon, ZoneIcon};