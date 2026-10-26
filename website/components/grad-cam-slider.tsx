'use client'

import { useEffect, useRef, useState } from 'react'

interface GradCamSliderProps {
  originalSrc: string
  heatmapSrc: string
  originalAlt?: string
  className?: string
  showQualityBadge?: boolean
}

export default function GradCamSlider({
  originalSrc,
  heatmapSrc,
  originalAlt = 'Clinical oral lesion',
  className = '',
  showQualityBadge = false,
}: GradCamSliderProps) {
  // slider represents the divider position from left (0 to 100)
  // Left side shows Original, Right side shows Grad-CAM heatmap
  // heatmapPercent is (100 - slider)%
  const [slider, setSlider] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)


  function getPercent(clientX: number) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return slider
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    return Math.round((x / rect.width) * 100)
  }

  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (!isDragging.current) return
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      setSlider(getPercent(clientX))
    }
    function onUp() { isDragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove as EventListener)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove as EventListener)
      window.removeEventListener('touchend', onUp)
    }
  })

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/3] max-h-[340px] cursor-ew-resize select-none overflow-hidden rounded-2xl bg-[#090d16] border border-[#1e293b] shadow-inner touch-none flex items-center justify-center ${className}`}
      onMouseDown={(e) => { isDragging.current = true; setSlider(getPercent(e.clientX)) }}
      onTouchStart={(e) => { isDragging.current = true; setSlider(getPercent(e.touches[0].clientX)) }}
    >
      {/* Left base: Original photograph */}
      <img src={originalSrc} alt={originalAlt} className="absolute inset-0 h-full w-full object-contain pointer-events-none" draggable={false} />

      {/* Right overlay: Grad-CAM attention heatmap (clipped from slider% to 100%) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 0 0 ${slider}%)` }}
      >
        {heatmapSrc ? (
          <img
            src={heatmapSrc}
            alt="Grad-CAM heatmap overlay"
            className="absolute inset-0 h-full w-full object-contain pointer-events-none"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-[1px]">
            <div className="rounded-xl border border-sky-500/30 bg-slate-900/90 px-3.5 py-1.5 text-center text-[11px] text-sky-200 shadow-md">
              <span className="font-semibold block text-white text-xs">Awaiting Inference</span>
              Run screening to compute dual-backbone Grad-CAM
            </div>
          </div>
        )}
      </div>

      {/* Vertical divider handle */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(32,58,53,.25)]"
        style={{ left: `${slider}%` }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full bg-white shadow-md border border-slate-200">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M4 7H1M4 7L2 5M4 7L2 9M10 7H13M10 7L12 5M10 7L12 9" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Top Left: Optional Quality Passed Badge */}
      {showQualityBadge && (
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#2c6650] backdrop-blur-sm shadow-xs border border-emerald-100">
          <span className="size-1.5 rounded-full bg-[#10b981]" />
          QUALITY PASSED
        </div>
      )}

      {/* Floating clinical labels */}
      <span className="absolute bottom-2.5 left-2.5 rounded-md bg-[#0f172a]/85 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">Original</span>
      <span className="absolute bottom-2.5 right-2.5 rounded-md bg-[#0f172a]/85 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">Grad-CAM</span>
      
    </div>
  )
}
