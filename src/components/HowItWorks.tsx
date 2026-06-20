export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Describe Symptoms",
      description:
        "Enter your symptoms using text, voice, or image input.",
    },
    {
      number: "02",
      title: "AI Analysis",
      description:
        "Our AI analyzes the symptoms and identifies possible conditions.",
    },
    {
      number: "03",
      title: "Specialist Recommendation",
      description:
        "Get guidance on which medical specialist to consult.",
    },
    {
      number: "04",
      title: "Find Nearby Doctors",
      description:
        "Discover healthcare professionals and hospitals nearby.",
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        padding: "80px 20px",
        background: "#f8fafc",
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
        How It Works
      </h2>

      <p
        style={{
          color: "#64748b",
          marginBottom: "50px",
        }}
      >
        Get health guidance in four simple steps.
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
        {steps.map((step) => (
          <div
            key={step.number}
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              style={{
                color: "#2563eb",
                fontSize: "2rem",
              }}
            >
              {step.number}
            </h3>

            <h4>{step.title}</h4>

            <p
              style={{
                color: "#64748b",
              }}
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
