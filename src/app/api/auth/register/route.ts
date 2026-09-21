import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password) {
<<<<<<< HEAD
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
=======
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
>>>>>>> d034e7030184471ff69b5318637ae74846dbc349
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name?.trim() || "Customer",
<<<<<<< HEAD
        email: normalizedEmail,
=======
        email: email.toLowerCase().trim(),
>>>>>>> d034e7030184471ff69b5318637ae74846dbc349
        password: hashedPassword,
        role: "CLIENT",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
<<<<<<< HEAD
        createdAt: true,
=======
>>>>>>> d034e7030184471ff69b5318637ae74846dbc349
      },
    });

    return NextResponse.json(
      { message: "Account created successfully", user },
      { status: 201 }
    );
  } catch (error) {
<<<<<<< HEAD
    const message = error instanceof Error ? error.message : "Failed to register account";
    return NextResponse.json({ message }, { status: 500 });
=======
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Failed to register user" },
      { status: 500 }
    );
>>>>>>> d034e7030184471ff69b5318637ae74846dbc349
  }
}
