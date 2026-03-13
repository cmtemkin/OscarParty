import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  getPartyBySlug,
  getGuestById,
  upsertPick,
  getPicksByPartyId,
  getGuestsByPartyId,
} from "@/lib/store";
import { CATEGORIES } from "@/data/nominees";
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

  const guestId = request.cookies.get(`guest_${slug}`)?.value;
  if (!guestId) {
    return NextResponse.json({ error: "Not registered" }, { status: 401 });
  }

  const guest = await getGuestById(guestId);
  if (!guest || guest.partyId !== party.id) {
    return NextResponse.json({ error: "Invalid guest" }, { status: 401 });
  }

  const body = await request.json();
  const { picks } = body as {
    picks: Record<string, string>;
  };

  if (!picks || typeof picks !== "object") {
    return NextResponse.json({ error: "Picks are required" }, { status: 400 });
  }

  // Validate all categories have picks
  const validCategoryIds = new Set(CATEGORIES.map((c) => c.id));
  for (const [categoryId, nomineeId] of Object.entries(picks)) {
    if (!validCategoryIds.has(categoryId)) {
      return NextResponse.json(
        { error: `Invalid category: ${categoryId}` },
        { status: 400 }
      );
    }
    if (!nomineeId || typeof nomineeId !== "string") {
      return NextResponse.json(
        { error: `Invalid nominee for ${categoryId}` },
        { status: 400 }
      );
    }
  }

  // Upsert all picks
  for (const [categoryId, nomineeId] of Object.entries(picks)) {
    await upsertPick({
      id: uuidv4(),
      guestId: guest.id,
      partyId: party.id,
      categoryId,
      nomineeId,
      createdAt: new Date(),
    });
  }

  return NextResponse.json({ success: true, count: Object.keys(picks).length });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const party = await getPartyBySlug(slug);

  if (!party) {
    return NextResponse.json({ error: "Party not found" }, { status: 404 });
  }

  // Admin password required
  const password = request.headers.get("x-admin-password");
  if (!password || !(await verifyPassword(password, party.adminPasswordHash))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const guests = await getGuestsByPartyId(party.id);
  const allPicks = await getPicksByPartyId(party.id);

  const guestMap = new Map(guests.map((g) => [g.id, g.name]));

  const organized = allPicks.map((p) => ({
    guestName: guestMap.get(p.guestId) || "Unknown",
    categoryId: p.categoryId,
    nomineeId: p.nomineeId,
  }));

  return NextResponse.json({ picks: organized, guestCount: guests.length });
}
