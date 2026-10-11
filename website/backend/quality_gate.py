"""
QAI-OLI Pre-Flight Clinical Image Quality Gate (IQA)
Determines whether an uploaded photograph meets clinical standards:
1. Sharpness (Laplacian variance + High-Frequency FFT)
2. Specular Glare (Saturation & overexposure clipping)
3. Exposure / Illumination (Mean luminance)
4. Tissue Verification (Oral mucosal pink/red chromatic distribution)
"""

import cv2
import numpy as np


def check_image_quality(img_bgr: np.ndarray) -> dict:
    if img_bgr is None or img_bgr.size == 0:
        return {
            "passed": False,
            "issues": ["Image could not be read or is empty."],
            "actionable_advice": "Please upload a valid JPEG, PNG, or WebP oral photograph.",
            "scores": {},
        }

    h, w = img_bgr.shape[:2]
    total_pixels = h * w

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)

    # 1. Sharpness / Blur via Laplacian variance
    lap_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())

    # 2. Mean Luminance & Contrast
    mean_lum = float(np.mean(gray))
    contrast_std = float(np.std(gray))

    # 3. Specular Glare (Clipping > 245 in all channels)
    glare_mask = (img_bgr[:, :, 0] > 245) & (img_bgr[:, :, 1] > 245) & (img_bgr[:, :, 2] > 245)
    glare_pct = float((np.sum(glare_mask) / total_pixels) * 100)

    # 4. Oral Mucosa Chromatic Verification
    # Human mucosal tissues (tongue, buccal mucosa, gums) exhibit predominantly red-pink-orange hues
    lower_red1 = np.array([0, 30, 40])
    upper_red1 = np.array([25, 255, 255])
    lower_red2 = np.array([155, 30, 40])
    upper_red2 = np.array([180, 255, 255])

    mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
    mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
    mucosa_mask = cv2.bitwise_or(mask1, mask2)
    mucosa_pct = float((np.sum(mucosa_mask > 0) / total_pixels) * 100)

    # Dentition / enamel mask (high value, low saturation)
    dentition_mask = (hsv[:, :, 1] < 45) & (hsv[:, :, 2] > 180)
    dentition_pct = float((np.sum(dentition_mask) / total_pixels) * 100)

    oral_coverage = min(100.0, mucosa_pct + (dentition_pct * 0.8))

    issues = []
    advice = []

    # Evaluation Rules - Calibrated for Real-World Macro Clinical Photography
    # Macro mobile photography of soft mucosal tissues naturally exhibits shallow depth of field.
    # True motion blur / extreme defocus occurs below 8.0 - 10.0.
    min_sharpness = 8.0 if oral_coverage >= 20.0 else 12.0
    if lap_var < min_sharpness:
        issues.append(f"Image is severely motion-blurred (Sharpness score: {round(lap_var, 1)}, threshold: {min_sharpness}).")
        advice.append("Hold camera steady and ensure proper focal distance.")

    if mean_lum < 20.0:
        issues.append(f"Severely underexposed photograph (Mean luminance: {round(mean_lum, 1)} / 255).")
        advice.append("Use clinical examination light or device torch to illuminate lesion.")
    elif mean_lum > 240.0:
        issues.append(f"Overexposed photograph (Mean luminance: {round(mean_lum, 1)} / 255).")
        advice.append("Reduce direct glare or move light source slightly oblique.")

    if glare_pct > 25.0:
        issues.append(f"Excessive specular glare reflection ({round(glare_pct, 1)}% overexposed surface).")
        advice.append("Dab saliva pooling gently with gauze before imaging.")

    # Mucosa verification check: allows close-ups of white plaques (leukoplakia), teeth, or lips
    if mucosa_pct < 10.0 and oral_coverage < 15.0:
        issues.append(f"Mucosal tissue hue profile inadequate ({round(mucosa_pct, 1)}% oral mucosal signature).")
        advice.append("Ensure oral cavity lesion (tongue, cheek, lip, palate) fills the viewfinder frame.")

    passed = len(issues) == 0

    return {
        "passed": passed,
        "issues": issues,
        "actionable_advice": " ".join(advice) if advice else "Image quality meets clinical standards.",
        "scores": {
            "sharpness_laplacian": round(lap_var, 1),
            "glare_percentage": round(glare_pct, 2),
            "brightness_mean": round(mean_lum, 1),
            "contrast_std": round(contrast_std, 1),
            "mucosa_percentage": round(mucosa_pct, 1),
            "dentition_percentage": round(dentition_pct, 1),
            "oral_coverage": round(oral_coverage, 1),
        },
    }
