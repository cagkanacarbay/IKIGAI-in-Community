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

    console.log(file)
    console.log(compressedFile)

    

    const formData = new FormData();
    formData.append('file', compressedFile);

    const response = await fetch('/api/ikigai', {
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

export { uploadImageToStorageProvider };


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