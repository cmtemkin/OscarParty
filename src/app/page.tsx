"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
  const router = useRouter();
  const [joinSlug, setJoinSlug] = useState("");
  const [joinError, setJoinError] = useState("");

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const input = joinSlug.trim();

    if (!input) {
      setJoinError("Please enter a party link or code");
      return;
    }

    // Extract slug from URL or use as-is
    let slug = input;
    try {
      const url = new URL(input);
      const match = url.pathname.match(/\/party\/([^/]+)/);
      if (match) slug = match[1];
    } catch {
      // Not a URL, treat as slug
    }

    router.push(`/party/${slug}`);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
          <div className="animate-fade-in-up">
            <span className="text-7xl block mb-6">🏆</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-oscar-gold mb-4">
              Host Your Oscar Night.
              <br />
              Pick Your Winners.
            </h1>
            <p className="text-xl text-oscar-text-muted max-w-2xl mx-auto mb-8">
              Create an Oscar pool, invite your friends, collect predictions,
              and watch the leaderboard update live during the 98th Academy
              Awards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/create">
              <Button className="text-lg px-8 py-4">
                Create a Party
              </Button>
            </Link>
          </div>
        </section>

        {/* Join section */}
        <section className="max-w-lg mx-auto px-4 pb-16">
          <Card>
            <h2 className="text-lg font-bold text-oscar-text mb-3 text-center">
              Have an invite link?
            </h2>
            <form onSubmit={handleJoin} className="flex gap-2">
              <input
                type="text"
                placeholder="Paste party link or code"
                value={joinSlug}
                onChange={(e) => {
                  setJoinSlug(e.target.value);
                  setJoinError("");
                }}
                className="flex-1 px-4 py-3 rounded-lg bg-oscar-black border border-oscar-border text-oscar-text placeholder:text-oscar-text-muted/50 focus:outline-none focus:ring-2 focus:ring-oscar-gold/50 focus:border-oscar-gold transition-all"
              />
              <Button type="submit">Join</Button>
            </form>
            {joinError && (
              <p className="text-sm text-oscar-red mt-2">{joinError}</p>
            )}
          </Card>
        </section>

        {/* Features */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="text-center">
              <span className="text-3xl block mb-3">🎬</span>
              <h3 className="font-bold text-oscar-text mb-1">
                Create Your Party
              </h3>
              <p className="text-sm text-oscar-text-muted">
                Set up a pool in seconds. Share a link with friends — no
                sign-ups needed.
              </p>
            </Card>
            <Card className="text-center">
              <span className="text-3xl block mb-3">🗳️</span>
              <h3 className="font-bold text-oscar-text mb-1">Make Your Picks</h3>
              <p className="text-sm text-oscar-text-muted">
                Predict winners across all 24 Oscar categories on a
                mobile-friendly ballot.
              </p>
            </Card>
            <Card className="text-center">
              <span className="text-3xl block mb-3">📊</span>
              <h3 className="font-bold text-oscar-text mb-1">
                Live Leaderboard
              </h3>
              <p className="text-sm text-oscar-text-muted">
                Watch scores update in real-time as winners are announced during
                the ceremony.
              </p>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
