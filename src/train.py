"""
train.py — Train RandomForest, log everything to MLflow on DagsHub.

MLflow concepts used here:
- mlflow.start_run()     → starts a new experiment "run" (one training session)
- mlflow.log_param()     → logs a hyperparameter (e.g. n_estimators=100)
- mlflow.log_metric()    → logs a number result (e.g. f1_score=0.82)
- mlflow.sklearn.log_model() → saves the trained model artifact to MLflow
- mlflow.register_model()    → promotes it to the Model Registry with a name
"""

import os
import sys
import pandas as pd
import numpy as np
from dotenv import load_dotenv

from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    f1_score, accuracy_score, precision_score, recall_score, classification_report
)

import mlflow
import mlflow.sklearn
from mlflow.models.signature import infer_signature
from imblearn.over_sampling import SMOTE

# ── Load environment variables from .env ──────────────────────────────────────

load_dotenv()

# Tell MLflow where to send data (DagsHub remote server)
os.environ["MLFLOW_TRACKING_USERNAME"] = os.getenv("MLFLOW_TRACKING_USERNAME")
os.environ["MLFLOW_TRACKING_PASSWORD"] = os.getenv("MLFLOW_TRACKING_PASSWORD")
mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING_URI"))

# ── Config ────────────────────────────────────────────────────────────────────

DATA_PATH = "data/attrition.csv"

# MLflow experiment name — all runs will be grouped under this
EXPERIMENT_NAME = "employee-attrition"

# MLflow Model Registry name — this is how the API will load the model
MODEL_REGISTRY_NAME = "attrition-model"

# These columns carry zero information — same value for every row
# Keeping them would just add noise
COLS_TO_DROP = ["EmployeeCount", "EmployeeNumber", "Over18", "StandardHours"]

# Target column we want to predict
TARGET_COL = "Attrition"

# RandomForest hyperparameters — we'll log these to MLflow
# NEW:
# NEW — GradientBoosting params (doesn't support class_weight, SMOTE handles balance):
RF_PARAMS = {
    "n_estimators": 300,
    "max_depth": 5,
    "learning_rate": 0.05,
    "subsample": 0.8,
    "random_state": 42,
}

# Train/test split ratio
TEST_SIZE = 0.2  # 20% for testing, 80% for training

# ── Preprocessing ─────────────────────────────────────────────────────────────

def preprocess(df: pd.DataFrame):
    """
    Clean and encode the dataset for ML training.
    
    RandomForest (like most sklearn models) requires ALL inputs to be numbers.
    This function converts text columns to numbers.
    
    Returns:
        X — feature matrix (all columns except target)
        y — target vector (0 = stayed, 1 = left)
        feature_names — list of column names (needed for MLflow signature)
    """

    df = df.copy()

    # Drop useless columns
    df.drop(columns=COLS_TO_DROP, inplace=True)

    # Encode target: "Yes" → 1, "No" → 0
    df[TARGET_COL] = (df[TARGET_COL] == "Yes").astype(int)

    # Find all text (object) columns except the target
    # These need to be converted to numbers via LabelEncoder
    categorical_cols = df.select_dtypes(include="object").columns.tolist()
    if TARGET_COL in categorical_cols:
        categorical_cols.remove(TARGET_COL)

    print(f"  Encoding {len(categorical_cols)} categorical columns: {categorical_cols}")

    # LabelEncoder converts each unique text value to an integer
    # e.g. "Male" → 0, "Female" → 1
    le = LabelEncoder()
    for col in categorical_cols:
        df[col] = le.fit_transform(df[col])

    # Split into features (X) and target (y)
    X = df.drop(columns=[TARGET_COL])
    y = df[TARGET_COL]

    return X, y, X.columns.tolist()


# ── Training ──────────────────────────────────────────────────────────────────

