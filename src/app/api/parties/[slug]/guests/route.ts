import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getPartyBySlug, createGuest, getGuestByPartyAndName } from "@/lib/store";

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
  const { name } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  // Check if guest already exists (allow rejoining)
  const existing = await getGuestByPartyAndName(party.id, name.trim());
  if (existing) {
    const response = NextResponse.json({
      guestId: existing.id,
      name: existing.name,
    });
    response.cookies.set(`guest_${slug}`, existing.id, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: `/`,
    });
    return response;
  }

  const guest = await createGuest({
    id: uuidv4(),
    partyId: party.id,
    name: name.trim(),
    createdAt: new Date(),
  });

  const response = NextResponse.json({
    guestId: guest.id,
    name: guest.name,
  });

  response.cookies.set(`guest_${slug}`, guest.id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: `/`,
  });

  return response;
}
