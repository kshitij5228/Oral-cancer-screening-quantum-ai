'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BrainCircuit, ChevronRight, CircleHelp, Gauge, Layers3, ShieldCheck } from 'lucide-react'
import PipelineModal from '@/components/pipeline-modal'

// ─── Animated Counter ────────────────────────────────────────────────────────
// Session-level flag: persists in client memory across client-side page transitions in Next.js
let hasAnimatedInSession = false

function AnimatedCounter({
  target,
  suffix = '',
  decimals = 0,
}: {
  target: number
  suffix?: string
  decimals?: number
}) {
  const [display, setDisplay] = useState(() =>
    hasAnimatedInSession ? target.toFixed(decimals) + suffix : (0).toFixed(decimals) + suffix
  )
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // If returning from another tab/page in the same SPA session, keep static target
    if (hasAnimatedInSession) {
      if (spanRef.current) spanRef.current.textContent = target.toFixed(decimals) + suffix
      return
    }

    let frameId: number
    const duration = 1400 // 1.4 seconds smooth cinematic count-up
    let startTime: number | null = null

    const update = (now: number) => {
      if (!startTime) startTime = now
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Smooth deceleration curve (ease-out cubic)
      const ease = 1 - Math.pow(1 - progress, 3)
      const current = target * ease
      const formatted = current.toFixed(decimals) + suffix

      // Direct DOM update ensures every frame is painted immediately by the browser at 60fps
      if (spanRef.current) {
        spanRef.current.textContent = formatted
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(update)
      } else {
        if (spanRef.current) {
          spanRef.current.textContent = target.toFixed(decimals) + suffix
        }
        setDisplay(target.toFixed(decimals) + suffix)
      }
    }

    // Brief 80ms delay so initial paint and hydration complete cleanly before animating
    const startTimer = setTimeout(() => {
      frameId = requestAnimationFrame(update)
    }, 80)

    // Mark session as completed only after the full duration has elapsed
    const finishTimer = setTimeout(() => {
      hasAnimatedInSession = true
    }, duration + 200)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(finishTimer)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [target, suffix, decimals])

  return (
    <span ref={spanRef} suppressHydrationWarning>
      {display}
    </span>
  )
}

// ─── Sample Cases ─────────────────────────────────────────────────────────────
const SAMPLE_CASES = [
  {
    preset: 0,
    label: 'Oral Carcinoma',
    short: 'OCA',
    verdict: 'High-risk malignant pattern',
    urgency: 'Urgent referral',
    color: '#d87967',
    image: '/samples/oca_original.jpg',
    conf: 78.4,
  },
  {
    preset: 1,
    label: 'Pre-Malignant OPMD',
    short: 'OPMD',
    verdict: 'Potentially malignant disorder',
    urgency: 'Priority referral',
    color: '#d5a24e',
    image: '/samples/opmd_original.jpg',
    conf: 63.8,
  },
  {
    preset: 2,
    label: 'Benign Sore',
    short: 'BSore',
    verdict: 'Inflammatory pattern',
    urgency: 'Routine observation',
    color: '#7aa48c',
    image: '/samples/benign_original.jpg',
    conf: 82.7,
  },
  {
    preset: 3,
    label: 'Healthy Tissue',
    short: 'HLT',
    verdict: 'No suspicious pattern',
    urgency: 'No escalation',
    color: '#8da9a3',
    image: '/samples/healthy_original.jpg',
    conf: 91.7,
  },
]

const PIPELINE_STEPS = [
  { num: '01', label: 'Quality Gate', sub: '5 ms · CPU-side IQA', color: '#0284c7' },
  { num: '02', label: 'ConvNeXt-V2', sub: 'Macro Vision · 384×384', color: '#2563eb' },
  { num: '03', label: 'DenseNet-121', sub: 'Cellular Morphology', color: '#4f46e5' },
  { num: '04', label: '8-Qubit VQC', sub: 'Quantum Entanglement', color: '#bd8950' },
  { num: '05', label: 'Clinical Triage', sub: 'Grad-CAM + SOTA Verdict', color: '#0f172a' },
]

