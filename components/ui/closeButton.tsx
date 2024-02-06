import React from 'react';
import { Button } from '@/components/ui/button';

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="absolute top-0 right-0 bg-red-200 hover:bg-red-700 p-2"
    >
      <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </Button>
  );
};

export default CloseButton;