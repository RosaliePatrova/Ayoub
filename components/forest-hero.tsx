"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Languages, Rocket, X } from "lucide-react"

type Language = "en" | "darija"
type IntroStep = "light" | "cake" | "blown" | "forest"
type MessageKind = "lantern" | "star" | "planet" | "moon" | "gemini" | "beetle"
type LocalizedText = Record<Language, string>

interface SkyStar {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
}

interface Firefly {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  crawl: boolean
}

interface HiddenMessage {
  id: string
  kind: MessageKind
  title: LocalizedText
  text: LocalizedText
  x: number
  y: number
  size?: number
  tone?: "gold" | "silver" | "rose" | "violet" | "mint"
}

interface PineTree {
  x: number
  height: number
  width: number
  color: string
  opacity?: number
}

const uiCopy = {
  en: {
    switchLanguage: "Moroccan / الدارجة المغربية",
    blowCandles: "Blow Out the Candles",
    enterForest: "Enter the Forest",
    happyBirthday: "Happy Birthday Ayoub",
    introLine: "This little universe was made for you, with love.",
    heroTitle: "Happy Birthday, Ayoub",
    heroSubtitle: "Find the hidden lights I left for you.",
    heroSmall: "Every lantern, star, planet, and moon has something I wanted your heart to hear.",
    spaceButton: "Do you want to go to space?",
    spaceButtonShort: "Space",
    turnOffLight: "Turn off the light",
    close: "Close",
    openMessage: "Open a hidden birthday message",
    language: "Language",
  },
  darija: {
    switchLanguage: "EN",
    blowCandles: "طفي الشموع",
    enterForest: "دخل للغابة",
    happyBirthday: "عيد ميلاد سعيد أيوب",
    introLine: "هاد الكون الصغير تصاوب ليك بالحب.",
    heroTitle: "عيد ميلاد سعيد، أيوب",
    heroSubtitle: "قلب على الضوّيات اللي خليت ليك.",
    heroSmall: "كل قنديل، نجمة، كوكب، والقمر فيه كلام بغيت قلبك يسمعو.",
    spaceButton: "بغيتي نمشيو للفضاء؟",
    spaceButtonShort: "الفضاء",
    turnOffLight: "طفي الضو",
    close: "سد",
    openMessage: "حل رسالة عيد ميلاد مخبية",
    language: "اللغة",
  },
} satisfies Record<Language, Record<string, string>>

const kindLabels = {
  en: {
    lantern: "Hidden Lantern",
    star: "Hidden Star",
    planet: "Hidden Planet",
    moon: "Moon Message",
    gemini: "Gemini Message",
    beetle: "Glowing Beetle",
  },
  darija: {
    lantern: "قنديل مخبي",
    star: "نجمة مخبية",
    planet: "كوكب مخبي",
    moon: "رسالة القمر",
    gemini: "رسالة الجوزاء",
    beetle: "ضو صغير",
  },
} satisfies Record<Language, Record<MessageKind, string>>

