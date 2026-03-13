# Oscar Party

**Host Your Oscar Night. Pick Your Winners.**

A web application for the 98th Academy Awards (March 16, 2026) that lets you create Oscar pools, invite friends, collect predictions, and track results live with a real-time leaderboard.

## Features

- **Create a Party** — Set up an Oscar pool in seconds with a unique shareable link
- **No Sign-ups** — Guests join via link and enter their name, no accounts needed
- **Full Oscar Ballot** — All 24 categories with every nominee for the 98th Academy Awards
- **Admin Dashboard** — Password-protected panel to mark winners as they're announced
- **Live Leaderboard** — Scores update automatically as winners are revealed
- **CSV Export** — Download all guest picks and scores as a spreadsheet
- **Mobile-Friendly** — Designed for phones, tablets, and desktops
- **Oscar-Themed UI** — Gold, black, and red carpet aesthetic with confetti animations

## Tech Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Data Store:** In-memory (swap for Supabase for production persistence)
- **Password Hashing:** bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <repo-url>
cd OscarParty
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### For Hosts

1. Click **Create a Party** on the landing page
2. Enter a party name (optionally set a custom admin password)
3. Share the party link with friends
4. Save the admin URL and password
5. During the ceremony, visit the admin dashboard to mark winners

### For Guests

1. Open the party link shared by the host
2. Enter your name
3. Fill out your ballot — pick a winner for each of the 24 categories
4. Submit your picks
5. Watch the leaderboard during the ceremony

### Admin Dashboard

- Access via `/party/[slug]/admin`
- Enter the admin password to unlock
- Select winners from dropdowns as they're announced
- Export all picks as CSV
- Reset winners for testing

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── page.tsx            # Landing page
│   ├── create/             # Create party flow
│   ├── party/[slug]/       # Party pages (join, ballot, leaderboard, admin)
│   └── api/parties/        # REST API endpoints
├── components/             # React components
│   ├── ui/                 # Button, Card, Input, ProgressBar, Confetti
│   └── layout/             # Header, Footer
├── data/nominees.ts        # 24 Oscar categories + all nominees
├── hooks/                  # Custom React hooks
└── lib/                    # Utilities (store, password, slug, csv)
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/parties` | Create a new party |
| GET | `/api/parties/[slug]` | Get party details |
| POST | `/api/parties/[slug]/guests` | Register a guest |
| POST | `/api/parties/[slug]/picks` | Submit ballot picks |
| GET | `/api/parties/[slug]/leaderboard` | Get leaderboard scores |
| POST | `/api/parties/[slug]/admin/verify` | Verify admin password |
| POST/GET/DELETE | `/api/parties/[slug]/admin/winners` | Manage winners |
| GET | `/api/parties/[slug]/admin/export` | Export picks as CSV |

## Notes

- Data is stored in-memory and resets when the server restarts. For production persistence, swap `src/lib/store.ts` with Supabase client calls.
- The leaderboard polls every 10 seconds for updates.
- Admin authentication uses bcrypt-hashed passwords stored per party.

## License

MIT
