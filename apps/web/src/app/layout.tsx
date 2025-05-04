import { ThemeProvider, Toaster } from '@project/ui-components/client'
import { cn } from '@project/ui-components/utils'
import { Inter as FontSans } from 'next/font/google'
import localFont from 'next/font/local'
import './global.css'
import { siteConfig } from './webConfig'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: '../../public/fonts/CalSans-SemiBold.woff2',
  variable: '--font-heading',
})

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['Ai', 'Automation', 'Tasks', 'Tasks Automation', 'No Code', 'Low-Code'],
  authors: [
    {
      name: 'Antoni Kois',
      url: 'https://github.com/anteqkois',
    },
  ],
  creator: 'anteqkois',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn('min-h-screen-no-nav bg-background font-sans antialiased', fontSans.variable, fontHeading.variable)}
        suppressHydrationWarning={true}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
            {/* <Toaster duration={5_000} viewportClassName='sm:top-0 sm:left-1/2 -translate-x-1/2'/> */}
            <Toaster duration={5_000} />
            {/* <CookiesModal /> */}
        </ThemeProvider>
      </body>
    </html>
  )
}
