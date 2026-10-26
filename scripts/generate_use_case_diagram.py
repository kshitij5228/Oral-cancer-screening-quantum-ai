import os
import subprocess
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
DIAGRAMS_DIR = os.path.join(PROJECT_ROOT, "figures", "architecture_diagrams")
os.makedirs(DIAGRAMS_DIR, exist_ok=True)

html_path = os.path.join(DIAGRAMS_DIR, "use_case_diagram.html")
temp_png_path = os.path.join(DIAGRAMS_DIR, "use_case_temp.png")
out_png = os.path.join(DIAGRAMS_DIR, "use_case_diagram.png")
out_svg = os.path.join(DIAGRAMS_DIR, "use_case_diagram.svg")

# Clean expansive dimensions
WIDTH = 1720
HEIGHT = 980

svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}" width="{WIDTH}" height="{HEIGHT}">
  <defs>
    <filter id="card-shadow" x="-8%" y="-8%" width="120%" height="120%">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#0f172a" flood-opacity="0.05"/>
    </filter>
    <filter id="pill-shadow" x="-5%" y="-10%" width="110%" height="125%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#6366f1" flood-opacity="0.06"/>
    </filter>
    
    <linearGradient id="screener-actor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#EFF6FF"/>
    </linearGradient>

    <linearGradient id="patient-actor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>

    <linearGradient id="doctor-actor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FAF5FF"/>
      <stop offset="100%" stop-color="#F3E8FF"/>
    </linearGradient>

    <linearGradient id="system-actor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F0FDF4"/>
      <stop offset="100%" stop-color="#DCFCE7"/>
    </linearGradient>

    <linearGradient id="admin-actor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>

    <linearGradient id="pill-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FAFAFE"/>
    </linearGradient>
  </defs>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap');
    * {{
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }}
    .boundary-title {{
      font-size: 15px;
      font-weight: 600;
      fill: #7C3AED;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }}
    .actor-title {{
      font-size: 17.5px;
      font-weight: 600;
      fill: #0F172A;
      text-anchor: start;
      letter-spacing: -0.2px;
    }}
    .actor-sub {{
      font-size: 13px;
      font-weight: 500;
      fill: #475569;
      text-anchor: start;
    }}
    .usecase-title {{
      font-size: 19.5px;
      font-weight: 600;
      fill: #1E293B;
      text-anchor: middle;
      dominant-baseline: central;
      letter-spacing: -0.1px;
    }}
    .conn-label {{
      font-size: 13.5px;
      font-weight: 600;
      fill: #047857;
      text-anchor: middle;
      dominant-baseline: central;
    }}
    .conn-label-doc {{
      font-size: 13.5px;
      font-weight: 600;
      fill: #86198F;
      text-anchor: middle;
      dominant-baseline: central;
    }}
  </style>

  <!-- Background Canvas -->
  <rect width="{WIDTH}" height="{HEIGHT}" fill="#FFFFFF"/>

  <!-- ================= SYSTEM BOUNDARY ================= -->
  <g transform="translate(415, 40)">
    <!-- Boundary Box -->
    <rect x="0" y="0" width="860" height="900" rx="22" ry="22" 
          fill="#FAF8FF" fill-opacity="0.6" stroke="#DDD6FE" stroke-width="1.8" stroke-dasharray="7 5"/>
    
    <!-- Boundary Tag / Badge -->
    <rect x="30" y="-17" width="360" height="34" rx="17" ry="17" fill="#EDE9FE" stroke="#C4B5FD" stroke-width="1.5"/>
    <text class="boundary-title" x="210" y="5" text-anchor="middle">System: QAI-OLI Screening Platform</text>
  </g>

  <!-- ================= 8 CLEAN USE CASES ================= -->
  <!-- UC Width = 610, Left = 540, Right = 1150 -->

  <!-- UC 1 -->
  <g id="uc1" transform="translate(540, 75)" filter="url(#pill-shadow)">
    <rect x="0" y="0" width="610" height="66" rx="33" ry="33" fill="url(#pill-grad)" stroke="#8B5CF6" stroke-width="1.8"/>
    <text class="usecase-title" x="305" y="33">1. Patient Registration &amp; Habit Profiling</text>
  </g>

  <!-- UC 2 -->
  <g id="uc2" transform="translate(540, 180)" filter="url(#pill-shadow)">
    <rect x="0" y="0" width="610" height="66" rx="33" ry="33" fill="url(#pill-grad)" stroke="#8B5CF6" stroke-width="1.8"/>
    <text class="usecase-title" x="305" y="33">2. Intraoral Image Capture &amp; IQA Quality Gate</text>
  </g>

  <!-- UC 3 -->
  <g id="uc3" transform="translate(540, 285)" filter="url(#pill-shadow)">
    <rect x="0" y="0" width="610" height="66" rx="33" ry="33" fill="url(#pill-grad)" stroke="#8B5CF6" stroke-width="1.8"/>
    <text class="usecase-title" x="305" y="33">3. Execute Quantum-Classical 4-Class Triage</text>
  </g>

  <!-- UC 4 -->
  <g id="uc4" transform="translate(540, 390)" filter="url(#pill-shadow)">
    <rect x="0" y="0" width="610" height="66" rx="33" ry="33" fill="url(#pill-grad)" stroke="#8B5CF6" stroke-width="1.8"/>
    <text class="usecase-title" x="305" y="33">4. Clinical Urgency &amp; Risk Staging</text>
  </g>

  <!-- UC 5 -->
  <g id="uc5" transform="translate(540, 495)" filter="url(#pill-shadow)">
    <rect x="0" y="0" width="610" height="66" rx="33" ry="33" fill="url(#pill-grad)" stroke="#8B5CF6" stroke-width="1.8"/>
    <text class="usecase-title" x="305" y="33">5. Inspect Dual Grad-CAM Saliency Heatmaps</text>
  </g>

  <!-- UC 6 -->
  <g id="uc6" transform="translate(540, 600)" filter="url(#pill-shadow)">
    <rect x="0" y="0" width="610" height="66" rx="33" ry="33" fill="url(#pill-grad)" stroke="#8B5CF6" stroke-width="1.8"/>
    <text class="usecase-title" x="305" y="33">6. Monitor Quantum Telemetry (QPS)</text>
  </g>

  <!-- UC 7 -->
  <g id="uc7" transform="translate(540, 705)" filter="url(#pill-shadow)">
    <rect x="0" y="0" width="610" height="66" rx="33" ry="33" fill="url(#pill-grad)" stroke="#8B5CF6" stroke-width="1.8"/>
    <text class="usecase-title" x="305" y="33">7. Generate Pathology Requisition Slip</text>
  </g>

  <!-- UC 8 -->
  <g id="uc8" transform="translate(540, 810)" filter="url(#pill-shadow)">
    <rect x="0" y="0" width="610" height="66" rx="33" ry="33" fill="url(#pill-grad)" stroke="#8B5CF6" stroke-width="1.8"/>
    <text class="usecase-title" x="305" y="33">8. Model Registry &amp; Audit Telemetry Logs</text>
  </g>


  <!-- ================= LEFT ACTORS (ZERO ICON-TEXT OVERLAP) ================= -->
  <!-- Actor 1: Patient (Upper Left) -->
  <g id="actor-patient" transform="translate(45, 65)" filter="url(#card-shadow)">
    <rect x="0" y="0" width="290" height="90" rx="15" ry="15" fill="url(#patient-actor-grad)" stroke="#3B82F6" stroke-width="1.8"/>
    <!-- Icon Circle -->
    <circle cx="42" cy="45" r="22" fill="#DBEAFE"/>
    <text x="42" y="52" font-size="20" text-anchor="middle">👤</text>
    <!-- Text Left-Aligned to prevent ANY overlap -->
    <text class="actor-title" x="76" y="40">Patient</text>
    <text class="actor-sub" x="76" y="62">(Screening Subject)</text>
  </g>

  <!-- Actor 2: Health Screener / ASHA Worker (PRIMARY OPERATOR) -->
  <g id="actor-screener" transform="translate(45, 250)" filter="url(#card-shadow)">
    <rect x="0" y="0" width="290" height="145" rx="15" ry="15" fill="url(#screener-actor-grad)" stroke="#2563EB" stroke-width="2.0"/>
    <!-- Icon Circle -->
    <circle cx="40" cy="42" r="20" fill="#BFDBFE"/>
    <text x="40" y="49" font-size="20" text-anchor="middle">📱</text>
    <!-- Text Left-Aligned with generous offset -->
    <text class="actor-title" x="72" y="37">Health Screener / ASHA</text>
    <text class="actor-sub" x="72" y="57">(Community / PHC Worker)</text>
    <!-- Centered Badges -->
    <rect x="25" y="80" width="240" height="25" rx="12.5" fill="#2563EB"/>
    <text x="145" y="96" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">⭐ PRIMARY OPERATOR</text>
    <rect x="25" y="112" width="240" height="22" rx="11" fill="#EFF6FF"/>
    <text x="145" y="127" font-size="11" font-weight="600" fill="#1E40AF" text-anchor="middle">Field Capture &amp; Triage Delivery</text>
  </g>


  <!-- ================= RIGHT ACTORS (ZERO ICON-TEXT OVERLAP) ================= -->
  <!-- Actor 3: QAI-OLI AI Engine -->
  <g id="actor-engine" transform="translate(1360, 155)" filter="url(#card-shadow)">
    <rect x="0" y="0" width="315" height="142" rx="16" ry="16" fill="url(#system-actor-grad)" stroke="#059669" stroke-width="2.0"/>
    <circle cx="40" cy="42" r="20" fill="#D1FAE5"/>
    <text x="40" y="49" font-size="20" text-anchor="middle">⚛️</text>
    <text class="actor-title" x="72" y="37" style="fill: #065F46;">QAI-OLI AI Engine</text>
    <text class="actor-sub" x="72" y="57" style="fill: #047857;">(PennyLane + PyTorch Service)</text>
    <rect x="35" y="80" width="245" height="24" rx="12" fill="#D1FAE5"/>
    <text x="157" y="96" font-size="12" font-weight="600" fill="#065F46" text-anchor="middle">ConvNeXt + DenseNet + 8Q-VQC</text>
    <rect x="35" y="110" width="245" height="22" rx="11" fill="#ECFDF5"/>
    <text x="157" y="125" font-size="11" font-weight="600" fill="#047857" text-anchor="middle">Automated Screening Inference</text>
  </g>

  <!-- Actor 4: Oral Oncologist / Clinician -->
  <g id="actor-doctor" transform="translate(1360, 475)" filter="url(#card-shadow)">
    <rect x="0" y="0" width="315" height="142" rx="16" ry="16" fill="url(#doctor-actor-grad)" stroke="#9333EA" stroke-width="2.0"/>
    <circle cx="40" cy="42" r="20" fill="#F3E8FF"/>
    <text x="40" y="49" font-size="20" text-anchor="middle">👨‍⚕️</text>
    <text class="actor-title" x="72" y="37" style="fill: #581C87;">Oral Oncologist / Doctor</text>
    <text class="actor-sub" x="72" y="57" style="fill: #7E22CE;">(Tertiary Specialist Reviewer)</text>
    <rect x="35" y="80" width="245" height="24" rx="12" fill="#9333EA"/>
    <text x="157" y="96" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">CLINICAL DECISION MAKER</text>
    <rect x="35" y="110" width="245" height="22" rx="11" fill="#FAF5FF"/>
    <text x="157" y="125" font-size="11" font-weight="600" fill="#6B21A8" text-anchor="middle">Biopsy Authorization &amp; Grad-CAM</text>
  </g>

  <!-- Actor 5: System Administrator -->
  <g id="actor-admin" transform="translate(1360, 795)" filter="url(#card-shadow)">
    <rect x="0" y="0" width="315" height="90" rx="15" ry="15" fill="url(#admin-actor-grad)" stroke="#64748B" stroke-width="1.8"/>
    <circle cx="42" cy="45" r="22" fill="#E2E8F0"/>
    <text x="42" y="52" font-size="20" text-anchor="middle">🛠️</text>
    <text class="actor-title" x="76" y="40">System Administrator</text>
    <text class="actor-sub" x="76" y="62">(AI Model Engineer / IT)</text>
  </g>


  <!-- ================= ZERO-OVERLAP CONNECTION LINES ================= -->
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    
    <!-- 1. Patient -> UC1: Straight Clean Line (Y=108) -->
    <path d="M 335 108 L 540 108" stroke="#3B82F6" stroke-width="2.0"/>
    <circle cx="537" cy="108" r="3.5" fill="#3B82F6"/>

    <!-- 2. Screener -> UC1: Exits y=280, curves up to UC1 at y=125 -->
    <path d="M 335 280 C 415 280, 460 125, 540 125" stroke="#2563EB" stroke-width="2.0" stroke-opacity="0.85"/>
    <circle cx="537" cy="125" r="3.5" fill="#2563EB"/>

    <!-- 3. Screener -> UC2: Exits y=300, curves to UC2 at y=213 -->
    <path d="M 335 300 C 415 300, 460 213, 540 213" stroke="#2563EB" stroke-width="2.0" stroke-opacity="0.85"/>
    <circle cx="537" cy="213" r="3.5" fill="#2563EB"/>

    <!-- 4. Screener -> UC3: Exits y=320, curves to UC3 at y=318 -->
    <path d="M 335 320 C 415 320, 460 318, 540 318" stroke="#2563EB" stroke-width="2.0" stroke-opacity="0.85"/>
    <circle cx="537" cy="318" r="3.5" fill="#2563EB"/>

    <!-- 5. Screener -> UC4: Exits y=340, curves to UC4 at y=423 -->
    <path d="M 335 340 C 415 340, 460 423, 540 423" stroke="#2563EB" stroke-width="2.0" stroke-opacity="0.85"/>
    <circle cx="537" cy="423" r="3.5" fill="#2563EB"/>

    <!-- 6. Screener -> UC7: Exits y=360, curves down to UC7 at y=738 -->
    <path d="M 335 360 C 415 360, 460 738, 540 738" stroke="#2563EB" stroke-width="2.0" stroke-opacity="0.85"/>
    <circle cx="537" cy="738" r="3.5" fill="#2563EB"/>


    <!-- ================= RIGHT CONNECTIONS ================= -->
    <!-- QAI-OLI ENGINE CONNECTIONS -->
    <!-- UC2 -> AI Engine: "Quality Gate" -->
    <path d="M 1150 213 C 1225 213, 1285 205, 1360 205" stroke="#059669" stroke-width="2.0"/>
    <circle cx="1153" cy="213" r="3.5" fill="#059669"/>

    <!-- UC3 -> AI Engine: "Tri-Stream VQC" -->
    <path d="M 1150 318 C 1225 318, 1285 245, 1360 245" stroke="#059669" stroke-width="2.0"/>
    <circle cx="1153" cy="318" r="3.5" fill="#059669"/>


    <!-- ORAL ONCOLOGIST CONNECTIONS -->
    <!-- UC4 -> Doctor: "Review Staging" -->
    <path d="M 1150 423 C 1225 423, 1285 520, 1360 520" stroke="#9333EA" stroke-width="2.0" stroke-opacity="0.85"/>
    <circle cx="1153" cy="423" r="3.5" fill="#9333EA"/>

    <!-- UC5 -> Doctor: "Inspect Grad-CAM" -->
    <path d="M 1150 528 C 1225 528, 1285 545, 1360 545" stroke="#9333EA" stroke-width="2.0" stroke-opacity="0.85"/>
    <circle cx="1153" cy="528" r="3.5" fill="#9333EA"/>

    <!-- UC6 -> Doctor: "Verify QPS Telemetry" -->
    <path d="M 1150 633 C 1225 633, 1285 570, 1360 570" stroke="#9333EA" stroke-width="2.0" stroke-opacity="0.85"/>
    <circle cx="1153" cy="633" r="3.5" fill="#9333EA"/>

    <!-- UC7 -> Doctor: "Sign Biopsy Slip" -->
    <path d="M 1150 738 C 1225 738, 1285 595, 1360 595" stroke="#9333EA" stroke-width="2.0" stroke-opacity="0.85"/>
    <circle cx="1153" cy="738" r="3.5" fill="#9333EA"/>


    <!-- SYSTEM ADMIN CONNECTION -->
    <!-- UC8 -> Admin: Straight horizontal line at y=840 -->
    <path d="M 1150 840 L 1360 840" stroke="#64748B" stroke-width="2.0"/>
    <circle cx="1153" cy="840" r="3.5" fill="#64748B"/>
  </g>

  <!-- Badges on AI Curves -->
  <g transform="translate(1255, 209)">
    <rect x="-64" y="-14" width="128" height="28" rx="14" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1.2"/>
    <text class="conn-label" x="0" y="0">Quality Gate</text>
  </g>

  <g transform="translate(1255, 281)">
    <rect x="-74" y="-14" width="148" height="28" rx="14" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1.2"/>
    <text class="conn-label" x="0" y="0">Tri-Stream VQC</text>
  </g>

  <!-- Badges on Doctor Curves -->
  <g transform="translate(1255, 465)">
    <rect x="-70" y="-14" width="140" height="28" rx="14" fill="#FAF5FF" stroke="#E9D5FF" stroke-width="1.2"/>
    <text class="conn-label-doc" x="0" y="0">Review Staging</text>
  </g>

  <g transform="translate(1255, 680)">
    <rect x="-72" y="-14" width="144" height="28" rx="14" fill="#FAF5FF" stroke="#E9D5FF" stroke-width="1.2"/>
    <text class="conn-label-doc" x="0" y="0">Sign Biopsy Slip</text>
  </g>

</svg>
"""

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>QAI-OLI Clinical Use Case Architecture</title>
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    background-color: #F8FAFC;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
  }}
  .diagram-container {{
    background: #FFFFFF;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    overflow: hidden;
  }}
  svg {{
    display: block;
  }}
</style>
</head>
<body>
<div class="diagram-container">
{svg_content}
</div>
</body>
</html>
"""

# Save temporary HTML for headless Edge rendering
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

# Render to PNG using Microsoft Edge
edge_candidates = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]
edge_path = next((p for p in edge_candidates if os.path.exists(p)), None)

if edge_path:
    file_url = "file:///" + os.path.abspath(html_path).replace("\\", "/")
    cmd = [
        edge_path,
        "--headless=new",
        "--disable-gpu",
        "--force-device-scale-factor=2",
        f"--screenshot={temp_png_path}",
        "--window-size=1780,1040",
        file_url
    ]
    subprocess.run(cmd, check=True)

    if os.path.exists(temp_png_path):
        img = Image.open(temp_png_path)
        if img.mode in ("RGBA", "LA"):
            bg = Image.new("RGB", img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[3])
            img = bg
        else:
            img = img.convert("RGB")
        img.save(out_png, "PNG")
        os.remove(temp_png_path)
    if os.path.exists(html_path):
        os.remove(html_path)
    print(f"[SUCCESS] Use Case diagram generated successfully to {out_png}")
