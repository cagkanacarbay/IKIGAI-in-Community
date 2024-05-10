import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/prisma/client';
import bcrypt from 'bcryptjs';

// user endpoint
export async function POST(request: NextRequest) {

    if (request.method != "POST") {
        return NextResponse.json({ error: 'BAD REQUEST METHOD' }, { status: 400 })
    }

    // get user id to change email, 
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.sub) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userId = parseInt(token.sub, 10);
    if (isNaN(userId)) {
        return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    const { email, password } = await request.json();

    const user = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            email: email,
        }
    })

    console.log("USER", user)

    if (password != '') {
        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password_hash: bcrypt.hashSync(password, 10),
            }
        })
    }


    return NextResponse.json({ ok: 'ok' }, { status: 200 })
}