"""
QAI-OLI Pre-Flight Clinical Image Quality & Out-of-Distribution (OOD) Gate
===========================================================================
Strict multi-tier validation to intercept non-oral photographs (selfies, faces,
everyday objects, food, landscape, clothing) and technically unusable images
(motion blur, extreme glare, extreme underexposure) before inference.

Stages:
1. Technical Fidelity: Laplacian variance (blur), mean luminance, specular glare.
2. Foreign Chromatic Rejection: Flags non-oral environments (greens, blues, outdoor tones).
3. Vascular Oral Mucosal Signature: Verifies red-dominant vascularized tissue (R > G, R > B)
   along with dentition (enamel) and leukoplakic plaque keratinization.
4. Extraoral Portrait Rejection: Detects full-facial skin distribution without oral cavity focus.
5. Auxiliary Deep Learning OOD Screening: Lightweight MobileNetV3 check for everyday ImageNet objects.
"""

import cv2
import numpy as np

# Cache for auxiliary MobileNet OOD model (lazy loaded)
_OOD_MODEL = None
_OOD_TRANSFORM = None
_OOD_CATEGORIES = None
_OOD_ATTEMPTED = False


def _get_ood_model():
    global _OOD_MODEL, _OOD_TRANSFORM, _OOD_CATEGORIES, _OOD_ATTEMPTED
    if _OOD_ATTEMPTED:
        return _OOD_MODEL, _OOD_TRANSFORM, _OOD_CATEGORIES
    _OOD_ATTEMPTED = True
    try:
        import torchvision.models as models
        weights = models.MobileNet_V3_Small_Weights.DEFAULT
        model = models.mobilenet_v3_small(weights=weights).eval()
        _OOD_CATEGORIES = weights.meta.get("categories", [])
        _OOD_TRANSFORM = weights.transforms()
        _OOD_MODEL = model
    except Exception as e:
        print(f"[Quality Gate] Auxiliary OOD model not loaded: {e}")
        _OOD_MODEL = None
    return _OOD_MODEL, _OOD_TRANSFORM, _OOD_CATEGORIES


