import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { put } from "@vercel/blob";

const prisma = new PrismaClient();

interface IkigaiData {
  [key: string]: {
    tags: string[];
    images: string[];
  };
}

export async function GET() {
  try {
    const ikigais = await prisma.ikigai.findMany({
      include: {
        items: true, // Include related items
      },
    });

    const ikigaiData: IkigaiData = {};

    for (const ikigai of ikigais) {
      ikigaiData[`${ikigai.ikigai_id}`] = {
        tags: ikigai.items
          .filter(item => item.type === 'tag' && item.text !== null)
          .map(item => item.text as string), // Type assertion as string
        images: ikigai.items
          .filter(item => item.type === 'image' && item.image_url !== null)
          .map(item => item.image_url as string), // Type assertion as string
      };
    }

    return NextResponse.json(ikigaiData, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch ikigai:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};


export async function POST(request: Request): Promise<NextResponse> {

  try {
    const form = await request.formData();
    const file = form.get('file') as File;
    const blob = await put(`${file.name}`, file, { access: 'public' });
    return NextResponse.json({blob}, { status: 200 })
  } catch (error) {
    console.error('Failed to upload blob:', error);
    return NextResponse.json({ error }, { status: 500 });  }
}

// export async function POST(request: Request): Promise<NextResponse> {
//   const body = (await request.json()) as HandleUploadBody;

//   try {
//     const jsonResponse = await handleUpload({
//       body,
//       request,
//       onBeforeGenerateToken: async (pathname: string, clientPayload?: string) => {
//         // Add your authentication and authorization logic here
//         return {
//           allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
//           // Add other options as needed
//         };
//       },
//       onUploadCompleted: async ({ blob, tokenPayload }) => {
//         // Logic to run after file upload is completed
//         console.log('blob upload completed', blob, tokenPayload);
//       },
//     });

//     return NextResponse.json(jsonResponse);
//   } catch (error) {
//     return NextResponse.json({ error: (error as Error).message }, { status: 400 });
//   }
// }


// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//   const form = new IncomingForm();

//   return new Promise<void>((resolve, reject) => {
//     form.parse(req, async (err, fields, files: any) => {
//       if (err) {
//         res.status(500).json({ error: 'Error parsing the form data.' });
//         reject();
//         return;
//       }

//       // files.image is your uploaded file
//       const imageFile = files.image;
//       const imageBlob = await fs.promises.readFile(imageFile.filepath);
//       const { url } = await put(imageFile.originalFilename, imageBlob, { access: 'public' });

//       res.status(200).json({ url });
//       resolve();
//     });
//   });
// }



// export async function POST(request: Request) {
//   // Uploads the entire board for a users ikigai.
//   const ikigaiItems: IkigaiItems = await request.json();
//   console.log("uploading ikigai items:", ikigaiItems)


//   const uploadImage = async (imageUrl: string): Promise<string> => {
//     console.log("fetching: ", imageUrl)
//     const response = await fetch(imageUrl);
//     if (!response.ok) {
//       throw new Error('Failed to fetch image');
//     }
//     const imageBlob = await response.blob();
//     const { url } = await put(imageUrl, imageBlob, { access: 'public'});

//     // const { url } = await put(imageUrl, imageBlob, { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN });
//     return url;
//   };

//   try {
//     for (const key in ikigaiItems) {
//       const item = ikigaiItems[key];
//       if (item.type === 'image' && item.imageUrl) {
//         const uploadedImageUrl = await uploadImage(item.imageUrl);
//         item.imageUrl = uploadedImageUrl;
//       }
//     }
//     return NextResponse.json(ikigaiItems, { status: 200 });
//   } catch (error) {
//     console.error('Error in uploading Ikigai:', error);
//     return NextResponse.json({ error }, { status: 500 });
//   }
// }
