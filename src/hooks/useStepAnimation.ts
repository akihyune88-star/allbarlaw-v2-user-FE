import { useRef, useEffect, useState, RefObject } from 'react'

interface UseStepAnimationProps<T = HTMLDivElement | null> {
  nextSectionRef: RefObject<T>
  totalSteps: number // 총 단계 수 (Hero의 경우 5)
  scrollTimeout?: number
}

interface UseStepAnimationReturn {
  sectionRef: RefObject<HTMLDivElement | null>
  currentStep: number // 0~totalSteps
  isScrolling: boolean
}

export const useStepAnimation = <T extends { containerRef?: RefObject<HTMLDivElement | null> } | HTMLDivElement | null>({
  nextSectionRef,
  totalSteps,
  scrollTimeout = 1500,
}: UseStepAnimationProps<T>): UseStepAnimationReturn => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1부터 시작 (첫 문장 자동 타이핑)
  const scrollTimeoutRef = useRef<number | null>(null)
  const lastScrollTime = useRef(0)
  const touchStartY = useRef<number>(0)

  // nextSectionRef에서 실제 DOM 요소 가져오기
  const getNextElement = (): HTMLDivElement | null => {
    const ref = nextSectionRef.current
    if (!ref) return null
    if ('containerRef' in ref && ref.containerRef) {
      return ref.containerRef.current
    }
    return ref as HTMLDivElement
  }

  useEffect(() => {
    // 터치 이벤트 핸들러
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      const currentElement = sectionRef.current
      if (!currentElement) return

      const currentRect = currentElement.getBoundingClientRect()
      // Hero 섹션이 화면 상단에 고정되어 있는지 확인
      const isCurrentActive = currentRect.top >= -10 && currentRect.top <= 10

      // Hero 섹션이 활성화되어 있고 단계 진행 중이면 터치 스크롤 완전히 막기
      if (isCurrentActive && currentStep < totalSteps) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const currentElement = sectionRef.current
      const nextElement = getNextElement()
      if (!currentElement || !nextElement) return

      const currentRect = currentElement.getBoundingClientRect()
      const isCurrentVisible = currentRect.top <= 0 && currentRect.bottom > 0

      if (!isCurrentVisible || isScrolling) return

      const touchEndY = e.changedTouches[0].clientY
      const deltaY = touchStartY.current - touchEndY

      const now = Date.now()
      if (now - lastScrollTime.current < 500) return
      lastScrollTime.current = now

      // 위로 스와이프 (아래로 스크롤)
      if (deltaY > 50) {
        if (currentStep < totalSteps) {
          setCurrentStep(prev => prev + 1)
        } else {
          // 모든 단계 완료 - 다음 섹션으로
          setIsScrolling(true)
          nextElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })

          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
          }
          scrollTimeoutRef.current = window.setTimeout(() => {
            setIsScrolling(false)
            setCurrentStep(1)
          }, scrollTimeout)
        }
      }
      // 아래로 스와이프 (위로 스크롤)
      else if (deltaY < -50) {
        if (currentStep > 1) {
          setCurrentStep(prev => prev - 1)
        }
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    const handleWheel = (e: WheelEvent) => {
      const currentElement = sectionRef.current
      const nextElement = getNextElement()
      if (!currentElement || !nextElement) return

      const currentRect = currentElement.getBoundingClientRect()
      const nextRect = nextElement.getBoundingClientRect()

      // 현재 섹션이 화면에 보이는지 확인
      const isCurrentVisible = currentRect.top <= 0 && currentRect.bottom > 0

      // 현재 섹션이 보이는 동안 모든 스크롤 막기
      if (isCurrentVisible) {
        // 단계별 애니메이션이 진행 중이면 항상 스크롤 막기
        if (currentStep < totalSteps) {
          e.preventDefault()
          e.stopPropagation()
        }

        // 스크롤 중이면 아무것도 하지 않음
        if (isScrolling) {
          e.preventDefault()
          e.stopPropagation()
          return
        }

        const now = Date.now()
        // 500ms 디바운스 - 각 단계 간 충분한 시간 확보
        if (now - lastScrollTime.current < 500) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
        lastScrollTime.current = now

        // 아래로 스크롤
        if (e.deltaY > 0) {
          e.preventDefault()
          e.stopPropagation()

          if (currentStep < totalSteps) {
            // 단계 진행 중 - 단계만 증가
            setCurrentStep(prev => prev + 1)
          } else {
            // 모든 단계 완료 - 다음 섹션으로 이동
            setIsScrolling(true)

            nextElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })

            if (scrollTimeoutRef.current) {
              clearTimeout(scrollTimeoutRef.current)
            }
            scrollTimeoutRef.current = window.setTimeout(() => {
              setIsScrolling(false)
              setCurrentStep(1) // 다음 섹션 이동 후 리셋 (1부터 시작)
            }, scrollTimeout)
          }
        }
        // 위로 스크롤 (리버스)
        else if (e.deltaY < 0) {
          e.preventDefault()
          e.stopPropagation()

          if (currentStep > 1) {
            // 단계 역행 (1까지만 내려감)
            setCurrentStep(prev => prev - 1)
          }
          // currentStep === 1 이면 더 이상 내려가지 않음 (첫 문장은 항상 표시)
        }
      }
      // 다음 섹션에서 위로 스크롤하면 현재 섹션으로 복귀
      else if (nextRect.top >= 0 && nextRect.top < window.innerHeight && e.deltaY < 0) {
        e.preventDefault()
        e.stopPropagation()
        setIsScrolling(true)
        setCurrentStep(totalSteps) // 마지막 단계로 복귀

        currentElement.scrollIntoView({
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

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('wheel', handleWheel)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [isScrolling, currentStep, totalSteps, scrollTimeout, nextSectionRef])

  return {
    sectionRef,
    currentStep,
    isScrolling,
  }
}
