// app/api/ikigai/[ikigaiId].ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client'; // Adjust the import path as necessary

export async function GET(req: NextRequest, { params }: { params: { ikigaiId: string }}) {
  // Extract ikigaiId from the route parameter
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
        user: true,
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
