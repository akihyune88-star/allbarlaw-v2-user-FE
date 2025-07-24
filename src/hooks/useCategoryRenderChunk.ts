import { useEffect, useState, useMemo } from 'react'

const MOBILE_ICON_SIZE = 54
const ITEM_GAP = 8

export const useCategoryRenderChunk = () => {
  const [width, setWidth] = useState(window.innerWidth)

  const chunkSize = useMemo(() => {
    const availableWidth = width - 20 // 양옆 패딩 20씩 제거
    if (width >= 1280) {
      return 9
    } else {
      // 아이템 크기 + 갭을 고려하여 계산
      const totalItemWidth = MOBILE_ICON_SIZE + ITEM_GAP
      const resizedIconSize = Math.floor(availableWidth / totalItemWidth)
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