const hiddenMessages: HiddenMessage[] = [
  {
    id: "lantern-softness",
    kind: "lantern",
    x: 12,
    y: 61,
    tone: "gold",
    title: {
      en: "For Your New Year",
      darija: "لعامك الجديد",
    },
    text: {
      en: "Happy birthday, my love. I hope this year brings you softness, wonder, and reasons to smile.",
      darija: "عيد ميلاد سعيد حبيبي. كنتمنا هاد العام يجيب ليك الراحة، الدهشة، وبزاف ديال الأسباب باش تبتسم.",
    },
  },
  {
    id: "lantern-magic",
    kind: "lantern",
    x: 27,
    y: 69,
    tone: "gold",
    title: {
      en: "The Way You Glow",
      darija: "الضو ديالك",
    },
    text: {
      en: "You make ordinary things feel magical.",
      darija: "كتخلي الحوايج العادية يبانوا بحال السحر.",
    },
  },
  {
    id: "lantern-curiosity",
    kind: "lantern",
    x: 48,
    y: 59,
    tone: "gold",
    title: {
      en: "Your Curious Mind",
      darija: "العقل الفضولي ديالك",
    },
    text: {
      en: "I love the way your mind notices the little things everyone else misses.",
      darija: "كنحب كيفاش عقلك كيشوف التفاصيل الصغيرة اللي كيدوزو عليها الناس.",
    },
  },
  {
    id: "lantern-special",
    kind: "lantern",
    x: 67,
    y: 66,
    tone: "gold",
    title: {
      en: "Special To Me",
      darija: "مميز عندي",
    },
    text: {
      en: "You are special to me in a way words always fail to explain.",
      darija: "نتا مميز عندي بطريقة الكلمات ديما كتقصّر باش تشرحها.",
    },
  },
  {
    id: "lantern-born",
    kind: "lantern",
    x: 84,
    y: 62,
    tone: "gold",
    title: {
      en: "Because You Exist",
      darija: "حيت نتا كاين",
    },
    text: {
      en: "I am so grateful you were born, Ayoub.",
      darija: "فرحانة بزاف حيث تزادتي، أيوب.",
    },
  },
  {
    id: "gemini",
    kind: "gemini",
    x: 9,
    y: 15,
    tone: "silver",
    title: {
      en: "Gemini",
      darija: "الجوزاء",
    },
    text: {
      en: "Some stars look random until you connect them.\nThat is how finding you feels to me, like the universe quietly drew a line between two souls.",
      darija: "كاينين نجوم كيبانو عشوائيين حتى كنوصلو بينهم.\nهكا حسّيت ملي لقيتك: بحال الكون رسم بخفة خط بين جوج أرواح.",
    },
  },
  {
    id: "moon-love",
    kind: "moon",
    x: 84,
    y: 15,
    tone: "silver",
    title: {
      en: "My Favorite Place",
      darija: "البلاصة المفضلة ديالي",
    },
    text: {
      en: "Ayoub, I love you in the softest way.\nI love your mind, your curiosity, your strange little wonders, and the way you make the world feel less ordinary.\nYou are not just someone I love.\nYou are my favorite place in this universe.",
      darija:
        "أيوب، كنحبك بطريقة ناعمة بزاف.\nكنحب عقلك، فضولك، العجائب الصغيرة ديالك، وكيفاش كتخلي العالم يبان أقل عادي.\nنتا ماشي غير واحد كنحبو.\nنتا البلاصة المفضلة ديالي فهاد الكون.",
    },
  },
  {
    id: "star-curious",
    kind: "star",
    x: 36,
    y: 19,
    tone: "silver",
    title: {
      en: "A Bright Thought",
      darija: "فكرة منورة",
    },
    text: {
      en: "You are my favorite curious soul.",
      darija: "نتا الروح الفضولية المفضلة عندي.",
    },
  },
  {
    id: "star-little-things",
    kind: "star",
    x: 58,
    y: 16,
    tone: "silver",
    title: {
      en: "Little Wonders",
      darija: "العجائب الصغيرة",
    },
    text: {
      en: "Every little thing you love makes me love you more.",
      darija: "كل حاجة صغيرة كتعجبك كتخليني نحبك كثر.",
    },
  },
  {
    id: "star-soft-world",
    kind: "star",
    x: 74,
    y: 29,
    tone: "silver",
    title: {
      en: "Softer World",
      darija: "عالم أحن",
    },
    text: {
      en: "Happy birthday to the person who makes my world softer.",
      darija: "عيد ميلاد سعيد للإنسان اللي كيخلي عالمي أحن.",
    },
  },
  {
    id: "star-matter",
    kind: "star",
    x: 22,
    y: 34,
    tone: "silver",
    title: {
      en: "You Matter",
      darija: "نتا مهم",
    },
    text: {
      en: "You matter to me more than you know.",
      darija: "نتا مهم عندي كثر مما كتعرف.",
    },
  },
  {
    id: "planet-open-doors",
    kind: "planet",
    x: 47,
    y: 29,
    size: 54,
    tone: "violet",
    title: {
      en: "A Sky Of Doors",
      darija: "سما عامرة بالبيبان",
    },
    text: {
      en: "I hope your new year feels like a sky full of open doors.",
      darija: "كنتمنا عامك الجديد يحس بحال سما عامرة ببيبان محلولين.",
    },
  },
  {
    id: "planet-more-love",
    kind: "planet",
    x: 68,
    y: 13,
    size: 42,
    tone: "rose",
    title: {
      en: "Your Own Orbit",
      darija: "المدار ديالك",
    },
    text: {
      en: "The things you love are tiny planets in your own beautiful orbit, and I love visiting them with you.",
      darija: "الحوايج اللي كتحب بحال كواكب صغار فمدارك الزوين، وكنحب نزورهم معاك.",
    },
  },
  {
    id: "beetle-celebrate",
    kind: "beetle",
    x: 18,
    y: 79,
    tone: "mint",
    title: {
      en: "Tiny Celebration",
      darija: "فرحة صغيرة",
    },
    text: {
      en: "The tiny lights are celebrating you too.",
      darija: "حتى هاد الضوّيات الصغار فرحانين بيك اليوم.",
    },
  },
  {
    id: "beetle-corners",
    kind: "beetle",
    x: 77,
    y: 81,
    tone: "mint",
    title: {
      en: "Every Glowing Corner",
      darija: "كل ركن منور",
    },
    text: {
      en: "You are loved in every little glowing corner here.",
      darija: "راك محبوب فكل ركن صغير كيشعل هنا.",
    },
  },
]

