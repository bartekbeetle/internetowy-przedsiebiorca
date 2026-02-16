import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "@/components/layout/SessionProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Klub Internetowy Przedsiebiorca",
    template: "%s | Klub IP",
  },
  description:
    "Spolecznosc tworcow faceless content. Dyskusje, kursy, biblioteka rolek i wiecej.",
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
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
