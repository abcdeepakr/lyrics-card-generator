import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
const inter = Inter({ subsets: ["latin"] });
import Script from "next/script";

export const metadata: Metadata = {
  title: "Generate lyric cards",
  description: "Generate lyric based cards with album arts powered by Spotify",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-6X8D9SV2PV"></Script>
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: ` window.dataLayer = window.dataLayer || [];
        function gtag(){
          dataLayer.push(arguments);
  }
        gtag('js', new Date());

        gtag('config', 'G-6X8D9SV2PV');`,
        }}
      />
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
