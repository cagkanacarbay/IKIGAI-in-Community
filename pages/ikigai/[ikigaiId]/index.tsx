import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import IkigaiBoard from '@/components/ikigai/ikigaiBoard';
import { Spinner } from "@material-tailwind/react";
import { IkigaiItems, UserInDB } from '@/lib/types';

interface ApiItem {
  item_id: number;
  type: 'image' | 'tag';
  positions: Array<{ position_id: number; x_position: number; y_position: number; }>;
  text: string;
  image_url: string;
}

export default function Ikigai() {
  const [items, setItems] = useState<IkigaiItems>({});
  const [isLoading, setIsLoading] = useState(true); 
  const [user, setUser] = useState<UserInDB>();
  const router = useRouter();
  const ikigaiId = Array.isArray(router.query.ikigaiId) ? router.query.ikigaiId[0] : router.query.ikigaiId;

  useEffect(() => {
    if (!ikigaiId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const fetchIkigai = async () => {
      try {
        const response = await fetch(`/api/ikigai/${ikigaiId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Ikigai');
        }
        const data = await response.json();
        setUser(data.user);
        setItems(processItems(data.items));
      } catch (error) {
        console.error('Error fetching Ikigai:', error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchIkigai();
  }, [ikigaiId]); // Only re-run the effect if ikigaiId changes

  const processItems = (items: ApiItem[]) => {
    const processedItems: IkigaiItems = {};
    items.forEach((item: any) => {
      const lastPosition = item.positions.reduce((latest: any, current: any) => 
        current.position_id > latest.position_id ? current : latest, item.positions[0]);

      processedItems[item.item_id] = {
        type: item.type as 'image' | 'tag',
        position: { x: lastPosition.x_position, y: lastPosition.y_position },
        text: item.text,
        imageUrl: item.image_url,
        // Add storageUrl if applicable
      };
    });

    return processedItems;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Spinner className="h-16 w-16 text-gray-900/50" />
        <p>Ikigai loading...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <IkigaiBoard ikigaiItems={items} setIkigaiItems={setItems} ownerUser={user} ikigaiId={ikigaiId} />
    </main>
  );
}
