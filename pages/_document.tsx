import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
                {process.env.ADSENSE_CLIENT_ID && (
                    <script
                        async
                        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.ADSENSE_CLIENT_ID}`}
                        crossOrigin="anonymous"
                    />
                )}
            </Head>
            <body className="bg-ivory text-deepNavy font-sans">
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
