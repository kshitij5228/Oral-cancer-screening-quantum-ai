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
            <a
              href="https://github.com/kshitij5228"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-xs font-bold text-[#0f172a] shadow-xs transition hover:bg-[#f1f5f9] hover:border-[#94a3b8]"
              title="GitHub Profile (kshitij5228)"
            >
              <svg className="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>
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
            <a
              href="https://github.com/kshitij5228"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] shadow-xs hover:bg-[#f1f5f9] transition"
            >
              <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub (kshitij5228)</span>
            </a>
            <Link
              href="/screening"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-xl bg-[#0284c7] px-4 py-3.5 text-center text-sm font-bold text-white shadow-md hover:bg-[#0369a1] transition"
            >
              Start Clinical Screening &rarr;
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
