import { useState, useCallback, useMemo } from 'react'
import { Lawyer } from '@/types/lawyerTypes'

export const useLawyerSelection = (maxSelection = 4) => {
  const [selectedLawyers, setSelectedLawyers] = useState<Lawyer[]>([])

  const handleLawyerClick = useCallback(
    (lawyer: Lawyer) => {
      if (selectedLawyers.some(l => l.lawyerId === lawyer.lawyerId)) {
        setSelectedLawyers(prev => prev.filter(l => l.lawyerId !== lawyer.lawyerId))
      } else {
        if (selectedLawyers.length >= maxSelection) {
          alert(`최대 ${maxSelection}명까지 선택할 수 있습니다.`)
          return
        }
        setSelectedLawyers(prev => [...prev, lawyer])
      }
    },
    [selectedLawyers, maxSelection]
  )

  const handleRemoveLawyer = useCallback((lawyer: Lawyer) => {
    setSelectedLawyers(prev => prev.filter(l => l.lawyerId !== lawyer.lawyerId))
  }, [])

  const selectedLawyerIds = useMemo(() => selectedLawyers.map(lawyer => lawyer.lawyerId), [selectedLawyers])

  const isSelectionValid = useMemo(() => selectedLawyers.length > 0, [selectedLawyers])

  return {
    selectedLawyers,
    selectedLawyerIds,
    handleLawyerClick,
    handleRemoveLawyer,
    isSelectionValid,
    setSelectedLawyers,
  }
}
