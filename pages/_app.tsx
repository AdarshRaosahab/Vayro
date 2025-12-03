import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-navy-900 focus:shadow-lg focus:rounded-md focus:font-bold"
      >
        Skip to content
      </a>
      <Component {...pageProps} />
    </>
  )
}
