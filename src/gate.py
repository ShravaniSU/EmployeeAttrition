"""
gate.py — Model quality gate.

Reads the F1 score from the latest MLflow run.
If F1 < threshold → exits with code 1 → GitHub Actions pipeline FAILS.
If F1 >= threshold → exits with code 0 → pipeline continues to Docker build.

This script is Step 4 in the CI/CD pipeline, running AFTER train.py.
It reads the run ID from mlflow_run_id.txt which train.py wrote.
"""

import os
import sys
from dotenv import load_dotenv
import mlflow

# ── Load environment ───────────────────────────────────────────────────────────

load_dotenv()

os.environ["MLFLOW_TRACKING_USERNAME"] = os.getenv("MLFLOW_TRACKING_USERNAME")
os.environ["MLFLOW_TRACKING_PASSWORD"] = os.getenv("MLFLOW_TRACKING_PASSWORD")
mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING_URI"))

# ── Config ────────────────────────────────────────────────────────────────────

F1_THRESHOLD = 0.40  # Minimum acceptable F1 score for deployment
RUN_ID_FILE  = "mlflow_run_id.txt"  # Written by train.py

# ── Gate logic ────────────────────────────────────────────────────────────────

def main():
    print(f"\n{'='*50}")
    print("MODEL QUALITY GATE")
    print(f"{'='*50}\n")

    # ── Read run ID written by train.py ──
    # GitHub Actions steps share a filesystem, so train.py writes the run ID
    # to a file and gate.py reads it — simple but effective
    try:
        with open(RUN_ID_FILE, "r") as f:
            run_id = f.read().strip()
        print(f"Run ID loaded: {run_id}")
    except FileNotFoundError:
        print(f"ERROR: '{RUN_ID_FILE}' not found. Did train.py run successfully?")
        sys.exit(1)

    # ── Fetch metrics from MLflow ──
    print(f"Fetching metrics from MLflow...")
    try:
        run = mlflow.get_run(run_id)
    except Exception as e:
        print(f"ERROR: Could not fetch MLflow run: {e}")
        sys.exit(1)

    metrics = run.data.metrics
    print(f"  All logged metrics: {metrics}")

    # ── Check F1 score ──
    if "f1_score" not in metrics:
        print("ERROR: 'f1_score' not found in run metrics. Did train.py log it?")
        sys.exit(1)

    f1 = metrics["f1_score"]

    print(f"\n  F1 Score  : {f1:.4f}")
    print(f"  Threshold : {F1_THRESHOLD}")

    # ── Gate decision ──
    if f1 < F1_THRESHOLD:
        print(f"\n❌ GATE FAILED")
        print(f"   F1 score {f1:.4f} is below threshold {F1_THRESHOLD}")
        print(f"   Model will NOT be deployed.")
        print(f"   Fix: tune hyperparameters, add features, or check data quality.")
        sys.exit(1)  # Non-zero exit → GitHub Actions marks step as FAILED
    else:
        print(f"\n✅ GATE PASSED")
        print(f"   F1 score {f1:.4f} meets threshold {F1_THRESHOLD}")
        print(f"   Proceeding to Docker build and deployment.")
        sys.exit(0)  # Zero exit → pipeline continues


if __name__ == "__main__":
    main()
