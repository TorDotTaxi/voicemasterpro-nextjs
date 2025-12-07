import type { Metadata } from 'next'
import { Questrial } from 'next/font/google'
import { Source_Code_Pro } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { SpeedInsights } from '@vercel/speed-insights/next'

const questrial = Questrial({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-questrial',
})

const sourceCodePro = Source_Code_Pro({ 
  subsets: ['latin'],
  variable: '--font-source-code-pro',
})

export const metadata: Metadata = {
  title: 'VoiceMaster Pro - Audio Transcription & Voice Analysis',
  description: 'Professional audio recording and transcription with AI-powered speaker diarization',
  keywords: 'audio, transcription, voice, recording, Vietnamese, AI, diarization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${questrial.variable} ${sourceCodePro.variable}`}>
      <body className="font-sans antialiased bg-gray-50 dark:bg-gray-900">
        {children}
        <Toaster position="top-right" />
        <SpeedInsights />
      </body>
    </html>
  )
}

