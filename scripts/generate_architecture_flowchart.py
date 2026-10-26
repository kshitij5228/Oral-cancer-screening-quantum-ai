import os
import subprocess
from PIL import Image

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>QAI-OLI Compact Architecture Flowchart</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background-color: #FFFFFF;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px 10px;
  }
  svg {
    background: #FFFFFF;
    display: block;
    max-width: 100%;
    height: auto;
  }
  .node-title-hero {
    font-size: 21px;
    font-weight: 800;
    text-anchor: middle;
    dominant-baseline: central;
    letter-spacing: 0.3px;
  }
  .node-title-xl {
    font-size: 21px;
    font-weight: 800;
    text-anchor: middle;
    dominant-baseline: central;
    letter-spacing: 0.2px;
  }
  .node-title-lg {
    font-size: 20px;
    font-weight: 700;
    text-anchor: middle;
    dominant-baseline: central;
  }
  .node-title-stream {
    font-size: 19.5px;
    font-weight: 700;
    text-anchor: middle;
    dominant-baseline: central;
  }
  .node-title-md {
    font-size: 19px;
    font-weight: 700;
    text-anchor: middle;
    dominant-baseline: central;
  }
  .diamond-title {
    font-size: 18.5px;
    font-weight: 800;
    fill: #0F172A;
    text-anchor: middle;
  }
  .badge-text {
    font-size: 16px;
    font-weight: 800;
    text-anchor: middle;
    dominant-baseline: central;
    letter-spacing: 0.5px;
  }
  .flow-line {
    stroke: #334155;
    stroke-width: 2.8;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .loop-line {
    stroke: #DC2626;
    stroke-width: 2.4;
    stroke-dasharray: 6,4;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
</head>
<body>

<svg width="1320" height="1240" viewBox="0 0 1320 1240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Arrowhead markers -->
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#334155" />
    </marker>
    <marker id="arrow-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#DC2626" />
    </marker>
    <marker id="arrow-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#15803D" />
    </marker>

    <!-- Subtle Elevation Filter -->
    <filter id="card-shadow" x="-4%" y="-6%" width="108%" height="116%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#0F172A" flood-opacity="0.06"/>
    </filter>
  </defs>

  <!-- ================= 1. START ================= -->
  <!-- Center 660, W=480, H=52. X=[420, 900], Y=[24, 76] -->
  <rect x="420" y="24" width="480" height="52" rx="26" ry="26" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.2" filter="url(#card-shadow)"/>
  <text x="660" y="50" class="node-title-hero" fill="#1D4ED8">START: Patient Oral Photo Upload</text>

  <!-- Flow Line to IQA -->
  <path d="M 660 76 L 660 112" class="flow-line" marker-end="url(#arrow)"/>

  <!-- ================= 2. IQA CHECK ================= -->
  <!-- Center 660, W=620, H=54. X=[350, 970], Y=[112, 166] -->
  <rect x="350" y="112" width="620" height="54" rx="10" ry="10" fill="#F8FAFC" stroke="#475569" stroke-width="2" filter="url(#card-shadow)"/>
  <text x="660" y="139" class="node-title-xl" fill="#0F172A">Pre-Flight Quality Gate (IQA)</text>

  <!-- Flow Line to Diamond -->
  <path d="M 660 166 L 660 198" class="flow-line" marker-end="url(#arrow)"/>

  <!-- ================= 3. QUALITY DIAMOND ================= -->
  <!-- Diamond: Center (660, 248), W=270, H=100. Top=198, Bottom=298, Left=525, Right=795 -->
  <polygon points="660,198 795,248 660,298 525,248" fill="#FFFFFF" stroke="#475569" stroke-width="2.2" filter="url(#card-shadow)"/>
  <text x="660" y="242" class="diamond-title">Image Quality</text>
  <text x="660" y="264" class="diamond-title">Acceptable?</text>

  <!-- Reject Branch (NO): Right from (795, 248) to (920, 248) -->
  <path d="M 795 248 L 920 248" class="flow-line" marker-end="url(#arrow-red)"/>
  <rect x="830" y="234" width="50" height="28" rx="5" fill="#FEE2E2" stroke="#EF4444" stroke-width="1.2"/>
  <text x="855" y="248" class="badge-text" fill="#DC2626">NO</text>

  <!-- Reject Box: X=[920, 1260], Y=[222, 274], W=340, H=52 -->
  <rect x="920" y="222" width="340" height="52" rx="10" ry="10" fill="#FEF2F2" stroke="#DC2626" stroke-width="2" filter="url(#card-shadow)"/>
  <text x="1090" y="248" class="node-title-lg" fill="#991B1B">Reject &amp; Retake Image</text>

  <!-- Re-upload Loopback: Up to Y=139, Left to X=970 (right edge of IQA box) -->
  <path d="M 1090 222 L 1090 139 L 970 139" class="loop-line" marker-end="url(#arrow-red)"/>
  <text x="1105" y="180" fill="#DC2626" style="font-size:15px; font-weight:800; text-anchor:start;">Retake Loop</text>

  <!-- Pass Branch (YES): Ample vertical space! From 298 down to 376 (78px distance) -->
  <path d="M 660 298 L 660 376" class="flow-line" stroke="#16A34A" marker-end="url(#arrow-green)"/>
  <!-- YES Badge placed at Y=[314, 342], leaving 34px of visible green arrow line below it -->
  <rect x="632" y="314" width="56" height="28" rx="5" fill="#DCFCE7" stroke="#22C55E" stroke-width="1.4"/>
  <text x="660" y="328" class="badge-text" fill="#15803D">YES</text>

  <!-- ================= 4. IMAGE PREPROCESSING ================= -->
  <!-- Center 660, W=660, H=54. X=[330, 990], Y=[376, 430] -->
  <rect x="330" y="376" width="660" height="54" rx="10" ry="10" fill="#F8FAFC" stroke="#475569" stroke-width="2" filter="url(#card-shadow)"/>
  <text x="660" y="403" class="node-title-xl" fill="#0F172A">Multi-Resolution Preprocessing</text>

  <!-- Fork to 3 Parallel Streams -->
  <path d="M 660 430 L 660 458" class="flow-line"/>
  <path d="M 235 458 L 1085 458" class="flow-line"/>
  <path d="M 235 458 L 235 486" class="flow-line" marker-end="url(#arrow)"/>
  <path d="M 660 458 L 660 486" class="flow-line" marker-end="url(#arrow)"/>
  <path d="M 1085 458 L 1085 486" class="flow-line" marker-end="url(#arrow)"/>

  <!-- ================= 5. PARALLEL TRI-STREAM ARCHITECTURE ================= -->
  
  <!-- STREAM 1: ConvNeXt-V2-Tiny (Center 235, W=390, H=58. X=[40, 430], Y=[486, 544]) -->
  <rect x="40" y="486" width="390" height="58" rx="10" ry="10" fill="#F0FDF4" stroke="#16A34A" stroke-width="2.2" filter="url(#card-shadow)"/>
  <text x="235" y="515" class="node-title-stream" fill="#15803D">Stream 1: ConvNeXt-V2-Tiny (25%)</text>

  <!-- STREAM 2: DenseNet-121 (Center 660, W=390, H=58. X=[465, 855], Y=[486, 544]) -->
  <rect x="465" y="486" width="390" height="58" rx="10" ry="10" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.2" filter="url(#card-shadow)"/>
  <text x="660" y="515" class="node-title-stream" fill="#1D4ED8">Stream 2: DenseNet-121 (25%)</text>

  <!-- STREAM 3: 8-Qubit VQC Hybrid (Center 1085, W=390, H=58. X=[890, 1280], Y=[486, 544]) -->
  <rect x="890" y="486" width="390" height="58" rx="10" ry="10" fill="#FAF5FF" stroke="#9333EA" stroke-width="2.2" filter="url(#card-shadow)"/>
  <text x="1085" y="515" class="node-title-stream" fill="#6D28D9">Stream 3: 8-Qubit VQC Hybrid (50%)</text>

  <!-- ================= MERGE 3 STREAMS TO SOFT-VOTE FUSION ================= -->
  <path d="M 235 544 L 235 572" class="flow-line"/>
  <path d="M 660 544 L 660 572" class="flow-line"/>
  <path d="M 1085 544 L 1085 572" class="flow-line"/>
  <path d="M 235 572 L 1085 572" class="flow-line"/>
  <path d="M 660 572 L 660 600" class="flow-line" marker-end="url(#arrow)"/>

  <!-- ================= 6. CONSENSUS SOFT-VOTING FUSION ================= -->
  <!-- Center 660, W=780, H=54. X=[270, 1050], Y=[600, 654] -->
  <rect x="270" y="600" width="780" height="54" rx="10" ry="10" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.4" filter="url(#card-shadow)"/>
  <text x="660" y="627" class="node-title-xl" fill="#0F172A">Soft-Voting Consensus Ensemble (25% + 25% + 50%)</text>

  <!-- Flow Line to ArgMax Decision -->
  <path d="M 660 654 L 660 686" class="flow-line" marker-end="url(#arrow)"/>

  <!-- ArgMax Decision Box: Center 660, W=560, H=48. X=[380, 940], Y=[686, 734] -->
  <rect x="380" y="686" width="560" height="48" rx="8" ry="8" fill="#F1F5F9" stroke="#64748B" stroke-width="2" filter="url(#card-shadow)"/>
  <text x="660" y="710" class="node-title-md" fill="#0F172A">ArgMax 4-Class Diagnostic Decision</text>

  <!-- Split Fork to 4 Clinical Classes -->
  <path d="M 660 734 L 660 762" class="flow-line"/>
  <path d="M 180 762 L 1140 762" class="flow-line"/>
  <path d="M 180 762 L 180 788" class="flow-line" marker-end="url(#arrow)"/>
  <path d="M 500 762 L 500 788" class="flow-line" marker-end="url(#arrow)"/>
  <path d="M 820 762 L 820 788" class="flow-line" marker-end="url(#arrow)"/>
  <path d="M 1140 762 L 1140 788" class="flow-line" marker-end="url(#arrow)"/>

  <!-- ================= 7. UNIFIED 4-CLASS CLINICAL DIAGNOSIS TIERS ================= -->

  <!-- CLASS 1: HEALTHY MUCOSA (Center 180, W=290, H=56. X=[35, 325], Y=[788, 844]) -->
  <rect x="35" y="788" width="290" height="56" rx="10" ry="10" fill="#F0FDF4" stroke="#16A34A" stroke-width="2.2" filter="url(#card-shadow)"/>
  <text x="180" y="816" class="node-title-stream" fill="#15803D">Healthy Mucosa</text>

  <!-- CLASS 2: BENIGN ULCER (Center 500, W=290, H=56. X=[355, 645], Y=[788, 844]) -->
  <rect x="355" y="788" width="290" height="56" rx="10" ry="10" fill="#FFFBEB" stroke="#D97706" stroke-width="2.2" filter="url(#card-shadow)"/>
  <text x="500" y="816" class="node-title-stream" fill="#B45309">Benign Ulceration</text>

  <!-- CLASS 3: OPMD (Center 820, W=290, H=56. X=[675, 965], Y=[788, 844]) -->
  <rect x="675" y="788" width="290" height="56" rx="10" ry="10" fill="#FFF7ED" stroke="#EA580C" stroke-width="2.2" filter="url(#card-shadow)"/>
  <text x="820" y="816" class="node-title-stream" fill="#C2410C">Pre-Malignant (OPMD)</text>

  <!-- CLASS 4: ORAL CANCER OCA (Center 1140, W=290, H=56. X=[995, 1285], Y=[788, 844]) -->
  <rect x="995" y="788" width="290" height="56" rx="10" ry="10" fill="#FFF1F2" stroke="#E11D48" stroke-width="2.2" filter="url(#card-shadow)"/>
  <text x="1140" y="816" class="node-title-stream" fill="#BE123C">Oral Carcinoma (OCA)</text>

  <!-- ================= MERGE 4 CLASSES TO EXPLAINABILITY ================= -->
  <path d="M 180 844 L 180 872" class="flow-line"/>
  <path d="M 500 844 L 500 872" class="flow-line"/>
  <path d="M 820 844 L 820 872" class="flow-line"/>
  <path d="M 1140 844 L 1140 872" class="flow-line"/>
  <path d="M 180 872 L 1140 872" class="flow-line"/>
  <path d="M 660 872 L 660 900" class="flow-line" marker-end="url(#arrow)"/>

  <!-- ================= 8. GRAD-CAM EXPLAINABILITY ================= -->
  <!-- Center 660, W=680, H=54. X=[320, 1000], Y=[900, 954] -->
  <rect x="320" y="900" width="680" height="54" rx="10" ry="10" fill="#FAF5FF" stroke="#9333EA" stroke-width="2.2" filter="url(#card-shadow)"/>
  <text x="660" y="927" class="node-title-xl" fill="#6B21A8">Dual-Stream Grad-CAM Saliency Localization</text>

  <!-- Split to Outputs -->
  <path d="M 660 954 L 660 982" class="flow-line"/>
  <path d="M 380 982 L 940 982" class="flow-line"/>
  <path d="M 380 982 L 380 1010" class="flow-line" marker-end="url(#arrow)"/>
  <path d="M 940 982 L 940 1010" class="flow-line" marker-end="url(#arrow)"/>

  <!-- ================= 9. CLINICAL ACTION & DOCUMENTATION ================= -->

  <!-- Output 1: Telemetry (Center 380, W=510, H=54. X=[125, 635], Y=[1010, 1064]) -->
  <rect x="125" y="1010" width="510" height="54" rx="10" ry="10" fill="#F8FAFC" stroke="#334155" stroke-width="2" filter="url(#card-shadow)"/>
  <text x="380" y="1037" class="node-title-lg" fill="#0F172A">Quantum Telemetry Log (QPS)</text>

  <!-- Output 2: Pathology Requisition (Center 940, W=510, H=54. X=[685, 1195], Y=[1010, 1064]) -->
  <rect x="685" y="1010" width="510" height="54" rx="10" ry="10" fill="#F8FAFC" stroke="#334155" stroke-width="2" filter="url(#card-shadow)"/>
  <text x="940" y="1037" class="node-title-lg" fill="#0F172A">Doctor Pathology Requisition &amp; PDF</text>

  <!-- Merge to END -->
  <path d="M 380 1064 L 380 1092" class="flow-line"/>
  <path d="M 940 1064 L 940 1092" class="flow-line"/>
  <path d="M 380 1092 L 940 1092" class="flow-line"/>
  <path d="M 660 1092 L 660 1120" class="flow-line" marker-end="url(#arrow)"/>

  <!-- ================= 10. END ================= -->
  <!-- Center 660, W=480, H=52. X=[420, 900], Y=[1120, 1172] -->
  <rect x="420" y="1120" width="480" height="52" rx="26" ry="26" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.2" filter="url(#card-shadow)"/>
  <text x="660" y="1146" class="node-title-hero" fill="#1D4ED8">END: Clinical Decision Archival</text>

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
    "--window-size=1360,1300",
    file_url
]

print(f"Rendering fixed compact flowchart from {html_path}...")
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
if os.path.exists(html_path):
    os.remove(html_path)

print("[SUCCESS] Flowchart generated successfully:")
print(f"  - PNG:  {out_png}")
