"use client";
import React, { useState } from 'react';
import { Tldraw, useEditor, createTLStore, defaultShapeUtils, TLStoreWithStatus } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import IkigaiCircleShape from './ikigaiCircles';
import { uiOverrides } from './customUi';
import { useSession } from 'next-auth/react';
import { downloadSnapshot, updateDatabaseSnapshotWithBlobSrc } from './boardStorage';
import { Spinner } from '@material-tailwind/react';
import { IkigaiCircles } from './ikigaiCircles';


const CustomShapes = [IkigaiCircleShape]

interface IkigaiBoardV2Props {
  // store?: TLStore;
  // snapshot?: any
  storeWithStatus?: TLStoreWithStatus
}

export default function IkigaiBoardV2({ storeWithStatus }: IkigaiBoardV2Props) {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const editor = useEditor();
  const customUiOverrides = uiOverrides(isLoggedIn, editor);

  // const [store] = useState(() => {
	// 	// Create the store
	// 	const newStore = createTLStore({
	// 		shapeUtils: [...defaultShapeUtils, IkigaiCircleShape],
	// 	})

	// 	// Load the snapshot
	// 	newStore.loadSnapshot(snapshot)

	// 	return newStore
	// })

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw 
        store={storeWithStatus}
        overrides={customUiOverrides}
        shapeUtils={CustomShapes} 
        // persistenceKey="persistence-key"
        >
        <IkigaiCircles/>
        {/* {storeWithStatus?.status === 'synced-remote' && <IkigaiCircles />} */}

      </Tldraw>
    </div>

  );
}




