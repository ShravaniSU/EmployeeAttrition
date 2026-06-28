"""
main.py — FastAPI app for serving attrition predictions.

================================================================================
── PREVIOUS EC2 IMPLEMENTATION (COMMENTED OUT FOR AWS MIGRATION) ───────────────
================================================================================

# import os
# import logging
# from contextlib import asynccontextmanager

# import mlflow
# import mlflow.sklearn
# import pandas as pd
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel, Field
# from dotenv import load_dotenv

# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# load_dotenv()

# os.environ["MLFLOW_TRACKING_USERNAME"] = os.getenv("MLFLOW_TRACKING_USERNAME")
# os.environ["MLFLOW_TRACKING_PASSWORD"] = os.getenv("MLFLOW_TRACKING_PASSWORD")
# mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING_URI"))

# MODEL_REGISTRY_NAME = "attrition-model"
# CORS_ORIGINS = [
#     origin.strip()
#     for origin in os.getenv("CORS_ORIGINS", "*").split(",")
#     if origin.strip()
# ]

# MODEL_URI = f"models:/{MODEL_REGISTRY_NAME}/latest"

# model = None

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     global model
#     logger.info(f"Loading model from MLflow registry: {MODEL_URI}")
#     try:
#         model = mlflow.sklearn.load_model(MODEL_URI)
#         logger.info("Model loaded successfully.")
#     except Exception as e:
#         logger.error(f"Failed to load model: {e}")
#         model = None
#     yield
#     logger.info("Shutting down API.")

# app = FastAPI(
#     title="Employee Attrition Prediction API",
#     description="Predicts whether an employee is likely to leave the company.",
#     version="1.0.0",
#     lifespan=lifespan,
# )

# ... [Pydantic Schemas & Endpoints were placed here] ...
"""

# ==============================================================================
# ── AWS LAMBDA IMPLEMENTATION (LAZY LOADING) ──────────────────────────────────
# ==============================================================================

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

# ── Load environment ──────────────────────────────────────────────────────────

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

MODEL_URI = f"models:/{MODEL_REGISTRY_NAME}/latest"

# ── Global model variable & Lazy Loader ───────────────────────────────────────

model = None

def get_model():
    """
    AWS Lambda Safe Loader:
    Instead of fetching the model during the container boot phase (which can cause
    serverless timeouts), we load it into global memory on the very first request.
    Subsequent requests reuse the warmed memory.
    """
    global model
    if model is None:
        logger.info(f"Lazy loading model from MLflow registry: {MODEL_URI}")
        try:
            model = mlflow.sklearn.load_model(MODEL_URI)
            logger.info("Model loaded successfully into Lambda memory.")
        except Exception as e:
            logger.error(f"Failed to load model from MLflow: {e}")
            raise HTTPException(
                status_code=503,
                detail="Model registry currently unavailable. Please try again."
            )
    return model


# ── Lifespan: Lightweight for Serverless Boot ─────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("FastAPI Container initializing on AWS Lambda.")
    yield
    logger.info("AWS Lambda execution context freezing/shutting down.")


# ── FastAPI app ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="Employee Attrition Prediction API",
    description="Predicts whether an employee is likely to leave the company.",
    version="2.0.0-lambda",
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
    attrition_prediction: int
    attrition_label: str
    attrition_probability: float


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    """
    Health check endpoint.
    Can be hit by free monitoring tools (like UptimeRobot) to prevent Lambda cold starts.
    """
    return {
        "status": "ok",
        "platform": "AWS Lambda",
        "model_loaded_in_memory": model is not None,
        "model_uri": MODEL_URI,
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(features: EmployeeFeatures):
    """
    Predict attrition. Triggers lazy-loading on first invocation.
    """
    # Fetch warmed model or download from DagsHub if Cold Start
    live_model = get_model()

    input_data = pd.DataFrame([features.model_dump()])

    prediction = int(live_model.predict(input_data)[0])
    probability = float(live_model.predict_proba(input_data)[0][1])

    return PredictionResponse(
        attrition_prediction=prediction,
        attrition_label="Yes" if prediction == 1 else "No",
        attrition_probability=round(probability, 4),
    )