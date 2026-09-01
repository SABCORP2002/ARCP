import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Space_Grotesk, Inter } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <div className={`${spaceGrotesk.variable} ${inter.variable} font-body bg-background text-textPrimary`}>
        <Component {...pageProps} />
      </div>
    </LanguageProvider>
  );
}
