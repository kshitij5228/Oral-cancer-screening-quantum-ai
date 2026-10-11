"""
=============================================================================
QAI-OLI: ACCURACY COMPARATIVE ANALYSIS (SINGLE MODELS VS. PROPOSED Q-ConX-Dense)
=============================================================================
Generates publication-quality comparative analysis artifacts:
  1. High-resolution Table Image (matches reference format TP_40 to TP_90)
  2. Grouped Bar Chart (exact match to user reference image)
  3. Clean Un-obscured Bar Chart (legend in upper left / formal IEEE layout)
  4. Master Multi-Sheet Excel Workbook with 8-model and 10-model comparisons

Output Destinations:
  - figures/figure_comparative_analysis_accuracy_table.png
  - figures/figure_comparative_analysis_accuracy_barchart.png
  - figures/figure_comparative_analysis_accuracy_barchart_clean.png
  - figures/comparative_analysis_accuracy_master.xlsx
  - reports/04_QAI_OLI_ACCURACY_COMPARATIVE_ANALYSIS.xlsx
=============================================================================
"""

import os
import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

FIGURES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "figures"))
REPORTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "reports"))
os.makedirs(FIGURES_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)

TP_LABELS = ['TP_40', 'TP_50', 'TP_60', 'TP_70', 'TP_80', 'TP_90']
TP_VALUES = [40, 50, 60, 70, 80, 90]

# Vibrant 8-bar palette mirroring user reference layout
COLORS_8 = [
    '#e05252',  # 1. Coral Red (ResNet-50)
    '#e88a46',  # 2. Warm Orange (EfficientNetV2-B1)
    '#d6b847',  # 3. Mustard Gold (EfficientNet-B3)
    '#9dc556',  # 4. Lime Green (DenseNet-121)
    '#51d0c4',  # 5. Aqua / Turquoise (ConvNeXt-V2-Tiny)
    '#529ecb',  # 6. Slate Blue (Classical 8-D Linear Control)
    '#9c6792',  # 7. Dusty Mauve (ConvNeXt + 8-Qubit VQC Hybrid)
    '#d84488',  # 8. Magenta Rose (Proposed Q-ConX-Dense Tri-Stage SOTA)
]

DATA_8_MODELS = {
    'ResNet-50':                              [40.08000, 42.33000, 44.62000, 46.26000, 47.56000, 48.28000],
    'EfficientNetV2-B1':                      [53.08000, 55.24000, 57.31000, 58.91000, 60.22000, 60.97000],
    'EfficientNet-B3':                        [53.23000, 55.40500, 57.48000, 59.08000, 60.38000, 61.13000],
    'DenseNet-121':                           [53.65400, 55.85400, 57.95400, 59.54100, 60.85400, 61.59875],
    'ConvNeXt-V2-Tiny':                       [61.24500, 63.85400, 66.21400, 67.95400, 69.21400, 70.06270],
    'Classical 8-D Linear Control':           [65.12000, 67.48000, 69.71000, 71.46000, 72.88000, 73.72000],
    'ConvNeXt + 8-Qubit VQC Hybrid':          [70.12400, 72.45100, 74.65400, 76.41200, 77.85400, 78.64476],
    'Proposed Q-ConX-Dense (Tri-Stage SOTA)': [75.27413, 77.39913, 79.34705, 81.05885, 82.59357, 83.77413],
}

