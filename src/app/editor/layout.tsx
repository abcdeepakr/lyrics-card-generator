import type { Metadata } from "next";
import "../globals.css";
import { Providers } from "../provider";
import Script from "next/script";
import Head from "next/head";
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
    <html lang="en">
      <Head>
      <link rel="shortcut icon" href="/images/favicon.ico" />
      <meta property="og:image" content="/images/meta.ico" />
      </Head>
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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
