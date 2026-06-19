"""
validate.py — Data validation before training.

In MLOps, we NEVER trust that the input data is clean.
This script runs before train.py in the CI/CD pipeline.
If any check fails, it exits with code 1 — which causes
GitHub Actions to stop the pipeline immediately.
"""

import sys
import pandas as pd

# ── Config ────────────────────────────────────────────────────────────────────

DATA_PATH = "data/attrition.csv"

# These are all 35 columns we expect in the IBM HR dataset.
# If someone swaps the CSV with a different file, this catches it.
EXPECTED_COLUMNS = [
    "Age", "Attrition", "BusinessTravel", "DailyRate", "Department",
    "DistanceFromHome", "Education", "EducationField", "EmployeeCount",
    "EmployeeNumber", "EnvironmentSatisfaction", "Gender", "HourlyRate",
    "JobInvolvement", "JobLevel", "JobRole", "JobSatisfaction",
    "MaritalStatus", "MonthlyIncome", "MonthlyRate", "NumCompaniesWorked",
    "Over18", "OverTime", "PercentSalaryHike", "PerformanceRating",
    "RelationshipSatisfaction", "StandardHours", "StockOptionLevel",
    "TotalWorkingYears", "TrainingTimesLastYear", "WorkLifeBalance",
    "YearsAtCompany", "YearsInCurrentRole", "YearsSinceLastPromotion",
    "YearsWithCurrManager"
]

# Minimum % of minority class (Attrition=Yes).
# If it drops below this, the model won't learn meaningful patterns.
MIN_MINORITY_CLASS_RATIO = 0.10

# ── Validation functions ───────────────────────────────────────────────────────

def check_schema(df: pd.DataFrame) -> None:
    """Check that all expected columns are present."""
    print("Running schema check...")

    missing_cols = set(EXPECTED_COLUMNS) - set(df.columns)
    extra_cols = set(df.columns) - set(EXPECTED_COLUMNS)

    if missing_cols:
        # exit(1) tells GitHub Actions: this step FAILED, stop the pipeline
        print(f"SCHEMA ERROR: Missing columns: {missing_cols}")
        sys.exit(1)

    if extra_cols:
        # Extra columns are just a warning — not a hard failure
        print(f"  WARNING: Unexpected extra columns found: {extra_cols}")

    print(f"  Schema check passed. All {len(EXPECTED_COLUMNS)} expected columns present.")


def check_nulls(df: pd.DataFrame) -> None:
    """Check that there are no missing values anywhere in the dataset."""
    print("Running null check...")

    null_counts = df.isnull().sum()
    cols_with_nulls = null_counts[null_counts > 0]

    if not cols_with_nulls.empty:
        print(f"NULL ERROR: Found nulls in columns:\n{cols_with_nulls}")
        sys.exit(1)

    print(f"  Null check passed. 0 missing values across {df.shape[0]} rows.")


def check_class_balance(df: pd.DataFrame) -> None:
    """
    Check that the minority class (Attrition=Yes) is at least 10%.
    
    Why this matters: If only 1% of employees have Attrition=Yes,
    a model that always predicts "No" gets 99% accuracy — but is useless.
    We need enough "Yes" examples to actually learn from.
    """
    print("Running class balance check...")

    value_counts = df["Attrition"].value_counts(normalize=True)

    if "Yes" not in value_counts:
        print("CLASS BALANCE ERROR: 'Yes' class not found in Attrition column.")
        sys.exit(1)

    yes_ratio = value_counts["Yes"]

    if yes_ratio < MIN_MINORITY_CLASS_RATIO:
        print(
            f"CLASS BALANCE ERROR: 'Yes' class is only {yes_ratio:.1%} of data. "
            f"Minimum required: {MIN_MINORITY_CLASS_RATIO:.0%}"
        )
        sys.exit(1)

    print(f"  Class balance check passed. Attrition=Yes: {yes_ratio:.1%} (minimum: {MIN_MINORITY_CLASS_RATIO:.0%})")


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    print(f"\n{'='*50}")
    print("DATA VALIDATION STARTING")
    print(f"{'='*50}\n")

    # Load the dataset
    try:
        df = pd.read_csv(DATA_PATH)
        print(f"Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns\n")
    except FileNotFoundError:
        print(f"ERROR: Data file not found at '{DATA_PATH}'")
        sys.exit(1)

    # Run all three checks in order
    check_schema(df)
    check_nulls(df)
    check_class_balance(df)

    print(f"\n{'='*50}")
    print("ALL VALIDATION CHECKS PASSED ✅")
    print(f"{'='*50}\n")


if __name__ == "__main__":
    main()
