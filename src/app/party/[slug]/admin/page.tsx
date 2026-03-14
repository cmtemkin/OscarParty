"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

interface PartyInfo {
  name: string;
  guestCount: number;
  winnersMarked: number;
}

interface GuestData {
  guestId: string;
  guestName: string;
  score: number;
}

export default function AdminPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [partyInfo, setPartyInfo] = useState<PartyInfo | null>(null);
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedAdmin, setCopiedAdmin] = useState(false);

  const fetchPartyInfo = useCallback(async () => {
    const res = await fetch(`/api/parties/${slug}`);
    if (res.ok) {
      const data = await res.json();
      setPartyInfo(data);
    }
  }, [slug]);

  const fetchLeaderboard = useCallback(async () => {
    const res = await fetch(`/api/parties/${slug}/leaderboard`);
    if (res.ok) {
      const data = await res.json();
      setGuests(data.leaderboard || []);
    }
  }, [slug]);

  useEffect(() => {
    if (authenticated) {
      fetchPartyInfo();
      fetchLeaderboard();
    }
  }, [authenticated, fetchPartyInfo, fetchLeaderboard]);

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

  function copyAdminLink() {
    const url = `${window.location.origin}/party/${slug}/admin`;
    navigator.clipboard.writeText(url);
    setCopiedAdmin(true);
    setTimeout(() => setCopiedAdmin(false), 2000);
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
                Party Admin
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
              {partyInfo?.guestCount || 0} guests
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" onClick={copyPartyLink}>
              {copied ? "Copied!" : "Copy Invite Link"}
            </Button>
            <Button variant="secondary" onClick={copyAdminLink}>
              {copiedAdmin ? "Copied!" : "Copy Admin Link"}
            </Button>
            <Button variant="secondary" onClick={exportCSV}>
              Export CSV
            </Button>
          </div>
        </div>

        {/* Guest list */}
        <h2 className="text-lg font-bold text-oscar-text mb-4">
          Guests ({guests.length})
        </h2>

        {guests.length === 0 ? (
          <Card className="text-center">
            <p className="text-oscar-text-muted">
              No guests have submitted picks yet. Share the invite link to get
              started!
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {guests.map((guest) => (
              <Card
                key={guest.guestId}
                className="flex items-center justify-between"
              >
                <span className="font-medium text-oscar-text">
                  {guest.guestName}
                </span>
                <span className="text-oscar-text-muted text-sm">
                  {guest.score} correct
                </span>
              </Card>
            ))}
          </div>
        )}

        {/* Leaderboard link */}
        <div className="mt-8 text-center">
          <a
            href={`/party/${slug}/leaderboard`}
            className="text-oscar-gold hover:underline"
          >
            View Live Leaderboard →
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
