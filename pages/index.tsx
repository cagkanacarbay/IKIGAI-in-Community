import React, { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import IkigaiBoard from '@/components/ikigai/ikigaiBoard';
import IkigaiEmptyState from '@/components/ikigai/emptyState'; // Ensure to import the IkigaiEmptyState component
import { initialItems } from "@/lib/dummyData";
import JSZip from 'jszip';
import { IkigaiItems } from '@/lib/types';


const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [items, setItems] = useState<IkigaiItems>({});

  const [showEmptyState, setShowEmptyState] = useState(true);
  const [boardLoaded, setBoardLoaded] = useState(false);
  // const [items, setItems] = useState({});
  
  const handleLoadIkigai = async (file: File) => {

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension !== 'zip') {
        console.error("The selected file is not a ZIP file.");
      return;
    }

    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      const ikigaiItemsJSON = await zipContent.file("ikigaiItems.json")?.async("text");
      const ikigaiItems: IkigaiItems = JSON.parse(ikigaiItemsJSON!);

      if (!ikigaiItems || typeof ikigaiItems !== 'object') {
        throw new Error("Invalid JSON structure.");
      }

      // Step 1: Iterate through the images in the ZIP and convert them to blob URLs
      const imageBlobs = {};
      const imageFilePromises = Object.values(ikigaiItems)
        .filter(item => item.type === 'image' && item.imageUrl)
        .map(async item => {
          const imageData = await zipContent.file(item.imageUrl)?.async('blob');
          const blobUrl = URL.createObjectURL(imageData);
          imageBlobs[item.imageUrl] = blobUrl;
        });

      await Promise.all(imageFilePromises);

      // Step 2: Update the imageUrl for each item
      Object.values(ikigaiItems).forEach(item => {
        if (item.type === 'image' && item.imageUrl && imageBlobs[item.imageUrl]) {
          item.imageUrl = imageBlobs[item.imageUrl];
        }
      });

      // Set the updated items to the state
      setItems(ikigaiItems);
      setBoardLoaded(true);
      console.log("Loaded ikigai items", ikigaiItems)



    } catch (err) {
      console.error("Error processing the ZIP file:", err.message);
    }
  };

  useEffect(() => {
    console.log("Updated items state", items);
    // setShowEmptyState(false);
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

