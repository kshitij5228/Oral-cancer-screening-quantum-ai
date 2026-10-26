import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, ArrowRight, ExternalLink, Mail, ShieldCheck } from 'lucide-react'

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
          className="relative overflow-hidden rounded-2xl border border-[#334155]/60 p-7 shadow-md"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 size-56 rounded-full bg-[#0284c7]/20 blur-[70px]" />
          <div className="relative flex gap-4">
            <ShieldCheck size={24} className="mt-0.5 shrink-0 text-[#38bdf8]" />
            <div>
              <h2 className="font-serif text-xl text-white">Clinical Decision Support — Not a Diagnosis</h2>
              <p className="mt-3 text-sm leading-7 text-[#cbd5e1]">
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
                  <li key={item} className="flex items-center gap-2 text-sm text-[#94a3b8]">
                    <span className="size-1 rounded-full bg-[#38bdf8]" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-[#64748b]">
                All AI outputs must be reviewed and confirmed by an appropriate clinician before any clinical action.
              </p>
            </div>
          </div>
        </div>

        {/* Project Authors & Research Engineering Team */}
        <div className="rounded-2xl border border-[#cbd5e1] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-[#e2e8f0]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#0284c7]">Department of Computer Engineering · ARMIET</p>
              <h2 className="font-serif text-2xl text-[#0f172a] mt-1">Project Authors &amp; Research Team</h2>
              <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                Undergraduate Capstone Research Cohort · University of Mumbai (2026–2027)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-semibold text-[#475569] border border-[#e2e8f0]">
                4 Project Authors
              </span>
            </div>
          </div>

          {/* Equal 4-Card Team Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 py-6 border-b border-[#e2e8f0]">
            {/* 1. Kshitij Nakod */}
            <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 flex flex-col justify-between hover:border-[#cbd5e1] hover:shadow-xs transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7]">Author &amp; Dev</span>
                  <span className="text-[10px] font-semibold text-[#64748b]">01</span>
                </div>
                <h3 className="font-serif text-base font-semibold text-[#0f172a] mt-1.5">Kshitij Nakod</h3>
                <p className="text-[11px] font-medium text-[#475569] mt-0.5">Quantum AI &amp; Model Lead</p>
                <p className="text-[10px] text-[#94a3b8] mt-1 leading-snug">Computer Engineering, ARMIET</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e2e8f0]">
                <a
                  href="https://github.com/kshitij5228"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full rounded-lg bg-white border border-[#cbd5e1] px-2.5 py-1.5 text-xs font-semibold text-[#0f172a] hover:bg-[#f1f5f9] transition"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    kshitij5228
                  </span>
                  <ExternalLink size={11} className="text-[#94a3b8]" />
                </a>
              </div>
            </div>

            {/* 2. Amit Chauhan */}
            <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 flex flex-col justify-between hover:border-[#cbd5e1] hover:shadow-xs transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7]">Author &amp; Dev</span>
                  <span className="text-[10px] font-semibold text-[#64748b]">02</span>
                </div>
                <h3 className="font-serif text-base font-semibold text-[#0f172a] mt-1.5">Amit Chauhan</h3>
                <p className="text-[11px] font-medium text-[#475569] mt-0.5">Model Fine-Tuning &amp; Data</p>
                <p className="text-[10px] text-[#94a3b8] mt-1 leading-snug">Computer Engineering, ARMIET</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e2e8f0]">
                <a
                  href="https://github.com/amitchn28"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full rounded-lg bg-white border border-[#cbd5e1] px-2.5 py-1.5 text-xs font-semibold text-[#0f172a] hover:bg-[#f1f5f9] transition"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    amitchn28
                  </span>
                  <ExternalLink size={11} className="text-[#94a3b8]" />
                </a>
              </div>
            </div>

            {/* 3. Manoj Yadav */}
            <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 flex flex-col justify-between hover:border-[#cbd5e1] hover:shadow-xs transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7]">Author &amp; Dev</span>
                  <span className="text-[10px] font-semibold text-[#64748b]">03</span>
                </div>
                <h3 className="font-serif text-base font-semibold text-[#0f172a] mt-1.5">Manoj Yadav</h3>
                <p className="text-[11px] font-medium text-[#475569] mt-0.5">Full-Stack &amp; Web Systems</p>
                <p className="text-[10px] text-[#94a3b8] mt-1 leading-snug">Computer Engineering, ARMIET</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e2e8f0]">
                <a
                  href="https://github.com/Spmanoj593"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full rounded-lg bg-white border border-[#cbd5e1] px-2.5 py-1.5 text-xs font-semibold text-[#0f172a] hover:bg-[#f1f5f9] transition"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    Spmanoj593
                  </span>
                  <ExternalLink size={11} className="text-[#94a3b8]" />
                </a>
              </div>
            </div>

            {/* 4. Sahil Khadkar */}
            <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 flex flex-col justify-between hover:border-[#cbd5e1] hover:shadow-xs transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7]">Author &amp; Dev</span>
                  <span className="text-[10px] font-semibold text-[#64748b]">04</span>
                </div>
                <h3 className="font-serif text-base font-semibold text-[#0f172a] mt-1.5">Sahil Khadkar</h3>
                <p className="text-[11px] font-medium text-[#475569] mt-0.5">Explainable AI &amp; Testing</p>
                <p className="text-[10px] text-[#94a3b8] mt-1 leading-snug">Computer Engineering, ARMIET</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e2e8f0]">
                <a
                  href="https://github.com/sahilkhadkar2005-bit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full rounded-lg bg-white border border-[#cbd5e1] px-2.5 py-1.5 text-xs font-semibold text-[#0f172a] hover:bg-[#f1f5f9] transition"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    sahilkhadkar2005-bit
                  </span>
                  <ExternalLink size={11} className="text-[#94a3b8]" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mt-6">
            <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">GitHub Repository &amp; Source Code</p>
              <div className="mt-2 flex items-center gap-2">
                <a
                  href="https://github.com/kshitij5228/Oral-cancer-screening-quantum-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs sm:text-sm font-semibold text-[#0284c7] hover:underline inline-flex items-center gap-1.5"
                >
                  kshitij5228/Oral-cancer-screening-quantum-ai
                  <ExternalLink size={12} />
                </a>
              </div>
              <p className="mt-2 text-xs text-[#64748b] leading-relaxed">
                Explore the QAI-OLI open codebase, multi-modal pipeline architecture, and comprehensive documentation reports.
              </p>
            </div>

            <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">Model Weights &amp; Research Access</p>
              <div className="mt-2 flex items-center gap-2">
                <a
                  href="mailto:nakod.kshitij5228@gmail.com"
                  className="font-mono text-xs sm:text-sm font-semibold text-[#0284c7] hover:underline inline-flex items-center gap-1.5"
                >
                  nakod.kshitij5228@gmail.com
                  <Mail size={12} />
                </a>
              </div>
              <p className="mt-2 text-xs text-[#64748b] leading-relaxed">
                Trained checkpoints are maintained under institutional governance. Contact directly with your affiliation for academic weight access.
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
