'use client'

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

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar />
      
      <main className="mt-28 max-w-lg mx-auto px-6 flex flex-col items-center justify-center space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-black text-primary tracking-tighter">선비의 공부방</h1>
          <p className="text-xl text-on-surface-variant font-medium">실전 사활 학습</p>
        </div>

        <div className="w-full flex flex-col gap-6">
          <button 
            onClick={() => startRandomGame('easy')}
            className="group relative overflow-hidden h-32 bg-surface-container-high rounded-2xl border-2 border-primary/10 shadow-lg transition-all active:scale-95 flex items-center justify-between px-8 hover:bg-primary hover:text-on-primary"
          >
            <div className="flex flex-col items-start">
              <span className="text-4xl font-black">초급</span>
              <span className="text-sm opacity-60 font-bold group-hover:text-primary-fixed">EASY</span>
            </div>
            <span className="material-symbols-outlined text-5xl opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-transform">
              sentiment_satisfied
            </span>
          </button>

          <button 
            onClick={() => startRandomGame('medium')}
            className="group relative overflow-hidden h-32 bg-primary-fixed rounded-2xl border-2 border-primary/20 shadow-lg transition-all active:scale-95 flex items-center justify-between px-8 hover:bg-primary hover:text-on-primary"
          >
            <div className="flex flex-col items-start">
              <span className="text-4xl font-black text-primary group-hover:text-on-primary">중급</span>
              <span className="text-sm text-primary opacity-60 font-bold group-hover:text-on-primary">MEDIUM</span>
            </div>
            <span className="material-symbols-outlined text-5xl text-primary opacity-40 group-hover:text-on-primary group-hover:opacity-100 group-hover:translate-x-2 transition-transform">
              school
            </span>
          </button>

          <button 
            onClick={() => startRandomGame('hard')}
            className="group relative overflow-hidden h-32 bg-surface-container-high rounded-2xl border-2 border-primary/10 shadow-lg transition-all active:scale-95 flex items-center justify-between px-8 hover:bg-primary hover:text-on-primary"
          >
            <div className="flex flex-col items-start">
              <span className="text-4xl font-black">고급</span>
              <span className="text-sm opacity-60 font-bold group-hover:text-primary-fixed">HARD</span>
            </div>
            <span className="material-symbols-outlined text-5xl opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-transform">
              psychology
            </span>
          </button>
        </div>

        <div className="pt-8 opacity-30 text-center">
          <span className="material-symbols-outlined text-4xl">format_quote</span>
          <p className="text-lg font-serif italic">정수를 찾는 길은 멈추지 않는 공부에 있습니다.</p>
        </div>
      </main>

      <BottomNavBar />
    </div>
  )
}
