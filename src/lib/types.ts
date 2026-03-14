export interface Party {
  id: string;
  name: string;
  slug: string;
  adminPasswordHash: string;
  ceremonyLocked: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface Guest {
  id: string;
  partyId: string;
  name: string;
  createdAt: Date;
}

export interface Pick {
  id: string;
  guestId: string;
  partyId: string;
  categoryId: string;
  nomineeId: string;
  createdAt: Date;
}

export interface Winner {
  id: string;
  partyId: string;
  categoryId: string;
  nomineeId: string;
  markedAt: Date;
}

export interface GlobalWinner {
  id: string;
  categoryId: string;
  nomineeId: string;
  markedAt: Date;
}

export interface LeaderboardEntry {
  guestId: string;
  guestName: string;
  score: number;
  totalCategories: number;
}
