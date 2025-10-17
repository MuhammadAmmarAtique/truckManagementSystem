import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        {/*Main is a placeholder component provided by Next.js which render the cureent page component. */}
        <Main />
        {/* NextScript injects all the JavaScript Next.js needs to:*/}
        {/* 1- Make the app interactive in the browser (hydration) */}
        {/* 2- Enable routing, lazy loading  */}
        <NextScript />
      </body>
    </Html>
  );
}
