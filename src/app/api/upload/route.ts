import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/server/integrations/cloudinary";
import { isAdminRequest } from "@/server/auth/session";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
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

    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: "cafe-menu",
      resource_type: "image",
    });

    return NextResponse.json({
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch {
    return NextResponse.json({ message: "Failed to upload image" }, { status: 500 });
  }
}
