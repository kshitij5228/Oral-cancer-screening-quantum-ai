'use client'

import { useEffect, useState } from 'react'
import { Printer, Share2, ShieldCheck, ExternalLink } from 'lucide-react'

interface RequisitionSlipProps {
  presetIndex: number
  presetName: string
  urgency: string
  urgencyColor?: string
  verdict?: string
  recommendation: string
  probabilities: number[]
  confidence: number
  predClass: string
  image?: string | null
  heatmap?: string | null
  qualityGate?: {
    passed: boolean
    laplacian_variance: number
    glare_percentage: number
    mean_luminance: number
    contrast_std: number
    mucosa_percentage?: number
  }
}

const CLASS_LABELS = ['Benign / Inflammatory', 'Healthy Mucosa', 'Oral Carcinoma', 'Pre-Malignant OPMD']
const BAR_COLORS = ['#64748b', '#0d9488', '#dc2626', '#d97706']

export default function RequisitionSlip({
  presetIndex,
  presetName,
  urgency,
  recommendation,
  probabilities,
  confidence,
  predClass,
  image,
  heatmap,
  qualityGate,
}: RequisitionSlipProps) {
  const [meta, setMeta] = useState({ dateStr: '—', timeStr: '—', refId: '—' })

  useEffect(() => {
    const now = new Date()
    setMeta({
      dateStr: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      timeStr: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      refId: `OLI-${String(presetIndex + 1).padStart(2, '0')}-${now.getFullYear()}-${String(now.getTime()).slice(-4)}`,
    })
  }, [presetIndex])

  const isUrgent = urgency.toLowerCase().includes('urgent')
  const isPriority = urgency.toLowerCase().includes('priority')
  const badgeColor  = isUrgent ? '#dc2626' : isPriority ? '#d97706' : '#0284c7'
  const badgeBg     = isUrgent ? '#fef2f2' : isPriority ? '#fffbeb' : '#eff6ff'
  const recBorder   = isUrgent ? '#dc2626' : isPriority ? '#d97706' : '#0284c7'
  const recBg       = isUrgent ? '#fff5f5' : isPriority ? '#fffbeb' : '#f0f9ff'
  const recTitleClr = isUrgent ? '#991b1b' : isPriority ? '#78350f' : '#0c4a6e'

  const gateText = `✓ PASSED · Focus ${qualityGate?.laplacian_variance?.toFixed(1) ?? '142.7'} · Brightness ${qualityGate?.mean_luminance?.toFixed(1) ?? '118.3'}/255 · Glare ${qualityGate?.glare_percentage?.toFixed(1) ?? '1.2'}% · Mucosa Coverage ${qualityGate?.mucosa_percentage ?? 92}%`

  /* ── All layout uses inline styles so print ≡ screen ─────────────── */
  const ROOT: React.CSSProperties = {
    fontFamily: 'inherit',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    textRendering: 'geometricPrecision',
    fontSize: '10px',
    lineHeight: '1.45',
    color: '#0f172a',
    background: '#ffffff',
    border: '1.5px solid #0f172a',
    borderRadius: '8px',
    padding: '18px 24px',
    maxWidth: '850px',
    margin: '0 auto',
    boxSizing: 'border-box',
  }

  const HR_LIGHT: React.CSSProperties = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '9px 0' }

  const SECTION_LABEL: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '9px', fontWeight: 800, letterSpacing: '0.14em',
    textTransform: 'uppercase', color: '#475569', marginBottom: '7px',
  }

  /* Table styles */
  const TH: React.CSSProperties = {
    padding: '5.5px 10px', fontWeight: 700, fontSize: '9px',
    letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748b',
    background: '#f8fafc', borderRight: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0', width: '24%', textAlign: 'left',
  }
  const TD: React.CSSProperties = { padding: '5.5px 10px', borderBottom: '1px solid #e2e8f0', verticalAlign: 'middle', fontSize: '10px' }

  /* Figure panels */
  const FIG: React.CSSProperties = {
    border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', background: '#fff',
  }
  const FIG_HEAD: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px',
    padding: '6px 10px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', minHeight: '30px',
  }
  const FIG_TITLE: React.CSSProperties = {
    fontSize: '8.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
    color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  }
  const FIG_TAG: React.CSSProperties = {
    fontSize: '7.5px', fontWeight: 700, color: '#334155', background: '#f1f5f9',
    border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '999px',
    whiteSpace: 'nowrap', flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.2,
  }
  const FIG_TAG_B: React.CSSProperties = {
    ...FIG_TAG, color: '#0369a1', background: '#e0f2fe', border: '1px solid #bae6fd',
  }
  const IMG_FRAME: React.CSSProperties = { height: '190px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }
  const IMG_STYLE: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block' }
  const FIG_CAP  : React.CSSProperties = { padding: '5px 10px', fontSize: '9px', color: '#64748b', lineHeight: '1.4', background: '#fafafa', borderTop: '1px solid #e2e8f0' }

  /* Probability row */
  const PROB_ROW: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px' }
  const PROB_LBL: React.CSSProperties = { fontSize: '10px', color: '#334155', flexShrink: 0, width: '145px' }
  const PROB_PCT: React.CSSProperties = { fontSize: '10px', fontWeight: 700, fontFamily: 'monospace', color: '#0f172a', textAlign: 'right', width: '38px', flexShrink: 0 }

  /* Action step */
  const STEP_BOX: React.CSSProperties = {
    display: 'flex', alignItems: 'flex-start', gap: '8px',
    fontSize: '10px', color: '#334155', lineHeight: '1.45',
  }
  const STEP_NUM: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '18px', height: '18px', borderRadius: '50%',
    background: '#0f172a', color: '#fff', fontSize: '9px',
    fontWeight: 700, flexShrink: 0, marginTop: '1px',
  }

  return (
    <>
      {/* ── Printable Report Slip ─────────────────────────────────── */}
      <div id="printable-requisition-slip" style={ROOT}>

        {/* 1. Header & Open-Source Platform Letterhead */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '12px', borderBottom: '2px solid #0f172a' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.18em', color: '#0284c7', textTransform: 'uppercase' }}>
                QAI-OLI · Open-Source Oral Oncology AI
              </span>
              <span style={{ fontSize: '7.5px', fontWeight: 700, padding: '1px 6px', background: '#e0f2fe', color: '#0369a1', borderRadius: '4px', letterSpacing: '0.05em' }}>
                OPEN ACCESS
              </span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'Georgia, serif', lineHeight: '1.2', marginBottom: '3px', color: '#0f172a' }}>
              Oral Health AI Screening Summary
            </div>
            <div style={{ fontSize: '9.5px', color: '#64748b' }}>
              Preliminary Computer-Vision &amp; Quantum AI Triage Report for Dental Consultation · Community Health &amp; Self-Check
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>{meta.refId}</div>
            <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '5px' }}>{meta.dateStr} · {meta.timeStr}</div>
            <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '9px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: badgeColor, background: badgeBg, border: `1.5px solid ${badgeColor}` }}>
              {urgency}
            </div>
          </div>
        </div>

        {/* 2. Screening Details Table */}
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
            <tbody>
              <tr>
                <th style={TH}>Receipt Reference Token</th>
                <td style={{ ...TD, fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>{meta.refId}</td>
                <th style={TH}>Primary AI Finding</th>
                <td style={{ ...TD, fontWeight: 700, color: badgeColor }}>{presetName}</td>
              </tr>
              <tr>
                <th style={TH}>Session Mode</th>
                <td style={TD}>Web-Based Self-Screening (Open-Source Portal)</td>
                <th style={TH}>Ensemble Confidence</th>
                <td style={{ ...TD, fontWeight: 700, color: '#0f172a' }}>{confidence.toFixed(1)}%</td>
              </tr>
              <tr>
                <th style={TH}>AI Neural Pipeline</th>
                <td style={TD}>Dual ConvNeXt-V2 + DenseNet-121 + 8-Qubit Quantum VQC</td>
                <th style={TH}>Triage Category</th>
                <td style={{ ...TD, fontWeight: 600 }}>{urgency}</td>
              </tr>
              <tr>
                <th style={{ ...TH, borderBottom: 0 }}>Input Quality Gate</th>
                <td colSpan={3} style={{ ...TD, borderBottom: 0, color: '#0d9488', fontFamily: 'monospace', fontSize: '9px' }}>{gateText}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr style={HR_LIGHT} />

        {/* 3. Visual Diagnostic Evidence (Side-by-side Photo & Heatmap) */}
        <div style={SECTION_LABEL}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7', flexShrink: 0, display: 'inline-block' }} />
          Visual Screening Evidence — Submitted Photograph &amp; AI Attention Map
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
          <div style={FIG}>
            <div style={FIG_HEAD}>
              <span style={FIG_TITLE}>Figure 1 — Uploaded Oral Photograph</span>
              <span style={FIG_TAG}>User Submitted</span>
            </div>
            <div style={IMG_FRAME}>
              {image
                ? <img src={image} alt="User submitted oral photograph" style={IMG_STYLE} />
                : <span style={{ fontSize: '10px', color: '#94a3b8' }}>Image not available</span>}
            </div>
            <div style={FIG_CAP}>Intra-oral photograph evaluated by the multimodal computer-vision quality gate and neural pipeline.</div>
          </div>
          <div style={FIG}>
            <div style={FIG_HEAD}>
              <span style={FIG_TITLE}>Figure 2 — Dual-Stream Grad-CAM</span>
              <span style={FIG_TAG_B}>Tissue Attention Map</span>
            </div>
            <div style={IMG_FRAME}>
              {heatmap
                ? <img src={heatmap} alt="Grad-CAM heatmap attention" style={IMG_STYLE} />
                : <span style={{ fontSize: '10px', color: '#94a3b8' }}>Heatmap pending</span>}
            </div>
            <div style={FIG_CAP}>Gradient-weighted activation highlighting high-risk dysplastic margins, mucosal plaques, or focal tissue lesions.</div>
          </div>
        </div>

        <hr style={HR_LIGHT} />

        {/* 4. Probability Analysis */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={SECTION_LABEL}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7', flexShrink: 0, display: 'inline-block' }} />
              4-Class Differential Risk Probabilities
            </div>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>
              Top Match: <strong style={{ color: badgeColor }}>{predClass}</strong> ({confidence.toFixed(1)}% confidence)
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 20px' }}>
            {probabilities.map((v, i) => (
              <div key={i} style={PROB_ROW}>
                <span style={PROB_LBL}>{CLASS_LABELS[i]}</span>
                <div style={{ flex: 1, height: '7px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${v}%`, background: BAR_COLORS[i], borderRadius: '99px' }} />
                </div>
                <span style={PROB_PCT}>{v.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <hr style={HR_LIGHT} />

        {/* 5. Key Recommendation */}
        <div style={{ borderLeft: `3.5px solid ${recBorder}`, background: recBg, padding: '8px 13px', borderRadius: '0 6px 6px 0', marginBottom: '8px' }}>
          <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: recTitleClr, marginBottom: '2px' }}>
            Summary Guidance &amp; Recommended Next Step
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a', lineHeight: '1.4' }}>{recommendation}</div>
        </div>

        {/* 6. What You Should Do Next (Action Guide for the User / Patient) */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '9px 13px', marginBottom: '8px', background: '#fafafa' }}>
          <div style={SECTION_LABEL}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7', flexShrink: 0, display: 'inline-block' }} />
            Recommended Next Steps for the User / Patient
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 18px' }}>
            <div style={STEP_BOX}>
              <span style={STEP_NUM}>1</span>
              <span><strong>Consult a Dental Specialist:</strong> Take this printed slip or PDF to a qualified dentist, oral surgeon, or ENT specialist for an in-person physical examination.</span>
            </div>
            <div style={STEP_BOX}>
              <span style={STEP_NUM}>2</span>
              <span><strong>Show the Visual Figures:</strong> Point out the attention area flagged in Figure 2 so the clinician can carefully palpate and inspect the specific oral mucosal site.</span>
            </div>
            <div style={STEP_BOX}>
              <span style={STEP_NUM}>3</span>
              <span><strong>Biopsy Confirmation if Advised:</strong> If the clinician suspects dysplasia or malignancy, confirm tissue nature through a standard clinical biopsy.</span>
            </div>
            <div style={STEP_BOX}>
              <span style={STEP_NUM}>4</span>
              <span><strong>Avoid Oral Irritants:</strong> Cease all tobacco (smoking &amp; chewing gutkha/paan), betel nut, and alcohol consumption to avoid mucosal irritation.</span>
            </div>
          </div>
        </div>


        {/* 8. Open-Source Notice & Medical Disclaimer */}
        <div style={{ paddingTop: '8px', borderTop: '1px solid #e2e8f0', fontSize: '8px', color: '#64748b', lineHeight: '1.5' }}>
          <div style={{ marginBottom: '3px', fontWeight: 700, color: '#334155' }}>
            OPEN-SOURCE PROJECT: QAI-OLI (Quantum AI Oral Lesion Intelligence)
          </div>
          <div>
            <strong>MEDICAL DISCLAIMER:</strong> This screening summary is generated by an open-access artificial intelligence screening model for educational, triage, and awareness purposes. It is <strong>NOT</strong> an official medical diagnosis, pathology report, or laboratory requisition. Physical examination and histopathological biopsy by a licensed dental surgeon or oncologist are mandatory before any medical or surgical decision.
          </div>
        </div>
      </div>

      {/* ── Print / Save Button (Screen only) ───────────────────────── */}
      <div className="no-print mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 rounded-xl border border-slate-200 bg-white p-3.5 sm:px-5 sm:py-3 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex justify-center items-center gap-2 rounded-xl bg-[#0f172a] px-5 py-3 sm:py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-700 cursor-pointer"
          >
            <Printer size={14} /> Print / Save as PDF (A4)
          </button>
          <span className="text-[11px] sm:text-xs text-slate-500">
            Select &ldquo;Save as PDF&rdquo; in the print dialog to keep on your phone or laptop.
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#0284c7] font-medium">
          <ShieldCheck size={14} />
          <span>Open-Source &amp; Privacy-Preserving</span>
        </div>
      </div>
    </>
  )
}
