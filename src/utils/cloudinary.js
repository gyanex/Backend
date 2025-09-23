import { v2 } from "cloudinary";
import fs from "fs";

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      return null;
    }
    const response = await v2.uploader.upload(filePath, {
      resource_type: "auto",
    });
    console.log("File uploaded to Cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(filePath);
    return null;
  }
};

export { uploadToCloudinary };