const forestLayers: PineTree[][] = [
  [
    { x: -20, height: 240, width: 90, color: "#08281f", opacity: 0.55 },
    { x: 70, height: 300, width: 104, color: "#08281f", opacity: 0.55 },
    { x: 185, height: 250, width: 88, color: "#08281f", opacity: 0.55 },
    { x: 310, height: 330, width: 112, color: "#08281f", opacity: 0.55 },
    { x: 455, height: 270, width: 96, color: "#08281f", opacity: 0.55 },
    { x: 580, height: 315, width: 112, color: "#08281f", opacity: 0.55 },
    { x: 735, height: 260, width: 94, color: "#08281f", opacity: 0.55 },
    { x: 850, height: 335, width: 120, color: "#08281f", opacity: 0.55 },
    { x: 1030, height: 270, width: 98, color: "#08281f", opacity: 0.55 },
    { x: 1130, height: 315, width: 105, color: "#08281f", opacity: 0.55 },
  ],
  [
    { x: -10, height: 310, width: 110, color: "#093629", opacity: 0.75 },
    { x: 100, height: 410, width: 135, color: "#093629", opacity: 0.75 },
    { x: 240, height: 340, width: 118, color: "#093629", opacity: 0.75 },
    { x: 405, height: 430, width: 148, color: "#093629", opacity: 0.75 },
    { x: 570, height: 360, width: 126, color: "#093629", opacity: 0.75 },
    { x: 720, height: 395, width: 142, color: "#093629", opacity: 0.75 },
    { x: 880, height: 330, width: 118, color: "#093629", opacity: 0.75 },
    { x: 1010, height: 420, width: 145, color: "#093629", opacity: 0.75 },
    { x: 1140, height: 345, width: 124, color: "#093629", opacity: 0.75 },
  ],
  [
    { x: -35, height: 460, width: 150, color: "#03170f" },
    { x: 85, height: 530, width: 172, color: "#03170f" },
    { x: 260, height: 450, width: 148, color: "#03170f" },
    { x: 390, height: 550, width: 180, color: "#03170f" },
    { x: 575, height: 470, width: 155, color: "#03170f" },
    { x: 700, height: 525, width: 175, color: "#03170f" },
    { x: 890, height: 455, width: 150, color: "#03170f" },
    { x: 1010, height: 535, width: 180, color: "#03170f" },
    { x: 1145, height: 470, width: 155, color: "#03170f" },
  ],
]

function createSeededRandom(seed: number) {
  let value = seed

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

function makeStars(): SkyStar[] {
  const random = createSeededRandom(2811)

  return Array.from({ length: 118 }, (_, id) => ({
    id,
    x: random() * 100,
    y: random() * 47,
    size: random() * 1.8 + 0.65,
    opacity: random() * 0.55 + 0.3,
    duration: random() * 2.8 + 2.5,
    delay: random() * 3.5,
  }))
}

function makeFireflies(): Firefly[] {
  const random = createSeededRandom(7007)

  return Array.from({ length: 26 }, (_, id) => ({
    id,
    x: random() * 96 + 2,
    y: random() * 34 + 51,
    size: random() * 4 + 4,
    duration: random() * 8 + 9,
    delay: random() * 5,
    crawl: id % 5 === 0,
  }))
}

function getMessage(id: string) {
  return hiddenMessages.find((message) => message.id === id)
}

function LanguageToggle({
  language,
  onToggle,
  className = "",
}: {
  language: Language
  onToggle: () => void
  className?: string
}) {
  const copy = uiCopy[language]

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={copy.language}
      className={`inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-2 text-xs font-medium text-[#f7f1cf] shadow-[0_0_24px_rgba(249,213,133,0.16)] backdrop-blur-md transition hover:border-[#f9d585]/70 hover:bg-[#f9d585]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9d585]/70 ${className}`}
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      <span>{copy.switchLanguage}</span>
    </button>
  )
}

