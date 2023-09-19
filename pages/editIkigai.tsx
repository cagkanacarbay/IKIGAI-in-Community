import Image from 'next/image';
import { Inter } from 'next/font/google';
import { motion } from "framer-motion";
import DraggableDiv from './components/draggableDiv';
import IkigaiZoneEdit from './components/ikigaiZoneEdit';
import { useState } from 'react';


const inter = Inter({ subsets: ['latin'] })


export default function Home() {

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    > 
      <div className="relative w-[700px] h-[700px] flex items-center justify-center">
        <div className="absolute top-0 transform z-10">
          <IkigaiZoneEdit
            name="What you love"
            color="red"
            textPosition="top-12"
          />
        </div>      
        
      <DraggableDiv imageUrl="/images/dummy/profile.jpg" text="profile" />
      <DraggableDiv imageUrl="/images/dummy/economy.png" text="circular-economy" />
      <DraggableDiv imageUrl="/images/dummy/ada symbol opaque.png" text="Cardano" />
      </div>


    </main>
  )
}
