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
  const [showAnswer, setShowAnswer] = useState(false)

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
    setShowAnswer(false)
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
      setShowAnswer(false)
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
        <div className={`relative transition-all duration-300 ${status === 'wrong' ? 'shake' : ''}`}>
          <GoBoard
            key={boardKey}
            problem={problem}
            onSolve={handleSolve}
            onProgress={handleProgress}
            disabled={status !== 'playing'}
            demoMode={showAnswer}
          />
          
          {/* Status Overlays */}
          {status === 'wrong' && !showAnswer && (
            <div className="absolute inset-0 flex items-center justify-center bg-error-container/20 pointer-events-none rounded-xl">
              <div className="bg-error text-on-error px-8 py-4 rounded-full shadow-2xl animate-bounce flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl">close</span>
                <span className="text-3xl font-black">틀렸습니다! 다시 해보세요.</span>
              </div>
            </div>
          )}
        </div>

        {/* Status: Correct UI */}
        {status === 'correct' && (
          <div className="bg-surface-container-high border-4 border-primary rounded-3xl p-8 w-full shadow-2xl space-y-8 animate-in slide-in-from-bottom-4 mt-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-24 h-24 bg-primary rounded-full flex items-center justify-center animate-bounce shadow-lg">
                <span className="material-symbols-outlined text-6xl text-on-primary" style={{ fontVariationSettings: `'FILL' 1` }}>
                  verified
                </span>
              </div>
              <h2 className="text-5xl font-black text-primary leading-tight">축하합니다!<br />정답입니다!</h2>
            </div>

            {/* Explanation */}
            <div className="bg-surface-container rounded-2xl p-6 space-y-3 border border-outline-variant">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: `'FILL' 1` }}>
                  lightbulb
                </span>
                <h3 className="text-2xl font-black text-primary">공부 한 마디</h3>
              </div>
              <p className="text-2xl text-on-surface leading-relaxed">{problem.explanation}</p>
            </div>

            {/* Navigation buttons */}
            <div className="flex flex-col gap-4">
              {mode === 'shuffle' ? (
                <button 
                  onClick={handleNextShuffle}
                  className="h-24 bg-primary text-on-primary text-3xl font-black rounded-2xl shadow-xl hover:bg-primary-container transition-all flex items-center justify-center gap-4 active:scale-95"
                >
                  다음 문제 풀기
                  <span className="material-symbols-outlined text-4xl">shuffle</span>
                </button>
              ) : nextProblem ? (
                <Link href={`/solve/${nextProblem.id}`} className="w-full">
                  <button 
                    onClick={() => playClickSound()}
                    className="w-full h-24 bg-primary text-on-primary text-3xl font-black rounded-2xl shadow-xl hover:bg-primary-container transition-all flex items-center justify-center gap-4 active:scale-95"
                  >
                    다음 문제
                    <span className="material-symbols-outlined text-4xl">arrow_forward</span>
                  </button>
                </Link>
              ) : null}
              
              <div className="flex gap-4">
                <button
                  onClick={handleRetry}
                  className="flex-1 h-20 bg-surface-container text-primary text-xl font-bold rounded-2xl border-2 border-outline-variant hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-2xl">refresh</span>
                  다시 풀어보기
                </button>
                <button 
                  onClick={() => { playClickSound(); router.push('/'); }}
                  className="flex-1 h-20 bg-surface-container text-on-surface-variant text-xl font-bold rounded-2xl border-2 border-outline-variant hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-2xl">home</span>
                  홈으로 이동
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Remaining UI for wrong state */}
        {status === 'wrong' && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <button
                onClick={handleRetry}
                className="flex-1 h-20 bg-primary text-on-primary text-2xl font-black rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-3xl">refresh</span>
                다시 도전
              </button>
              <button
                onClick={() => setShowAnswer(true)}
                className="flex-1 h-20 bg-surface-container-highest text-primary text-2xl font-black rounded-xl shadow-lg border-2 border-primary/20 hover:bg-surface-container transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-3xl">visibility</span>
                정답 보기
              </button>
            </div>
            
            {showAnswer && (
              <div className="bg-surface-container rounded-2xl p-6 space-y-3 border border-outline-variant animate-in slide-in-from-top-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: `'FILL' 1` }}>
                    lightbulb
                  </span>
                  <h3 className="text-2xl font-black text-primary">정답 도우미</h3>
                </div>
                <p className="text-2xl text-on-surface leading-relaxed">{problem.explanation}</p>

              </div>
            )}
          </div>
        )}

      </main>
      <BottomNavBar />
    </div>
  )
}
