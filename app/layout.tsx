import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Taz Brown Strategies — we red-team your strategy before reality does",
  description:
    "A red-teaming practice for founders and leadership teams. Premortems, assumption checks, war-games, and a Red Teaming Partner that coaches you through every one — the canon, 1587 to today.",
  metadataBase: new URL("https://tazbrownstrategies.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
