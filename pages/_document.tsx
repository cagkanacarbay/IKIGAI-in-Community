import { Html, Head, Main, NextScript } from 'next/document'

const GTAG_ID = process.env.GTAG_ID;


export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {GTAG_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GTAG_ID}');
                `,
              }}
            />
          </>
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </Head> 
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
