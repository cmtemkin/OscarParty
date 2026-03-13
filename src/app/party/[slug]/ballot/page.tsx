"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useBallotForm } from "@/hooks/useBallotForm";
import { CATEGORIES } from "@/data/nominees";

export default function BallotPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [guestId, setGuestId] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if guest is registered by trying to fetch party
    fetch(`/api/parties/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then(() => {
        // Guest ID is in cookie, we'll use slug as proxy identifier for the hook
        setGuestId(slug);
        setLoading(false);
      })
      .catch(() => {
        router.push(`/party/${slug}`);
      });
  }, [slug, router]);

  if (loading || !guestId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-oscar-text-muted">Loading ballot...</p>
        </main>
      </div>
    );
  }

  return <BallotContent slug={slug} guestId={guestId} showReview={showReview} setShowReview={setShowReview} />;
}

function BallotContent({
  slug,
  guestId,
  showReview,
  setShowReview,
}: {
  slug: string;
  guestId: string;
  showReview: boolean;
  setShowReview: (v: boolean) => void;
}) {
  const router = useRouter();
  const ballot = useBallotForm(slug, guestId);
  const category = CATEGORIES[ballot.currentCategoryIndex];

  async function handleSubmit() {
    try {
      await ballot.submitBallot();
      router.push(`/party/${slug}/confirmation`);
    } catch {
      // error is displayed via ballot.error
    }
  }

  if (showReview) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
          <h1 className="text-2xl font-bold text-oscar-gold mb-2">
            Review Your Picks
          </h1>
          <p className="text-oscar-text-muted mb-6">
            Make sure everything looks right before submitting.
          </p>

          <div className="space-y-3 mb-8">
            {CATEGORIES.map((cat, idx) => {
              const nomineeId = ballot.picks[cat.id];
              const nominee = cat.nominees.find((n) => n.id === nomineeId);
              return (
                <Card
                  key={cat.id}
                  className="flex items-center justify-between cursor-pointer hover:bg-oscar-card-hover transition-colors"
                  onClick={() => {
                    ballot.goToCategory(idx);
                    setShowReview(false);
                  }}
                >
                  <div>
                    <p className="text-sm text-oscar-text-muted">{cat.name}</p>
                    <p className="text-oscar-text font-medium">
                      {nominee
                        ? nominee.detail
                          ? `${nominee.detail} — ${nominee.name}`
                          : nominee.name
                        : "—"}
                    </p>
                  </div>
                  {nomineeId ? (
                    <span className="text-oscar-gold text-lg">✓</span>
                  ) : (
                    <span className="text-oscar-red text-sm">Missing</span>
                  )}
                </Card>
              );
            })}
          </div>

          {ballot.error && (
            <p className="text-sm text-oscar-red mb-4">{ballot.error}</p>
          )}

          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowReview(false)}
            >
              Back to Ballot
            </Button>
            <Button
              fullWidth
              disabled={!ballot.isComplete || ballot.isSubmitting}
              onClick={handleSubmit}
            >
              {ballot.isSubmitting ? "Submitting..." : "Submit Picks"}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        <ProgressBar
          current={ballot.completedCount}
          total={ballot.totalCategories}
        />

        <div className="mt-6 mb-4 flex items-center justify-between">
          <p className="text-sm text-oscar-text-muted">
            Category {ballot.currentCategoryIndex + 1} of{" "}
            {ballot.totalCategories}
          </p>
          {ballot.completedCount > 0 && (
            <button
              className="text-sm text-oscar-gold hover:underline cursor-pointer"
              onClick={() => setShowReview(true)}
            >
              Review all picks
            </button>
          )}
        </div>

        <Card gold className="mb-6">
          <h2 className="text-xl font-bold text-oscar-gold mb-4">
            {category.name}
          </h2>
          <div className="space-y-2">
            {category.nominees.map((nominee) => {
              const selected = ballot.picks[category.id] === nominee.id;
              return (
                <button
                  key={nominee.id}
                  onClick={() => {
                    ballot.setPick(category.id, nominee.id);
                    // Auto-advance: go to next category, or show review on last one
                    setTimeout(() => {
                      if (ballot.currentCategoryIndex < CATEGORIES.length - 1) {
                        ballot.goToNext();
                      } else {
                        setShowReview(true);
                      }
                    }, 300);
                  }}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
                    ${
                      selected
                        ? "border-oscar-gold bg-oscar-gold/10 text-oscar-text"
                        : "border-oscar-border bg-oscar-card hover:bg-oscar-card-hover text-oscar-text"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      {nominee.detail ? (
                        <>
                          <p className="font-medium">{nominee.detail}</p>
                          <p className="text-sm text-oscar-text-muted">
                            {nominee.name}
                          </p>
                        </>
                      ) : (
                        <p className="font-medium">{nominee.name}</p>
                      )}
                    </div>
                    {selected && (
                      <span className="text-oscar-gold text-xl">✓</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={ballot.goToPrevious}
            disabled={ballot.currentCategoryIndex === 0}
            className="flex-1"
          >
            ← Previous
          </Button>

          {ballot.currentCategoryIndex < CATEGORIES.length - 1 ? (
            <Button onClick={ballot.goToNext} className="flex-1">
              Next →
            </Button>
          ) : (
            <Button
              onClick={() => setShowReview(true)}
              className="flex-1"
              disabled={!ballot.isComplete}
            >
              Review & Submit
            </Button>
          )}
        </div>

        {/* Category quick nav — 2 rows of 12 */}
        <div className="mt-8 flex flex-col gap-1 items-center">
          {[CATEGORIES.slice(0, 12), CATEGORIES.slice(12)].map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-1 justify-center">
              {row.map((cat, colIdx) => {
                const idx = rowIdx * 12 + colIdx;
                const filled = !!ballot.picks[cat.id];
                const active = idx === ballot.currentCategoryIndex;
                return (
                  <button
                    key={cat.id}
                    onClick={() => ballot.goToCategory(idx)}
                    className={`
                      w-6 h-6 rounded-full text-xs flex items-center justify-center cursor-pointer transition-all
                      ${active ? "ring-2 ring-oscar-gold ring-offset-1 ring-offset-oscar-bg" : ""}
                      ${filled ? "bg-oscar-gold text-oscar-black" : "bg-oscar-card text-oscar-text-muted"}
                    `}
                    title={cat.name}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
