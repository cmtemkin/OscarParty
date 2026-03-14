"use client";

import { useState, useEffect, useCallback } from "react";
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

interface PartyData {
  id: string;
  name: string;
  slug: string;
  guestCount: number;
  createdAt: string;
}

export default function SystemAdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<"winners" | "parties">("winners");

  // Winners state
  const [winners, setWinners] = useState<WinnerData[]>([]);
  const [markingCategory, setMarkingCategory] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Parties state
  const [parties, setParties] = useState<PartyData[]>([]);
  const [deletingParty, setDeletingParty] = useState<string | null>(null);
  const [regeneratingParty, setRegeneratingParty] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const fetchWinners = useCallback(async () => {
    const res = await fetch("/api/admin/winners");
    if (res.ok) {
      const data = await res.json();
      setWinners(data.winners);
    }
  }, []);

  const fetchParties = useCallback(async () => {
    const res = await fetch("/api/admin/parties");
    if (res.ok) {
      const data = await res.json();
      setParties(data.parties);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchWinners();
      fetchParties();
    }
  }, [authenticated, fetchWinners, fetchParties]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/verify", {
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
      const res = await fetch("/api/admin/winners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, nomineeId }),
      });

      if (res.ok) {
        setWinners((prev) => {
          const filtered = prev.filter((w) => w.categoryId !== categoryId);
          return [...filtered, { categoryId, nomineeId }];
        });
      }
    } finally {
      setMarkingCategory(null);
    }
  }

  async function resetWinners() {
    const res = await fetch("/api/admin/winners", { method: "DELETE" });
    if (res.ok) {
      setWinners([]);
      setShowResetConfirm(false);
    }
  }

  async function handleDeleteParty(partyId: string) {
    setDeletingParty(partyId);
    try {
      const res = await fetch(`/api/admin/parties/${partyId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setParties((prev) => prev.filter((p) => p.id !== partyId));
      }
    } finally {
      setDeletingParty(null);
    }
  }

  async function handleRegenerateSlug(partyId: string) {
    setRegeneratingParty(partyId);
    try {
      const res = await fetch(`/api/admin/parties/${partyId}`, {
        method: "PATCH",
      });
      if (res.ok) {
        const data = await res.json();
        setParties((prev) =>
          prev.map((p) =>
            p.id === partyId ? { ...p, slug: data.newSlug } : p
          )
        );
      }
    } finally {
      setRegeneratingParty(null);
    }
  }

  function copyPartyLink(slug: string) {
    const url = `${window.location.origin}/party/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  // Password gate
  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-lg mx-auto px-4 py-12 w-full flex items-center">
          <Card className="w-full">
            <div className="text-center mb-6">
              <span className="text-4xl block mb-2">🔒</span>
              <h1 className="text-2xl font-bold text-oscar-gold">
                System Admin
              </h1>
              <p className="text-sm text-oscar-text-muted mt-1">
                Enter the system admin password
              </p>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              <Input
                type="password"
                placeholder="System admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {authError && (
                <p className="text-sm text-oscar-red">{authError}</p>
              )}
              <Button type="submit" fullWidth disabled={authLoading}>
                {authLoading ? "Verifying..." : "Unlock System Admin"}
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-oscar-gold mb-1">
            System Admin
          </h1>
          <p className="text-oscar-text-muted">
            Manage Oscar winners and all parties
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("winners")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "winners"
                ? "bg-oscar-gold text-oscar-black"
                : "bg-oscar-card text-oscar-text-muted hover:text-oscar-text"
            }`}
          >
            Mark Winners ({winners.length}/{CATEGORIES.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("parties");
              fetchParties();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "parties"
                ? "bg-oscar-gold text-oscar-black"
                : "bg-oscar-card text-oscar-text-muted hover:text-oscar-text"
            }`}
          >
            Manage Parties ({parties.length})
          </button>
        </div>

        {/* Winners Tab */}
        {activeTab === "winners" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-oscar-text-muted text-sm">
                {winners.length} of {CATEGORIES.length} winners marked — applies
                to all parties
              </p>
              <Button
                variant="danger"
                onClick={() => setShowResetConfirm(true)}
              >
                Reset All Winners
              </Button>
            </div>

            {showResetConfirm && (
              <Card className="mb-6 border-oscar-red">
                <p className="text-oscar-text mb-3">
                  Are you sure? This will reset all winners and clear every
                  party&apos;s leaderboard scores.
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

            <div className="space-y-3">
              {CATEGORIES.map((category) => {
                const currentWinner = winnersMap.get(category.id);
                const winnerNominee = currentWinner
                  ? category.nominees.find((n) => n.id === currentWinner)
                  : null;
                const isMarking = markingCategory === category.id;

                return (
                  <Card key={category.id} gold={!!currentWinner}>
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
          </>
        )}

        {/* Parties Tab */}
        {activeTab === "parties" && (
          <>
            <p className="text-oscar-text-muted text-sm mb-4">
              {parties.length} total parties
            </p>

            {parties.length === 0 ? (
              <Card className="text-center">
                <p className="text-oscar-text-muted">
                  No parties created yet.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {parties.map((party) => (
                  <Card key={party.id}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-oscar-text truncate">
                          {party.name}
                        </h3>
                        <p className="text-sm text-oscar-text-muted">
                          /{party.slug} &middot; {party.guestCount} guests
                          &middot; Created{" "}
                          {new Date(party.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0 flex-wrap">
                        <Button
                          variant="secondary"
                          onClick={() => copyPartyLink(party.slug)}
                        >
                          {copiedSlug === party.slug ? "Copied!" : "Copy Link"}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => handleRegenerateSlug(party.id)}
                          disabled={regeneratingParty === party.id}
                        >
                          {regeneratingParty === party.id
                            ? "Regenerating..."
                            : "New Link"}
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteParty(party.id)}
                          disabled={deletingParty === party.id}
                        >
                          {deletingParty === party.id
                            ? "Deleting..."
                            : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
