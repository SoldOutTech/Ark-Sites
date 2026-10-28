import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import ReactBricksApp from '../components/ReactBricksApp'

import '../css/styles.css'

const MyApp = (props: AppProps) => {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/lisbon-logo.jpg" type="image/jpeg" />
      </Head>
      <ThemeProvider
        attribute="class"
        storageKey="color-mode"
        enableSystem={false}
        defaultTheme="light"
      >
        <ReactBricksApp {...props} />
      </ThemeProvider>
    </>
  )
}

export default MyApp
