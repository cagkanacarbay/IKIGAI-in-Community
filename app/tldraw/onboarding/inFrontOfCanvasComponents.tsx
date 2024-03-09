import React, { useState, useEffect } from 'react';
import { WelcomeTour } from './tour/welcomeTour';
import { QuestionHelper } from './questions/questionsHelper';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { stopEventPropagation } from '@tldraw/tldraw';
import { useBoardContext } from '../boardContext';


const InFrontOfTheCanvasComponents: React.FC = ({}) => {

  return (
    <>
      <WelcomeTour />
      <QuestionHelper />
      <div id='helper-buttons'>
        <QuestionHelperButton />
        <UserGuideButton />
      </div>
    </>
  );
};

export default InFrontOfTheCanvasComponents;


const UserGuideButton: React.FC = () => {
  const { userGuideVisible, toggleUserGuideVisibility } = useBoardContext(); 

  const bgColor = userGuideVisible ? 'bg-purple-300 hover:bg-purple-600' : 'bg-purple-100 hover:bg-purple-600';

  return (
    <div className="fixed top-36 left-4 z-50 pointer-events-auto "
      onPointerMove={stopEventPropagation} onPointerDown={stopEventPropagation}
      id="user-guide-button"
    >
      <Button
        className={`transition-colors duration-300 shadow-lg rounded-full w-16 h-16 flex items-center justify-center cursor-pointer ${bgColor}`}
        onClick={toggleUserGuideVisibility}
      >
        <Image src="/icons/guide.png" alt="User Guide" width={40} height={40} priority/>
      </Button>
    </div>
  );
};


const QuestionHelperButton: React.FC = () => {
  const { questionHelperVisible, toggleQuestionHelperVisibility } = useBoardContext(); 

  const bgColor = questionHelperVisible ? 'bg-purple-300 hover:bg-purple-600' : 'bg-purple-100 hover:bg-purple-600';

  return (
    <div className="fixed top-16 left-4 z-50 pointer-events-auto"
      onPointerMove={stopEventPropagation} onPointerDown={stopEventPropagation}
      id="questions-helper-button"
    >
      <Button
        className={`transition-colors duration-300 shadow-lg rounded-full w-16 h-16 flex items-center justify-center cursor-pointer ${bgColor}`}
        onClick={toggleQuestionHelperVisibility}
      >
        <Image src="/icons/question.png" alt="Questions" width={40} height={40} priority/>
      </Button>
    </div>
  );
};

