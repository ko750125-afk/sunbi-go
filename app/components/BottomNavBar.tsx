'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/problems', label: '문제들', icon: 'extension' },
  { href: '/records', label: '기록', icon: 'history' },
]

export default function BottomNavBar() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#fbfbe2] border-t-4 border-[#e4e4cc] flex justify-around items-center px-4 pb-8 pt-4 z-50 shadow-2xl">
      {navItems.map(item => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all ${
              isActive
                ? 'bg-[#ffdad4] text-[#422b27] scale-110'
                : 'text-[#5b413c]'
            }`}
          >
            <span
              className="material-symbols-outlined text-4xl"
              style={isActive ? { fontVariationSettings: `'FILL' 1` } : {}}
            >
              {item.icon}
            </span>
            <span className="font-serif text-xl font-bold">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
