import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Retail Agent Co — AI employees for specialty retailers",
  description:
    "Eight productized AI agents built for Shopify specialty retailers doing $1M–$5M GMV. Live in a week. Cancel anytime.",
  metadataBase: new URL("https://retail-agent.co")
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
