# ==============================================================================
# ── PREVIOUS EC2 DOCKERFILE (COMMENTED OUT FOR AWS MIGRATION) ─────────────────
# ==============================================================================

# FROM python:3.12-slim
# WORKDIR /app
# RUN apt-get update && apt-get install -y \
#     gcc \
#     && rm -rf /var/lib/apt/lists/*
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt
# COPY api/main.py .
# EXPOSE 8000
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]

# ==============================================================================
# ── AWS LAMBDA IMPLEMENTATION (CONTAINER IMAGE + WEB ADAPTER) ─────────────────
# ==============================================================================

# We use the official AWS Lambda Python 3.12 base image
# 1. Keep your existing FROM line
# 1. Start from a standard Python image (NOT necessarily the lambda-specific one)
# Using a standard image often avoids the "enforced handler" error.
# Use a standard Python image
FROM python:3.12-slim

# Install the Lambda Web Adapter
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

# Set environment variables for the Web Adapter
ENV PORT=8000
ENV AWS_LWA_READINESS_CHECK_PROTOCOL=tcp
ENV AWS_LWA_PORT=8000

# Setup your app
WORKDIR /var/task
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

# Run the app directly
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]