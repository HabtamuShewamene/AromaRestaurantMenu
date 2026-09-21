import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing video id" }, { status: 400 });
  }

  const tiktokUrl = `https://www.tiktok.com/@aromarestaurantdb/video/${id}`;
  const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(tiktokUrl)}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    const data = await response.json();

    if (data && data.data && data.data.play) {
      return NextResponse.redirect(data.data.play);
    }

    return NextResponse.json({ error: "Could not extract video" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "API fetch failed" }, { status: 500 });
  }
}
