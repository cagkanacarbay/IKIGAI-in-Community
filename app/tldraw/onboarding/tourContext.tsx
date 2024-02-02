import React, { createContext, useContext, ReactNode, useState } from 'react';
import { TLRecord } from '@tldraw/tldraw';
import { IAspectShape } from '../shapes/aspect';

interface TourContextType {
  createdAspects: IAspectShape[];
  addCreatedAspect: (aspect: IAspectShape) => void;
  editedAspects: { fromAspect: IAspectShape, toAspect: IAspectShape }[];
  addEditedAspect: (fromAspect: IAspectShape, toAspect: IAspectShape) => void;
}
const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

export const TourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [createdAspects, setCreatedAspects] = useState<IAspectShape[]>([]);

  const addCreatedAspect = (aspect: IAspectShape) => {
    setCreatedAspects((prevAspects) => [...prevAspects, aspect]);
  };

  const [editedAspects, setEditedAspects] = useState<{ fromAspect: IAspectShape, toAspect: IAspectShape }[]>([]);

  const addEditedAspect = (fromAspect: IAspectShape, toAspect: IAspectShape) => {
    setEditedAspects([...editedAspects, { fromAspect, toAspect }]);
  };

  return (
    <TourContext.Provider value={{ createdAspects, addCreatedAspect, editedAspects, addEditedAspect }}>
      {children}
    </TourContext.Provider>
  );
};
