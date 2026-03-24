'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import TopAppBar from '../components/TopAppBar'
import BottomNavBar from '../components/BottomNavBar'
import problemsData from '@/src/data/problems.json'
import { Problem, GameStats } from '../types'

const problems = problemsData.problems as Problem[]

export default function RecordsPage() {
  const [stats, setStats] = useState<GameStats>({ records: [] })

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sunbi_stats')
      if (raw) setStats(JSON.parse(raw))
    } catch {}
  }, [])

  const solvedProblems = stats.records.filter(r => r.solved)
  const totalAttempts = stats.records.reduce((sum, r) => sum + r.attempts, 0)
  const accuracy = totalAttempts > 0
    ? Math.round((solvedProblems.length / totalAttempts) * 100)
    : 0

  const easyStats = {
    total: problems.filter(p => p.difficulty === 'easy').length,
    solved: solvedProblems.filter(r => {
      const p = problems.find(pr => pr.id === r.problemId)
      return p?.difficulty === 'easy'
    }).length
  }
  const mediumStats = {
    total: problems.filter(p => p.difficulty === 'medium').length,
    solved: solvedProblems.filter(r => {
      const p = problems.find(pr => pr.id === r.problemId)
      return p?.difficulty === 'medium'
    }).length
  }
  const hardStats = {
    total: problems.filter(p => p.difficulty === 'hard').length,
    solved: solvedProblems.filter(r => {
      const p = problems.find(pr => pr.id === r.problemId)
      return p?.difficulty === 'hard'
    }).length
  }

  const handleReset = () => {
    if (confirm('기록을 모두 초기화하시겠습니까?')) {
      localStorage.removeItem('sunbi_stats')
      setStats({ records: [] })
    }
  }

  return (
    <div className="min-h-screen pb-32 md:pb-8">
      <TopAppBar />
      <main className="mt-24 max-w-2xl mx-auto px-6 py-8 space-y-10">
        <div>
          <h2 className="text-6xl font-black text-primary tracking-tight mb-2">나의 기록</h2>
          <p className="text-2xl text-on-surface-variant">착실히 쌓아온 수련의 흔적입니다.</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-surface-container rounded-xl p-6 text-center">
            <p className="text-5xl font-black text-primary">{solvedProblems.length}</p>
            <p className="text-xl text-on-surface-variant mt-2">풀이 완료</p>
          </div>
          <div className="bg-surface-container rounded-xl p-6 text-center">
            <p className="text-5xl font-black text-primary">{totalAttempts}</p>
            <p className="text-xl text-on-surface-variant mt-2">총 시도</p>
          </div>
          <div className="bg-surface-container rounded-xl p-6 text-center">
            <p className="text-5xl font-black text-primary">{accuracy}%</p>
            <p className="text-xl text-on-surface-variant mt-2">정답률</p>
          </div>
        </div>

        {/* Progress by difficulty */}
        <div className="space-y-6">
          <h3 className="text-4xl font-black text-primary">난이도별 진행도</h3>

          {[
            { label: '초급', color: 'bg-tertiary', stats: easyStats },
            { label: '중급', color: 'bg-primary', stats: mediumStats },
            { label: '고급', color: 'bg-tertiary-container', stats: hardStats },
          ].map(({ label, color, stats: s }) => (
            <div key={label} className="bg-surface-container rounded-xl p-8 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-3xl font-black text-primary">{label}</span>
                <span className="text-2xl text-on-surface-variant">{s.solved} / {s.total}</span>
              </div>
              <div className="w-full bg-outline-variant rounded-full h-4">
                <div
                  className={`${color} h-4 rounded-full transition-all duration-500`}
                  style={{ width: s.total > 0 ? `${(s.solved / s.total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Recent solved problems */}
        {solvedProblems.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-4xl font-black text-primary">최근 풀이 문제</h3>
            <div className="space-y-4">
              {[...stats.records]
                .filter(r => r.solved && r.solvedAt)
                .sort((a, b) => new Date(b.solvedAt!).getTime() - new Date(a.solvedAt!).getTime())
                .slice(0, 10)
                .map(record => {
                  const problem = problems.find(p => p.id === record.problemId)
                  if (!problem) return null
                  return (
                    <Link key={record.problemId} href={`/solve/${problem.id}`}>
                      <div className="bg-surface-container-high rounded-xl p-6 flex items-center justify-between hover:bg-surface-container transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl text-on-primary">check</span>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-primary">{problem.title}</p>
                            <p className="text-lg text-on-surface-variant">{record.solvedAt ? new Date(record.solvedAt).toLocaleDateString('ko-KR') : ''}</p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-3xl text-on-surface-variant">chevron_right</span>
                      </div>
                    </Link>
                  )
                })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {stats.records.length === 0 && (
          <div className="text-center py-20 space-y-6">
            <span className="material-symbols-outlined text-8xl text-primary-fixed-dim">history</span>
            <p className="text-4xl font-black text-primary">아직 기록이 없습니다</p>
            <p className="text-2xl text-on-surface-variant">문제를 풀기 시작하면 기록이 쌓입니다.</p>
            <Link href="/problems">
              <button className="bg-primary text-on-primary px-12 py-6 rounded-xl text-3xl font-bold hover:bg-primary-container transition-colors">
                문제 풀러 가기
              </button>
            </Link>
          </div>
        )}

        {/* Reset button */}
        {stats.records.length > 0 && (
          <div className="pt-8 border-t-2 border-outline-variant">
            <button
              onClick={handleReset}
              className="w-full h-16 text-error border-2 border-error rounded-xl text-2xl font-bold hover:bg-error-container transition-colors"
            >
              기록 초기화
            </button>
          </div>
        )}
      </main>
      <BottomNavBar />
    </div>
  )
}
