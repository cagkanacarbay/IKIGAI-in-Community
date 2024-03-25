import React, { useState, useEffect } from 'react';
import { Tutorial } from './tutorial/welcomeTour';
import { QuestionHelper } from './questions/questionsHelper';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { stopEventPropagation } from '@tldraw/tldraw';
import { useBoardContext } from '../boardContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CloseButton from '@/components/ui/closeButton';
import { useSession } from 'next-auth/react';
import { AlertDescription, AlertTitle } from '@/components/ui/alert';
import { tutorialSteps } from './tutorial/welcomeSteps';


const InFrontOfTheCanvasComponents: React.FC = ({}) => {

  const { data: session } = useSession();
  const { tutorialToCVisible } = useBoardContext();

  return (
    <>
      <Tutorial />
      <QuestionHelper />
      {session ? null : <NotLoggedInAlert />}
      <div id='helper-buttons'>
        <QuestionHelperButton />
        <UserGuideButton />
        <TutorialButton />
      </div>
      { tutorialToCVisible ? <TutorialTableOfContents /> : null}
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
  const { tutorialVisible, tutorialToCVisible, setTutorialToCVisible, step, totalSteps, isTutorialCompleted } = useBoardContext(); 
  const [tutorialProgress, setTutorialProgress] = useState((step/totalSteps) * 100);
  // console.log("tutorialProgress: ", tutorialProgress)

  useEffect(() => {
    setTutorialProgress((step/totalSteps) * 100);
  }, [step]);

  const bgColor = (tutorialVisible || tutorialToCVisible) ? 'bg-purple-300 hover:bg-purple-600' : 'bg-purple-100 hover:bg-purple-600';

  return (
    <div className={`fixed top-56 left-4 z-50 pointer-events-auto`}
      onPointerMove={stopEventPropagation} onPointerDown={stopEventPropagation}
      id="tutorial-button"
    >
      {isTutorialCompleted ? (
        <Button
          className={`transition-colors duration-300 shadow-lg rounded-full w-16 h-16 flex items-center justify-center cursor-pointer bg-green-100`}
          onClick={() => setTutorialToCVisible(true)}
          >
          <Image src="/icons/check.svg" alt="Check" width={30} height={30} priority/>
        </Button>
      ) : (
        <Button
          className={`transition-colors duration-300 shadow-lg rounded-full w-16 h-16 flex items-center justify-center cursor-pointer ${bgColor}`}
          onClick={() => setTutorialToCVisible(true)}
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


const NotLoggedInAlert: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    console.log("handleToggleExpand", isExpanded);
    setIsExpanded(!isExpanded);
  };

  if (isExpanded) {
    return (
      <AnimatePresence>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0 }}
          className='z-50 pointer-events-auto'
          onPointerMove={stopEventPropagation} onPointerDown={stopEventPropagation}
          >

          <div className="w-96 mx-auto border mt-2 rounded-md shadow-md bg-purple-50 ">
            <div className='relative' >
              <CloseButton onClick={handleToggleExpand}/>            
            </div>            
            <p className="text-center mb-2 mt-2 px-6 text-lg">To save your board, please <br/> sign up and log in to your account.</p>
            <div className="flex justify-center gap-2 mb-1">
              <Link href="/signup" passHref className="px-4 py-2 text-white bg-blue-300 hover:bg-blue-500 rounded transition duration-150 ease-in-out">
                  Sign Up
              </Link>
              <Link href="/signin" passHref className="px-4 py-2 text-white bg-purple-300 hover:bg-purple-500 rounded transition duration-150 ease-in-out">
                  Sign In
              </Link>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>
    );
  } else {
    return (
      <div className="flex items-center justify-center pointer-events-auto mt-2">
        <button onClick={handleToggleExpand} onPointerMove={stopEventPropagation} onPointerDown={stopEventPropagation}
          className="px-4 py-2 text-sm text-white bg-gray-400 hover:bg-gray-600 rounded transition duration-150 ease-in-out">
            Not Logged In
        </button>
      </div>
    );
  }
};




export const TutorialTableOfContents: React.FC = () => {
  const { setStep, toggleTutorialVisibility, tutorialVisible, setTutorialToCVisible } = useBoardContext();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='pointer-events-auto flex flex-col bg-purple-50 w-80 top-80 absolute left-4 rounded-lg'
      onPointerMove={stopEventPropagation} onPointerDown={stopEventPropagation}
    >
      <div className='m-4'>
        <AlertTitle className="ml-2 text-2xl font-semibold text-purple-600">
          Tutorial
          <CloseButton onClick={() => setTutorialToCVisible(false)}/>
          {/* <div className='text-xs text-purple-300'>Click on any step to go to that part of the tutorial.</div> */}
        </AlertTitle>
        <AlertDescription className='text-black mt-1 py-1 flex-grow rounded-md bg-white px-6 shadow-md'>
          <div className="mt-1">
            {tutorialSteps.map((step, index) => (

              <div key={step.id} className="mb-1 rounded hover:bg-purple-100 hover:text-purple-600">
                <a 
                  onClick={() => {
                    console.log(step.props.title);
                    setStep(index);
                    if (!tutorialVisible) {
                      toggleTutorialVisibility();
                      setTutorialToCVisible(false);
                    }
                    
                  }}
                  className="text-lg font-medium  ">
                  {index+1}. {step.props.title}
                </a>
              </div>
            ))}

            </div>
          </AlertDescription>
      </div>
    </motion.div>

  );
};
