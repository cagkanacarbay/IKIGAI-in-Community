import React, { useState, useEffect } from 'react';
import { Tutorial } from './tutorial/welcomeTour';
import { QuestionHelper } from './questions/questionsHelper';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { stopEventPropagation } from '@tldraw/tldraw';
import { useBoardContext } from '../boardContext';


const InFrontOfTheCanvasComponents: React.FC = ({}) => {

  return (
    <>
      <Tutorial />
      <QuestionHelper />
      <div id='helper-buttons'>
        <QuestionHelperButton />
        <UserGuideButton />
        <TutorialButton />
      </div>
    </>
  );
};

export default InFrontOfTheCanvasComponents;


interface HelperButtonProps {
  isVisible: boolean;
  toggleVisibility: () => void;
  id: string;
  top: string;
  iconSrc: string;
  altText: string;
}

const HelperButton: React.FC<HelperButtonProps> = ({ isVisible, toggleVisibility, id, top, iconSrc, altText }) => {
  const bgColor = isVisible ? 'bg-purple-300 hover:bg-purple-600' : 'bg-purple-100 hover:bg-purple-600';

  return (
    <div className={`fixed ${top} left-4 z-50 pointer-events-auto`}
      onPointerMove={stopEventPropagation} onPointerDown={stopEventPropagation}
      id={id}
    >
      <Button
        className={`transition-colors duration-300 shadow-lg rounded-full w-16 h-16 flex items-center justify-center cursor-pointer ${bgColor}`}
        onClick={toggleVisibility}
      >
        <Image src={iconSrc} alt={altText} width={40} height={40} priority/>
      </Button>
    </div>
  );
};

const UserGuideButton: React.FC = () => {
  const { userGuideVisible, toggleUserGuideVisibility } = useBoardContext(); 

  return (
    <HelperButton 
      isVisible={userGuideVisible} 
      toggleVisibility={toggleUserGuideVisibility} 
      id="user-guide-button" 
      top="top-36" 
      iconSrc="/icons/guide.png" 
      altText="User Guide" 
    />
  );
};

const QuestionHelperButton: React.FC = () => {
  const { questionHelperVisible, toggleQuestionHelperVisibility } = useBoardContext(); 

  return (
    <HelperButton 
      isVisible={questionHelperVisible} 
      toggleVisibility={toggleQuestionHelperVisibility} 
      id="questions-helper-button" 
      top="top-16" 
      iconSrc="/icons/question.png" 
      altText="Questions" 
    />
  );
};


const TutorialButton: React.FC = () => {
  const { tutorialVisible, toggleTutorialVisibility, step, totalSteps, isTutorialCompleted } = useBoardContext(); 
  const [tutorialProgress, setTutorialProgress] = useState((step/totalSteps) * 100);
  // console.log("tutorialProgress: ", tutorialProgress)

  useEffect(() => {
    setTutorialProgress((step/totalSteps) * 100);
  }, [step]);

  const bgColor = tutorialVisible ? 'bg-purple-300 hover:bg-purple-600' : 'bg-purple-100 hover:bg-purple-600';

  return (
    <div className={`fixed top-56 left-4 z-50 pointer-events-auto`}
      onPointerMove={stopEventPropagation} onPointerDown={stopEventPropagation}
      id="tutorial-button"
    >
      {isTutorialCompleted ? (
        <Button
          className={`transition-colors duration-300 shadow-lg rounded-full w-16 h-16 flex items-center justify-center cursor-pointer bg-green-100`}
          onClick={toggleTutorialVisibility}
        >
          <Image src="/icons/check.svg" alt="Check" width={30} height={30} priority/>
        </Button>
      ) : (
        <Button
          className={`transition-colors duration-300 shadow-lg rounded-full w-16 h-16 flex items-center justify-center cursor-pointer ${bgColor}`}
          onClick={toggleTutorialVisibility}
        >
          <div className="flex flex-col items-center pb-2">
            <div className="text-center mb-1">{step+1}/{totalSteps}</div>

            <div className="w-12 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
              <div className={`bg-blue-600 h-1.5 rounded-full dark:bg-blue-500`} style={{width: `${tutorialProgress}%`}}></div>        
            </div>
          </div>
        </Button>
      )}
    </div>
  );
};

