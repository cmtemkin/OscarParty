import { NextRequest, NextResponse } from "next/server";
import { getAllParties, getGuestCountByPartyId } from "@/lib/store";

function authenticateSystemAdmin(request: NextRequest): boolean {
  const systemPassword = process.env.SYSTEM_ADMIN_PASSWORD;
  if (!systemPassword) return false;

  const cookie = request.cookies.get("system_admin")?.value;
  const header = request.headers.get("x-admin-password");

  return cookie === systemPassword || header === systemPassword;
}

export async function GET(request: NextRequest) {
  if (!authenticateSystemAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parties = await getAllParties();

  const partiesWithCounts = await Promise.all(
    parties.map(async (party) => {
      const guestCount = await getGuestCountByPartyId(party.id);
      return {
        id: party.id,
        name: party.name,
        slug: party.slug,
        guestCount,
        createdAt: party.createdAt,
      };
    })
  );

  return NextResponse.json({ parties: partiesWithCounts });
}
