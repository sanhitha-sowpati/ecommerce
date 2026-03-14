"use client"

import { useState } from "react"
import { FaceScanner } from "@/components/face-scanner"
import { Shop } from "@/components/shop"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return <FaceScanner onAccessGranted={() => setIsAuthenticated(true)} />
  }

  return <Shop />
}
