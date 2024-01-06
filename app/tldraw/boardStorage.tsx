import { uploadImageToStorageProviderTldraw } from "@/lib/storage";
import { TLBaseAsset, TLAssetPartial, TLStoreSnapshot } from "@tldraw/tldraw";
import { Editor } from "@tldraw/editor";
import { useSession } from "next-auth/react";


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
 * Processes each base64 Image Asset in the store by converting them to files, uploading them,
 * and updating their metadata with the uploaded URL.
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
          const uploadedUrl = await uploadImageToStorageProviderTldraw(file);
          if (uploadedUrl) {
            updatedAssets.push({
              id: asset.id,
              type: 'image', 
              meta: {
                ...asset.meta,
                blob_url: uploadedUrl
              }
            });
            console.log(updatedAssets);
          }
        }
      }
    }
  }

  editor.updateAssets(updatedAssets);
}
  
export function saveAsJSON<T>(data: T, filename: string): void {
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


export async function uploadSnapshot(snapshot: TLStoreSnapshot) {

  const response = await fetch('/api/storage/snapshot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ snapshotData: snapshot }),
  });

  if (!response.ok) {
    throw new Error(`Error while uploading your IKIGAI snapshot. Status: ${response.status}`);
  }

  const result = await response.json();

  return result
}

export function isUserLoggedIn() {
  const { data: session } = useSession();
  if (!session || !session.user) {
    return false;
  } else {
    return true;
  }
}