"use client";

import { useState } from "react";
import { Check, X, Image as ImageIcon } from "lucide-react";
import html2canvas from "html2canvas";


export default function JournalSection() {
  const [entries, setEntries] = useState<string[]>([]);
  const [currentEntry, setCurrentEntry] = useState("");

  const [theme, setTheme] = useState<
    "forest" | "purple" | "ocean" | "knight" | "night" | "nature"
  >("forest");

  const [saving, setSaving] = useState(false);

  // 🆕 FONT STATES
  const [fontFamily, setFontFamily] = useState("'Cormorant Garamond', serif");
  const [fontColor, setFontColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(48);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(
    "center"
  );
  const [fontBold, setFontBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [spacing, setSpacing] = useState<"normal" | "wide">("normal");

  const preloadImage = (src: string) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = "anonymous";
      img.onload = resolve;
    });

  const handleSave = () => {
    if (!currentEntry.trim()) return;
    setEntries([...entries, currentEntry]);
    setCurrentEntry("");
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  const handleExport = async (entry: string) => {
    const imgPath =
      theme === "forest"
        ? "/themes/forest-bg.jpg"
        : theme === "ocean"
        ? "/themes/ocean-bg.jpg"
        : theme === "knight"
        ? "/themes/knight-bg.jpg"
        : theme === "night"
        ? "/themes/night-bg.jpg"
        : theme === "nature"
        ? "/themes/nature-bg.jpg"
        : "/themes/purple-bg.jpg";

    await preloadImage(imgPath);

    const textArea = document.getElementById("export-text");
    if (textArea) textArea.innerText = entry;

    const node = document.getElementById("export-block");
    if (!node) return;

    await new Promise((res) => setTimeout(res, 300));

    const canvas = await html2canvas(node, {
      useCORS: true,
      scale: 2,
      backgroundColor: null,
    });

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `night-note-${Date.now()}.jpg`;
        link.click();
      },
      "image/jpeg",
      0.92
    );
  };

  return (
    <div className="min-h-screen px-5 py-10 text-white">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mb-3">Night Notes</h1>
        <p className="text-center text-gray-300 mb-6">
          Write your feelings quietly.
        </p>

        {/* Theme selection */}
        <div className="grid grid-cols-3 gap-3 mb-6 place-items-center">
          {[
            { id: "forest", label: "🌲 Forest", bg: "/themes/forest-bg.jpg" },
            { id: "ocean", label: "🌊 Ocean", bg: "/themes/ocean-bg.jpg" },
            { id: "purple", label: "💜 Sunset", bg: "/themes/purple-bg.jpg" },
            { id: "knight", label: "⚔️ Knight", bg: "/themes/knight-bg.jpg" },
            { id: "night", label: "🌙 Night", bg: "/themes/night-bg.jpg" },
            { id: "nature", label: "🌿 Nature", bg: "/themes/nature-bg.jpg" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as any)}
              style={{
                backgroundImage: `url(${t.bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className={`w-full h-16 rounded-lg border transition-all relative overflow-hidden ${
                theme === t.id
                  ? "border-white scale-105 shadow-lg"
                  : "border-white/20 hover:scale-105"
              }`}
            >
              <span className="absolute inset-0 bg-black/40" />
              <span className="relative z-10 font-semibold text-white drop-shadow-lg">
                {t.label}
              </span>
            </button>
          ))}
        </div>

        {/* === Advanced text controls === */}
        <div className="mt-5 space-y-4">
               

          {/* Bold / Italic / Spacing */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setFontBold(!fontBold)}
              className={`px-4 py-2 rounded-lg border text-sm ${
                fontBold ? "bg-white/20 border-white" : "bg-white/5"
              }`}
            >
              Bold
            </button>

            <button
              onClick={() => setItalic(!italic)}
              className={`px-4 py-2 rounded-lg border text-sm ${
                italic ? "bg-white/20 border-white" : "bg-white/5"
              }`}
            >
              Italic
            </button>
          </div>

          {/* Emoji Bar */}
          <div className="flex justify-center gap-2 text-2xl">
            {["✨", "🌙", "🌿", "🔥", "💔", "🎧", "💭"].map((em) => (
              <button
                key={em}
                onClick={() => setCurrentEntry(currentEntry + em)}
                className="hover:scale-125 transition"
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        <textarea
          className="w-full h-28 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20 outline-none"
          style={{ fontFamily }}
          value={currentEntry}
          onChange={(e) => setCurrentEntry(e.target.value)}
          placeholder="write something..."
        />

        {/* FONT PICKER */}
        <div className="mt-4 flex flex-col gap-4">
          <h2 className="mt-10 text-xl font-semibold ">Font</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "Elegant", font: "'Cormorant Garamond', serif" },
              { name: "Typewriter", font: "'Courier Prime', monospace" },
              { name: "Modern", font: "'Poppins', sans-serif" },
              { name: "Script", font: "'Great Vibes', cursive" },
              { name: "Pixel", font: "'Pixelify Sans', monospace" },



            ].map((f) => (
              <button
                key={f.name}
                onClick={() => setFontFamily(f.font)}
                style={{ fontFamily: f.font }}
                className={`px-3 py-2 text-sm rounded-lg border ${
                  fontFamily === f.font
                    ? "bg-white/20 border-white"
                    : "bg-white/5"
                }`}
              >
                {f.name}
              </button>
              
            ))}
          </div>
          

          {/* Colors */}
          <div className="flex items-center gap-3">
            {[
              "#ffffff",
              "#ffb6c1",
              "#ffd966",
              "#8ee9ff",
              "#c49bff",
              "#90ff9f",
            ].map((c) => (
              <button
                key={c}
                onClick={() => setFontColor(c)}
                style={{ background: c }}
                className={`w-8 h-8 rounded-full border ${
                  fontColor === c ? "scale-110 border-white" : "border-white/30"
                }`}
              />
            ))}

            <label className="w-10 h-10 rounded-full border border-white/40 bg-white/10 flex items-center justify-center">
              🎨
              <input
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Save btn */}
        <button
          onClick={handleSave}
          disabled={!currentEntry.trim()}
          className="w-full mt-3 bg-blue-600 py-3 rounded-lg disabled:opacity-40"
        >
          {saving ? <Check className="inline w-4 h-4 mr-2" /> : null}
          {saving ? "Saved!" : "Save"}
        </button>

        {/* SAVED */}
        <h2 className="mt-10 text-xl font-semibold mb-3">Saved</h2>

        {entries.length === 0 ? (
          <p className="text-gray-500 text-center">No notes yet.</p>
        ) : (
          entries.map((entry, i) => (
            <div
              key={i}
              className="bg-white/10 p-4 rounded-lg flex justify-between mb-3"
            >
              <span className="text-sm">{entry}</span>

              <div className="flex gap-3">
                <button
                  onClick={() => handleExport(entry)}
                  className="text-blue-300 hover:text-blue-200 text-xs flex gap-1"
                >
                  <ImageIcon className="w-4" /> Export
                </button>
                <button
                  onClick={() => setEntries(entries.filter((_, x) => x !== i))}
                >
                  <X className="text-red-300 hover:text-red-400 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* EXPORT BLOCK */}
      <div
        id="export-block"
        style={{
          width: "1080px",
          height: "1920px",
          position: "absolute",
          left: "-9999px",
          top: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            theme === "forest"
              ? "linear-gradient(180deg,#0C2F23,#1E603E,#3A8F50)"
              : theme === "knight"
              ? "linear-gradient(180deg,#1A1A29,#4C2E1F,#E69C43)"
              : theme === "nature"
              ? "linear-gradient(180deg,#17452D,#4DA54C,#82D46E)"
              : theme === "night"
              ? "linear-gradient(180deg,#101b36,#2e3f70,#6b5ba9)"
              : theme === "ocean"
              ? "linear-gradient(180deg,#003b67,#006b9b,#4cc0e7)"
              : "linear-gradient(180deg,#331848,#83398a,#f47b79)",
        }}
      >
        {/* Card */}
        <div
          style={{
            width: "80%",
            height: "23%",
            padding: "60px 40px",
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0px 15px 40px rgba(0,0,0,0.35)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            src={
              theme === "forest"
                ? "/themes/forest-bg.jpg"
                : theme === "ocean"
                ? "/themes/ocean-bg.jpg"
                : theme === "knight"
                ? "/themes/knight-bg.jpg"
                : theme === "night"
                ? "/themes/night-bg.jpg"
                : theme === "nature"
                ? "/themes/nature-bg.jpg"
                : "/themes/purple-bg.jpg"
            }
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 1,
              zIndex: -1,
            }}
            crossOrigin="anonymous"
          />

          {/* Render Text */}
          <div
            id="export-text"
            style={{
              fontSize: "52px",
              fontFamily,
              color: fontColor,
              textAlign,
              fontWeight: fontBold ? "bold" : "normal",
              fontStyle: italic ? "italic" : "normal",
              letterSpacing: spacing === "wide" ? "4px" : "normal",
              textShadow: "0px 6px 20px rgba(0,0,0,0.7)",
              whiteSpace: "pre-wrap",
            }}
          >
            ...
          </div>
        </div>
      </div>
    </div>
  );
}
