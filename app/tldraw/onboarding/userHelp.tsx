import React, { useState, useEffect } from 'react';
import { GuidedTour } from './onboardingTour';
import { QuestionHelper } from './questionsHelper';




const UserHelp: React.FC = ({}) => {

  return (
    <>
      <GuidedTour />
      <QuestionHelper />
    </>
  );
};

export default UserHelp;