function BirthdayIntro({
  introStep,
  language,
  onTurnOffLight,
  onBlowCandles,
  onEnterForest,
  onToggleLanguage,
}: {
  introStep: IntroStep
  language: Language
  onTurnOffLight: () => void
  onBlowCandles: () => void
  onEnterForest: () => void
  onToggleLanguage: () => void
}) {
  const copy = uiCopy[language]
  const isLight = introStep === "light"
  const isBlown = introStep === "blown"

  return (
    <section
      className="fixed inset-0 z-[70] flex min-h-[100svh] items-center justify-center overflow-hidden bg-black px-5 text-center text-white"
      dir={language === "darija" ? "rtl" : "ltr"}
    >
      <LanguageToggle
        language={language}
        onToggle={onToggleLanguage}
        className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6"
      />

      <div
        className={`flex w-full max-w-xl flex-col items-center transition duration-1000 ${
          isLight || introStep === "cake" || isBlown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        {isLight ? (
          <LightIntro copy={copy} onTurnOffLight={onTurnOffLight} />
        ) : (
          <>
            <BirthdayCake blown={isBlown} />

            <div
              className={`mt-8 grid transition-all duration-700 ${
                isBlown ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <h1 className="font-playfair text-4xl font-semibold leading-tight text-[#fff6cf] drop-shadow-[0_0_24px_rgba(249,213,133,0.55)] sm:text-5xl">
                  {copy.happyBirthday}
                </h1>
                <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#d9e6ff]/85 sm:text-lg">{copy.introLine}</p>
              </div>
            </div>

            <div className="mt-8 min-h-12">
              {!isBlown ? (
                <button
                  type="button"
                  onClick={onBlowCandles}
                  className="rounded-full border border-[#f9d585]/50 bg-[#f9d585]/15 px-6 py-3 text-sm font-semibold text-[#fff7d8] shadow-[0_0_30px_rgba(249,213,133,0.26)] backdrop-blur-md transition hover:bg-[#f9d585]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9d585]"
                >
                  {copy.blowCandles}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onEnterForest}
                  className="rounded-full border border-[#9fe8d3]/50 bg-[#9fe8d3]/15 px-6 py-3 text-sm font-semibold text-[#e7fff8] shadow-[0_0_32px_rgba(95,174,158,0.3)] backdrop-blur-md transition hover:bg-[#9fe8d3]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9fe8d3]"
                >
                  {copy.enterForest}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function LightIntro({
  copy,
  onTurnOffLight,
}: {
  copy: (typeof uiCopy)[Language]
  onTurnOffLight: () => void
}) {
  return (
    <button
      type="button"
      onClick={onTurnOffLight}
      className="group flex flex-col items-center gap-8 rounded-lg p-4 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9d585]/75"
      aria-label={copy.turnOffLight}
    >
      <svg
        className="h-36 w-28 drop-shadow-[0_0_22px_rgba(255,240,180,0.62)] transition group-hover:drop-shadow-[0_0_42px_rgba(255,240,180,0.95)]"
        viewBox="0 0 100 140"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="forestBulbGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fff8d0" />
            <stop offset="40%" stopColor="#ffd060" />
            <stop offset="100%" stopColor="#ff9020" stopOpacity="0.4" />
          </radialGradient>
          <filter id="forestBulbGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <line x1="50" y1="0" x2="50" y2="25" stroke="rgba(255,240,180,0.5)" strokeWidth="2" />
        <ellipse cx="50" cy="60" rx="30" ry="35" fill="url(#forestBulbGrad)" filter="url(#forestBulbGlow)" opacity="0.9" />
        <rect x="36" y="88" width="28" height="8" rx="2" fill="rgba(255,200,100,0.6)" />
        <rect x="38" y="96" width="24" height="6" rx="1" fill="rgba(255,180,80,0.5)" />
        <rect x="40" y="102" width="20" height="5" rx="1" fill="rgba(255,160,60,0.4)" />
        <path
          d="M 43 78 Q 47 68 50 72 Q 53 68 57 78"
          stroke="rgba(255,255,200,0.9)"
          strokeWidth="1.5"
          fill="none"
          filter="url(#forestBulbGlow)"
        />
      </svg>
      <span className="font-playfair text-lg font-semibold tracking-[0.25em] text-[#fff1bd]/80 drop-shadow-[0_0_18px_rgba(249,213,133,0.45)]">
        {copy.turnOffLight}
      </span>
    </button>
  )
}

function BirthdayCake({ blown }: { blown: boolean }) {
  const candles = [
    { left: "34%", delay: "0s" },
    { left: "50%", delay: "0.18s" },
    { left: "66%", delay: "0.32s" },
  ]

  return (
    <div className="relative h-64 w-72 sm:h-72 sm:w-80" aria-hidden="true">
      <div className="absolute left-1/2 top-8 h-44 w-44 -translate-x-1/2 rounded-full bg-[#f8d88c]/10 blur-3xl" />
      <div className="absolute bottom-4 left-1/2 h-4 w-60 -translate-x-1/2 rounded-full bg-black/70 blur-md" />

      <div className="absolute bottom-12 left-1/2 h-20 w-60 -translate-x-1/2 overflow-hidden rounded-lg border border-[#fff0c9]/20 bg-gradient-to-b from-[#f6c7b5] via-[#d9838a] to-[#7b344a] shadow-[0_0_40px_rgba(249,213,133,0.18)]">
        <div className="absolute left-0 right-0 top-0 h-5 bg-[#fff2cf]" />
        <div className="absolute left-6 top-0 h-10 w-6 rounded-b-full bg-[#fff2cf]" />
        <div className="absolute left-24 top-0 h-8 w-5 rounded-b-full bg-[#fff2cf]" />
        <div className="absolute right-10 top-0 h-11 w-7 rounded-b-full bg-[#fff2cf]" />
        <div className="absolute bottom-3 left-6 right-6 h-px bg-white/20" />
      </div>

      <div className="absolute bottom-[7.5rem] left-1/2 h-16 w-48 -translate-x-1/2 overflow-hidden rounded-lg border border-[#fff0c9]/20 bg-gradient-to-b from-[#fff0c9] via-[#ef9faa] to-[#9b486a] shadow-[0_0_28px_rgba(255,210,225,0.14)]">
        <div className="absolute left-0 right-0 top-0 h-4 bg-[#fff7e7]" />
        <div className="absolute left-10 top-0 h-8 w-5 rounded-b-full bg-[#fff7e7]" />
        <div className="absolute right-12 top-0 h-9 w-6 rounded-b-full bg-[#fff7e7]" />
      </div>

      {candles.map((candle, index) => (
        <div
          key={index}
          className="absolute bottom-[11.4rem] h-14 w-3 rounded-full bg-gradient-to-b from-[#eef6ff] to-[#92b9d1] shadow-[0_0_12px_rgba(220,225,255,0.4)]"
          style={{ left: candle.left }}
        >
          <span
            className={`animate-candle-flicker absolute -top-7 left-1/2 h-8 w-5 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#fffbd5] via-[#ffc85f] to-[#ff7a45] blur-[0.2px] transition-all duration-700 ${
              blown ? "scale-0 opacity-0" : "scale-100 opacity-100"
            }`}
            style={{ animationDelay: candle.delay }}
          />
          <span className="absolute left-1/2 top-1 h-9 w-px -translate-x-1/2 bg-white/45" />
        </div>
      ))}
    </div>
  )
}

function PineForestLayer({ trees, className }: { trees: PineTree[]; className: string }) {
  return (
    <svg
      className={`pointer-events-none absolute bottom-0 left-0 w-full ${className}`}
      viewBox="0 0 1200 560"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {trees.map((tree, index) => (
        <PineTreeSilhouette key={`${tree.x}-${index}`} tree={tree} />
      ))}
    </svg>
  )
}

function PineTreeSilhouette({ tree }: { tree: PineTree }) {
  const scaleX = tree.width / 100
  const scaleY = tree.height / 260
  const y = 560 - tree.height

  return (
    <g transform={`translate(${tree.x} ${y}) scale(${scaleX} ${scaleY})`} opacity={tree.opacity ?? 1}>
      <rect x="46" y="124" width="8" height="136" rx="3" fill={tree.color} />
      <path
        d="M50 2 C43 28 34 43 23 58 C34 55 40 54 44 55 C34 79 20 96 7 112 C25 108 35 106 42 107 C30 134 16 154 0 174 C21 168 34 165 43 166 C34 190 22 213 8 236 C31 229 70 229 92 236 C78 213 66 190 57 166 C66 165 79 168 100 174 C84 154 70 134 58 107 C65 106 75 108 93 112 C80 96 66 79 56 55 C60 54 66 55 77 58 C66 43 57 28 50 2Z"
        fill={tree.color}
      />
      <path d="M50 20 C46 35 40 48 32 60 C42 58 58 58 68 60 C60 48 54 35 50 20Z" fill="rgba(255,255,255,0.05)" />
    </g>
  )
}

function MoonButton({
  message,
  language,
  onOpen,
}: {
  message: HiddenMessage
  language: Language
  onOpen: (message: HiddenMessage) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(message)}
      aria-label={`${uiCopy[language].openMessage}: ${message.title[language]}`}
      className="animate-moon-breathe group absolute right-[7%] top-[14%] z-20 h-20 w-20 rounded-full transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dce1ff]/80 md:right-[9%] md:top-[10%] md:h-32 md:w-32"
    >
      <span className="absolute inset-0 rounded-full bg-[#dce1ff]/30 blur-2xl transition group-hover:bg-[#fff3c2]/40" />
      <svg className="relative h-full w-full drop-shadow-[0_0_24px_rgba(220,225,255,0.55)]" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <radialGradient id="ayoubMoonGradient" cx="35%" cy="28%">
            <stop offset="0%" stopColor="#fff8d7" />
            <stop offset="58%" stopColor="#dfe7ff" />
            <stop offset="100%" stopColor="#aebad8" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="89" fill="url(#ayoubMoonGradient)" />
        <circle cx="70" cy="68" r="9" fill="#9fa7bf" opacity="0.34" />
        <circle cx="115" cy="84" r="6" fill="#9fa7bf" opacity="0.28" />
        <circle cx="132" cy="123" r="7" fill="#9fa7bf" opacity="0.32" />
        <circle cx="84" cy="136" r="5" fill="#9fa7bf" opacity="0.22" />
      </svg>
    </button>
  )
}

function GeminiConstellation({
  message,
  language,
  onOpen,
}: {
  message: HiddenMessage
  language: Language
  onOpen: (message: HiddenMessage) => void
}) {
  const points = [
    [40, 22],
    [74, 38],
    [108, 60],
    [140, 84],
    [156, 124],
    [34, 78],
    [68, 96],
    [101, 116],
    [132, 136],
  ]
  const lines = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [5, 6],
    [6, 7],
    [7, 8],
    [2, 6],
  ]

  return (
    <button
      type="button"
      onClick={() => onOpen(message)}
      aria-label={`${uiCopy[language].openMessage}: ${message.title[language]}`}
      className="group absolute left-[4%] top-[14%] z-20 h-36 w-48 rounded-lg transition hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dce1ff]/70 sm:left-[7%] sm:h-44 sm:w-60"
    >
      <svg className="h-full w-full overflow-visible" viewBox="0 0 190 160" aria-hidden="true">
        <g className="opacity-55 transition group-hover:opacity-90">
          {lines.map(([start, end]) => (
            <line
              key={`${start}-${end}`}
              x1={points[start][0]}
              y1={points[start][1]}
              x2={points[end][0]}
              y2={points[end][1]}
              stroke="#dce1ff"
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.6"
            />
          ))}
        </g>
        {points.map(([x, y], index) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={index === 3 || index === 6 ? 2.5 : 1.9}
            fill="#f8fbff"
            className="animate-star-twinkle"
            style={{ animationDelay: `${index * 0.22}s` }}
          />
        ))}
      </svg>
    </button>
  )
}

function SpecialStar({
  message,
  language,
  onOpen,
}: {
  message: HiddenMessage
  language: Language
  onOpen: (message: HiddenMessage) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(message)}
      aria-label={`${uiCopy[language].openMessage}: ${message.title[language]}`}
      className="group absolute z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dce1ff]/70"
      style={{ left: `${message.x}%`, top: `${message.y}%` }}
    >
      <span className="absolute h-8 w-8 rounded-full bg-[#dce1ff]/10 blur-md transition group-hover:bg-[#fff5b8]/20" />
      <span className="animate-star-twinkle h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_12px_5px_rgba(220,225,255,0.45)]" />
    </button>
  )
}

function PlanetButton({
  message,
  language,
  onOpen,
}: {
  message: HiddenMessage
  language: Language
  onOpen: (message: HiddenMessage) => void
}) {
  const size = message.size ?? 48
  const palette =
    message.tone === "rose"
      ? "from-[#ffd4df] via-[#cb6c97] to-[#4f2346]"
      : "from-[#ddd6ff] via-[#8b7ad8] to-[#2e285b]"

  return (
    <button
      type="button"
      onClick={() => onOpen(message)}
      aria-label={`${uiCopy[language].openMessage}: ${message.title[language]}`}
      className="animate-planet-float group absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dce1ff]/70"
      style={{ left: `${message.x}%`, top: `${message.y}%`, width: size, height: size }}
    >
      <span className={`absolute inset-0 rounded-full bg-gradient-to-br ${palette} shadow-[0_0_24px_rgba(190,178,255,0.34)]`} />
      <span className="absolute left-1/2 top-1/2 h-[34%] w-[140%] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-full border border-[#f9f5d2]/50 transition group-hover:border-[#fff7be]" />
      <span className="absolute inset-[18%] rounded-full bg-white/14" />
    </button>
  )
}

function Lantern({
  message,
  language,
  onOpen,
}: {
  message: HiddenMessage
  language: Language
  onOpen: (message: HiddenMessage) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(message)}
      aria-label={`${uiCopy[language].openMessage}: ${message.title[language]}`}
      className="animate-lantern-sway group absolute z-30 flex h-20 w-12 -translate-x-1/2 -translate-y-1/2 items-start justify-center rounded-lg transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9d585]/80"
      style={{ left: `${message.x}%`, top: `${message.y}%` }}
    >
      <span className="absolute top-0 h-8 w-px bg-[#caa96d]/70" />
      <span className="absolute top-7 h-8 w-6 rounded-md border border-[#ffd993]/70 bg-[#ffb84a]/25 shadow-[0_0_22px_8px_rgba(255,184,74,0.22)] transition group-hover:shadow-[0_0_32px_12px_rgba(255,205,117,0.36)]">
        <span className="absolute inset-1 rounded-sm bg-[#ffe49c]/65 blur-[1px]" />
        <span className="absolute -left-1 right-[-0.25rem] top-1/2 h-px bg-[#ffe7a8]/40" />
      </span>
    </button>
  )
}

