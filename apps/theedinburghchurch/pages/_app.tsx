import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import ReactBricksApp from '../components/ReactBricksApp'

import '../css/styles.css'

const MyApp = (props: AppProps) => {
  return (
    <ThemeProvider
      attribute="class"
      storageKey="color-mode"
      enableSystem={false}
      defaultTheme="light"
    >
      <Head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <ReactBricksApp {...props}></ReactBricksApp>
    </ThemeProvider>
  )
}

export default MyApp
