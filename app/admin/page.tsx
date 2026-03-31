'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import TopAppBar from '../components/TopAppBar'
import BottomNavBar from '../components/BottomNavBar'
import problemsData from '@/src/data/problems.json'
import { Problem } from '../types'
import { playClickSound } from '../utils/audio'

const problems = problemsData.problems as Problem[]

export default function AdminPage() {
  const router = useRouter()
  const [searchId, setSearchId] = useState('')
  const [filterText, setFilterText] = useState('')

  const filteredProblems = useMemo(() => {
    return problems.filter(p => 
      p.id.toString().includes(filterText) || 
      p.title.toLowerCase().includes(filterText.toLowerCase())
    )
  }, [filterText])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchId) return
    playClickSound()
    router.push(`/solve/${searchId}`)
  }

  const goToProblem = (id: number) => {
    playClickSound()
    router.push(`/solve/${id}`)
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar />
      
      <main className="mt-28 max-w-2xl mx-auto px-6 space-y-8">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-primary">admin_panel_settings</span>
          <h1 className="text-4xl font-black text-primary">관리자 도구</h1>
        </div>

        {/* Quick Search ID */}
        <section className="bg-surface-container rounded-2xl p-6 shadow-sm border border-outline-variant">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">search</span>
            문제 번호로 즉시 이동
          </h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input 
              type="number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="문제 번호 (ID) 입력"
              className="flex-1 bg-surface-container-highest rounded-xl px-4 py-3 text-lg font-bold border-2 border-transparent focus:border-primary outline-none transition-all"
            />
            <button 
              type="submit"
              className="bg-primary text-on-primary px-6 py-3 rounded-xl font-black hover:bg-primary-container transition-all active:scale-95"
            >
              이동
            </button>
          </form>
        </section>

        {/* Problem List Filter */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined">list</span>
              전체 문제 목록 ({filteredProblems.length})
            </h2>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="ID 또는 제목 검색"
                className="bg-surface-container-high rounded-full pl-10 pr-4 py-2 text-sm border border-outline-variant focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredProblems.map(p => (
              <button
                key={p.id}
                onClick={() => goToProblem(p.id)}
                className="flex items-center justify-between p-4 bg-surface-container hover:bg-surface-container-highest rounded-xl border border-outline-variant transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 flex items-center justify-center bg-primary-fixed rounded-lg font-black text-primary">
                    {p.id}
                  </span>
                  <div>
                    <p className="font-bold text-on-surface">{p.title}</p>
                    <p className="text-xs text-on-surface-variant opacity-60 uppercase font-black">{p.difficulty}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </button>
            ))}
            {filteredProblems.length === 0 && (
              <div className="text-center py-12 text-on-surface-variant">
                <span className="material-symbols-outlined text-6xl opacity-20">inventory_2</span>
                <p className="mt-2">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNavBar />
    </div>
  )
}
