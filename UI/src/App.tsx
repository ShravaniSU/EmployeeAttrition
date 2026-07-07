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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      background: "#FCFBF9",
                      border: "1px dashed #C9C0AC",
                      padding: "40px 24px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      minHeight: "360px",
                      color: "#7f7766",
                    }}
                  >
                    <Brain size={32} style={{ color: "#8B5E3C", marginBottom: "16px", strokeWidth: 1.5 }} />
                    <h4 style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: "16px", fontWeight: "bold", color: "#1F2620", margin: "0 0 8px" }}>
                      Awaiting Analysis
                    </h4>
                    <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "12px", color: "#7f7766", margin: 0, maxWidth: "220px", lineHeight: "1.6" }}>
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
              gap: "6px",
              border: "1px solid #C9C0AC",
              padding: "4px 8px",
              color: "#8B5E3C",
              fontWeight: "bold",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px",
            }}
          >
            <Atom size={12} className="animate-spin-slow" />
            <span>SYS_ENGINE: MLFLOW + FASTAPI</span>
          </div>

          {/* Right text */}
          <div style={{ fontWeight: 500, color: "#7f7766", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px" }}>
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
