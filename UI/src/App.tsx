import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Atom, Brain } from "lucide-react";
import ParticleBackground from "./components/ParticleBackground";
import Header from "./components/Header";
import HealthBanner from "./components/HealthBanner";
import PredictionForm from "./components/PredictionForm";
import ResultCard from "./components/ResultCard";
import { checkHealth, predictAttrition } from "./api/predict";
import type { ApiState, PredictionResponse, EmployeeFeatures } from "./types";

export default function App() {
  const [apiState, setApiState] = useState<ApiState>({
    connected: false,
    responseTime: null,
    error: null,
  });
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [predictionTime, setPredictionTime] = useState<number | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      const start = Date.now();
      try {
        await checkHealth();
        setApiState({
          connected: true,
          responseTime: Date.now() - start,
          error: null,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to connect to prediction API";
        setApiState({
          connected: false,
          responseTime: null,
          error: errorMessage,
        });
      }
    };
    fetchHealth();
  }, []);

  const handleSubmit = async (features: EmployeeFeatures) => {
    setIsLoading(true);
    setPrediction(null);
    setPredictionTime(null);
    const start = Date.now();
    try {
      const result = await predictAttrition(features);
      setPrediction(result);
      setPredictionTime(Date.now() - start);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Prediction failed";
      setApiState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflowX: "hidden" }}>
      <ParticleBackground />
      <div className="dashboard-container" style={{ position: "relative", zIndex: 1 }}>
        <Header />
        <HealthBanner {...apiState} />

        <main className="dashboard-main">
          <div className="dashboard-left">
            <PredictionForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          <div className="dashboard-right">
            <div className="sticky-container">
              <AnimatePresence mode="wait">
                {prediction && predictionTime !== null ? (
                  <ResultCard key="result" result={prediction} responseTime={predictionTime} />
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    style={{
                      background: "rgba(255, 255, 255, 0.45)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: "2px dashed rgba(148, 163, 184, 0.4)",
                      borderRadius: "14px",
                      padding: "40px 24px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      minHeight: "320px",
                      color: "#64748b",
                      marginTop: "16px",
                    }}
                  >
                    <Brain size={48} style={{ color: "#94a3b8", marginBottom: "16px", strokeWidth: 1.5 }} />
                    <h4 style={{ fontSize: "15px", fontWeight: 600, color: "#475569", margin: "0 0 8px" }}>
                      Awaiting Analysis
                    </h4>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0, maxWidth: "240px", lineHeight: "1.6" }}>
                      Fill the form and click predict to see results here
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        <footer className="dashboard-footer">
          {/* Left badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "#f5f3ff",
              border: "1px solid #ddd6fe",
              padding: "4px 8px",
              borderRadius: "12px",
              color: "#6d28d9",
              fontWeight: 500,
            }}
          >
            <Atom size={12} className="animate-spin-slow" />
            <span>Powered by MLflow + FastAPI</span>
          </div>

          {/* Right text */}
          <div style={{ fontWeight: 400, color: "#64748b" }}>
            IBM HR Analytics · Gradient Boosting model
          </div>
        </footer>
      </div>
      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
