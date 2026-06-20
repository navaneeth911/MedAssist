export default function Features() {
  const features = [
    {
      number: "01",
      title: "Analyze symptoms using AI",
      description:
        "Our AI analyzes your symptoms and provides insights on possible conditions. It's like having a preliminary health checkup at your fingertips.",
    },
    {
      number: "02",
      title: "Find nearby specialists",
      description:
        "Discover healthcare professionals and hospitals nearby based on your location and the urgency of your symptoms. Get connected to the right care when you need it most.",
    },
    {
      number: "03",
      title: "Generate downloadable reports",
      description:
        "Receive detailed reports summarizing your symptoms and the AI's analysis.",
    },
    {
      number: "04",
      title: "Identify urgent conditions",
      description:
        "Get alerts about symptoms that require immediate medical attention.",
    },
  ];

  return (
    <section
      id="features"
      style={{
        padding: "80px 20px",
        background: "white",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          marginBottom: "20px",
          color: "#1e293b",
        }}
      >
        Features
      </h2>

      <p
        style={{
          color: "#64748b",
          marginBottom: "50px",
        }}
      >
        Powerful AI-driven healthcare assistance.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {features.map((feature) => (
          <div
            key={feature.number}
            style={{
              background: "#f8fafc",
              padding: "30px",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              style={{
                color: "#2563eb",
                fontSize: "2rem",
                marginBottom: "10px",
              }}
            >
              {feature.number}
            </h3>

            <h4
              style={{
                marginBottom: "15px",
                color: "#1e293b",
              }}
            >
              {feature.title}
            </h4>

            <p
              style={{
                color: "#64748b",
                lineHeight: "1.6",
              }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
