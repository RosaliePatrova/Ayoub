"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, Sparkles } from "lucide-react"

const QUOTES = [
  "Sometimes silence is the loudest answer.",
  "You survived today. That's enough.",
  "Breathe. You're here now.",
  "The night holds space for all your thoughts.",
  "You are exactly where you need to be.",
]

export default function CalmFeatures() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("rest")
  const [timer, setTimer] = useState(0)
  const [running, setRunning] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(QUOTES[0])
  const [scale, setScale] = useState(1)

  // breathing durations
  const INHALE = 10
  const HOLD = 2
  const EXHALE = 10

  useEffect(() => {
    if (!running) return

    let interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          // move to next phase
          if (phase === "inhale") {
            setPhase("hold")
            setScale(1.25)
            return HOLD
          }
          if (phase === "hold") {
            setPhase("exhale")
            setScale(1)
            return EXHALE
          }
          if (phase === "exhale") {
            setPhase("inhale")
            setScale(1)
            return INHALE
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [running, phase])

  const startBreathing = () => {
    setPhase("inhale")
    setScale(1.05)
    setTimer(INHALE)
    setRunning(true)
  }

  const reset = () => {
    setRunning(false)
    setPhase("rest")
    setTimer(0)
    setScale(1)
  }

  const handleQuoteTap = () => {
    setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])
  }

  return (
    <div className="min-h-screen px-4 py-8 text-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-accent">Calm Yourself</h1>

        {/* Breathing box */}
        <div className="bg-white/10 p-8 rounded-xl border border-white/20 backdrop-blur-md text-center">
          <h2 className="text-2xl font-bold mb-6">Breathing Exercise</h2>

          {/* breathing ball */}
          <div className="relative w-44 h-44 mx-auto mb-6 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#DCE1FF] to-[#B8C5FF] rounded-full blur-xl opacity-40 transition-all duration-1000"
              style={{ transform: `scale(${scale})` }}
            />
            <div
              className="relative w-32 h-32 bg-gradient-to-br from-[#DCE1FF] to-[#C5CCFF] rounded-full shadow-2xl flex items-center justify-center transition-all duration-1000"
              style={{ transform: `scale(${scale})` }}
            />
          </div>

          {/* Text */}
          <p className="text-lg font-semibold mb-2">
            {phase === "inhale" && "✨ Inhale slowly..."}
            {phase === "hold" && "⏳ Hold..."}
            {phase === "exhale" && "🌙 Exhale gently..."}
            {phase === "rest" && "Tap Start to begin breathing"}
          </p>

          <p className="text-primary text-3xl font-bold mb-4">{timer > 0 && timer}</p>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => running ? setRunning(false) : startBreathing()}
              className="px-6 py-3 bg-primary/80 text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2"
            >
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {running ? "Pause" : "Start"}
            </button>

            <button
              onClick={reset}
              className="px-6 py-3 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Quote Feature */}
        <div className="mt-10 p-8 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
          <h2 className="text-xl font-bold mb-4 text-center">Firefly Whisper</h2>

          <button
            onClick={handleQuoteTap}
            className="w-full p-6 bg-white/5 rounded-lg border border-white/30 hover:border-white/60 transition-all flex flex-col items-center gap-3"
          >
            <Sparkles className="text-primary/80 w-8 h-8" />
            <p className="text-center text-lg">{currentQuote}</p>
          </button>
        </div>
      </div>
    </div>
  )
}
