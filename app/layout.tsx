import { Inter } from 'next/font/google';
import '@/styles/globals.css'


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Journey',
  description: 'Ikigai help me',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <body className={`${inter.className}`}>{children}</body>
    </html>
  )
}
