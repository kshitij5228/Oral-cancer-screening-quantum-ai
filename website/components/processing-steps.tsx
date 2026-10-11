'use client'

import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Pre-Flight Quality Check', sublabel: 'Mucosa · Sharpness · Glare · Contrast', duration: 600 },
  { id: 2, label: 'Q-ConX-Dense Vision Extraction', sublabel: 'ConvNeXt-V2-Tiny 384px + DenseNet-121', duration: 1400 },
  { id: 3, label: 'Q-ConX-Dense Quantum Decision Stage', sublabel: '8-Qubit VQC · Hilbert space projection · QPS', duration: 2000 },
]

export interface ProcessingStepsProps {
  active: boolean
  onComplete?: () => void
  mode?: 'preset' | 'live'
  liveStage?: 'evaluating' | 'cnn_quantum' | 'complete' | 'failed'
  failedReason?: string
}

export default function ProcessingSteps({
  active,
  onComplete,
  mode = 'preset',
  liveStage = 'evaluating',
  failedReason,
}: ProcessingStepsProps) {
  const [completedStep, setCompletedStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  // Preset mode timer
  useEffect(() => {
    if (mode !== 'preset') return
    if (!active) {
      setCompletedStep(0)
      setCurrentStep(0)
      return
    }
    setCompletedStep(0)
    setCurrentStep(1)
    const timers: ReturnType<typeof setTimeout>[] = []
    STEPS.forEach((step, idx) => {
      timers.push(
        setTimeout(() => {
          setCompletedStep(idx + 1)
          if (idx + 1 < STEPS.length) setCurrentStep(idx + 2)
          else {
            setCurrentStep(0)
            onComplete?.()
          }
        }, step.duration)
      )
    })
    return () => timers.forEach(clearTimeout)
  }, [active, mode, onComplete])

  const isLive = mode === 'live'
  const isFailed = isLive && liveStage === 'failed'

  if (!active && !isFailed && completedStep === 0) return null

  return (
    <div className="space-y-2.5">
      {STEPS.map((step) => {
        let isDone = false
        let isRunning = false
        let isStepFailed = false
        let isAborted = false

        if (isLive) {
          if (isFailed) {
            if (step.id === 1) isStepFailed = true
            else isAborted = true
          } else if (liveStage === 'evaluating') {
            if (step.id === 1) isRunning = true
          } else if (liveStage === 'cnn_quantum') {
            if (step.id === 1) isDone = true
            else if (step.id === 2 || step.id === 3) isRunning = true
          } else if (liveStage === 'complete') {
            isDone = true
          }
        } else {
          isDone = completedStep >= step.id
          isRunning = currentStep === step.id && !isDone
        }

        return (
          <div
            key={step.id}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 ${
              isStepFailed
                ? 'border-[#f5c6c0] bg-[#fff5f5]'
                : isDone
                ? 'border-[#c8e2d4] bg-[#f0faf4]'
                : isRunning
                ? 'border-[#b8d0c3] bg-[#f6fbf7]'
                : isAborted
                ? 'border-[#eceeed] bg-[#fafafa] opacity-50'
                : 'border-[#e5eee9] bg-white opacity-50'
            }`}
          >
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full text-white transition-all duration-300 ${
                isStepFailed
                  ? 'bg-[#d92d20]'
                  : isDone
                  ? 'bg-[#3fa06e]'
                  : isRunning
                  ? 'animate-pulse bg-[#0284c7]'
                  : 'bg-[#c9d9d3]'
              }`}
            >
              {isStepFailed ? (
                <X size={15} strokeWidth={2.5} />
              ) : isDone ? (
                <Check size={14} strokeWidth={2.5} />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {step.id === 1 && (
                    <>
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </>
                  )}
                  {step.id === 2 && (
                    <>
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </>
                  )}
                  {step.id === 3 && <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />}
                </svg>
              )}
            </span>

            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm font-semibold ${
                  isStepFailed
                    ? 'text-[#b53a25]'
                    : isDone
                    ? 'text-[#2c6650]'
                    : isRunning
                    ? 'text-[#264e45]'
                    : 'text-[#91a59f]'
                }`}
              >
                {step.id === 1 && isStepFailed ? 'Pre-Flight Quality Gate · FAILED' : step.label}
              </p>
              <p
                className={`truncate text-[11px] ${
                  isStepFailed ? 'text-[#a35244]' : 'text-[#8aa099]'
                }`}
              >
                {step.id === 1 && isStepFailed
                  ? failedReason || 'Non-oral anatomy or invalid photographic quality detected'
                  : isAborted
                  ? 'Aborted (pre-flight quality gate failed)'
                  : isRunning && isLive && step.id === 1
                  ? 'Verifying oral cavity tissue, focus & illumination…'
                  : step.sublabel}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                isStepFailed
                  ? 'bg-[#fee4e2] text-[#d92d20]'
                  : isDone
                  ? 'bg-[#d7f0e3] text-[#2e7a53]'
                  : isRunning
                  ? 'bg-[#daeee5] text-[#3d6e5a]'
                  : isAborted
                  ? 'bg-[#f0f2f1] text-[#9aa7a2]'
                  : 'bg-[#eef4f1] text-[#93aba4]'
              }`}
            >
              {isStepFailed
                ? 'Failed ✕'
                : isDone
                ? 'Passed ✓'
                : isRunning
                ? 'Running…'
                : isAborted
                ? 'Aborted'
                : 'Waiting'}
            </span>
          </div>
        )
      })}

      <div className="h-1.5 overflow-hidden rounded-full bg-[#e5eee9]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isFailed
              ? 'bg-[#d92d20]'
              : 'bg-gradient-to-r from-[#38bdf8] to-[#0284c7]'
          }`}
          style={{
            width: isFailed
              ? '33.3%'
              : isLive
              ? liveStage === 'evaluating'
                ? '25%'
                : liveStage === 'cnn_quantum'
                ? '75%'
                : '100%'
              : `${(completedStep / STEPS.length) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}
