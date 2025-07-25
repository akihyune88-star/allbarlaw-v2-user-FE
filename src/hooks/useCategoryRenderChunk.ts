import { useEffect, useState, useMemo } from 'react'

const MOBILE_ICON_SIZE = 54
const ITEM_GAP = 8

interface UseCategoryRenderChunkProps {
  iconSize?: number
  itemGap?: number
  horizontalPadding?: number
}

export const useCategoryRenderChunk = ({
  iconSize = MOBILE_ICON_SIZE,
  itemGap = ITEM_GAP,
  horizontalPadding = 20,
}: UseCategoryRenderChunkProps) => {
  const [width, setWidth] = useState(window.innerWidth)

  console.log('horizontalPadding:', horizontalPadding)
  const chunkSize = useMemo(() => {
    const availableWidth = width - horizontalPadding // 양옆 패딩 20씩 제거
    if (width >= 1280) {
      return 9
    } else {
      // 아이템 크기 + 갭을 고려하여 계산
      const totalItemWidth = iconSize + itemGap
      const resizedIconSize = Math.floor(availableWidth / totalItemWidth)
      console.log('availableWidth:', availableWidth)
      console.log('totalItemWidth:', totalItemWidth)
      console.log('resizedIconSize:', resizedIconSize)
      return resizedIconSize
    }
  }, [width])

  console.log('현재 width:', width, 'chunkSize:', chunkSize)

  // 화면 크기 변화 감지
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)

    handleResize()

    window.addEventListener('resize', handleResize) // 리사이즈 이벤트 리스너 추가

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  //   const chunkSize = useMemo(() => {
  //     const availableWidth = width - 40 // 양옆 패딩 20씩 제거
  //     if (width >= 1280) {
  //       return 9
  //     } else {
  //       return 5
  //     }
  //   }, [width])

  return { chunkSize }
}
