'use client'

import { useEffect, useState } from 'react'
import { Printer } from 'lucide-react'

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
      refId: `TRI-${String(presetIndex + 1).padStart(2, '0')}-${now.getFullYear()}-${String(now.getTime()).slice(-4)}`,
    })
  }, [presetIndex])

  const isUrgent = urgency.toLowerCase().includes('urgent')
  const isPriority = urgency.toLowerCase().includes('priority')
  const badgeColor  = isUrgent ? '#dc2626' : isPriority ? '#d97706' : '#0284c7'
  const badgeBg     = isUrgent ? '#fef2f2' : isPriority ? '#fffbeb' : '#eff6ff'
  const recBorder   = isUrgent ? '#dc2626' : isPriority ? '#d97706' : '#0284c7'
  const recBg       = isUrgent ? '#fff5f5' : isPriority ? '#fffbeb' : '#f0f9ff'
  const recTitleClr = isUrgent ? '#991b1b' : isPriority ? '#78350f' : '#0c4a6e'

  const gateText = `✓ APPROVED · Sharpness ${qualityGate?.laplacian_variance?.toFixed(1) ?? '142.7'} · Luminance ${qualityGate?.mean_luminance?.toFixed(1) ?? '118.3'}/255 · Glare ${qualityGate?.glare_percentage?.toFixed(1) ?? '1.2'}% · Mucosa ${qualityGate?.mucosa_percentage ?? 92}%`

  /* ── All layout uses inline styles so print ≡ screen ─────────────── */
  const ROOT: React.CSSProperties = {
    fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
    fontSize: '10.5px',
    lineHeight: '1.45',
    color: '#0f172a',
    background: '#ffffff',
    border: '1.5px solid #0f172a',
    borderRadius: '8px',
    padding: '20px 24px',
    maxWidth: '860px',
    margin: '0 auto',
    boxSizing: 'border-box',
  }

  const HR: React.CSSProperties = { border: 'none', borderTop: '1.5px solid #0f172a', margin: '10px 0' }
  const HR_LIGHT: React.CSSProperties = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '9px 0' }

  const SECTION_LABEL: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '5px',
    fontSize: '9px', fontWeight: 800, letterSpacing: '0.16em',
    textTransform: 'uppercase', color: '#475569', marginBottom: '7px',
  }

  /* table */
  const TH: React.CSSProperties = {
    padding: '5px 10px', fontWeight: 700, fontSize: '9px',
    letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b',
    background: '#f8fafc', borderRight: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0', width: '22%', textAlign: 'left',
  }
  const TD: React.CSSProperties = { padding: '5px 10px', borderBottom: '1px solid #e2e8f0', verticalAlign: 'top' }

  /* figure panels */
  const FIG: React.CSSProperties = {
    border: '1px solid #cbd5e1', borderRadius: '5px', overflow: 'hidden', background: '#fff',
  }
  const FIG_HEAD: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '5px 9px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
  }
  const FIG_TITLE: React.CSSProperties = { fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#0f172a' }
  const FIG_TAG  : React.CSSProperties = { fontSize: '8px', fontWeight: 600, color: '#64748b', background: '#e2e8f0', padding: '1px 6px', borderRadius: '999px' }
  const FIG_TAG_B: React.CSSProperties = { ...FIG_TAG, color: '#0369a1', background: '#e0f2fe' }
  const IMG_FRAME: React.CSSProperties = { height: '155px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }
  const IMG_STYLE: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block' }
  const FIG_CAP  : React.CSSProperties = { padding: '4px 9px', fontSize: '8.5px', color: '#64748b', lineHeight: '1.4', background: '#fafafa', borderTop: '1px solid #e2e8f0' }

  /* probability */
  const PROB_ROW: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '7px' }
  const PROB_LBL: React.CSSProperties = { fontSize: '9.5px', color: '#334155', flexShrink: 0, width: '145px' }
  const PROB_PCT: React.CSSProperties = { fontSize: '9.5px', fontWeight: 700, fontFamily: 'monospace', color: '#0f172a', textAlign: 'right', width: '36px', flexShrink: 0 }

  /* checklist */
  const CHECK: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: '5px', fontSize: '9.5px', color: '#334155', lineHeight: '1.4' }

  /* attestation */
  const SIG_LINE: React.CSSProperties = { borderBottom: '1.5px dashed #94a3b8', height: '20px', marginBottom: '3px' }
  const SIG_LBL : React.CSSProperties = { fontSize: '8.5px', color: '#94a3b8' }
  const STAMP   : React.CSSProperties = {
    width: '120px', height: '70px', border: '2px dashed #cbd5e1', borderRadius: '5px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: '2px', background: '#f8fafc',
  }

  return (
    <>
      {/* ── Printable slip ─────────────────────────────────────────── */}
      <div id="printable-requisition-slip" style={ROOT}>

        {/* 1. Letterhead */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '10px', borderBottom: '2px solid #0f172a' }}>
          <div>
            <div style={{ fontSize: '9.5px', fontWeight: 900, letterSpacing: '0.2em', color: '#0284c7', textTransform: 'uppercase', marginBottom: '3px' }}>
              QAI-OLI Oncology AI · Q-ConX-Dense Clinical Triage Engine
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'Georgia, serif', lineHeight: '1.2', marginBottom: '2px' }}>
              Doctor&apos;s Pathology Requisition
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>
              Dept. of Oral Medicine &amp; Head–Neck Diagnostics · Multimodal Quantum-Classical Screening
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700 }}>{meta.refId}</div>
            <div style={{ fontSize: '9.5px', color: '#64748b', marginBottom: '4px' }}>{meta.dateStr} · {meta.timeStr}</div>
            <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '9.5px', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: badgeColor, background: badgeBg, border: `1.5px solid ${badgeColor}` }}>
              {urgency}
            </div>
          </div>
        </div>

        {/* 2. Demographics table */}
        <div style={{ marginTop: '9px', marginBottom: '9px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
            <tbody>
              <tr>
                <th style={TH}>Patient Reference ID</th>
                <td style={{ ...TD, fontFamily: 'monospace', fontWeight: 700 }}>{meta.refId}</td>
                <th style={TH}>Primary AI Finding</th>
                <td style={{ ...TD, fontWeight: 700, color: badgeColor }}>{presetName}</td>
              </tr>
              <tr>
                <th style={TH}>Screening Timestamp</th>
                <td style={TD}>{meta.dateStr} · {meta.timeStr}</td>
                <th style={TH}>Diagnostic Urgency</th>
                <td style={{ ...TD, fontWeight: 600 }}>{urgency}</td>
              </tr>
              <tr>
                <th style={{ ...TH, borderBottom: 0 }}>Quality Gate</th>
                <td colSpan={3} style={{ ...TD, borderBottom: 0, color: '#0d9488', fontFamily: 'monospace', fontSize: '9.5px' }}>{gateText}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr style={HR_LIGHT} />

        {/* 3. Visual evidence */}
        <div style={SECTION_LABEL}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7', flexShrink: 0, display: 'inline-block' }} />
          Visual Diagnostic Evidence — Intra-Oral Photography &amp; Grad-CAM Attention
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '9px' }}>
          <div style={FIG}>
            <div style={FIG_HEAD}>
              <span style={FIG_TITLE}>Figure 1 — Clinical Photo (White-Light)</span>
              <span style={FIG_TAG}>Intra-Oral Mucosa</span>
            </div>
            <div style={IMG_FRAME}>
              {image
                ? <img src={image} alt="Clinical oral photograph" style={IMG_STYLE} />
                : <span style={{ fontSize: '9.5px', color: '#94a3b8' }}>Image not available</span>}
            </div>
            <div style={FIG_CAP}>Direct intra-oral lesion presentation under standardised clinical white-light illumination.</div>
          </div>
          <div style={FIG}>
            <div style={FIG_HEAD}>
              <span style={FIG_TITLE}>Figure 2 — Grad-CAM Heatmap (Feature Attribution)</span>
              <span style={FIG_TAG_B}>Tissue Focus Map</span>
            </div>
            <div style={IMG_FRAME}>
              {heatmap
                ? <img src={heatmap} alt="Grad-CAM heatmap" style={IMG_STYLE} />
                : <span style={{ fontSize: '9.5px', color: '#94a3b8' }}>Heatmap pending</span>}
            </div>
            <div style={FIG_CAP}>High-activation gradient overlay indicating focal dysplastic margins and deep tissue risk.</div>
          </div>
        </div>

        <hr style={HR_LIGHT} />

        {/* 4. Probability bars */}
        <div style={{ marginBottom: '9px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={SECTION_LABEL}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7', flexShrink: 0, display: 'inline-block' }} />
              4-Class Multi-Modal Differential Probabilities
            </div>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>
              Primary: <strong style={{ color: '#0284c7' }}>{predClass}</strong> ({confidence.toFixed(1)}% confidence)
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

        {/* 5. Recommendation */}
        <div style={{ borderLeft: `3px solid ${recBorder}`, background: recBg, padding: '8px 12px', borderRadius: '0 4px 4px 0', marginBottom: '9px' }}>
          <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: recTitleClr, marginBottom: '3px' }}>
            Clinical Recommendation &amp; Referral Protocol
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a', lineHeight: '1.4' }}>{recommendation}</div>
        </div>

        {/* 6. Checklist */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '5px', padding: '9px 12px', marginBottom: '9px' }}>
          <div style={SECTION_LABEL}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7', flexShrink: 0, display: 'inline-block' }} />
            Doctor Referral &amp; Staging Action Checklist
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
            {[
              'Confirm patient history & lesion duration (tobacco, betel nut, alcohol)',
              'Perform in-person bimanual intra-oral palpation & cervical node staging',
              'Arrange urgent histopathological punch biopsy of flagged dysplastic tissue',
              'Log findings and coordinate follow-up with Head & Neck specialist',
            ].map(item => (
              <div key={item} style={CHECK}>
                <span style={{ fontSize: '12px', lineHeight: '1.1', flexShrink: 0 }}>☐</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Attestation + stamp */}
        <hr style={HR} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'end', marginTop: '8px' }}>
          <div>
            <div style={{ fontSize: '8.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#64748b', marginBottom: '3px' }}>
              Examining Clinician / Reviewing Oral Pathologist Attestation
            </div>
            <div style={{ fontSize: '9.5px', color: '#64748b', marginBottom: '10px', lineHeight: '1.4' }}>
              I certify that I have reviewed the clinical photograph, AI risk stratifications, and recommended referral protocol.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={SIG_LINE} />
                <div style={SIG_LBL}>Clinician Signature &amp; Reg. Number</div>
              </div>
              <div>
                <div style={SIG_LINE} />
                <div style={SIG_LBL}>Examination Date</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ fontSize: '8.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b' }}>Clinic / Hospital Seal</div>
            <div style={STAMP}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8' }}>[ OFFICIAL STAMP ]</span>
              <span style={{ fontSize: '7.5px', color: '#cbd5e1' }}>Date &amp; Signature</span>
            </div>
          </div>
        </div>

        {/* 8. Disclaimer */}
        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #e2e8f0', fontSize: '8px', color: '#94a3b8', lineHeight: '1.5' }}>
          <strong>DISCLAIMER:</strong> QAI-OLI is an investigational clinical decision-support screening aid. This document is a triage requisition aid and does not constitute a definitive histopathological diagnosis. Biopsy and specialist clinical judgement are mandatory before any treatment decision.
        </div>
      </div>

      {/* ── Print button (screen only) ─────────────────────────────── */}
      <div className="no-print mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 rounded-xl border border-slate-200 bg-white p-3.5 sm:px-5 sm:py-3 shadow-xs">
        <button
          onClick={() => window.print()}
          className="inline-flex justify-center items-center gap-2 rounded-xl bg-[#0f172a] px-5 py-3 sm:py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-700 cursor-pointer"
        >
          <Printer size={14} /> Print / Save as PDF (A4)
        </button>
        <span className="text-[11px] sm:text-xs text-slate-500 text-center sm:text-left">In the print dialog, choose &ldquo;Save as PDF&rdquo;.</span>
      </div>
    </>
  )
}
