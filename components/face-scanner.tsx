"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { AlertTriangle, Camera, Scan, Skull, Sparkles, Zap } from "lucide-react"

interface FaceScannerProps {
  onAccessGranted: () => void
}

const BRAIN_ROT_MESSAGES = [
  "SCANNING FOR SIGMA ENERGY...",
  "DETECTING OHIO LEVELS...",
  "CHECKING RIZZ CERTIFICATION...",
  "ANALYZING SKIBIDI COMPATIBILITY...",
  "VERIFYING GYATT STATUS...",
  "MEASURING AURA POINTS...",
  "CALIBRATING FANUM TAX...",
  "LOADING BRAINROT.EXE...",
  "DETECTING MAIN CHARACTER...",
  "SCANNING MEWING TECHNIQUE...",
]

export function FaceScanner({ onAccessGranted }: FaceScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scanMessage, setScanMessage] = useState(BRAIN_ROT_MESSAGES[0])
  const [scanProgress, setScanProgress] = useState(0)
  const [faceDetected, setFaceDetected] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraReady(true)
        setError(null)
      }
    } catch {
      setError("CAMERA ACCESS DENIED! NO FACE = NO DRIP! 💀")
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [startCamera])

  // Simple face detection using canvas brightness analysis
  const detectFace = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return false

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return false

    canvas.width = 320
    canvas.height = 240
    ctx.drawImage(videoRef.current, 0, 0, 320, 240)

    // Analyze center region for face-like features (skin tones, contrast)
    const centerX = 120
    const centerY = 80
    const regionSize = 80
    const imageData = ctx.getImageData(centerX, centerY, regionSize, regionSize)
    const data = imageData.data

    let skinPixels = 0
    let totalPixels = 0
    let variance = 0
    let avgBrightness = 0

    // First pass: calculate average
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      avgBrightness += (r + g + b) / 3
      totalPixels++

      // Detect skin-like tones
      if (r > 60 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) {
        skinPixels++
      }
    }

    avgBrightness /= totalPixels

    // Second pass: calculate variance (for texture detection)
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
      variance += Math.pow(brightness - avgBrightness, 2)
    }
    variance /= totalPixels

    const skinRatio = skinPixels / totalPixels
    const hasTexture = variance > 200 && variance < 5000

    // Face detected if there's skin tones and texture
    return skinRatio > 0.1 && hasTexture && avgBrightness > 30
  }, [cameraReady])

  useEffect(() => {
    if (!cameraReady) return

    const interval = setInterval(() => {
      const detected = detectFace()
      setFaceDetected(detected)
    }, 200)

    return () => clearInterval(interval)
  }, [cameraReady, detectFace])

  const startScan = async () => {
    if (!faceDetected) {
      setError("NO FACE DETECTED! SHOW YOUR FACE BESTIE! 👁️👄👁️")
      return
    }

    setIsScanning(true)
    setError(null)
    setScanProgress(0)

    // Simulate scanning with brain rot messages
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 150))
      setScanProgress(i)
      if (i % 20 === 0) {
        setScanMessage(BRAIN_ROT_MESSAGES[Math.floor(Math.random() * BRAIN_ROT_MESSAGES.length)])
      }
    }

    // Grant access
    setTimeout(() => {
      onAccessGranted()
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Floating memes background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-float-meme opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          >
            {["💀", "🗿", "😭", "🔥", "✨", "👁️", "🦴", "⚡", "🌀", "👀"][i % 10]}
          </div>
        ))}
      </div>

      {/* Main container */}
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg w-full">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="font-[family-name:var(--font-bungee)] text-4xl md:text-6xl neon-text animate-rainbow-text">
            SKIBIDI SHOP
          </h1>
          <p className="text-muted-foreground text-sm md:text-base tracking-widest">
            FACE SCAN REQUIRED FOR ENTRY
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Skull className="w-5 h-5 animate-bounce" />
            <span className="text-xs">ONLY REAL ONES GET IN</span>
            <Skull className="w-5 h-5 animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>
        </div>

        {/* Camera viewport */}
        <div className="relative w-full aspect-[4/3] max-w-md rounded-2xl overflow-hidden neon-box">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Scan overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-primary" />
            <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-primary" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-l-4 border-b-4 border-primary" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-4 border-b-4 border-primary" />
            
            {/* Face detection indicator */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-52 rounded-[50%] border-4 transition-all duration-300 ${
              faceDetected 
                ? "border-secondary animate-pulse" 
                : "border-destructive animate-glitch"
            }`} />

            {/* Scanning animation */}
            {isScanning && (
              <div className="absolute inset-0 scan-effect" />
            )}
          </div>

          {/* Status indicator */}
          <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-xs font-bold ${
            faceDetected 
              ? "bg-secondary text-secondary-foreground" 
              : "bg-destructive text-destructive-foreground"
          }`}>
            {faceDetected ? "✅ FACE DETECTED" : "❌ NO FACE"}
          </div>
        </div>

        {/* Progress bar during scanning */}
        {isScanning && (
          <div className="w-full max-w-md space-y-2">
            <div className="h-4 bg-muted rounded-full overflow-hidden neon-box">
              <div 
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-150"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <p className="text-center text-sm text-primary animate-pulse font-bold">
              {scanMessage}
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-destructive/20 border border-destructive rounded-xl animate-shake-panic">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            <span className="text-destructive font-bold text-sm">{error}</span>
          </div>
        )}

        {/* Scan button */}
        {!isScanning && (
          <button
            onClick={startScan}
            disabled={!cameraReady}
            className="group relative px-8 py-4 bg-primary text-primary-foreground font-[family-name:var(--font-bungee)] text-xl rounded-xl neon-box hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-3">
              {cameraReady ? (
                <>
                  <Scan className="w-6 h-6 group-hover:animate-spin-slow" />
                  SCAN MY FACE
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </>
              ) : (
                <>
                  <Camera className="w-6 h-6 animate-pulse" />
                  LOADING CAMERA...
                </>
              )}
            </span>
          </button>
        )}

        {/* Bottom text */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <Zap className="w-4 h-4 text-accent" />
          <span>POWERED BY OHIO TECHNOLOGY</span>
          <Zap className="w-4 h-4 text-accent" />
        </div>

        {/* Skip button for testing */}
        <button
          onClick={onAccessGranted}
          className="text-xs text-muted-foreground hover:text-primary underline transition-colors"
        >
          skip for testing (no cap)
        </button>
      </div>
    </div>
  )
}
