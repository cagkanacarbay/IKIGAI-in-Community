import IkigaiCard from "@/components/gallery/ikigaiCard";
import React, { useEffect, useState } from 'react';
import { Carousel } from "@material-tailwind/react";

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

  // const apiHost = process.env.NEXT_PUBLIC_API_HOST || '';
  // const url = `${apiHost}/api/ikigai`;
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/ikigai");
        const data = await response.json();
        console.log('API Response:', data);
        setIkigais(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="container mx-auto p-4 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

      {Object.entries(ikigais).map(([ikigaiId, ikigaiData]) => (
        <IkigaiCard
            key={ikigaiId}
            userName="Cha Khan Cho"
            userAvatar="/images/logo.png"
            images={ikigaiData.images}
            tags={ikigaiData.tags}
        />
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
