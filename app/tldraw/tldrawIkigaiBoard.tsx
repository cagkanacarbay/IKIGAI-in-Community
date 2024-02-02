"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Tldraw, Editor, TLStoreWithStatus, TLEditorComponents, TLEventMapHandler, TLUnknownShape, TLRecord } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import IkigaiCircleShapeUtil, { IkigaiCircles } from './shapes/ikigaiCircles';
import AspectShapeUtil from './shapes/aspect';
import { uiOverrides } from './ui/customUi';
import { useSession } from 'next-auth/react';
import { CardShapeTool, CardShapeUtil } from './shapes/try';
import { Toaster } from "@/components/ui/sonner";
import { GuidedTour } from './onboarding/onboardingTour';
import { useTour } from './onboarding/tourContext';

const components: TLEditorComponents = {
  InFrontOfTheCanvas: GuidedTour,
}

const customTools = [CardShapeTool];
const customShapeUtils = [IkigaiCircleShapeUtil, AspectShapeUtil, CardShapeUtil];

interface IkigaiBoardV2Props {
  storeWithStatus?: TLStoreWithStatus;
}

export default function IkigaiBoardV2({ storeWithStatus }: IkigaiBoardV2Props) {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const [editor, setEditor] = useState<Editor>();
  const { addCreatedAspect, addEditedAspect } = useTour();

  const customUiOverrides = uiOverrides(isLoggedIn, editor);

  const setAppToState = useCallback((editor: Editor) => {
    setEditor(editor);
  }, []);

  useEffect(() => {
    if (!editor) return;

    const handleChangeEvent: TLEventMapHandler<'change'> = (change) => {

      const newAspects = Object.values(change.changes.added)
        .filter(record => record.typeName === 'shape' && record.type === 'aspect');

      if (newAspects.length > 0) {
        addCreatedAspect(newAspects[0]);
        newAspects.forEach(aspect => console.log("User created a new aspect", aspect));
      }

      for (const [from, to] of Object.values(change.changes.updated)) {
        if (
          from.typeName === 'shape' &&
          to.typeName === 'shape' &&
          from.type === 'aspect' &&
          to.type === 'aspect'
        ) {
          console.log("User edited an aspect", from, to);
          addEditedAspect(from, to);
        }
      }
      // // Tracking Changed page events, we dont need this
      // for (const [from, to] of Object.values(change.changes.updated)) {
      //   if (
      //     from.typeName === 'instance' &&
      //     to.typeName === 'instance' &&
      //     from.currentPageId !== to.currentPageId
      //   ) {
      //     console.log("Some change happened to the page??", from, to);
      //     logChangeEvent(`changed page (${from.currentPageId}, ${to.currentPageId})`);
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
        <Toaster />
        <Tldraw
          onMount={setAppToState}
          store={storeWithStatus}
          overrides={customUiOverrides}
          shapeUtils={customShapeUtils} 
          tools={customTools}
          components={components}
          autoFocus
          persistenceKey="persistence-key"
        >
          <IkigaiCircles/>
          <GuidedTour />
        </Tldraw>

      </div>
  );
}
