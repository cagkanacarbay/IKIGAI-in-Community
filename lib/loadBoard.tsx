// handleLoadBoard.ts
import JSZip from 'jszip';
import { IkigaiItems } from '@/lib/types';

const loadIkigaiBoard = async (file: File): Promise<IkigaiItems | null> => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension !== 'zip') {
        console.error("The selected file is not a ZIP file.");
        return null;
    }

    try {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(file);
        const ikigaiItemsJSON = await zipContent.file("ikigaiItems.json")?.async("text");
        const ikigaiItems: IkigaiItems = JSON.parse(ikigaiItemsJSON!);

        if (!ikigaiItems || typeof ikigaiItems !== 'object') {
            throw new Error("Invalid JSON structure.");
        }

        const imageBlobs: { [key: string]: string } = {};
        const imageFilePromises = Object.values(ikigaiItems)
            .filter(item => item.type === 'image' && item.imageUrl)
            .map(async item => {
                const imageData = await zipContent.file(item.imageUrl)?.async('blob');
                const blobUrl = URL.createObjectURL(imageData);
                imageBlobs[item.imageUrl] = blobUrl;
            });

        await Promise.all(imageFilePromises);

        Object.values(ikigaiItems).forEach(item => {
            if (item.type === 'image' && item.imageUrl && imageBlobs[item.imageUrl]) {
                item.imageUrl = imageBlobs[item.imageUrl];
            }
        });

        return ikigaiItems;

    } catch (err) {
        console.error("Error processing the ZIP file:", err.message);
        return null;
    }
}

export default loadIkigaiBoard;
