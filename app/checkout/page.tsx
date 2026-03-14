"use client"

import Link from "next/link"
import { Skull, AlertTriangle, Zap } from "lucide-react"

let touchGrassPageAudio: HTMLAudioElement | null = null

export default function CheckoutBrainrotPage() {
  const handleTouchGrass = () => {
    if (typeof window !== "undefined") {
      if (!touchGrassPageAudio) {
        touchGrassPageAudio = new Audio("/touch-grass-page-audio.mpeg")
        touchGrassPageAudio.loop = true
        touchGrassPageAudio.volume = 1
      }
      void touchGrassPageAudio.play().catch(() => {})
    }

    const container = document.getElementById("touch-grass-container")
    if (!container) return
    container.innerHTML = `
      <div class="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden neon-box h-64">
        <img src="/touch-grass.png" alt="Touch grass" class="w-full h-full object-cover" />
      </div>
    `

    setTimeout(() => {
      if (!container) return
      container.innerHTML = `
        <div class="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden neon-box h-64">
          <video
            src="/touch-grass-video.mp4"
            class="w-full h-full object-cover"
            autoplay
            loop
            playsinline
          ></video>
        </div>
      `
    }, 3500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-4 left-4 z-20">
        <Link
          href="/"
          onClick={() => {
            if (touchGrassPageAudio) {
              touchGrassPageAudio.pause()
              touchGrassPageAudio.currentTime = 0
            }
          }}
          className="text-xs md:text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
        >
          ← back to home
        </Link>
      </div>
      {/* floating chaos */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-float-meme"
            style={{
              left: `${(i * 19) % 100}%`,
              top: `${(i * 11) % 100}%`,
              animationDelay: `${i * 0.12}s`,
              animationDuration: `${3 + (i % 5)}s`,
              transform: `rotate(${(i % 3 - 1) * 18}deg)`,
            }}
          >
            {["💀", "🗿", "😭", "🔥", "👁️", "⚡", "🌀", "🤡", "🦴", "😈"][i % 10]}
          </div>
        ))}
      </div>

      <div
        id="touch-grass-container"
        className="relative z-10 w-full max-w-2xl rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-6 md:p-10 neon-box"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Skull className="w-8 h-8 text-primary animate-bounce" />
          <h1 className="font-[family-name:var(--font-bungee)] text-3xl md:text-5xl neon-text animate-rainbow-text text-center">
            CHECKOUT??
          </h1>
          <Skull className="w-8 h-8 text-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
        </div>

        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-5 md:p-6 space-y-3">
          <div className="flex items-center gap-2 text-destructive font-bold">
            <AlertTriangle className="w-5 h-5" />
            <span>Reality check incoming</span>
          </div>
          <p className="text-lg md:text-2xl font-bold leading-snug">
            Seriously, are you this <span className="text-primary">skibidi</span> to buy these kind of stuff?
          </p>
          <p className="text-lg md:text-2xl font-bold leading-snug">
            Get a job.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleTouchGrass}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 font-bold hover:scale-[1.02] transition-transform"
          >
            <Zap className="w-5 h-5" />
            touch grass
          </button>

          <div className="text-xs text-muted-foreground flex items-center gap-2 justify-center sm:justify-end">
            <span>💬</span>
            <span>touch grass • close tab • reflect</span>
          </div>
        </div>
      </div>
    </div>
  )
}

