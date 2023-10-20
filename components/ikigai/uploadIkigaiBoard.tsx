import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import IkigaiBoard from './ikigaiBoardZoom';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


const UploadIkigaiBoard = () => {
    const [ikigaiData, setIkigaiData] = useState(null); // This will store the data from the zip file

    const onDrop = async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const zip = new JSZip();
      
      const content = await zip.loadAsync(file);
      const ikigaiItemsJSON = await content.file("ikigaiItems.json").async("string");
      const ikigaiItems = JSON.parse(ikigaiItemsJSON);
      
      // Process images
      const imagePromises = Object.values(ikigaiItems).map(async (item) => {
          if (item.type === 'image' && item.imageUrl) {
              const imgBlob = await content.file(item.imageUrl).async('blob');
              const imageUrl = URL.createObjectURL(imgBlob);
              item.imageUrl = imageUrl; // update to use the new blob URL
          }
      });
  
      await Promise.all(imagePromises);
  
      setIkigaiData(ikigaiItems);
  };
  

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: '.zip',
    });

    return (
        <div {...getRootProps()} style={{ border: '1px dashed black', padding: '20px' }}>
            <input {...getInputProps()} />
            <p>Drag & drop your Ikigai zip file here, or click to select one</p>

            {/* Optionally display IkigaiBoard here using the ikigaiData */}
            {ikigaiData && <IkigaiBoard items={ikigaiData} />}
        </div>
    );
}

export default UploadIkigaiBoard;
