import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import type { PredictionResponse } from "../types";

interface ResultCardProps {
  result: PredictionResponse;
  responseTime: number;
}

export default function ResultCard({ result, responseTime }: ResultCardProps) {
  const probabilityPercent = Math.round(result.attrition_probability * 100);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBarWidth(probabilityPercent);
    }, 100);
    return () => clearTimeout(timer);
  }, [probabilityPercent]);

  let verdict = "LOW RISK";
  let verdictColor = "#4C7A5E";
  let verdictDesc = "This employee shows high stability and is likely to remain at the company.";

  if (result.attrition_probability > 0.65) {
    verdict = "FLIGHT RISK";
    verdictColor = "#B0472F";
    verdictDesc = "High probability of attrition. Intervention recommended.";
  } else if (result.attrition_probability >= 0.35) {
    verdict = "MEDIUM RISK";
    verdictColor = "#C98A3E";
    verdictDesc = "Moderate probability of attrition. Monitor satisfaction levels.";
  }

  const cardStyle: CSSProperties = {
    background: "#FCFBF9",
    border: "1px solid #C9C0AC",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "none",
    position: "relative",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={cardStyle}
    >
      {/* SVG Ink Bleed Filter */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="ink-bleed">
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Header Row */}
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1.5px solid #8B5E3C", paddingBottom: "10px" }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", fontWeight: "bold", color: "#8B5E3C", letterSpacing: "0.1em" }}>
          CLF-VERDICT // RECORD: #IBM-CASE-VERDICT
        </span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#7f7766" }}>
          SYS_OK
        </span>
      </div>

      {/* Rubber Stamp Seal */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "160px" }}>
        <motion.div
          initial={{ scale: 2.2, rotate: -25, opacity: 0 }}
          animate={{ scale: 1, rotate: -5, opacity: 0.9 }}
          transition={{ type: "spring", stiffness: 350, damping: 13, delay: 0.05 }}
          style={{
            border: `4px solid ${verdictColor}`,
            padding: "12px 24px",
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: verdictColor,
            backgroundColor: "transparent",
            fontFamily: "'IBM Plex Serif', Georgia, serif",
            fontWeight: 800,
            fontSize: "24px",
            letterSpacing: "0.15em",
            transform: "rotate(-5deg)",
            mixBlendMode: "multiply",
            filter: "url(#ink-bleed)",
          }}
        >
          <div style={{ borderBottom: `2.5px solid ${verdictColor}`, width: "100%", textAlign: "center", paddingBottom: "4px", marginBottom: "4px" }}>
            {verdict}
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", fontWeight: "bold", letterSpacing: "0.05em" }}>
            PROBABILITY: {probabilityPercent}%
          </div>
        </motion.div>
      </div>

      {/* Verdict Description */}
      <p style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: "12px",
        color: "#1F2620",
        textAlign: "center",
        margin: "0 0 24px",
        fontStyle: "italic",
        lineHeight: 1.5
      }}>
        {verdictDesc}
      </p>

      {/* Probability Bar */}
      <div style={{ marginTop: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#7f7766", letterSpacing: "0.05em" }}>
          <span>ATTRITION PROBABILITY SCALE</span>
          <span>{result.attrition_probability.toFixed(4)}</span>
        </div>
        <div
          style={{
            height: "6px",
            background: "#E6DFD3",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              backgroundColor: verdictColor,
              width: `${barWidth}%`,
              transition: "width 800ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
      </div>

      {/* Ledger Table Metadata */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          rowGap: "10px",
          columnGap: "16px",
          marginTop: "24px",
          paddingTop: "16px",
          borderTop: "1px dashed #C9C0AC",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "11px",
          color: "#1F2620",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#7f7766" }}>PREDICT_VAL:</span>
          <span style={{ fontWeight: "bold" }}>{result.attrition_prediction}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#7f7766" }}>LABEL:</span>
          <span style={{ fontWeight: "bold" }}>{result.attrition_label}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#7f7766" }}>PROB:</span>
          <span style={{ fontWeight: "bold" }}>{result.attrition_probability.toFixed(4)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#7f7766" }}>LATENCY:</span>
          <span style={{ fontWeight: "bold" }}>{responseTime}ms</span>
        </div>
      </div>
    </motion.div>
  );
}
