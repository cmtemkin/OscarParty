import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oscar Party — Host Your Oscar Night. Pick Your Winners.",
  description:
    "Create an Oscar pool, invite friends, collect predictions, and track results live during the 98th Academy Awards ceremony.",
  openGraph: {
    title: "Oscar Party",
    description: "Host Your Oscar Night. Pick Your Winners.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
