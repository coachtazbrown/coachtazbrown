import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { SITE, SITE_URL, organizationSchema, websiteSchema } from "@/lib/seo/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} — faceless videos, automated and fact-checked`,
    template: `%s · ${SITE.shortName}`
  },
  description: SITE.description,
  applicationName: SITE.shortName,
  authors: [{ name: SITE.author }],
  creator: SITE.author,
  publisher: SITE.name,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    url: SITE_URL,
    locale: SITE.locale,
    title: `${SITE.name} — faceless videos, automated and fact-checked`,
    description: SITE.description
  },
  twitter: {
    card: "summary_large_image",
    creator: SITE.twitter,
    title: SITE.name,
    description: SITE.description
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 }
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
