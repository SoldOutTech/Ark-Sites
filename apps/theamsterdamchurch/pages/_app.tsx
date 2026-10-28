import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Analytics } from '@vercel/analytics/next'

import ReactBricksApp from '../components/ReactBricksApp'

import '../css/styles.css'

const MyApp = (props: AppProps) => {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ec4a24" />
      </Head>
      <ThemeProvider
        attribute="class"
        storageKey="color-mode"
        enableSystem={false}
        defaultTheme="light"
      >
        <ReactBricksApp {...props} />
      </ThemeProvider>
      <Analytics />
    </>
  )
}

export default MyApp
