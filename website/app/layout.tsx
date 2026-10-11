import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/navbar'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'QAI-OLI · Quantum-Classical Oral Cancer Screening',
    template: '%s · QAI-OLI',
  },
  description:
    'Advanced hybrid quantum-classical AI (QAI-OLI) for oral lesion clinical triage and risk stratification. 83.77% 4-class multi-center SOTA accuracy, 89.40% OCA malignancy sensitivity, and 98.40% screening triage. Powered by the Q-ConX-Dense tri-stage ensemble combining ConvNeXt-V2, DenseNet-121, and 8-Qubit VQC.',
  keywords: ['oral cancer', 'AI screening', 'quantum machine learning', 'OPMD', 'oral lesion', 'clinical AI'],
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0f172a',
  colorScheme: 'light',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <Navbar />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
