import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script';

const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID;


export default function Document() {
  return (
    <Html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {process.env.VERCEL_ENV === 'production' && (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}></Script>
            <Script id="google-analytics">
              {`
                console.log("GTAG_ID", '${GTAG_ID}');
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GTAG_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
