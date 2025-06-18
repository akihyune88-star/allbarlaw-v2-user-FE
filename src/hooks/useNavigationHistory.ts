import { useState, useCallback } from 'react'

type UseNavigationHistoryProps<T> = {
  currentData: T[]
  getItemId: (item: T) => number
}

export const useNavigationHistory = <T>({ currentData, getItemId }: UseNavigationHistoryProps<T>) => {
  const [excludeIdsHistory, setExcludeIdsHistory] = useState<number[][]>([[]])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0)

  const currentExcludeIds = excludeIdsHistory[currentHistoryIndex]

  const handleNext = useCallback(() => {
    const currentIds = currentData.map(getItemId)
    const newExcludeIds = [...currentExcludeIds, ...currentIds]

    setExcludeIdsHistory(prev => {
      const newHistory = [...prev]
      // 현재 위치 이후의 히스토리 제거 (새로운 경로)
      newHistory.splice(currentHistoryIndex + 1)
      newHistory.push(newExcludeIds)
      return newHistory
    })
    setCurrentHistoryIndex(prev => prev + 1)
  }, [currentData, getItemId, currentExcludeIds, currentHistoryIndex])

  const handlePrev = useCallback(() => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(prev => prev - 1)
    }
  }, [currentHistoryIndex])

  const canGoPrev = currentHistoryIndex > 0
  const canGoNext = true // 항상 다음으로 갈 수 있음 (새 데이터 요청)

  return {
    currentExcludeIds,
    handleNext,
    handlePrev,
    canGoPrev,
    canGoNext,
    currentHistoryIndex,
    historyLength: excludeIdsHistory.length,
  }
}
