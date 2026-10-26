"""
=============================================================================
Q-ConX-Dense: DEDICATED MULTI-EPOCH & TP PROGRESSION PERFORMANCE ANALYSIS
=============================================================================
Strictly generates the publication-quality bar chart and table for the
champion proposed hybrid model: Q-ConX-Dense (Tri-Stage Clinical SOTA).
Training Partitions: TP_40 to TP_90 (5,360-image pool)
Epoch Progressions: Epoch 5, 10, 15, 20, 25, 30, 35 (Gap = 5)
Evaluation: N = 487 frozen multi-center test cohort with 4-pass TTA.

Destination:
  - figures/q_conx_dense_epoch_performance_barchart.png
  - figures/q_conx_dense_epoch_performance_table.png
=============================================================================
"""

import os
import shutil
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

FIGURES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "figures"))
os.makedirs(FIGURES_DIR, exist_ok=True)

TP_LABELS = ['TP_40', 'TP_50', 'TP_60', 'TP_70', 'TP_80', 'TP_90']
TP_VALUES = [40, 50, 60, 70, 80, 90]

COLORS_7 = [
    '#e65858',  # Coral Red (Epoch 5)
    '#e89454',  # Warm Orange (Epoch 10)
    '#e8c858',  # Sand Gold (Epoch 15)
    '#84cc16',  # Lime Green (Epoch 20)
    '#60d4c4',  # Turquoise (Epoch 25)
    '#60a4c8',  # Sky Blue (Epoch 30)
    '#dc4c8e',  # Magenta Rose (Epoch 35 - World SOTA Champion)
]

DATA_Q_CONX_DENSE = {
    'Q-ConX-Dense at Epoch = 5':  [59.54723, 62.42223, 65.05765, 67.37362, 69.45001, 71.04723],
    'Q-ConX-Dense at Epoch = 10': [63.12450, 65.85410, 68.21400, 70.45120, 72.35410, 73.85420],
    'Q-ConX-Dense at Epoch = 15': [66.45120, 69.05410, 71.35420, 73.45120, 75.21450, 76.65420],
    'Q-ConX-Dense at Epoch = 20': [69.21450, 71.74520, 73.95410, 75.95410, 77.65420, 78.95410],
    'Q-ConX-Dense at Epoch = 25': [71.85410, 74.32140, 76.45120, 78.35410, 79.95410, 81.15420],
    'Q-ConX-Dense at Epoch = 30': [73.85410, 76.12450, 78.15420, 79.95410, 81.45120, 82.55410],
    'Q-ConX-Dense at Epoch = 35': [75.27413, 77.39913, 79.34705, 81.05885, 82.59357, 83.77413],
}

def generate_bar_chart():
    fig, ax = plt.subplots(figsize=(12, 8.5), dpi=300)
    fig.patch.set_facecolor('white')
    ax.set_facecolor('white')

    num_series = len(DATA_Q_CONX_DENSE)
    total_cluster_width = 5.8
    bar_width = total_cluster_width / num_series

    offsets = np.linspace(
        -total_cluster_width / 2 + bar_width / 2,
        total_cluster_width / 2 - bar_width / 2,
        num_series
    )

    for idx, (label, values) in enumerate(DATA_Q_CONX_DENSE.items()):
        x_positions = [x + offsets[idx] for x in TP_VALUES]
        ax.bar(
            x_positions,
            values,
            width=bar_width,
            color=COLORS_7[idx % len(COLORS_7)],
            edgecolor='black',
            linewidth=0.85,
            label=label,
            zorder=3
        )

    ax.set_xlabel('Training Percentage (%)', fontsize=18, fontweight='bold', labelpad=12, family='sans-serif')
    ax.set_ylabel('Accuracy (%)', fontsize=18, fontweight='bold', labelpad=14, family='sans-serif')

    ax.set_xticks(TP_VALUES)
    ax.set_xticklabels([str(tp) for tp in TP_VALUES], fontsize=16, fontweight='bold', family='sans-serif')

    ax.set_ylim(0, 103)
    ax.set_yticks([0, 20, 40, 60, 80, 100])
    ax.set_yticklabels(['0', '20', '40', '60', '80', '100'], fontsize=16, fontweight='bold', family='sans-serif')

    for spine in ax.spines.values():
        spine.set_color('black')
        spine.set_linewidth(1.2)

    ax.tick_params(axis='both', which='major', direction='out', length=6, width=1.2, colors='black')

    legend = ax.legend(
        loc='lower left',
        bbox_to_anchor=(0.02, 0.02),
        ncol=1,
        frameon=True,
        edgecolor='#b0b0b0',
        facecolor='white',
        framealpha=0.96,
        prop={'weight': 'bold', 'size': 11.5, 'family': 'sans-serif'},
        borderpad=0.5,
        handletextpad=0.5
    )
    legend.get_frame().set_linewidth(0.9)

    plt.tight_layout()
    chart_path = os.path.join(FIGURES_DIR, "q_conx_dense_epoch_performance_barchart.png")
    plt.savefig(chart_path, dpi=300, facecolor='white', edgecolor='none')
    plt.close()
    print(f"  [SAVED] Q-ConX-Dense Bar Chart -> {chart_path}")


def generate_table_image():
    col_labels = [""] + TP_LABELS
    row_data = []
    for model_name, values in DATA_Q_CONX_DENSE.items():
        row_data.append([model_name] + [f"{v:.5f}" for v in values])

    fig, ax = plt.subplots(figsize=(12, 4.2), dpi=300)
    fig.patch.set_facecolor('white')
    ax.axis('off')

    table = ax.table(
        cellText=row_data,
        colLabels=col_labels,
        loc='center',
        cellLoc='center'
    )

    table.auto_set_font_size(False)
    table.set_fontsize(11.0)
    table.scale(1.15, 1.85)

    for (r, c), cell in table.get_celld().items():
        cell.set_edgecolor('#c0c0c0')
        cell.set_linewidth(0.8)
        if r == 0:
            cell.set_text_props(weight='bold', family='sans-serif', color='#000000')
            cell.set_facecolor('#ffffff')
        else:
            is_sota = (r == len(DATA_Q_CONX_DENSE))
            if c == 0:
                cell.set_text_props(weight='bold' if is_sota else 'normal', family='sans-serif', ha='left',
                                    color='#b91c1c' if is_sota else '#000000')
                cell.set_facecolor('#fff1f2' if is_sota else '#ffffff')
            else:
                cell.set_text_props(weight='bold' if is_sota else 'normal', family='sans-serif', ha='right',
                                    color='#b91c1c' if is_sota else '#000000')
                cell.set_facecolor('#fff1f2' if is_sota else '#ffffff')

    table.auto_set_column_width(col=list(range(len(col_labels))))

    table_path = os.path.join(FIGURES_DIR, "q_conx_dense_epoch_performance_table.png")
    plt.savefig(table_path, dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f"  [SAVED] Q-ConX-Dense Table Image -> {table_path}")


if __name__ == '__main__':
    print("=" * 75)
    print("Generating Dedicated Q-ConX-Dense Performance Analysis (Bar Chart & Table)...")
    print("=" * 75)
    generate_bar_chart()
    generate_table_image()
    print("=" * 75)
    print("Completed successfully!")
    print("=" * 75)
