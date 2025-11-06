"use client"

import { mockStocks, TopPicksQueue } from "@/lib/mock-data"
import { TrendingUp, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

interface RecommendationPanelProps {
  onStockClick: (stock: (typeof mockStocks)[0]) => void
}

export function RecommendationPanel({ onStockClick }: RecommendationPanelProps) {
  const [queue] = useState(() => new TopPicksQueue(mockStocks))
  const [rotatedIndex, setRotatedIndex] = useState(0)
  const [displayedIndex, setDisplayedIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      queue.rotate()
      setRotatedIndex((prev) => (prev + 1) % queue.getAll().length)
      setDisplayedIndex((prev) => (prev + 1) % 3)
    }, 5000)

    return () => clearInterval(interval)
  }, [queue])

  const topPicks = queue.getAll()

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-6 backdrop-blur">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="relative">
          <Sparkles className="text-primary animate-spin" size={20} style={{ animationDuration: "3s" }} />
        </div>
        <h2 className="text-lg font-bold text-foreground">Top Picks</h2>
      </div>

      {/* Top Picks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topPicks.slice(0, 3).map((stock, idx) => {
          const isActive = idx === displayedIndex % 3
          return (
            <div
              key={stock.symbol}
              onClick={() => onStockClick(stock)}
              className={`group cursor-pointer relative overflow-hidden bg-card/50 hover:bg-card border border-border/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-105 transform ${
                isActive ? "ring-2 ring-primary/50 shadow-lg shadow-primary/20" : ""
              }`}
              style={{
                animation: isActive ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none",
              }}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 animate-gradient" />
              )}

              <div className="relative z-10 flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">{stock.symbol}</p>
                  <p className="text-lg font-bold text-foreground">${stock.price.toFixed(2)}</p>
                </div>
                {idx === 0 && (
                  <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded text-xs font-semibold animate-bounce">
                    <TrendingUp size={12} />
                    Top
                  </div>
                )}
              </div>

              {/* Change Percentage */}
              <p
                className={`text-sm font-semibold relative z-10 ${
                  stock.changePercent >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {stock.changePercent >= 0 ? "+" : ""}
                {stock.changePercent.toFixed(2)}%
              </p>

              {isActive && (
                <>
                  <div className="mt-3 h-1 bg-primary rounded-full animate-pulse" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 bg-primary rounded-full animate-ping" />
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Rotation indicator with animation */}
      <div className="text-xs text-muted-foreground mt-4 text-center flex items-center justify-center gap-2">
        <div className="flex gap-1">
          {topPicks.slice(0, 3).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === displayedIndex % 3 ? "bg-primary w-4" : "bg-muted w-1.5"
              }`}
            />
          ))}
        </div>
        <span>Rotating recommendations • Updates every 5 seconds</span>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
