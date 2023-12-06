import { NextResponse, NextRequest } from 'next/server';
import type { IkigaiItem, Position } from '@/lib/types';
import prisma from '@/prisma/client';
import { Prisma } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { useId } from 'react';

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
  // Retrieve the user session token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const requestBody = await req.json();
    const userId = parseInt(token.sub as string, 10); // Assuming the user ID is stored in the token's 'sub' field
    const ikigaiItems: Record<string, IkigaiItem> = requestBody.items;

    console.log("this is the userId:", userId)
    console.log(requestBody)

    const result = await prisma.$transaction(async (prisma) => {
      // Create new Ikigai
      const newIkigai = await prisma.ikigai.create({
        data: {
          user: { connect: { id: requestBody.userId } },
        },
      });

      // Iterate over each item and create them along with their positions
      for (const key in ikigaiItems) {
        const item = ikigaiItems[key];

        const createdItem = await prisma.items.create({
          data: {
            type: item.type,
            text: item.text || '',            // default to empty string if text is undefined
            image_url: item.storageUrl || '', // default to empty string if imageUrl is undefined
            ikigai: { connect: { ikigai_id: newIkigai.ikigai_id } },
          },
        });

        // Create position
        await prisma.positions.create({
          data: {
            item_id: createdItem.item_id,
            x_position: item.position.x,
            y_position: item.position.y,
          },
        });
      }

      return newIkigai;
    });

    return new Response(JSON.stringify({ message: 'Ikigai board saved successfully', result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error saving Ikigai board:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}


export async function PATCH(req: NextRequest) {
  // Retrieve the user session token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("got a request to patch ikigai")
  console.log(token)
  if (!token) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const requestBody = await req.json();
    console.log("requestBody:", requestBody)
    const userId = parseInt(token.sub as string, 10);
    const ikigaiId: number = Number(requestBody.ikigaiId)
    const ikigaiItems: Record<string, IkigaiItem> = requestBody.items
    // const { ikigaiId, ikigaiItems }: { ikigaiId: string; ikigaiItems: Record<string, IkigaiItem> } = requestBody;
    console.log(ikigaiItems)

    // Fetch the Ikigai to check ownership and existence
    const existingIkigai = await prisma.ikigai.findUnique({
      where: { ikigai_id: ikigaiId },
      include: { items: true },
    });

    console.log(existingIkigai)

    if (!existingIkigai || existingIkigai.user_id !== userId) {
      // If requester is not the owner, we wont allow ikigai to be updated. its not theirs. 
      return new Response(JSON.stringify({ message: 'Forbidden' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Update Ikigai
    const updates = await prisma.$transaction(async (prisma) => {
      // Update existing items and their positions
      console.log("makin a transaction")
      console.log(ikigaiItems)
      for (const key in ikigaiItems) {
        const item = ikigaiItems[key];

        let existingItem = existingIkigai.items.find(i => i.item_id.toString() === key);
        console.log("here is the existing item:", existingItem)
        
        if (existingItem) {
          // Update position
          await prisma.positions.create({
            data: {
              item_id: existingItem.item_id,
              x_position: item.position.x,
              y_position: item.position.y,
            },
          });
        } else {
          // Create new item
          const createdItem = await prisma.items.create({
            data: {
              type: item.type,
              text: item.text || '',
              image_url: item.storageUrl || '',
              ikigai: { connect: { ikigai_id: ikigaiId } },
            },
          });

          // Create position for new item
          await prisma.positions.create({
            data: {
              item_id: createdItem.item_id,
              x_position: item.position.x,
              y_position: item.position.y,
            },
          });
        }
      }
    });

    return new Response(JSON.stringify({ message: 'Ikigai board updated successfully', updates: updates }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating Ikigai board:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
