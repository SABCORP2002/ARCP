import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head />
      <body className="antialiased selection:bg-highlight/30">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
