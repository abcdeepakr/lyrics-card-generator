import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "../provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Generate lyric cards",
  description: "Generate lyric based cards with album arts powered by Spotify",
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <Providers>{children}</Providers>
  );
}
