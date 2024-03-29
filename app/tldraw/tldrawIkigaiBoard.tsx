"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Tldraw, Editor, TLStoreWithStatus, TLEditorComponents, TLEventMapHandler, TLUnknownShape, TLRecord } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import IkigaiCircleShapeUtil, { IkigaiCircles } from './shapes/ikigaiCircles';
import { uiOverrides } from './ui/customUI/customUi';
import { useSession } from 'next-auth/react';
import { Toaster } from "@/components/ui/sonner";
import { useBoardContext } from './boardContext';
import AspectShapeUtil, { IAspectShape } from './shapes/aspect';
import { IntroOverlay } from './ui/IntroOverlay';
import InFrontOfTheCanvasComponents from './onboarding/inFrontOfCanvasComponents';
import { UserGuide } from './onboarding/userGuide/UserGuide';
import CustomActionsMenu from './ui/customUI/customActions';
import CustomToolbar from './ui/customUI/customToolbar';
import { customAssetUrls } from './ui/customUI/customAssets';
import { DefaultToolbar, useTools, TLComponents, DefaultKeyboardShortcutsDialog, DefaultKeyboardShortcutsDialogContent, TldrawUiMenuItem} from 'tldraw'
import 'tldraw/tldraw.css'
import { aspectTypeTools } from './ui/customUI/aspectTypeTools';
import CustomQuickActions from './ui/customUI/customQuickActions';


const components: TLComponents = {
  Toolbar: CustomToolbar, 
  OnTheCanvas: UserGuide,
  InFrontOfTheCanvas: InFrontOfTheCanvasComponents,
  ActionsMenu: null,
  PageMenu: null,
  QuickActions: CustomQuickActions,
  HelpMenu: null
  // ActionsMenu: CustomActionsMenu,
  // KeyboardShortcutsDialog: (props) => {
	// 	const tools = useTools() 
	// 	return (
	// 		<DefaultKeyboardShortcutsDialog {...props}>
	// 			<DefaultKeyboardShortcutsDialogContent />
	// 			{/* Ideally, we'd interleave this into the tools group */}
	// 			{/* <TldrawUiMenuItem {...tools['arrow']} /> */}
	// 		</DefaultKeyboardShortcutsDialog>
	// 	)
	// },
}


const customTools = [...aspectTypeTools];
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
  const [ hasUnsavedChanges, setHasUnsavedChanges ] = useState(false);

  // Loader and intro sequence
  const [introCompleted, setIntroComplete] = useState(false);
  const [loadWelcome, setLoadWelcome] = useState(false);

  const initializeAppState = useCallback((editor: Editor) => {
    setEditor(editor);
  }, []);

  const [storeEvents, setStoreEvents] = useState<string[]>([])

  
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


      // Create new aspect events
      Object.values(change.changes.added)
      .filter(record => record.typeName === 'shape' && record.type === 'aspect')
      .forEach(record => {
          const aspectShape = convertToIAspectShape(record);
          if (aspectShape) {
              // add to store events
              // setStoreEvents([...storeEvents, {aspectShape.id}])
              addCreatedAspect(aspectShape);
              // console.log("User created a new aspect", aspectShape);
              console.log(record)

          }
      });

  
      // TODO: Update TLRecords into IAspectShapes like above
      for (const [from, to] of Object.values(change.changes.updated)) {
        if (
          from.typeName === 'shape' &&
          to.typeName === 'shape' &&
          from.type === 'aspect' &&
          to.type === 'aspect'
        ) {
          // console.log("User edited an aspect", from, to);
          // addEditedAspect(from, to);
        }
      }


      for (const record of Object.values(change.changes.removed)) {
        if (record.typeName === 'shape' && record.type === 'aspect') {
          // console.log("Got a delete event")
          // logChangeEvent(`deleted aspect (${record.type})`);
        }
      }
    };

    const cleanupFunction = editor.store.listen(handleChangeEvent, { source: 'user', scope: 'all' });

    return () => {
      cleanupFunction();
    };
  }, [editor, addCreatedAspect]);


  useEffect(() => {
    // This useEffect ensures the user gets a chance to save their changes before quitting
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      console.log("beforeunload")
      e.preventDefault();
      e.returnValue = '';
    };

    const handleUnload = () => {
      return "Navigating away will lose the changes you've made to your board. Please save if you'd like to keep your changes.";
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.onbeforeunload = handleUnload;

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.onbeforeunload = null;
    };
  }, []);

  return (
      <div style={{ position: 'fixed', inset: 0 }} id="tldraw-ikigai-board">
        {/* {!introCompleted && <IntroOverlay onFadeComplete={() => setIntroComplete(true)} />} */}
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
          assetUrls={customAssetUrls}
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
