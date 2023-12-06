import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client'; // Adjust the import path as necessary
import { IkigaiItem } from '@/lib/types';

export async function GET(req: NextRequest, { params }: { params: { ikigaiId: string }}) {
  const ikigaiId = params.ikigaiId;

  try {
    const id = parseInt(ikigaiId, 10);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ikigai ID' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const ikigai = await prisma.ikigai.findUnique({
      where: { ikigai_id: id },
      include: {
        items: {
          include: {
            positions: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            created_at: true,
            updated_at: true,
            // Exclude password_hash by not mentioning it or explicitly setting it to false
          },
        },
      },
    });

    if (!ikigai) {
      return new Response(JSON.stringify({ error: 'Ikigai not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(ikigai), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to fetch ikigai:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}



// export async function POST(req: NextRequest, { params }: { params: { ikigaiId: string }}) {


//   try {
//     const ikigaiId = Number(params.ikigaiId);

//     const ikigaiItems: Record<string, IkigaiItem> = await req.json();

//     const result = await prisma.$transaction(async (prisma) => {
//       const testUserId = 1; // TODO: Replace with the actual user ID

//       const newIkigai = await prisma.ikigai.create({
//         data: {
//           user: { connect: { id: (ikigaiId } },
//           items: {
//             create: Object.values(ikigaiItems).map((item) => ({
//               type: item.type,
//               text: item.text,
//               image_url: item.storageUrl,
//               positions: {
//                 create: {
//                   x_position: item.position.x,
//                   y_position: item.position.y,
//                 },
//               },
//             })),
//           },
//         },
//       });

//       return newIkigai;
//     });

//     return NextResponse.json({ message: 'Ikigai board saved successfully', result }, { status: 200 });
//   } catch (error) {
//     console.error('Error saving Ikigai board:', error);
//     return NextResponse.json({ error }, { status: 500 });
//   }
// }