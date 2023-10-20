import { Inter } from 'next/font/google';
import IkigaiBoard from '@/components/ikigai/ikigaiBoardZoom';
import {initialItems} from "@/lib/dummyData"
import UploadIkigai from '@/components/ikigai/uploadIkigai';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between  ${inter.className}`}
    > 
      {/* <IkigaiBoard items={initialItems}/> */}
      <UploadIkigai></UploadIkigai>


    </main>
  )
}
