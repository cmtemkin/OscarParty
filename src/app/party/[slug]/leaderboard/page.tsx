"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Confetti } from "@/components/ui/Confetti";

interface LeaderboardEntry {
  guestId: string;
  guestName: string;
  score: number;
  totalCategories: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  winnersMarked: number;
  totalCategories: number;
}

export default function LeaderboardPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<LeaderboardData | null>(null);
  const [partyName, setPartyName] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);
  const prevWinnersMarked = useRef(0);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`/api/parties/${slug}/leaderboard`);
      if (res.ok) {
        const newData: LeaderboardData = await res.json();

        // Trigger confetti when new winner is marked
        if (
          prevWinnersMarked.current > 0 &&
          newData.winnersMarked > prevWinnersMarked.current
        ) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 100);
        }
        prevWinnersMarked.current = newData.winnersMarked;

        setData(newData);
        setLoading(false);
      }
    } catch {
      // Silently fail polling
    }
  }, [slug]);

  useEffect(() => {
    // Fetch party name
    fetch(`/api/parties/${slug}`)
      .then((res) => res.json())
      .then((d) => setPartyName(d.name))
      .catch(() => {});

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, [slug, fetchLeaderboard]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-oscar-text-muted">Loading leaderboard...</p>
        </main>
      </div>
    );
  }

  const allDone = data && data.winnersMarked === data.totalCategories;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Confetti active={showConfetti} />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-oscar-gold mb-1">
            {allDone ? "Final Standings" : "Live Leaderboard"}
          </h1>
          {partyName && (
            <p className="text-oscar-text-muted text-lg">{partyName}</p>
          )}
          {data && (
            <p className="text-sm text-oscar-text-muted mt-2">
              {data.winnersMarked} of {data.totalCategories} categories
              announced
            </p>
          )}
        </div>

        {allDone && data && data.leaderboard.length > 0 && (
          <Card gold className="text-center mb-8 animate-fade-in-up">
            <span className="text-5xl block mb-2">🏆</span>
            <p className="text-2xl font-bold text-oscar-gold">
              {data.leaderboard[0].guestName}
            </p>
            <p className="text-oscar-text-muted">
              wins with {data.leaderboard[0].score} correct picks!
            </p>
          </Card>
        )}

        {data && data.leaderboard.length > 0 ? (
          <div className="space-y-2">
            {data.leaderboard.map((entry, idx) => {
              const rank = idx + 1;
              const medal =
                rank === 1
                  ? "🥇"
                  : rank === 2
                    ? "🥈"
                    : rank === 3
                      ? "🥉"
                      : `${rank}.`;

              return (
                <Card
                  key={entry.guestId}
                  gold={rank === 1}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-8 text-center">{medal}</span>
                    <span className="font-medium text-oscar-text">
                      {entry.guestName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-oscar-gold">
                      {entry.score}
                    </span>
                    <span className="text-oscar-text-muted text-sm ml-1">
                      / {data.winnersMarked}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center">
            <p className="text-oscar-text-muted">
              No guests have submitted picks yet. Share the party link to get
              started!
            </p>
          </Card>
        )}

        <p className="text-center text-xs text-oscar-text-muted mt-6">
          Updates automatically every 10 seconds
        </p>
      </main>
      <Footer />
    </div>
  );
}
