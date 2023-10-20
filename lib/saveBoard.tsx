import JSZip from 'jszip';
import { IkigaiItems } from './types';

export const saveIkigaiBoardItems = async (updatedIkigaiItems: IkigaiItems) => {
    // Saves the ikigaiItems state from IkigaiBoard 
    // as a zip file containing all the images, 
    // and all the tags in a JSON file.

    // Create a new instance of JSZip
    const zip = new JSZip();

    // Convert updated state to JSON string and add it to the zip

    // Download each image, convert to Blob and add to the ZIP
    const imagePromises = Object.values(updatedIkigaiItems).map(async (item) => {
        if (item.type === 'image' && item.imageUrl) {
            const response = await fetch(item.imageUrl);
            const blob = await response.blob();
            const imgName = item.imageUrl.split('/').pop();
            zip.file(`images/${imgName}`, blob);

            // Update the imageUrl to refer to the saved image in the zip folder
            item.imageUrl = `images/${imgName}`;
        }
    });

    await Promise.all(imagePromises);

    zip.file("ikigaiItems.json", JSON.stringify(updatedIkigaiItems));

    // Generate the zip file and offer it for download
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const downloadAnchorNode = document.createElement('a');

    downloadAnchorNode.setAttribute("href", url);
    downloadAnchorNode.setAttribute("download", "ikigaiData.zip");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

};