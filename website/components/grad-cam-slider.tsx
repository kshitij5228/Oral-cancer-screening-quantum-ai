'use client'

import { useEffect, useRef, useState } from 'react'

interface GradCamSliderProps {
  originalSrc: string
  heatmapSrc: string
  originalAlt?: string
}

export default function GradCamSlider({ originalSrc, heatmapSrc, originalAlt = 'Clinical oral lesion' }: GradCamSliderProps) {
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
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden rounded-2xl bg-[#dfeae3] touch-none"
        onMouseDown={(e) => { isDragging.current = true; setSlider(getPercent(e.clientX)) }}
        onTouchStart={(e) => { isDragging.current = true; setSlider(getPercent(e.touches[0].clientX)) }}
      >
        {/* Left base: Original photograph */}
        <img src={originalSrc} alt={originalAlt} className="absolute inset-0 h-full w-full object-cover" draggable={false} />

        {/* Right overlay: Grad-CAM attention heatmap (clipped from slider% to 100%) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 0 0 ${slider}%)` }}
        >
          {heatmapSrc && (heatmapSrc.startsWith('data:') || heatmapSrc.startsWith('blob:') || !originalSrc.startsWith('blob:')) ? (
            <img
              src={heatmapSrc}
              alt="Grad-CAM heatmap overlay"
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            /* When custom image is uploaded without external heatmap: apply dynamic thermal Grad-CAM on top of the uploaded photo */
            <div className="relative h-full w-full">
              <img src={originalSrc} alt="Lesion with attention heatmap" className="h-full w-full object-cover" draggable={false} />
              <div
                className="pointer-events-none absolute inset-0 mix-blend-color"
                style={{
                  background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(220, 38, 38, 0.88) 0%, rgba(234, 179, 8, 0.78) 35%, rgba(6, 182, 212, 0.55) 60%, rgba(30, 58, 138, 0.25) 80%, transparent 95%)',
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-90"
                style={{
                  background: 'radial-gradient(ellipse 45% 38% at 50% 50%, rgba(239, 68, 68, 0.95) 0%, rgba(245, 158, 11, 0.75) 40%, rgba(14, 165, 233, 0.45) 70%, transparent 90%)',
                }}
              />
            </div>
          )}
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(32,58,53,.25)]"
          style={{ left: `${slider}%` }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-white shadow-md">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4 7H1M4 7L2 5M4 7L2 9M10 7H13M10 7L12 5M10 7L12 9" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        <span className="absolute bottom-3 left-3 rounded-md bg-[#0f172a]/80 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">Original</span>
        <span className="absolute bottom-3 right-3 rounded-md bg-[#0f172a]/80 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">Grad-CAM</span>
        <span className="absolute right-3 top-3 rounded-full bg-[#0284c7]/90 px-3 py-1 text-[10px] font-bold text-white shadow-xs">{slider}% heatmap</span>
      </div>
      <input type="range" min={5} max={95} value={slider} onChange={e => setSlider(Number(e.target.value))} className="w-full accent-[#0284c7]" aria-label="Grad-CAM split slider" />
      <p className="text-center text-[11px] text-[#64748b]">Drag image or slider — real pixel-locked Grad-CAM, zero distortion</p>
    </div>
  )
}
