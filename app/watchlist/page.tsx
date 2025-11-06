"use client"

import { useState, useEffect } from "react"
import { Heart, Search, TrendingDown, TrendingUp } from "lucide-react"
import { getWatchlist, removeFromWatchlist } from "@/lib/storage-utils"
import { mockStocks, StockHashMap } from "@/lib/mock-data"
import { StockDetailModal } from "@/components/stock-detail-modal"
import Link from "next/link"

type SortBy = "symbol" | "price" | "change"
type SortOrder = "asc" | "desc"

export default function WatchlistPage() {
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortBy>("symbol")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [selectedStock, setSelectedStock] = useState<(typeof mockStocks)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [stockMap] = useState(() => new StockHashMap(mockStocks))

  useEffect(() => {
    setWatchlistSymbols(getWatchlist())
  }, [])

  const watchlistStocks = watchlistSymbols.map((symbol) => stockMap.get(symbol)).filter(Boolean) as typeof mockStocks

  const getFilteredStocks = () => {
    if (!searchQuery.trim()) {
      return watchlistStocks
    }

    const query = searchQuery.toUpperCase()
    return watchlistStocks.filter((stock) => stock.symbol.includes(query) || stock.name.toUpperCase().includes(query))
  }

  const getSortedStocks = () => {
    const filtered = getFilteredStocks()
    const key = sortBy === "symbol" ? "symbol" : sortBy === "price" ? "price" : "changePercent"

    return [...filtered].sort((a, b) => {
      let comparison = 0
      if (a[key as keyof typeof a] < b[key as keyof typeof b]) {
        comparison = -1
      } else if (a[key as keyof typeof a] > b[key as keyof typeof b]) {
        comparison = 1
      }
      return sortOrder === "asc" ? comparison : -comparison
    })
  }

  const displayStocks = getSortedStocks()
  const totalValue = displayStocks.reduce((sum, stock) => sum + stock.price, 0)
  const totalChange = displayStocks.reduce((sum, stock) => sum + stock.change, 0)
  const avgChangePercent = displayStocks.length > 0 ? totalChange / displayStocks.length : 0

  const handleRemoveFromWatchlist = (symbol: string) => {
    removeFromWatchlist(symbol)
    setWatchlistSymbols(watchlistSymbols.filter((s) => s !== symbol))
  }

  const handleStockClick = (stock: (typeof mockStocks)[0]) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }

  const handleSortChange = (newSort: SortBy) => {
    if (sortBy === newSort) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(newSort)
      setSortOrder("asc")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 border-b border-border/50 backdrop-blur bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">📈</span>
                </div>
                <h1 className="text-xl font-bold text-foreground">StockFlow</h1>
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-lg font-semibold text-foreground">Watchlist</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {watchlistStocks.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h2 className="text-2xl font-bold text-foreground mb-2">Your watchlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add stocks to your watchlist to track them here. Go to the dashboard to get started.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Explore Stocks
            </Link>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-card rounded-xl border border-border/50 p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Value</p>
                <p className="text-3xl font-bold text-foreground">${totalValue.toFixed(2)}</p>
              </div>
              <div className="bg-card rounded-xl border border-border/50 p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Change</p>
                <p
                  className={`text-3xl font-bold ${
                    totalChange >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {totalChange >= 0 ? "+" : ""}${totalChange.toFixed(2)}
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border/50 p-6">
                <p className="text-sm text-muted-foreground mb-2">Avg Change</p>
                <p
                  className={`text-3xl font-bold ${
                    avgChangePercent >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {avgChangePercent >= 0 ? "+" : ""}
                  {avgChangePercent.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Search and Sort Controls */}
            <div className="mb-8 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Search watchlist by symbol or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
                />
              </div>

              {/* Sort Controls */}
              <div className="flex flex-wrap gap-2">
                {(["symbol", "price", "change"] as const).map((sort) => (
                  <button
                    key={sort}
                    onClick={() => handleSortChange(sort)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      sortBy === sort
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }`}
                  >
                    {sort === "symbol" ? "Symbol" : sort === "price" ? "Price" : "Performance"}{" "}
                    {sortBy === sort && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <p className="text-sm text-muted-foreground mb-6">
              Showing {displayStocks.length} of {watchlistStocks.length} stocks
            </p>

            {displayStocks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No stocks match your search</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-primary hover:underline text-sm font-semibold"
                >
                  Clear search
                </button>
              </div>
            ) : (
              /* Watchlist Table */
              <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Symbol</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Company</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground">Price</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground">Change</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground">Volume</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayStocks.map((stock) => {
                        const isPositive = stock.change >= 0
                        return (
                          <tr
                            key={stock.symbol}
                            className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                            onClick={() => handleStockClick(stock)}
                          >
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-foreground">{stock.symbol}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-muted-foreground">{stock.name}</p>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <p className="text-sm font-semibold text-foreground">${stock.price.toFixed(2)}</p>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div
                                className={`flex items-center justify-end gap-1 text-sm font-semibold ${
                                  isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                {isPositive ? "+" : ""}
                                {stock.changePercent.toFixed(2)}%
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <p className="text-sm text-muted-foreground">{(stock.volume / 1e6).toFixed(1)}M</p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveFromWatchlist(stock.symbol)
                                }}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              >
                                <Heart size={18} className="fill-red-500 text-red-500" />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Stock Detail Modal */}
      {selectedStock && (
        <StockDetailModal stock={selectedStock} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}
