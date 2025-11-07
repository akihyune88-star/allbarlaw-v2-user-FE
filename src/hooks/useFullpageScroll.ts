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
  // _threshold = 500,
  scrollTimeout = 1500,
}: UseFullpageScrollProps): UseFullpageScrollReturn => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [opacity, setOpacity] = useState(1)
  const [scrollStep, setScrollStep] = useState(0) // 0: 초기, 1-3: 단계별, 4: 이동
  const scrollTimeoutRef = useRef<number | null>(null)
  const lastScrollTime = useRef(0)

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
        // 단계 애니메이션 진행 중에는 스크롤 막기
        if (scrollStep < 3) {
          e.preventDefault()
        }

        const now = Date.now()
        // 100ms 디바운스 - 너무 빠른 연속 스크롤 방지
        if (now - lastScrollTime.current < 100) return
        lastScrollTime.current = now

        // 아래로 스크롤
        if (e.deltaY > 0) {
          if (scrollStep < 3) {
            // 1, 2, 3단계 - 스크롤 막고 단계만 진행
            e.preventDefault()
            const newStep = scrollStep + 1
            setScrollStep(newStep)
            setOpacity(1 - newStep / 3) // 0.66, 0.33, 0
          } else if (scrollStep === 3) {
            // 3단계 완료 후 한번 더 스크롤하면 다음 섹션으로 이동
            e.preventDefault()
            setIsScrolling(true)
            setScrollStep(0)
            setOpacity(1)

            nextElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })

            if (scrollTimeoutRef.current) {
              clearTimeout(scrollTimeoutRef.current)
            }
            scrollTimeoutRef.current = window.setTimeout(() => {
              setIsScrolling(false)
            }, scrollTimeout)
          }
        }
        // 위로 스크롤 (리버스)
        else if (e.deltaY < 0 && scrollStep > 0) {
          e.preventDefault()
          const newStep = scrollStep - 1
          setScrollStep(newStep)
          setOpacity(1 - newStep / 3) // 0.33, 0.66, 1
        }
      }
      // 다음 섹션이 화면 맨 위에 있고 위로 스크롤
      else if (isNextVisible && e.deltaY < 0 && nextRect.top >= 0) {
        // 위로 스크롤 시 현재 섹션으로 돌아가기
        e.preventDefault()
        setIsScrolling(true)
        setScrollStep(0)
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
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [isScrolling, scrollStep, scrollTimeout, nextSectionRef])

  return {
    sectionRef,
    opacity,
    isScrolling,
  }
}
