import type { Metadata } from 'next'
import { Space_Grotesk, Space_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/layout/Navbar'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-grotesk',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ShaDe-Fi — DeFi Payroll Transactions for Crypto Employers',
  description:
    'ShaDe-Fi is the first confidential AMM on Ethereum. Encrypted reserves make MEV structurally impossible. DeFi payroll transactions that help Crypto employers pay their teams without MEV extraction.',
  keywords: ['DeFi', 'AMM', 'MEV', 'fhEVM', 'confidential', 'payroll', 'crypto employers', 'Zama'],
  openGraph: {
    title: 'ShaDe-Fi — DeFi Payroll Transactions for Crypto Employers',
    description: 'The pool is blind. Encrypted reserves. Zero MEV.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
