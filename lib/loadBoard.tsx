// handleLoadBoard.ts
import JSZip from 'jszip';
import { IkigaiItems } from '@/lib/types';

const loadIkigaiBoard = async (file: File): Promise<IkigaiItems | null> => {
    // 

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension !== 'zip') {
        console.error("The selected file is not a ZIP file.");
        return null;
    }

    try {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(file);
        const ikigaiItemsJSONFile = zipContent.file("ikigaiItems.json");

        if (!ikigaiItemsJSONFile) {
            throw new Error("ikigaiItems.json not found in the ZIP.");
        }

        const ikigaiItemsJSON = await ikigaiItemsJSONFile.async("text");
        const ikigaiItems: IkigaiItems = ikigaiItemsJSON ? JSON.parse(ikigaiItemsJSON) : {};

        if (!ikigaiItems || typeof ikigaiItems !== 'object') {
            throw new Error("Invalid JSON structure.");
        }

        const imageBlobs: { [key: string]: string } = {};
        const imageFilePromises = Object.values(ikigaiItems)
            .filter(item => item.type === 'image' && item.imageUrl)
            .map(async item => {
                if (item.imageUrl) {  
                    const imageFile = zipContent.file(item.imageUrl);
                    if (imageFile) {
                        const imageData = await imageFile.async('blob');
                        if (imageData) {
                            const blobUrl = URL.createObjectURL(imageData);
                            imageBlobs[item.imageUrl] = blobUrl;
                        }
                    }
                }
            });

        await Promise.all(imageFilePromises);

        Object.values(ikigaiItems).forEach(item => {
            if (item.type === 'image' && item.imageUrl && imageBlobs[item.imageUrl]) {
                item.imageUrl = imageBlobs[item.imageUrl];
            }
        });

        return ikigaiItems;

    } catch (err) {
        if (err instanceof Error) {
            console.error("Error processing the ZIP file:", err.message);
        } else {
            console.error("Error processing the ZIP file:", err);
        }
        return null;
    }
}

export default loadIkigaiBoard;
