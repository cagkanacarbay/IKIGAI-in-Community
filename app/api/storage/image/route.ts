import { put } from "@vercel/blob";
import { NextResponse } from "next/server";


export async function POST(request: Request): Promise<NextResponse> {

  try {
    const form = await request.formData();
    const file = form.get('file') as File;
    const blob = await put(`${file.name}`, file, { access: 'public', contentType: file.type });
    return NextResponse.json({ blob }, { status: 200 });
  } catch (error) {
    console.error('Failed to upload blob:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}