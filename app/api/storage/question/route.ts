import { NextRequest, NextResponse } from "next/server";
import prisma from '@/prisma/client';
import { getToken } from "next-auth/jwt";


export async function POST(request: NextRequest): Promise<NextResponse> {

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  let userId = -1
  if (token && token.sub) {
    userId = parseInt(token.sub, 10);
  }

  try {
    const req: any[] = await request.json();
    console.log(req)

    req.forEach(async (a) => {
      a.user_id = userId
      await prisma.answer.create({ data: a });
    })

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Failed to upload blob:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}