import { Html, Head, Main, NextScript } from 'next/document'

const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID;


export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {process.env.VERCEL_ENV === 'production' && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}></script>
            <script id="google-analytics">
              {`
                console.log("GTAG_ID", '${GTAG_ID}');
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GTAG_ID}');
              `}
            </script>
          </>
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
