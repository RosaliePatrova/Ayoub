"use client"

import { useState, useEffect } from "react"
import { Trees, Volume2, BookOpen, Wind } from "lucide-react"
import ForestHero from "@/components/forest-hero"
import SoundPlayer, { globalStopAll } from "@/components/sound-player"
import JournalSection from "@/components/journal-section"
import CalmFeatures from "@/components/calm-features"
import Footer from "@/components/footer"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"explore" | "sounds" | "journal" | "breathe">("explore")

  useEffect(() => {
    if (activeTab !== "sounds" && globalStopAll) {
      globalStopAll();
    }
  }, [activeTab]);

  return (
    <main className="w-full min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-background via-background/80 to-transparent backdrop-blur-md pt-8 pb-6 px-4">
        <div className="flex justify-around max-w-md mx-auto gap-2">
          {(["explore", "sounds", "journal", "breathe"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all backdrop-blur-md border ${
                activeTab === tab
                  ? "bg-primary/80 text-primary-foreground animate-glow border-primary/50"
                  : "bg-white/10 text-foreground hover:bg-white/20 border-white/20"
              }`}
            >
              {tab === "explore" && <Trees className="w-4 h-4 inline mr-1" />}
              {tab === "sounds" && <Volume2 className="w-4 h-4 inline mr-1" />}
              {tab === "journal" && <BookOpen className="w-4 h-4 inline mr-1" />}
              {tab === "breathe" && <Wind className="w-4 h-4 inline mr-1" />}
              <span className="hidden sm:inline">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Content Area */}
      <div className="">
        {activeTab === "explore" && <ForestHero />}
        {activeTab === "sounds" && <SoundPlayer />}
        {activeTab === "journal" && <JournalSection />}
        {activeTab === "breathe" && <CalmFeatures />}
      </div>

      <Footer />
    </main>
  )
}
