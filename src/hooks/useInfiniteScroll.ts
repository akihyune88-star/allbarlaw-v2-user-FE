import { useCallback, useEffect, useRef } from 'react'

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
  threshold = 500,
  enabled = true,
}: UseInfiniteScrollProps) => {
  const fetchingRef = useRef(false)

  const checkAndFillContent = useCallback(() => {
    if (!enabled) return
    
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = window.innerHeight
    const scrollableDistance = scrollHeight - clientHeight

    // 화면을 채우기에 충분한 콘텐츠가 없으면 계속 로드
    // 뷰포트 높이의 50% 이상 스크롤 가능해야 충분하다고 판단
    const needsMoreContent = scrollableDistance < clientHeight * 0.5

    console.log('📊 Content Check:', {
      scrollHeight,
      clientHeight,
      scrollableDistance,
      needsMoreContent,
      hasNextPage,
      isFetchingNextPage,
      fetchingRef: fetchingRef.current,
      threshold: clientHeight * 0.5,
    })

    if (needsMoreContent && hasNextPage && !isFetchingNextPage && !fetchingRef.current) {
      console.log('🔄 Auto-loading more content to fill screen')
      fetchingRef.current = true
      fetchNextPage()
      
      // 데이터 로드 후 다시 체크 (더 길게 대기)
      setTimeout(() => {
        fetchingRef.current = false
        // 재귀적으로 다시 체크
        setTimeout(() => {
          checkAndFillContent()
        }, 500)
      }, 2000)
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, enabled])

  const handleScroll = useCallback(() => {
    if (!enabled) return
    if (fetchingRef.current) return // 이미 페치 중이면 무시

    // window 스크롤 사용
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = window.innerHeight

    // 스크롤이 끝에서 threshold px 이내에 도달했을 때 다음 페이지 로드
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold

    console.log('🔍 Scroll Debug:', {
      scrollTop,
      scrollHeight,  
      clientHeight,
      isNearBottom,
      hasNextPage,
      isFetchingNextPage,
    })

    if (isNearBottom && hasNextPage && !isFetchingNextPage && !fetchingRef.current) {
      console.log('✅ Fetching next page! (Near bottom)')
      fetchingRef.current = true
      fetchNextPage()
      
      // 페치 완료 후 플래그 리셋
      setTimeout(() => {
        fetchingRef.current = false
        checkAndFillContent() // 로드 후 화면 채우기 체크
      }, 1000)
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, threshold, enabled, checkAndFillContent])

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('scroll', handleScroll)

    // 초기 로드 시 화면 채우기 체크
    checkAndFillContent()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, checkAndFillContent, enabled])

  // hasNextPage가 변경될 때마다 화면 채우기 체크
  useEffect(() => {
    if (hasNextPage && enabled && !fetchingRef.current) {
      console.log('📌 hasNextPage changed to true, checking if need more content')
      const timer = setTimeout(() => {
        checkAndFillContent()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [hasNextPage, checkAndFillContent, enabled])
  
  // 데이터가 변경될 때마다 체크 (pages 길이로 감지)
  useEffect(() => {
    if (enabled && !fetchingRef.current) {
      console.log('📝 Data changed, checking content fill')
      const timer = setTimeout(() => {
        checkAndFillContent()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [checkAndFillContent, enabled])

  return { handleScroll }
}
