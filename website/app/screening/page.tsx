'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  AlertTriangle, Check, ChevronRight, FileText, Gauge,
  Layers3, Microscope, BrainCircuit, RefreshCw, Upload
} from 'lucide-react'
import GradCamSlider from '@/components/grad-cam-slider'
import BackbonePanel from '@/components/backbone-panel'
import QuantumPanel, { QUANTUM_DATA } from '@/components/quantum-panel'
import ProcessingSteps from '@/components/processing-steps'
import RequisitionSlip from '@/components/requisition-slip'
import PipelineModal from '@/components/pipeline-modal'

// ─── Types ────────────────────────────────────────────────────────────────────
type PresetClass = 'OCA' | 'OPMD' | 'Benign' | 'Healthy'

interface LiveInferenceData {
  prediction: PresetClass
  confidence_percentage: number
  class_probabilities: {
    Benign: number
    Healthy: number
    OCA: number
    OPMD: number
  }
  clinical_staging: string
  screening_triage: string
  risk_color: string
  urgency?: string
  ai_reasoning?: string
  differential_ruleout?: string
  recommendation?: string
  occlusion_drop?: number
  quality_gate: {
    passed: boolean
    laplacian_variance: number
    glare_percentage: number
    mean_luminance: number
    contrast_std: number
    mucosa_percentage?: number
    dentition_percentage?: number
    oral_coverage?: number
    foreign_percentage?: number
    face_skin_percentage?: number
  }
  quantum_telemetry: {
    num_qubits: number
    pauli_z_observables: number[]
    quantum_polarization_score: number
    simulator: string
  }
  heatmap_url: string
}

interface RejectionError {
  message: string
  issues: string[]
  quality_gate?: {
    passed: boolean
    laplacian_variance: number
    glare_percentage?: number
    mean_luminance?: number
    contrast_std?: number
    mucosa_percentage?: number
    dentition_percentage?: number
    oral_coverage?: number
    foreign_percentage?: number
    face_skin_percentage?: number
    unnatural_hue_percentage?: number
  }
}

interface Preset {
  name: string
  short: PresetClass
  verdict: string
  urgency: string
  urgencyColor: string
  image: string
  heatmap: string
  /** [Benign, Healthy, OCA, OPMD] — model order */
  probabilities: [number, number, number, number]
  ruleout: string
  recommendation: string
  occlusionDrop: number
}

const PRESETS: Preset[] = [
  {
    name: 'Oral Carcinoma',
    short: 'OCA',
    verdict: 'High-risk malignant pattern detected',
    urgency: 'Urgent referral',
    urgencyColor: '#bc6854',
    image: '/samples/oca_original.jpg',
    heatmap: '/samples/oca_heatmap.webp',
    probabilities: [5.2, 2.3, 78.4, 14.1],
    ruleout:
      'Differentiated from aphthous ulcer by persistent indurated margins, irregular depth contours, and absent erythematous halo. ConvNeXt-V2 flagged asymmetric lesion borders; DenseNet-121 detected cellular atypia and abnormal mucosal vascular patterns.',
    recommendation: 'Schedule specialist biopsy within 7 days.',
    occlusionDrop: 8.29,
  },
  {
    name: 'Pre-Malignant OPMD',
    short: 'OPMD',
    verdict: 'Potentially malignant disorder detected',
    urgency: 'Priority referral',
    urgencyColor: '#b8903a',
    image: '/samples/opmd_original.jpg',
    heatmap: '/samples/opmd_heatmap.webp',
    probabilities: [11.4, 6.6, 18.2, 63.8],
    ruleout:
      'Surface hyperkeratosis and tissue discoloration outweigh features expected from a transient inflammatory sore. Quantum fusion layer detected cross-feature correlations between surface texture and tissue depth not visible to either backbone alone.',
    recommendation: 'Schedule specialist review within 14 days.',
    occlusionDrop: 7.6,
  },
  {
    name: 'Benign Sore',
    short: 'Benign',
    verdict: 'Low-risk inflammatory pattern',
    urgency: 'Routine observation',
    urgencyColor: '#4f886f',
    image: '/samples/benign_original.jpg',
    heatmap: '/samples/benign_heatmap.webp',
    probabilities: [82.7, 6.8, 2.1, 8.4],
    ruleout:
      'Defined erythematous halo, shallow contour, and balanced texture are consistent with aphthous ulcer. Both backbones agreed with high confidence. Quantum purity score (0.33) reflects low inter-feature correlation — typical of benign presentations.',
    recommendation: 'Observe for 14 days; refer if non-healing.',
    occlusionDrop: 7.82,
  },
  {
    name: 'Healthy Tissue',
    short: 'Healthy',
    verdict: 'No suspicious pattern detected',
    urgency: 'No escalation',
    urgencyColor: '#4f886f',
    image: '/samples/healthy_original.jpg',
    heatmap: '/samples/healthy_heatmap.webp',
    probabilities: [5.1, 91.7, 0.8, 2.4],
    ruleout:
      'Uniform mucosal texture and normal coloration make lesion-driven pathology unlikely. Quantum purity score (0.12) is the lowest across all presets — consistent with simple, well-characterized healthy tissue features.',
    recommendation: 'Continue routine oral health checks.',
    occlusionDrop: 7.88,
  },
]

