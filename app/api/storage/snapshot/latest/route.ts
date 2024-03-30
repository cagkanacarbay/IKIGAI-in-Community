import { NextResponse, NextRequest } from "next/server";
import prisma from '@/prisma/client';
import { getToken } from 'next-auth/jwt';

export async function GET(
  request: NextRequest, 
): Promise<NextResponse> {
  try {
      // Verify user token
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      if (!token || !token.sub) {
          return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
      }

      // Assuming token.sub contains the user ID
      const userId = parseInt(token.sub, 10);
      if (isNaN(userId)) {
          return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
      }

      // Fetch the latest ikigai_snapshot for this user
      const latestIkigaiSnapshot = await prisma.ikigai_snapshot.findFirst({
          where: {
              user_id: userId
          },
          orderBy: {
              id: 'desc'
          },
      });

      if (!latestIkigaiSnapshot) {
          return NextResponse.json({ error: 'Snapshot not found for the user' }, { status: 404 });
      }

    //   console.log("latestIkigaiSnapshot", latestIkigaiSnapshot)
      // Respond with the latest snapshot data
      return NextResponse.json(latestIkigaiSnapshot, { status: 200 });

  } catch (error) {
      console.error('Failed to load the latest snapshot:', error);
      return NextResponse.json({ error: 'Failed to load the latest snapshot' }, { status: 500 });
  }
}
