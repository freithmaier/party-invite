import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Theresa wird 25 – Geburtstagsparty 🎉",
  description:
    "Du bist herzlich eingeladen! 5. September, ab 19:00 Uhr · Buchenweg 1, 94447 Plattling. Öffne deine persönliche Einladung und sag zu! 🍻",
  openGraph: {
    title: "Theresa wird 25 – Geburtstagsparty 🎉",
    description:
      "Du bist herzlich eingeladen! 5. September, ab 19:00 Uhr · Buchenweg 1, 94447 Plattling.",
    siteName: "Theresas Geburtstagsparty",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
