"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ShoppingCart, AlertTriangle, Skull, Frown, Meh, Ghost } from "lucide-react"

interface ScaredButtonProps {
  onCatch?: () => void
  productName: string
}

const PANIC_MESSAGES = [
  "NO PLS!",
  "HELP ME!",
  "I'M SCARED!",
  "NOT AGAIN!",
  "WHY ME?!",
  "LEAVE ME!",
  "AHHHHH!",
  "IM JUST A BUTTON!",
  "I HAVE A FAMILY!",
  "STAHHHHP!",
  "NOOOO!",
  "RUN AWAY!",
  "CATCH ME!",
  "TOO SLOW!",
  "BRUH 💀",
]

const PANIC_EMOJIS = ["😱", "😨", "😰", "🏃", "💨", "😭", "🆘", "⚠️", "🚨", "💀"]

export function ScaredButton({ onCatch, productName }: ScaredButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPanicking, setIsPanicking] = useState(false)
  const [panicLevel, setPanicLevel] = useState(0) // 0-3
  const [message, setMessage] = useState("ADD TO CART")
  const [trailEmojis, setTrailEmojis] = useState<{ id: number; x: number; y: number; emoji: string }[]>([])
  const [catchAttempts, setCatchAttempts] = useState(0)
  const lastMoveTime = useRef(Date.now())
  const emojiId = useRef(0)

  const getRandomPanicMessage = () => {
    return PANIC_MESSAGES[Math.floor(Math.random() * PANIC_MESSAGES.length)]
  }

  const getRandomEmoji = () => {
    return PANIC_EMOJIS[Math.floor(Math.random() * PANIC_EMOJIS.length)]
  }

  const moveAwayFromCursor = useCallback((mouseX: number, mouseY: number) => {
    if (!buttonRef.current || !containerRef.current) return

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()

    const buttonCenterX = buttonRect.left + buttonRect.width / 2
    const buttonCenterY = buttonRect.top + buttonRect.height / 2

    const distance = Math.sqrt(
      Math.pow(mouseX - buttonCenterX, 2) + Math.pow(mouseY - buttonCenterY, 2)
    )

    const detectionRadius = 150 + panicLevel * 50

    if (distance < detectionRadius) {
      setIsPanicking(true)
      setMessage(getRandomPanicMessage())
      setPanicLevel(prev => Math.min(3, prev + 0.1))

      // Calculate flee direction (opposite of cursor)
      const angle = Math.atan2(buttonCenterY - mouseY, buttonCenterX - mouseX)
      const fleeSpeed = 80 + panicLevel * 40
      const randomOffset = (Math.random() - 0.5) * 60

      let newX = position.x + Math.cos(angle + randomOffset * 0.02) * fleeSpeed
      let newY = position.y + Math.sin(angle + randomOffset * 0.02) * fleeSpeed

      // Boundary constraints
      const maxX = containerRect.width - buttonRect.width
      const maxY = containerRect.height - buttonRect.height

      // Bounce off walls with randomness
      if (newX < 0) {
        newX = Math.random() * 50
        newX = Math.min(maxX, Math.max(0, newX))
      }
      if (newX > maxX) {
        newX = maxX - Math.random() * 50
        newX = Math.min(maxX, Math.max(0, newX))
      }
      if (newY < 0) {
        newY = Math.random() * 50
        newY = Math.min(maxY, Math.max(0, newY))
      }
      if (newY > maxY) {
        newY = maxY - Math.random() * 50
        newY = Math.min(maxY, Math.max(0, newY))
      }

      setPosition({ x: newX, y: newY })

      // Leave emoji trail
      const now = Date.now()
      if (now - lastMoveTime.current > 100) {
        lastMoveTime.current = now
        const newEmoji = {
          id: emojiId.current++,
          x: buttonCenterX - containerRect.left,
          y: buttonCenterY - containerRect.top,
          emoji: getRandomEmoji(),
        }
        setTrailEmojis(prev => [...prev.slice(-8), newEmoji])
      }

      setCatchAttempts(prev => prev + 1)
    } else {
      // Calm down when cursor is far
      setPanicLevel(prev => Math.max(0, prev - 0.05))
      if (panicLevel < 0.5) {
        setIsPanicking(false)
        setMessage("ADD TO CART")
      }
    }
  }, [panicLevel, position.x, position.y])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      moveAwayFromCursor(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        moveAwayFromCursor(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [moveAwayFromCursor])

  // Clean up trail emojis
  useEffect(() => {
    const cleanup = setInterval(() => {
      setTrailEmojis(prev => prev.slice(-6))
    }, 1000)
    return () => clearInterval(cleanup)
  }, [])

  const handleClick = () => {
    if (onCatch) {
      onCatch()
    }
  }

  const getPanicIcon = () => {
    if (panicLevel > 2) return <Skull className="w-4 h-4" />
    if (panicLevel > 1) return <Ghost className="w-4 h-4" />
    if (panicLevel > 0.5) return <Frown className="w-4 h-4" />
    if (isPanicking) return <Meh className="w-4 h-4" />
    return <ShoppingCart className="w-4 h-4" />
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-24 overflow-hidden rounded-xl bg-muted/30"
    >
      {/* Trail emojis */}
      {trailEmojis.map((trail) => (
        <span
          key={trail.id}
          className="absolute text-lg pointer-events-none animate-ping"
          style={{
            left: trail.x,
            top: trail.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          {trail.emoji}
        </span>
      ))}

      {/* The scared button */}
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={`absolute flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-75 ${
          isPanicking
            ? panicLevel > 2
              ? "bg-destructive text-destructive-foreground animate-shake-panic"
              : panicLevel > 1
              ? "bg-accent text-accent-foreground animate-shake-panic"
              : "bg-primary text-primary-foreground"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
        style={{
          left: position.x,
          top: position.y,
          transform: `rotate(${isPanicking ? (Math.random() - 0.5) * 10 : 0}deg)`,
        }}
      >
        {isPanicking && panicLevel > 1 && (
          <AlertTriangle className="w-4 h-4 animate-pulse" />
        )}
        {getPanicIcon()}
        <span className={isPanicking ? "animate-pulse" : ""}>
          {message}
        </span>
        {isPanicking && (
          <span className="text-lg">{getRandomEmoji()}</span>
        )}
      </button>

      {/* Catch counter */}
      {catchAttempts > 5 && (
        <div className="absolute bottom-1 right-2 text-xs text-muted-foreground">
          Attempts: {catchAttempts} 💀
        </div>
      )}

      {/* Helper text */}
      <div className="absolute bottom-1 left-2 text-xs text-muted-foreground">
        {isPanicking ? "IT'S RUNNING AWAY!" : `Add ${productName} to cart`}
      </div>
    </div>
  )
}