def check_image_quality(img_bgr: np.ndarray) -> dict:
    if img_bgr is None or img_bgr.size == 0:
        return {
            "passed": False,
            "issues": ["Image could not be read or is corrupted."],
            "actionable_advice": "Please upload a valid JPEG, PNG, or WebP photograph of the oral lesion.",
            "scores": {},
        }

    h, w = img_bgr.shape[:2]
    total_pixels = float(h * w)

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    b = img_bgr[:, :, 0].astype(float)
    g = img_bgr[:, :, 1].astype(float)
    r = img_bgr[:, :, 2].astype(float)

    # -------------------------------------------------------------
    # 1. Technical Photographic Fidelity
    # -------------------------------------------------------------
    # Sharpness / Blur via Laplacian variance
    lap_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())

    # Exposure & Contrast
    mean_lum = float(np.mean(gray))
    contrast_std = float(np.std(gray))

    # Specular Glare (Saturation & overexposure clipping in all channels)
    glare_mask = (img_bgr[:, :, 0] > 245) & (img_bgr[:, :, 1] > 245) & (img_bgr[:, :, 2] > 245)
    glare_pct = float((np.sum(glare_mask) / total_pixels) * 100)

    # -------------------------------------------------------------
    # 2. Foreign Non-Oral Chromatic Screening
    # Real intra-oral mucosa exhibits zero saturated green or blue tones.
    # High green: vegetation, fruits (watermelon, apples), green clothing, walls.
    # High blue: denim, sky, blue clothing, wallpapers.
    # -------------------------------------------------------------
    green_mask = (hsv[:, :, 0] >= 35) & (hsv[:, :, 0] <= 85) & (hsv[:, :, 1] > 30) & (hsv[:, :, 2] > 30)
    blue_mask = (hsv[:, :, 0] >= 90) & (hsv[:, :, 0] <= 135) & (hsv[:, :, 1] > 30) & (hsv[:, :, 2] > 30)
    green_pct = float((np.sum(green_mask) / total_pixels) * 100)
    blue_pct = float((np.sum(blue_mask) / total_pixels) * 100)
    foreign_pct = green_pct + blue_pct

    # -------------------------------------------------------------
    # 3. Anatomical Oral Cavity Signatures
    # -------------------------------------------------------------
    # A. True Vascular Oral Mucosa (Tongue, Buccal Mucosa, Gums, Palate, Erythroplakia)
    # Mucosa is densely perfused with blood: Red strongly exceeds Green and Blue.
    vasc_mask = (r > 1.15 * g) & (r > 1.25 * b) & (r > 50) & (hsv[:, :, 1] > 30)
    vasc_pct = float((np.sum(vasc_mask) / total_pixels) * 100)

    # B. Oral Dentition (Teeth / Enamel / Restorations)
    # Bright, low-saturation off-white
    dentition_mask = (hsv[:, :, 1] < 45) & (hsv[:, :, 2] > 155) & (r > 110) & (g > 110) & (b > 90)
    dentition_pct = float((np.sum(dentition_mask) / total_pixels) * 100)

    # C. Keratinized Plaque (Leukoplakia / Exophytic Carcinoma white plaques)
    plaque_mask = (hsv[:, :, 1] < 55) & (hsv[:, :, 2] > 175) & (r > g) & (g >= b)
    plaque_pct = float((np.sum(plaque_mask) / total_pixels) * 100)

    # Composite Oral Cavity Coverage
    oral_coverage = min(100.0, vasc_pct + (dentition_pct * 0.6) + (plaque_pct * 0.5))

    # -------------------------------------------------------------
    # 4. Extraoral Facial Skin vs Oral Cavity Ratio
    # Facial skin (cheeks, forehead, nose, chin) has yellow-orange hue (H 8-25)
    # but lacks the deep vascular red perfusion of oral mucosa.
    # -------------------------------------------------------------
    face_skin_mask = (hsv[:, :, 0] >= 8) & (hsv[:, :, 0] <= 25) & (hsv[:, :, 1] >= 20) & (hsv[:, :, 1] <= 60) & (~vasc_mask)
    face_skin_pct = float((np.sum(face_skin_mask) / total_pixels) * 100)

    # -------------------------------------------------------------
    # 5. Out-of-Distribution (OOD) Object Check via Lightweight MobileNet
    # -------------------------------------------------------------
    ood_issue = None
    if vasc_pct < 40.0:  # Only evaluate if not overwhelming oral mucosa
        try:
            model, transform, categories = _get_ood_model()
            if model is not None and transform is not None:
                import torch
                from PIL import Image

                rgb_img = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
                pil_img = Image.fromarray(rgb_img)
                tensor = transform(pil_img).unsqueeze(0)
                with torch.no_grad():
                    out = model(tensor).squeeze(0).softmax(0)
                    top_prob, top_idx = torch.topk(out, 1)
                    prob = float(top_prob.item())
                    cat = categories[top_idx.item()].lower()

                    # Rejection threshold: confident everyday non-medical object (>60%)
                    medical_keywords = {"microscope", "organ", "tissue", "bandage", "band aid", "syringe", "pill"}
                    if prob > 0.60 and not any(k in cat for k in medical_keywords):
                        ood_issue = f"Non-medical object detected by visual classifier ({cat.title()} with {round(prob * 100, 1)}% confidence)."
        except Exception as ood_err:
            print(f"[Quality Gate] OOD check exception: {ood_err}")

    # -------------------------------------------------------------
    # Clinical Decision Evaluation
    # -------------------------------------------------------------
    issues = []
    advice = []

    # Check 1: Severe Blur
    if lap_var < 8.0:
        issues.append(f"Image is severely motion-blurred (Sharpness score: {round(lap_var, 1)}, threshold: 8.0).")
        advice.append("Hold camera steady and maintain a 10-15 cm focal distance from the lesion.")

    # Check 2: Severe Underexposure
    if mean_lum < 20.0:
        issues.append(f"Severely underexposed photograph (Mean luminance: {round(mean_lum, 1)} / 255).")
        advice.append("Illuminate the oral cavity with your smartphone torch or examination light.")
    elif mean_lum > 240.0:
        issues.append(f"Overexposed photograph (Mean luminance: {round(mean_lum, 1)} / 255).")
        advice.append("Avoid direct flash washout; position lighting slightly oblique to the lesion.")

    # Check 3: Specular Glare
    if glare_pct > 22.0:
        issues.append(f"Excessive specular glare reflection ({round(glare_pct, 1)}% overexposed surface).")
        advice.append("Gently dab pooling saliva with cotton gauze before photographing.")

    # Check 4: Foreign Non-Oral Chromatic Intrusion
    if foreign_pct > 8.0:
        issues.append(f"Non-oral scene or foreign objects detected ({round(foreign_pct, 1)}% green/blue non-mucosal tones).")
        advice.append("Capture only the oral cavity. Avoid background clothing, objects, or outdoor scenes.")

    # Check 5: Extraoral Facial Portrait / Selfie
    if face_skin_pct > 25.0 and vasc_pct < 20.0:
        issues.append(f"Extraoral facial portrait detected ({round(face_skin_pct, 1)}% facial skin vs {round(vasc_pct, 1)}% oral mucosa).")
        advice.append("Please zoom directly into the inside of the mouth (mucosa, tongue, cheek, or lesion). Do not upload full face selfies.")

    # Check 6: Insufficient Oral Mucosal Tissue
    if vasc_pct < 25.0 and oral_coverage < 35.0:
        issues.append(f"Insufficient human oral mucosal tissue ({round(vasc_pct, 1)}% mucosa, {round(oral_coverage, 1)}% oral coverage; minimum 25% required).")
        advice.append("Ensure the oral cavity (tongue, cheek, palate, gums, or lesion) dominates at least 35% of the frame.")

    # Check 7: Deep Learning OOD Object Rejection
    if ood_issue:
        issues.append(ood_issue)
        if not advice:
            advice.append("Please upload a photograph showing only the inside of the human mouth.")

    passed = len(issues) == 0

    return {
        "passed": passed,
        "issues": issues,
        "actionable_advice": " ".join(advice) if advice else "Image quality meets clinical screening standards.",
        "scores": {
            "sharpness_laplacian": round(lap_var, 1),
            "glare_percentage": round(glare_pct, 2),
            "brightness_mean": round(mean_lum, 1),
            "contrast_std": round(contrast_std, 1),
            "mucosa_percentage": round(vasc_pct, 1),
            "dentition_percentage": round(dentition_pct, 1),
            "oral_coverage": round(oral_coverage, 1),
            "foreign_percentage": round(foreign_pct, 1),
            "face_skin_percentage": round(face_skin_pct, 1),
        },
    }
