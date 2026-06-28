
import { AlertCircle, AlertTriangle } from "lucide-react";

interface HealthBannerProps {
  connected: boolean;
  modelLoaded: boolean;
  responseTime: number | null;
  error: string | null;
}

export default function HealthBanner({ connected, modelLoaded, responseTime, error }: HealthBannerProps) {
  if (error !== null) {
    return (
      <div
        className="dashboard-banner"
        style={{
          background: "#fef2f2",
          borderBottom: "1px solid #fecaca",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
          color: "#991b1b",
        }}
      >
        <AlertCircle size={14} color="#dc2626" />
        <span>{error}</span>
      </div>
    );
  }

  if (connected) {
    return (
      <div
        className="dashboard-banner"
        style={{
          background: "#f0fdf4",
          borderBottom: "1px solid #bbf7d0",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
          color: "#166534",
        }}
      >
        <span
          className="animate-pulse-dot"
          style={{
            width: "7px",
            height: "7px",
            background: "#22c55e",
            borderRadius: "50%",
            display: "inline-block",
          }}
        />
        <span>
          API connected 
          {responseTime !== null ? ` · response time ${responseTime}ms` : ""}
        </span>
      </div>
    );
  }

  // if (connected && !modelLoaded) {
  //   return (
  //     <div
  //       className="dashboard-banner"
  //       style={{
  //         background: "#fff7ed",
  //         borderBottom: "1px solid #fed7aa",
  //         display: "flex",
  //         alignItems: "center",
  //         gap: "8px",
  //         fontSize: "12px",
  //         color: "#92400e",
  //       }}
  //     >
  //       <AlertTriangle size={14} color="#d97706" />
  //       <span>API connected but model not loaded</span>
  //     </div>
  //   );
  // }

  return (
    <div
      className="dashboard-banner"
      style={{
        background: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "12px",
        color: "#64748b",
      }}
    >
      <span
        style={{
          width: "7px",
          height: "7px",
          background: "#cbd5e1",
          borderRadius: "50%",
          display: "inline-block",
        }}
      />
      <span>Checking API and model status...</span>
    </div>
  );
}
