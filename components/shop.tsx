"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ProductCard } from "./product-card"
import { ShoppingCart, Sparkles, Skull, Zap, Volume2, VolumeX, AlertTriangle, Trash2 } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  barterFor: string
  emoji: string
  rarity: "common" | "rare" | "legendary" | "mythic"
  memeTag: string
}

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "SIGMA MULLET WIG",
    description: "Channel your inner Patrick Bateman with this majestic mullet. Business in front, sigma in back.",
    barterFor: "3 W's and a rizz certificate",
    emoji: "🦱",
    rarity: "legendary",
    memeTag: "#SigmaGrindset"
  },
  {
    id: "2",
    name: "VAMPIRE NAILS DELUXE",
    description: "Extra long, extra sharp, extra dramatic. Perfect for keyboard warriors.",
    barterFor: "Your sleep schedule",
    emoji: "💅",
    rarity: "rare",
    memeTag: "#GothMode"
  },
  {
    id: "3",
    name: "OHIO SUNGLASSES",
    description: "Everything you see through these becomes an Ohio moment. Side effects may include seeing memes everywhere.",
    barterFor: "1 normal thought",
    emoji: "🕶️",
    rarity: "mythic",
    memeTag: "#OnlyInOhio"
  },
  {
    id: "4",
    name: "SKIBIDI TOILET HAT",
    description: "Why wear a normal hat when you can wear art? Based on the hit series.",
    barterFor: "Your dignity",
    emoji: "🚽",
    rarity: "legendary",
    memeTag: "#SkibidiToilet"
  },
  {
    id: "5",
    name: "MEWING CHIN STRAP",
    description: "Achieve maximum jawline definition while you sleep. Looksmax approved.",
    barterFor: "500 mewing hours",
    emoji: "👹",
    rarity: "rare",
    memeTag: "#Mewing"
  },
  {
    id: "6",
    name: "FANUM TAX COLLECTION BAG",
    description: "The official bag for collecting your Fanum Tax. Now with extra large capacity.",
    barterFor: "25% of your fries",
    emoji: "💰",
    rarity: "common",
    memeTag: "#FanumTax"
  },
  {
    id: "7",
    name: "RIZZ SPRAY COLOGNE",
    description: "One spray and your rizz levels go through the roof. Warning: Too much power.",
    barterFor: "Your awkward pickup lines",
    emoji: "✨",
    rarity: "mythic",
    memeTag: "#UnspokenRizz"
  },
  {
    id: "8",
    name: "GYATT DETECTOR 3000",
    description: "Beeps when peak performance is nearby. Batteries not included but aura is.",
    barterFor: "Your focus",
    emoji: "📡",
    rarity: "legendary",
    memeTag: "#GYATT"
  },
  {
    id: "9",
    name: "BRAINROT CERTIFIED CROCS",
    description: "Holes in the shoes, holes in the brain. Perfect for the chronically online.",
    barterFor: "Your attention span",
    emoji: "🩴",
    rarity: "common",
    memeTag: "#Brainrot"
  },
  {
    id: "10",
    name: "AURA POINTS COUNTER",
    description: "Finally know your true aura level. Warning: Results may cause ego damage.",
    barterFor: "Your humility",
    emoji: "🔮",
    rarity: "rare",
    memeTag: "#AuraCheck"
  },
  {
    id: "11",
    name: "EDGE LORD CAPE",
    description: "Nothing personnel, kid. This cape makes everything 100% more dramatic.",
    barterFor: "Your normie status",
    emoji: "🦹",
    rarity: "rare",
    memeTag: "#NotAPhase"
  },
  {
    id: "12",
    name: "NO CAP LIE DETECTOR",
    description: "Instantly verifies if someone is capping. Beeps loudly at 🧢 moments.",
    barterFor: "All your 🧢",
    emoji: "🎩",
    rarity: "legendary",
    memeTag: "#NoCap"
  },
  {
    id: "13",
    name: "CURSED CAT EARS",
    description: "UwU intensifies. These ears have seen things. Questionable things.",
    barterFor: "Your sanity",
    emoji: "😺",
    rarity: "common",
    memeTag: "#UwU"
  },
  {
    id: "14",
    name: "SLAY QUEEN TIARA",
    description: "For when you need to remind everyone who's running this show. Periodt.",
    barterFor: "Your haters' tears",
    emoji: "👑",
    rarity: "rare",
    memeTag: "#Slay"
  },
  {
    id: "15",
    name: "NPC DIALOGUE BOX",
    description: "Hold it up and say 'Interesting' to anything. Perfect for awkward convos.",
    barterFor: "Your personality",
    emoji: "💬",
    rarity: "common",
    memeTag: "#NPCBehavior"
  },
  {
    id: "16",
    name: "MAIN CHARACTER HALO",
    description: "A literal glow-up. Everyone around you becomes a side character.",
    barterFor: "Your side character era",
    emoji: "😇",
    rarity: "mythic",
    memeTag: "#MainCharacter"
  },
]

