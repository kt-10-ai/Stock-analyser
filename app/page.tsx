"use client"

import { useState, useEffect } from "react"
import { Search, Moon, Sun, Filter, Bookmark } from "lucide-react"
import { StockCard } from "@/components/stock-card"
import { StockDetailModal } from "@/components/stock-detail-modal"
import { RecommendationPanel } from "@/components/recommendation-panel"
import { RecentlyViewed } from "@/components/recently-viewed"
import { mockStocks, StockHashMap, mergeSort } from "@/lib/mock-data"
import { getTheme, setTheme } from "@/lib/storage-utils"

type SortBy = "symbol" | "price" | "change"
type SortOrder = "asc" | "desc"

export default function Dashboard() {
  const [isDark, setIsDark] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortBy>("symbol")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [selectedStock, setSelectedStock] = useState<(typeof mockStocks)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [stockMap] = useState(() => new StockHashMap(mockStocks))

  // Initialize theme
  useEffect(() => {
    const theme = getTheme()
    setIsDark(theme === "dark")
    applyTheme(theme)
  }, [])

  const applyTheme = (theme: "light" | "dark") => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleThemeToggle = () => {
    const newTheme = isDark ? "light" : "dark"
    setIsDark(!isDark)
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  const getFilteredStocks = () => {
    if (!searchQuery.trim()) {
      return mockStocks
    }

    const query = searchQuery.toUpperCase()
    return mockStocks.filter((stock) => stock.symbol.includes(query) || stock.name.toUpperCase().includes(query))
  }

  const getSortedStocks = () => {
    const filtered = getFilteredStocks()
    const key = sortBy === "symbol" ? "symbol" : sortBy === "price" ? "price" : "changePercent"
    return mergeSort(filtered, key as any, sortOrder === "asc")
  }

  const displayStocks = getSortedStocks()

  const getRank = (stock: (typeof mockStocks)[0]) => {
    const sorted = mockStocks.sort((a, b) => b.changePercent - a.changePercent)
    return sorted.findIndex((s) => s.symbol === stock.symbol) + 1
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
    <div className={`min-h-screen transition-colors ${isDark ? "dark bg-background" : "bg-background"}`}>
      {/* Navigation */}
      <nav className="sticky top-0 z-30 border-b border-border/50 backdrop-blur bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">📈</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">StockFlow</h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Watchlist Link */}
              <a
                href="/watchlist"
                className="px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
              >
                <Bookmark size={18} />
                <span className="hidden sm:inline">Watchlist</span>
              </a>

              {/* Last Updated */}
              <div className="text-xs text-muted-foreground hidden sm:block">Last Updated: just now</div>

              {/* Theme Toggle */}
              <button onClick={handleThemeToggle} className="p-2 hover:bg-muted rounded-lg transition-colors">
                {isDark ? (
                  <Sun size={20} className="text-muted-foreground" />
                ) : (
                  <Moon size={20} className="text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Sort Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search by symbol or company name... (e.g., AAPL, Apple)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter size={16} />
              Sort by:
            </div>
            {(["symbol", "price", "change"] as const).map((sort) => (
              <button
                key={sort}
                onClick={() => handleSortChange(sort)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  sortBy === sort ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                {sort === "symbol" ? "Symbol" : sort === "price" ? "Price" : "Performance"}{" "}
                {sortBy === sort && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing {displayStocks.length} of {mockStocks.length} stocks
        </p>

        {displayStocks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No stocks found</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-primary hover:underline text-sm font-semibold"
            >
              Clear search
            </button>
          </div>
        ) : (
          <>
            {/* Stock Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {displayStocks.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  change={stock.change}
                  changePercent={stock.changePercent}
                  volume={stock.volume}
                  rank={getRank(stock)}
                  onClick={() => handleStockClick(stock)}
                />
              ))}
            </div>

            {/* Bottom Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recommendation Panel - spans 2 columns */}
              <div className="lg:col-span-2">
                <RecommendationPanel onStockClick={handleStockClick} />
              </div>

              {/* Recently Viewed */}
              <div className="lg:col-span-1">
                <RecentlyViewed onStockClick={handleStockClick} />
              </div>
            </div>
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
