import { useEffect, useMemo, useState } from 'react'

export function useChunkedRotate<T>(items: T[], chunkSize: number) {
  const chunks: T[][] = useMemo(() => {
    if (!Array.isArray(items) || chunkSize <= 0) return []
    const result: T[][] = []
    for (let i = 0; i < items.length; i += chunkSize) {
      result.push(items.slice(i, i + chunkSize))
    }
    return result
  }, [items, chunkSize])

  const chunkCount = chunks.length
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [chunkCount])

  const visibleItems: T[] = chunkCount ? chunks[index] : []

  const rotateNext = () => {
    if (!chunkCount) return
    setIndex(prev => (prev + 1) % chunkCount)
  }

  return { visibleItems, rotateNext, index, chunkCount }
}
