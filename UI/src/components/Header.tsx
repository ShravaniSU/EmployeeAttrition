import { motion } from "framer-motion";
import { Github } from "lucide-react";

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="dashboard-header"
      style={{
        background: "transparent",
        position: "relative",
        borderBottom: "2px solid #8B5E3C",
        paddingBottom: "24px",
      }}
    >
      {/* Top Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Dossier Style Mono Badge */}
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            color: "#8B5E3C",
            fontWeight: "bold",
            letterSpacing: "0.05em",
          }}
        >
          STATUS: MODEL ACTIVE // REGISTRY: IBM-MLFLOW-PREDICT
        </div>

        {/* GitHub Link */}
        <a
          href="#"
          style={{
            color: "#8B5E3C",
            transition: "color 0.2s",
            display: "flex",
            alignItems: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#1F2620")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#8B5E3C")}
        >
          <Github size={18} />
        </a>
      </div>

      {/* Title */}
      <h1
        style={{
          color: "#1F2620",
          fontSize: "30px",
          fontWeight: 700,
          marginTop: "16px",
          marginBottom: "8px",
          lineHeight: 1.2,
          fontFamily: "'IBM Plex Serif', Georgia, serif",
        }}
      >
        Employee Attrition Predictor
      </h1>

      {/* Description */}
      <p
        style={{
          color: "#7f7766",
          fontSize: "13px",
          maxWidth: "500px",
          lineHeight: "1.6",
          margin: 0,
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}
      >
        Personnel Dossier Analysis — Powered by a Gradient Boosting classifier trained on the IBM HR Analytics dataset.
      </p>
    </motion.div>
  );
}
