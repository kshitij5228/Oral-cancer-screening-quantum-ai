'use client'

export const QUANTUM_DATA = {
  OCA:     { expvals: [-0.84, 0.83, -0.71, 0.62, -0.58, 0.77, -0.43, 0.39], qps: 0.6392 },
  OPMD:    { expvals: [0.71, -0.68, 0.53, -0.44, 0.82, -0.39, 0.61, -0.55], qps: 0.5963 },
  Benign:  { expvals: [0.42, -0.18, 0.67, 0.11, -0.34, 0.53, 0.28, -0.09], qps: 0.3275 },
  Healthy: { expvals: [0.12, 0.08, -0.15, 0.19, 0.07, -0.11, 0.14, 0.09], qps: 0.1188 },
}

interface QuantumPanelProps {
  presetClass: keyof typeof QUANTUM_DATA
  liveExpvals?: number[]
  liveQps?: number
}

function QubitGauge({ index, value }: { index: number; value: number }) {
  const pct = ((value + 1) / 2) * 100
  const isPositive = value >= 0
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative size-12">
        <svg viewBox="0 0 40 40" className="size-full -rotate-90">
          <circle cx="20" cy="20" r="15" fill="none" stroke="#e8ddd0" strokeWidth="3" />
          <circle cx="20" cy="20" r="15" fill="none" stroke={isPositive ? '#c38148' : '#7aa48c'} strokeWidth="3"
            strokeDasharray={`${pct * 0.942} 94.2`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[#4a5c57]">
          {value > 0 ? '+' : ''}{value.toFixed(2)}
        </span>
      </div>
      <span className="text-[9px] font-semibold text-[#a58a70]">{'<Z'}{index + 1}{'>'}</span>
    </div>
  )
}

export default function QuantumPanel({ presetClass, liveExpvals, liveQps }: QuantumPanelProps) {
  const defaults = QUANTUM_DATA[presetClass]
  const expvals = liveExpvals ?? defaults.expvals
  const qps = liveQps ?? defaults.qps
  const qpsPercent = Math.round(qps * 100)

  return (
    <div className="rounded-2xl border border-[#e3d7c6] bg-[#fffaf1] p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f8e7c9] text-[#bd8950]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#70533b]">8-Qubit Variational Quantum Circuit</p>
          <p className="text-[11px] text-[#a58a70]">Pauli-Z expectation values · StronglyEntanglingLayers</p>
        </div>
      </div>

      <p className="mb-4 text-[11px] leading-5 text-[#876649]">
        RY angle encoding maps 256-D fused features into 8 qubit rotations. Circular CNOT entanglement detects
        cross-feature correlations that neither backbone sees independently.
      </p>

      <div className="mb-4 grid grid-cols-4 gap-3 sm:grid-cols-8">
        {expvals.map((v, i) => <QubitGauge key={i} index={i} value={v} />)}
      </div>

      <div className="rounded-xl bg-white/70 p-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-semibold text-[#987753]">Quantum Purity Score (QPS)</span>
          <strong className="text-lg text-[#765332]">{qps.toFixed(4)}</strong>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#eddcc0]">
          <div className="h-full rounded-full bg-gradient-to-r from-[#c38148] to-[#bd8950] transition-all duration-700"
            style={{ width: `${qpsPercent}%` }} />
        </div>
        <p className="mt-2 text-[10px] text-[#a58a70]">
          QPS = mean(|{'<Z_i>'}|) — interpretability metric only, not diagnostic confidence.
          Higher values indicate complex cross-feature quantum correlations.
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#e6d9c5] bg-white/50 px-4 py-2.5 text-[11px] text-[#9a7c5a]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        64-D classical residual skip concatenated → final 72-D representation (8 quantum + 64 classical)
      </div>
    </div>
  )
}
