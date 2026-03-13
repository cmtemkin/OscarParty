import { NextRequest, NextResponse } from "next/server";
import {
  getPartyBySlug,
  getGuestsByPartyId,
  getPicksByPartyId,
  getWinnersByPartyId,
} from "@/lib/store";
import { verifyPassword } from "@/lib/password";
import { generateCSV } from "@/lib/csv";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const party = await getPartyBySlug(slug);

  if (!party) {
    return NextResponse.json({ error: "Party not found" }, { status: 404 });
  }

  const password =
    request.headers.get("x-admin-password") ||
    request.cookies.get(`admin_${slug}`)?.value;

  if (!password || !(await verifyPassword(password, party.adminPasswordHash))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const guests = await getGuestsByPartyId(party.id);
  const picks = await getPicksByPartyId(party.id);
  const winners = await getWinnersByPartyId(party.id);

  const csv = generateCSV(guests, picks, winners);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${party.slug}-picks.csv"`,
    },
  });
}
