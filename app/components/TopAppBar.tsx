'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function TopAppBar() {
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: '홈' },
    { href: '/problems', label: '문제들' },
    { href: '/records', label: '기록' },
  ]

  return (
    <header className="fixed top-0 z-50 w-full bg-[#fbfbe2] border-b-4 border-[#e4e4cc] flex justify-between items-center px-6 py-4">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-[#422b27] text-3xl">menu</span>
        <Link href="/">
          <h1 className="font-serif text-3xl font-black text-[#422b27] tracking-tight">선비의 공부방</h1>
        </Link>
      </div>
      <div className="hidden md:flex gap-8 items-center">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-serif text-lg font-bold px-3 py-1 rounded transition-colors ${
              pathname === link.href
                ? 'text-[#422b27] border-b-2 border-[#422b27]'
                : 'text-[#5b413c] hover:bg-[#efefd7]'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  )
}
