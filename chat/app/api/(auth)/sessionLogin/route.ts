import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing token" },
        { status: 400 }
      );
    }
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(token, {
      expiresIn,
    });

    const response = NextResponse.json(
      { message: "Session created" },
      { status: 200 }
    );

    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      expires: new Date(Date.now() + expiresIn),
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 401 }
    );
  }
}
