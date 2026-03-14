"use client"

import { useState } from "react"
import { ScaredButton } from "./scared-button"
import { Sparkles, Star, Flame, Zap, Ghost } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  barterFor: string
  emoji: string
  rarity: "common" | "rare" | "legendary" | "mythic"
  memeTag: string
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

const RARITY_STYLES = {
  common: "border-muted-foreground/30",
  rare: "border-secondary neon-box",
  legendary: "border-accent",
  mythic: "border-primary animate-neon-pulse",
}

const RARITY_BADGES = {
  common: { bg: "bg-muted", text: "text-muted-foreground", label: "COMMON" },
  rare: { bg: "bg-secondary", text: "text-secondary-foreground", label: "RARE 🔥" },
  legendary: { bg: "bg-accent", text: "text-accent-foreground", label: "LEGENDARY ⚡" },
  mythic: { bg: "bg-primary", text: "text-primary-foreground", label: "MYTHIC 💀" },
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [showExplosion, setShowExplosion] = useState(false)

  const handleCatch = () => {
    setShowExplosion(true)
    setTimeout(() => {
      setIsAdded(true)
      onAddToCart(product)
    }, 500)
  }

  return (
    <div
      className={`relative bg-card rounded-2xl border-2 ${RARITY_STYLES[product.rarity]} p-4 transition-all duration-300 hover:scale-[1.02] overflow-hidden`}
    >
      {/* Rarity badge */}
      <div className={`absolute top-2 right-2 ${RARITY_BADGES[product.rarity].bg} ${RARITY_BADGES[product.rarity].text} px-2 py-1 rounded-full text-xs font-bold`}>
        {RARITY_BADGES[product.rarity].label}
      </div>

      {/* Meme tag */}
      <div className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded-full text-xs">
        {product.memeTag}
      </div>

      {/* Product emoji/image */}
      <div className="text-6xl text-center py-6 animate-float-meme">
        {product.emoji}
      </div>

      {/* Product info */}
      <div className="space-y-2">
        <h3 className="font-[family-name:var(--font-bungee)] text-lg text-foreground">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        {/* Barter price */}
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold text-foreground">
            BARTER FOR:
          </span>
          <span className="text-xs text-primary">
            {product.barterFor}
          </span>
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < 4 ? "text-accent fill-accent" : "text-muted"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            (69 reviews)
          </span>
        </div>
      </div>

      {/* Scared Add to Cart button */}
      {isAdded ? (
        <div className="mt-4 p-4 bg-secondary/20 rounded-xl text-center">
          <div className="flex items-center justify-center gap-2 text-secondary font-bold">
            <Ghost className="w-5 h-5" />
            ADDED TO CART!
            <Zap className="w-5 h-5" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            You actually caught it! Sigma move 💀
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <ScaredButton onCatch={handleCatch} productName={product.name} />
        </div>
      )}

      {/* Explosion effect */}
      {showExplosion && !isAdded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 animate-pulse">
          <div className="text-6xl animate-ping">
            <Flame className="w-16 h-16 text-destructive" />
          </div>
        </div>
      )}
    </div>
  )
}
