import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { upsertGlobalWinner, getGlobalWinners, deleteGlobalWinners } from "@/lib/store";
import { CATEGORIES_MAP } from "@/data/nominees";

function authenticateSystemAdmin(request: NextRequest): boolean {
  const systemPassword = process.env.SYSTEM_ADMIN_PASSWORD;
  if (!systemPassword) return false;

  const cookie = request.cookies.get("system_admin")?.value;
  const header = request.headers.get("x-admin-password");

  return cookie === systemPassword || header === systemPassword;
}

export async function POST(request: NextRequest) {
  if (!authenticateSystemAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const nominee = category.nominees.find((n) => n.id === nomineeId);
  if (!nominee) {
    return NextResponse.json(
      { error: "Invalid nominee for this category" },
      { status: 400 }
    );
  }

  await upsertGlobalWinner({
    id: uuidv4(),
    categoryId,
    nomineeId,
    markedAt: new Date(),
  });

  return NextResponse.json({ success: true, categoryId, nomineeId });
}

export async function GET(request: NextRequest) {
  if (!authenticateSystemAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const winners = await getGlobalWinners();
  return NextResponse.json({
    winners: winners.map((w) => ({
      categoryId: w.categoryId,
      nomineeId: w.nomineeId,
      markedAt: w.markedAt,
    })),
  });
}

export async function DELETE(request: NextRequest) {
  if (!authenticateSystemAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await deleteGlobalWinners();
  return NextResponse.json({ success: true });
}
