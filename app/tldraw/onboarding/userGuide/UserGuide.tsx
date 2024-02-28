import React, {useEffect, useState} from 'react';
import { ZoneName, zoneAspectTypes, zones } from '@/lib/types';
import { ikigaiCirclesBoxSize } from '../../shapes/ikigaiCircles';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useBoardContext } from '../../boardContext';
import { ZoneHelpContainer } from './ZoneHelpContainer';


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




