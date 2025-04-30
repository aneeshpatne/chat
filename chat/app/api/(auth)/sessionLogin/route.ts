import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    console.log("🔐 [sessionLogin] Incoming request...");

    const { token } = await request.json();
    console.log("🧾 Received token:", token?.substring?.(0, 20) + "...");

    if (!token || typeof token !== "string") {
      console.warn("⚠️ Invalid or missing token.");
      return NextResponse.json(
        { error: "Invalid or missing token" },
        { status: 400 }
      );
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    console.log("🕒 Session expiry set to:", expiresIn, "ms");

    const sessionCookie = await adminAuth.createSessionCookie(token, {
      expiresIn,
    });
    console.log("✅ Session cookie created");

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
    console.log("🍪 Cookie set successfully");

    return response;
  } catch (error) {
    console.error("❌ Error creating session cookie:", error);

    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 401 }
    );
  }
}
