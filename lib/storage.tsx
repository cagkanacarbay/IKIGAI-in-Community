import Compressor from 'compressorjs';

async function uploadImageToStorageProvider(file: File): Promise<string | null> {
  try {
    const compressedFilePromise = new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.5, 
        convertSize: 50000, // convert images larger than 50kb
        success(result) {
          resolve(result);
        },
        error(err) {
          reject(err);
        },
      });
    });
    const compressedFile = await compressedFilePromise as File;

    const formData = new FormData();
    formData.append('file', compressedFile);

    const response = await fetch('/api/storage/image', {
      method: 'POST',
      body: formData,
    });

    const blob = await response.json();
    console.log("uploaded this blob: ");
    console.log(blob.blob)

    return blob.blob.url ?? null;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}


// async function uploadImageToStorageProvider(file: File): Promise<string | null> {
//   try {
//     const formData = new FormData();
//     formData.append('file', file);

//     const response = await fetch('/api/ikigai', {
//       method: 'POST',
//       body: formData,
//     });

//     const blob = await response.json();
//     console.log("uploaded this blob: ", blob);

//     return blob.url ?? null;
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     return null;
//   }
// }

// export {uploadImageToStorageProvider};



async function uploadImageToStorageProviderTldraw(file: File): Promise<string | null> {
  try {
    const compressedFilePromise = new Promise<File>((resolve, reject) => {
      new Compressor(file, {
        quality: 0.5,
        convertSize: 50000,
        success(result) {
          // Create a new File object with the original file name
          const compressedFile = new File([result], file.name, {
            type: result.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        error(err) {
          reject(err);
        },
      });
    });

    const compressedFile = await compressedFilePromise;

    const formData = new FormData();
    formData.append('file', compressedFile);

    const response = await fetch('/api/storage/image', {
      method: 'POST',
      body: formData,
    });

    const blob = await response.json();
    console.log("uploaded this blob: ");
    console.log(blob.blob);

    return blob.blob.url ?? null;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

export { uploadImageToStorageProvider, uploadImageToStorageProviderTldraw };
