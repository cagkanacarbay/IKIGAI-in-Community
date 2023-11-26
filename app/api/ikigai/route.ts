import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { IkigaiItem } from '@/lib/types';

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


export async function POST(req: Request) {
  try {
    const ikigaiItems = await req.json();
    console.log(ikigaiItems)
    
    // Start a transaction to insert into multiple tables
    const result = await prisma.$transaction(async (prisma) => {
      // Create a new ikigai record
      const newIkigai = await prisma.ikigai.create({ data: {} });

      for (const [key, item] of Object.entries(ikigaiItems)) {
        const ikigaiItem = item as IkigaiItem; // Typecasting 'item' to 'IkigaiItem'

        // Add each item
        const newItem = await prisma.items.create({
          data: {
            type: ikigaiItem.type,
            text: ikigaiItem.text,
            image_url: ikigaiItem.storageUrl,
            ikigai_id: newIkigai.ikigai_id,
            // Add other fields as necessary
          },
        });

        // Add position for each item
        await prisma.positions.create({
          data: {
            item_id: newItem.item_id,
            x_position: ikigaiItem.position.x,
            y_position: ikigaiItem.position.y,
            // Add other fields as necessary
          },
        });
      }
      return newIkigai;
    });
    
    return NextResponse.json({ message: 'Ikigai board saved successfully', result }, { status: 200 });
  } catch (error) {
    console.error('Error saving Ikigai board:', error);
    return NextResponse.json({ error }, { status: 500 });
  }

}
