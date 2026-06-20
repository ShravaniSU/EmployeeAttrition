import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import type { PredictionResponse } from "../types";

interface ResultCardProps {
  result: PredictionResponse;
  responseTime: number;
}

export default function ResultCard({ result, responseTime }: ResultCardProps) {
  const isSuccess = result.attrition_prediction === 0;
  const probabilityPercent = Math.round(result.attrition_probability * 100);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBarWidth(probabilityPercent);
    }, 100);
    return () => clearTimeout(timer);
  }, [probabilityPercent]);

  const cardStyle: CSSProperties = {
    background: isSuccess
      ? "linear-gradient(135deg, #f0fdf4, #dcfce7)"
      : "linear-gradient(135deg, #fff7ed, #ffedd5)",
    border: isSuccess ? "1.5px solid #86efac" : "1.5px solid #fdba74",
    borderRadius: "14px",
    padding: "20px",
    marginTop: "16px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={cardStyle}
    >
      {/* Header Row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Icon Circle */}
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isSuccess ? "#bbf7d0" : "#fed7aa",
            }}
          >
            {isSuccess ? (
              <CheckCircle2 size={22} color="#16a34a" />
            ) : (
              <AlertTriangle size={22} color="#ea580c" />
            )}
          </div>

          <div>
            <h4
              style={{
                fontSize: "17px",
                fontWeight: 600,
                color: isSuccess ? "#166534" : "#9a3412",
                margin: 0,
              }}
            >
              {isSuccess ? "Low Attrition Risk" : "High Attrition Risk"}
            </h4>
            <p style={{ fontSize: "12px", color: isSuccess ? "#15803d" : "#c2410c", margin: 0 }}>
              {isSuccess ? "This employee is likely to stay" : "This employee may leave"}
            </p>
          </div>
        </div>

        {/* Probability Large */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: isSuccess ? "#16a34a" : "#ea580c",
          }}
        >
          {probabilityPercent}%
        </div>
      </div>

      {/* Probability Bar */}
      <div style={{ marginTop: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>Attrition probability</span>
          <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>{result.attrition_probability}</span>
        </div>
        <div
          style={{
            height: "8px",
            background: "rgba(0, 0, 0, 0.08)",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: "999px",
              background: isSuccess
                ? "linear-gradient(90deg, #4ade80, #22c55e)"
                : "linear-gradient(90deg, #fb923c, #ef4444)",
              width: `${barWidth}%`,
              transition: "width 800ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
      </div>

      {/* Meta Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          marginTop: "14px",
          paddingTop: "14px",
          borderTop: "1px solid rgba(0, 0, 0, 0.07)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "11px", color: "#64748b" }}>Prediction</span>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
            {result.attrition_prediction}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "11px", color: "#64748b" }}>Label</span>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
            {result.attrition_label}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "11px", color: "#64748b" }}>Probability</span>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
            {result.attrition_probability}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "11px", color: "#64748b" }}>Response time</span>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
            {responseTime}ms
          </span>
        </div>
      </div>
    </motion.div>
  );
}
