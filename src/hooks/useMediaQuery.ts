import { useState, useEffect } from 'react'

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    // 초기값을 실제 media query 결과로 설정
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}
