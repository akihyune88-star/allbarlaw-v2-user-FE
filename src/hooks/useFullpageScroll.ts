import { useRef, useEffect, useState, RefObject } from 'react'

interface UseFullpageScrollProps {
  nextSectionRef: RefObject<HTMLDivElement | null>
  threshold?: number
  scrollTimeout?: number
}

interface UseFullpageScrollReturn {
  sectionRef: RefObject<HTMLDivElement | null>
  opacity: number
  isScrolling: boolean
}

export const useFullpageScroll = ({
  nextSectionRef,
  threshold = 500,
  scrollTimeout = 1500,
}: UseFullpageScrollProps): UseFullpageScrollReturn => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [opacity, setOpacity] = useState(1)
  const scrollTimeoutRef = useRef<number | null>(null)
  const deltaYRef = useRef<number>(0)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return

      const currentElement = sectionRef.current
      const nextElement = nextSectionRef.current
      if (!currentElement || !nextElement) return

      const currentRect = currentElement.getBoundingClientRect()
      const nextRect = nextElement.getBoundingClientRect()

      const isCurrentVisible = currentRect.top < window.innerHeight && currentRect.bottom > 0
      const isNextVisible = nextRect.top < window.innerHeight && nextRect.bottom > 0

      // 현재 섹션이 화면에 보이는 상태
      if (isCurrentVisible) {
        // 스크롤 이벤트 막기 (수동 제어)
        e.preventDefault()

        // 아래로 스크롤
        if (e.deltaY > 0) {
          deltaYRef.current += e.deltaY

          // 스크롤 진행도에 따라 opacity 계산 (0 ~ threshold 범위)
          const calculatedOpacity = Math.max(0, 1 - deltaYRef.current / threshold)
          setOpacity(calculatedOpacity)

          // 임계값을 넘으면 다음 섹션으로 이동
          if (deltaYRef.current > threshold) {
            setIsScrolling(true)
            deltaYRef.current = 0

            nextElement.scrollIntoView({
              behavior: 'auto',
              block: 'start',
            })

            // 스크롤 완료 후 다시 활성화
            if (scrollTimeoutRef.current) {
              clearTimeout(scrollTimeoutRef.current)
            }
            scrollTimeoutRef.current = window.setTimeout(() => {
              setIsScrolling(false)
            }, scrollTimeout)
          }
        }
        // 위로 스크롤
        else if (e.deltaY < 0) {
          deltaYRef.current += e.deltaY
          deltaYRef.current = Math.max(0, deltaYRef.current) // 음수 방지

          // 스크롤 진행도에 따라 opacity 계산 (다시 페이드 인)
          const calculatedOpacity = Math.max(0, 1 - deltaYRef.current / threshold)
          setOpacity(calculatedOpacity)
        }
      }
      // 다음 섹션이 화면 맨 위에 있고 위로 스크롤
      else if (isNextVisible && e.deltaY < 0 && nextRect.top >= 0) {
        // 위로 스크롤 시 현재 섹션으로 돌아가기
        e.preventDefault()
        setIsScrolling(true)
        deltaYRef.current = 0
        setOpacity(1)

        currentElement.scrollIntoView({
          behavior: 'auto',
          block: 'start',
        })

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
        scrollTimeoutRef.current = window.setTimeout(() => {
          setIsScrolling(false)
        }, scrollTimeout)
      } else {
        // 임계값 리셋
        deltaYRef.current = 0
        setOpacity(1)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [isScrolling, threshold, scrollTimeout, nextSectionRef])

  return {
    sectionRef,
    opacity,
    isScrolling,
  }
}
