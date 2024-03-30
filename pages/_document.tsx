import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script';

const GTAG_ID = process.env.GTAG_ID;


export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        {process.env.NODE_ENV === "production" && (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}></Script>
            <Script id="google-analytics">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GTAG_ID}');
              `}
            </Script>
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
