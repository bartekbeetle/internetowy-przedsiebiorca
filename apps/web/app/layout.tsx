import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Internetowy Przedsiebiorca - Zarabiaj online bez pokazywania twarzy",
    template: "%s | Internetowy Przedsiebiorca",
  },
  description:
    "Naucz sie budowac dochodowe konto w social media bez nagrywania sie, bez drogiego sprzetu i bez bycia ekspertem od wszystkiego.",
  keywords: [
    "faceless content",
    "zarabianie online",
    "instagram bez twarzy",
    "content creator",
    "zarabianie w internecie",
  ],
  authors: [{ name: "Bartek", url: "https://internetowyprzedsiebiorca.pl" }],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://internetowyprzedsiebiorca.pl",
    siteName: "Internetowy Przedsiebiorca",
    title: "Zarabiaj online. Bez pokazywania twarzy.",
    description:
      "Naucz sie budowac dochodowe konto w social media bez nagrywania sie.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
