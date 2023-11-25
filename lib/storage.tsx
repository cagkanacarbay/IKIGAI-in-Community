async function uploadImageToStorageProvider(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/ikigai', {
      method: 'POST',
      body: formData,
    });

    const blob = await response.json();
    console.log("uploaded this blob: ", blob);

    return blob.url ?? null;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

export {uploadImageToStorageProvider};