import './globals.css'
import { Toaster } from 'sonner'
import { CustomCursor } from '@/components/custom-cursor'

export const metadata = {
  title: 'Thinkovr — The Engine Protocol',
  description: "We don't give you options. We give you the move. One directive, logically derived, ruthlessly accurate.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; font-src * data:; img-src * data: blob:; connect-src * data: blob:; worker-src * blob: data:; frame-src *;"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Courier+Prime:wght@400;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <CustomCursor />
        {children}
        <Toaster theme="dark" position="top-right" toastOptions={{ style: { background: '#0f0f10', border: '1px solid rgba(201,168,76,0.3)', color: '#e8e0d0', fontFamily: 'Courier Prime, monospace', fontSize: '0.7rem', letterSpacing: '0.05em' } }}/>
      </body>
    </html>
  )
}
