import { NextRequest, NextResponse } from "next/server";
<<<<<<< HEAD
import { getCloudinary, isCloudinaryConfigured } from "@/server/integrations/cloudinary";
=======
import cloudinary, { isCloudinaryConfigured } from "@/server/integrations/cloudinary";
>>>>>>> d034e7030184471ff69b5318637ae74846dbc349
import { isAdminRequest } from "@/server/auth/session";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    if (!isCloudinaryConfigured()) {
<<<<<<< HEAD
      return NextResponse.json(
        { message: "Cloudinary is not configured. Please verify CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env" },
        { status: 503 }
      );
=======
      return NextResponse.json({ message: "Cloudinary is not configured in .env" }, { status: 500 });
>>>>>>> d034e7030184471ff69b5318637ae74846dbc349
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ message: "Image file is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json({ message: "Image size must be 5MB or less" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const cloudinary = getCloudinary();
    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: "aroma-restaurant-menu",
      resource_type: "image",
    });

    return NextResponse.json({
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
<<<<<<< HEAD
    const message = error instanceof Error ? error.message : "Failed to upload image";
    return NextResponse.json({ message }, { status: 500 });
=======
    console.error("Cloudinary upload failed:", error);
    return NextResponse.json({ message: error instanceof Error ? error.message : "Failed to upload image" }, { status: 500 });
>>>>>>> d034e7030184471ff69b5318637ae74846dbc349
  }
}
