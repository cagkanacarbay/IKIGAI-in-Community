import IkigaiCard from "@/components/gallery/ikigaiCard";
import React, { useEffect, useState } from 'react';

interface Ikigai {
  id: number;
  userName: string;
  userAvatar: string;
  images: string[];
  tags: string[];
}

// This would be your page component for the gallery
const GalleryPage: React.FC = () => {
  const [ikigais, setIkigais] = useState<Ikigai[]>([]);
//   console.log(process.env.NEXT_PUBLIC_API_HOST)
    const apiHost = process.env.NEXT_PUBLIC_API_HOST;
    const url = apiHost ? `${apiHost}/api/ikigai` : '/api/ikigai';
    console.log(url)
    
    fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log('API Response:', data);
    setIkigais(data);
  })
  .catch(console.error);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(ikigais).map(([ikigaiId, ikigaiData]) => (
        <IkigaiCard
            key={ikigaiId}
            userName="Dummy User"
            userAvatar="/images/logo.png"
            images={ikigaiData.images.slice(0, 4)}
            tags={ikigaiData.tags.slice(0, 8)}
        />
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
