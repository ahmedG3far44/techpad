import cloudinary from "../configs/cloudinary";
import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";

export const uploadToCloudinary = (
  file: Express.Multer.File,
  folder: string = "categories"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `techpad/${folder}`,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Upload failed - no result"));
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

export const uploadMultipleToCloudinary = async (
  files: Express.Multer.File[],
  folder: string = "products"
): Promise<string[]> => {
  const uploads = files.map((file) => uploadToCloudinary(file, folder));
  return Promise.all(uploads);
};

export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    const publicId = extractPublicId(imageUrl);
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};

const extractPublicId = (url: string): string | null => {
  const regex = /\/v\d+\/(.+)\.\w+$/;
  const match = url.match(regex);
  if (!match) return null;
  return match[1];
};
