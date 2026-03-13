import { NextRequest, NextResponse } from "next/server";
import { getPartyBySlug } from "@/lib/store";
import { verifyPassword } from "@/lib/password";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const party = await getPartyBySlug(slug);

  if (!party) {
    return NextResponse.json({ error: "Party not found" }, { status: 404 });
  }

  const body = await request.json();
  const { password } = body;

  if (!password) {
    return NextResponse.json(
      { error: "Password is required" },
      { status: 400 }
    );
  }

  const valid = await verifyPassword(password, party.adminPasswordHash);

  if (!valid) {
    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true, partyName: party.name });

  // Store password in cookie for subsequent admin requests
  response.cookies.set(`admin_${slug}`, password, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: `/`,
  });

  return response;
}
