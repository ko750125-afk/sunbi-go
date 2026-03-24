'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import TopAppBar from '../components/TopAppBar'
import BottomNavBar from '../components/BottomNavBar'
import problemsData from '../../src/data/problems.json'
import { Problem } from '../types'

const problems = problemsData.problems as Problem[]

const difficultyLabel: Record<string, string> = {
  easy: '초급',
  medium: '중급',
  hard: '고급',
}

const difficultyBadge: Record<string, string> = {
  easy: 'bg-surface-container-highest text-primary',
  medium: 'bg-primary-fixed text-on-primary-fixed',
  hard: 'bg-tertiary-container text-on-tertiary-container',
}

function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <div className="group relative bg-surface-container rounded-xl overflow-hidden border-2 border-outline-variant transition-all duration-300 hover:shadow-2xl">
      {/* Board preview */}
      <div className="aspect-square relative p-4 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #d4a55a, #b5813c)' }}>
        {/* Mini go board */}
        <div
          className="grid gap-0 relative"
          style={{
            gridTemplateColumns: `repeat(${problem.boardSize}, 1fr)`,
            width: '100%',
            height: '100%',
          }}
        >
          {Array.from({ length: problem.boardSize * problem.boardSize }).map((_, i) => {
            const row = Math.floor(i / problem.boardSize)
            const col = i % problem.boardSize
            const stone = problem.stones.find(s =>
              s.x === col + 1 && s.y === row + 1
            )
            const cellSize = problem.boardSize <= 5 ? 'w-12 h-12' : 'w-7 h-7'
            const stoneSize = problem.boardSize <= 5 ? 'w-9 h-9' : 'w-5 h-5'

            return (
              <div key={i} className={`${cellSize} flex items-center justify-center relative`}>
                {row > 0 && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1.5px] h-1/2 bg-[#5a3a1a]/50" />}
                {row < problem.boardSize - 1 && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[1.5px] h-1/2 bg-[#5a3a1a]/50" />}
                {col > 0 && <div className="absolute top-1/2 left-0 -translate-y-1/2 h-[1.5px] w-1/2 bg-[#5a3a1a]/50" />}
                {col < problem.boardSize - 1 && <div className="absolute top-1/2 left-1/2 -translate-y-1/2 h-[1.5px] w-1/2 bg-[#5a3a1a]/50" />}
                {stone && (
                  <div className={`${stoneSize} rounded-full z-10 ${
                    stone.color === 'black' ? 'go-stone-black' : 'go-stone-white'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
        {/* Difficulty badge */}
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-base font-bold ${difficultyBadge[problem.difficulty]}`}>
          {difficultyLabel[problem.difficulty]}
        </span>
      </div>

      <div className="p-10">
        <h4 className="text-3xl font-black mb-6 text-primary">{problem.title}</h4>
        <p className="text-lg text-on-surface-variant mb-6 line-clamp-2">{problem.explanation}</p>
        <Link href={`/solve/${problem.id}`}>
          <button className="w-full h-24 bg-primary text-on-primary text-3xl font-black rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-4 active:scale-95">
            시작하기
            <span className="material-symbols-outlined text-4xl">play_arrow</span>
          </button>
        </Link>
      </div>
    </div>
  )
}

function ProblemsContent() {
  const searchParams = useSearchParams()
  const filterDifficulty = searchParams.get('difficulty')

  const easyProblems = problems.filter(p => p.difficulty === 'easy')
  const mediumProblems = problems.filter(p => p.difficulty === 'medium')
  const hardProblems = problems.filter(p => p.difficulty === 'hard')

  const shouldShowSection = (diff: string) =>
    !filterDifficulty || filterDifficulty === diff

  return (
    <main className="mt-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="py-8">
        <h2 className="text-6xl font-black text-primary tracking-tight mb-2">문제 목록</h2>
        <p className="text-2xl text-on-surface-variant font-medium">오늘의 명국을 검토하고 실력을 쌓으세요.</p>
      </div>

      {/* Difficulty filter */}
      <div className="flex gap-4 mb-12 flex-wrap">
        {[
          { key: null, label: '전체' },
          { key: 'easy', label: '초급' },
          { key: 'medium', label: '중급' },
          { key: 'hard', label: '고급' },
        ].map(({ key, label }) => (
          <Link key={label} href={key ? `/problems?difficulty=${key}` : '/problems'}>
            <button className={`px-8 py-4 rounded-full text-2xl font-bold transition-all ${
              filterDifficulty === key
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-primary hover:bg-surface-container-high'
            }`}>
              {label}
            </button>
          </Link>
        ))}
      </div>

      {/* 초급 */}
      {shouldShowSection('easy') && easyProblems.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-2 h-12 bg-tertiary" />
            <h3 className="text-4xl font-black text-primary">초급</h3>
            <span className="bg-surface-container-highest px-6 py-2 rounded-full text-xl font-bold text-primary">수련생</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {easyProblems.map(p => <ProblemCard key={p.id} problem={p} />)}
          </div>
        </section>
      )}

      {/* 중급 */}
      {shouldShowSection('medium') && mediumProblems.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-2 h-12 bg-primary" />
            <h3 className="text-4xl font-black text-primary">중급</h3>
            <span className="bg-primary-fixed px-6 py-2 rounded-full text-xl font-bold text-on-primary-fixed">입단자</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Featured first medium card */}
            {mediumProblems[0] && (
              <div className="md:col-span-2 group flex flex-col md:flex-row bg-surface-container rounded-xl overflow-hidden border-4 border-primary transition-all duration-300 hover:shadow-2xl">
                <div className="md:w-1/2 aspect-video md:aspect-auto relative min-h-48 p-4 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #d4a55a, #b5813c)' }}>
                  {/* Mini board */}
                  <div className="grid gap-0 relative w-48 h-48">
                    {Array.from({ length: mediumProblems[0].boardSize * mediumProblems[0].boardSize }).map((_, i) => {
                      const row = Math.floor(i / mediumProblems[0].boardSize)
                      const col = i % mediumProblems[0].boardSize
                      const stone = mediumProblems[0].stones.find(s => s.x === col + 1 && s.y === row + 1)
                      return (
                        <div key={i} className="flex items-center justify-center relative"
                          style={{ width: `${192 / mediumProblems[0].boardSize}px`, height: `${192 / mediumProblems[0].boardSize}px` }}>
                          {stone && <div className={`w-5 h-5 rounded-full z-10 ${stone.color === 'black' ? 'go-stone-black' : 'go-stone-white'}`} />}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="md:w-1/2 p-12 flex flex-col justify-center">
                  <h4 className="text-5xl font-black mb-8 text-primary leading-tight">{mediumProblems[0].title}</h4>
                  <Link href={`/solve/${mediumProblems[0].id}`}>
                    <button className="h-28 bg-primary text-on-primary text-4xl font-black rounded-xl shadow-xl hover:bg-primary-container transition-all flex items-center justify-center gap-6 w-full active:scale-95">
                      도전하기
                      <span className="material-symbols-outlined text-5xl">bolt</span>
                    </button>
                  </Link>
                </div>
              </div>
            )}
            {mediumProblems.slice(1).map(p => <ProblemCard key={p.id} problem={p} />)}
          </div>
        </section>
      )}

      {/* 고급 */}
      {shouldShowSection('hard') && hardProblems.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-2 h-12 bg-tertiary-container" />
            <h3 className="text-4xl font-black text-primary">고급</h3>
            <span className="bg-tertiary text-on-tertiary px-6 py-2 rounded-full text-xl font-bold">유단자</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {hardProblems.map(p => <ProblemCard key={p.id} problem={p} />)}
          </div>
        </section>
      )}
    </main>
  )
}

export default function ProblemsPage() {
  return (
    <div className="min-h-screen pb-32 md:pb-8">
      <TopAppBar />
      <Suspense fallback={<div className="mt-24 text-center text-3xl text-primary p-12">문제를 불러오는 중...</div>}>
        <ProblemsContent />
      </Suspense>
      <BottomNavBar />
    </div>
  )
}
