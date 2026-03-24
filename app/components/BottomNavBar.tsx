'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { playClickSound } from '../utils/audio'

const navItems = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/records', label: '나의 기록', icon: 'history' },
]

export default function BottomNavBar() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#fbfbe2] border-t-2 border-[#e4e4cc] flex justify-around items-center px-4 pb-8 pt-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      {navItems.map(item => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => playClickSound()}
            className={`flex flex-col items-center justify-center px-8 py-2 rounded-2xl transition-all ${
              isActive
                ? 'bg-primary text-on-primary scale-105 shadow-md'
                : 'text-on-surface-variant'
            }`}
          >
            <span
              className="material-symbols-outlined text-4xl"
              style={isActive ? { fontVariationSettings: `'FILL' 1` } : {}}
            >
              {item.icon}
            </span>
            <span className="font-bold text-lg">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
