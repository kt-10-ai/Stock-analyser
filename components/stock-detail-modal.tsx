"use client"

import { X, Heart, Download } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { addToWatchlist, isInWatchlist, removeFromWatchlist, addToRecentlyViewed } from "@/lib/storage-utils"
import { useState, useEffect } from "react"

interface StockDetailModalProps {
  stock: {
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
    volume: number
    history: number[]
    marketCap: number
  }
  isOpen: boolean
  onClose: () => void
}

export function StockDetailModal({ stock, isOpen, onClose }: StockDetailModalProps) {
  const [inWatchlist, setInWatchlist] = useState(() => isInWatchlist(stock.symbol))

  useEffect(() => {
    if (isOpen) {
      addToRecentlyViewed(stock.symbol)
    }
  }, [isOpen, stock.symbol])

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(stock.symbol)
      setInWatchlist(false)
    } else {
      addToWatchlist(stock.symbol)
      setInWatchlist(true)
    }
  }

  if (!isOpen) return null

  const getRecommendation = () => {
    if (stock.changePercent > 2) return { label: "Buy", color: "text-green-600 dark:text-green-400" }
    if (stock.changePercent < -2) return { label: "Sell", color: "text-red-600 dark:text-red-400" }
    return { label: "Hold", color: "text-yellow-600 dark:text-yellow-400" }
  }

  const recommendation = getRecommendation()
  const isPositive = stock.change >= 0

  const chartData = stock.history.map((price, idx) => ({
    day: `D${idx + 1}`,
    price,
  }))

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{stock.symbol}</h2>
              <p className="text-sm text-muted-foreground">{stock.name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Price Section */}
            <div>
              <p className="text-4xl font-bold text-foreground">${stock.price.toFixed(2)}</p>
              <p
                className={`text-lg font-semibold ${
                  isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {isPositive ? "+" : ""}
                {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </p>
            </div>

            {/* Recommendation */}
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Recommendation</p>
              <p className={`text-2xl font-bold ${recommendation.color}`}>{recommendation.label}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Based on {Math.abs(stock.changePercent).toFixed(2)}% price movement
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Daily Volume</p>
                <p className="text-lg font-bold text-foreground">{(stock.volume / 1e6).toFixed(1)}M</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
                <p className="text-lg font-bold text-foreground">
                  {stock.marketCap >= 1e12
                    ? `$${(stock.marketCap / 1e12).toFixed(2)}T`
                    : stock.marketCap >= 1e9
                      ? `$${(stock.marketCap / 1e9).toFixed(2)}B`
                      : `$${(stock.marketCap / 1e6).toFixed(2)}M`}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Price History</p>
              <div className="bg-muted/20 rounded-lg p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="day" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={isPositive ? "#10b981" : "#ef4444"}
                      dot={{ fill: isPositive ? "#10b981" : "#ef4444", r: 4 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleWatchlistToggle}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  inWatchlist
                    ? "bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                <Heart size={18} className={inWatchlist ? "fill-current" : ""} />
                {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              </button>
              <button className="px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-semibold transition-colors flex items-center justify-center gap-2">
                <Download size={18} />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
