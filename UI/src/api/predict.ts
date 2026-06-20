import type { EmployeeFeatures, PredictionResponse, HealthResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed with status: ${response.status}`);
  }
  return response.json();
}

export async function predictAttrition(features: EmployeeFeatures): Promise<PredictionResponse> {
  console.log("Request payload:", features);
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(features),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Prediction failed with status: ${response.status}`);
  }
  const data = await response.json();
  console.log("Response:", data);
  return data;
}
