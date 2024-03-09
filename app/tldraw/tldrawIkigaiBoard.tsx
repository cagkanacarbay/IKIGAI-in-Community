"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Tldraw, Editor, TLStoreWithStatus, TLEditorComponents, TLEventMapHandler, TLUnknownShape, TLRecord } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import IkigaiCircleShapeUtil, { IkigaiCircles } from './shapes/ikigaiCircles';
import { uiOverrides } from './ui/customUi';
import { useSession } from 'next-auth/react';
import { Toaster } from "@/components/ui/sonner";
import { useBoardContext } from './boardContext';
import AspectShapeUtil, { IAspectShape } from './shapes/aspect';
import { IntroOverlay } from './ui/IntroOverlay';
import DemoTour from './onboarding/demoTour';
import InFrontOfTheCanvasComponents from './onboarding/inFrontOfCanvasComponents';
import { UserGuide } from './onboarding/userGuide/UserGuide';


const components: TLEditorComponents = {
  // InFrontOfTheCanvas: GuidedTour,
  OnTheCanvas: UserGuide,
  InFrontOfTheCanvas: InFrontOfTheCanvasComponents,
}

// const customTools = [];
const customShapeUtils = [IkigaiCircleShapeUtil, AspectShapeUtil];

interface IkigaiBoardV2Props {
  storeWithStatus?: TLStoreWithStatus;
}

function convertToIAspectShape(record: TLRecord): IAspectShape | null {
  if (record.typeName === 'shape' && record.type === 'aspect') {
      return record as IAspectShape;
  }

  return null; 
}


export default function IkigaiBoardV2({ storeWithStatus }: IkigaiBoardV2Props) {
  
  // Authentication
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);

  // TLDRAW
  const [editor, setEditor] = useState<Editor>();
  const customUiOverrides = uiOverrides(isLoggedIn, editor);

  // Event Tracking
  const { addCreatedAspect, addEditedAspect } = useBoardContext();

  // Loader and intro sequence
  const [introCompleted, setIntroComplete] = useState(false);
  const [loadWelcome, setLoadWelcome] = useState(false);

  const initializeAppState = useCallback((editor: Editor) => {
    setEditor(editor);
  }, []);

  
  useEffect(() => {
    if (editor && introCompleted) {
      setTimeout(() => editor.zoomToFit({ duration: 600 }), 100);
      setTimeout(() => setLoadWelcome(false), 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introCompleted]);


  useEffect(() => {
    if (!editor) return;

    const handleChangeEvent: TLEventMapHandler<'change'> = (change) => {

      Object.values(change.changes.added)
      .filter(record => record.typeName === 'shape' && record.type === 'aspect')
      .forEach(record => {
          const aspectShape = convertToIAspectShape(record);
          if (aspectShape) {
              addCreatedAspect(aspectShape);
              console.log("User created a new aspect", aspectShape);
          }
      });

  
      // TODO: Update TLRecords into IAspectShapes like above
      // for (const [from, to] of Object.values(change.changes.updated)) {
      //   if (
      //     from.typeName === 'shape' &&
      //     to.typeName === 'shape' &&
      //     from.type === 'aspect' &&
      //     to.type === 'aspect'
      //   ) {
      //     console.log("User edited an aspect", from, to);
      //     addEditedAspect(from, to);
      //   }
      // }


      for (const record of Object.values(change.changes.removed)) {
        if (record.typeName === 'shape' && record.type === 'aspect') {
          console.log("Got a delete event")
          // logChangeEvent(`deleted aspect (${record.type})`);
        }
      }
    };

    const cleanupFunction = editor.store.listen(handleChangeEvent, { source: 'user', scope: 'all' });

    return () => {
      cleanupFunction();
    };
  }, [editor, addCreatedAspect]);


  return (
      <div style={{ position: 'fixed', inset: 0 }} id="tldraw-ikigai-board">
        {/* {!introCompleted && <IntroOverlay onFadeComplete={() => setIntroComplete(true)} />} */}
        <Toaster />
        <Tldraw
          onMount={initializeAppState}
          store={storeWithStatus}
          overrides={customUiOverrides}
          shapeUtils={customShapeUtils} 
          // tools={customTools}
          components={components}
          autoFocus
          persistenceKey="persistence-key"
          className='z-10'
        >

          {loadWelcome && (
            <div className="transition-opacity duration-700 ease-in border border-black">
              <InFrontOfTheCanvasComponents />
            </div>
          )}     

          <IkigaiCircles />

          { /* These are invisible divs that allows driverjs to highlight the center of the screen */}
          <div id="mid-screen-driverjs" className="absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[65vh] w-[65vw] pointer-events-none"></div>  
          <div id="user-guide-heart-driverjs" className="fixed z-50 left-0 top-0 bg-red-50 w-full h-1/3 pointer-events-none"></div>


          {/* <DemoTour /> */}
        </Tldraw>

      </div>
  );
}
