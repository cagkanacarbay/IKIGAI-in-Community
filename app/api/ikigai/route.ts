import { NextResponse, NextRequest } from 'next/server';
import type { IkigaiItem } from '@/lib/types';
import { prisma } from '@/prisma/client';
import { Prisma } from '@prisma/client';

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


export async function POST(req: NextRequest) {
  // Upload a new IKIGAI with a new Id, new items, and their positions
  try {
    const ikigaiItems: Record<string, IkigaiItem> = await req.json();
    
    // Start a transaction to insert into multiple tables
    const result = await prisma.$transaction(async (prisma) => {
      // Create a new ikigai record
      const newIkigai = await prisma.ikigai.create({ data: {} });

      // Prepare data for items
      const itemsData = Object.entries(ikigaiItems).map(([key, item]) => ({
        type: item.type,
        text: item.text,
        image_url: item.storageUrl,
        ikigai_id: newIkigai.ikigai_id,
      }));

      // Create all items at once
      await prisma.items.createMany({
        data: itemsData,
        skipDuplicates: true, 
      });

      // Fetch newly created items to get their IDs
      const createdItems = await prisma.items.findMany({
        where: { ikigai_id: newIkigai.ikigai_id }
      });

      const positionsData = createdItems.map((createdItem, index) => {
        const originalItemKey = Object.keys(ikigaiItems)[index];
        const originalItem = ikigaiItems[originalItemKey];
        
        if (originalItem && originalItem.position) {
          return {
            item_id: createdItem.item_id,
            x_position: originalItem.position.x,
            y_position: originalItem.position.y,
          };
        }
      }).filter(item => item !== undefined); // Filter out undefined values
  
      // Create all positions at once
      await prisma.positions.createMany({
        data: positionsData as Prisma.positionsCreateManyInput[], // Type assertion
        skipDuplicates: true,
      });

      return newIkigai;
    });
    
    return NextResponse.json({ message: 'Ikigai board saved successfully', result }, { status: 200 });
  } catch (error) {
    console.error('Error saving Ikigai board:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}


// export async function POST(req: Request) {
//   try {
//     const ikigaiItems = await req.json();
//     console.log(ikigaiItems)
    
//     // Start a transaction to insert into multiple tables
//     const result = await prisma.$transaction(async (prisma) => {
//       // Create a new ikigai record
//       const newIkigai = await prisma.ikigai.create({ data: {} });

//       for (const [key, item] of Object.entries(ikigaiItems)) {
//         const ikigaiItem = item as IkigaiItem; // Typecasting 'item' to 'IkigaiItem'

//         // Add each item
//         const newItem = await prisma.items.create({
//           data: {
//             type: ikigaiItem.type,
//             text: ikigaiItem.text,
//             image_url: ikigaiItem.storageUrl,
//             ikigai_id: newIkigai.ikigai_id,
//             // Add other fields as necessary
//           },
//         });
//          const posData = {
//             item_id: newItem.item_id,
//             x_position: ikigaiItem.position.x,
//             y_position: ikigaiItem.position.y,
//           }
//           console.log(posData);
//         // // Add position for each item
//         // await prisma.positions.create({
//         //   data: {
//         //     item_id: newItem.item_id,
//         //     x_position: ikigaiItem.position.x,
//         //     y_position: ikigaiItem.position.y,
//         //   },
//         // });
//       }
//       return newIkigai;
//     });
    
//     return NextResponse.json({ message: 'Ikigai board saved successfully', result }, { status: 200 });
//   } catch (error) {
//     console.error('Error saving Ikigai board:', error);
//     return NextResponse.json({ error }, { status: 500 });
//   }

// }
