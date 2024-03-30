import { NextResponse, NextRequest } from "next/server";
import prisma from '@/prisma/client';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token || !token.sub) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        } 

        const userId = parseInt(token.sub, 10);
        if (isNaN(userId)) {
            return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
        }

        const { snapshotData } = await request.json(); 

        // Convert to number if ikigaiId exists, else we wil generate a new ikigaiId
        let ikigaiId = request.nextUrl.searchParams.get("ikigaiId") ? parseInt(request.nextUrl.searchParams.get("ikigaiId") as string, 10) : undefined;

        if (!ikigaiId) {
            const latestSnapshot = await prisma.ikigai_snapshot.findFirst({
                orderBy: {
                    ikigai_id: 'desc',
                },
            });
            // console.log("latestSnapshot", latestSnapshot)

            ikigaiId = latestSnapshot ? latestSnapshot.ikigai_id + 1 : 1;
        }

        const savedSnapshot = await prisma.ikigai_snapshot.create({
            data: { 
                data: JSON.stringify(snapshotData),
                user_id: userId,
                ikigai_id: ikigaiId
            }
        });

        return NextResponse.json({
            message: 'Snapshot saved successfully',
            id: savedSnapshot.id,
            ikigai_id: savedSnapshot.ikigai_id,
            user_id: savedSnapshot.user_id,
        }, { status: 200 });

    } catch (error) {
        console.error('Failed to upload snapshot:', error);
        return NextResponse.json({ error: 'Failed to upload snapshot' }, { status: 500 });
    }
}