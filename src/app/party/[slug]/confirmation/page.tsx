"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ConfirmationPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-lg mx-auto px-4 py-12 w-full flex items-center">
        <Card gold className="w-full text-center animate-fade-in-up">
          <span className="text-6xl block mb-4">🏆</span>
          <h1 className="text-3xl font-bold text-oscar-gold mb-2">
            Picks Submitted!
          </h1>
          <p className="text-oscar-text-muted mb-6">
            Your Oscar predictions are locked in. Check the leaderboard during
            the ceremony to see how you stack up!
          </p>

          <div className="space-y-3">
            <Link href={`/party/${slug}/leaderboard`}>
              <Button fullWidth>View Leaderboard</Button>
            </Link>
            <Link href={`/party/${slug}/ballot`}>
              <Button variant="secondary" fullWidth>
                Edit My Picks
              </Button>
            </Link>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
