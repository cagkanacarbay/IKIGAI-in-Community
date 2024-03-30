"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Tldraw, Editor, TLStoreWithStatus, TLRecord, TLShapeId, TLEventMapHandler, TLUnknownShape } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import IkigaiCircleShapeUtil, { IkigaiCircles } from './shapes/ikigaiCircles';
import { uiOverrides } from './ui/customUI/customUi';
import { useSession } from 'next-auth/react';
import { Toaster } from "@/components/ui/sonner";
import { useBoardContext } from './boardContext';
import AspectShapeUtil from './shapes/aspect';
import { IntroOverlay } from './ui/IntroOverlay';
import InFrontOfTheCanvasComponents from './onboarding/inFrontOfCanvasComponents';
// import { UserGuide } from './onboarding/userGuide/UserGuide';
import CustomActionsMenu from './ui/customUI/customActions';
import CustomToolbar from './ui/customUI/customToolbar';
import { customAssetUrls } from './ui/customUI/customAssets';
import { DefaultToolbar, useTools, TLComponents, DefaultKeyboardShortcutsDialog, DefaultKeyboardShortcutsDialogContent, TldrawUiMenuItem} from 'tldraw'
import 'tldraw/tldraw.css'
import { aspectTypeTools } from './ui/customUI/aspectTypeTools';
import CustomQuickActions from './ui/customUI/customQuickActions';
import _ from 'lodash';


const components: TLComponents = {
  Toolbar: CustomToolbar, 
  // OnTheCanvas: UserGuide,
  InFrontOfTheCanvas: InFrontOfTheCanvasComponents,
  ActionsMenu: null,
  PageMenu: null,
  QuickActions: CustomQuickActions,
  HelpMenu: null
}


const customTools = [...aspectTypeTools];
export const customShapeUtils = [IkigaiCircleShapeUtil, AspectShapeUtil];

interface IkigaiBoardV2Props {
  storeWithStatus?: TLStoreWithStatus;
  // ikigaiId?: string;
}

export default function IkigaiBoardV2({ storeWithStatus }: IkigaiBoardV2Props) {
  
  // Authentication
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);

  // TLDRAW
  const [editor, setEditor] = useState<Editor>();
  const customUiOverrides = uiOverrides(isLoggedIn, editor);

  // Event Tracking
  const { hasUnsavedChanges, setHasUnsavedChanges } = useBoardContext();

  // Loader and intro sequence
  const [introCompleted, setIntroComplete] = useState(false);
  const [loadWelcome, setLoadWelcome] = useState(false);

  const initializeAppState = useCallback((editor: Editor) => {

    const unlockLoadedShapes = () => {
      // Objects are locked when saved to the database for some reason. Unlock them here on load
      const shapesToUnlock: TLShapeId[] = [];

      const snapshot = editor.store.getSnapshot()
      // console.log("snapshot", snapshot)

      // Iterate over the snapshot to find shapes that are locked
      Object.entries(snapshot.store).forEach(([id, shape]) => {
          // Check if the key indicates a shape and the shape is not an ikigaiCircle
          if (id.startsWith("shape:") && !id.includes("ikigaiCircle") ) {
            if ((shape as any).isLocked) {
              shapesToUnlock.push(id as TLShapeId)
            }
          }
      });
      editor.toggleLock(shapesToUnlock);

    }

    setTimeout(unlockLoadedShapes, 200);

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
      // Here we listen to board events and if there is any relevant change
      // we set the hasUnsavedChanges to true so the user can see the save button

      // Added a shape to the board
      for (const record of Object.values(change.changes.added)) {
				if (record.typeName === 'shape') {
					setHasUnsavedChanges(true);
				}
			}

			// Updated a shape on the board
			for (const [from, to] of Object.values(change.changes.updated)) {
				// if (
				// 	from.typeName === 'instance' &&
				// 	to.typeName === 'instance' &&
				// 	from.currentPageId !== to.currentPageId
				// ) {
				// 	logChangeEvent(`changed page (${from.currentPageId}, ${to.currentPageId})`)
				// } else 
        if (from.id.startsWith('shape') && to.id.startsWith('shape')) {
          
					let diff = _.reduce(
						from,
						(result: any[], value: any, key: string) =>
							_.isEqual(value, (to as any)[key]) ? result : result.concat([key, (to as any)[key]]),
						[]
					)
					if (diff?.[0] === 'props') {
						diff = _.reduce(
							(from as any).props,
							(result: any[], value: string, key: string) =>
								_.isEqual(value, (to as any).props[key])
									? result
									: result.concat([key, (to as any).props[key]]),
							[]
						)
					}
          setHasUnsavedChanges(true);
				}
			}

			// Removed a shape from the board
			for (const record of Object.values(change.changes.removed)) {
				if (record.typeName === 'shape') {
					setHasUnsavedChanges(true);
				}
			}

    //   console.log("Type of change:", typeof change);
    //   console.log("Change object:", change);
    //       // Create new aspect events
    //   Object.values(change.changes.added)
    //   .filter(record => record.typeName === 'shape' && record.type === 'aspect')
    //   .forEach(record => {
    //       const aspectShape = convertToIAspectShape(record);
    //       if (aspectShape) {
    //           console.log("User created a new aspect", aspectShape);
    //       }
    //   });
  
    //   // TODO: Update TLRecords into IAspectShapes like above
    //   for (const [from, to] of Object.values(change.changes.updated)) {
    //     if (
    //       from.typeName === 'shape' &&
    //       to.typeName === 'shape' &&
    //       from.type === 'aspect' &&
    //       to.type === 'aspect'
    //     ) {
    //       console.log("User edited an aspect", from, to);
    //       // addEditedAspect(from, to);
    //     }
    //   }


    //   for (const record of Object.values(change.changes.removed)) {
    //     if (record.typeName === 'shape' && record.type === 'aspect') {
    //       console.log("Got a delete event")
    //       // logChangeEvent(`deleted aspect (${record.type})`);
    //     }
    //   }
    // };

    }

    const cleanupFunction = editor.store.listen(handleChangeEvent, { source: 'user', scope: 'all' });

    return () => {
      cleanupFunction();
    };
  }, [editor]);


  useEffect(() => {
    // This useEffect ensures the user gets a chance to save their changes before quitting
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) {
        return;
      }
  
      e.preventDefault();
      e.returnValue = '';
    };
  
    const handleUnload = () => {
      if (!hasUnsavedChanges) {
        return;
      }
  
      return "Navigating away will lose the changes you've made to your board. Please save if you'd like to keep your changes.";
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.onbeforeunload = handleUnload;
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.onbeforeunload = null;
    };
  }, [hasUnsavedChanges]);

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
          persistenceKey="ikigai-board"
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
