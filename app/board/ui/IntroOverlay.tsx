"use client";
import React, { useState, useEffect } from 'react';


export interface IntroOverlayProps {
  onFadeComplete: () => void;
}


export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onFadeComplete }) => {
  // Use two states: one for showing the overlay and another for starting the fade-out effect
  const [show, setShow] = useState(true);
  const [startFadeOut, setStartFadeOut] = useState(false);

  useEffect(() => {
    // Set timeout to start the fade-out effect
    const fadeOutTimer = setTimeout(() => {
      setStartFadeOut(true); // Begin fade-out effect
    }, 2000); // Start fade out after 1.5 seconds


    // Set another timeout to call onFadeComplete after allowing time for the fade effect to complete
    const completeTimer = setTimeout(() => {
      onFadeComplete(); // Complete the intro sequence
    }, 4000); // Complete the sequence after 3 seconds in total

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onFadeComplete]);

  return (
    <div
      className={`
      absolute inset-0 flex justify-center items-center 
      bg-gray-900 text-white text-6xl tracking-tighter text-center 
      transition-opacity duration-2000 ${startFadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{ zIndex: show ? 100 : -1 }}
    >
      <div className='animate-jump-out animate-once animate-duration-[30000ms] animate-ease-in animate-normal animate-fill-forwards'>
        When you find your sense of purpose everything has direction.
      </div>

    </div>
  );
};
