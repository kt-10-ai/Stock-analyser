"use client"

import type React from "react"

import { Heart, TrendingDown, TrendingUp } from "lucide-react"
import { addToWatchlist, isInWatchlist, removeFromWatchlist } from "@/lib/storage-utils"
import { useState } from "react"

interface StockCardProps {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  rank: number
  onClick: () => void
}

export function StockCard({ symbol, name, price, change, changePercent, volume, rank, onClick }: StockCardProps) {
  const [inWatchlist, setInWatchlist] = useState(() => isInWatchlist(symbol))

  const isPositive = change >= 0

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (inWatchlist) {
      removeFromWatchlist(symbol)
      setInWatchlist(false)
    } else {
      addToWatchlist(symbol)
      setInWatchlist(true)
    }
  }

  const getRankColor = () => {
    if (rank === 1) return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
    if (rank === 2) return "bg-gray-400/20 text-gray-600 dark:text-gray-400"
    if (rank === 3) return "bg-orange-600/20 text-orange-700 dark:text-orange-400"
    return "bg-muted text-muted-foreground"
  }

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl bg-card p-6 backdrop-blur border border-border/50 hover:border-border cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/20"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-muted-foreground">{symbol}</h3>
            <p className="text-lg font-bold text-foreground">{name}</p>
          </div>
          <button onClick={handleWatchlistToggle} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Heart
              size={20}
              className={`transition-colors ${inWatchlist ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
            />
          </button>
        </div>

        {/* Performance Badge */}
        <div className="mb-4 inline-flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRankColor()}`}>#{rank}</span>
        </div>

        {/* Price and Change */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-foreground">${price.toFixed(2)}</p>
          <div
            className={`flex items-center gap-1 text-sm font-semibold ${
              isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {isPositive ? "+" : ""}
            {change.toFixed(2)} ({changePercent.toFixed(2)}%)
          </div>
        </div>

        {/* Volume */}
        <div className="text-xs text-muted-foreground">Volume: {(volume / 1e6).toFixed(1)}M</div>
      </div>
    </div>
  )
}
