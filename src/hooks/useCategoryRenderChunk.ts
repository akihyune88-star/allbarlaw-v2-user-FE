import { useEffect, useState, useMemo } from 'react'

const MOBILE_ICON_SIZE = 54
const MOBILE_ITEM_GAP = 0 // space-between으로 간격을 자동 조정하므로 0으로 설정
const DESKTOP_ICON_SIZE = 62
const DESKTOP_ITEM_GAP = 32
const DESKTOP_CATEGORY_ROW_PADDING = 100 // 50px * 2

interface UseCategoryRenderChunkProps {
  iconSize?: number
  itemGap?: number
  horizontalPadding?: number
}

export const useCategoryRenderChunk = ({
  iconSize = MOBILE_ICON_SIZE,
  itemGap = MOBILE_ITEM_GAP,
  horizontalPadding = 20,
}: UseCategoryRenderChunkProps) => {
  const [width, setWidth] = useState(window.innerWidth)

  const { chunkSize, calculatedGap } = useMemo(() => {
    if (width >= 1280) {
      // 데스크톱: 정확한 계산 적용
      const availableWidth = width - DESKTOP_CATEGORY_ROW_PADDING
      // 마지막 아이템은 gap이 없으므로: (availableWidth + gap) / (itemWidth + gap)
      const calculatedSize = Math.floor((availableWidth + DESKTOP_ITEM_GAP) / (DESKTOP_ICON_SIZE + DESKTOP_ITEM_GAP))
      return { chunkSize: calculatedSize, calculatedGap: DESKTOP_ITEM_GAP }
    } else {
      // 모바일: 최대한 많은 아이콘을 배치하고, 남는 공간을 gap으로 균등 분배
      const availableWidth = width - horizontalPadding * 2

      // 최소 gap을 고려하여 들어갈 수 있는 아이템 개수 계산
      const minGap = 4 // 최소 간격 4px
      const calculatedSize = Math.floor((availableWidth + minGap) / (iconSize + minGap))

      // 실제 gap 계산: (전체 너비 - 아이콘들의 총 너비) / (아이콘 개수 - 1)
      const totalIconWidth = iconSize * calculatedSize
      const remainingSpace = availableWidth - totalIconWidth
      const gap = calculatedSize > 1 ? remainingSpace / (calculatedSize - 1) : 0

      return { chunkSize: calculatedSize, calculatedGap: gap }
    }
  }, [width, iconSize, itemGap, horizontalPadding])

  // 화면 크기 변화 감지
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)

    handleResize()

    window.addEventListener('resize', handleResize) // 리사이즈 이벤트 리스너 추가

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return { chunkSize, calculatedGap }
}
