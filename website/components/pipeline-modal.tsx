'use client'

import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'

const PIPELINE_STAGES = [
  { num: '01', color: '#0284c7', title: 'Clinical Photo Input', short: 'Secure upload · JPEG/PNG · up to 12 MB', detail: 'The system accepts oral cavity photographs via secure drag-and-drop or camera capture. File integrity is verified before any inference begins.' },
  { num: '02', color: '#2563eb', title: 'Pre-Flight Quality & OOD Gate', short: 'Sharpness · Glare · Vascular Mucosa · Foreign Tones · OOD Rejection', detail: 'Multi-tier clinical gate runs in ~5 ms: Laplacian variance for motion blur, mean luminance for exposure, specular glare clipping, foreign chromatic screening (rejects non-mucosal green/blue tones > 8%), true vascular oral mucosa perfusion (R > G, R > B; min 25% threshold), extraoral selfie rejection, and auxiliary MobileNetV3 out-of-distribution object classification.' },
  { num: '03', color: '#4f46e5', title: 'Multi-Backbone Vision Streams', short: 'ConvNeXt-V2-Tiny 384×384 + DenseNet-121', detail: 'Stage 1 ConvNeXt-Tiny captures macro pathological tissue margins and invasive depth contours at 384×384. Stage 2 DenseNet-121 captures micro mucosal features and fine vascular patterns through dense layer connectivity.' },
  { num: '04', color: '#bd8950', title: '8-Qubit Variational Quantum Circuit', short: 'AngleEmbedding (RY) + StronglyEntanglingLayers', detail: 'Latent feature representations are encoded into 8 qubit rotation angles in Hilbert space. Three StronglyEntanglingLayers with circular CNOT entanglement detect non-linear cross-feature correlations invisible to classical networks. 72 trainable quantum parameters with a parallel 64-D classical residual branch.' },
  { num: '05', color: '#0f172a', title: 'Q-ConX-Dense Clinical Triage Verdict', short: 'Grad-CAM · Consensus rule-out · Screening Report', detail: 'The quantum-classical representation feeds the Q-ConX-Dense hierarchical triage classifier. Dual-stream Grad-CAM generates pixel-level saliency maps. Output: calibrated 4-class clinical risk triage with differential rule-out explanation and printable open-access screening summary slip.' },
]

interface PipelineModalProps {
  open: boolean
  onClose: () => void
}

export default function PipelineModal({ open, onClose }: PipelineModalProps) {
  const [expanded, setExpanded] = useState<number | null>(null)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0f172a]/60 p-4 backdrop-blur-sm"
      role="dialog" aria-modal="true" aria-labelledby="pipeline-modal-title" onClick={onClose}>
      <div className="w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 flex items-start justify-between rounded-t-3xl bg-white px-7 pb-4 pt-6 border-b border-[#cbd5e1]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#0284c7]">Architecture flow</p>
            <h2 id="pipeline-modal-title" className="font-serif text-2xl text-[#0f172a]">From photo to transparent result</h2>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-[#64748b] transition hover:bg-[#f1f5f9]" aria-label="Close"><X size={20} /></button>
        </div>

        <div className="px-7 py-5 space-y-2">
          {PIPELINE_STAGES.map((stage, i) => {
            const isOpen = expanded === i
            return (
              <div key={stage.num}>
                <button onClick={() => setExpanded(isOpen ? null : i)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-[#cbd5e1] bg-[#f8fafc] p-4 text-left transition hover:bg-[#f1f5f9]">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white shadow-xs" style={{ background: stage.color }}>{stage.num}</span>
                  <div className="flex-1 min-w-0">
                    <strong className="block text-sm text-[#0f172a] truncate">{stage.title}</strong>
                    <span className="text-xs text-[#64748b] truncate block">{stage.short}</span>
                  </div>
                  <ChevronDown size={16} className={`shrink-0 text-[#94a3b8] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="mx-4 rounded-b-2xl border border-t-0 border-[#cbd5e1] bg-[#f1f5f9] px-5 py-4 text-sm leading-7 text-[#334155]">{stage.detail}</div>
                )}
                {i < PIPELINE_STAGES.length - 1 && <div className="ml-8 w-0.5 h-2 bg-[#cbd5e1]" />}
              </div>
            )
          })}
        </div>

        <div className="border-t border-[#cbd5e1] px-7 py-4">
          <p className="text-[11px] leading-5 text-[#64748b]">QAI-OLI is a research prototype. All outputs are AI assistance only — not a substitute for professional medical evaluation.</p>
        </div>
      </div>
    </div>
  )
}
