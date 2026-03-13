import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createParty } from "@/lib/store";
import { generateSlug } from "@/lib/slug";
import { hashPassword, generatePassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, customPassword } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Party name is required" },
        { status: 400 }
      );
    }

    const slug = await generateSlug();
    const plainPassword = customPassword || generatePassword();
    const adminPasswordHash = await hashPassword(plainPassword);

    const party = await createParty({
      id: uuidv4(),
      name: name.trim(),
      slug,
      adminPasswordHash,
      ceremonyLocked: false,
      isActive: true,
      createdAt: new Date(),
    });

    return NextResponse.json({
      slug: party.slug,
      name: party.name,
      adminPassword: plainPassword,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create party" },
      { status: 500 }
    );
  }
}
