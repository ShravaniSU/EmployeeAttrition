import { AlertCircle, CheckCircle, HelpCircle } from "lucide-react";

interface HealthBannerProps {
  connected: boolean;
  responseTime: number | null;
  error: string | null;
}

export default function HealthBanner({ connected, responseTime, error }: HealthBannerProps) {
  if (error !== null) {
    return (
      <div
        className="dashboard-banner"
        style={{
          background: "transparent",
          borderBottom: "1px solid #C9C0AC",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "11px",
          fontFamily: "'IBM Plex Mono', monospace",
          color: "#B0472F",
        }}
      >
        <AlertCircle size={12} color="#B0472F" />
        <span>[CONNECTION FAILED] SERVICE OFFLINE // ERROR: {error.toUpperCase()}</span>
      </div>
    );
  }

  if (connected) {
    return (
      <div
        className="dashboard-banner"
        style={{
          background: "transparent",
          borderBottom: "1px solid #C9C0AC",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "11px",
          fontFamily: "'IBM Plex Mono', monospace",
          color: "#4C7A5E",
        }}
      >
        <CheckCircle size={12} color="#4C7A5E" />
        <span>
          [SERVICE STATUS] API: ONLINE // LATENCY: {responseTime !== null ? `${responseTime}MS` : "N/A"} // MODE: PRODUCTION
        </span>
      </div>
    );
  }

  return (
    <div
      className="dashboard-banner"
      style={{
        background: "transparent",
        borderBottom: "1px solid #C9C0AC",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "11px",
        fontFamily: "'IBM Plex Mono', monospace",
        color: "#8B5E3C",
      }}
    >
      <HelpCircle size={12} className="animate-pulse" color="#8B5E3C" />
      <span>[SERVICE STATUS] INITIALIZING CONNECTION TO PREDICTION SERVICE...</span>
    </div>
  );
}
