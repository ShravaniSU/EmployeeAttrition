"""
main.py — FastAPI app for serving attrition predictions.

On startup, loads the latest model from MLflow Model Registry.
Exposes two endpoints:
  GET  /health  → returns API status + model load status
  POST /predict → takes employee features, returns attrition prediction
"""

import os
import logging
from contextlib import asynccontextmanager

import mlflow
import mlflow.sklearn
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# ── Logging setup ─────────────────────────────────────────────────────────────

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Load environment ───────────────────────────────────────────────────────────

load_dotenv()

os.environ["MLFLOW_TRACKING_USERNAME"] = os.getenv("MLFLOW_TRACKING_USERNAME")
os.environ["MLFLOW_TRACKING_PASSWORD"] = os.getenv("MLFLOW_TRACKING_PASSWORD")
mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING_URI"))

# ── Config ────────────────────────────────────────────────────────────────────

MODEL_REGISTRY_NAME = "attrition-model"
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "*").split(",")
    if origin.strip()
]

# Load "Production" stage if available, otherwise latest version
MODEL_URI = f"models:/{MODEL_REGISTRY_NAME}/latest"

# ── Global model variable ─────────────────────────────────────────────────────

# We store the model here after loading so every request reuses it
# Loading from MLflow on every request would be too slow
model = None


# ── Lifespan: runs on startup and shutdown ────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan handler.
    Code before 'yield' runs on startup.
    Code after 'yield' runs on shutdown.
    
    We load the model here so it's ready before the first request comes in.
    """
    global model
    logger.info(f"Loading model from MLflow registry: {MODEL_URI}")
    try:
        model = mlflow.sklearn.load_model(MODEL_URI)
        logger.info("Model loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        # We don't crash here — /health will report model as unavailable
        model = None
    yield
    # Shutdown logic (nothing needed here)
    logger.info("Shutting down API.")


# ── FastAPI app ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="Employee Attrition Prediction API",
    description="Predicts whether an employee is likely to leave the company.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request schema ────────────────────────────────────────────────────────────

class EmployeeFeatures(BaseModel):
    """
    Input schema for /predict endpoint.
    These are the 30 features the model was trained on
    (35 original columns minus 4 dropped + 1 target).
    
    Pydantic validates types automatically — if someone sends
    a string where an int is expected, FastAPI returns a 422 error.
    """
    Age: int = Field(..., example=35)
    BusinessTravel: int = Field(..., example=1)
    DailyRate: int = Field(..., example=800)
    Department: int = Field(..., example=2)
    DistanceFromHome: int = Field(..., example=5)
    Education: int = Field(..., example=3)
    EducationField: int = Field(..., example=2)
    EnvironmentSatisfaction: int = Field(..., example=3)
    Gender: int = Field(..., example=1)
    HourlyRate: int = Field(..., example=65)
    JobInvolvement: int = Field(..., example=3)
    JobLevel: int = Field(..., example=2)
    JobRole: int = Field(..., example=4)
    JobSatisfaction: int = Field(..., example=3)
    MaritalStatus: int = Field(..., example=1)
    MonthlyIncome: int = Field(..., example=5000)
    MonthlyRate: int = Field(..., example=14000)
    NumCompaniesWorked: int = Field(..., example=2)
    OverTime: int = Field(..., example=0)
    PercentSalaryHike: int = Field(..., example=13)
    PerformanceRating: int = Field(..., example=3)
    RelationshipSatisfaction: int = Field(..., example=3)
    StockOptionLevel: int = Field(..., example=1)
    TotalWorkingYears: int = Field(..., example=10)
    TrainingTimesLastYear: int = Field(..., example=3)
    WorkLifeBalance: int = Field(..., example=3)
    YearsAtCompany: int = Field(..., example=5)
    YearsInCurrentRole: int = Field(..., example=3)
    YearsSinceLastPromotion: int = Field(..., example=1)
    YearsWithCurrManager: int = Field(..., example=3)


# ── Response schema ───────────────────────────────────────────────────────────

class PredictionResponse(BaseModel):
    attrition_prediction: int   # 0 = stays, 1 = leaves
    attrition_label: str        # "No" or "Yes"
    attrition_probability: float  # confidence score 0.0 to 1.0


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    """
    Health check endpoint.
    Used by Docker, load balancers, and GitHub Actions to verify the API is up.
    """
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "model_uri": MODEL_URI,
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(features: EmployeeFeatures):
    """
    Predict whether an employee will leave.
    
    Accepts 30 employee features (all pre-encoded as integers).
    Returns prediction (0/1), label (No/Yes), and probability.
    """
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Check MLflow registry connection."
        )

    # Convert request to DataFrame — sklearn expects a DataFrame input
    input_data = pd.DataFrame([features.model_dump()])

    # Get prediction: 0 = stays, 1 = leaves
    prediction = int(model.predict(input_data)[0])

    # Get probability score for class 1 (attrition=Yes)
    # predict_proba returns [[prob_class0, prob_class1]]
    probability = float(model.predict_proba(input_data)[0][1])

    return PredictionResponse(
        attrition_prediction=prediction,
        attrition_label="Yes" if prediction == 1 else "No",
        attrition_probability=round(probability, 4),
    )
