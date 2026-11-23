import type { Metadata } from "next";
import "./globals.css";
import NotificationRenderer from "./components/shared/NotificationRenderer";
import MobileBackGuard from "./components/shared/MobileBackGuard";
import SchemaOrg from "./components/shared/SchemaOrg";

const siteUrl = 'https://www.chitrojaal.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "চিত্রজাল (ChitroJaal) - Cinematic Wedding Photography & Films in Feni, Bangladesh",
  description:
    "ChitroJaal (চিত্রজাল) is Feni's premier photography agency, founded by CEO Salman H Choudhury and developed by MD. SAHARIAR HOSEN SUPTO. Specializing in cinematic wedding photography, event videography, and portrait films in Feni, Bangladesh.",
  authors: [
    { name: "MD. SAHARIAR HOSEN SUPTO", url: "https://dev-sahariarsupto.vercel.app/" },
    { name: "Salman H Choudhury (CEO)" },
  ],
  creator: "MD. SAHARIAR HOSEN SUPTO",
  publisher: "ChitroJaal",
  keywords: [
    "MD. SAHARIAR HOSEN SUPTO",
    "Sahariar Supto Developer",
    "MD. SAHARIAR HOSEN SUPTO Developer",
    "ChitroJaal Developer",
    "Salman H Choudhury",
    "Salman H Choudhury CEO",
    "ChitroJaal CEO",
    "ChitroJaal",
    "ChitroJaal",
    "চিত্রজাল",
    "Feni photography agency",
    "Feni Photography Studio",
    "Best Photographer in Feni",
    "Wedding Photography Bangladesh",
    "Cinematic Wedding Feni",
    "Event Photography Feni",
    "ওয়েডিং ফটোগ্রাফি ফেণী",
    "চিত্রজাল ফটোগ্রাফি",
    "ChitroJaal Wedding Photography",
    "ChitroJaal Event Photography",
    "ChitroJaal Portrait Photography",
    "ChitroJaal Cinematic Wedding",
    "ChitroJaal Cinematic Event",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "চিত্রজাল (ChitroJaal) - Premium Wedding Photography & Cinematography in Bangladesh",
    description:
      "ChitroJaal (চিত্রজাল) is Feni's premier photography agency, founded by CEO Salman H Choudhury and developed by MD. SAHARIAR HOSEN SUPTO. Capture your special wedding moments beautifully in Feni & Bangladesh.",
    url: siteUrl,
    siteName: "ChitroJaal (চিত্রজাল)",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 800,
        height: 600,
        alt: "ChitroJaal Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "চিত্রজাল (ChitroJaal) - Premium Wedding Photography & Cinematography in Bangladesh",
    description:
      "ChitroJaal (চিত্রজাল) is Feni's premier photography agency, founded by CEO Salman H Choudhury and developed by MD. SAHARIAR HOSEN SUPTO.",
    images: [`${siteUrl}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <SchemaOrg />
        {children}
        <NotificationRenderer />
        <MobileBackGuard />
      </body>
    </html>
  );
}
