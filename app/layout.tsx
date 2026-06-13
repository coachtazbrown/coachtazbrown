import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Galactic Studio by Taz — faceless videos, automated and fact-checked",
  description:
    "Give it a topic. Galactic Studio researches it, grounds the script on clean data with RAG, fact-checks every claim, and produces a faceless YouTube video and a 16:9 LinkedIn short — script, captions, voiceover, thumbnail, and publish copy included. Plus training and coaching by Taz.",
  metadataBase: new URL("https://galacticstudio.app")
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
