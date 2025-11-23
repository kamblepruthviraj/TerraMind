import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react"
import { LanguageProvider } from '@/context/LanguageContext'

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    return (
        <SessionProvider session={session}>
            <LanguageProvider>
                <Component {...pageProps} />
            </LanguageProvider>
        </SessionProvider>
    )
}
