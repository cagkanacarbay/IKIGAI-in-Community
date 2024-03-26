"use client"
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
  tutorialToCVisible: boolean;
  setTutorialToCVisible: (isVisible: boolean) => void;
  questionHelperVisible: boolean;
  toggleQuestionHelperVisibility: () => void;
  questionAspectType: AspectType;
  setQuestionAspectType: (type: AspectType) => void;
  step: number;
  setStep: (step: number) => void;
  totalSteps: number;
  isTutorialCompleted: boolean;
  setIsTutorialCompleted: (isCompleted: boolean) => void;
  completedSteps: Set<number>;
  setCurrentStepAsCompleted: () => void;
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
  const [tutorialToCVisible, setTutorialToCVisible] = useState<boolean>(false);
  const [step, setStep] = useState<number>(parseInt(localStorage.getItem('tutorialStep') || '0', 10));
  const [isTutorialCompleted, setIsTutorialCompleted] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());


  useEffect(() => {
    const savedStep = parseInt(localStorage.getItem('tutorialStep') || '0', 10);
    setStep(savedStep);
  
    const tutorialCompleted = localStorage.getItem('tutorialCompleted') === 'true';
    setIsTutorialCompleted(tutorialCompleted);

    const savedCompletedSteps = localStorage.getItem('completedSteps');
    if (savedCompletedSteps) {
      setCompletedSteps(new Set(JSON.parse(savedCompletedSteps)));
    }

  }, []);

  useEffect(() => {
    localStorage.setItem('tutorialStep', step.toString());

  }, [step]);


  const setCurrentStepAsCompleted = () => {
    setCompletedSteps(prevSteps => {
      const newSteps = new Set(prevSteps.add(step));
      localStorage.setItem('completedSteps', JSON.stringify(Array.from(newSteps)));
      return newSteps;
    });

    // console.log("here are all the completed steos: ", completedSteps)
    const allStepsCompleted = tutorialSteps.every((_, index) => completedSteps.has(index));

    if (allStepsCompleted) {
      setIsTutorialCompleted(true);
      localStorage.setItem('tutorialCompleted', 'true');
    }

  };

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
      tutorialToCVisible,
      setTutorialToCVisible,
      step,
      setStep,
      totalSteps: tutorialSteps.length,
      isTutorialCompleted,
      setIsTutorialCompleted,
      completedSteps,
      setCurrentStepAsCompleted
    }}>
      {children}
    </BoardContext.Provider>
  );
};
