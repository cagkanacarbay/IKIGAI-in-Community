import React, { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import IkigaiBoard from '@/components/ikigai/ikigaiBoard';
import IkigaiEmptyState from '@/components/ikigai/emptyState'; 
import { IkigaiItems } from '@/lib/types';
import loadIkigaiBoard from '@/lib/loadBoard';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [items, setItems] = useState<IkigaiItems>({});

  const [showEmptyState, setShowEmptyState] = useState(true);
  const [boardLoaded, setBoardLoaded] = useState(false);
  // const [items, setItems] = useState({});
  
  const handleLoadIkigai = async (file: File) => {
    const ikigaiItems = await loadIkigaiBoard(file);
    if (ikigaiItems) {
        setItems(ikigaiItems);
        setBoardLoaded(true);
    }
  };

  useEffect(() => {
    console.log("Updated items state", items);
    if (boardLoaded) {
      setShowEmptyState(false);
    }
  }, [items, boardLoaded]);

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`}>
      <div className="relative">

      {showEmptyState ? (
      <>
        <IkigaiBoard ikigaiItems={items} setIkigaiItems={setItems} />
        <IkigaiEmptyState 
          onCreateBoard={() => setShowEmptyState(false)} 
          onLoadBoard={handleLoadIkigai}
        />
      </>
    ) : (
      <IkigaiBoard ikigaiItems={items} setIkigaiItems={setItems} />
    )}
      </div>
    </main>
  );
}