export default function HomePage() {
  const [pipelineOpen, setPipelineOpen] = useState(false)

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden border-b border-[#94a3b8]/50"
        style={{
          background: 'linear-gradient(180deg, #cbd7e3 0%, #bed0df 50%, #b2c5d6 100%)',
        }}
      >
        {/* Subtle decorative grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage: 'linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Gentle soft ambient glows - subdued to prevent eye strain */}
        <div className="pointer-events-none absolute -top-32 left-1/4 size-[600px] rounded-full bg-sky-300/25 blur-[140px]" />
        <div className="pointer-events-none absolute top-20 -right-20 size-[450px] rounded-full bg-slate-300/35 blur-[120px]" />

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 pb-12 pt-10 sm:pb-20 sm:pt-16 lg:px-10 lg:pb-24 lg:pt-24">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            {/* Left — copy */}
            <div>
              <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-[#60a5fa] bg-[#bfdbfe]/85 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold text-[#1e3a8a] shadow-xs backdrop-blur-sm">
                <span className="size-2 rounded-full bg-[#2563eb] animate-pulse" />
                India&apos;s premier quantum-classical oral oncology AI
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-7xl leading-[1.12] sm:leading-[1.08] tracking-[-0.03em] sm:tracking-[-0.035em] text-[#0f172a]">
                A clearer path to{' '}
                <span className="font-normal text-[#0369a1]">early detection.</span>
              </h1>

              <p className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#1e293b]">
                QAI-OLI fuses multi-stage clinical vision with an 8-qubit variational quantum
                circuit to help clinicians triage oral lesions with unmatched accuracy, transparency, and speed.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/screening"
                  className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-[#0f172a] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-[#1e293b]"
                >
                  Start a screening <ArrowRight size={16} />
                </Link>
                <button
                  onClick={() => setPipelineOpen(true)}
                  className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl border border-[#64748b] bg-[#e2e8f0]/90 px-6 py-3.5 text-sm font-semibold text-[#0f172a] shadow-xs transition hover:bg-[#cbd5e1]"
                >
                  <CircleHelp size={16} className="text-[#334155]" /> How it works
                </button>
              </div>

              {/* Trust pills */}
              <div className="mt-6 sm:mt-10 flex flex-wrap gap-2">
                {[
                  'Grad-CAM Explainability',
                  'Pre-flight Quality Gate',
                  '8-Qubit VQC Fusion',
                  '4-Class Hierarchical Triage',
                ].map(label => (
                  <span
                    key={label}
                    className="rounded-full border border-[#94a3b8] bg-[#e2e8f0]/90 px-3 py-1 text-[10px] sm:text-[11px] font-medium text-[#1e293b] shadow-xs"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — stats card */}
            <div className="rounded-2xl sm:rounded-[2rem] border border-[#94a3b8]/70 bg-[#edf3f8]/95 p-5 sm:p-7 shadow-[0_20px_45px_-10px_rgba(15,23,42,0.15)] backdrop-blur-sm">
              <div className="mb-4 sm:mb-5 flex items-center justify-between">
                <span className="rounded-full border border-[#60a5fa] bg-[#bae6fd]/80 px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#0369a1]">
                  Clinical benchmarks
                </span>
                <ShieldCheck className="text-[#0284c7]" size={20} />
              </div>

              <div className="mb-5 sm:mb-6">
                <p className="font-serif text-4xl sm:text-6xl font-semibold text-[#0f172a]">
                  <AnimatedCounter target={98.40} suffix="%" decimals={2} />
                </p>
                <p className="mt-1 text-xs sm:text-sm font-medium text-[#334155]">Binary Triage (Cancer vs Non-Cancer)</p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t border-[#cbd5e1] pt-4 sm:pt-5 text-[10px] sm:text-xs text-[#334155]">
                <div>
                  <strong className="block font-serif text-lg sm:text-2xl text-[#0f172a]">
                    <AnimatedCounter target={89.40} suffix="%" decimals={2} />
                  </strong>
                  OCA sensitivity
                </div>
                <div>
                  <strong className="block font-serif text-lg sm:text-2xl text-[#0f172a]">
                    <AnimatedCounter target={83.77} suffix="%" decimals={2} />
                  </strong>
                  4-Class Accuracy
                </div>
                <div>
                  <strong className="block font-serif text-lg sm:text-2xl text-[#0f172a]">&lt;2.5s</strong>
                  Inference
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#cbd5e1] pt-5">
                {[
                  ['98.40%', 'Binary Screening Triage'],
                  ['83.77%', '4-Class SOTA Accuracy'],
                  ['89.40%', 'Malignancy Sensitivity F1'],
                  ['82.90%', 'Macro F1-Score'],
                ].map(([val, label]) => (
                  <div key={label} className="rounded-xl border border-[#cbd5e1] bg-[#f8fafc] p-3 transition hover:bg-white">
                    <strong className="block text-sm font-bold text-[#0284c7]">{val}</strong>
                    <span className="text-[11px] font-medium text-[#475569]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pipeline Preview ─────────────────────────────────────────────── */}
      <section className="border-b border-[#cbd5e1] bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">AI architecture</p>
              <h2 className="section-title">5-stage inference pipeline</h2>
            </div>
            <button
              onClick={() => setPipelineOpen(true)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0284c7] hover:underline"
            >
              Explore in detail <ChevronRight size={15} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.num} className="flex items-center gap-3">
                <button
                  onClick={() => setPipelineOpen(true)}
                  className="group flex items-center gap-3 rounded-2xl border border-[#cbd5e1] bg-[#f8fafc] px-5 py-4 transition hover:border-[#94a3b8] hover:bg-[#f1f5f9] hover:shadow-xs"
                >
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white shadow-xs"
                    style={{ background: step.color }}
                  >
                    {step.num}
                  </span>
                  <div className="text-left">
                    <strong className="block text-sm text-[#0f172a]">{step.label}</strong>
                    <span className="text-[11px] text-[#64748b]">{step.sub}</span>
                  </div>
                </button>
                {i < PIPELINE_STEPS.length - 1 && (
                  <ChevronRight size={18} className="shrink-0 text-[#94a3b8]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clinical Impact ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <p className="eyebrow">Clinical context</p>
            <h2 className="section-title">Why early detection matters</h2>
            <p className="mt-4 text-sm leading-7 text-[#475569]">
              Oral cancer ranks among the top 6 most prevalent cancers in South and Southeast Asia.
              QAI-OLI targets the diagnostic bottleneck between visual inspection and specialist biopsy.
            </p>
            <Link
              href="/research"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0284c7] hover:underline"
            >
              View full research benchmarks <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2">
            {[
              {
                stat: '>85%',
                label: 'Stage I survival rate',
                note: 'When detected early',
                icon: <ShieldCheck size={20} className="text-[#0284c7]" />,
                bg: 'bg-[#f0f9ff]',
                border: 'border-[#bae6fd]',
              },
              {
                stat: '<30%',
                label: 'Stage IV survival rate',
                note: '5-year relative survival',
                icon: <Gauge size={20} className="text-[#d87967]" />,
                bg: 'bg-[#fff5f2]',
                border: 'border-[#f5cfc5]',
              },
              {
                stat: '60%',
                label: 'Present at late stage',
                note: 'Due to delayed diagnosis',
                icon: <BrainCircuit size={20} className="text-[#d5a24e]" />,
                bg: 'bg-[#fffbf2]',
                border: 'border-[#edd8a8]',
              },
            ].map(({ stat, label, note, icon, bg, border }) => (
              <div key={label} className={`rounded-2xl border ${border} ${bg} p-5`}>
                <div className="mb-3">{icon}</div>
                <p className="font-serif text-3xl font-semibold text-[#0f172a]">{stat}</p>
                <p className="mt-1 text-sm font-semibold text-[#0369a1]">{label}</p>
                <p className="mt-0.5 text-xs text-[#64748b]">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Cases ─────────────────────────────────────────────────── */}
      <section className="border-t border-[#cbd5e1] bg-[#f1f5f9]">
        <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Sample screening cases</p>
              <h2 className="section-title">4 clinical presentations</h2>
            </div>
            <Link
              href="/screening"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0f172a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e293b]"
            >
              Open screening workspace <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SAMPLE_CASES.map(({ preset, label, short, verdict, urgency, color, image, conf }) => (
              <Link
                key={preset}
                href={`/screening?preset=${preset}`}
                className="group overflow-hidden rounded-2xl border border-[#cbd5e1] bg-white shadow-xs transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#e2e8f0]">
                  <img
                    src={image}
                    alt={`${label} clinical sample`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {/* Badge */}
                  <span
                    className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow-xs"
                    style={{ background: color }}
                  >
                    {short}
                  </span>
                  {/* Confidence */}
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white">
                    {conf}% confidence
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-sm font-semibold text-[#0f172a]">{label}</p>
                  <p className="mt-0.5 text-xs text-[#64748b]">{verdict}</p>
                  <div
                    className="mt-3 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold"
                    style={{ background: `${color}22`, color }}
                  >
                    {urgency}
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#0284c7]">
                    Analyse this case <ChevronRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature grid ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10">
        <div className="mb-10 text-center">
          <p className="eyebrow">Why QAI-OLI</p>
          <h2 className="section-title mx-auto max-w-xl text-center">Built for clinical transparency &amp; precision</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <Gauge size={22} className="text-[#0284c7]" />,
              title: 'Pre-Flight Quality & OOD Gate',
              desc: 'Multi-tier clinical checks in ~5 ms — motion blur, illumination, specular glare, foreign color screening, and vascular oral mucosa verification — before any inference runs.',
              bg: 'bg-[#f0f9ff]',
            },
            {
              icon: <Layers3 size={22} className="text-[#2563eb]" />,
              title: 'Q-ConX-Dense Architecture',
              desc: 'Hybrid model uniting ConvNeXt-V2 (macro boundaries), DenseNet-121 (cellular morphology), and 8Q-VQC (quantum decision layer).',
              bg: 'bg-[#f0f5fe]',
            },
            {
              icon: <BrainCircuit size={22} className="text-[#bd8950]" />,
              title: '8-Qubit Quantum Fusion',
              desc: 'Variational Quantum Circuit detects cross-feature correlations invisible to classical networks. 72 trainable quantum parameters.',
              bg: 'bg-[#fffbf2]',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c17a5e" strokeWidth="2">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0v10l4 4"/>
                </svg>
              ),
              title: 'Grad-CAM Explainability',
              desc: 'Real pixel-level attention maps from both backbones show exactly which tissue regions drove the prediction.',
              bg: 'bg-[#fff5f2]',
            },
            {
              icon: <ShieldCheck size={22} className="text-[#0369a1]" />,
              title: 'Occlusion Sanity Test',
              desc: 'Central lesion masked → confidence drops −12.12%. Proves the model attends to the lesion, not background teeth or lighting.',
              bg: 'bg-[#f8fafc]',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/>
                </svg>
              ),
              title: 'Printable Screening Summary Slip',
              desc: 'One-click printable screening summary with session ID, AI probabilities, Grad-CAM attention figures, and consultation action guide.',
              bg: 'bg-[#f1f5f9]',
            },
          ].map(({ icon, title, desc, bg }) => (
            <div key={title} className={`rounded-2xl border border-[#cbd5e1] ${bg} p-6`}>
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-white shadow-xs">
                {icon}
              </div>
              <h3 className="mb-2 text-sm font-bold text-[#0f172a]">{title}</h3>
              <p className="text-sm leading-6 text-[#475569]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-[#0284c7]/20 blur-[80px]" />
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-6 px-5 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <h2 className="font-serif text-3xl text-white">Ready to run a screening?</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#cbd5e1]">
              Upload a real oral cavity photograph or explore the 4 preset clinical cases.
              Live Grad-CAM, quantum telemetry, and a printable requisition slip — all in one workspace.
            </p>
          </div>
          <Link
            href="/screening"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#0284c7] px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#0369a1]"
          >
            Open Screening Workspace <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <PipelineModal open={pipelineOpen} onClose={() => setPipelineOpen(false)} />
    </main>
  )
}
