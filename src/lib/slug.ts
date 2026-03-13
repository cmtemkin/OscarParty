import { slugExists } from "./store";

const ADJECTIVES = [
  "golden", "silver", "shining", "velvet", "crystal", "royal", "stellar",
  "bright", "grand", "noble", "elegant", "classic", "brilliant", "radiant",
  "glowing", "dazzling", "starlit", "moonlit", "crimson", "amber",
  "scarlet", "midnight", "cosmic", "epic", "majestic", "graceful",
  "divine", "enchanted", "timeless", "iconic",
];

const NOUNS = [
  "stage", "curtain", "spotlight", "premiere", "ovation", "encore",
  "marquee", "gala", "carpet", "trophy", "statue", "cinema",
  "screen", "drama", "scene", "debut", "finale", "galaxy",
  "horizon", "summit", "palace", "plaza", "studio", "theater",
  "legend", "vision", "voyage", "quest", "spark", "flame",
];

export async function generateSlug(): Promise<string> {
  let slug: string;
  let attempts = 0;
  do {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    slug = `${adj}-${noun}-${num}`;
    attempts++;
  } while ((await slugExists(slug)) && attempts < 100);
  return slug;
}
