import { NextRequest, NextResponse } from "next/server";
import { deleteParty, updatePartySlug } from "@/lib/store";
import { generateSlug } from "@/lib/slug";

function authenticateSystemAdmin(request: NextRequest): boolean {
  const systemPassword = process.env.SYSTEM_ADMIN_PASSWORD;
  if (!systemPassword) return false;

  const cookie = request.cookies.get("system_admin")?.value;
  const header = request.headers.get("x-admin-password");

  return cookie === systemPassword || header === systemPassword;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!authenticateSystemAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await deleteParty(id);
  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!authenticateSystemAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const newSlug = await generateSlug();
  await updatePartySlug(id, newSlug);
  return NextResponse.json({ success: true, newSlug });
}
