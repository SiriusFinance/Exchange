import Head from 'next/head'
import '../styles/global.scss'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
