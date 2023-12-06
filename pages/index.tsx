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


  useEffect(() => {
    // Check local storage for saved ikigaiItems
    const savedItems = localStorage.getItem('ikigaiItems');
    console.log(savedItems)
    if (savedItems) {
      setItems(JSON.parse(savedItems));
      setShowEmptyState(false); 
      setBoardLoaded(true);     
    }
  }, []);
  
  const handleLoadIkigai = async (file: File) => {
    const ikigaiItems = await loadIkigaiBoard(file);
    if (ikigaiItems) {
        setItems(ikigaiItems);
        setBoardLoaded(true);
    }
  };

  useEffect(() => {
    if (boardLoaded) {
      console.log("Updated items state", items);
      setShowEmptyState(false);
      localStorage.setItem('ikigaiItems', JSON.stringify(items));
      const savedItems = localStorage.getItem('ikigaiItems');

      console.log(savedItems)
    }
  }, [items, boardLoaded]);

  useEffect(() => {
    const fetchAndCreateBlobUrls = async () => {
      const updatedItems = { ...items };
  
      for (const key in items) {
        const item = items[key];
        if (item.type === 'image' && item.storageUrl) {
          try {
            const response = await fetch(item.storageUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            updatedItems[key] = { ...item, imageUrl: blobUrl };
          } catch (error) {
            console.error('Error fetching image:', error);
          }
        }
      }
  
      setItems(updatedItems);
    };
  
    if (boardLoaded) {
      fetchAndCreateBlobUrls();
    }
  }, [boardLoaded]);
  

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

