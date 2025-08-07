import { useCallback, useEffect } from 'react'

interface UseInfiniteScrollProps {
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage: () => void
  threshold?: number
  enabled?: boolean
}

export const useInfiniteScroll = ({
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  threshold = 200,
  enabled = true,
}: UseInfiniteScrollProps) => {
  const handleScroll = useCallback(() => {
    if (!enabled) return

    // window 스크롤 사용
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = window.innerHeight

    // 스크롤이 끝에서 threshold px 이내에 도달했을 때 다음 페이지 로드
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold

    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, threshold, enabled])

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('scroll', handleScroll)
    
    // 초기 로드 시 스크롤 체크
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, enabled])

  return { handleScroll }
}
