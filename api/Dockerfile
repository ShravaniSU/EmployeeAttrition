# ── Base image ────────────────────────────────────────────────────────────────
# We use a slim Python image to keep the container size small
FROM python:3.12-slim

# ── Set working directory inside the container ────────────────────────────────
WORKDIR /app

# ── Install system dependencies ───────────────────────────────────────────────
# These are needed by some Python packages to compile
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# ── Copy and install Python dependencies ─────────────────────────────────────
# We copy requirements.txt first (before the rest of the code).
# Docker caches each layer — if requirements.txt didn't change,
# it skips the pip install step on rebuild. Saves a lot of time.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Copy application code ─────────────────────────────────────────────────────
COPY api/main.py .

# ── Expose port ───────────────────────────────────────────────────────────────
EXPOSE 8000

# ── Start the API ─────────────────────────────────────────────────────────────
# host=0.0.0.0 makes it accessible outside the container
# workers=1 is fine for a portfolio project
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]