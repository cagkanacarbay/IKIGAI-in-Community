"use client";
import React, { useState, useEffect } from 'react';
import IkigaiBoardV2 from '../tldrawIkigaiBoard';
import { createTLStore, defaultShapeUtils, TLStoreWithStatus } from '@tldraw/tldraw';
import { Spinner } from "@material-tailwind/react";
import { customShapeUtils } from '../tldrawIkigaiBoard';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { downloadSnapshot, downloadLatestUserSnapshot } from '@/lib/boardStorage';
import { useRouter } from 'next/navigation';
import {Button} from "@/components/ui/button";
import { useBoardContext } from '../boardContext';

type BoardLoadState = 'loading' | 'loaded' | 'error'; 

export default function LoadSnapshotId({ params }: { params: { snapshotId: string } }) {
  const router = useRouter();
  const { setIkigaiId } = useBoardContext();

  const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({ status: 'loading' });
  const [loadState, setLoadState] = useState<BoardLoadState>('loading');
  const [ isAlertDialogOpen, setIsAlertDialogOpen ] = useState(false);

  useEffect(() => {
    async function initializeStore() {
      let newStore = createTLStore({ shapeUtils: [...defaultShapeUtils, ...customShapeUtils] });
      let snapshot;

      if (params.snapshotId) {
        try {
          if (params.snapshotId === 'latest') {
            snapshot = await downloadLatestUserSnapshot();
          } else {
            snapshot = await downloadSnapshot(params.snapshotId);
          }

          if (snapshot.result) {
            newStore.loadSnapshot(snapshot.result.data);
            setLoadState('loaded');
            setIkigaiId(snapshot.result.ikigai_id.toString());
          } else {
            setLoadState('error');
            setIsAlertDialogOpen(true);
          }
        } catch (error) {
          console.error('Error loading snapshot:', error);
          setLoadState('error');
          setIsAlertDialogOpen(true);
        }
      }

      setStoreWithStatus({
        store: newStore,
        status: 'synced-remote',
        connectionStatus: 'online'
      });
    }

    initializeStore();
  }, [params.snapshotId]);

  const loadNewBoard = () => {
    router.push('/tldraw');
  }


  return (
    <>  
      {loadState === "loading" && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
          <Spinner className="h-16 w-16 text-gray-900/50" />
          <p className="mt-4 text-lg">Ikigai loading...</p>
        </div>
      )}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Snapshot Not Found</AlertDialogTitle>
            <AlertDialogDescription>
              The requested snapshot could not be loaded. Please retry or create a new board.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center gap-2 mb-1">
            <Button onClick={loadNewBoard} className="px-4 py-2 text-white rounded bg-purple-300 hover:bg-purple-700 transition duration-150 ease-in-out">
              Create a New Board
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {loadState === 'loaded' && (
        <IkigaiBoardV2 storeWithStatus={storeWithStatus} />
      )}
    </>
  );
}

