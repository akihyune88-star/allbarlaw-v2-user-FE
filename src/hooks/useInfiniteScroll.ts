import { useCallback, useEffect } from 'react'

interface UseInfiniteScrollProps {
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage: () => void
  containerSelector?: string
}

export const useInfiniteScroll = ({
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  containerSelector = '.lawyer-selection-container',
}: UseInfiniteScrollProps) => {
  const handleScroll = useCallback(() => {
    const scrollContainer = document.querySelector(containerSelector) as HTMLElement
    if (!scrollContainer) return

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer

    // 스크롤이 끝에서 100px 이내에 도달했을 때 다음 페이지 로드
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100

    console.log('🔍 useInfiniteScroll - 스크롤 상태:', {
      scrollTop,
      scrollHeight,
      clientHeight,
      isNearBottom,
      hasNextPage,
      isFetchingNextPage,
    })

    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      console.log('🟢 useInfiniteScroll - 다음 페이지 로드 시작')
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, containerSelector])

  useEffect(() => {
    const scrollContainer = document.querySelector(containerSelector)
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll)
      return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }
    return undefined
  }, [handleScroll, containerSelector])

  return { handleScroll }
}
