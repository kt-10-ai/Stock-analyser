"use client"

import { getRecentlyViewed } from "@/lib/storage-utils"
import { mockStocks, StockHashMap } from "@/lib/mock-data"
import { Clock } from "lucide-react"
import { useEffect, useState } from "react"

interface RecentlyViewedProps {
  onStockClick: (stock: (typeof mockStocks)[0]) => void
}

export function RecentlyViewed({ onStockClick }: RecentlyViewedProps) {
  const [recentStocks, setRecentStocks] = useState<typeof mockStocks>([])
  const [stockMap] = useState(() => new StockHashMap(mockStocks))

  useEffect(() => {
    const viewed = getRecentlyViewed()
    const stocks = viewed
      .reverse()
      .map((symbol) => stockMap.get(symbol))
      .filter(Boolean) as typeof mockStocks
    setRecentStocks(stocks)
  }, [stockMap])

  if (recentStocks.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border/50 p-6 text-center">
        <Clock className="mx-auto mb-3 text-muted-foreground" size={24} />
        <p className="text-muted-foreground">No recently viewed stocks</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={18} className="text-primary" />
        <h3 className="font-semibold text-foreground">Recently Viewed</h3>
      </div>

      <div className="space-y-2">
        {recentStocks.map((stock) => (
          <button
            key={stock.symbol}
            onClick={() => onStockClick(stock)}
            className="w-full text-left p-3 hover:bg-muted rounded-lg transition-colors flex items-center justify-between group"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">{stock.symbol}</p>
              <p className="text-xs text-muted-foreground">{stock.name}</p>
            </div>
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              ${stock.price.toFixed(2)}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
