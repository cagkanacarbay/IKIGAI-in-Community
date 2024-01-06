import { NextResponse, NextRequest } from "next/server";
import prisma from '@/prisma/client';
import { getToken } from 'next-auth/jwt';


export async function GET(
  request: NextRequest, 
  { params }: { params: { snapshotId: string } }
  
): Promise<NextResponse> {
  try {

      const snapshotId = params.snapshotId
      // Verify user token
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      if (!token || !token.sub) {
          return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
      }

      // Extract Ikigai ID from URL query
      if (!snapshotId) {
          return NextResponse.json({ error: 'Snapshot ID is required' }, { status: 400 });
      }

      const parsedId = parseInt(snapshotId, 10);
      if (isNaN(parsedId)) {
        return NextResponse.json({ error: 'Invalid Snapshot Id' }, { status: 400 });
      }

      const ikigaiSnapshot = await prisma.ikigai_snapshot.findUnique({
          where: { id: parsedId }
      });

      if (!ikigaiSnapshot) {
          return NextResponse.json({ error: 'Snapshot not found' }, { status: 404 });
      }

      // Respond with the snapshot data
      return NextResponse.json(ikigaiSnapshot, { status: 200 });

  } catch (error) {
      console.error('Failed to load snapshot:', error);
      return NextResponse.json({ error: 'Failed to load snapshot' }, { status: 500 });
  }
}
