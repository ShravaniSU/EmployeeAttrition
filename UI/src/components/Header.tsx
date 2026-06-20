
import { motion } from "framer-motion";
import { Github } from "lucide-react";

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="dashboard-header"
      style={{
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Orbs */}
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.08)",
          position: "absolute",
          top: "-30px",
          right: "60px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.06)",
          position: "absolute",
          bottom: "-20px",
          right: "20px",
          pointerEvents: "none",
        }}
      />

      {/* Top Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Pill Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(255, 255, 255, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            borderRadius: "20px",
            padding: "4px 10px",
            fontSize: "11px",
            color: "rgba(255, 255, 255, 0.9)",
            fontWeight: 500,
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              background: "#22c55e",
              borderRadius: "50%",
            }}
          />
          Model active · MLflow registry
        </div>

        {/* GitHub Link */}
        <a
          href="#"
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            transition: "color 0.2s",
            display: "flex",
            alignItems: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 1)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)")}
        >
          <Github size={18} />
        </a>
      </div>

      {/* Title */}
      <h1
        style={{
          color: "white",
          fontSize: "26px",
          fontWeight: 600,
          marginTop: "16px",
          marginBottom: "8px",
          lineHeight: 1.2,
        }}
      >
        Employee Attrition Predictor
      </h1>

      {/* Description */}
      <p
        style={{
          color: "rgba(255, 255, 255, 0.75)",
          fontSize: "13px",
          maxWidth: "420px",
          lineHeight: "1.6",
          margin: 0,
        }}
      >
        ML-powered prediction using Gradient Boosting — trained on IBM HR Analytics dataset
      </p>

      {/* Animated gradient line */}
      <div
        className="animate-pulse-width"
        style={{
          height: "3px",
          marginTop: "16px",
          background: "linear-gradient(90deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.05))",
          borderRadius: "2px",
        }}
      />
    </motion.div>
  );
}
