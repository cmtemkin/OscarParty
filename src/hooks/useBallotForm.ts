"use client";

import { useState, useEffect, useCallback } from "react";
import { CATEGORIES, TOTAL_CATEGORIES } from "@/data/nominees";

type BallotState = Record<string, string>;

interface UseBallotFormReturn {
  picks: BallotState;
  setPick: (categoryId: string, nomineeId: string) => void;
  completedCount: number;
  totalCategories: number;
  isComplete: boolean;
  currentCategoryIndex: number;
  goToCategory: (index: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  submitBallot: () => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export function useBallotForm(
  partySlug: string,
  guestId: string
): UseBallotFormReturn {
  const storageKey = `ballot:${partySlug}:${guestId}`;

  const [picks, setPicksState] = useState<BallotState>({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        setPicksState(JSON.parse(saved));
      }
    } catch {
      // sessionStorage not available
    }
  }, [storageKey]);

  // Persist to sessionStorage on change
  useEffect(() => {
    if (Object.keys(picks).length > 0) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(picks));
      } catch {
        // sessionStorage not available
      }
    }
  }, [picks, storageKey]);

  const setPick = useCallback((categoryId: string, nomineeId: string) => {
    setPicksState((prev) => ({ ...prev, [categoryId]: nomineeId }));
  }, []);

  const completedCount = Object.keys(picks).length;
  const isComplete = completedCount === TOTAL_CATEGORIES;

  const goToCategory = useCallback((index: number) => {
    setCurrentCategoryIndex(Math.max(0, Math.min(index, CATEGORIES.length - 1)));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentCategoryIndex((prev) =>
      Math.min(prev + 1, CATEGORIES.length - 1)
    );
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentCategoryIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const submitBallot = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/parties/${partySlug}/picks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ picks }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit picks");
      }

      sessionStorage.removeItem(storageKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [partySlug, picks, storageKey]);

  return {
    picks,
    setPick,
    completedCount,
    totalCategories: TOTAL_CATEGORIES,
    isComplete,
    currentCategoryIndex,
    goToCategory,
    goToNext,
    goToPrevious,
    submitBallot,
    isSubmitting,
    error,
  };
}
