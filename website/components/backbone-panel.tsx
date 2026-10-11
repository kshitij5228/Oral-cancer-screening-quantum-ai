'use client'

export const BACKBONE_DATA = {
  OCA: {
    convnext: { 'Oral Carcinoma': 72, 'Pre-Malignant': 18, 'Benign': 6, 'Healthy': 4 },
    densenet: { 'Oral Carcinoma': 68, 'Pre-Malignant': 15, 'Benign': 12, 'Healthy': 5 },
    convnext_focus: 'Detected persistent indurated margins, irregular depth contours, and asymmetric lesion borders characteristic of malignant invasion.',
    densenet_focus: 'Identified dense cellular architectural atypia, abnormal mucosal vascular patterns, and epithelial basement membrane breakdown.',
  },
  OPMD: {
    convnext: { 'Oral Carcinoma': 22, 'Pre-Malignant': 55, 'Benign': 14, 'Healthy': 9 },
    densenet: { 'Oral Carcinoma': 19, 'Pre-Malignant': 58, 'Benign': 13, 'Healthy': 10 },
    convnext_focus: 'Flagged surface hyperkeratosis and leukoplakic patches at tissue margins requiring clinical surveillance.',
    densenet_focus: 'Detected micro-cellular alterations, irregular epithelial keratinisation patterns, and dysplastic risk indicators.',
  },
  Benign: {
    convnext: { 'Oral Carcinoma': 8, 'Pre-Malignant': 15, 'Benign': 68, 'Healthy': 9 },
    densenet: { 'Oral Carcinoma': 5, 'Pre-Malignant': 12, 'Benign': 74, 'Healthy': 9 },
    convnext_focus: 'Observed well-defined erythematous halo, shallow ulcer contour, and balanced tissue margins typical of aphthous lesion.',
    densenet_focus: 'Cellular morphology and dense feature connectivity consistent with inflammatory, non-neoplastic reactive mucosal changes.',
  },
  Healthy: {
    convnext: { 'Oral Carcinoma': 4, 'Pre-Malignant': 6, 'Benign': 8, 'Healthy': 82 },
    densenet: { 'Oral Carcinoma': 2, 'Pre-Malignant': 4, 'Benign': 6, 'Healthy': 88 },
    convnext_focus: 'Uniform mucosal topography with no irregular margins, depth variation, or suspicious tissue architecture detected.',
    densenet_focus: 'Normal cellular density, intact epithelial maturation layers, and regular mucosal vascular loops.',
  },
}

const CLASS_COLORS: Record<string, string> = {
  'Oral Carcinoma': '#d87967',
  'Pre-Malignant': '#d5a24e',
  'Benign': '#7aa48c',
  'Healthy': '#8da9a3',
}

interface BackbonePanelProps { presetClass: keyof typeof BACKBONE_DATA }

function BackboneBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="mb-2">
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-[#507169]">{label}</span>
        <strong className="text-[#3b6259]">{value}%</strong>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#edf2ee]">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  )
}

export default function BackbonePanel({ presetClass }: BackbonePanelProps) {
  const data = BACKBONE_DATA[presetClass]
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-[#cbd5e1] bg-white p-5 shadow-xs">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#bae6fd] bg-[#e0f2fe] text-[#0284c7]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0f172a]">ConvNeXt-V2-Tiny</p>
            <p className="text-[11px] text-[#64748b]">Macro pathology · 384×384</p>
          </div>
        </div>
        <p className="mb-3 text-[11px] leading-5 text-[#475569]">{data.convnext_focus}</p>
        {(Object.entries(data.convnext) as [string, number][]).map(([cls, val]) => (
          <BackboneBar key={cls} label={cls} value={val} color={CLASS_COLORS[cls] ?? '#64748b'} />
        ))}
      </div>

      <div className="rounded-2xl border border-[#cbd5e1] bg-white p-5 shadow-xs">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#bae6fd] bg-[#e0f2fe] text-[#2563eb]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0f172a]">DenseNet-121</p>
            <p className="text-[11px] text-[#64748b]">Micro cellular morphology · Dense connectivity</p>
          </div>
        </div>
        <p className="mb-3 text-[11px] leading-5 text-[#475569]">{data.densenet_focus}</p>
        {(Object.entries(data.densenet) as [string, number][]).map(([cls, val]) => (
          <BackboneBar key={cls} label={cls} value={val} color={CLASS_COLORS[cls] ?? '#64748b'} />
        ))}
      </div>

      <div className="rounded-2xl border border-[#cbd5e1] bg-[#f8fafc] p-4 md:col-span-2 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0369a1]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3"/>
          </svg>
          Multi-Backbone Latent Fusion
        </div>
        <p className="mt-1.5 text-[11px] leading-5 text-[#607873]">
          DenseNet-121 cellular morphology and ConvNeXt-V2-Tiny macro features concatenated into a unified latent representation before 8-qubit quantum encoding.
        </p>
      </div>
    </div>
  )
}
