"use client";
import React, { useState, useEffect } from 'react';
import { Tldraw, TLEditorComponents, useEditor, defaultShapeTools, defaultShapeUtils, TLStoreWithStatus } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import IkigaiCircleShape, { IkigaiCircles } from './shapes/ikigaiCircles';
import AspectShape from './shapes/aspect';
import { uiOverrides } from './customUi';
import { useSession } from 'next-auth/react';
import { downloadSnapshot, updateDatabaseSnapshotWithBlobSrc } from './boardStorage';
import { Spinner } from '@material-tailwind/react';
import { useMemo } from 'react'
import { UserPrompt } from '@/components/gpt/UserPrompt'
// import { IkigaiAssistant } from '@/components/gpt/ikigaiAssistant'
import { ulid } from 'ulid';


// const components: TLEditorComponents = {
// 	InFrontOfTheCanvas: () => {
// 		const assistant = useMemo(() => new IkigaiAssistant(), [])
// 		return <UserPrompt assistant={assistant} />
// 	},
// }

const CustomShapes = [IkigaiCircleShape, AspectShape]

interface IkigaiBoardV2Props {
  storeWithStatus?: TLStoreWithStatus
}

export default function IkigaiBoardV2({ storeWithStatus }: IkigaiBoardV2Props) {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const editor = useEditor();
  const customUiOverrides = uiOverrides(isLoggedIn, editor);

  // const [aspects, setAspects] = useState<AspectProps[]>([]);
  // const [aspectIds, setAspectIds] = useState<string[]>([]); // TODO: this should be checed with tldraw state


  // const handleAddAspect = () => {
  //   const aspectId = createShapeId(`aspect-${ulid()}`);

  //   console.log("new aspect ID: ", aspectId)

  //   // Define the properties of the new aspect shape
  //   const newAspect = {
  //     aspectId: aspectId,
  //     x: 600, // Example position
  //     y: 600, // Example position
  //     tag: 'New aspect with a long name ',
  //     color: 'blue',
  //     w: 160,
  //     h: 40
  //   };
  //   setAspects(prevAspects => [...prevAspects, newAspect]);
  //   console.log(aspects)
  // };

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
              {/* <button  
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
      onClick={handleAddAspect}>Add Aspect
    </button> */}
      <Tldraw 
        // hideUi
        store={storeWithStatus}
        overrides={customUiOverrides}
        shapeUtils={CustomShapes} 
        // components={components}
        autoFocus
        persistenceKey="persistence-key"
        >

        {/* <IkigaiCircles/> */}
        {/* Render an Aspect component for each item in the aspects array */}
        {/* {aspects.map((aspect, index) => (
          <Aspect key={index} {...aspect} />
        ))} */}

      </Tldraw>
    </div>

  );
}




