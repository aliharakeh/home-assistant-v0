import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import type React from 'react'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Home Assistant',
    description: 'Track and manage your properties',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Home Assistant',
    },
    formatDetection: {
        telephone: true,
    },
    generator: 'v0.dev',
}

export const viewport: Viewport = {
    themeColor: '#3b82f6',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            </head>
            <body className={inter.className}>
                <Providers>
                    <main className="min-h-screen bg-background">{children}</main>
                </Providers>
            </body>
        </html>
    )
}
