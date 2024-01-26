"use client";
import React, { useState, useEffect } from 'react';
import { Tldraw, useEditor, TLStoreWithStatus } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import IkigaiCircleShapeUtil, { IkigaiCircles } from './shapes/ikigaiCircles';
import AspectShapeUtil from './shapes/aspect';
import { uiOverrides } from './ui/customUi';
import { useSession } from 'next-auth/react';
import { CardShapeTool, CardShapeUtil } from './shapes/try';
import { Toaster } from "@/components/ui/sonner"


// const components: TLEditorComponents = {
// 	InFrontOfTheCanvas: () => {
// 		const assistant = useMemo(() => new IkigaiAssistant(), [])
// 		return <UserPrompt assistant={assistant} />
// 	},
// }

const customTools = [CardShapeTool]
const customShapeUtils = [IkigaiCircleShapeUtil, AspectShapeUtil, CardShapeUtil]

interface IkigaiBoardV2Props {
  storeWithStatus?: TLStoreWithStatus
}

export default function IkigaiBoardV2({ storeWithStatus }: IkigaiBoardV2Props) {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const editor = useEditor();
  const customUiOverrides = uiOverrides(isLoggedIn, editor);


  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Toaster />
      <Tldraw 
        // hideUi
        store={storeWithStatus}
        overrides={customUiOverrides}
        shapeUtils={customShapeUtils} 
        tools={customTools}
        // components={components}
        autoFocus
        persistenceKey="persistence-key"
        >

        <IkigaiCircles/>


      </Tldraw>
    </div>

  );
}




