import { Inter } from 'next/font/google';
import '@/styles/globals.css'
import Head from 'next/head';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Journey',
  description: 'explore your ikigai',
}

const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID;


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {process.env.VERCEL_ENV === 'production' && (
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
      </head>
      <body className={`${inter.className}`}>
        {children}
      </body>
    </html>
  )
}
