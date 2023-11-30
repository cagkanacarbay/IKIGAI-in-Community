import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import IkigaiBoard from '@/components/ikigai/ikigaiBoard';
import { Spinner } from "@material-tailwind/react";
import { IkigaiItems, IkigaiItem, Position } from '@/lib/types';
import { UserInDB } from '@/lib/types';


export default function Ikigai() {
  const [items, setItems] = useState<IkigaiItems>({});
  const [isLoading, setIsLoading] = useState(false); 
  const [user, setUser] = useState<UserInDB>();
  const router = useRouter();
  const { ikigaiId } = router.query;

  useEffect(() => {
    const fetchIkigai = async () => {
      if (ikigaiId) {
        setIsLoading(true); 
        try {
          const response = await fetch(`/api/ikigai/${ikigaiId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch Ikigai');
          }
          const data = await response.json();
          setUser(data.user);

          // Process items to add a position attribute
          const processedItems: IkigaiItems = {};
          data.items.forEach((item: any) => {
            const lastPosition = item.positions.reduce((latest: any, current: any) => 
              current.position_id > latest.position_id ? current : latest, item.positions[0]);

            const position: Position = {
              x: lastPosition.x_position,
              y: lastPosition.y_position,
            };

            processedItems[item.item_id] = {
              type: item.type as 'image' | 'tag',
              position,
              text: item.text,
              imageUrl: item.image_url,
              storageUrl: undefined // Add storageUrl if applicable
            };
          });
          
          console.log(data)
          console.log(processedItems);
          setItems(processedItems);
        } catch (error) {
          console.error('Error fetching Ikigai:', error);
        } finally {
          setIsLoading(false); 
        }
      }
    };

    fetchIkigai();
  }, [ikigaiId]);
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="relative">
        {isLoading ? (
            <div className="flex flex-col justify-center items-center">
            <Spinner className="h-16 w-16 text-gray-900/50" />
            <br></br>
            Ikigai loading...
          </div>
        ) : (
          <IkigaiBoard ikigaiItems={items} setIkigaiItems={setItems} ownerUser={user} ikigaiId={Array.isArray(ikigaiId) ? ikigaiId[0] : ikigaiId}/>
        )}
      </div>
    </main>
  );
}
