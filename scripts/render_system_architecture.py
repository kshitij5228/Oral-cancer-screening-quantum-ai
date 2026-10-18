"""
Render System Architecture Diagram (HTML -> PNG & JPG)
Renders figures/architecture_diagrams/system_architecture.html to publication-grade 300 DPI images.
"""

import os
import subprocess
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
DIAGRAMS_DIR = os.path.join(PROJECT_ROOT, "figures", "architecture_diagrams")

html_path = os.path.join(DIAGRAMS_DIR, "system_architecture.html")
temp_png_path = os.path.join(DIAGRAMS_DIR, "system_architecture_temp.png")
out_png = os.path.join(DIAGRAMS_DIR, "system_architecture.png")

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
    "--window-size=1260,1440",
    file_url
]

print(f"Rendering System Architecture from {html_path}...")
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

print("[SUCCESS] System Architecture rendered successfully:")
print(f"  - PNG: {out_png}")
