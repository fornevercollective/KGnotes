import Head from 'next/head'
import '../style.css'

const CustomApp = ({ Component, pageProps }) => {
    return <>
        <Head>
            <link rel='preconnect' href='https://fonts.gstatic.com' />
            <link href='https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap' rel='stylesheet' />
            <title>Notes</title>
        </Head>

        <Component {...pageProps} />
    </>
}

export default CustomApp