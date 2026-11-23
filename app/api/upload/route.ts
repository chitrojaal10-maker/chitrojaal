// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";


export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  
  // The user has not provided their Cloudinary credentials.
  // The following code will not work until they are provided.
  if (!process.env.CLOUDINARY_URL) {
    return NextResponse.json({ 
      error: "Cloudinary credentials are not configured. Please set CLOUDINARY_URL in your .env.local file" 
    }, { status: 500 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload the file to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
            folder: "poses" // Optional: organize uploads in a specific folder
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        }).end(buffer);
    });

    // @ts-ignore
    return NextResponse.json({ secure_url: uploadResult.secure_url });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json({ error: "Something went wrong during the upload." }, { status: 500 });
  }
}
