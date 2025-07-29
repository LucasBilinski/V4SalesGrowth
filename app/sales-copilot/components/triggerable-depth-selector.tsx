"use client"

import { useEffect, useState } from "react"
import { DepthSelector, type DepthLevel } from "./depth-selector"

interface TriggerableDepthSelectorProps {
  onDepthChosen: (depth: DepthLevel) => void
}

export function TriggerableDepthSelector({ onDepthChosen }: TriggerableDepthSelectorProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handler = () => {
      setIsVisible(true)
    }
    window.addEventListener("copilot:depth_request", handler)
    return () => window.removeEventListener("copilot:depth_request", handler)
  }, [])

  const handleSelect = (depth: DepthLevel) => {
    onDepthChosen(depth)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 border-t border-zinc-800">
      <DepthSelector value="completa" onValueChange={handleSelect} />
    </div>
  )
}
