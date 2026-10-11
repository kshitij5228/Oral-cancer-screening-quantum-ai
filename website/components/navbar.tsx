'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, ScanLine, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/screening', label: 'Screening' },
  { href: '/research', label: 'Research' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="no-print sticky top-0 z-40 border-b border-[#cbd5e1] bg-[#f8fafc]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="QAI-OLI home">
          <span className="grid size-9 place-items-center rounded-xl bg-[#0f172a] text-white shadow-xs transition group-hover:bg-[#1e293b]">
            <ScanLine size={18} aria-hidden="true" />
          </span>
          <span>
            <strong className="block font-serif text-[17px] tracking-tight text-[#0f172a]">
              QAI<span className="text-[#0284c7]">-OLI</span>
            </strong>
            <small className="text-[9px] font-bold uppercase tracking-[.22em] text-[#64748b]">
              Oral Oncology AI
            </small>
          </span>
        </Link>

        {/* Right section: Navigation tabs + CTA / Status */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          {/* Desktop Navigation tabs */}
          <nav className="qai-desktop-nav items-center gap-1.5" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-xl px-3.5 py-2 text-xs lg:text-sm font-bold transition-all ${
                    active
                      ? 'bg-[#0f172a] text-white shadow-xs'
                      : 'text-[#1e293b] hover:bg-[#e2e8f0] hover:text-[#0284c7]'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Right CTA / Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-[#bae6fd] bg-[#e0f2fe] px-3 py-1.5 text-xs font-semibold text-[#0369a1] xl:flex">
              <span className="size-1.5 animate-pulse rounded-full bg-[#0284c7]" />
              System operational
            </span>
            <Link
              href="/screening"
              className="qai-cta-btn rounded-xl bg-[#0284c7] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#0369a1]"
            >
              Start screening &rarr;
            </Link>
            <button
              className="qai-mobile-btn rounded-xl border border-[#cbd5e1] bg-[#f1f5f9] p-2 text-[#334155] hover:bg-[#e2e8f0] focus:outline-hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="qai-mobile-drawer border-t border-[#cbd5e1] bg-[#f8fafc]/98 px-5 pb-6 pt-3 shadow-lg backdrop-blur-md animate-in slide-in-from-top-2 duration-150">
          <div className="mb-3 flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Navigation</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e0f2fe] px-2.5 py-0.5 text-[10px] font-bold text-[#0369a1]">
              <span className="size-1.5 rounded-full bg-[#0284c7] animate-pulse" />
              Online
            </span>
          </div>
          <nav className="flex flex-col gap-1.5">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition flex items-center justify-between ${
                    active ? 'bg-[#0f172a] text-white shadow-xs' : 'text-[#334155] hover:bg-[#e2e8f0]'
                  }`}
                >
                  <span>{label}</span>
                  {active && <span className="size-1.5 rounded-full bg-sky-400" />}
                </Link>
              )
            })}
            <Link
              href="/screening"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-xl bg-[#0284c7] px-4 py-3.5 text-center text-sm font-bold text-white shadow-md hover:bg-[#0369a1] transition"
            >
              Start Clinical Screening &rarr;
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
