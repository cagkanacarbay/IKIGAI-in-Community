import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import IkigaiBoard from '@/components/ikigai/ikigaiBoard';
import { IkigaiItems, IkigaiItem, Position } from '@/lib/types';


export default function CreateIkigai() {
  const [items, setItems] = useState<IkigaiItems>({});
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="relative">
        <IkigaiBoard ikigaiItems={items} setIkigaiItems={setItems}/>
      </div>
    </main>
  );
}
