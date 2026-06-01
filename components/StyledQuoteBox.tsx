"use client"

interface QuoteBoxProps {
  text: string
  theme: "forest" | "purple" | "ocean"
}

export default function StyledQuoteBox({ text, theme }: QuoteBoxProps) {
  return (
    <div
      id="export-text"
      style={{
        width: "85%",
        height: "auto",
        padding: "60px",
        borderRadius: "16px",
        fontSize: "48px",
        lineHeight: "1.5",
        color: "white",
        textAlign: "left",
        whiteSpace: "pre-wrap",
        fontFamily: "'Cormorant Garamond', serif",
        boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
        background: theme === "forest"
          ? "linear-gradient(180deg, #0A152A 0%, #0D3B35 100%)"
          : theme === "purple"
          ? "linear-gradient(180deg, #2A1048 0%, #6D3BAF 100%)"
          : "linear-gradient(180deg, #041B2D 0%, #083A5E 100%)",
        position: "relative",
        overflow: "hidden"
      }}
    >

      {/* FOREST ELEMENTS */}
      {theme === "forest" && (
        <>
          {/* Stars */}
          {[...Array(25)].map((_, i) => (
            <div
              key={`star-${i}`}
              style={{
                position: "absolute",
                width: "6px",
                height: "6px",
                background: "rgba(255,255,255,.6)",
                borderRadius: "50%",
                top: `${Math.random() * 40}%`,
                left: `${Math.random() * 90}%`,
                opacity: 0.4
              }}
            />
          ))}

          {/* Tree silhouettes */}
          <svg
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "40%",
              opacity: 0.6
            }}
            viewBox="0 0 1000 400"
            preserveAspectRatio="none"
          >
            <polygon points="50,400 120,80 180,400" fill="#0F5C4B" />
            <polygon points="200,400 280,100 350,400" fill="#0F5C4B" />
            <polygon points="400,400 500,60 600,400" fill="#0F5C4B" />
            <polygon points="650,400 720,120 800,400" fill="#0F5C4B" />
            <polygon points="820,400 900,140 1000,400" fill="#0F5C4B" />
          </svg>

          {/* Moon */}
          <div
            style={{
              position: "absolute",
              top: "40px",
              right: "60px",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "radial-gradient(circle, #fff 40%, #d7d7c9 100%)",
              filter: "blur(1px)"
            }}
          />
        </>
      )}

      {/* PURPLE THEME ELEMENTS */}
      {theme === "purple" && (
        <>
          {/* soft glow */}
          <div
            style={{
              position: "absolute",
              top: "-10%",
              left: "20%",
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle, rgba(255,140,255,0.4), transparent)",
              filter: "blur(20px)"
            }}
          />

          {/* soft stars */}
          {[...Array(30)].map((_, i) => (
            <div
              key={`star-${i}`}
              style={{
                position: "absolute",
                width: "5px",
                height: "5px",
                background: "#fff",
                borderRadius: "50%",
                top: `${Math.random() * 40}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.5
              }}
            />
          ))}

          {/* Cloud silhouette */}
          <div
            style={{
              position: "absolute",
              bottom: "20%",
              left: "10%",
              width: "80%",
              height: "120px",
              background: "rgba(255,255,255,0.07)",
              filter: "blur(30px)",
              borderRadius: "50%"
            }}
          />
        </>
      )}

      {/* OCEAN THEME ELEMENTS */}
      {/* OCEAN THEME ELEMENTS */}
{theme === "ocean" && (
  <>
    {/* Moon reflection */}
    <div
      style={{
        position: "absolute",
        top: "50px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        background: "radial-gradient(circle,#dcecff,#6da0c9)",
        filter: "blur(2px)"
      }}
    />

    {/* Waves */}
    {[...Array(6)].map((_, i) => (
      <div
        key={`wave-${i}`}
        style={{
          position: "absolute",
          bottom: `${5 + i * 6}%`,
          width: "100%",
          height: "4px",
          background: "rgba(255,255,255,0.12)",
          borderRadius: "50%",
          transform: `scale(${1 + i * 0.2})`
        }}
      />
    ))}
  </>
)}


      {/* The text */}
      <span style={{ position: "relative", zIndex: 2 }}>{text}</span>
    </div>
  );
}