def train():
    print(f"\n{'='*50}")
    print("TRAINING STARTING")
    print(f"{'='*50}\n")

    # ── Load data ──
    try:
        df = pd.read_csv(DATA_PATH)
        print(f"Loaded data: {df.shape[0]} rows, {df.shape[1]} columns")
    except FileNotFoundError:
        print(f"ERROR: Data file not found at '{DATA_PATH}'")
        sys.exit(1)

    # ── Preprocess ──
    print("\nPreprocessing data...")
    X, y, feature_names = preprocess(df)
    print(f"  Features: {X.shape[1]} columns, {X.shape[0]} rows")
    print(f"  Target distribution: {y.value_counts().to_dict()}")

    # ── Train/test split ──
    # We hold out 20% of data to evaluate the model on unseen examples
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=42, stratify=y
        # stratify=y ensures the 84/16 split is preserved in both train and test
    )
    print(f"\nBefore SMOTE — Train size: {X_train.shape[0]} rows")
    print(f"Test size: {X_test.shape[0]} rows")

    # SMOTE: Synthetic Minority Oversampling Technique
    # Creates synthetic "Yes" examples so model sees 50/50 split during training
    # IMPORTANT: only apply SMOTE to training data, NEVER to test data
    # (test data must reflect real-world distribution)
    smote = SMOTE(random_state=42)
    X_train, y_train = smote.fit_resample(X_train, y_train)
    print(f"After SMOTE  — Train size: {X_train.shape[0]} rows")
    print(f"  New target distribution: {dict(zip(*[v.tolist() for v in __import__('numpy').unique(y_train, return_counts=True)]))}")

    # ── Set up MLflow experiment ──
    # All runs will appear under this experiment name on DagsHub
    mlflow.set_experiment(EXPERIMENT_NAME)

    # ── Start MLflow run ──
    # Everything inside this block gets logged to DagsHub
    with mlflow.start_run(run_name="gradient-boosting-v1") as run:

        run_id = run.info.run_id
        print(f"\nMLflow run started. Run ID: {run_id}")

        # Log hyperparameters — so you can compare runs later
        print("\nLogging params to MLflow...")
        mlflow.log_params(RF_PARAMS)
        mlflow.log_param("test_size", TEST_SIZE)
        mlflow.log_param("train_rows", X_train.shape[0])
        mlflow.log_param("features", X_train.shape[1])

        # ── Train the model ──
        print("\nTraining RandomForest...")
        model = GradientBoostingClassifier(**RF_PARAMS)
        model.fit(X_train, y_train)
        print("  Training complete.")

        # ── Evaluate ──
        print("\nEvaluating on test set...")
        y_pred = model.predict(X_test)

        # F1 score is the KEY metric for imbalanced classification.
        # Accuracy alone is misleading — a model that always says "No"
        # gets 84% accuracy but never predicts attrition at all.
        # F1 balances precision and recall for the minority class.
        f1     = f1_score(y_test, y_pred)
        acc    = accuracy_score(y_test, y_pred)
        prec   = precision_score(y_test, y_pred)
        recall = recall_score(y_test, y_pred)

        print(f"  Accuracy : {acc:.4f}")
        print(f"  Precision: {prec:.4f}")
        print(f"  Recall   : {recall:.4f}")
        print(f"  F1 Score : {f1:.4f}  ← this is the gate metric")
        print(f"\n{classification_report(y_test, y_pred, target_names=['Stayed','Left'])}")

        # Log metrics to MLflow
        print("Logging metrics to MLflow...")
        mlflow.log_metric("f1_score", f1)
        mlflow.log_metric("accuracy", acc)
        mlflow.log_metric("precision", prec)
        mlflow.log_metric("recall", recall)

        # ── Log the model ──
        # infer_signature captures input/output shape — MLflow uses this
        # to validate inputs when serving the model later
        signature = infer_signature(X_train, model.predict(X_train))

        # NEW — replace with this:
        print("\nLogging and registering model to MLflow registry...")
        model_info = mlflow.sklearn.log_model(
            sk_model=model,
            name="model",
            signature=signature,
            input_example=X_train.iloc[:3],
            registered_model_name=MODEL_REGISTRY_NAME,
        )
        mv_version = model_info.registered_model_version
        print(f"  Registered: version {mv_version}")

        print(f"\n{'='*50}")
        print(f"TRAINING COMPLETE ✅")
        print(f"  Run ID : {run_id}")
        print(f"  F1     : {f1:.4f}")
        print(f"  Model  : {MODEL_REGISTRY_NAME} v{mv_version}")
        print(f"{'='*50}\n")

        # Write run_id to a file so gate.py can read it
        # (GitHub Actions passes data between steps via files)
        with open("mlflow_run_id.txt", "w") as f:
            f.write(run_id)
        print(f"Run ID saved to mlflow_run_id.txt for gate.py")


if __name__ == "__main__":
    train()
