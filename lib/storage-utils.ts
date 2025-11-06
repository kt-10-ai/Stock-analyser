// LocalStorage utilities for watchlist and recently viewed

export const storageKeys = {
  WATCHLIST: "stock_watchlist",
  RECENTLY_VIEWED: "stock_recently_viewed",
  THEME: "stock_theme",
}

export function addToWatchlist(symbol: string) {
  const watchlist = getWatchlist()
  if (!watchlist.includes(symbol)) {
    watchlist.push(symbol)
    localStorage.setItem(storageKeys.WATCHLIST, JSON.stringify(watchlist))
  }
}

export function removeFromWatchlist(symbol: string) {
  const watchlist = getWatchlist()
  const filtered = watchlist.filter((s) => s !== symbol)
  localStorage.setItem(storageKeys.WATCHLIST, JSON.stringify(filtered))
}

export function getWatchlist(): string[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(storageKeys.WATCHLIST)
  return stored ? JSON.parse(stored) : []
}

export function isInWatchlist(symbol: string): boolean {
  return getWatchlist().includes(symbol)
}

export function addToRecentlyViewed(symbol: string) {
  const viewed = getRecentlyViewed()
  const filtered = viewed.filter((s) => s !== symbol)
  filtered.push(symbol)
  const limited = filtered.slice(-5)
  localStorage.setItem(storageKeys.RECENTLY_VIEWED, JSON.stringify(limited))
}

export function getRecentlyViewed(): string[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(storageKeys.RECENTLY_VIEWED)
  return stored ? JSON.parse(stored) : []
}

export function getTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark"
  const stored = localStorage.getItem(storageKeys.THEME)
  return (stored as "light" | "dark") || "dark"
}

export function setTheme(theme: "light" | "dark") {
  localStorage.setItem(storageKeys.THEME, theme)
}
