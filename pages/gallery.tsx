import IkigaiCard from "@/components/gallery/ikigaiCard";
import React, { useEffect, useState } from 'react';

interface Ikigai {
  id: number;
  username: string;
  images: string[];
  tags: string[];
}

const GalleryPage: React.FC = () => {
  const [ikigais, setIkigais] = useState<Ikigai[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/ikigai");
        const data = await response.json();
        console.log('API Response:', data);
        setIkigais(Object.values(data)); // Convert the object to an array
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ikigais.map((ikigai) => (
          ikigai.images.length > 0 && (
            <IkigaiCard
              key={ikigai.id}
              ikigaiId={ikigai.id}
              userName={ikigai.username}
              images={ikigai.images}
              tags={ikigai.tags}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
