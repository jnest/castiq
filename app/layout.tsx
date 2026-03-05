import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navigation from '@/components/shared/Navigation'

export const metadata: Metadata = {
  title: 'CastIQ — AI Fishing Guide',
  description: 'Point your camera at water and get instant AI analysis. Learn to read water like a pro fishing guide.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CastIQ',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#070d1a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-950 text-dark-100 min-h-screen antialiased">
        <main className="pb-20 min-h-screen">
          {children}
        </main>
        <Navigation />
      </body>
    </html>
  )
}
