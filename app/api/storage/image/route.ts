import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

// export const config = {
//     api: {
//       bodyParser: false,
//     },
//   };

export async function POST(request: Request): Promise<NextResponse> {

  try {
    const form = await request.formData();
    const file = form.get('file') as File;
    const blob = await put(`${file.name}`, file, { access: 'public' });
    return NextResponse.json({ blob }, { status: 200 });
  } catch (error) {
    console.error('Failed to upload blob:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
