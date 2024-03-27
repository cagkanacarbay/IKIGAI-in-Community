// "use client";
// import React, { useState, useEffect } from 'react';
// import IkigaiBoardV2 from '../tldrawIkigaiBoard';
// import { createTLStore, defaultShapeUtils, TLStore, TLStoreOptions } from '@tldraw/tldraw';
// import IkigaiCircleShape from '../ikigaiCircles';
// import { downloadSnapshot, updateDatabaseSnapshotWithBlobSrc } from '../boardStorage';
// import { Spinner } from "@material-tailwind/react";


// export default function LoadSnaphostId({ params }: { params: { snapshotId: string } }) {
//   const [store, setStore] = useState<TLStore>();

//   const [snapshot, setSnapshot] = useState();
//   const [isLoading, setIsLoading] = useState(true); 


//   useEffect(() => {
//     async function initializeStore() {
//       let newStore = createTLStore({
//         shapeUtils: [...defaultShapeUtils, IkigaiCircleShape],
//       });

//       if (params.snapshotId) {
//         try {
//           const snapshot = await downloadSnapshot(params.snapshotId);
//           const snapshotWithAssetSrcs = await updateDatabaseSnapshotWithBlobSrc(snapshot.data);
//           newStore.loadSnapshot(snapshotWithAssetSrcs);

//           setSnapshot(snapshotWithAssetSrcs)
//           setIsLoading(false);
//         } catch (error) {
//           console.error('Error loading snapshot:', error);
//           // Handle error
//         }
//       }

//       setStore(newStore);
//     }

//     initializeStore();
//   }, [params.snapshotId]);

//   return (
//     <>
//       {isLoading ? (
//         <div className="flex flex-col justify-center items-center">
//         <Spinner className="h-16 w-16 text-gray-900/50" />
//         <br></br>
//         Ikigai loading...
//       </div>
//     ) : (
//       <IkigaiBoardV2 snapshot={snapshot}/>
//     )}
//   </>
//   );
// }


// "use client";
// import React, { useState, useEffect } from 'react';
// import IkigaiBoardV2 from '../tldrawIkigaiBoard';
// import { createTLStore, defaultShapeUtils, TLStore, TLStoreOptions, TLStoreWithStatus } from '@tldraw/tldraw';
// import IkigaiCircleShapeUtil from '../shapes/ikigaiCircles';
// import { downloadSnapshot, updateDatabaseSnapshotWithBlobSrc } from '../boardStorage';
// import { Spinner } from "@material-tailwind/react";
// import { fetchBoardGuideSnapshot } from '../boardStorage';
// import { customShapeUtils } from '../shapes/customShapes';



// export default function LoadSnapshotId({ params }: { params: { snapshotId: string } }) {
//   const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
//     status: 'loading',
//   });

//   useEffect(() => {
//     let cancelled = false;
//     async function loadRemoteSnapshot() {
      
//       const newStore = createTLStore({
//         shapeUtils: customShapeUtils,
//       });

//       if (params.snapshotId) {
//         try {
//           // const snapshot = await downloadSnapshot(params.snapshotId);
//           // const snapshotWithAssetSrcs = await updateDatabaseSnapshotWithBlobSrc(snapshot.data);

//           const snapshot = await fetchBoardGuideSnapshot();
//           console.log("snapshot:", snapshot)
//           if (cancelled) return;

//           // newStore.loadSnapshot(snapshotWithAssetSrcs);
//           newStore.loadSnapshot(snapshot);
//         } catch (error) {
//           console.error('Error loading snapshot:', error);
//           if (cancelled) return;
//         }
//       }

//       setStoreWithStatus({
//         store: newStore,
//         status: 'synced-remote',
//         connectionStatus: 'offline'
//       });
//     }

//     loadRemoteSnapshot();

//     return () => {
//       cancelled = true;
//     };
//   }, [params.snapshotId]);

//   return (
//     <IkigaiBoardV2 storeWithStatus={storeWithStatus} />
//   );
// }

