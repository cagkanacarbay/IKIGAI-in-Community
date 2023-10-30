import Icon from '@/components/icons';
import React, { useEffect } from "react";

const Modal: React.FC<{ image: string; onClose: () => void }> = ({
  image,
  onClose,
}) => {
  useEffect(() => {
    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscapePress);

    return () => {
      window.removeEventListener("keydown", handleEscapePress);
    };
  }, [onClose]);

  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div className="bg-white p-2 relative inline-block">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 p-2 rounded bg-slate-300 hover:bg-slate-400 focus:outline-none"
        >
          <Icon iconName="close" size={36}/>
        </button>
        <img src={image} alt="Full Size" className="block object-contain mx-auto max-h-[calc(100vh-4rem)]" />
      </div>
    </div>
  );
};

export default Modal;
