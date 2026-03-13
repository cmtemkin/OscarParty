import { getSupabase } from "./supabase";
import { Party, Guest, Pick, Winner } from "./types";

const supabase = () => getSupabase();

// --- Parties ---

export async function createParty(party: Party): Promise<Party> {
  const { error } = await supabase().from("parties").insert({
    id: party.id,
    name: party.name,
    slug: party.slug,
    admin_password_hash: party.adminPasswordHash,
    ceremony_locked: party.ceremonyLocked,
    is_active: party.isActive,
  });
  if (error) throw new Error(error.message);
  return party;
}

export async function getPartyBySlug(slug: string): Promise<Party | undefined> {
  const { data } = await supabase()
    .from("parties")
    .select("*")
    .eq("slug", slug)
    .single();
  if (!data) return undefined;
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    adminPasswordHash: data.admin_password_hash,
    ceremonyLocked: data.ceremony_locked,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
  };
}

export async function slugExists(slug: string): Promise<boolean> {
  const { data } = await supabase()
    .from("parties")
    .select("id")
    .eq("slug", slug)
    .single();
  return !!data;
}

// --- Guests ---

export async function createGuest(guest: Guest): Promise<Guest> {
  const { error } = await supabase().from("guests").insert({
    id: guest.id,
    party_id: guest.partyId,
    name: guest.name,
  });
  if (error) throw new Error(error.message);
  return guest;
}

export async function getGuestById(id: string): Promise<Guest | undefined> {
  const { data } = await supabase()
    .from("guests")
    .select("*")
    .eq("id", id)
    .single();
  if (!data) return undefined;
  return {
    id: data.id,
    partyId: data.party_id,
    name: data.name,
    createdAt: new Date(data.created_at),
  };
}

export async function getGuestsByPartyId(partyId: string): Promise<Guest[]> {
  const { data } = await supabase()
    .from("guests")
    .select("*")
    .eq("party_id", partyId);
  return (data || []).map((d) => ({
    id: d.id,
    partyId: d.party_id,
    name: d.name,
    createdAt: new Date(d.created_at),
  }));
}

export async function getGuestByPartyAndName(
  partyId: string,
  name: string
): Promise<Guest | undefined> {
  const { data } = await supabase()
    .from("guests")
    .select("*")
    .eq("party_id", partyId)
    .ilike("name", name)
    .single();
  if (!data) return undefined;
  return {
    id: data.id,
    partyId: data.party_id,
    name: data.name,
    createdAt: new Date(data.created_at),
  };
}

// --- Picks ---

export async function upsertPick(pick: Pick): Promise<Pick> {
  const { error } = await supabase().from("picks").upsert(
    {
      id: pick.id,
      guest_id: pick.guestId,
      party_id: pick.partyId,
      category_id: pick.categoryId,
      nominee_id: pick.nomineeId,
    },
    { onConflict: "guest_id,category_id" }
  );
  if (error) throw new Error(error.message);
  return pick;
}

export async function getPicksByGuestId(guestId: string): Promise<Pick[]> {
  const { data } = await supabase()
    .from("picks")
    .select("*")
    .eq("guest_id", guestId);
  return (data || []).map((d) => ({
    id: d.id,
    guestId: d.guest_id,
    partyId: d.party_id,
    categoryId: d.category_id,
    nomineeId: d.nominee_id,
    createdAt: new Date(d.created_at),
  }));
}

export async function getPicksByPartyId(partyId: string): Promise<Pick[]> {
  const { data } = await supabase()
    .from("picks")
    .select("*")
    .eq("party_id", partyId);
  return (data || []).map((d) => ({
    id: d.id,
    guestId: d.guest_id,
    partyId: d.party_id,
    categoryId: d.category_id,
    nomineeId: d.nominee_id,
    createdAt: new Date(d.created_at),
  }));
}

// --- Winners ---

export async function upsertWinner(winner: Winner): Promise<Winner> {
  const { error } = await supabase().from("winners").upsert(
    {
      id: winner.id,
      party_id: winner.partyId,
      category_id: winner.categoryId,
      nominee_id: winner.nomineeId,
    },
    { onConflict: "party_id,category_id" }
  );
  if (error) throw new Error(error.message);
  return winner;
}

export async function getWinnersByPartyId(partyId: string): Promise<Winner[]> {
  const { data } = await supabase()
    .from("winners")
    .select("*")
    .eq("party_id", partyId);
  return (data || []).map((d) => ({
    id: d.id,
    partyId: d.party_id,
    categoryId: d.category_id,
    nomineeId: d.nominee_id,
    markedAt: new Date(d.marked_at),
  }));
}

export async function deleteWinnersByPartyId(partyId: string): Promise<void> {
  const { error } = await supabase()
    .from("winners")
    .delete()
    .eq("party_id", partyId);
  if (error) throw new Error(error.message);
}
