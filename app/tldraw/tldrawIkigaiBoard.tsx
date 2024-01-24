"use client";
import React, { useState, useEffect } from 'react';
import { Tldraw, TLEditorComponents, useEditor, defaultShapeTools, defaultShapeUtils, TLStoreWithStatus } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import IkigaiCircleShape, { IkigaiCircles } from './shapes/ikigaiCircles';
import AspectShape from './shapes/aspect';
import { uiOverrides } from './ui/customUi';
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



  return (
    <div style={{ position: 'fixed', inset: 0 }}>

      <Tldraw 
        // hideUi
        store={storeWithStatus}
        overrides={customUiOverrides}
        shapeUtils={CustomShapes} 
        // components={components}
        autoFocus
        persistenceKey="persistence-key"
        >

        <IkigaiCircles/>


      </Tldraw>
    </div>

  );
}




