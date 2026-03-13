"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { CATEGORIES } from "@/data/nominees";

interface WinnerData {
  categoryId: string;
  nomineeId: string;
}

interface PartyInfo {
  name: string;
  guestCount: number;
  winnersMarked: number;
}

export default function AdminPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [partyInfo, setPartyInfo] = useState<PartyInfo | null>(null);
  const [winners, setWinners] = useState<WinnerData[]>([]);
  const [markingCategory, setMarkingCategory] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchPartyInfo = useCallback(async () => {
    const res = await fetch(`/api/parties/${slug}`);
    if (res.ok) {
      const data = await res.json();
      setPartyInfo(data);
    }
  }, [slug]);

  const fetchWinners = useCallback(async () => {
    const res = await fetch(`/api/parties/${slug}/admin/winners`);
    if (res.ok) {
      const data = await res.json();
      setWinners(data.winners);
    }
  }, [slug]);

  useEffect(() => {
    if (authenticated) {
      fetchPartyInfo();
      fetchWinners();
      // Poll every 10 seconds
      const interval = setInterval(() => {
        fetchPartyInfo();
        fetchWinners();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [authenticated, fetchPartyInfo, fetchWinners]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch(`/api/parties/${slug}/admin/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Invalid password");
      }

      setAuthenticated(true);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  }

  async function markWinner(categoryId: string, nomineeId: string) {
    setMarkingCategory(categoryId);
    try {
      const res = await fetch(`/api/parties/${slug}/admin/winners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, nomineeId }),
      });

      if (res.ok) {
        setWinners((prev) => {
          const filtered = prev.filter((w) => w.categoryId !== categoryId);
          return [...filtered, { categoryId, nomineeId }];
        });
        fetchPartyInfo();
      }
    } finally {
      setMarkingCategory(null);
    }
  }

  async function resetWinners() {
    const res = await fetch(`/api/parties/${slug}/admin/winners`, {
      method: "DELETE",
    });

    if (res.ok) {
      setWinners([]);
      setShowResetConfirm(false);
      fetchPartyInfo();
    }
  }

  async function exportCSV() {
    const res = await fetch(`/api/parties/${slug}/admin/export`);
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}-picks.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  function copyPartyLink() {
    const url = `${window.location.origin}/party/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Password gate
  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-lg mx-auto px-4 py-12 w-full flex items-center">
          <Card className="w-full">
            <div className="text-center mb-6">
              <span className="text-4xl block mb-2">🔐</span>
              <h1 className="text-2xl font-bold text-oscar-gold">
                Admin Dashboard
              </h1>
              <p className="text-sm text-oscar-text-muted mt-1">
                Enter the admin password to continue
              </p>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {authError && (
                <p className="text-sm text-oscar-red">{authError}</p>
              )}
              <Button type="submit" fullWidth disabled={authLoading}>
                {authLoading ? "Verifying..." : "Unlock Dashboard"}
              </Button>
            </form>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const winnersMap = new Map(winners.map((w) => [w.categoryId, w.nomineeId]));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Party info header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-oscar-gold">
              {partyInfo?.name || "Loading..."}
            </h1>
            <p className="text-oscar-text-muted">
              {partyInfo?.guestCount || 0} guests &middot;{" "}
              {winners.length} of {CATEGORIES.length} winners marked
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" onClick={copyPartyLink}>
              {copied ? "Copied!" : "Copy Party Link"}
            </Button>
            <Button variant="secondary" onClick={exportCSV}>
              Export CSV
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowResetConfirm(true)}
            >
              Reset Winners
            </Button>
          </div>
        </div>

        {/* Reset confirmation */}
        {showResetConfirm && (
          <Card className="mb-6 border-oscar-red">
            <p className="text-oscar-text mb-3">
              Are you sure you want to reset all winners? This will clear the
              leaderboard scores.
            </p>
            <div className="flex gap-2">
              <Button variant="danger" onClick={resetWinners}>
                Yes, Reset All
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Categories + winner selection */}
        <div className="space-y-3">
          {CATEGORIES.map((category) => {
            const currentWinner = winnersMap.get(category.id);
            const winnerNominee = currentWinner
              ? category.nominees.find((n) => n.id === currentWinner)
              : null;
            const isMarking = markingCategory === category.id;

            return (
              <Card
                key={category.id}
                gold={!!currentWinner}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-oscar-text">
                      {category.name}
                    </h3>
                    {winnerNominee && (
                      <p className="text-oscar-gold text-sm mt-1">
                        Winner:{" "}
                        {winnerNominee.detail
                          ? `${winnerNominee.detail} — ${winnerNominee.name}`
                          : winnerNominee.name}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <select
                      className="bg-oscar-black border border-oscar-border rounded-lg px-3 py-2 text-oscar-text text-sm w-full sm:w-64 cursor-pointer"
                      value={currentWinner || ""}
                      onChange={(e) => {
                        if (e.target.value) {
                          markWinner(category.id, e.target.value);
                        }
                      }}
                      disabled={isMarking}
                    >
                      <option value="">
                        {isMarking ? "Marking..." : "Select winner..."}
                      </option>
                      {category.nominees.map((nominee) => (
                        <option key={nominee.id} value={nominee.id}>
                          {nominee.detail
                            ? `${nominee.detail} — ${nominee.name}`
                            : nominee.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
