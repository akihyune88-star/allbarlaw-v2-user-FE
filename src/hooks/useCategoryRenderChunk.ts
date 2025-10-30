import { useEffect, useState, useMemo } from 'react'

const MOBILE_ICON_SIZE = 54
const MOBILE_ITEM_GAP = 8
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

  const chunkSize = useMemo(() => {
    if (width >= 1280) {
      // 데스크톱: 정확한 계산 적용
      const availableWidth = width - DESKTOP_CATEGORY_ROW_PADDING
      // 마지막 아이템은 gap이 없으므로: (availableWidth + gap) / (itemWidth + gap)
      const calculatedSize = Math.floor((availableWidth + DESKTOP_ITEM_GAP) / (DESKTOP_ICON_SIZE + DESKTOP_ITEM_GAP))
      return calculatedSize
    } else {
      // 모바일: horizontalPadding은 한쪽만, 양쪽이므로 *2 해야 함
      const availableWidth = width - horizontalPadding * 2
      const totalItemWidth = iconSize + itemGap
      // 마지막 아이템은 gap이 없으므로: (availableWidth + gap) / (itemWidth + gap)
      const calculatedSize = Math.floor((availableWidth + itemGap) / totalItemWidth)
      return calculatedSize
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

  return { chunkSize }
}
