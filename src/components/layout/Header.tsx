import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-oscar-border bg-oscar-bg/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">🏆</span>
          <span className="text-xl font-bold text-oscar-gold">
            Oscar Party
          </span>
        </Link>
      </div>
    </header>
  );
}
