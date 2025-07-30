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
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

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
