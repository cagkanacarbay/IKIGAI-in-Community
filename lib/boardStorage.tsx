import { uploadImageToStorageProvider } from "@/lib/imageStorage";
import { 
  TLBaseAsset, TLAssetPartial, TLStoreSnapshot, 
  SerializedStore, TLRecord, TLAsset, TLImageAsset, 
  TLStoreWithStatus, createTLStore
} from "@tldraw/tldraw";
import { Editor } from "@tldraw/editor";
import { useSession } from "next-auth/react";
import { customShapeUtils } from "../app/board/shapes/customShapes";
import { SnapshotInDB } from "./types";

type ImageAssetProps = {
  w: number;
  h: number;
  name: string;
  isAnimated: boolean;
  mimeType: null | string;
  src: null | string;
};

type ImageAssetWithBlobUrl = TLBaseAsset<'image', ImageAssetProps> & { meta: { blob_url?: string } };

/**
 * Processes each base64 Image Asset in the store by 
 *  - converting them to files, 
 *  - uploading them as blobs to vercel storage,
 *  - updating their metadata with the uploaded URL.
 * @param storeSnapshot Snapshot of the editor's store.
 * @param editor The tldraw editor instance.
 */
export async function saveImageAssetsAsBlobsAndUpdateMetadata(storeSnapshot: Record<string, any>, editor: Editor) {
  const updatedAssets: TLAssetPartial[] = [];

  for (const key in storeSnapshot) {
    if (key.startsWith('asset:')) {
      const asset: ImageAssetWithBlobUrl = storeSnapshot[key];

      // If there is no src there is no image so skip. 
      // If there is a blob_url already the image is already uploaded so skip.
      if (typeof asset.props.src === 'string' && !asset.meta?.blob_url) {
        const file = convertBase64ToFile(asset.props.src, key);
        if (file) {
          const uploadedUrl = await uploadImageToStorageProvider(file);
          if (uploadedUrl) {
            updatedAssets.push({
              id: asset.id,
              type: 'image', 
              meta: {
                ...asset.meta,
                blob_url: uploadedUrl
              }
            });
          }
        }
      }
    }
  }
  
  console.log("Saved images as blobs: ", updatedAssets);

  editor.updateAssets(updatedAssets);
}
  
export function saveBoardLocalJSON<T>(data: T, filename: string): void {
  const stringified = JSON.stringify(data, null, 2);
  const blob = new Blob([stringified], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function convertBase64ToFile(base64Data: string, fileNameNoType: string): File | null {
  const [mimePart, base64] = base64Data.split(",");
  const mimeType = mimePart.match(/data:(.*);base64/)?.[1];
  if (!mimeType || !base64) return null;

  const byteCharacters = atob(base64);
  const byteNumbers = Array.from({ length: byteCharacters.length }, (_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  const fileExtension = mimeType.split('/').pop();
  const fileName = `${fileNameNoType}.${fileExtension}`;

  return new File([blob], fileName, { type: mimeType });
}


export async function uploadSnapshotToDatabase(snapshot: TLStoreSnapshot, ikigaiId?: string) {
  console.log("uploading this snapshot after cleaning:", snapshot)
  const cleanedSnapshot = cleanSnapshot(snapshot);
  console.log("cleaned snapshot:", cleanedSnapshot)

  const url = ikigaiId ? `/api/storage/snapshot?ikigaiId=${ikigaiId}` : '/api/storage/snapshot';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ snapshotData: cleanedSnapshot }),
  });

  if (!response.ok) {
    throw new Error(`Error while uploading your IKIGAI snapshot. Status: ${response.status}`);
  }

  return await response.json();
}

/**
 * Takes the snapshot store from tldraw and modifies it prior to an upload
 *  - removes IKIGAI circles from the store,
 *  - removes base64 src of assets (these are uploaded as blobs instead)
 * @param snapshot Snapshot of the editor.
 */
function cleanSnapshot(snapshot: TLStoreSnapshot): TLStoreSnapshot {
  const cleanedStore: SerializedStore<TLRecord> = {};

  Object.keys(snapshot.store).forEach(key => {
    const record = snapshot.store[key as keyof typeof snapshot.store];

    if (!key.includes("ikigaiCircle")) {
      if (key.includes("asset") && 'props' in record) {
        const { src, ...restProps } = record.props as { src?: string, [key: string]: any };
        cleanedStore[key as keyof typeof cleanedStore] = { ...record, props: restProps } as TLRecord;
      } else {
        cleanedStore[key as keyof typeof cleanedStore] = record;
      }
    }
  });


  console.log("cleanedStore:", cleanedStore)

  return { ...snapshot, store: cleanedStore };
}

// Adjusting the return type to include HTTP status codes
type DownloadSnapshotResult = {
  status: 'success' | 'error';
  statusCode: number; 
  result?: SnapshotInDB; 
  message?: string;
};

