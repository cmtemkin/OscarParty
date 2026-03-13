import { NextRequest, NextResponse } from "next/server";
import { getPartyBySlug, getGuestsByPartyId, getWinnersByPartyId } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const party = await getPartyBySlug(slug);

  if (!party) {
    return NextResponse.json({ error: "Party not found" }, { status: 404 });
  }

  const guests = await getGuestsByPartyId(party.id);
  const winners = await getWinnersByPartyId(party.id);

  return NextResponse.json({
    name: party.name,
    slug: party.slug,
    isActive: party.isActive,
    ceremonyLocked: party.ceremonyLocked,
    guestCount: guests.length,
    winnersMarked: winners.length,
  });
}
