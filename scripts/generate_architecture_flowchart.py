import os
import subprocess
from PIL import Image

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>QAI-OLI Clean Academic Parallel Architecture Flowchart</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background-color: #FFFFFF;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 24px 10px;
  }
  svg {
    background: #FFFFFF;
    display: block;
  }
  .title-main {
    font-size: 19px;
    font-weight: 800;
    fill: #0F172A;
    text-anchor: middle;
    letter-spacing: 0.4px;
  }
  .title-sub {
    font-size: 12px;
    font-weight: 500;
    fill: #64748B;
    text-anchor: middle;
  }
  .section-tag {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-anchor: middle;
  }
  .node-title {
    font-size: 13.5px;
    font-weight: 700;
    fill: #0F172A;
    text-anchor: middle;
  }
  .node-desc {
    font-size: 11.2px;
    font-weight: 500;
    fill: #475569;
    text-anchor: middle;
  }
  .node-subdesc {
    font-size: 11px;
    font-weight: 700;
    text-anchor: middle;
  }
  .diamond-title {
    font-size: 13px;
    font-weight: 700;
    fill: #0F172A;
    text-anchor: middle;
  }
  .edge-label-yes {
    font-size: 11.5px;
    font-weight: 800;
    fill: #15803D;
    text-anchor: middle;
  }
  .edge-label-no {
    font-size: 11.5px;
    font-weight: 800;
    fill: #B91C1C;
    text-anchor: middle;
  }
  .flow-line {
    stroke: #334155;
    stroke-width: 2.2;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .loop-line {
    stroke: #DC2626;
    stroke-width: 2;
    stroke-dasharray: 6,4;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
</head>
<body>

<svg width="1240" height="1540" viewBox="0 0 1240 1540" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Arrowhead markers -->
    <marker id="arrow" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#334155" />
    </marker>
    <marker id="arrow-red" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#DC2626" />
    </marker>
    <marker id="arrow-green" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#15803D" />
    </marker>

    <!-- Subtle Clean Elevation Filter -->
    <filter id="card-shadow" x="-3%" y="-5%" width="106%" height="114%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#0F172A" flood-opacity="0.06"/>
    </filter>
  </defs>

  <!-- ================= HEADER TITLE ================= -->
  <text x="620" y="34" class="title-main">QAI-OLI: TRUE PARALLEL MULTI-STREAM QUANTUM-AI ARCHITECTURE</text>
  <text x="620" y="54" class="title-sub">End-to-End Pipeline: IQA Gate → Parallel Tri-Stream Inference → Calibrated Soft-Vote Fusion → 4-Class Triage &amp; Grad-CAM</text>

  <!-- ================= 1. START ================= -->
  <rect x="440" y="76" width="360" height="48" rx="24" ry="24" fill="#EFF6FF" stroke="#2563EB" stroke-width="2" filter="url(#card-shadow)"/>
  <text x="620" y="97" class="node-title" fill="#1D4ED8">START</text>
  <text x="620" y="113" class="node-desc" fill="#1E40AF">Patient Intraoral Photograph Upload</text>

  <!-- Flow Line to IQA -->
  <path d="M 620 124 L 620 156" class="flow-line" marker-end="url(#arrow)"/>

  <!-- ================= 2. IQA CHECK ================= -->
  <rect x="390" y="156" width="460" height="58" rx="8" ry="8" fill="#F8FAFC" stroke="#64748B" stroke-width="1.8" filter="url(#card-shadow)"/>
  <text x="620" y="180" class="node-title">Pre-Flight Image Quality Gate (IQA)</text>
  <text x="620" y="200" class="node-desc">OpenCV Assessment: Blur (Laplacian &gt; 100), Glare &lt; 8%, Exposure Verification</text>

  <!-- Flow Line to Diamond -->
  <path d="M 620 214 L 620 250" class="flow-line" marker-end="url(#arrow)"/>

  <!-- ================= 3. QUALITY DIAMOND ================= -->
  <!-- Diamond: Center (620, 292), W=240, H=84. Top=250, Bottom=334, Left=500, Right=740 -->
  <polygon points="620,250 740,292 620,334 500,292" fill="#FFFFFF" stroke="#475569" stroke-width="2" filter="url(#card-shadow)"/>
  <text x="620" y="288" class="diamond-title">Image Quality</text>
  <text x="620" y="304" class="diamond-title">Acceptable?</text>

  <!-- Reject Branch (NO): Right from (740, 292) to (860, 292) -->
  <path d="M 740 292 L 860 292" class="flow-line" marker-end="url(#arrow-red)"/>
  <rect x="778" y="274" width="38" height="18" rx="4" fill="#FEE2E2"/>
  <text x="797" y="287" class="edge-label-no">NO</text>

  <!-- Reject Box: X=[860, 1160], Y=[264, 320] -->
  <rect x="860" y="264" width="300" height="56" rx="8" ry="8" fill="#FEF2F2" stroke="#DC2626" stroke-width="1.8" filter="url(#card-shadow)"/>
  <text x="1010" y="287" class="node-title" fill="#991B1B">Reject Image (IQA Fail)</text>
  <text x="1010" y="305" class="node-desc" fill="#B91C1C">Prompt Clinician to Retake Photo</text>

  <!-- Re-upload Loopback: Up to Y=185, Left to X=850 -->
  <path d="M 1010 264 L 1010 185 L 850 185" class="loop-line" marker-end="url(#arrow-red)"/>
  <text x="1022" y="228" class="edge-label-no" style="font-size:11px; text-anchor:start;">Re-upload loop</text>

  <!-- Pass Branch (YES): Down from (620, 334) to (620, 372) -->
  <path d="M 620 334 L 620 372" class="flow-line" marker-end="url(#arrow-green)"/>
  <rect x="628" y="342" width="38" height="18" rx="4" fill="#DCFCE7"/>
  <text x="647" y="355" class="edge-label-yes">YES</text>

  <!-- ================= 4. IMAGE PREPROCESSING ================= -->
  <rect x="360" y="372" width="520" height="58" rx="8" ry="8" fill="#F8FAFC" stroke="#64748B" stroke-width="1.8" filter="url(#card-shadow)"/>
  <text x="620" y="396" class="node-title">Multi-Resolution Preprocessing &amp; Normalization</text>
  <text x="620" y="415" class="node-desc">CLAHE Enhancement · Generates Tensors: 224×224 (Classical), 384×384 &amp; 300×300 (Quantum)</text>

  <!-- ================= SECTION BANNER: PARALLEL TRI-STREAM ================= -->
  <!-- Split Fork to 3 Parallel Streams -->
  <path d="M 620 430 L 620 460" class="flow-line"/>
  <path d="M 220 460 L 1020 460" class="flow-line"/>
  <path d="M 220 460 L 220 488" class="flow-line" marker-end="url(#arrow)"/>
  <path d="M 620 460 L 620 488" class="flow-line" marker-end="url(#arrow)"/>
  <path d="M 1020 460 L 1020 488" class="flow-line" marker-end="url(#arrow)"/>

  <!-- ================= 5. PARALLEL TRI-STREAM ARCHITECTURE ================= -->
  
  <!-- STREAM 1 (STAGE 1): ConvNeXt-V2-Tiny (Left: Center 220, W=360. X=[40, 400], Y=[488, 620]) -->
  <rect x="40" y="488" width="360" height="132" rx="10" ry="10" fill="#F0FDF4" stroke="#16A34A" stroke-width="1.8" filter="url(#card-shadow)"/>
  <rect x="52" y="498" width="170" height="20" rx="4" fill="#DCFCE7"/>
  <text x="137" y="512" class="section-tag" fill="#15803D">STREAM 1 (STAGE 1)</text>
  <text x="220" y="534" class="node-title" fill="#166534">ConvNeXt-V2-Tiny</text>
  <text x="220" y="553" class="node-desc">Lesion Morphometry &amp; Outer Margins</text>
  <text x="220" y="570" class="node-desc">7×7 Depthwise Conv + GRN Normalization</text>
  <text x="220" y="590" class="node-subdesc" fill="#15803D">Output: Softmax Probabilities P_M1</text>
  <text x="220" y="607" class="node-desc" style="font-weight:600; fill:#166534;">Weight Contribution: 25% (0.25)</text>

  <!-- STREAM 2 (STAGE 2): DenseNet-121 (Center: Center 620, W=360. X=[440, 800], Y=[488, 620]) -->
  <rect x="440" y="488" width="360" height="132" rx="10" ry="10" fill="#EFF6FF" stroke="#2563EB" stroke-width="1.8" filter="url(#card-shadow)"/>
  <rect x="452" y="498" width="170" height="20" rx="4" fill="#DBEAFE"/>
  <text x="537" y="512" class="section-tag" fill="#1D4ED8">STREAM 2 (STAGE 2)</text>
  <text x="620" y="534" class="node-title" fill="#1E40AF">DenseNet-121</text>
  <text x="620" y="553" class="node-desc">Cellular Morphology &amp; Micro-Vascular Patterns</text>
  <text x="620" y="570" class="node-desc">Iterative Feature-Reuse Across Dense Blocks</text>
  <text x="620" y="590" class="node-subdesc" fill="#1D4ED8">Output: Softmax Probabilities P_M2</text>
  <text x="620" y="607" class="node-desc" style="font-weight:600; fill:#1E40AF;">Weight Contribution: 25% (0.25)</text>

  <!-- STREAM 3 (STAGE 3): 8-Qubit VQC Hybrid (Right: Center 1020, W=360. X=[840, 1200], Y=[488, 620]) -->
  <rect x="840" y="488" width="360" height="132" rx="10" ry="10" fill="#FAF5FF" stroke="#7C3AED" stroke-width="1.8" filter="url(#card-shadow)"/>
  <rect x="852" y="498" width="170" height="20" rx="4" fill="#F3E8FF"/>
  <text x="937" y="512" class="section-tag" fill="#6D28D9">STREAM 3 (STAGE 3)</text>
  <text x="1020" y="534" class="node-title" fill="#5B21B6">8-Qubit VQC Hybrid</text>
  <text x="1020" y="553" class="node-desc">Hilbert Space 256-D Quantum Angle Embedding</text>
  <text x="1020" y="570" class="node-desc">Strongly Entangling Layers + Classical Skip Highway</text>
  <text x="1020" y="590" class="node-subdesc" fill="#6D28D9">Output: Softmax Probabilities P_M3</text>
  <text x="1020" y="607" class="node-desc" style="font-weight:600; fill:#5B21B6;">Weight Contribution: 50% (0.50)</text>

  <!-- ================= MERGE 3 STREAMS TO SOFT-VOTE FUSION ================= -->
  <path d="M 220 620 L 220 660 L 620 660" class="flow-line"/>
  <path d="M 620 620 L 620 660" class="flow-line"/>
  <path d="M 1020 620 L 1020 660 L 620 660" class="flow-line"/>
  <path d="M 620 660 L 620 690" class="flow-line" marker-end="url(#arrow)"/>

  <!-- ================= 6. CONSENSUS SOFT-VOTING FUSION ================= -->
  <!-- Box: Center 620, W=680, H=82. X=[280, 960], Y=[690, 772] -->
  <rect x="280" y="690" width="680" height="82" rx="10" ry="10" fill="#F8FAFC" stroke="#0F172A" stroke-width="2" filter="url(#card-shadow)"/>
  <text x="620" y="715" class="node-title" style="font-size:15px; fill:#0F172A;">Calibrated Soft-Voting Consensus Decision Engine</text>
  <text x="620" y="737" class="node-desc" style="font-size:12.5px; font-weight:600; fill:#1E293B;">
    P_fused = (0.25 × P_M1) + (0.25 × P_M2) + (0.50 × P_M3)
  </text>
  <text x="620" y="756" class="node-desc" fill="#475569">
    Ensemble consensus resolves subtle border ambiguities between Benign ulcers &amp; Pre-Malignant OPMD
  </text>

  <!-- Flow Line to 4-Class Output Header -->
  <path d="M 620 772 L 620 812" class="flow-line" marker-end="url(#arrow)"/>

  <!-- Decision Selector Badge -->
  <rect x="380" y="806" width="480" height="38" rx="8" ry="8" fill="#F1F5F9" stroke="#64748B" stroke-width="1.8" filter="url(#card-shadow)"/>
  <text x="620" y="830" style="font-size:13px; font-weight:800; fill:#0F172A; text-anchor:middle; letter-spacing:0.3px;">
    ArgMax Decision: Predicted Class c* = argmax { P_fused(c) }
  </text>

  <!-- Split Fork to 4 Clinical Classes -->
  <path d="M 620 844 L 620 870" class="flow-line"/>
  <path d="M 155 870 L 1085 870" class="flow-line"/>
  <path d="M 155 870 L 155 896" class="flow-line" marker-end="url(#arrow)"/>
  <path d="M 465 870 L 465 896" class="flow-line" marker-end="url(#arrow)"/>
  <path d="M 775 870 L 775 896" class="flow-line" marker-end="url(#arrow)"/>
  <path d="M 1085 870 L 1085 896" class="flow-line" marker-end="url(#arrow)"/>

  <!-- ================= 7. UNIFIED 4-CLASS CLINICAL DIAGNOSIS TIERS ================= -->

  <!-- CLASS 1: HEALTHY MUCOSA (Center 155, W=280. X=[15, 295], Y=[896, 1056]) -->
  <rect x="15" y="896" width="280" height="160" rx="10" ry="10" fill="#F0FDF4" stroke="#16A34A" stroke-width="1.8" filter="url(#card-shadow)"/>
  <rect x="25" y="906" width="130" height="18" rx="4" fill="#DCFCE7"/>
  <text x="90" y="919" class="section-tag" fill="#15803D">CLASS: HEALTHY</text>
  <text x="155" y="942" class="node-title" fill="#15803D" style="font-size:14px;">Healthy Mucosa</text>
  <text x="155" y="964" class="node-desc">Uniform intact epithelium</text>
  <text x="155" y="982" class="node-desc">No mucosal breach / lesion</text>
  <text x="155" y="1004" class="node-subdesc" fill="#166534">Specificity: 98.40%</text>
  <line x1="30" y1="1016" x2="280" y2="1016" stroke="#BBF7D0" stroke-width="1"/>
  <text x="155" y="1034" class="node-desc" style="font-weight:700; fill:#15803D;">Triage: Routine Care</text>
  <text x="155" y="1048" class="node-desc" style="font-size:10.5px; fill:#166534;">Annual dental screening</text>

  <!-- CLASS 2: BENIGN ULCER (Center 465, W=280. X=[325, 605], Y=[896, 1056]) -->
  <rect x="325" y="896" width="280" height="160" rx="10" ry="10" fill="#FFFBEB" stroke="#D97706" stroke-width="1.8" filter="url(#card-shadow)"/>
  <rect x="335" y="120" width="120" height="18" rx="4" fill="#FEF3C7" style="display:none;"/>
  <rect x="335" y="906" width="120" height="18" rx="4" fill="#FEF3C7"/>
  <text x="395" y="919" class="section-tag" fill="#B45309">CLASS: BENIGN</text>
  <text x="465" y="942" class="node-title" fill="#B45309" style="font-size:14px;">Benign Ulceration</text>
  <text x="465" y="964" class="node-desc">Aphthous / traumatic ulcer</text>
  <text x="465" y="982" class="node-desc">Well-defined inflammatory halo</text>
  <text x="465" y="1004" class="node-subdesc" fill="#B45309">F1-Score: 84.20%</text>
  <line x1="340" y1="1016" x2="590" y2="1016" stroke="#FDE68A" stroke-width="1"/>
  <text x="465" y="1034" class="node-desc" style="font-weight:700; fill:#B45309;">Triage: 14-Day Observation</text>
  <text x="465" y="1048" class="node-desc" style="font-size:10.5px; fill:#92400E;">Topical anti-inflammatory care</text>

  <!-- CLASS 3: OPMD (Center 775, W=280. X=[635, 915], Y=[896, 1056]) -->
  <rect x="635" y="896" width="280" height="160" rx="10" ry="10" fill="#FFF7ED" stroke="#EA580C" stroke-width="1.8" filter="url(#card-shadow)"/>
  <rect x="645" y="906" width="110" height="18" rx="4" fill="#FFEDD5"/>
  <text x="700" y="919" class="section-tag" fill="#C2410C">CLASS: OPMD</text>
  <text x="775" y="942" class="node-title" fill="#C2410C" style="font-size:14px;">Pre-Malignant (OPMD)</text>
  <text x="775" y="964" class="node-desc">Leukoplakia / OSMF / Lichen Planus</text>
  <text x="775" y="982" class="node-desc">High-risk cellular dysplasia</text>
  <text x="775" y="1004" class="node-subdesc" fill="#C2410C">Discrimination: 83.77%</text>
  <line x1="650" y1="1016" x2="900" y2="1016" stroke="#FED7AA" stroke-width="1"/>
  <text x="775" y="1034" class="node-desc" style="font-weight:700; fill:#C2410C;">Triage: Priority Biopsy</text>
  <text x="775" y="1048" class="node-desc" style="font-size:10.5px; fill:#9A3412;">Specialist oncology surveillance</text>

  <!-- CLASS 4: ORAL CANCER OCA (Center 1085, W=280. X=[945, 1225], Y=[896, 1056]) -->
  <rect x="945" y="896" width="280" height="160" rx="10" ry="10" fill="#FFF1F2" stroke="#E11D48" stroke-width="1.8" filter="url(#card-shadow)"/>
  <rect x="955" y="906" width="110" height="18" rx="4" fill="#FFE4E6"/>
  <text x="1010" y="919" class="section-tag" fill="#BE123C">CLASS: OCA</text>
  <text x="1085" y="942" class="node-title" fill="#BE123C" style="font-size:14px;">Oral Carcinoma (OCA)</text>
  <text x="1085" y="964" class="node-desc">Malignant Squamous Carcinoma</text>
  <text x="1085" y="982" class="node-desc">Invasive border &amp; contact bleeding</text>
  <text x="1085" y="1004" class="node-subdesc" fill="#BE123C">Cancer Recall: 90.43% | F1: 89.4%</text>
  <line x1="960" y1="1016" x2="1210" y2="1016" stroke="#FECDD3" stroke-width="1"/>
  <text x="1085" y="1034" class="node-desc" style="font-weight:700; fill:#BE123C;">Triage: Urgent Oncology</text>
  <text x="1085" y="1048" class="node-desc" style="font-size:10.5px; fill:#9F1239;">Emergency surgical staging</text>

  <!-- ================= MERGE ALL 4 CLASSES TO GRAD-CAM ================= -->
  <path d="M 155 1056 L 155 1096 L 620 1096" class="flow-line"/>
  <path d="M 465 1056 L 465 1096" class="flow-line"/>
  <path d="M 775 1056 L 775 1096" class="flow-line"/>
  <path d="M 1085 1056 L 1085 1096 L 620 1096" class="flow-line"/>
  <path d="M 620 1096 L 620 1124" class="flow-line" marker-end="url(#arrow)"/>

  <!-- ================= 8. EXPLAINABLE AI: GRAD-CAM ================= -->
  <!-- Center 620, W=560, H=66. X=[340, 900], Y=[1124, 1190] -->
  <rect x="340" y="1124" width="560" height="66" rx="10" ry="10" fill="#FAF5FF" stroke="#9333EA" stroke-width="1.8" filter="url(#card-shadow)"/>
  <text x="620" y="1149" class="node-title" fill="#6B21A8">Dual-Stream Grad-CAM Saliency Localization</text>
  <text x="620" y="1168" class="node-desc" fill="#7E22CE">
    Computes visual gradient activations overlaid directly on patient photograph (Occlusion Drop: 8.5%)
  </text>
  <text x="620" y="1182" class="node-subdesc" fill="#6B21A8">
    Clinician verification of tissue borders &amp; suspicious hotspots
  </text>

  <!-- Flow Line to Clinical Documentation -->
  <path d="M 620 1190 L 620 1222" class="flow-line" marker-end="url(#arrow)"/>

  <!-- ================= 9. CLINICAL ACTION & REPORTING ================= -->
  <!-- Split into 2 Parallel outputs: Telemetry & Pathology Requisition -->
  <path d="M 620 1222 L 620 1246" class="flow-line"/>
  <path d="M 390 1246 L 850 1246" class="flow-line"/>
  <path d="M 390 1246 L 390 1270" class="flow-line" marker-end="url(#arrow)"/>
  <path d="M 850 1246 L 850 1270" class="flow-line" marker-end="url(#arrow)"/>

  <!-- Output 1: Telemetry Dashboard (Center 390, W=420. X=[180, 600], Y=[1270, 1342]) -->
  <rect x="180" y="1270" width="420" height="72" rx="8" ry="8" fill="#F8FAFC" stroke="#475569" stroke-width="1.8" filter="url(#card-shadow)"/>
  <text x="390" y="1295" class="node-title">Quantum Polarization Telemetry (QPS)</text>
  <text x="390" y="1315" class="node-desc">8 Pauli-Z expectation values &lt;Z_0..7&gt; logged to chairside dashboard</text>
  <text x="390" y="1331" class="node-subdesc" fill="#475569">Fast Chairside Inference: 14.8 ms Latency</text>

  <!-- Output 2: Pathology Requisition (Center 850, W=420. X=[640, 1060], Y=[1270, 1342]) -->
  <rect x="640" y="1270" width="420" height="72" rx="8" ry="8" fill="#F8FAFC" stroke="#475569" stroke-width="1.8" filter="url(#card-shadow)"/>
  <text x="850" y="1295" class="node-title">Doctor Pathology Requisition &amp; PDF</text>
  <text x="850" y="1315" class="node-desc">Auto-generated clinical summary with Grad-CAM heatmap &amp; urgency tier</text>
  <text x="850" y="1331" class="node-subdesc" fill="#475569">Actionable printout for biopsy and referral</text>

  <!-- Merge to END -->
  <path d="M 390 1342 L 390 1374 L 620 1374" class="flow-line"/>
  <path d="M 850 1342 L 850 1374 L 620 1374" class="flow-line"/>
  <path d="M 620 1374 L 620 1402" class="flow-line" marker-end="url(#arrow)"/>

  <!-- ================= 10. END ================= -->
  <rect x="440" y="1402" width="360" height="48" rx="24" ry="24" fill="#EFF6FF" stroke="#2563EB" stroke-width="2" filter="url(#card-shadow)"/>
  <text x="620" y="1423" class="node-title" fill="#1D4ED8">END</text>
  <text x="620" y="1439" class="node-desc" fill="#1E40AF">Clinical Decision Archival &amp; Patient Referral Completed</text>

</svg>

</body>
</html>
"""


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
DIAGRAMS_DIR = os.path.join(PROJECT_ROOT, "figures", "architecture_diagrams")
os.makedirs(DIAGRAMS_DIR, exist_ok=True)

html_path = os.path.join(DIAGRAMS_DIR, "flowchart.html")
temp_png_path = os.path.join(DIAGRAMS_DIR, "flowchart_temp.png")
out_png = os.path.join(DIAGRAMS_DIR, "flowchart_pipeline.png")

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

edge_candidates = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]
edge_path = next((p for p in edge_candidates if os.path.exists(p)), edge_candidates[0])

file_url = "file:///" + os.path.abspath(html_path).replace("\\", "/")
cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--force-device-scale-factor=2",
    f"--screenshot={temp_png_path}",
    "--window-size=1280,1600",
    file_url
]

print(f"Rendering flowchart from {html_path}...")
subprocess.run(cmd, check=True)

img = Image.open(temp_png_path)
if img.mode in ("RGBA", "LA"):
    bg = Image.new("RGB", img.size, (255, 255, 255))
    bg.paste(img, mask=img.split()[3])
    img = bg
else:
    img = img.convert("RGB")

img.save(out_png, "PNG")

if os.path.exists(temp_png_path):
    os.remove(temp_png_path)

print("[SUCCESS] Flowchart generated successfully:")
print(f"  - HTML: {html_path}")
print(f"  - PNG:  {out_png}")