export async function downloadSnapshot(snapshotId: string): Promise<DownloadSnapshotResult> {
  try {
    const response = await fetch(`/api/storage/snapshot/${snapshotId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return parseSnapshotResponse(response);
  }
  catch (error) {
    console.error('An unexpected error occurred:', error);
    // Return an error status for any unexpected errors with a 500 status code
    return {
      status: 'error',
      statusCode: 500,
      message: 'An unexpected error occurred',
    };
  }
}

export async function downloadLatestUserSnapshot(): Promise<DownloadSnapshotResult> {
  try {
    const response = await fetch(`/api/storage/snapshot/latest`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return parseSnapshotResponse(response);
  }
  catch (error) {
    console.error('An unexpected error occurred:', error);
    // Return an error status for any unexpected errors with a 500 status code
    return {
      status: 'error',
      statusCode: 500,
      message: 'An unexpected error occurred',
    };
  }
}



const parseSnapshotResponse = async (response: Response): Promise<DownloadSnapshotResult> => {

    // Log the response for debugging
    if (!response.ok) {
      const errorResult = await response.json(); // Assuming the error message is in JSON format
      return {
        status: 'error',
        statusCode: response.status,
        message: errorResult.error || `Error while loading snapshot.`,
      };
    }

    const result = await response.json();

    // Check if the 'data' key exists and is a string
    if (result.data && typeof result.data === 'string') {
      try {
        result.data = JSON.parse(result.data);
      } catch (error) {
        console.error('Failed to parse snapshot data:', error);
        // Return an error status with message and the HTTP status code
        return {
          status: 'error',
          statusCode: response.status, 
          message: 'Failed to parse snapshot data',
        };
      }
    }

    // Return success status with data and a 200 HTTP status code
    return {
      status: 'success',
      statusCode: 200,
      result: result,
    };
  } 




// export async function downloadSnapshot(snapshotId: string) {
//   const response = await fetch(`/api/storage/snapshot/${snapshotId}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   console.log("response", response);

//   if (!response.ok) {
//     throw new Error(`Error while loading your Ikigai snapshot Id ${snapshotId}. Status: ${response.status}`);
//   }

//   const result = await response.json();

//   // Check if the 'data' key exists and is a string
//   if (result.data && typeof result.data === 'string') {
//     // Parse the 'data' string as JSON
//     try {
//       result.data = JSON.parse(result.data);
//     } catch (error) {
//       console.error('Failed to parse snapshot data:', error);
//       throw new Error('Failed to parse snapshot data');
//     }
//   }

//   console.log(result);
//   return result;
// }


export async function updateDatabaseSnapshotWithBlobSrc(snapshotData: any): Promise<any> {
  const updatedStore: { [key: string]: any } = {};

  if (!snapshotData || typeof snapshotData !== 'object' || !snapshotData.store) {
    throw new Error('Invalid snapshot data');
  }

  for (const key of Object.keys(snapshotData.store)) {
    const record = snapshotData.store[key];

    if (record && typeof record === 'object' && record.typeName === 'asset') {
      const blobUrl = record.meta?.blob_url;

      if (blobUrl) {
        const src = await fetchAssetSrcFromBlobStorage(blobUrl);
        updatedStore[key] = {
          ...record,
          props: { ...record.props, src }
        };

      } else {
        updatedStore[key] = record;
      }

    } else {
      updatedStore[key] = record;
    }
  }

  return { ...snapshotData, store: updatedStore };
}


async function fetchAssetSrcFromBlobStorage(blobUrl: string): Promise<string> {
  try {
    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.statusText}`);
    }
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching asset SRC:', error);
    throw error;
  }
}


// Adjusting the return type to include HTTP status codes
interface SaveBoardResult {
  status: 'success' | 'error';
  result: any | null; 
  message: string;
};
// Use this method to save a board to the database
export const saveBoardToDatabase = async (editor: Editor, ikigaiId?: string): Promise<SaveBoardResult> => {
  if (editor && editor.store) {
    const snapshot = editor.store.getSnapshot();
    // console.log("pre save snapshot:", snapshot)
    await saveImageAssetsAsBlobsAndUpdateMetadata(snapshot.store, editor);
    const updatedSnapshot = editor.store.getSnapshot();
    try {
      const uploadResult = await uploadSnapshotToDatabase(updatedSnapshot, ikigaiId);
      // console.log("upload result:", uploadResult);
      return {
        status: 'success',
        result: uploadResult,
        message: 'Snapshot saved successfully',
      };
    } catch (error) {
      // console.error("Failed to save the snapshot to the database.", error);
      return {
        status: 'error',
        result: null,
        message: 'Failed to save the snapshot to the database'
      };
    }
  }
  return {
    status: 'error',
    result: null,
    message: 'Editor or editor store is not available'
  };
};