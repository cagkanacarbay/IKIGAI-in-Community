import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface IkigaiData {
  [key: string]: {
    tags: string[];
    images: string[];
  };
}

export async function GET() {
  try {
    const ikigais = await prisma.ikigai.findMany({
      include: {
        items: true, // Include related items
      },
    });

    const ikigaiData: IkigaiData = {};

    for (const ikigai of ikigais) {
      ikigaiData[`${ikigai.ikigai_id}`] = {
        tags: ikigai.items
          .filter(item => item.type === 'tag' && item.text !== null)
          .map(item => item.text as string), // Type assertion as string
        images: ikigai.items
          .filter(item => item.type === 'image' && item.image_url !== null)
          .map(item => item.image_url as string), // Type assertion as string
      };
    }

    return NextResponse.json(ikigaiData, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch ikigai:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}



// // This works with kysely postgres but throws an error because of a dependency in build

// import { NextResponse } from 'next/server';
// import { createKysely } from '@vercel/postgres-kysely';
// import { Database, ItemTable } from '../database';

// interface IkigaiData {
//   [key: string]: {
//     tags: string[];
//     images: string[];
//   };
// }

// export async function GET() {
//   try {
//     const db = createKysely<Database>();

//     const ikigais = await db.selectFrom('ikigai').selectAll().execute();

//     const ikigaiData: IkigaiData = {};

//     for (const ikigai of ikigais) {
//       const items = await db
//         .selectFrom('items')
//         .selectAll()
//         .where('ikigai_id', '=', ikigai.ikigai_id)
//         .execute();

//       ikigaiData[`${ikigai.ikigai_id}`] = {
//         tags: items.filter(item => item.type === 'tag' && item.text !== null).map(item => item.text!),
//         images: items.filter(item => item.type === 'image' && item.image_url !== null).map(item => item.image_url!),
//       };
//     }
  
//     return NextResponse.json(ikigaiData, { status: 200 });
//   } catch (error) {
//     console.error('Failed to fetch ikigai:', error);
//     return NextResponse.json({ error }, { status: 500 });
//   }
// }
