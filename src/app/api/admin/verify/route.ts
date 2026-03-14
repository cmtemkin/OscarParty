import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  const systemPassword = process.env.SYSTEM_ADMIN_PASSWORD;
  if (!systemPassword) {
    return NextResponse.json(
      { error: "System admin not configured" },
      { status: 500 }
    );
  }

  if (!password || password !== systemPassword) {
    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("system_admin", password, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return response;
}
