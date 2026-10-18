# 📚 Selected Literature Survey Reference Papers (1 to 7)

Ye saare 7 research papers aapke literature survey ke order ke according rename kiye gaye hain. In sabhi papers ki accuracy aapke project (**QAI-OLI: 83.77%**) se kam hai (54% se 83.3% ke beech) aur ye recent years (2025 pehle, fir 2024) ke hisab se arranged hain.

---

## 📑 Author Count & Citation Format Rule
- **Rule**: Agar 2 authors honge to dono ka naam (`Author1 and Author2 (Year)`), aur agar 2 se zyada honge to first author ke baad `et al.` (`Author1 et al. (Year)`).
- **Audit**: In saato papers ke title page par 3 ya usse zyada authors hain, isliye sabhi mein `FirstAuthor et al. (Year)` aayega.

| File | Authors on Title Page | Count | Citation Format | Paper Title | Reported Metric |
| :---: | :--- | :---: | :---: | :--- | :---: |
| **`1.pdf`** | Joy Naoum, Revana Salama, Ali Hamdi | 3 | **Naoum et al. (2025)** | Data-Augmented Multimodal Feature Fusion for Multiclass Visual Recognition of Oral Cancer Lesions | 54.97% - 82.57% |
| **`2.pdf`** | Rupam Mukherjee, Rajkumar Daniel, Soujanya Hazra, Shirin Dasgupta, Subhamoy Mandal | 5 | **Mukherjee et al. (2025)** | Multimodal RGB-HSI Feature Fusion with Incremental Meta-Learning for Oral Lesion Classification | 64.56% (Macro F1 66.23%) |
| **`3.pdf`** | Sophie A. Lloyd, Jacob P. Thönes, Safina S. Suratwala, Noor Zaghlula, Liang Lu, Joseph Paydarfar, Ethan K. Murphy, Sascha Spors, Ryan J. Halter | 9 | **Lloyd et al. (2025)** | Optimizing In Vivo Oral Lesion Classification from Electrical Impedance Spectroscopy Using Data-driven Approaches | 80.00% (AUC: 0.82) |
| **`4.pdf`** | Soujanya Hazra, Rupam Mukherjee, Rajkumar Daniel, Shirin Dasgupta, Subhamoy Mandal | 5 | **Hazra et al. (2025)** | Uncertainty-Aware Multimodal Fusion for Oral Lesion Classification | 79.40% (Macro F1 66.23%) |
| **`5.pdf`** | Joy Naoum, Revana Salama, Ali Hamdi | 3 | **Naoum et al. (2024)** | Deep Learning-Based Multiclass Classification of Oral Lesions with Stratified Augmentation | 83.30% (Recall 77.31%) |
| **`6.pdf`** | Revana Magdy, Joy Naoum, Ali Hamdi | 3 | **Magdy et al. (2024)** | Novel Architecture of RPA In Oral Cancer Lesion Detection | 81.00% (Image CNN) |
| **`7.pdf`** | Akshay Bhagwan Sonawane, Lena D. Swamikannan, Lakshman Tamil | 3 | **Sonawane et al. (2024)** | Robust Classification of Oral Cancer with Limited Training Data | 72.94% |

---

## 📝 Literature Survey Entries (Exact Report Text)

### [1.pdf] Naoum et al. (2025)
> **Naoum et al. (2025)**: This study investigates multi-class visual recognition of oral cancer lesions using a multimodal feature fusion network. The authors evaluate deep convolutional backbones across complex oral lesion categories, including healthy mucosa, benign sores, pre-cancer, and carcinoma. On the unaugmented 4-class clinical split, the model achieves an overall classification accuracy of 54.97% and an F1-score of 17.86% on malignant lesions, while reaching up to 82.57% under multimodal fusion. The results demonstrate that standard convolutional networks struggle significantly when differentiating between inflammatory ulcers and early dysplastic tissue. However, relying on synthetic generative augmentation introduced subtle image artifacts, and the baseline classifier frequently failed to distinguish early malignant lesions from benign conditions without overfitting [1].

