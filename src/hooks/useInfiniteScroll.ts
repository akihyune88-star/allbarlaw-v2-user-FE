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
  const retryCountRef = useRef(0)
  const maxRetries = 5

  const checkAndFillContent = useCallback(() => {
    if (!enabled || !hasNextPage) {
      retryCountRef.current = 0
      return
    }

    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = window.innerHeight
    const scrollableDistance = scrollHeight - clientHeight

    // 화면을 채우기에 충분한 콘텐츠가 없으면 계속 로드
    // 100px 정도만 스크롤 가능하면 더 로드
    const needsMoreContent = scrollableDistance < 100

    if (needsMoreContent && hasNextPage && !isFetchingNextPage && !fetchingRef.current) {
      if (retryCountRef.current >= maxRetries) {
        console.log('⚠️ Max retries reached, stopping auto-fill')
        retryCountRef.current = 0
        return
      }

      fetchingRef.current = true
      retryCountRef.current++
      fetchNextPage()

      // 데이터 로드 후 다시 체크
      setTimeout(() => {
        fetchingRef.current = false
        // 재귀적으로 다시 체크
        setTimeout(() => {
          checkAndFillContent()
        }, 100)
      }, 1000)
    } else if (!needsMoreContent) {
      retryCountRef.current = 0
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, enabled])

  const handleScroll = useCallback(() => {
    if (!enabled || !hasNextPage || isFetchingNextPage || fetchingRef.current) return

    // window 스크롤 사용
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = window.innerHeight

    // 스크롤이 끝에서 threshold px 이내에 도달했을 때 다음 페이지 로드
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold

    if (isNearBottom) {
      console.log('✅ Fetching next page! (Near bottom)')
      fetchingRef.current = true
      fetchNextPage()

      // 페치 완료 후 플래그 리셋 및 재체크
      setTimeout(() => {
        fetchingRef.current = false
      }, 500)
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, threshold, enabled])

  useEffect(() => {
    if (!enabled) return undefined

    window.addEventListener('scroll', handleScroll)

    // 초기 로드 시 화면 채우기 체크
    checkAndFillContent()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, checkAndFillContent, enabled])

  // hasNextPage가 변경될 때마다 화면 채우기 체크
  useEffect(() => {
    if (hasNextPage && enabled) {
      console.log('📌 hasNextPage changed to:', hasNextPage)
      // 조금 더 긴 딜레이를 주어 데이터가 완전히 로드될 때까지 대기
      const timer = setTimeout(() => {
        checkAndFillContent()
      }, 500)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [hasNextPage, enabled])

  // 데이터가 변경될 때마다 체크를 위한 별도 트리거
  // isFetchingNextPage가 false로 바뀔 때 체크
  useEffect(() => {
    if (!isFetchingNextPage && enabled && hasNextPage) {
      console.log('📝 Fetching completed, checking if need more')
      const timer = setTimeout(() => {
        checkAndFillContent()
      }, 200)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [isFetchingNextPage, enabled, hasNextPage])

  return { handleScroll }
}
