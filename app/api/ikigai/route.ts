import { NextResponse, NextRequest } from 'next/server';
import type { IkigaiItem, Position } from '@/lib/types';
import prisma from '@/prisma/client';
import { Prisma } from '@prisma/client';

interface IkigaiData {
  [key: string]: {
    id: number,
    user_id: number,
    username: string,
    tags: string[];
    images: string[];
  };
}

export async function GET() {
  try {
    const ikigais = await prisma.ikigai.findMany({
      include: {
        items: true, 
        user: true
      },
    });

    const ikigaiData: IkigaiData = {};

    for (const ikigai of ikigais) {
      ikigaiData[`${ikigai.ikigai_id}`] = {
        id: ikigai.ikigai_id,
        user_id: ikigai.user_id,
        username: ikigai.user.username,
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
  try {
    const ikigaiItems: Record<string, IkigaiItem> = await req.json();

    const result = await prisma.$transaction(async (prisma) => {
      const testUserId = 1; // TODO: Replace with the actual user ID

      const newIkigai = await prisma.ikigai.create({
        data: {
          user: { connect: { id: testUserId } },
          items: {
            create: Object.values(ikigaiItems).map((item) => ({
              type: item.type,
              text: item.text,
              image_url: item.storageUrl,
              positions: {
                create: {
                  x_position: item.position.x,
                  y_position: item.position.y,
                },
              },
            })),
          },
        },
      });

      return newIkigai;
    });

    return NextResponse.json({ message: 'Ikigai board saved successfully', result }, { status: 200 });
  } catch (error) {
    console.error('Error saving Ikigai board:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}