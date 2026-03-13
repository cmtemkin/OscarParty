"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function JoinPartyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [partyName, setPartyName] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/parties/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => {
        setPartyName(data.name);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setJoining(true);
    setError("");

    try {
      const res = await fetch(`/api/parties/${slug}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to join");
      }

      router.push(`/party/${slug}/ballot`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-oscar-text-muted">Loading...</p>
        </main>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="text-center max-w-md">
            <span className="text-4xl block mb-4">😕</span>
            <h1 className="text-2xl font-bold text-oscar-text mb-2">
              Party Not Found
            </h1>
            <p className="text-oscar-text-muted mb-4">
              This party doesn&apos;t exist. Check your link and try again.
            </p>
            <Button onClick={() => router.push("/")}>Go Home</Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-lg mx-auto px-4 py-12 w-full">
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="text-5xl mb-4 block">🎬</span>
          <h1 className="text-3xl font-bold text-oscar-gold mb-2">
            {partyName}
          </h1>
          <p className="text-oscar-text-muted">
            Enter your name to join the party and make your picks!
          </p>
        </div>

        <Card gold>
          <form onSubmit={handleJoin} className="space-y-4">
            <Input
              label="Your Name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            {error && <p className="text-sm text-oscar-red">{error}</p>}
            <Button type="submit" fullWidth disabled={joining}>
              {joining ? "Joining..." : "Join Party"}
            </Button>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
