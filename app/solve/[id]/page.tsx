'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import TopAppBar from '../../components/TopAppBar'
import BottomNavBar from '../../components/BottomNavBar'
import GoBoard from '../../components/GoBoard'
import problemsData from '@/src/data/problems.json'
import { Problem, GameStats } from '../../types'

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

type GameStatus = 'playing' | 'correct' | 'wrong'

export default function SolvePage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const problem = problems.find(p => p.id === id)

  const [status, setStatus] = useState<GameStatus>('playing')
  const [boardKey, setBoardKey] = useState(0) // force re-mount for reset
  const [attempts, setAttempts] = useState(0)

  const handleSolve = useCallback((isCorrect: boolean, moves: string[]) => {
    if (isCorrect) {
      setStatus('correct')
      // Save record to localStorage
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
      // Save wrong attempt
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

  const handleRetry = () => {
    setStatus('playing')
    setBoardKey(prev => prev + 1)
  }

  const nextProblem = problems.find(p => p.id === id + 1)
  const prevProblem = problems.find(p => p.id === id - 1)

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <p className="text-4xl text-primary font-black">문제를 찾을 수 없습니다</p>
          <Link href="/problems">
            <button className="bg-primary text-on-primary px-10 py-6 rounded-xl text-3xl font-bold">목록으로</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32 md:pb-8">
      <TopAppBar />
      <main className="mt-24 max-w-2xl mx-auto px-4 py-6 space-y-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary font-bold text-xl hover:bg-surface-container px-4 py-2 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">arrow_back</span>
            돌아가기
          </button>
        </div>

        {/* Problem info */}
        <div className="bg-surface-container rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`px-4 py-1 rounded-full text-xl font-bold ${difficultyColor[problem.difficulty]}`}>
              {difficultyLabel[problem.difficulty]}
            </span>
            <span className="text-xl text-on-surface-variant">문제 #{problem.id}</span>
          </div>
          <h1 className="text-4xl font-black text-primary">{problem.title}</h1>
          <p className="text-2xl text-on-surface-variant">바둑판 위를 터치하여 최선의 한 수를 두세요.</p>
        </div>

        {/* Board */}
        <div className={`transition-all duration-300 ${status === 'wrong' ? 'shake' : ''}`}>
          <GoBoard
            key={boardKey}
            problem={problem}
            onSolve={handleSolve}
            disabled={status !== 'playing'}
          />
        </div>

        {/* Status: Correct */}
        {status === 'correct' && (
          <div className="bg-surface-container-high border-4 border-primary rounded-xl p-8 space-y-6 correct-pulse">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-on-primary">check</span>
              </div>
              <div>
                <p className="text-4xl font-black text-primary">정답입니다!</p>
                <p className="text-xl text-on-surface-variant">훌륭한 수읽기입니다.</p>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-surface-container rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">lightbulb</span>
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
              {nextProblem ? (
                <Link href={`/solve/${nextProblem.id}`} className="flex-1">
                  <button className="w-full h-20 bg-primary text-on-primary text-2xl font-black rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-3">
                    다음 문제
                    <span className="material-symbols-outlined text-3xl">arrow_forward</span>
                  </button>
                </Link>
              ) : (
                <Link href="/problems" className="flex-1">
                  <button className="w-full h-20 bg-primary text-on-primary text-2xl font-black rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-3">
                    목록으로
                    <span className="material-symbols-outlined text-3xl">list</span>
                  </button>
                </Link>
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

            {/* Hint */}
            <div className="bg-surface-container rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">tips_and_updates</span>
                <h3 className="text-2xl font-black text-primary">설명 보기</h3>
              </div>
              <p className="text-2xl text-on-surface leading-relaxed">{problem.explanation}</p>
            </div>

            <button
              onClick={handleRetry}
              className="w-full h-24 bg-primary text-on-primary text-3xl font-black rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-4 active:scale-95"
            >
              <span className="material-symbols-outlined text-4xl">refresh</span>
              재도전
            </button>
          </div>
        )}

        {/* Problem navigation */}
        <div className="flex justify-between items-center pt-4 border-t-2 border-outline-variant">
          {prevProblem ? (
            <Link href={`/solve/${prevProblem.id}`}>
              <button className="flex items-center gap-2 text-primary font-bold text-xl hover:bg-surface-container px-6 py-4 rounded-xl transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
                이전
              </button>
            </Link>
          ) : <span />}
          <Link href="/problems">
            <button className="text-on-surface-variant font-bold text-xl hover:bg-surface-container px-6 py-4 rounded-xl transition-colors">
              목록
            </button>
          </Link>
          {nextProblem ? (
            <Link href={`/solve/${nextProblem.id}`}>
              <button className="flex items-center gap-2 text-primary font-bold text-xl hover:bg-surface-container px-6 py-4 rounded-xl transition-colors">
                다음
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </Link>
          ) : <span />}
        </div>

      </main>
      <BottomNavBar />
    </div>
  )
}