### [2.pdf] Mukherjee et al. (2025)
> **Mukherjee et al. (2025)**: This research explores multi-class oral lesion identification across healthy tissue, benign lesions, pre-cancer, and carcinoma. The authors develop an Incremental Heuristic Meta-Learning (IHML) framework combined with multimodal RGB and Hyperspectral Imaging (HSI) feature fusion. Using a clinical patient dataset, the proposed ConvNeXt baseline delivers 52.52% accuracy, while the full multimodal HSI pipeline reaches an overall accuracy of 64.56% and a macro F1-score of 66.23%. The findings show that spectral data helps capture cellular changes better than standard RGB images alone. However, the system requires specialized hyperspectral cameras costing over $15,000, and the overall accuracy remains under 65%, making it unsuitable for rapid, cost-effective screening at rural health centers [2].

### [3.pdf] Lloyd et al. (2025)
> **Lloyd et al. (2025)**: The authors investigate an in vivo diagnostic method for identifying oral mucosal lesions across four clinical categories: healthy tissue, benign lesions, dysplasia, and cancer. The study implements Electrical Impedance Spectroscopy (EIS) to capture bio-impedance variations across oral cellular structures, using random forest and gradient boosting classifiers to evaluate the data. Tested on clinical trial patients, the system achieves a multi-category classification accuracy of 80.00% with an area under the curve (AUC) of 0.82. While the technique provides quantitative tissue measurements independent of camera lighting, it requires a physical sensor probe to directly touch tender or bleeding oral lesions, causing patient discomfort and introducing cross-contamination concerns during large-scale field screening [3].

### [4.pdf] Hazra et al. (2025)
> **Hazra et al. (2025)**: This study presents an uncertainty-aware Bayesian multimodal fusion network for oral lesion classification. The authors incorporate Monte Carlo dropout into deep convolutional backbones to estimate diagnostic prediction uncertainty when evaluating difficult oral tissue boundaries. Validated on a multi-modal clinical lesion dataset, the model achieves a macro F1-score of 66.23% and an overall classification accuracy of 79.40% across ambiguous lesion categories. The results confirm that quantifying prediction uncertainty helps flag borderline cases for manual specialist review. However, performing multiple stochastic forward passes increases per-image inference latency, and the model still struggles with false positives on benign inflammatory ulcers [4].

### [5.pdf] Naoum et al. (2024)
> **Naoum et al. (2024)**: This research examines automated oral lesion classification using stratified deep convolutional networks, focusing on ResNet-50 and EfficientNet-B7. The authors train the models on clinically captured white-light photographic datasets across multiple lesion categories, reporting an unaugmented baseline classification accuracy of 83.30%. The study demonstrates that deep convolutional backbones can extract discriminative oral mucosal features from photographic images. However, the model exhibits a significant drop in recall down to 77.31% when identifying pre-cancerous (OPMD) lesions, frequently confusing early dysplastic white patches with harmless frictional keratosis due to visual similarities in surface texture [5].

### [6.pdf] Magdy et al. (2024)
> **Magdy et al. (2024)**: The authors develop a computer-aided screening architecture that integrates deep convolutional neural networks with robotic process automation workflows for oral lesion detection. Evaluated on a clinical oral image repository, the standalone deep learning image classifier achieves an accuracy of 81.00% on raw intraoral photographs before integrating secondary electronic health record metadata. The findings show that automated image screening can streamline hospital triage queues. However, the standalone visual classification model struggles with specular reflections from intraoral saliva and variable camera angles, requiring strict manual lighting adjustments during image capture [6].

### [7.pdf] Sonawane et al. (2024)
> **Sonawane et al. (2024)**: This research evaluates deep convolutional neural networks for robust oral cancer classification under limited clinical training data constraints. The authors analyze classical convolutional backbones across clinically captured intraoral lesion datasets, reporting a multi-class classification accuracy of 72.94% on baseline photographic evaluations. While the study addresses data scarcity through transfer learning, standard point-estimate neural networks demonstrate susceptibility to overconfidence on ambiguous lesion margins and suffer performance drops when applied to uncurated patient images collected outside controlled clinical environments [7].