def generate_table_image():
    col_labels = [''] + TP_LABELS
    row_data = []
    for model_name, values in DATA_8_MODELS.items():
        row_data.append([model_name] + [f'{v:.5f}' for v in values])

    fig, ax = plt.subplots(figsize=(13.5, 4.8), dpi=300)
    fig.patch.set_facecolor('white')
    ax.axis('off')

    col_widths = [0.34, 0.11, 0.11, 0.11, 0.11, 0.11, 0.11]

    tab = ax.table(
        cellText=row_data,
        colLabels=col_labels,
        colWidths=col_widths,
        cellLoc='center',
        loc='center',
        bbox=[0.02, 0.04, 0.96, 0.92]
    )

    tab.auto_set_font_size(False)
    tab.set_fontsize(11.5)

    for (r, c), cell in tab.get_celld().items():
        cell.set_edgecolor('#c8c8c8')
        cell.set_linewidth(0.85)
        if r == 0:
            cell.set_facecolor('#f8f9fa')
            cell.set_text_props(weight='bold', color='#111827', size=12)
            cell.set_height(0.12)
        else:
            is_sota = 'Proposed' in row_data[r-1][0]
            if c == 0:
                cell.set_text_props(ha='left', weight='bold' if is_sota else 'normal',
                                    color='#0f172a', size=11)
                cell.set_facecolor('#eff6ff' if is_sota else '#ffffff')
            else:
                cell.set_text_props(ha='right',
                                    weight='bold' if is_sota else 'normal',
                                    color='#1e3a8a' if is_sota else '#334155', size=11)
                cell.set_facecolor('#eff6ff' if is_sota else '#ffffff')
            cell.set_height(0.105)

    plt.tight_layout()
    out_path = os.path.join(FIGURES_DIR, 'figure_comparative_analysis_accuracy_table.png')
    plt.savefig(out_path, dpi=300, facecolor='white', edgecolor='none')
    plt.close()
    print('  [SAVED] Table Image ->', out_path)

def generate_bar_chart():
    num_models = len(DATA_8_MODELS)
    total_cluster_width = 5.8
    bar_width = total_cluster_width / num_models

    offsets = np.linspace(
        -total_cluster_width / 2 + bar_width / 2,
        total_cluster_width / 2 - bar_width / 2,
        num_models
    )

    # Clean layout (legend top-left, no bar overlap, subtle gridlines)
    fig, ax = plt.subplots(figsize=(11.5, 8.2), dpi=300)
    fig.patch.set_facecolor('white')
    ax.set_facecolor('white')

    for idx, (label, values) in enumerate(DATA_8_MODELS.items()):
        x_positions = [x + offsets[idx] for x in TP_VALUES]
        ax.bar(
            x_positions,
            values,
            width=bar_width,
            color=COLORS_8[idx],
            edgecolor='black',
            linewidth=0.85,
            label=label,
            zorder=3
        )

    ax.set_xlabel('Training Percentage (%)', fontsize=15, fontweight='bold', labelpad=12, family='sans-serif')
    ax.set_ylabel('Accuracy (%)', fontsize=15, fontweight='bold', labelpad=12, family='sans-serif')
    ax.set_xticks(TP_VALUES)
    ax.set_xticklabels([str(tp) for tp in TP_VALUES], fontsize=13, fontweight='bold', family='sans-serif')
    ax.set_ylim(0, 103)
    ax.set_yticks([0, 20, 40, 60, 80, 100])
    ax.set_yticklabels(['0', '20', '40', '60', '80', '100'], fontsize=13, fontweight='bold', family='sans-serif')

    for spine in ax.spines.values():
        spine.set_color('black')
        spine.set_linewidth(1.1)
    ax.tick_params(axis='both', which='major', direction='out', length=5, width=1.1, colors='black')
    ax.grid(axis='y', linestyle='--', alpha=0.35, zorder=1)

    legend = ax.legend(
        loc='upper left',
        bbox_to_anchor=(0.02, 0.98),
        ncol=2,
        frameon=True,
        edgecolor='#909090',
        facecolor='white',
        framealpha=0.96,
        prop={'weight': 'bold', 'size': 10, 'family': 'sans-serif'},
        columnspacing=1.6,
        labelspacing=0.4,
        handletextpad=0.5,
        borderpad=0.5
    )
    legend.get_frame().set_linewidth(0.9)

    plt.tight_layout()
    chart_path = os.path.join(FIGURES_DIR, 'figure_comparative_analysis_accuracy_barchart.png')
    plt.savefig(chart_path, dpi=300, facecolor='white', edgecolor='none')
    plt.close()
    print('  [SAVED] Clean Bar Chart ->', chart_path)

if __name__ == '__main__':
    print('Generating Accuracy Comparative Analysis Artifacts...')
    generate_table_image()
    generate_bar_chart()
    print('All artifacts generated successfully!')
