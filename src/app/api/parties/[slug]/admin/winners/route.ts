import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  getPartyBySlug,
  upsertWinner,
  getWinnersByPartyId,
  deleteWinnersByPartyId,
} from "@/lib/store";
import { verifyPassword } from "@/lib/password";
import { CATEGORIES_MAP } from "@/data/nominees";

async function authenticateAdmin(
  request: NextRequest,
  slug: string
): Promise<{ error?: string; partyId?: string }> {
  const party = await getPartyBySlug(slug);
  if (!party) return { error: "Party not found" };

  const password =
    request.headers.get("x-admin-password") ||
    request.cookies.get(`admin_${slug}`)?.value;

  if (!password || !(await verifyPassword(password, party.adminPasswordHash))) {
    return { error: "Unauthorized" };
  }

  return { partyId: party.id };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const auth = await authenticateAdmin(request, slug);
  if (auth.error) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Party not found" ? 404 : 401 }
    );
  }

  const body = await request.json();
  const { categoryId, nomineeId } = body;

  if (!categoryId || !nomineeId) {
    return NextResponse.json(
      { error: "categoryId and nomineeId are required" },
      { status: 400 }
    );
  }

  const category = CATEGORIES_MAP.get(categoryId);
  if (!category) {
    return NextResponse.json(
      { error: "Invalid category" },
      { status: 400 }
    );
  }

  const nominee = category.nominees.find((n) => n.id === nomineeId);
  if (!nominee) {
    return NextResponse.json(
      { error: "Invalid nominee for this category" },
      { status: 400 }
    );
  }

  await upsertWinner({
    id: uuidv4(),
    partyId: auth.partyId!,
    categoryId,
    nomineeId,
    markedAt: new Date(),
  });

  return NextResponse.json({ success: true, categoryId, nomineeId });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const party = await getPartyBySlug(slug);
  if (!party) {
    return NextResponse.json({ error: "Party not found" }, { status: 404 });
  }

  const winners = await getWinnersByPartyId(party.id);
  return NextResponse.json({
    winners: winners.map((w) => ({
      categoryId: w.categoryId,
      nomineeId: w.nomineeId,
      markedAt: w.markedAt,
    })),
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const auth = await authenticateAdmin(request, slug);
  if (auth.error) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Party not found" ? 404 : 401 }
    );
  }

  await deleteWinnersByPartyId(auth.partyId!);
  return NextResponse.json({ success: true });
}
