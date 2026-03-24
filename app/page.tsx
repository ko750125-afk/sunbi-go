'use client'

import Link from 'next/link'
import TopAppBar from './components/TopAppBar'
import BottomNavBar from './components/BottomNavBar'
import problemsData from '../src/data/problems.json'
import { Problem } from './types'

const problems = problemsData.problems as Problem[]

export default function Home() {
  const todayProblem = problems[new Date().getDate() % problems.length]

  const difficultyStats = {
    easy: problems.filter(p => p.difficulty === 'easy').length,
    medium: problems.filter(p => p.difficulty === 'medium').length,
    hard: problems.filter(p => p.difficulty === 'hard').length,
  }

  return (
    <div className="min-h-screen pb-32 md:pb-8">
      <TopAppBar />
      <main className="mt-24 max-w-4xl mx-auto px-6 py-8 space-y-12">

        {/* Hero: 오늘의 사활 문제 */}
        <section className="bg-surface-container p-8 rounded-xl shadow-sm space-y-8">
          <div className="space-y-4">
            <span className="inline-block px-4 py-1 bg-tertiary text-on-tertiary font-bold rounded-full text-lg">오늘의 추천</span>
            <h2 className="text-5xl font-black text-primary leading-tight">오늘의 사활 문제</h2>
            <p className="text-2xl text-on-surface-variant leading-relaxed">
              신중하게 한 수를 두는 마음으로,<br />오늘의 묘수를 찾아보시겠습니까?
            </p>
          </div>
          <div className="flex flex-col gap-8">
            {/* Mini board preview */}
            <div className="w-full max-w-xs mx-auto aspect-square bg-secondary-container rounded-lg shadow-inner p-4 relative border-2 border-primary-container/20"
              style={{ background: 'linear-gradient(135deg, #d4a55a, #b5813c)' }}>
              <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 p-4 gap-0">
                {Array.from({ length: 25 }).map((_, i) => {
                  const row = Math.floor(i / 5)
                  const col = i % 5
                  const stone = todayProblem.stones.find(s =>
                    s.x === col + 1 && s.y === row + 1
                  )
                  return (
                    <div key={i} className="flex items-center justify-center relative">
                      {row > 0 && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1.5px] h-1/2 bg-[#5a3a1a]/50" />}
                      {row < 4 && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[1.5px] h-1/2 bg-[#5a3a1a]/50" />}
                      {col > 0 && <div className="absolute top-1/2 left-0 -translate-y-1/2 h-[1.5px] w-1/2 bg-[#5a3a1a]/50" />}
                      {col < 4 && <div className="absolute top-1/2 left-1/2 -translate-y-1/2 h-[1.5px] w-1/2 bg-[#5a3a1a]/50" />}
                      {stone && (
                        <div className={`w-8 h-8 rounded-full z-10 ${
                          stone.color === 'black' ? 'go-stone-black' : 'go-stone-white'
                        }`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            <Link href={`/solve/${todayProblem.id}`}>
              <button className="w-full h-24 bg-primary text-on-primary text-3xl font-bold rounded-lg shadow-xl flex items-center justify-center gap-4 hover:opacity-90 transition-all active:scale-95">
                <span className="material-symbols-outlined text-4xl">play_circle</span>
                문제 풀기 시작
              </button>
            </Link>
          </div>
        </section>

        {/* Categories: 난이도별 문제 */}
        <section className="space-y-6">
          <h3 className="text-4xl font-black text-primary border-l-8 border-primary pl-4">난이도별 사활</h3>
          <div className="grid grid-cols-1 gap-6">
            <Link href="/problems?difficulty=easy">
              <div className="group bg-surface-container-high p-8 rounded-xl transition-all hover:bg-primary hover:text-on-primary cursor-pointer border-2 border-transparent hover:border-primary">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-5xl text-primary group-hover:text-primary-fixed">sentiment_satisfied</span>
                    <h4 className="text-3xl font-bold">쉬운 문제</h4>
                  </div>
                  <span className="text-xl font-bold opacity-60">{difficultyStats.easy} 문제</span>
                </div>
                <p className="text-2xl opacity-80 mb-6">기초를 탄탄히 다지는 입문 단계의 사활입니다.</p>
                <div className="flex items-center gap-2 font-bold group-hover:text-primary-fixed text-xl">
                  시작하기 <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </Link>

            <Link href="/problems?difficulty=medium">
              <div className="group bg-primary-fixed p-8 rounded-xl transition-all hover:bg-primary hover:text-on-primary cursor-pointer border-2 border-primary/10">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-5xl text-primary group-hover:text-primary-fixed">school</span>
                    <h4 className="text-3xl font-bold text-primary group-hover:text-on-primary">보통 문제</h4>
                  </div>
                  <span className="text-xl font-bold text-primary opacity-60 group-hover:text-on-primary">{difficultyStats.medium} 문제</span>
                </div>
                <p className="text-2xl text-primary-container opacity-80 mb-6 group-hover:text-on-primary">중급 실력을 위한 실전적인 사활 문제입니다.</p>
                <div className="flex items-center gap-2 font-bold text-primary group-hover:text-primary-fixed text-xl">
                  시작하기 <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </Link>

            <Link href="/problems?difficulty=hard">
              <div className="group bg-surface-container-high p-8 rounded-xl transition-all hover:bg-primary hover:text-on-primary cursor-pointer border-2 border-transparent hover:border-primary">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-5xl text-primary group-hover:text-primary-fixed">psychology</span>
                    <h4 className="text-3xl font-bold">어려운 문제</h4>
                  </div>
                  <span className="text-xl font-bold opacity-60">{difficultyStats.hard} 문제</span>
                </div>
                <p className="text-2xl opacity-80 mb-6">고단자를 향한 깊은 수읽기가 필요한 난제입니다.</p>
                <div className="flex items-center gap-2 font-bold group-hover:text-primary-fixed text-xl">
                  시작하기 <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-12 text-center space-y-6 max-w-4xl mx-auto border-y-4 border-surface-variant/30">
          <span className="material-symbols-outlined text-5xl text-primary-fixed-dim">format_quote</span>
          <blockquote className="text-3xl md:text-4xl font-black text-primary leading-snug px-4">
            &quot;바둑은 인생의 축소판이며,<br />한 수 한 수에 온 정성을 다하는 것이<br />공부의 시작이자 끝입니다.&quot;
          </blockquote>
          <cite className="block text-xl text-on-surface-variant font-bold not-italic">— 무명 선비의 가르침</cite>
        </section>
      </main>
      <BottomNavBar />
    </div>
  )
}
