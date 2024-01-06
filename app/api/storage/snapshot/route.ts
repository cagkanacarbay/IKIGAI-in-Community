import { NextResponse, NextRequest } from "next/server";
import prisma from '@/prisma/client';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        // Verify user token
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token || !token.sub) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        } 

        // Parse user ID from token
        const userId = parseInt(token.sub, 10);
        if (isNaN(userId)) {
            return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
        }

        const { snapshotData } = await request.json(); 

        const savedSnapshot = await prisma.ikigai_snapshot.create({
            data: { 
                data: JSON.stringify(snapshotData),
                user_id: parseInt(token.sub, 10)
            }
        });

        return NextResponse.json({
            message: 'Snapshot saved successfully',
            id: savedSnapshot.id
        }, { status: 200 });

    } catch (error) {
        console.error('Failed to upload snapshot:', error);
        return NextResponse.json({ error: 'Failed to upload snapshot' }, { status: 500 });
    }
}
