import React, { createContext, useContext, ReactNode, useState } from 'react';
import { TLRecord } from '@tldraw/tldraw';
import { IAspectShape } from './shapes/aspect';
import { AspectType } from '@/lib/types';


interface BoardContextType {
  createdAspects: IAspectShape[];
  addCreatedAspect: (aspect: IAspectShape) => void;
  editedAspects: { fromAspect: IAspectShape, toAspect: IAspectShape }[];
  addEditedAspect: (fromAspect: IAspectShape, toAspect: IAspectShape) => void;
  userGuideVisible: boolean;
  toggleUserGuideVisibility: () => void;
  questionHelperVisible: boolean;
  toggleQuestionHelperVisibility: () => void;
  questionAspectType: AspectType;
  setQuestionAspectType: (type: AspectType) => void;
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
  const [userGuideVisible, setUserGuideVisible] = useState<boolean>(false); 
  const [questionHelperVisible, setQuestionHelperVisible] = useState<boolean>(false); 
  const [questionAspectType, setQuestionAspectType] = useState<AspectType>("community");

  const addCreatedAspect = (aspect: IAspectShape) => {
    setCreatedAspects((prevAspects) => [...prevAspects, aspect]);
  };

  const addEditedAspect = (fromAspect: IAspectShape, toAspect: IAspectShape) => {
    setEditedAspects([...editedAspects, { fromAspect, toAspect }]);
  };

  const toggleUserGuideVisibility = () => setUserGuideVisible(!userGuideVisible); 
  const toggleQuestionHelperVisibility = () => setQuestionHelperVisible(!questionHelperVisible);

  const setQuestionAspectTypeAndShowHelper = (type: AspectType) => {
    // console.log("Setting question aspect type in Context to: ", type)
    setQuestionAspectType(type);
    setQuestionHelperVisible(true);
  };

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
      setQuestionAspectType: setQuestionAspectTypeAndShowHelper
    }}>
      {children}
    </BoardContext.Provider>
  );
};
