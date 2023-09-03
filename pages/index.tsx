import Image from 'next/image';
import { Inter } from 'next/font/google';
import { motion } from "framer-motion";
import DraggableDiv from './components/draggableDiv';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <DraggableDiv imageUrl="/images/dummy/profile.jpg" text="profile" />
      <DraggableDiv imageUrl="/images/dummy/economy.png" text="circular-economy" />
      <DraggableDiv imageUrl="/images/dummy/ada symbol opaque.png" text="Cardano" />



    </main>
  )
}