function BeetleButton({
  message,
  language,
  onOpen,
}: {
  message: HiddenMessage
  language: Language
  onOpen: (message: HiddenMessage) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(message)}
      aria-label={`${uiCopy[language].openMessage}: ${message.title[language]}`}
      className="animate-beetle-crawl group absolute z-30 h-9 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full transition hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8ffd8]/80"
      style={{ left: `${message.x}%`, top: `${message.y}%` }}
    >
      <span className="absolute left-1/2 top-1/2 h-3 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dfff9a] shadow-[0_0_18px_7px_rgba(223,255,154,0.36)]" />
      <span className="absolute left-4 top-2 h-3 w-3 rounded-full bg-[#bfffdc]/25 blur-[1px]" />
      <span className="absolute right-4 top-2 h-3 w-3 rounded-full bg-[#bfffdc]/25 blur-[1px]" />
    </button>
  )
}

function MessageModal({
  message,
  language,
  onClose,
}: {
  message: HiddenMessage | null
  language: Language
  onClose: () => void
}) {
  if (!message) {
    return null
  }

  const copy = uiCopy[language]
  const borderColor = message.tone === "silver" ? "border-[#dce1ff]/55" : "border-[#f9d585]/55"
  const glowColor =
    message.tone === "silver"
      ? "shadow-[0_0_60px_rgba(220,225,255,0.22)]"
      : "shadow-[0_0_60px_rgba(249,213,133,0.2)]"

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="birthday-message-title"
      dir={language === "darija" ? "rtl" : "ltr"}
    >
      <div
        className={`relative w-full max-w-lg rounded-lg border ${borderColor} ${glowColor} bg-[#07140f]/75 p-6 text-[#eef5ff] backdrop-blur-xl sm:p-8`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={copy.close}
          className={`absolute top-4 rounded-full border border-white/15 bg-white/10 p-2 text-white/80 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
            language === "darija" ? "left-4" : "right-4"
          }`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <p className="mb-3 text-xs font-semibold text-[#f9d585]/80">{kindLabels[language][message.kind]}</p>
        <h2 id="birthday-message-title" className="font-playfair text-3xl font-semibold leading-tight text-[#fff6cf]">
          {message.title[language]}
        </h2>
        <p className="mt-5 whitespace-pre-line text-base leading-8 text-[#e5ecff]/90 sm:text-lg">{message.text[language]}</p>
      </div>
    </div>
  )
}

export default function ForestHero() {
  const [introStep, setIntroStep] = useState<IntroStep>("light")
  const [language, setLanguage] = useState<Language>("en")
  const [selectedMessage, setSelectedMessage] = useState<HiddenMessage | null>(null)
  const [stars, setStars] = useState<SkyStar[]>([])
  const [fireflies, setFireflies] = useState<Firefly[]>([])
  const birthdayAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setStars(makeStars())
    setFireflies(makeFireflies())
  }, [])

  useEffect(() => {
    const audio = new Audio("/rond/hbd.mp3")
    audio.loop = true
    audio.preload = "auto"
    audio.volume = 0.45
    birthdayAudioRef.current = audio

    return () => {
      audio.pause()
      birthdayAudioRef.current = null
    }
  }, [])

  const copy = uiCopy[language]
  const moonMessage = getMessage("moon-love")
  const geminiMessage = getMessage("gemini")
  const specialStars = hiddenMessages.filter((message) => message.kind === "star")
  const planets = hiddenMessages.filter((message) => message.kind === "planet")
  const lanterns = hiddenMessages.filter((message) => message.kind === "lantern")
  const beetles = hiddenMessages.filter((message) => message.kind === "beetle")
  const toggleLanguage = () => setLanguage((current) => (current === "en" ? "darija" : "en"))
  const startBirthdayMusic = () => {
    const audio = birthdayAudioRef.current
    if (!audio) return

    audio.currentTime = 0
    audio.play().catch(() => {
      // Browser policies can still block audio on unusual devices.
    })
  }

  if (introStep !== "forest") {
    return (
      <BirthdayIntro
        introStep={introStep}
        language={language}
        onTurnOffLight={() => {
          startBirthdayMusic()
          setIntroStep("cake")
        }}
        onBlowCandles={() => setIntroStep("blown")}
        onEnterForest={() => setIntroStep("forest")}
        onToggleLanguage={toggleLanguage}
      />
    )
  }

  return (
    <section
      className="animate-forest-fade-in relative z-50 min-h-[100svh] w-full overflow-hidden bg-[#02060f] text-[#dce1ff]"
      dir={language === "darija" ? "rtl" : "ltr"}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#020611_0%,#081a33_28%,#0d2730_52%,#082219_68%,#020806_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[58%] bg-[radial-gradient(ellipse_at_50%_10%,rgba(100,118,205,0.28),transparent_42%),radial-gradient(ellipse_at_80%_24%,rgba(247,178,207,0.12),transparent_34%),linear-gradient(180deg,rgba(7,12,31,0.1),transparent)]" />
      <div className="absolute inset-x-0 top-[42%] h-[26%] bg-gradient-to-b from-transparent via-[#1c6260]/18 to-[#082219]/60" />
      <div className="animate-mist-drift absolute left-[-10%] top-[52%] h-24 w-[120%] bg-gradient-to-r from-transparent via-white/12 to-transparent blur-2xl" />
      <div className="animate-mist-drift absolute left-[-20%] top-[66%] h-28 w-[140%] bg-gradient-to-r from-transparent via-[#bdeee3]/10 to-transparent blur-3xl [animation-delay:2s]" />

      <LanguageToggle language={language} onToggle={toggleLanguage} className="absolute right-4 top-4 z-40 sm:right-6 sm:top-6" />

      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <span
            key={star.id}
            className="animate-star-twinkle absolute rounded-full bg-white"
            style={
              {
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animationDuration: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
                boxShadow: "0 0 9px rgba(220,225,255,0.55)",
              } satisfies CSSProperties
            }
          />
        ))}
      </div>

      {moonMessage && <MoonButton message={moonMessage} language={language} onOpen={setSelectedMessage} />}
      {geminiMessage && <GeminiConstellation message={geminiMessage} language={language} onOpen={setSelectedMessage} />}

      {specialStars.map((message) => (
        <SpecialStar key={message.id} message={message} language={language} onOpen={setSelectedMessage} />
      ))}

      {planets.map((message) => (
        <PlanetButton key={message.id} message={message} language={language} onOpen={setSelectedMessage} />
      ))}

      <div className="absolute inset-x-0 bottom-0 h-[72%] pointer-events-none">
        <PineForestLayer trees={forestLayers[0]} className="h-[62%] opacity-80" />
        <PineForestLayer trees={forestLayers[1]} className="h-[74%]" />
        <PineForestLayer trees={forestLayers[2]} className="h-[88%]" />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#010403] via-[#03100b] to-transparent" />
      </div>

      {lanterns.map((message) => (
        <Lantern key={message.id} message={message} language={language} onOpen={setSelectedMessage} />
      ))}

      <div className="pointer-events-none absolute inset-0 z-20">
        {fireflies.map((firefly) => (
          <span
            key={firefly.id}
            className={`absolute rounded-full bg-[#f9f5b2] ${
              firefly.crawl ? "animate-beetle-crawl" : "animate-drift"
            }`}
            style={
              {
                left: `${firefly.x}%`,
                top: `${firefly.y}%`,
                width: `${firefly.size}px`,
                height: `${firefly.size}px`,
                animationDuration: `${firefly.duration}s`,
                animationDelay: `${firefly.delay}s`,
                filter: "drop-shadow(0 0 9px #f9f5b2)",
                opacity: 0.85,
              } satisfies CSSProperties
            }
          />
        ))}
      </div>

      {beetles.map((message) => (
        <BeetleButton key={message.id} message={message} language={language} onOpen={setSelectedMessage} />
      ))}

      <div className="pointer-events-none relative z-30 flex min-h-[100svh] items-center justify-center px-5 text-center">
        <div className="mt-16 max-w-3xl">
          <h1 className="font-playfair text-4xl font-semibold leading-tight text-[#fff6cf] drop-shadow-[0_0_26px_rgba(249,213,133,0.45)] sm:text-6xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-5 text-xl font-medium text-[#91ead5] drop-shadow-[0_0_18px_rgba(95,174,158,0.35)] sm:text-3xl">
            {copy.heroSubtitle}
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#dce1ff]/72 sm:text-base">{copy.heroSmall}</p>
        </div>
      </div>

      <a
        href="/rond"
        aria-label={copy.spaceButton}
        title={copy.spaceButton}
        className="group absolute bottom-5 left-4 z-50 inline-flex items-center gap-2 rounded-full border border-[#dce1ff]/30 bg-[#081326]/72 px-3 py-2 text-xs font-semibold text-[#f7f1cf] shadow-[0_0_24px_rgba(145,234,213,0.2),inset_0_0_14px_rgba(249,245,178,0.06)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#91ead5]/70 hover:bg-[#10213b]/85 hover:shadow-[0_0_34px_rgba(145,234,213,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#91ead5]/80 sm:bottom-6 sm:left-6"
      >
        <Rocket className="h-4 w-4 transition group-hover:rotate-12" aria-hidden="true" />
        <span>{copy.spaceButtonShort}</span>
      </a>

      <MessageModal message={selectedMessage} language={language} onClose={() => setSelectedMessage(null)} />
    </section>
  )
}
