import React, { ReactNode } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'

interface LayoutProps {
  children?: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen justify-between font-content antialiased">
      <main className="mb-auto dark:bg-gray-900">{children}</main>

      {/* Vercel */}
      <SpeedInsights />
      <Analytics />

      {/* Google */}
      {/* <GoogleAnalytics gaId="G-CFMC5BQDP6" />
      <GoogleTagManager gtmId="AW-16955040546" /> */}
    </div>
  )
}

export default Layout
