import { Guest, Pick, Winner } from "./types";
import { CATEGORIES } from "@/data/nominees";

export function generateCSV(
  guests: Guest[],
  picks: Pick[],
  winners: Winner[]
): string {
  const winnerMap = new Map(winners.map((w) => [w.categoryId, w.nomineeId]));
  const picksByGuest = new Map<string, Map<string, string>>();

  for (const pick of picks) {
    if (!picksByGuest.has(pick.guestId)) {
      picksByGuest.set(pick.guestId, new Map());
    }
    picksByGuest.get(pick.guestId)!.set(pick.categoryId, pick.nomineeId);
  }

  // Find nominee display name
  const nomineeNames = new Map<string, string>();
  for (const cat of CATEGORIES) {
    for (const nom of cat.nominees) {
      nomineeNames.set(
        nom.id,
        nom.detail ? `${nom.detail} (${nom.name})` : nom.name
      );
    }
  }

  // Header
  const headers = ["Guest Name"];
  for (const cat of CATEGORIES) {
    headers.push(cat.name);
    headers.push(`${cat.name} Correct?`);
  }
  headers.push("Total Score");

  const rows = [headers.join(",")];

  for (const guest of guests) {
    const guestPicks = picksByGuest.get(guest.id) || new Map();
    const cols: string[] = [`"${guest.name}"`];
    let score = 0;

    for (const cat of CATEGORIES) {
      const pickId = guestPicks.get(cat.id) || "";
      const pickName = pickId ? (nomineeNames.get(pickId) || pickId) : "";
      const winnerId = winnerMap.get(cat.id);
      const correct = winnerId ? (pickId === winnerId ? "Yes" : "No") : "";
      if (correct === "Yes") score++;

      cols.push(`"${pickName}"`);
      cols.push(correct);
    }

    cols.push(String(score));
    rows.push(cols.join(","));
  }

  return rows.join("\n");
}
