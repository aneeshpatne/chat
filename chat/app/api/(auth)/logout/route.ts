import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ status: "signed out" });

  response.cookies.set("session", "", {
    maxAge: -1,
    path: "/",
  });

  return response;
}
