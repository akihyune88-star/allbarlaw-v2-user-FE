import { useEffect, useRef } from 'react'

interface UseInfiniteScrollProps {
  hasNextPage: boolean
  isFetching: boolean
  fetchNextPage: () => void
  threshold?: number
  throttleMs?: number
}

/**
 * 무한스크롤 로직을 처리하는 공통 훅
 * @param hasNextPage - 다음 페이지가 있는지 여부
 * @param isFetching - 현재 로딩 중인지 여부
 * @param fetchNextPage - 다음 페이지를 가져오는 함수
 * @param threshold - 바닥에서 몇 px 이내에서 트리거할지 (기본값: 200px)
 * @param throttleMs - 스크롤 이벤트 throttle 시간 (기본값: 200ms)
 */
export const useInfiniteScroll = ({
  hasNextPage,
  isFetching,
  fetchNextPage,
  threshold = 200,
  throttleMs = 200,
}: UseInfiniteScrollProps) => {
  const throttleRef = useRef<number | null>(null)

  // 최신 상태를 참조하기 위한 ref
  const isFetchingRef = useRef(isFetching)
  const hasNextPageRef = useRef(hasNextPage)
  const fetchNextPageRef = useRef(fetchNextPage)

  // ref 업데이트
  useEffect(() => {
    isFetchingRef.current = isFetching
    hasNextPageRef.current = hasNextPage
    fetchNextPageRef.current = fetchNextPage
  }, [isFetching, hasNextPage, fetchNextPage])

  useEffect(() => {
    const handleScroll = () => {
      // 이미 스크롤 이벤트가 처리 중이면 무시
      if (throttleRef.current) return

      // throttle 적용
      throttleRef.current = window.setTimeout(() => {
        throttleRef.current = null

        // 스크롤이 바닥에서 threshold px 이내에 있고, 현재 로딩 중이 아닐 때만 다음 페이지 로드
        if (
          window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - threshold &&
          !isFetchingRef.current &&
          hasNextPageRef.current
        ) {
          console.log('Fetching next page...')
          fetchNextPageRef.current()
        }
      }, throttleMs)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (throttleRef.current) {
        window.clearTimeout(throttleRef.current)
      }
    }
  }, [threshold, throttleMs])
}
