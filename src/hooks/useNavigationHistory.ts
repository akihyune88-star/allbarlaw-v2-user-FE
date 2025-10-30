import { useState, useCallback } from 'react'

export const useNavigationHistory = () => {
  const [excludeIdsHistory, setExcludeIdsHistory] = useState<number[][]>([[]])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0)

  const currentExcludeIds = excludeIdsHistory[currentHistoryIndex] || []

  const handleNext = useCallback(
    (currentItemIds: number[]) => {
      const newExcludeIds = [...currentExcludeIds, ...currentItemIds]

      setExcludeIdsHistory(prev => {
        const newHistory = [...prev]
        // 현재 위치 이후의 히스토리 제거 (새로운 경로)
        newHistory.splice(currentHistoryIndex + 1)
        newHistory.push(newExcludeIds)
        return newHistory
      })
      setCurrentHistoryIndex(prev => prev + 1)
    },
    [currentExcludeIds, currentHistoryIndex]
  )

  const handlePrev = useCallback(() => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(prev => prev - 1)
    }
  }, [currentHistoryIndex])

  const canGoPrev = currentHistoryIndex > 0

  const reset = useCallback(() => {
    setExcludeIdsHistory([[]])
    setCurrentHistoryIndex(0)
  }, [])

  return {
    currentExcludeIds,
    handleNext,
    handlePrev,
    canGoPrev,
    currentHistoryIndex,
    historyLength: excludeIdsHistory.length,
    reset,
  }
}
