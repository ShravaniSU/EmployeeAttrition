

export default function ParticleBackground() {
  const particles = Array.from({ length: 25 }, (_, i) => {
    const left = (i * 17 + 3) % 100; // Random-like distribution between 0% and 99%
    const duration = 15 + ((i * 23 + 7) % 21); // Random-like distribution between 15s and 35s
    const delay = (i * 29 + 11) % 21; // Random-like distribution between 0s and 20s
    const opacity = 0.4 + ((i * 13 + 5) % 7) * 0.1; // Random-like distribution between 0.4 and 1.0

    return {
      id: i,
      style: {
        left: `${left}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        opacity: opacity,
        width: "3px",
        height: "3px",
        borderRadius: "50%",
        background: "rgba(139, 92, 246, 0.15)",
        position: "absolute" as const,
        animationName: "float-up",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
      },
    };
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {particles.map((p) => (
        <div key={p.id} style={p.style} />
      ))}
    </div>
  );
}