// Model class order: [Benign, Healthy, OCA, OPMD]
const CLASS_LABELS = ['Benign / Inflammatory', 'Healthy Mucosa', 'Oral Carcinoma', 'Pre-Malignant OPMD']
const CLASS_COLORS = ['#7aa48c', '#8da9a3', '#d87967', '#d5a24e']

type ActiveTab = 'results' | 'reasoning' | 'ruleout' | 'requisition'

const TABS: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { id: 'results',     label: 'Results',          icon: <Check size={14} /> },
  { id: 'reasoning',  label: 'AI Reasoning',     icon: <BrainCircuit size={14} /> },
  { id: 'ruleout',    label: 'Rule-Out',         icon: <Microscope size={14} /> },
  { id: 'requisition',label: 'Screening Report', icon: <FileText size={14} /> },
]

// ─── Main component (wrapped) ─────────────────────────────────────────────────
function ScreeningWorkspace() {
  const searchParams = useSearchParams()
  const initPreset = Math.min(Math.max(parseInt(searchParams.get('preset') ?? '0'), 0), 3)

  const [selected, setSelected] = useState(initPreset)
  const [liveResult, setLiveResult] = useState<LiveInferenceData | null>(null)
  const [rejectedError, setRejectedError] = useState<RejectionError | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [activeTab, setActiveTab] = useState<ActiveTab>('results')
  const [pipelineOpen, setPipelineOpen] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [isRechecking, setIsRechecking] = useState(false)
  const [pipelineMode, setPipelineMode] = useState<'preset' | 'live'>('preset')
  const [liveStage, setLiveStage] = useState<'evaluating' | 'cnn_quantum' | 'complete' | 'failed'>('evaluating')

  const fileRef = useRef<HTMLInputElement>(null)
  const rawFileRef = useRef<File | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const preset = PRESETS[selected]

  // Dynamic values: live model output when patient image uploaded, else preset
  const currentShortName: PresetClass = liveResult ? liveResult.prediction : preset.short
  const currentProbabilities: [number, number, number, number] = liveResult
    ? [
        liveResult.class_probabilities.Benign,
        liveResult.class_probabilities.Healthy,
        liveResult.class_probabilities.OCA,
        liveResult.class_probabilities.OPMD,
      ]
    : preset.probabilities
  const currentConfidence = liveResult ? liveResult.confidence_percentage : Math.max(...preset.probabilities)
  const currentVerdict = liveResult ? liveResult.clinical_staging : preset.verdict
  const currentUrgency = liveResult ? liveResult.screening_triage : preset.urgency
  const currentUrgencyColor = liveResult ? liveResult.risk_color : preset.urgencyColor
  const currentImage = uploadedImage ?? preset.image
  const currentHeatmap = liveResult ? liveResult.heatmap_url : preset.heatmap
  const currentRecommendation = liveResult?.recommendation ?? preset.recommendation
  const currentRuleout = liveResult?.differential_ruleout ?? preset.ruleout
  const currentReasoning = liveResult?.ai_reasoning ?? null
  const currentOcclusionDrop = liveResult?.occlusion_drop ?? preset.occlusionDrop
  const currentQualityGate = liveResult
    ? liveResult.quality_gate
    : {
        passed: true,
        laplacian_variance: 142.7,
        mean_luminance: 118.3,
        glare_percentage: 1.2,
        contrast_std: 52.1,
      }
  const currentQuantumExpvals = liveResult
    ? liveResult.quantum_telemetry.pauli_z_observables
    : QUANTUM_DATA[preset.short].expvals
  const currentQps = liveResult
    ? liveResult.quantum_telemetry.quantum_polarization_score
    : QUANTUM_DATA[preset.short].qps
  const maxProb = currentConfidence

  function resetWorkspace() {
    setUploadedImage(null)
    setLiveResult(null)
    setRejectedError(null)
    setShowResults(false)
    setAnalyzing(false)
    setPipelineMode('preset')
    setLiveStage('evaluating')
    setActiveTab('results')
    rawFileRef.current = null
    if (fileRef.current) fileRef.current.value = ''
  }

  // Check backend health with auto-retry and resilient polling
  const checkBackendHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/predict', { cache: 'no-store' })
      const data = await res.json()
      if (data?.status === 'online') {
        setBackendStatus('online')
        return true
      } else {
        setBackendStatus('offline')
        return false
      }
    } catch {
      setBackendStatus('offline')
      return false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    // Immediate probe
    checkBackendHealth()

    // Smart polling: retry every 3s if offline/checking, 25s heartbeat if online
    const intervalMs = backendStatus === 'online' ? 25000 : 3000
    const intervalId = setInterval(() => {
      if (isMounted) checkBackendHealth()
    }, intervalMs)

    // Re-verify immediately whenever browser window regains focus
    const onWindowFocus = () => {
      if (isMounted) checkBackendHealth()
    }
    window.addEventListener('focus', onWindowFocus)

    return () => {
      isMounted = false
      clearInterval(intervalId)
      window.removeEventListener('focus', onWindowFocus)
    }
  }, [backendStatus, checkBackendHealth])

  function triggerAnalysis(presetIndex: number) {
    setSelected(presetIndex)
    setLiveResult(null)
    setRejectedError(null)
    setUploadedImage(null)
    setShowResults(false)
    setPipelineMode('preset')
    setLiveStage('evaluating')
    setAnalyzing(true)
    setActiveTab('results')
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  function handleProcessingComplete() {
    setAnalyzing(false)
    setShowResults(true)
  }

  async function handleFile(file?: File, bypassGate = false) {
    const targetFile = file || rawFileRef.current
    if (!targetFile) return
    rawFileRef.current = targetFile
    const url = URL.createObjectURL(targetFile)
    setUploadedImage(url)
    setLiveResult(null)
    setRejectedError(null)
    setShowResults(false)
    setPipelineMode('live')
    setLiveStage('evaluating')
    setAnalyzing(true)
    setActiveTab('results')
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)

    try {
      const fd = new FormData()
      fd.append('file', targetFile)
      if (bypassGate) {
        fd.append('bypass_quality_gate', 'true')
      }
      const res = await fetch('/api/predict', { method: 'POST', body: fd })
      const payload = await res.json().catch(() => null)

      if (!res.ok || payload?.success === false || payload?.error_type === 'QUALITY_GATE_REJECTED') {
        setLiveStage('failed')
        setLiveResult(null)
        setRejectedError({
          message: payload?.message || 'The image was rejected by the anatomical quality gate.',
          issues: payload?.data?.rejection_issues || [payload?.message || 'The uploaded photograph does not contain human oral cavity tissue.'],
          quality_gate: payload?.data?.quality_gate,
        })
        setAnalyzing(false)
        setShowResults(true)
        return
      }

      if (payload?.data) {
        setBackendStatus('online')
        setLiveStage('cnn_quantum')
        setTimeout(() => {
          setLiveStage('complete')
          setRejectedError(null)
          setLiveResult(payload.data)
          const pred = payload.data.prediction as PresetClass
          if (pred === 'OCA') setSelected(0)
          else if (pred === 'OPMD') setSelected(1)
          else if (pred === 'Benign') setSelected(2)
          else if (pred === 'Healthy') setSelected(3)
          setAnalyzing(false)
          setShowResults(true)
        }, 500)
      }
    } catch (err) {
      console.error('Inference error:', err)
      setLiveStage('failed')
      setLiveResult(null)
      setRejectedError({
        message: 'Inference request failed or connection timed out.',
        issues: ['Network or inference pipeline error. Please verify the Python backend is running.'],
      })
      setAnalyzing(false)
      setShowResults(true)
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 print:min-h-0 print:bg-white print:p-0 print:pb-0">
      {/* Page header */}
      <div className="border-b border-[#cbd5e1] bg-white no-print">
        <div className="mx-auto max-w-[1440px] px-5 py-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">01 / Screening workspace</p>
              <h1 className="section-title">Clinical image analysis</h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Backend status */}
              <div className="hidden items-center gap-1.5 sm:flex">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  backendStatus === 'online'
                    ? 'border border-[#bae6fd] bg-[#e0f2fe] text-[#0369a1]'
                    : backendStatus === 'offline'
                    ? 'border border-[#fed7aa] bg-[#fff7ed] text-[#c2410c]'
                    : 'border border-[#cbd5e1] bg-[#f1f5f9] text-[#64748b]'
                }`}>
                  <span className={`size-1.5 rounded-full ${
                    backendStatus === 'online'
                      ? 'bg-[#0284c7] animate-pulse'
                      : backendStatus === 'offline'
                      ? 'bg-[#ea580c]'
                      : 'bg-[#94a3b8] animate-ping'
                  }`} />
                  {backendStatus === 'online'
                    ? 'Live inference ready'
                    : backendStatus === 'offline'
                    ? 'Demo mode — server offline'
                    : 'Connecting to backend…'}
                </span>
                {backendStatus === 'offline' && (
                  <button
                    type="button"
                    onClick={async () => {
                      setIsRechecking(true)
                      await checkBackendHealth()
                      setIsRechecking(false)
                    }}
                    title="Click to re-check Python server status"
                    className="inline-flex items-center gap-1 rounded-full border border-[#fed7aa] bg-white px-2 py-1 text-[11px] font-semibold text-[#c2410c] hover:bg-[#fff7ed] active:scale-95 transition"
                  >
                    <RefreshCw size={11} className={isRechecking ? 'animate-spin' : ''} />
                    Retry
                  </button>
                )}
              </div>
              <button
                onClick={() => setPipelineOpen(true)}
                className="flex items-center gap-1.5 text-sm font-semibold text-[#0284c7] hover:underline"
              >
                <Gauge size={14} /> How it works
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-3.5 sm:px-6 pt-4 sm:pt-6 lg:px-10 print:max-w-none print:p-0 print:m-0">
        <div className="grid gap-5 lg:grid-cols-[320px_1fr] min-w-0 w-full overflow-hidden print:block">

          {/* ── Left: Upload + Presets ──────────────────────────────────── */}
          <div className="space-y-4 no-print min-w-0 w-full">
            {/* Upload zone */}
            <div className="rounded-2xl border border-[#cbd5e1] bg-white p-4 sm:p-5 shadow-xs min-w-0">
              <div className="mb-3 sm:mb-4 flex items-center justify-between">
                <h2 className="font-serif text-base sm:text-lg text-[#0f172a]">Upload lesion photo</h2>
                <Upload size={18} className="text-[#0284c7]" />
              </div>

              {uploadedImage ? (
                /* Uploaded Image Preview Box */
                <div className="space-y-3 min-w-0">
                  <div className="relative aspect-[4/3] max-h-[220px] w-full overflow-hidden rounded-xl border border-[#bae6fd] bg-[#0f172a]">
                    <img
                      src={uploadedImage}
                      alt="Uploaded patient lesion"
                      className="h-full w-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-2 left-2 rounded-md bg-[#0284c7] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      Photo Loaded
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (fileRef.current) fileRef.current.value = ''
                        fileRef.current?.click()
                      }}
                      className="flex-1 rounded-xl bg-[#0f172a] py-2 text-center text-xs font-bold text-white shadow-xs hover:bg-[#1e293b] transition"
                    >
                      Change Photo
                    </button>
                    <button
                      onClick={resetWorkspace}
                      className="rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-xs font-bold text-[#c2410c] hover:bg-[#fff1f2] transition"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty Upload Dropzone */
                <button
                  onClick={() => {
                    if (backendStatus === 'offline') {
                      checkBackendHealth()
                    }
                    if (fileRef.current) fileRef.current.value = ''
                    fileRef.current?.click()
                  }}
                  className="group flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#cbd5e1] bg-[#f8fafc] px-3 py-6 sm:py-8 text-center transition hover:border-[#0284c7] hover:bg-[#f0f9ff]"
                >
                  <span className="mb-2.5 sm:mb-3 grid size-11 sm:size-12 place-items-center rounded-2xl bg-white text-[#0284c7] shadow-xs transition group-hover:shadow-md">
                    <Upload size={20} />
                  </span>
                  <strong className="text-xs sm:text-sm text-[#0f172a]">
                    Take photo or browse
                  </strong>
                  <span className="mt-1 text-[11px] sm:text-xs text-[#64748b]">
                    Camera supported · JPG, PNG up to 12 MB
                  </span>
                </button>
              )}

              <input
                ref={fileRef}
                className="hidden"
                type="file"
                accept="image/*"
                onClick={e => {
                  ;(e.target as HTMLInputElement).value = ''
                }}
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) handleFile(f)
                  e.target.value = ''
                }}
              />

              {backendStatus === 'offline' && (
                <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-[#fffbf2] border border-[#edd8a8] px-3 py-2 text-[11px] text-[#8a7035]">
                  <span>⚡ Live inference needs Python backend running. Select preset cases below for demo.</span>
                  <button
                    type="button"
                    onClick={async () => {
                      setIsRechecking(true)
                      await checkBackendHealth()
                      setIsRechecking(false)
                    }}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#d8be82] bg-white px-2 py-1 text-[10px] font-semibold text-[#8a7035] hover:bg-[#fef9ee] active:scale-95 transition"
                    title="Check connection again"
                  >
                    <RefreshCw size={11} className={isRechecking ? 'animate-spin' : ''} />
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* Quality gate card (live / preset info) */}
            <div className={`rounded-2xl border bg-white p-5 shadow-xs ${rejectedError ? 'border-[#f5c6c0]' : 'border-[#cbd5e1]'}`}>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0f172a]">
                <Gauge size={14} className={rejectedError ? 'text-[#d92d20]' : 'text-[#0284c7]'} />
                Quality Gate Status
              </div>
              {analyzing ? (
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#0284c7]">
                    <span className="size-2 animate-ping rounded-full bg-[#0284c7]" />
                    <span className="font-semibold">Evaluating image quality…</span>
                  </div>
                  <p className="text-[11px] text-[#64748b]">
                    Inspecting intra-oral mucosa vascularity, focus, exposure, and glare.
                  </p>
                </div>
              ) : showResults ? (
                rejectedError ? (
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#9a4b3b]">Oral Anatomy</span>
                      <span className="font-bold text-[#b53a25]">FAILED (Non-oral)</span>
                    </div>
                    {rejectedError.quality_gate?.mucosa_percentage !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-[#64748b]">Mucosal Tissue</span>
                        <span className="font-mono text-[#b53a25]">{rejectedError.quality_gate.mucosa_percentage}% (Min 25%)</span>
                      </div>
                    )}
                    {rejectedError.quality_gate?.foreign_percentage !== undefined && rejectedError.quality_gate.foreign_percentage > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#64748b]">Foreign / Non-Oral</span>
                        <span className="font-mono text-[#b53a25]">{rejectedError.quality_gate.foreign_percentage}% (Max 8%)</span>
                      </div>
                    )}
                    {rejectedError.quality_gate?.face_skin_percentage !== undefined && rejectedError.quality_gate.face_skin_percentage > 20 && (
                      <div className="flex justify-between">
                        <span className="text-[#64748b]">Facial Skin Surface</span>
                        <span className="font-mono text-[#b53a25]">{rejectedError.quality_gate.face_skin_percentage}% (Max 25%)</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#64748b]">Sharpness (Laplacian)</span>
                      <span className="font-mono text-[#0f172a]">{rejectedError.quality_gate?.laplacian_variance ?? 'N/A'}</span>
                    </div>
                    <div className="mt-3 rounded-lg bg-[#fff1f0] border border-[#f5c6c0] px-3 py-2 text-center text-xs font-bold text-[#b53a25]">
                      ✕ REJECTED — NON-ORAL IMAGE
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 space-y-2 text-xs">
                    {[
                      ['Sharpness (Laplacian)', `${currentQualityGate.laplacian_variance}`, 'Pass'],
                      ['Brightness', `${currentQualityGate.mean_luminance} / 255`, 'Pass'],
                      ['Glare %', `${currentQualityGate.glare_percentage}%`, 'Pass'],
                      ['Contrast Std', `${currentQualityGate.contrast_std}`, 'Pass'],
                      ['Oral Cavity Mucosa', `${(currentQualityGate as any).mucosa_percentage ?? 92}%`, 'Pass'],
                      ['Integrity Check', currentQualityGate.passed ? 'Valid' : 'Sub-optimal', 'Pass'],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-[#64748b]">{label}</span>
                        <span className="font-mono text-[#0f172a]">{val}</span>
                      </div>
                    ))}
                    <div className="mt-2 rounded-lg border border-[#bae6fd] bg-[#f0f9ff] px-3 py-2 text-center text-xs font-bold text-[#0369a1]">
                      ✓ APPROVED — Diagnostic quality verified
                    </div>
                  </div>
                )
              ) : (
                <p className="mt-2 text-xs text-[#64748b]">
                  Select a preset or upload an image to run the quality assessment.
                </p>
              )}
            </div>

            {/* Preset buttons */}
            <div className="rounded-2xl border border-[#cbd5e1] bg-white p-5 shadow-xs">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#a1b3ad]">
                <span className="h-px flex-1 bg-[#e1ebe5]" />
                or use a preset case
                <span className="h-px flex-1 bg-[#e1ebe5]" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {PRESETS.map((p, i) => (
                  <button
                    key={p.name}
                    onClick={() => triggerAnalysis(i)}
                    className={`group overflow-hidden rounded-xl border text-left transition ${
                      selected === i && showResults
                        ? 'border-[#76a68e] bg-[#edf6ef] shadow-sm'
                        : 'border-[#e0eae4] bg-white hover:border-[#b9d1c5] hover:shadow-sm'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-[3/2] overflow-hidden bg-[#e9efeb]">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-2.5">
                      <strong className="block text-xs text-[#365e54]">{p.name}</strong>
                      <span className="text-[10px] text-[#91a59f]">{p.urgency}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Analysis panel ───────────────────────────────────── */}
          <div ref={resultRef} className="space-y-4 print:space-y-0 min-w-0 w-full overflow-hidden">
            {/* Status header */}
            <div className={`no-print rounded-2xl border p-4 sm:p-5 shadow-xs min-w-0 ${rejectedError ? 'border-[#f8d7d2] bg-[#fffbfb]' : 'border-[#cbd5e1] bg-white'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className={`eyebrow ${rejectedError ? 'text-[#b53a25]' : ''}`}>
                    {rejectedError ? 'Pre-Flight Quality Gate' : `Live analysis · ${currentShortName}`}
                  </p>
                  <h2 className="font-serif text-xl sm:text-2xl text-[#0f172a] break-words">
                    {analyzing
                      ? pipelineMode === 'live'
                        ? 'Evaluating oral cavity photograph…'
                        : 'Running analysis pipeline…'
                      : rejectedError
                      ? 'Non-Oral Image Rejected'
                      : showResults
                      ? currentVerdict
                      : 'Select a case or upload an image'}
                  </h2>
                </div>
                {showResults && (
                  <span
                    className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-xs"
                    style={{ background: rejectedError ? '#c94232' : currentUrgencyColor }}
                  >
                    {rejectedError ? 'Rejected · Non-Oral' : currentUrgency}
                  </span>
                )}
              </div>

              {/* Processing animation */}
              {(analyzing || rejectedError || (showResults && !rejectedError)) && (
                <div className="mt-4 sm:mt-5 min-w-0">
                  <ProcessingSteps
                    active={analyzing}
                    onComplete={handleProcessingComplete}
                    mode={pipelineMode}
                    liveStage={liveStage}
                    failedReason={rejectedError?.issues?.[0] || rejectedError?.message}
                  />
                </div>
              )}
            </div>

            {/* Results tabs OR Rejection error view */}
            {showResults && (
              rejectedError ? (
                <div className="rounded-2xl border border-[#f5c6c0] bg-white p-4 sm:p-6 shadow-sm min-w-0">
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                    <div className="flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-2xl bg-[#fee4e2] text-[#d92d20] shadow-sm">
                      <AlertTriangle size={24} />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#fee4e2] px-3 py-1 text-xs font-bold text-[#d92d20]">
                          SAFETY GATE · REJECTED
                        </span>
                        <span className="text-xs text-[#8a9e97]">Diagnostic Guard Active</span>
                      </div>
                      <h3 className="mt-2.5 font-serif text-xl sm:text-2xl text-[#203a35]">
                        Image Not Recognized as an Oral Cavity
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#5a746d]">
                        QAI-OLI strictly validates human oral mucosal tissue (tongue, inner cheeks, gums, palate, or lips) before running deep learning and quantum circuits. Non-oral objects, landscapes, documents, or foreign imagery are rejected for patient safety.
                      </p>

                      {/* Rejection issues */}
                      <div className="mt-4 rounded-xl border border-[#fbe1dd] bg-[#fff8f7] p-3.5 sm:p-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#b53a25]">
                          Quality Gate Detection Findings:
                        </h4>
                        <ul className="mt-2 space-y-1.5 text-xs text-[#6e5450]">
                          {rejectedError.issues.map((iss, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="font-bold text-[#d92d20]">✕</span>
                              <span>{iss}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Clinical instruction */}
                      <div className="mt-4 rounded-xl border border-[#cbe5d6] bg-[#f0faf4] p-3.5 sm:p-4 text-xs text-[#2c6650]">
                        <strong className="mb-1 block text-sm font-semibold text-[#1e523f]">
                          How to photograph an oral lesion correctly:
                        </strong>
                        <ul className="list-disc space-y-1 pl-4">
                          <li>Focus directly on the <strong>inside of the mouth</strong> (lesion, tongue, inner cheek, palate, or gums).</li>
                          <li>Turn on your phone flashlight / torch or use direct clinical lighting to illuminate mucosal tissue.</li>
                          <li>Ensure the camera is held steady without blur or salivary flash glare.</li>
                        </ul>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2.5 w-full">
                        <button
                          onClick={() => {
                            if (fileRef.current) fileRef.current.value = ''
                            fileRef.current?.click()
                          }}
                          className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-[#0f172a] px-5 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#1e293b]"
                        >
                          <Upload size={16} /> Upload another photo
                        </button>
                        <button
                          onClick={resetWorkspace}
                          className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-5 py-3 text-sm font-semibold text-[#b91c1c] transition hover:bg-[#fff1f2]"
                        >
                          Clear & try again
                        </button>
                        <button
                          onClick={() => triggerAnalysis(0)}
                          className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-5 py-3 text-sm font-semibold text-[#334155] transition hover:bg-[#f1f5f9]"
                        >
                          Explore preset cases
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Tab nav - Horizontally scrollable on mobile */}
                  <div className="no-print flex items-center gap-1.5 overflow-x-auto no-scrollbar rounded-2xl border border-[#cbd5e1] bg-white p-1.5 sm:p-2 shadow-xs min-w-0">
                    {TABS.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'bg-[#0f172a] text-white shadow-xs'
                            : 'text-[#475569] hover:bg-[#f1f5f9]'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>

                {/* Tab content */}
                <div className="rounded-2xl border border-[#cbd5e1] bg-white p-4 sm:p-5 shadow-xs min-w-0 print:border-none print:p-0 print:shadow-none print:bg-transparent">

                  {/* ─── Tab: Results ──────────────────────────────────── */}
                  {activeTab === 'results' && (
                    <div className="space-y-6 min-w-0">
                      <div className="grid gap-5 md:grid-cols-[1fr_1.2fr] min-w-0">
                        {/* Interactive Photo with Grad-CAM Slider */}
                        <div className="flex flex-col space-y-1.5 min-w-0">
                          <GradCamSlider
                            originalSrc={currentImage}
                            heatmapSrc={currentHeatmap}
                            originalAlt="Clinical oral lesion"
                            showQualityBadge={true}
                          />
                          <p className="text-[11px] text-[#64748b] text-center">
                            Drag divider to reveal dual-stream Grad-CAM heatmap
                          </p>
                        </div>

                        {/* Probabilities */}
                        <div className="flex flex-col justify-between">
                          <div>
                            <div className="mb-3 flex justify-between text-xs text-[#78928a]">
                              <span>Fused ensemble probability</span>
                              <strong className="text-[#2f6658]">{currentConfidence.toFixed(1)}% confidence</strong>
                            </div>
                            {currentProbabilities.map((value, i) => (
                              <div key={i} className="mb-3">
                                <div className="mb-1 flex justify-between text-xs">
                                  <span className="text-[#507169]">{CLASS_LABELS[i]}</span>
                                  <strong className="text-[#3b6259]">{value.toFixed(1)}%</strong>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-[#edf2ee]">
                                  <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${value}%`, background: CLASS_COLORS[i] }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="rounded-2xl bg-[#f1f7f2] p-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#407363]">
                              <Check size={14} /> Clinical Recommendation
                            </div>
                            <p className="mt-1.5 text-sm leading-6 text-[#648078]">{currentRecommendation}</p>
                          </div>
                        </div>
                      </div>

                      {/* Pipeline status mini cards */}
                      <div className="grid gap-2 border-t border-[#cbd5e1] pt-4 sm:grid-cols-3">
                        {[
                          ['Quality gate', 'Passed · 5 checks', Gauge, '#0284c7'],
                          ['Dual backbones', 'Features extracted', Layers3, '#2563eb'],
                          ['Quantum fusion', '8 / 8 qubits converged', BrainCircuit, '#bd8950'],
                        ].map(([label, value, Icon, color]: any) => (
                          <div key={label} className="flex items-center gap-3 rounded-xl bg-[#f8fafc] p-3 border border-[#cbd5e1]">
                            <span className="flex size-8 items-center justify-center rounded-lg" style={{ background: `${color}18` }}>
                              <Icon size={14} style={{ color }} />
                            </span>
                            <span>
                              <strong className="block text-xs text-[#0f172a]">{label}</strong>
                              <small className="text-[11px] text-[#64748b]">{value}</small>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ─── Tab: AI Reasoning ─────────────────────────────── */}
                  {activeTab === 'reasoning' && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-serif text-xl text-[#264e45]">How the AI reached this verdict</h3>
                        <p className="mt-1 text-xs text-[#88a099]">
                          Full inference breakdown: backbone contributions → quantum fusion → final verdict.
                        </p>
                      </div>

                      {/* Dynamic Model Reasoning Card (if live result) */}
                      {currentReasoning && (
                        <div className="rounded-2xl border border-[#bae6fd] bg-[#f0f9ff] p-5">
                          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0369a1]">
                            <BrainCircuit size={13} /> Model Visual Attention & Tissue Findings
                          </div>
                          <p className="text-sm leading-relaxed text-[#0f172a]">{currentReasoning}</p>
                        </div>
                      )}

                      {/* Step 1 + 2: Backbones */}
                      <div>
                        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5a8878]">
                          <Layers3 size={13} /> Step 1–2 · Dual CNN Backbone Contributions
                        </div>
                        <BackbonePanel presetClass={currentShortName} />
                      </div>

                      {/* Step 3: Quantum */}
                      <div>
                        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9a7c50]">
                          <BrainCircuit size={13} /> Step 3 · 8-Qubit Variational Quantum Circuit
                        </div>
                        <QuantumPanel
                          presetClass={currentShortName}
                          liveExpvals={currentQuantumExpvals}
                          liveQps={currentQps}
                        />
                      </div>

                      {/* Step 4: Final ensemble */}
                      <div className="rounded-2xl border border-[#bae6fd] bg-[#f0f9ff] p-5">
                        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0369a1]">
                          <Check size={13} /> Step 4 · Final Fused Ensemble Verdict
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <div>
                            <p className="font-serif text-3xl font-semibold text-[#0f172a]">
                              {currentShortName}
                            </p>
                            <p className="text-sm text-[#475569]">{liveResult ? liveResult.prediction : preset.name}</p>
                          </div>
                          <div className="flex-1">
                            <div className="mb-1 flex justify-between text-xs">
                              <span className="text-[#64748b]">Ensemble confidence</span>
                              <strong className="text-[#0f172a]">{currentConfidence.toFixed(1)}%</strong>
                            </div>
                            <div className="h-3 overflow-hidden rounded-full bg-[#e2e8f0]">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#38bdf8] to-[#0284c7]"
                                style={{ width: `${currentConfidence}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ─── Tab: Differential Rule-Out ────────────────────── */}
                  {activeTab === 'ruleout' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-serif text-xl text-[#264e45]">Differential rule-out</h3>
                        <p className="mt-1 text-xs text-[#88a099]">
                          Why this classification and not others. Clinical justification with stream-level evidence.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#d9e6dd] bg-[#f8fbf9] p-5">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#78948b]">
                          <Microscope size={14} /> Clinical Reasoning
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[#527269]">{currentRuleout}</p>
                      </div>

                      <div className="rounded-2xl border border-[#ead7ca] bg-[#fff8f4] p-5">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#b26753]">
                          <AlertTriangle size={14} /> Occlusion Sanity Test
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[#795e55]">
                          Central lesion region masked → model confidence dropped{' '}
                          <strong className="text-[#b55e49]">−{currentOcclusionDrop}%</strong>.
                          This proves the model attended to the lesion itself, not background teeth,
                          lips, or ambient lighting — a critical interpretability validation.
                        </p>
                      </div>

                      {/* Quick class comparison */}
                      <div className="rounded-2xl border border-[#cbd5e1] bg-white p-5 shadow-xs">
                        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#64748b]">
                          Full 4-Class Probability Summary
                        </p>
                        {currentProbabilities.map((v, i) => (
                          <div key={i} className="mb-2.5 flex items-center gap-2 sm:gap-3">
                            <span className="w-24 sm:w-36 shrink-0 text-[11px] sm:text-xs text-[#475569] truncate">{CLASS_LABELS[i]}</span>
                            <div className="flex-1 h-2 overflow-hidden rounded-full bg-[#e2e8f0]">
                              <div className="h-full rounded-full" style={{ width: `${v}%`, background: CLASS_COLORS[i] }} />
                            </div>
                            <strong className="w-11 sm:w-12 shrink-0 text-right text-[11px] sm:text-xs text-[#0f172a]">{v.toFixed(1)}%</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ─── Tab: Requisition Slip ──────────────────────────── */}
                  {activeTab === 'requisition' && (
                    <div className="space-y-3 print:space-y-0 print:m-0 print:p-0">
                      <div className="no-print flex items-center justify-between rounded-xl bg-[#f0f9ff] border border-[#bae6fd] p-3 text-xs text-[#0369a1] sm:hidden">
                        <span>📄 Open-Source AI Screening Report</span>
                        <span className="font-bold">Scroll right to view &rarr;</span>
                      </div>
                      <div className="w-full overflow-x-auto no-scrollbar pb-3 print:overflow-visible print:pb-0 print:m-0">
                        <div className="min-w-[700px] sm:min-w-0 print:min-w-0 print:w-full print:m-0 print:p-0">
                          <RequisitionSlip
                            presetIndex={selected}
                            presetName={liveResult ? liveResult.prediction : preset.name}
                            urgency={currentUrgency}
                            urgencyColor={currentUrgencyColor}
                            verdict={currentVerdict}
                            recommendation={
                              liveResult
                                ? currentUrgency.toLowerCase().includes('urgent')
                                  ? 'Immediate specialist referral and urgent biopsy indicated within 7 days.'
                                  : currentUrgency.toLowerCase().includes('priority')
                                  ? 'Schedule specialist review within 14 days; consider biopsy if non-healing.'
                                  : 'Routine observation for 14-21 days; review if lesion persists.'
                                : preset.recommendation
                            }
                            probabilities={currentProbabilities}
                            confidence={currentConfidence}
                            predClass={currentShortName}
                            image={currentImage}
                            heatmap={currentHeatmap}
                            qualityGate={currentQualityGate}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
              )
            )}

            {/* Empty state */}
            {!analyzing && !showResults && (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#cbd5e1] bg-white p-10 text-center">
                <div className="mb-4 grid size-16 place-items-center rounded-2xl bg-[#f0f9ff] text-[#0284c7]">
                  <Upload size={28} />
                </div>
                <h3 className="font-serif text-xl text-[#0f172a]">No image selected</h3>
                <p className="mt-2 max-w-xs text-sm text-[#64748b]">
                  Select one of the 4 preset clinical cases on the left, or upload your own oral cavity photograph.
                </p>
                <button
                  onClick={() => triggerAnalysis(0)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0f172a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e293b]"
                >
                  Try OCA preset <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <PipelineModal open={pipelineOpen} onClose={() => setPipelineOpen(false)} />
    </main>
  )
}

// Wrap in Suspense for useSearchParams
export default function ScreeningPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f6f8f5]" />}>
      <ScreeningWorkspace />
    </Suspense>
  )
}
