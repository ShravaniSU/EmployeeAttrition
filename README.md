# 🚀 Employee Attrition Prediction MLOps Platform

[![CI/CD Pipeline](https://github.com/yourusername/employee-attrition-mlops/actions/workflows/ml-pipeline.yml/badge.svg)](https://github.com/yourusername/employee-attrition-mlops/actions)

A production-grade MLOps project that predicts employee attrition using a Random Forest classifier while demonstrating the complete machine learning lifecycle—from data validation and experiment tracking to model quality gating, containerized deployment, and automated CI/CD on AWS.

🌐 **Live Application:** https://employeeattrition.shravaniurankar.in

---

## 📌 Project Overview

Employee attrition is a significant challenge for organizations. This project uses historical HR data to predict whether an employee is likely to leave the company.

The goal was not only to build a machine learning model, but to implement the engineering processes required to deploy, monitor, and manage machine learning systems in production.

The platform includes:

✅ Data validation before training

✅ Experiment tracking with MLflow

✅ Model registry and version management

✅ Automated model quality gates

✅ FastAPI inference service

✅ Docker containerization

✅ GitHub Actions CI/CD

✅ Automated AWS EC2 deployment

✅ Interactive React frontend for live predictions

---

# 🎯 Key Features

### Machine Learning

* Gradient Boosting Classifier for attrition prediction
* Feature preprocessing and categorical encoding
* Automated model evaluation
* F1-score based model promotion

### MLOps

* MLflow experiment tracking
* DagsHub Model Registry integration
* DVC data versioning
* Model quality gate enforcement
* Automated retraining pipeline

### DevOps

* Dockerized application
* GitHub Actions CI/CD
* Github image publishing
* AWS EC2 deployment automation
* Infrastructure-as-Code friendly architecture

### User Experience

* FastAPI REST API
* React-based prediction dashboard
* Health monitoring endpoint
* Live inference capability

---

# 🏗️ System Architecture

```text
                              ┌──────────────────┐
                              │ IBM HR Dataset   │
                              │                  │
                              └─────────┬────────┘
                                        │
                                        ▼

                           ┌────────────────────────┐
                           │ Data Validation Layer  │
                           │ validate.py           │
                           └─────────┬─────────────┘
                                     │
                                     ▼

                           ┌────────────────────────┐
                           │ Model Training         │
                           │ Random Forest          │
                           │ train.py              │
                           └─────────┬─────────────┘
                                     │
                                     ▼

                           ┌────────────────────────┐
                           │ MLflow + DagsHub       │
                           │ Experiments Registry   │
                           └─────────┬─────────────┘
                                     │
                                     ▼

                           ┌────────────────────────┐
                           │ Quality Gate           │
                           │ gate.py               │
                           │ F1 >= 0.75 Required   │
                           └─────────┬─────────────┘
                                     │
                        Pass         │         Fail
                                     ▼
                          ┌───────────────────┐
                          │ Docker Build      │
                          └─────────┬─────────┘
                                    │
                                    ▼

                          ┌───────────────────┐
                          │ Docker Hub        │
                          └─────────┬─────────┘
                                    │
                                    ▼

                          ┌───────────────────┐
                          │ AWS EC2           │
                          │ FastAPI Service   │
                          └─────────┬─────────┘
                                    │
                                    ▼

                      ┌──────────────────────────┐
                      │ React Frontend Dashboard │
                      └──────────────────────────┘
```

---

# 🔄 CI/CD Pipeline

Every push to the repository automatically triggers:

```text
1. Checkout Source Code
          │
          ▼
2. Validate Dataset
          │
          ▼
3. Train Random Forest Model
          │
          ▼
4. Log Metrics to MLflow
          │
          ▼
5. Quality Gate Check
   (F1 Score >= 0.75)
          │
          ▼
6. Build Docker Image
          │
          ▼
7. Push Image to Docker Hub
          │
          ▼
8. Deploy to AWS EC2
          │
          ▼
9. Restart Production Container
```

If the model fails the quality gate, deployment is automatically blocked.

---

# 🧠 Machine Learning Workflow

## Dataset

IBM HR Analytics Employee Attrition Dataset

* 1470 employee records
* 35 HR-related features
* Binary classification problem

Target:

```text
Attrition
├── Yes
└── No
```

---

## Data Validation

Before training begins, automated checks verify:

* Required schema exists
* No missing values
* Target column exists
* Class distribution is acceptable
* Dataset integrity

Training stops immediately if validation fails.

---

## Experiment Tracking

All training runs are tracked using MLflow hosted on DagsHub.

Logged artifacts include:

* Hyperparameters
* Accuracy
* Precision
* Recall
* F1 Score
* Model artifacts
* Training metadata

This provides complete experiment reproducibility.

---

## Model Quality Gate

A dedicated quality gate prevents weak models from reaching production.

Rule:

```python
F1 Score >= 0.75
```

Pipeline behavior:

```text
F1 >= 0.75
    └── Deploy

F1 < 0.75
    └── Fail Pipeline
```

This simulates enterprise-grade model governance.

---

# 📂 Project Structure

```text
employee-attrition-mlops/
│
├── data/
│   └── employee_attrition.csv
│
├── src/
│   ├── validate.py
│   ├── train.py
│   └── gate.py
│
├── api/
│   ├── main.py
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── frontend/
│   ├── React UI
│   └── Prediction Dashboard
│
├── .github/
│   └── workflows/
│       └── ml-pipeline.yml
│
├── dvc.yaml
├── requirements.txt
├── README.md
└── .dvc/
```

---

# 🚀 Running Locally

## Clone Repository

```bash
git clone https://github.com/yourusername/employee-attrition-mlops.git

cd employee-attrition-mlops
```

---

## Create Environment

```bash
python -m venv .venv

source .venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

# 📊 Validate Data

```bash
python src/validate.py
```

Expected:

```text
Schema Check Passed
Null Check Passed
Class Balance Check Passed
```

---

# 🏋️ Train Model

```bash
python src/train.py
```

This will:

* Train Gradient Boosting model
* Calculate metrics
* Log experiment to MLflow
* Register model in DagsHub

---

# 🚦 Run Quality Gate

```bash
python src/gate.py
```

Output:

```text
F1 Score: 0.81
Quality Gate Passed
```

or

```text
F1 Score: 0.69
Quality Gate Failed
```

---

# 🌐 FastAPI Inference Service

Start API:

```bash
uvicorn api.main:app --reload
```

Swagger UI:

```text
http://localhost:8000/docs
```

Health Check:

```bash
curl http://localhost:8000/health
```

Response:

```json
{
  "status": "healthy"
}
```

---

# 🐳 Docker Deployment

Build image:

```bash
docker build -t employee-attrition-api .
```

Run container:

```bash
docker run -p 8000:8000 employee-attrition-api
```

Using Docker Compose:

```bash
docker compose up -d
```

---

# ☁️ AWS Deployment

Deployment is fully automated through GitHub Actions.

On successful model validation:

1. Docker image built
2. Image pushed to Docker Hub
3. SSH into EC2
4. Pull latest image
5. Restart container
6. Deploy new version

Production Endpoint:

```text
https://employeeattrition.shravaniurankar.in
```

---

# 🖥️ React Dashboard

The project includes a React frontend that allows users to:

* Enter employee details
* Submit prediction requests
* View attrition probability
* Test live production APIs
* Validate deployed models

Frontend communicates directly with the FastAPI backend.

---

# 📈 MLOps Concepts Demonstrated

This project demonstrates:

* Experiment Tracking
* Model Registry
* Model Governance
* CI/CD for ML
* Data Versioning
* Containerized Inference
* Automated Deployment
* Model Quality Gates
* Production API Serving
* Cloud Deployment
---

# 🔮 Future Improvements

Planned enhancements:

* Evidently AI drift monitoring
* Prometheus metrics collection
* Grafana dashboards
* Kubernetes deployment
* Helm charts
* Feature Store integration
* Automated retraining schedules
* Canary deployments
* Model explainability using SHAP

---

# 🛠️ Technology Stack

| Category             | Technology               |
| -------------------- | ------------------------ |
| Programming Language | Python                   |
| Machine Learning     | Scikit-Learn             |
| Model                | Random Forest Classifier |
| API Framework        | FastAPI                  |
| Frontend             | React                    |
| Experiment Tracking  | MLflow                   |
| Model Registry       | DagsHub                  |
| Data Versioning      | DVC                      |
| Containerization     | Docker                   |
| CI/CD                | GitHub Actions           |
| Cloud                | AWS EC2                  |
| Registry             | Github                   |
| Source Control       | Git                      |

---

# 👨‍💻 Author

**Shravani Shirish Urankar**

Full Stack Engineer | DevOps Engineer | MLOps Engineer

Portfolio: https://www.shravaniurankar.in

GitHub: https://github.com/ShravaniSU

LinkedIn: https://linkedin.com/in/shravaniurankar

---

⭐ If you found this project useful, please consider starring the repository.
