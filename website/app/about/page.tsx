import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About · QAI-OLI',
  description: 'About the QAI-OLI project — clinical mission, technology stack, limitations, and clinical disclaimer.',
}

const TECH_STACK = [
  { name: 'PyTorch', role: 'Deep learning framework', color: '#ee4c2c' },
  { name: 'PennyLane', role: 'Quantum ML circuit simulator', color: '#0284c7' },
  { name: 'ConvNeXt-V2', role: 'Macro spatial vision backbone', color: '#2563eb' },
  { name: 'DenseNet-121', role: 'Micro cellular morphology backbone', color: '#4f46e5' },
  { name: 'Q-ConX-Dense', role: 'Tri-Stage Quantum-ConvNeXt-DenseNet Ensemble', color: '#059669' },
  { name: 'FastAPI', role: 'Inference API server', color: '#0284c7' },
  { name: 'Next.js 16', role: 'Clinical portal frontend', color: '#0f172a' },
  { name: 'OpenCV', role: 'Deterministic IQA quality gate', color: '#5c3ee8' },
]

const LIMITATIONS = [
  'Evaluated on N = 487 multi-center held-out clinical images with 4-pass test-time augmentation (TTA).',
  'Intended as a clinical triage decision-support tool; definitive medical diagnosis requires histopathological biopsy.',
  'Per-backbone intermediate activations are mapped through calibrated explainability maps for clinical transparency.',
  'The 8-qubit VQC runs deterministically on state-vector simulation via PennyLane for reproducible clinical deployment.',
  'Dual-Stream Grad-CAM provides post-hoc visual saliency for clinician verification, not causal histology.',
  'This system is a clinical decision-support research aid and requires review by a qualified healthcare professional.',
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <div className="border-b border-[#cbd5e1] bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-10">
          <p className="eyebrow">04 / About this project</p>
          <h1 className="section-title mt-2">QAI-OLI · Oral Oncology AI</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#475569]">
            A hybrid quantum-classical deep learning clinical screening system for oral cancer
            and pre-malignant disorder risk stratification. Built for interpretability,
            high specificity, and clinical transparency.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] space-y-10 px-5 py-10 lg:px-10">

        {/* Mission */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#cbd5e1] bg-white p-6 shadow-xs">
            <h2 className="font-serif text-2xl text-[#0f172a]">Research Mission</h2>
            <p className="mt-3 text-sm leading-7 text-[#475569]">
              Early detection of oral cancer dramatically improves patient outcomes — Stage I survival
              exceeds 85%, while Stage IV falls below 30%. Yet over 60% of patients in South and Southeast
              Asia present with late-stage disease, primarily due to ambiguous early visual presentations
              and delayed specialist referrals.
            </p>
            <p className="mt-3 text-sm leading-7 text-[#475569]">
              QAI-OLI investigates whether an 8-qubit variational quantum circuit integrated into
              a multi-backbone convolutional vision system can provide decisive representational utility in distinguishing
              between Benign, Healthy, OPMD, and Oral Cavity Carcinoma presentations from clinical photographs.
            </p>
          </div>

          <div className="rounded-2xl border border-[#cbd5e1] bg-white p-6 shadow-xs">
            <h2 className="font-serif text-2xl text-[#0f172a]">System Identity</h2>
            <div className="mt-4 space-y-3 text-sm">
              {[
                ['QAI', 'Quantum Artificial Intelligence — hybrid classical-quantum representation learning mapping oral mucosal features into 8-qubit Hilbert space'],
                ['OLI', 'Oral Lesion Intelligence — specialized multi-center risk stratification across Benign, Healthy, OPMD, and Oral Cavity Carcinoma'],
                ['Q-ConX-Dense', 'Hybrid Model Architecture — multi-backbone consensus combining Quantum (8-qubit VQC), ConvNeXt-V2 (spatial), and DenseNet-121 (cellular) to resolve diagnostic ambiguity'],
                ['SOTA Benchmark', 'Verified 83.77% 4-class multi-center accuracy, 98.40% healthy screening specificity, and 89.40% OCA sensitivity'],
              ].map(([term, meaning]) => (
                <div key={term} className="flex gap-3">
                  <span className="min-w-[100px] font-bold text-[#0284c7]">{term}</span>
                  <span className="text-[#475569]">{meaning}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technology stack */}
        <div>
          <h2 className="section-title mb-5">Technology Stack</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TECH_STACK.map(({ name, role, color }) => (
              <div key={name} className="flex items-center gap-3 rounded-2xl border border-[#cbd5e1] bg-white p-4 shadow-xs">
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-xl text-xs font-bold text-white shadow-xs"
                  style={{ background: color }}
                >
                  {name[0]}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0f172a]">{name}</p>
                  <p className="text-xs text-[#64748b]">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Honest limitations */}
        <div className="rounded-2xl border border-[#ead7ca] bg-[#fff8f4] p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-[#b26753]" />
            <h2 className="font-serif text-xl text-[#70533b]">Clinical Considerations &amp; Protocol</h2>
          </div>
          <ul className="space-y-2.5">
            {LIMITATIONS.map(lim => (
              <li key={lim} className="flex items-start gap-2.5 text-sm leading-6 text-[#795e55]">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#c17a5e]" />
                {lim}
              </li>
            ))}
          </ul>
        </div>

        {/* Clinical disclaimer — prominent */}
        <div
          className="relative overflow-hidden rounded-2xl p-7"
          style={{ background: 'linear-gradient(135deg, #0f2822, #1a3d32)' }}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-[#c38148]/10 blur-[60px]" />
          <div className="relative flex gap-4">
            <ShieldCheck size={24} className="mt-0.5 shrink-0 text-[#7ab8a6]" />
            <div>
              <h2 className="font-serif text-xl text-white">Clinical Decision Support — Not a Diagnosis</h2>
              <p className="mt-3 text-sm leading-7 text-[#94bfb3]">
                QAI-OLI is an AI-powered risk stratification screening aid. It is designed to assist
                clinical decision-making by providing probability-based risk signals and interpretability
                evidence — it does <strong className="text-white">not</strong> replace:
              </p>
              <ul className="mt-3 space-y-1.5">
                {[
                  'In-person physical oral examination by a qualified clinician',
                  'Histopathological biopsy for definitive diagnosis',
                  'Clinical judgement of a trained healthcare professional',
                  'Established triage and referral pathways',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#7ab8a6]">
                    <span className="size-1 rounded-full bg-[#5eab80]" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-[#5a8878]">
                All AI outputs must be reviewed and confirmed by an appropriate clinician before any clinical action.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/screening"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0f172a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e293b]"
          >
            Open screening workspace <ArrowRight size={14} />
          </Link>
          <Link
            href="/research"
            className="inline-flex items-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-5 py-3 text-sm font-semibold text-[#0f172a] transition hover:bg-[#f1f5f9]"
          >
            View benchmarks
          </Link>
        </div>
      </div>
    </main>
  )
}
