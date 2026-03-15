export interface Nominee {
  id: string;
  name: string;
  detail?: string; // Person name for person-based categories
  film?: string; // Film name when nominee is a person
}

export interface Category {
  id: string;
  name: string;
  nominees: Nominee[];
}

export const CATEGORIES: Category[] = [
  {
    id: "best-picture",
    name: "Best Picture",
    nominees: [
      { id: "bugonia", name: "Bugonia" },
      { id: "f1", name: "F1" },
      { id: "frankenstein", name: "Frankenstein" },
      { id: "hamnet", name: "Hamnet" },
      { id: "marty-supreme", name: "Marty Supreme" },
      { id: "one-battle-after-another", name: "One Battle After Another" },
      { id: "the-secret-agent", name: "The Secret Agent" },
      { id: "sentimental-value", name: "Sentimental Value" },
      { id: "sinners", name: "Sinners" },
      { id: "train-dreams", name: "Train Dreams" },
    ],
  },
  {
    id: "best-director",
    name: "Best Director",
    nominees: [
      { id: "coogler-sinners", name: "Sinners", detail: "Ryan Coogler" },
      {
        id: "trier-sentimental-value",
        name: "Sentimental Value",
        detail: "Joachim Trier",
      },
      {
        id: "anderson-one-battle",
        name: "One Battle After Another",
        detail: "Paul Thomas Anderson",
      },
      {
        id: "safdie-marty-supreme",
        name: "Marty Supreme",
        detail: "Josh Safdie",
      },
      { id: "zhao-hamnet", name: "Hamnet", detail: "Chloe Zhao" },
    ],
  },
  {
    id: "best-actor",
    name: "Best Actor",
    nominees: [
      {
        id: "chalamet-marty-supreme",
        name: "Marty Supreme",
        detail: "Timothee Chalamet",
      },
      {
        id: "dicaprio-one-battle",
        name: "One Battle After Another",
        detail: "Leonardo DiCaprio",
      },
      {
        id: "hawke-blue-moon",
        name: "Blue Moon",
        detail: "Ethan Hawke",
      },
      {
        id: "jordan-sinners",
        name: "Sinners",
        detail: "Michael B. Jordan",
      },
      {
        id: "moura-secret-agent",
        name: "The Secret Agent",
        detail: "Wagner Moura",
      },
    ],
  },
  {
    id: "best-actress",
    name: "Best Actress",
    nominees: [
      {
        id: "buckley-hamnet",
        name: "Hamnet",
        detail: "Jessie Buckley",
      },
      {
        id: "stone-bugonia",
        name: "Bugonia",
        detail: "Emma Stone",
      },
      {
        id: "reinsve-sentimental-value",
        name: "Sentimental Value",
        detail: "Renate Reinsve",
      },
      {
        id: "hudson-song-sung-blue",
        name: "Song Sung Blue",
        detail: "Kate Hudson",
      },
      {
        id: "byrne-if-i-had-legs",
        name: "If I Had Legs I'd Kick You",
        detail: "Rose Byrne",
      },
    ],
  },
  {
    id: "best-supporting-actor",
    name: "Best Supporting Actor",
    nominees: [
      {
        id: "elordi-frankenstein",
        name: "Frankenstein",
        detail: "Jacob Elordi",
      },
      {
        id: "deltoro-one-battle",
        name: "One Battle After Another",
        detail: "Benicio del Toro",
      },
      {
        id: "penn-one-battle",
        name: "One Battle After Another",
        detail: "Sean Penn",
      },
      {
        id: "lindo-sinners",
        name: "Sinners",
        detail: "Delroy Lindo",
      },
      {
        id: "skarsgard-sentimental-value",
        name: "Sentimental Value",
        detail: "Stellan Skarsgard",
      },
    ],
  },
  {
    id: "best-supporting-actress",
    name: "Best Supporting Actress",
    nominees: [
      {
        id: "fanning-sentimental-value",
        name: "Sentimental Value",
        detail: "Elle Fanning",
      },
      {
        id: "lilleaas-sentimental-value",
        name: "Sentimental Value",
        detail: "Inga Ibsdotter Lilleaas",
      },
      {
        id: "madigan-weapons",
        name: "Weapons",
        detail: "Amy Madigan",
      },
      {
        id: "mosaku-sinners",
        name: "Sinners",
        detail: "Wunmi Mosaku",
      },
      {
        id: "taylor-one-battle",
        name: "One Battle After Another",
        detail: "Teyana Taylor",
      },
    ],
  },
  {
    id: "best-original-screenplay",
    name: "Best Original Screenplay",
    nominees: [
      {
        id: "coogler-sinners-sp",
        name: "Sinners",
        detail: "Ryan Coogler",
      },
      {
        id: "trier-vogt-sentimental-value",
        name: "Sentimental Value",
        detail: "Joachim Trier and Eskil Vogt",
      },
      {
        id: "panahi-accident",
        name: "It Was Just an Accident",
        detail: "Jafar Panahi",
      },
      {
        id: "bronstein-safdie-marty",
        name: "Marty Supreme",
        detail: "Ronald Bronstein and Josh Safdie",
      },
      {
        id: "kaplow-blue-moon",
        name: "Blue Moon",
        detail: "Robert Kaplow",
      },
    ],
  },
  {
    id: "best-adapted-screenplay",
    name: "Best Adapted Screenplay",
    nominees: [
      {
        id: "anderson-one-battle-sp",
        name: "One Battle After Another",
        detail: "Paul Thomas Anderson",
      },
      {
        id: "zhao-ofarrell-hamnet",
        name: "Hamnet",
        detail: "Chloe Zhao and Maggie O'Farrell",
      },
      {
        id: "bentley-kwedar-train-dreams",
        name: "Train Dreams",
        detail: "Clint Bentley and Greg Kwedar",
      },
      {
        id: "tracy-bugonia",
        name: "Bugonia",
        detail: "Will Tracy",
      },
      {
        id: "deltoro-frankenstein-sp",
        name: "Frankenstein",
        detail: "Guillermo del Toro",
      },
    ],
  },
  {
    id: "best-casting",
    name: "Best Casting",
    nominees: [
      {
        id: "gold-hamnet",
        name: "Hamnet",
        detail: "Nina Gold",
      },
      {
        id: "venditti-marty-supreme",
        name: "Marty Supreme",
        detail: "Jennifer Venditti",
      },
      {
        id: "kulukundis-one-battle",
        name: "One Battle After Another",
        detail: "Cassandra Kulukundis",
      },
      {
        id: "domingues-secret-agent",
        name: "The Secret Agent",
        detail: "Gabriel Domingues",
      },
      {
        id: "maisler-sinners",
        name: "Sinners",
        detail: "Francine Maisler",
      },
    ],
  },
  {
    id: "best-animated-feature",
    name: "Best Animated Feature",
    nominees: [
      { id: "kpop-demon-hunters", name: "KPop Demon Hunters" },
      { id: "arco", name: "Arco" },
      { id: "elio", name: "Elio" },
      {
        id: "little-amelie",
        name: "Little Amelie or the Character of Rain",
      },
      { id: "zootopia-2", name: "Zootopia 2" },
    ],
  },
  {
    id: "best-international-feature",
    name: "Best International Feature",
    nominees: [
      { id: "sentimental-value-intl", name: "Sentimental Value" },
      { id: "the-secret-agent-intl", name: "The Secret Agent" },
      { id: "it-was-just-an-accident", name: "It Was Just an Accident" },
      { id: "sirat", name: "Sirat" },
      { id: "voice-of-hind-rajab", name: "The Voice of Hind Rajab" },
    ],
  },
  {
    id: "best-documentary-feature",
    name: "Best Documentary Feature",
    nominees: [
      { id: "perfect-neighbor", name: "The Perfect Neighbor" },
      { id: "alabama-solution", name: "The Alabama Solution" },
      { id: "come-see-me-good-light", name: "Come See Me in the Good Light" },
      { id: "cutting-through-rocks", name: "Cutting through Rocks" },
      { id: "mr-nobody-putin", name: "Mr. Nobody against Putin" },
    ],
  },
  {
    id: "best-original-score",
    name: "Best Original Score",
    nominees: [
      {
        id: "goransson-sinners",
        name: "Sinners",
        detail: "Ludwig Goransson",
      },
      {
        id: "greenwood-one-battle",
        name: "One Battle After Another",
        detail: "Jonny Greenwood",
      },
      {
        id: "fendrix-bugonia",
        name: "Bugonia",
        detail: "Jerskin Fendrix",
      },
      {
        id: "desplat-frankenstein",
        name: "Frankenstein",
        detail: "Alexandre Desplat",
      },
      {
        id: "richter-hamnet",
        name: "Hamnet",
        detail: "Max Richter",
      },
    ],
  },
  {
    id: "best-original-song",
    name: "Best Original Song",
    nominees: [
      {
        id: "dear-me-relentless",
        name: '"Dear Me"',
        detail: "Diane Warren: Relentless",
      },
      {
        id: "golden-kpop",
        name: '"Golden"',
        detail: "KPop Demon Hunters",
      },
      {
        id: "i-lied-to-you-sinners",
        name: '"I Lied to You"',
        detail: "Sinners",
      },
      {
        id: "sweet-dreams-viva-verdi",
        name: '"Sweet Dreams Of Joy"',
        detail: "Viva Verdi!",
      },
      {
        id: "train-dreams-song",
        name: '"Train Dreams"',
        detail: "Train Dreams",
      },
    ],
  },
  {
    id: "best-cinematography",
    name: "Best Cinematography",
    nominees: [
      { id: "cinematography-sinners", name: "Sinners" },
      {
        id: "cinematography-one-battle",
        name: "One Battle After Another",
      },
      { id: "cinematography-marty-supreme", name: "Marty Supreme" },
      { id: "cinematography-frankenstein", name: "Frankenstein" },
      { id: "cinematography-train-dreams", name: "Train Dreams" },
    ],
  },
  {
    id: "best-film-editing",
    name: "Best Film Editing",
    nominees: [
      { id: "editing-one-battle", name: "One Battle After Another" },
      { id: "editing-f1", name: "F1" },
      { id: "editing-sinners", name: "Sinners" },
      { id: "editing-marty-supreme", name: "Marty Supreme" },
      { id: "editing-sentimental-value", name: "Sentimental Value" },
    ],
  },
  {
    id: "best-production-design",
    name: "Best Production Design",
    nominees: [
      { id: "production-sinners", name: "Sinners" },
      { id: "production-one-battle", name: "One Battle After Another" },
      { id: "production-frankenstein", name: "Frankenstein" },
      { id: "production-hamnet", name: "Hamnet" },
      { id: "production-marty-supreme", name: "Marty Supreme" },
    ],
  },
  {
    id: "best-costume-design",
    name: "Best Costume Design",
    nominees: [
      { id: "costume-sinners", name: "Sinners" },
      { id: "costume-marty-supreme", name: "Marty Supreme" },
      { id: "costume-frankenstein", name: "Frankenstein" },
      { id: "costume-hamnet", name: "Hamnet" },
      { id: "costume-avatar", name: "Avatar: Fire and Ash" },
    ],
  },
  {
    id: "best-makeup-hairstyling",
    name: "Best Makeup and Hairstyling",
    nominees: [
      { id: "makeup-frankenstein", name: "Frankenstein" },
      { id: "makeup-sinners", name: "Sinners" },
      { id: "makeup-kokuho", name: "Kokuho" },
      { id: "makeup-smashing-machine", name: "The Smashing Machine" },
      { id: "makeup-ugly-stepsister", name: "The Ugly Stepsister" },
    ],
  },
  {
    id: "best-sound",
    name: "Best Sound",
    nominees: [
      { id: "sound-f1", name: "F1" },
      { id: "sound-frankenstein", name: "Frankenstein" },
      { id: "sound-one-battle", name: "One Battle After Another" },
      { id: "sound-sinners", name: "Sinners" },
      { id: "sound-sirat", name: "Sirat" },
    ],
  },
  {
    id: "best-visual-effects",
    name: "Best Visual Effects",
    nominees: [
      { id: "vfx-avatar", name: "Avatar: Fire and Ash" },
      { id: "vfx-f1", name: "F1" },
      { id: "vfx-jurassic-world", name: "Jurassic World Rebirth" },
      { id: "vfx-lost-bus", name: "The Lost Bus" },
      { id: "vfx-sinners", name: "Sinners" },
    ],
  },
  {
    id: "best-animated-short",
    name: "Best Animated Short Film",
    nominees: [
      { id: "butterfly", name: "Butterfly" },
      { id: "forevergreen", name: "Forevergreen" },
      { id: "girl-who-cried-pearls", name: "The Girl Who Cried Pearls" },
      { id: "retirement-plan", name: "Retirement Plan" },
      { id: "three-sisters", name: "The Three Sisters" },
    ],
  },
  {
    id: "best-live-action-short",
    name: "Best Live Action Short Film",
    nominees: [
      {
        id: "two-people-exchanging-saliva",
        name: "Two People Exchanging Saliva",
      },
      { id: "butchers-stain", name: "Butcher's Stain" },
      { id: "the-singers", name: "The Singers" },
      { id: "friend-of-dorothy", name: "A Friend of Dorothy" },
      { id: "jane-austen-period-drama", name: "Jane Austen's Period Drama" },
    ],
  },
  {
    id: "best-documentary-short",
    name: "Best Documentary Short Film",
    nominees: [
      { id: "all-empty-rooms", name: "All the Empty Rooms" },
      { id: "armed-only-camera", name: "Armed Only with a Camera" },
      { id: "children-no-more", name: "Children No More" },
      { id: "devil-is-busy", name: "The Devil Is Busy" },
      { id: "perfectly-a-strangeness", name: "Perfectly a Strangeness" },
    ],
  },
];

export const CATEGORIES_MAP = new Map(CATEGORIES.map((c) => [c.id, c]));
export const TOTAL_CATEGORIES = CATEGORIES.length;
