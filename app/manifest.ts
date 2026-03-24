import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '선비의 공부방 | 바둑 사활 학습',
    short_name: '선비의 공부방',
    description: '전통적인 바둑 사활 문제를 풀며 실력을 쌓아가는 학습 앱',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfbe2',
    theme_color: '#fbfbe2',
    icons: [
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