// 67 brain rot meme phrases
const MEME_PHRASES = [
  "SKIBIDI TOILET", "ONLY IN OHIO", "SIGMA GRINDSET", "NO CAP", "ON GOD FR FR",
  "RIZZ LORD", "FANUM TAX", "GYATT DETECTED", "MEWING MASTER", "AURA +1000",
  "L + RATIO", "CAUGHT IN 4K", "SUS BEHAVIOR", "DOWN BAD", "RENT FREE",
  "TOUCH GRASS", "SKILL ISSUE", "BASED TAKE", "CRINGE DETECTED", "MID AF",
  "BUSSIN FRFR", "SLAY QUEEN", "ITS GIVING", "NO PRINTER", "UNDERSTOOD THE ASSIGNMENT",
  "MAIN CHARACTER", "NPC MOMENT", "DELULU IS SOLULU", "ITS THE ___ FOR ME", "PERIODT",
  "NOT THE ___", "CAUGHT LACKIN", "HITS DIFFERENT", "LOWKEY HIGHKEY", "SAY LESS",
  "BET BET", "VALID AF", "SHEESH", "ONG", "DEADASS",
  "FACTS NO CAP", "REAL ONES KNOW", "IYKYK", "POV: YOU", "UNDERSTOOD",
  "EMOTIONAL DAMAGE", "DEVIOUS LICK", "THATS TUFF", "WE MOVE", "ITS JOEVER",
  "GOONING HOURS", "EDGE LORD", "BRAINROT CORE", "CURSED IMAGE", "BLURSED",
  "UNHINGED BEHAVIOR", "CHAOTIC NEUTRAL", "NO THOUGHTS HEAD EMPTY", "LIVING MY TRUTH", "EAT HOT CHIP",
  "SNATCHED MY WIG", "SENDING ME", "IM WEAK", "SCREAMING", "CRYING IN THE CLUB",
  "TAKE MY MONEY", "SHUT UP AND TAKE IT"
]

export function Shop() {
  const router = useRouter()
  const [cart, setCart] = useState<Product[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const checkoutAudioRef = useRef<HTMLAudioElement | null>(null)
  const addToCartAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    checkoutAudioRef.current = new Audio("/touch-grass-audio.mpeg")
    addToCartAudioRef.current = new Audio("/add-to-cart-audio.mpeg")
  }, [])

  const addToCart = (product: Product) => {
    if (!isMuted && addToCartAudioRef.current) {
      void addToCartAudioRef.current.play().catch(() => {})
    }
    setCart(prev => [...prev, product])
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const index = prev.findIndex(p => p.id === productId)
      if (index > -1) {
        const newCart = [...prev]
        newCart.splice(index, 1)
        return newCart
      }
      return prev
    })
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating meme text background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
        {MEME_PHRASES.map((phrase, i) => (
          <div
            key={i}
            className="absolute text-xs md:text-sm font-bold whitespace-nowrap animate-float-meme"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 13) % 100}%`,
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${4 + (i % 4)}s`,
              transform: `rotate(${(i % 3 - 1) * 15}deg)`,
              color: `hsl(${(i * 30) % 360}, 80%, 60%)`,
            }}
          >
            {phrase}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skull className="w-8 h-8 text-primary animate-bounce" />
            <h1 className="font-[family-name:var(--font-bungee)] text-xl md:text-3xl neon-text">
              SKIBIDI SHOP
            </h1>
            <Skull className="w-8 h-8 text-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>

          <div className="flex items-center gap-4">
            {/* Sound toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Volume2 className="w-5 h-5 text-primary" />
              )}
            </button>

            {/* Cart button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs font-bold flex items-center justify-center animate-bounce">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Cart sidebar */}
      {showCart && (
        <div className="fixed top-0 right-0 w-full md:w-96 h-full bg-card border-l border-border z-50 overflow-y-auto">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-bungee)] text-xl flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              YOUR LOOT ({cart.length})
            </h2>
            <button
              onClick={() => setShowCart(false)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-4">💀</p>
                <p className="text-muted-foreground">Cart empty bestie</p>
                <p className="text-xs text-muted-foreground mt-2">Go catch some products!</p>
              </div>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
                  >
                    <span className="text-3xl">{item.emoji}</span>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.barterFor}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 hover:bg-destructive/20 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                ))}
                
                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">TOTAL BARTER:</span>
                    <span className="text-primary">Your soul + shipping</span>
                  </div>
                  <button
                    onClick={clearCart}
                    className="w-full py-3 bg-destructive text-destructive-foreground rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    CLEAR CART (REGRET)
                  </button>
                  <button
                    onClick={() => {
                      if (!isMuted && checkoutAudioRef.current) {
                        void checkoutAudioRef.current.play().catch(() => {})
                      }
                      setShowCart(false)
                      router.push("/checkout")
                    }}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 neon-box"
                  >
                    <Sparkles className="w-5 h-5" />
                    CHECKOUT (REAL)
                    <Sparkles className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="text-center py-12 space-y-4">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Zap className="w-8 h-8 text-accent animate-pulse" />
            <h2 className="font-[family-name:var(--font-bungee)] text-2xl md:text-5xl animate-rainbow-text">
              BARTER YOUR WAY TO DRIP
            </h2>
            <Zap className="w-8 h-8 text-accent animate-pulse" />
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            No money? No problem! We accept vibes, aura points, rizz certificates, 
            and various forms of internet currency. Just catch the button first... if you can 💀
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>⚠️ WARNING:</span>
            <span className="text-destructive">Add to Cart buttons may experience anxiety</span>
            <span>⚠️</span>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {/* Footer memes */}
        <div className="mt-16 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <span>Made with</span>
            <span className="text-destructive animate-pulse">💀</span>
            <span>and</span>
            <span className="text-primary animate-pulse">brainrot</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-2xl">
            {["🗿", "💀", "😭", "🔥", "✨", "👁️", "🦴", "⚡", "🌀", "👀", "🎭", "🤡", "👹", "😈", "🦇"].map((emoji, i) => (
              <span
                key={i}
                className="animate-float-meme"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            © 2024 Skibidi Shop LLC | Not responsible for brainrot acquired
          </p>
        </div>
      </main>
    </div>
  )
}
