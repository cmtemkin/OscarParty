"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

interface PartyResult {
  slug: string;
  name: string;
  adminPassword: string;
}

export default function CreatePartyPage() {
  const [name, setName] = useState("");
  const [customPassword, setCustomPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PartyResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a party name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/parties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          customPassword: customPassword.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create party");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  const partyUrl = result
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/party/${result.slug}`
    : "";
  const adminUrl = result ? `${partyUrl}/admin` : "";

  if (result) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
          <div className="text-center mb-8 animate-fade-in-up">
            <span className="text-5xl mb-4 block">🏆</span>
            <h1 className="text-3xl font-bold text-oscar-gold mb-2">
              Party Created!
            </h1>
            <p className="text-oscar-text-muted text-lg">{result.name}</p>
          </div>

          <div className="space-y-4">
            <Card gold>
              <h2 className="text-lg font-bold text-oscar-gold mb-2">
                Share this link with your guests
              </h2>
              <div className="flex gap-2">
                <code className="flex-1 bg-oscar-black px-4 py-3 rounded-lg text-sm break-all">
                  {partyUrl}
                </code>
                <Button
                  onClick={() => copyToClipboard(partyUrl, "party")}
                  variant="secondary"
                  className="shrink-0"
                >
                  {copied === "party" ? "Copied!" : "Copy"}
                </Button>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-bold text-oscar-text mb-2">
                Admin Dashboard
              </h2>
              <p className="text-sm text-oscar-text-muted mb-3">
                Use this URL and password to manage your party and mark winners.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-oscar-text-muted block mb-1">
                    Admin URL
                  </label>
                  <div className="flex gap-2">
                    <code className="flex-1 bg-oscar-black px-4 py-3 rounded-lg text-sm break-all">
                      {adminUrl}
                    </code>
                    <Button
                      onClick={() => copyToClipboard(adminUrl, "admin")}
                      variant="secondary"
                      className="shrink-0"
                    >
                      {copied === "admin" ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-oscar-text-muted block mb-1">
                    Admin Password
                  </label>
                  <div className="flex gap-2">
                    <code className="flex-1 bg-oscar-black px-4 py-3 rounded-lg text-sm font-mono">
                      {result.adminPassword}
                    </code>
                    <Button
                      onClick={() =>
                        copyToClipboard(result.adminPassword, "password")
                      }
                      variant="secondary"
                      className="shrink-0"
                    >
                      {copied === "password" ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-oscar-red mt-3">
                Save this password! It won&apos;t be shown again.
              </p>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => (window.location.href = partyUrl)}
                fullWidth
              >
                Go to Party
              </Button>
              <Button
                onClick={() => (window.location.href = adminUrl)}
                variant="secondary"
                fullWidth
              >
                Admin Dashboard
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-lg mx-auto px-4 py-12 w-full">
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">🏆</span>
          <h1 className="text-3xl font-bold text-oscar-gold mb-2">
            Create an Oscar Party
          </h1>
          <p className="text-oscar-text-muted">
            Set up your pool for the 98th Academy Awards
          </p>
        </div>

        <Card>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Party Name"
              placeholder='e.g., "The Smiths Oscar Night 2026"'
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <Input
              label="Admin Password (optional)"
              placeholder="Leave blank to auto-generate"
              value={customPassword}
              onChange={(e) => setCustomPassword(e.target.value)}
              type="text"
            />
            {error && <p className="text-sm text-oscar-red">{error}</p>}
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Creating..." : "Create Party"}
            </Button>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
