import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { IAspectShape } from './shapes/aspect';
import { AspectType } from '@/lib/types';
import { tutorialSteps } from './onboarding/tutorial/welcomeSteps';

interface BoardContextType {
  createdAspects: IAspectShape[];
  addCreatedAspect: (aspect: IAspectShape) => void;
  editedAspects: { fromAspect: IAspectShape, toAspect: IAspectShape }[];
  addEditedAspect: (fromAspect: IAspectShape, toAspect: IAspectShape) => void;
  userGuideVisible: boolean;
  toggleUserGuideVisibility: () => void;
  tutorialVisible: boolean;
  toggleTutorialVisibility: () => void;
  questionHelperVisible: boolean;
  toggleQuestionHelperVisibility: () => void;
  questionAspectType: AspectType;
  setQuestionAspectType: (type: AspectType) => void;
  step: number;
  setStep: (step: number) => void;
  totalSteps: number;
  isTutorialCompleted: boolean;
  setIsTutorialCompleted: (isCompleted: boolean) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within a BoardProvider');
  }
  return context;
};

export const BoardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [createdAspects, setCreatedAspects] = useState<IAspectShape[]>([]);
  const [editedAspects, setEditedAspects] = useState<{ fromAspect: IAspectShape, toAspect: IAspectShape }[]>([]);
  const [questionAspectType, setQuestionAspectType] = useState<AspectType>("community");
  const [userGuideVisible, setUserGuideVisible] = useState<boolean>(false); 
  const [questionHelperVisible, setQuestionHelperVisible] = useState<boolean>(false); 
  const [tutorialVisible, setTutorialVisible] = useState<boolean>(false);
  const [step, setStep] = useState<number>(parseInt(localStorage.getItem('tutorialStep') || '0', 10));
  const [isTutorialCompleted, setIsTutorialCompleted] = useState<boolean>(false);

  useEffect(() => {
    const savedStep = parseInt(localStorage.getItem('tutorialStep') || '0', 10);
    setStep(savedStep);

    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (tutorialCompleted === 'true') {
      setIsTutorialCompleted(true);
    }

  }, []);

  useEffect(() => {
    localStorage.setItem('tutorialStep', step.toString());

    if (step === tutorialSteps.length - 1) {
      setIsTutorialCompleted(true);
      localStorage.setItem('tutorialCompleted', 'true');
    }
  }, [step]);



  const addCreatedAspect = (aspect: IAspectShape) => {
    setCreatedAspects((prevAspects) => [...prevAspects, aspect]);
  };

  const addEditedAspect = (fromAspect: IAspectShape, toAspect: IAspectShape) => {
    setEditedAspects([...editedAspects, { fromAspect, toAspect }]);
  };

  const toggleUserGuideVisibility = () => setUserGuideVisible(!userGuideVisible);
  const toggleQuestionHelperVisibility = () => setQuestionHelperVisible(!questionHelperVisible);
  const toggleTutorialVisibility = () => setTutorialVisible(!tutorialVisible);

  return (
    <BoardContext.Provider value={{
      createdAspects,
      addCreatedAspect,
      editedAspects,
      addEditedAspect,
      userGuideVisible, 
      toggleUserGuideVisibility, 
      questionHelperVisible,
      toggleQuestionHelperVisibility,
      questionAspectType,
      setQuestionAspectType,
      tutorialVisible,
      toggleTutorialVisibility,
      step,
      setStep,
      totalSteps: tutorialSteps.length,
      isTutorialCompleted,
      setIsTutorialCompleted
    }}>
      {children}
    </BoardContext.Provider>
  );
};
