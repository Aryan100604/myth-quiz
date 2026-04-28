import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MythIQ — Test Your Mythology Knowledge',
  description: 'Learn world mythology through quizzes. Greek, Hindu, Norse, Egyptian. Compete with friends.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f0f0f0] flex flex-col items-center justify-start py-6 px-4">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </body>
    </html>
  )
}
