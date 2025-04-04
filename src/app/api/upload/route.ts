import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file data provided." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadPromise = new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          upload_preset: "apprena",
          resource_type: "auto",
          public_id: `app/${file.name}`,
          overwrite: true,
          use_filename: true,
          unique_filename: false,
        },
        (error, result) => {
          if (error) {
            reject(new Error("Something went wrong"));
          } else {
            resolve(result as UploadApiResponse);
          }
        }
      );

      uploadStream.end(buffer);
    });

    const uploadResponse = await uploadPromise;

    return new Response(JSON.stringify({ url: uploadResponse.secure_url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return new Response(JSON.stringify({ error: "Image upload failed." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
