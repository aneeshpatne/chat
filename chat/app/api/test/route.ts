import { NextRequest, NextResponse } from "next/server";

// Simple test endpoint to check if basic logging works
export async function GET(request: NextRequest) {
  console.log("API route /api/test was called");

  return NextResponse.json({
    message: "Test API route called successfully",
    timestamp: new Date().toISOString(),
  });
}
