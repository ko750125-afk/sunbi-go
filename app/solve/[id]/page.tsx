'use client'

import { useState, useCallback, useMemo } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import TopAppBar from '../../components/TopAppBar'
import BottomNavBar from '../../components/BottomNavBar'
import GoBoard from '../../components/GoBoard'
import problemsData from '@/src/data/problems.json'
import { Problem, GameStats } from '../../types'
import { playClickSound, playSuccessSound } from '../../utils/audio'

const problems = problemsData.problems as Problem[]

const difficultyLabel: Record<string, string> = {
  easy: '초급',
  medium: '중급',
  hard: '고급',
}
const difficultyColor: Record<string, string> = {
  easy: 'bg-surface-container-highest text-primary',
  medium: 'bg-primary-fixed text-on-primary-fixed',
  hard: 'bg-tertiary text-on-tertiary',
}

const progressMessages = [
  '좋습니다! 계속 진행하세요.',
  '훌륭한 수입니다. 다음 수를 두세요.',
  '탁월한 선택! 계속하세요.',
  '정확합니다. 마무리하세요!',
  '거의 다 왔습니다!',
]

type GameStatus = 'playing' | 'correct' | 'wrong'

export default function SolvePage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  
  const id = Number(params.id)
  const problem = problems.find(p => p.id === id)

  const [status, setStatus] = useState<GameStatus>('playing')
  const [boardKey, setBoardKey] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [progressMsg, setProgressMsg] = useState('')
  const [showProgress, setShowProgress] = useState(false)

  const handleSolve = useCallback((isCorrect: boolean) => {
    setShowProgress(false)
    if (isCorrect) {
      playSuccessSound()
      setStatus('correct')
      try {
        const raw = localStorage.getItem('sunbi_stats')
        const stats: GameStats = raw ? JSON.parse(raw) : { records: [] }
        const existing = stats.records.find(r => r.problemId === id)
        if (existing) {
          existing.solved = true
          existing.attempts += 1
          existing.solvedAt = new Date().toISOString()
        } else {
          stats.records.push({
            problemId: id,
            solved: true,
            attempts: attempts + 1,
            solvedAt: new Date().toISOString(),
          })
        }
        localStorage.setItem('sunbi_stats', JSON.stringify(stats))
      } catch {}
    } else {
      setStatus('wrong')
      setAttempts(prev => prev + 1)
      try {
        const raw = localStorage.getItem('sunbi_stats')
        const stats: GameStats = raw ? JSON.parse(raw) : { records: [] }
        const existing = stats.records.find(r => r.problemId === id)
        if (existing) {
          existing.attempts += 1
        } else {
          stats.records.push({ problemId: id, solved: false, attempts: attempts + 1 })
        }
        localStorage.setItem('sunbi_stats', JSON.stringify(stats))
      } catch {}
    }
  }, [id, attempts])

  const handleProgress = useCallback((moveIndex: number, total: number) => {
    if (moveIndex > 0 && moveIndex < total && moveIndex % 2 === 1) {
      const msgIdx = Math.min(Math.floor((moveIndex - 1) / 2), progressMessages.length - 1)
      setProgressMsg(progressMessages[msgIdx])
      setShowProgress(true)
      setTimeout(() => setShowProgress(false), 1500)
    }
  }, [])

  const handleRetry = () => {
    playClickSound()
    setStatus('playing')
    setShowProgress(false)
    setProgressMsg('')
    setBoardKey(prev => prev + 1)
  }

  const handleNextShuffle = () => {
    playClickSound()
    if (!problem) return
    const filtered = problems.filter(p => p.difficulty === problem.difficulty && p.id !== id)
    if (filtered.length > 0) {
      const next = filtered[Math.floor(Math.random() * filtered.length)]
      router.push(`/solve/${next.id}?mode=shuffle`)
      // Reset state for the new problem
      setStatus('playing')
      setBoardKey(prev => prev + 1)
      setAttempts(0)
    } else {
      router.push('/')
    }
  }

  const nextProblem = problems.find(p => p.id === id + 1)

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <p className="text-4xl text-primary font-black">문제를 찾을 수 없습니다</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-primary text-on-primary px-10 py-6 rounded-xl text-3xl font-bold"
          >
            홈으로
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32 md:pb-8">
      <TopAppBar />
      <main className="mt-24 max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => { playClickSound(); router.push('/'); }}
            className="flex items-center gap-2 text-primary font-bold text-xl hover:bg-surface-container px-4 py-2 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">home</span>
            홈으로
          </button>
        </div>

        {/* Problem info */}
        <div className="bg-surface-container rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`px-4 py-1 rounded-full text-xl font-bold ${difficultyColor[problem.difficulty]}`}>
              {difficultyLabel[problem.difficulty]}
            </span>
            <span className="text-xl text-on-surface-variant">문제 #{problem.id}</span>
            <span className="text-xl text-on-surface-variant">·</span>
            <span className="text-xl text-on-surface-variant">{problem.solution.length}수 완성</span>
          </div>
          <h1 className="text-4xl font-black text-primary">{problem.title}</h1>
          <p className="text-2xl text-on-surface-variant">
            {status === 'playing' ? '바둑판 위를 터치하여 최선의 수를 두세요.' : ''}
          </p>
        </div>

        {/* Progress message banner */}
        <div
          className={`transition-all duration-300 overflow-hidden ${showProgress ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="bg-primary-fixed border-2 border-primary rounded-xl px-6 py-4 flex items-center gap-4">
            <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: `'FILL' 1` }}>
              check_circle
            </span>
            <p className="text-2xl font-black text-primary">{progressMsg}</p>
          </div>
        </div>

        {/* Board — shake wrapper for wrong answer */}
        <div className={status === 'wrong' ? 'shake' : ''}>
          <GoBoard
            key={boardKey}
            problem={problem}
            onSolve={handleSolve}
            onProgress={handleProgress}
            disabled={status !== 'playing'}
          />
        </div>

        {/* Status: Correct */}
        {status === 'correct' && (
          <div className="bg-surface-container-high border-4 border-primary rounded-xl p-8 space-y-6 correct-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center animate-bounce">
                <span className="material-symbols-outlined text-5xl text-on-primary" style={{ fontVariationSettings: `'FILL' 1` }}>
                  check_circle
                </span>
              </div>
              <div>
                <p className="text-4xl font-black text-primary">🎉 정답입니다!</p>
                <p className="text-xl text-on-surface-variant">수순을 완벽하게 완성했습니다.</p>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-surface-container rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: `'FILL' 1` }}>
                  lightbulb
                </span>
                <h3 className="text-2xl font-black text-primary">풀이 설명</h3>
              </div>
              <p className="text-2xl text-on-surface leading-relaxed">{problem.explanation}</p>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleRetry}
                className="flex-1 h-20 bg-surface-container text-primary text-2xl font-black rounded-xl border-2 border-outline-variant hover:bg-surface-container-high transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined text-3xl">refresh</span>
                다시 풀기
              </button>
              
              {mode === 'shuffle' ? (
                <button 
                  onClick={handleNextShuffle}
                  className="flex-3 h-20 bg-primary text-on-primary text-2xl font-black rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-3"
                >
                  다음 랜덤 문제
                  <span className="material-symbols-outlined text-3xl">shuffle</span>
                </button>
              ) : nextProblem ? (
                <Link href={`/solve/${nextProblem.id}`} className="flex-3">
                  <button 
                    onClick={() => playClickSound()}
                    className="w-full h-20 bg-primary text-on-primary text-2xl font-black rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-3"
                  >
                    다음 문제
                    <span className="material-symbols-outlined text-3xl">arrow_forward</span>
                  </button>
                </Link>
              ) : (
                <button 
                  onClick={() => { playClickSound(); router.push('/'); }}
                  className="flex-3 h-20 bg-primary text-on-primary text-2xl font-black rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-3"
                >
                  다른 난이도 도전
                  <span className="material-symbols-outlined text-3xl">home</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Status: Wrong */}
        {status === 'wrong' && (
          <div className="bg-error-container border-4 border-error rounded-xl p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-error rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-on-error">close</span>
              </div>
              <div>
                <p className="text-4xl font-black text-error">틀렸습니다</p>
                <p className="text-xl text-on-surface-variant">다시 한번 생각해보세요.</p>
              </div>
            </div>

            {/* Explanation hint */}
            <div className="bg-surface-container rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">tips_and_updates</span>
                <h3 className="text-2xl font-black text-primary">힌트</h3>
              </div>
              <p className="text-2xl text-on-surface leading-relaxed">{problem.explanation}</p>
            </div>

            <button
              onClick={handleRetry}
              className="w-full h-24 bg-primary text-on-primary text-3xl font-black rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-4 active:scale-95 animate-pulse"
            >
              <span className="material-symbols-outlined text-4xl">refresh</span>
              재도전!
            </button>
          </div>
        )}

      </main>
      <BottomNavBar />
    </div>
  )
}
