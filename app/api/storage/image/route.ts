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
    console.log(file)
    console.log(file.name)
    const blob = await put(`${file.name}`, file, { access: 'public', contentType: file.type });
    console.log("blob in vercel: ", blob)
    return NextResponse.json({ blob }, { status: 200 });
  } catch (error) {
    console.error('Failed to upload blob:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
// return NextResponse.json({ "act as if i've uploaded": file }, { status: 200 });
