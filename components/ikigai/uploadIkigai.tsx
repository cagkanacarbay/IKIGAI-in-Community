import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import JSZip from 'jszip';
import IkigaiBoard from './ikigaiBoardZoom';
import { IkigaiItems } from '@/lib/types';

export function UploadIkigai() {
  const [items, setItems] = useState(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // if (file && file.type !== "application/zip") {
    //   console.error("The selected file is not a ZIP file.");
    //   return;
    // }

    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension !== 'zip') {
      console.error("The selected file is not a ZIP file.");
      return;
    }

    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      const ikigaiItemsJSON = await zipContent.file("ikigaiItems.json")?.async("text");
      const ikigaiItems: IkigaiItems = JSON.parse(ikigaiItemsJSON!);

      if (!ikigaiItems || typeof ikigaiItems !== 'object') {
        throw new Error("Invalid JSON structure.");
      }

      // Step 1: Iterate through the images in the ZIP and convert them to blob URLs
      const imageBlobs = {};
      const imageFilePromises = Object.values(ikigaiItems)
        .filter(item => item.type === 'image' && item.imageUrl)
        .map(async item => {
          const imageData = await zipContent.file(item.imageUrl)?.async('blob');
          const blobUrl = URL.createObjectURL(imageData);
          imageBlobs[item.imageUrl] = blobUrl;
        });

      await Promise.all(imageFilePromises);

      // Step 2: Update the imageUrl for each item
      Object.values(ikigaiItems).forEach(item => {
        if (item.type === 'image' && item.imageUrl && imageBlobs[item.imageUrl]) {
          item.imageUrl = imageBlobs[item.imageUrl];
        }
      });

      // Set the updated items to the state
      setItems(ikigaiItems);

    } catch (err) {
      console.error("Error processing the ZIP file:", err.message);
    }
  };

  return (
    <div>
      {!items && (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="picture">Picture</Label>
          <Input id="picture" type="file" onChange={handleFileChange} />
        </div>
      )}

      {/* Step 3: Render IkigaiBoard */}
      {items && <IkigaiBoard items={items} />}
    </div>
  );
}

export default UploadIkigai
