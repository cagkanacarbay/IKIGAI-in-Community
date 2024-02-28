import React, { createContext, useContext, ReactNode, useState } from 'react';
import { TLRecord } from '@tldraw/tldraw';
import { IAspectShape } from './shapes/aspect';

interface BoardContextType {
  createdAspects: IAspectShape[];
  addCreatedAspect: (aspect: IAspectShape) => void;
  editedAspects: { fromAspect: IAspectShape, toAspect: IAspectShape }[];
  addEditedAspect: (fromAspect: IAspectShape, toAspect: IAspectShape) => void;
  userGuideVisible: boolean;
  toggleUserGuideVisibility: () => void;
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

  const addCreatedAspect = (aspect: IAspectShape) => {
    setCreatedAspects((prevAspects) => [...prevAspects, aspect]);
  };

  const addEditedAspect = (fromAspect: IAspectShape, toAspect: IAspectShape) => {
    setEditedAspects([...editedAspects, { fromAspect, toAspect }]);
  };

  const toggleUserGuideVisibility = () => setUserGuideVisible(!userGuideVisible); 

  return (
    <BoardContext.Provider value={{
      createdAspects,
      addCreatedAspect,
      editedAspects,
      addEditedAspect,
      userGuideVisible, 
      toggleUserGuideVisibility, 
    }}>
      {children}
    </BoardContext.Provider>
  );
};
