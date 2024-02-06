"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Tldraw, Editor, TLStoreWithStatus, TLEditorComponents, TLEventMapHandler, TLUnknownShape, TLRecord } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import IkigaiCircleShapeUtil, { IkigaiCircles } from './shapes/ikigaiCircles';
import { uiOverrides } from './ui/customUi';
import { useSession } from 'next-auth/react';
import { CardShapeTool, CardShapeUtil } from './shapes/try';
import { Toaster } from "@/components/ui/sonner";
import { GuidedTour } from './onboarding/onboardingTour';
import { QuestionHelper } from './onboarding/questionsHelper';
import { useTour } from './onboarding/tourContext';
import AspectShapeUtil, { IAspectShape } from './shapes/aspect';
import { IntroOverlay } from './ui/IntroOverlay';
import UserHelp from './onboarding/userHelp';



const components: TLEditorComponents = {
  // InFrontOfTheCanvas: GuidedTour,
  InFrontOfTheCanvas: UserHelp,
}

const customTools = [CardShapeTool];
const customShapeUtils = [IkigaiCircleShapeUtil, AspectShapeUtil, CardShapeUtil];

interface IkigaiBoardV2Props {
  storeWithStatus?: TLStoreWithStatus;
}

function convertToIAspectShape(record: TLRecord): IAspectShape | null {
  // Implement logic to verify if `record` matches the `IAspectShape` structure
  // This includes checking for the existence and type of specific properties
  // If `record` can be safely treated as `IAspectShape`, return the converted object
  // Otherwise, return null to indicate that conversion is not possible

  if (record.typeName === 'shape' && record.type === 'aspect') {
      // Assuming all necessary properties for IAspectShape are present and valid
      // This is a simplification; you'll need to validate and possibly transform properties as needed
      return record as IAspectShape;
  }

  return null; // Conversion not possible
}


export default function IkigaiBoardV2({ storeWithStatus }: IkigaiBoardV2Props) {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const [editor, setEditor] = useState<Editor>();
  const { addCreatedAspect, addEditedAspect } = useTour();

  const customUiOverrides = uiOverrides(isLoggedIn, editor);
  const [introComplete, setIntroComplete] = useState(false);

  const initializeAppState = useCallback((editor: Editor) => {
    setEditor(editor);
  }, []);

  
  useEffect(() => {
    if (editor && introComplete) {
      setTimeout(() => editor.zoomToFit({ duration: 600 }), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introComplete]);


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

    // Setup the event listener
    const cleanupFunction = editor.store.listen(handleChangeEvent, { source: 'user', scope: 'all' });

    // Return the cleanup function
    return () => {
      cleanupFunction();
    };
  }, [editor, addCreatedAspect]);


  return (
      <div style={{ position: 'fixed', inset: 0 }}>
        {!introComplete && <IntroOverlay onFadeComplete={() => setIntroComplete(true)} />}
        <Toaster />
        <Tldraw
          onMount={initializeAppState}
          store={storeWithStatus}
          overrides={customUiOverrides}
          shapeUtils={customShapeUtils} 
          tools={customTools}
          components={components}
          autoFocus
          persistenceKey="persistence-key"
          className='z-10'
        >
          <UserHelp/>
          <IkigaiCircles/>
          {/* <QuestionHelper />  */}
          {/* <GuidedTour /> */}
        </Tldraw>

      </div>
  );
}
