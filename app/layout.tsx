import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '선비의 공부방 | 바둑 사활 학습',
  description: '전통적인 바둑 사활 문제를 풀며 실력을 쌓아가는 학습 앱입니다. 초급부터 고급까지 다양한 문제를 제공합니다.',
  keywords: '바둑, 사활, 바둑 문제, 바둑 공부, 선비의 공부방',
  openGraph: {
    title: '선비의 공부방 | 바둑 사활 학습',
    description: '전통적인 바둑 사활 문제를 풀며 실력을 쌓아가는 학습 앱',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&family=Public+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-serif bg-background text-on-surface antialiased">
        {children}
      </body>
    </html>
  )
}
