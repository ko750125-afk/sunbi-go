'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TopAppBar from './components/TopAppBar'
import BottomNavBar from './components/BottomNavBar'
import problemsData from '../src/data/problems.json'
import { Problem } from './types'
import { playClickSound } from './utils/audio'

const problems = problemsData.problems as Problem[]

export default function Home() {
  const router = useRouter()

  const startRandomGame = (difficulty: string) => {
    playClickSound()
    const filtered = problems.filter(p => p.difficulty === difficulty)
    if (filtered.length > 0) {
      const randomProblem = filtered[Math.floor(Math.random() * filtered.length)]
      router.push(`/solve/${randomProblem.id}?mode=shuffle`)
    }
  }

  const [lastSequentialId, setLastSequentialId] = useState<number | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sunbi_stats')
      if (raw) {
        const stats = JSON.parse(raw)
        if (stats.lastSequentialId) {
          setLastSequentialId(stats.lastSequentialId)
        }
      }
    } catch {}
  }, [])

  const startSequentialGame = () => {
    playClickSound()
    const nextId = lastSequentialId ? lastSequentialId + 1 : 1
    // Check if next problem exists, if not start from 1
    const exists = problems.some(p => p.id === nextId)
    router.push(`/solve/${exists ? nextId : 1}?mode=sequence`)
  }

  const resetSequence = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('처음(1번)부터 다시 시작할까요?')) {
      playClickSound()
      setLastSequentialId(null)
      try {
        const raw = localStorage.getItem('sunbi_stats')
        const stats = raw ? JSON.parse(raw) : { records: [] }
        stats.lastSequentialId = null
        localStorage.setItem('sunbi_stats', JSON.stringify(stats))
      } catch {}
    }
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar />
      
      <main className="mt-28 max-w-lg mx-auto px-6 flex flex-col items-center justify-center space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-black text-primary tracking-tighter">선비의 공부방</h1>
          <p className="text-xl text-on-surface-variant font-medium">실전 사활 학습</p>
        </div>

        <div className="w-full flex flex-col gap-6">
          {/* Sequential Mode Button */}
          <button 
            onClick={startSequentialGame}
            className="group relative overflow-hidden h-40 bg-primary text-on-primary rounded-3xl shadow-2xl transition-all active:scale-95 flex flex-col items-center justify-center gap-2 border-4 border-primary/20"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: `'FILL' 1` }}>
                play_circle
              </span>
              <span className="text-4xl font-black">순서대로 학습하기</span>
            </div>
            <div className="flex items-center gap-2 bg-on-primary/10 px-4 py-1 rounded-full">
              <p className="text-lg font-bold">
                {lastSequentialId ? `현재 문제: #${lastSequentialId}` : '1번 문제부터 시작'}
              </p>
              {lastSequentialId && (
                <span 
                  onClick={resetSequence}
                  className="material-symbols-outlined text-xl hover:text-error transition-colors ml-2 cursor-pointer"
                  title="처음부터 다시"
                >
                  restart_alt
                </span>
              )}
            </div>
          </button>

          <div className="h-px bg-outline-variant my-4 opacity-50" />
          <p className="text-center text-on-surface-variant font-bold text-sm">또는 난이도별 랜덤 풀기</p>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => startRandomGame('easy')}
              className="group relative overflow-hidden h-24 bg-surface-container-high rounded-2xl border-2 border-primary/10 shadow-lg transition-all active:scale-95 flex items-center justify-between px-8 hover:bg-primary hover:text-on-primary"
            >
              <div className="flex flex-col items-start">
                <span className="text-3xl font-black">초급 랜덤</span>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-transform">
                sentiment_satisfied
              </span>
            </button>

            <button 
              onClick={() => startRandomGame('medium')}
              className="group relative overflow-hidden h-24 bg-primary-fixed rounded-2xl border-2 border-primary/20 shadow-lg transition-all active:scale-95 flex items-center justify-between px-8 hover:bg-primary hover:text-on-primary"
            >
              <div className="flex flex-col items-start">
                <span className="text-3xl font-black text-primary group-hover:text-on-primary">중급 랜덤</span>
              </div>
              <span className="material-symbols-outlined text-4xl text-primary opacity-40 group-hover:text-on-primary group-hover:opacity-100 group-hover:translate-x-2 transition-transform">
                school
              </span>
            </button>

            <button 
              onClick={() => startRandomGame('hard')}
              className="group relative overflow-hidden h-24 bg-surface-container-high rounded-2xl border-2 border-primary/10 shadow-lg transition-all active:scale-95 flex items-center justify-between px-8 hover:bg-primary hover:text-on-primary"
            >
              <div className="flex flex-col items-start">
                <span className="text-3xl font-black">고급 랜덤</span>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-transform">
                psychology
              </span>
            </button>
          </div>
        </div>
      </main>

      <BottomNavBar />
    </div>
  )
}
