"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Wind,
  CloudLightning,
  CloudRain,
  Waves,
  Moon,
  Bird,
  X,
  Square,
  Flame,
} from "lucide-react";

interface Track {
  id: string;
  title: string;
  category: "nature" | "animals" | "lofi";
  icon: string;
  audio?: string;
}

const OwlIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="9" r="2" />
    <circle cx="16" cy="9" r="2" />
    <path d="M12 2l4 4 4 2v6c0 4-4.5 8-8 8S4 18 4 14V8l4-2 4-4z" />
  </svg>
);

const WolfIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" fill="none"
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    viewBox="0 0 24 24">
    <path d="M3 21l2-6 4-2 2-6 4 4h4l2 4-2 6-7 2-7-2z" />
    <path d="M13 7l1-3 3 2" />
    <circle cx="15" cy="14" r="1" />
  </svg>
);

const SOUND_TRACKS: Track[] = [
  { id: "owls", title: "Owls", category: "animals", icon: "Owl", audio: "/audio/owl.mp3" },
  { id: "fire", title: "Fire", category: "nature", icon: "Flame", audio: "/audio/fire.mp3" },
  { id: "wind", title: "Soft Wind", category: "nature", icon: "Wind", audio: "/audio/wind.mp3" },
  { id: "night", title: "Night", category: "nature", icon: "Moon", audio: "/audio/night.mp3" },
  { id: "rain-leaves", title: "Rain on Leaves", category: "nature", icon: "CloudRain", audio: "/audio/rain.mp3" },
  { id: "wolf", title: "Wolf Howl", category: "animals", icon: "Wolf", audio: "/audio/wolf.mp3" },
  { id: "birds", title: "Bird Whispers", category: "animals", icon: "Bird", audio: "/audio/bird.mp3" },
  { id: "ocean", title: "Ocean", category: "nature", icon: "Waves", audio: "/audio/ocean.mp3" },
  { id: "thunder-rain", title: "Thunder & Heavy Rain", category: "nature", icon: "CloudLightning", audio: "/audio/thunder.mp3" },
];

const IconMap: Record<string, React.ReactNode> = {
  Bird: <Bird className="w-6 h-6" />,
  Wolf: <WolfIcon />,
  Flame: <Flame className="w-6 h-6" />,
  Owl: <OwlIcon />,
  CloudLightning: <CloudLightning className="w-6 h-6" />,
  Waves: <Waves className="w-6 h-6" />,
  Wind: <Wind className="w-6 h-6" />,
  CloudRain: <CloudRain className="w-6 h-6" />,
  Moon: <Moon className="w-6 h-6" />,
};
export let globalStopAll: (() => void) | null = null;

export default function SoundPlayer() {
  const [activeTracks, setActiveTracks] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] =
    useState<"all" | "nature" | "animals" | "lofi" | "music">("all");

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Restore state when returning to tab
// 🔥 Cleanup when leaving page or refresh
useEffect(() => {
  const stopOnLeave = () => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  };

  window.addEventListener("beforeunload", stopOnLeave);
globalStopAll = () => {
  Object.values(audioRefs.current).forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
  audioRefs.current = {};
  setActiveTracks(new Set());
  localStorage.removeItem("activeSounds");
};

  // cleanup
  return () => {
    window.removeEventListener("beforeunload", stopOnLeave);
    stopOnLeave(); // ensure stop when unmount
  };
}, []);

  // Auto stop when leaving tab OR page
  useEffect(() => {
    const stopOnLeave = () => stopAll();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAll();
    });

    window.addEventListener("beforeunload", stopOnLeave);

    return () => window.removeEventListener("beforeunload", stopOnLeave);
  }, []);

  const handleTrackSelect = (trackId: string) => {
    const track = SOUND_TRACKS.find((t) => t.id === trackId);
    if (!track) return;

    setActiveTracks((prev) => {
      const updated = new Set(prev);

      if (updated.has(trackId)) {
        audioRefs.current[trackId]?.pause();
        audioRefs.current[trackId].currentTime = 0;
        delete audioRefs.current[trackId];
        updated.delete(trackId);
      } else {
        if (!audioRefs.current[trackId]) {
          const audio = new Audio(track.audio);
          audio.loop = true;
          audioRefs.current[trackId] = audio;
        }
        audioRefs.current[trackId].play();
        updated.add(trackId);
      }

      localStorage.setItem("activeSounds", JSON.stringify([...updated]));
      return updated;
    });
  };

  const stopAll = () => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    audioRefs.current = {};
    setActiveTracks(new Set());
    localStorage.removeItem("activeSounds");
  };

  const filteredTracks =
    selectedCategory === "all"
      ? SOUND_TRACKS
      : selectedCategory === "music"
      ? SOUND_TRACKS.filter((t) => t.category === "lofi")
      : SOUND_TRACKS.filter((t) => t.category === selectedCategory);

  return (
    <div className="min-h-screen px-4 py-8 text-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Sound Gallery</h1>

        {/* Category Filter */}
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {["all", "nature", "animals", "music", "lofi"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as any)}
              className={`px-4 py-2 rounded-lg transition backdrop-blur ${
                selectedCategory === category
                  ? "bg-primary/40 border border-primary"
                  : "bg-white/10 border border-white/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {activeTracks.size > 0 && (
          <div className="mb-6 bg-white/10 p-5 rounded-xl border border-white/30">
            <h2 className="font-bold text-lg mb-3">
              Now Playing ({activeTracks.size})
            </h2>

            <div className="flex flex-wrap gap-2">
              {[...activeTracks].map((id) => {
                const track = SOUND_TRACKS.find((t) => t.id === id);
                return (
                  <div
                    key={id}
                    className="px-3 py-1 rounded-full bg-white/20 flex gap-2 items-center"
                  >
                    <span>{IconMap[track!.icon]}</span>
                    {track?.title}
                    <X className="cursor-pointer" onClick={() => handleTrackSelect(id)} />
                  </div>
                );
              })}
            </div>

            <button
              onClick={stopAll}
              className="mt-4 w-full py-3 border rounded-lg bg-red-500/40 hover:bg-red-500 transition"
            >
              Stop All 🔇
            </button>
          </div>
        )}

        {/* Sound buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTracks.map((track) => (
            <button
              key={track.id}
              onClick={() => handleTrackSelect(track.id)}
              className={`p-4 rounded-lg border transition-all backdrop-blur ${
                activeTracks.has(track.id)
                  ? "bg-primary/30 border-primary shadow-lg scale-105"
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
            >
              <div className="text-4xl flex justify-center mb-2">
                {IconMap[track.icon]}
              </div>
              <p className="text-sm">{track.title}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
