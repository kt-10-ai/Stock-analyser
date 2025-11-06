// Mock stock data with price history for charting
export const mockStocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 189.45,
    change: 1.23,
    changePercent: 0.65,
    volume: 52000000,
    history: [180, 182, 183, 185, 187, 189, 189.45],
    marketCap: 2.97e12,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 428.65,
    change: 3.21,
    changePercent: 0.75,
    volume: 18500000,
    history: [415, 418, 420, 423, 426, 428, 428.65],
    marketCap: 3.19e12,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 156.78,
    change: -2.15,
    changePercent: -1.35,
    volume: 32400000,
    history: [165, 162, 160, 158, 157, 156.8, 156.78],
    marketCap: 1.94e12,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 201.5,
    change: 5.4,
    changePercent: 2.75,
    volume: 48900000,
    history: [187, 190, 194, 198, 200, 201, 201.5],
    marketCap: 2.07e12,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 250.76,
    change: -0.87,
    changePercent: -0.35,
    volume: 124500000,
    history: [245, 247, 249, 251, 251, 250.8, 250.76],
    marketCap: 7.92e11,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 873.54,
    change: 12.45,
    changePercent: 1.44,
    volume: 41200000,
    history: [840, 850, 860, 865, 870, 872, 873.54],
    marketCap: 2.14e12,
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 512.89,
    change: 8.76,
    changePercent: 1.73,
    volume: 15300000,
    history: [490, 495, 502, 508, 510, 512, 512.89],
    marketCap: 1.31e12,
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    price: 285.43,
    change: -4.12,
    changePercent: -1.42,
    volume: 3400000,
    history: [298, 295, 292, 289, 286, 285.5, 285.43],
    marketCap: 1.23e11,
  },
  {
    symbol: "SPCE",
    name: "Virgin Galactic Holdings",
    price: 45.82,
    change: 2.34,
    changePercent: 5.37,
    volume: 28900000,
    history: [40, 42, 43, 44, 45, 45.5, 45.82],
    marketCap: 4.85e9,
  },
  {
    symbol: "RIOT",
    name: "Riot Blockchain Inc.",
    price: 19.65,
    change: -1.23,
    changePercent: -5.88,
    volume: 65200000,
    history: [25, 23, 21, 20.5, 20, 19.8, 19.65],
    marketCap: 2.15e9,
  },
]

// Data Structures - Implemented in Frontend

// Hash Map: For O(1) lookup of stocks by symbol
export class StockHashMap {
  private map: Map<string, (typeof mockStocks)[0]> = new Map()

  constructor(stocks: typeof mockStocks) {
    stocks.forEach((stock) => {
      this.map.set(stock.symbol, stock)
    })
  }

  get(symbol: string) {
    return this.map.get(symbol)
  }

  has(symbol: string) {
    return this.map.has(symbol)
  }

  getAll() {
    return Array.from(this.map.values())
  }
}

// Stack: For Recently Viewed stocks
export class RecentlyViewedStack {
  private stack: string[] = []
  private maxSize = 5

  push(symbol: string) {
    // Remove if already exists to avoid duplicates
    this.stack = this.stack.filter((s) => s !== symbol)
    this.stack.push(symbol)
    if (this.stack.length > this.maxSize) {
      this.stack.shift()
    }
  }

  getAll() {
    return [...this.stack].reverse() // Return in reverse order (most recent first)
  }

  clear() {
    this.stack = []
  }
}

// Queue: For Top Picks recommendation rotation
export class TopPicksQueue {
  private queue: (typeof mockStocks)[0][] = []

  constructor(stocks: typeof mockStocks) {
    // Initialize with best performers
    const sorted = [...stocks].sort((a, b) => b.changePercent - a.changePercent)
    this.queue = sorted.slice(0, 5)
  }

  dequeue() {
    return this.queue.shift()
  }

  enqueue(stock: (typeof mockStocks)[0]) {
    this.queue.push(stock)
  }

  getAll() {
    return this.queue
  }

  rotate() {
    const first = this.dequeue()
    if (first) {
      this.enqueue(first)
    }
  }
}

// Sorting Algorithms

// Quick Sort Implementation
export function quickSort(
  arr: typeof mockStocks,
  key: keyof (typeof mockStocks)[0] = "symbol",
  ascending = true,
): typeof mockStocks {
  if (arr.length <= 1) return arr

  const pivot = arr[0]
  const left: typeof mockStocks = []
  const right: typeof mockStocks = []

  for (let i = 1; i < arr.length; i++) {
    const comparison = arr[i][key] < pivot[key] ? -1 : 1
    if (comparison < 0) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }

  const sortedLeft = quickSort(left, key, ascending)
  const sortedRight = quickSort(right, key, ascending)

  const result = [...sortedLeft, pivot, ...sortedRight]
  return ascending ? result : result.reverse()
}

// Merge Sort Implementation
export function mergeSort(
  arr: typeof mockStocks,
  key: keyof (typeof mockStocks)[0] = "symbol",
  ascending = true,
): typeof mockStocks {
  if (arr.length <= 1) return arr

  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid), key, ascending)
  const right = mergeSort(arr.slice(mid), key, ascending)

  return merge(left, right, key, ascending)
}

function merge(
  left: typeof mockStocks,
  right: typeof mockStocks,
  key: keyof (typeof mockStocks)[0],
  ascending: boolean,
): typeof mockStocks {
  const result: typeof mockStocks = []

  let i = 0,
    j = 0
  while (i < left.length && j < right.length) {
    const comparison = left[i][key] < right[j][key] ? -1 : left[i][key] > right[j][key] ? 1 : 0

    if ((ascending && comparison < 0) || (!ascending && comparison > 0)) {
      result.push(left[i])
      i++
    } else {
      result.push(right[j])
      j++
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)]
}
