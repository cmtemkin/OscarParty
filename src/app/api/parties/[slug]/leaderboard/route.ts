import { NextRequest, NextResponse } from "next/server";
import {
  getPartyBySlug,
  getGuestsByPartyId,
  getPicksByPartyId,
  getGlobalWinners,
} from "@/lib/store";
import { TOTAL_CATEGORIES } from "@/data/nominees";

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
  const picks = await getPicksByPartyId(party.id);
  const winners = await getGlobalWinners();

  const winnerMap = new Map(winners.map((w) => [w.categoryId, w.nomineeId]));

  // Build guest pick maps
  const guestPicks = new Map<string, Map<string, string>>();
  for (const pick of picks) {
    if (!guestPicks.has(pick.guestId)) {
      guestPicks.set(pick.guestId, new Map());
    }
    guestPicks.get(pick.guestId)!.set(pick.categoryId, pick.nomineeId);
  }

  // Compute scores
  const leaderboard = guests
    .map((guest) => {
      const picks = guestPicks.get(guest.id) || new Map();
      let score = 0;
      for (const [catId, winnerId] of winnerMap) {
        if (picks.get(catId) === winnerId) {
          score++;
        }
      }
      return {
        guestId: guest.id,
        guestName: guest.name,
        score,
        totalCategories: TOTAL_CATEGORIES,
      };
    })
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({
    leaderboard,
    winnersMarked: winners.length,
    totalCategories: TOTAL_CATEGORIES,
  });
}
