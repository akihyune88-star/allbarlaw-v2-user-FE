import { forwardRef, useEffect, useRef, useState, RefObject } from 'react'
import styles from './heroWithGoal.module.scss'
import { TypingText } from '@/components/TypingText'
import { aboutGoal } from '@/assets/imgs'

type HeroWithGoalProps = {
  nextSectionRef: RefObject<HTMLDivElement | null>
}

const HeroWithGoal = forwardRef<HTMLDivElement, HeroWithGoalProps>(({ nextSectionRef }, _ref) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const goalImageRef = useRef<HTMLElement>(null)
  const inlineCircleRef = useRef<HTMLElement>(null)

  const [currentStep, setCurrentStep] = useState(1)
  const [circleInitialPos, setCircleInitialPos] = useState({ x: 0, y: 0 })
  const [isScrolling, setIsScrolling] = useState(false)
  const lastScrollTime = useRef(0)
  const scrollTimeoutRef = useRef<number | null>(null)

  // AboutGoal 애니메이션 상태
  const [titleMoved, setTitleMoved] = useState(false)
  const [descriptionVisible, setDescriptionVisible] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const deltaYRef = useRef(0)

  // Hero 단계별 애니메이션 상태 (1-10단계)
  const showFirstText = currentStep >= 1
  const showSecondTextPart1 = currentStep >= 2
  const showCircle = currentStep >= 3
  const showSecondTextPart2 = currentStep >= 5
  const fadeOutText = currentStep >= 6 // 6단계: 텍스트 사라지고 동그라미만 남음
  const expandToImageWidth = currentStep >= 8 // 8단계: 이미지 너비만큼 확장
  const expandToImageHeight = currentStep >= 9 // 9단계: 이미지 높이까지 확장

  // 6단계에서 미리 인라인 원의 위치를 계산하여 저장 (7단계 전환을 위한 준비)
  useEffect(() => {
    if (currentStep === 6 && inlineCircleRef.current) {
      // DOM이 안정화될 때까지 대기하지 않고 즉시 계산
      if (inlineCircleRef.current) {
        const rect = inlineCircleRef.current.getBoundingClientRect()
        const viewportCenterX = window.innerWidth / 2
        const viewportCenterY = window.innerHeight / 2

        // 원의 중심에서 화면 중심까지의 거리
        const circleCenterX = rect.left + rect.width / 2
        const circleCenterY = rect.top + rect.height / 2

        setCircleInitialPos({
          x: circleCenterX - viewportCenterX,
          y: circleCenterY - viewportCenterY,
        })
      }
    }
  }, [currentStep])

  // 동그라미 크기 계산
  const getCircleWidth = () => {
    if (!showCircle) return '0px'
    if (currentStep < 4) return 'clamp(2rem, 10vw, 3.75rem)' // 3단계: 원형 작은 크기
    if (currentStep < 8) return '180px' // 4-7단계: 180px 고정
    // 8단계: AboutGoal 이미지 너비만큼 확장
    if (goalImageRef.current && expandToImageWidth) {
      const goalRect = goalImageRef.current.getBoundingClientRect()
      return `${goalRect.width}px`
    }
    return '180px'
  }

  const getCircleHeight = () => {
    if (!showCircle) return '0px'
    // 4-8단계는 60px 고정 (180px 너비일 때의 높이)
    if (currentStep >= 4 && currentStep < 9) return '60px'
    if (currentStep < 9) return 'clamp(2rem, 10vw, 3.75rem)' // 3단계
    // 9단계: AboutGoal 이미지 높이만큼 확장
    if (goalImageRef.current && expandToImageHeight) {
      const goalRect = goalImageRef.current.getBoundingClientRect()
      return `${goalRect.height}px`
    }
    return '60px'
  }

  // border-radius 계산
  const getCircleBorderRadius = () => {
    if (!showCircle) return '50%'
    if (currentStep < 7) return '30px' // 6단계까지는 원형
    // 7단계부터는 둥근 네모 (중앙 이동하면서 변경됨)
    return 'clamp(1.125rem, 4vw, 2.5rem)'
  }

  // AboutGoal description 애니메이션 완료 후 스크롤 허용
  useEffect(() => {
    if (descriptionVisible) {
      const timer = setTimeout(() => {
        setAnimationComplete(true)
      }, 500)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [descriptionVisible])

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const currentElement = sectionRef.current
      const nextElement = nextSectionRef.current
      const goalElement = goalImageRef.current

      if (!currentElement) return

      const currentRect = currentElement.getBoundingClientRect()
      const isCurrentVisible = currentRect.top <= 0 && currentRect.bottom > 0

      // Hero 섹션 (1-9단계)
      if (isCurrentVisible && currentStep <= 9) {
        if (currentStep < 9) {
          e.preventDefault()
          e.stopPropagation()
        }

        if (isScrolling) {
          e.preventDefault()
          e.stopPropagation()
          return
        }

        const now = Date.now()
        // 디바운스 400ms - 애니메이션은 막으면서도 자연스러운 진행 허용
        if (now - lastScrollTime.current < 400) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
        lastScrollTime.current = now

        // 아래로 스크롤
        if (e.deltaY > 0) {
          e.preventDefault()
          e.stopPropagation()

          if (currentStep < 9) {
            setCurrentStep(prev => prev + 1)
          } else if (currentStep === 9) {
            // 9단계 완료 후 AboutGoal 텍스트 애니메이션으로 전환
            setCurrentStep(10)
          }
        }
        // 위로 스크롤
        else if (e.deltaY < 0) {
          e.preventDefault()
          e.stopPropagation()

          if (currentStep > 1) {
            setCurrentStep(prev => prev - 1)
          }
        }
      }
      // AboutGoal 섹션 (10단계 이후)
      else if (isCurrentVisible && currentStep >= 10 && goalElement) {
        const rect = goalElement.getBoundingClientRect()
        const isGoalVisible = rect.top < window.innerHeight && rect.bottom > 0

        if (!isGoalVisible) return

        // 아래로 스크롤
        if (e.deltaY > 0 && !animationComplete) {
          e.preventDefault()
          deltaYRef.current += e.deltaY

          if (deltaYRef.current > 100 && !titleMoved) {
            setTitleMoved(true)
          } else if (deltaYRef.current > 300 && titleMoved) {
            setDescriptionVisible(true)
          }
        }
        // 위로 스크롤
        else if (e.deltaY < 0) {
          // AboutGoal 섹션 내에서 되감기
          if (titleMoved || descriptionVisible) {
            e.preventDefault()
            deltaYRef.current -= Math.abs(e.deltaY)

            if (deltaYRef.current < 300 && descriptionVisible) {
              setDescriptionVisible(false)
              setAnimationComplete(false)
            }
            if (deltaYRef.current < 100 && titleMoved) {
              setTitleMoved(false)
            }
            if (deltaYRef.current < 0) {
              deltaYRef.current = 0
            }
          }
          // AboutGoal의 초기 상태에서 Hero로 복귀
          else if (!titleMoved && !descriptionVisible && currentStep === 11) {
            e.preventDefault()
            setCurrentStep(10)
          }
        }
      }
      // 다음 섹션에서 위로 스크롤하면 AboutGoal로 복귀
      else if (nextElement && currentStep >= 11) {
        const nextRect = nextElement.getBoundingClientRect()
        if (nextRect.top >= 0 && nextRect.top < window.innerHeight && e.deltaY < 0) {
          e.preventDefault()
          e.stopPropagation()
          setIsScrolling(true)
          setAnimationComplete(false)

          currentElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })

          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
          }
          scrollTimeoutRef.current = window.setTimeout(() => {
            setIsScrolling(false)
          }, 1500)
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [currentStep, isScrolling, titleMoved, descriptionVisible, animationComplete, nextSectionRef])

  return (
    <div ref={sectionRef} className={styles['hero-with-goal']}>
      {/* Hero Section - absolute positioning */}
      <main
        className={styles['hero']}
        style={{
          opacity: currentStep < 11 ? 1 : 0,
          pointerEvents: currentStep < 11 ? 'auto' : 'none',
          transition: 'opacity 0.8s ease',
        }}
      >
        <section className={styles['hero-content']}>
          <div className={styles['hero-content-line']}>
            <span style={{ opacity: fadeOutText ? 0 : 1, transition: 'opacity 0.8s ease' }}>
              <TypingText text='누구나 법 앞에서 평등할 수 있도록' isActive={showFirstText} speed={80}>
                {(displayText, showCursor) => (
                  <span>
                    {displayText.includes('평등') ? (
                      <>
                        {displayText.split('평등')[0]}
                        <br className={styles['mobile-break']} />
                        <strong>평등</strong>
                        {displayText.split('평등')[1]}
                        {showCursor && <span className={styles['cursor']}>|</span>}
                      </>
                    ) : (
                      <>
                        {displayText}
                        {showCursor && <span className={styles['cursor']}>|</span>}
                      </>
                    )}
                  </span>
                )}
              </TypingText>
            </span>
          </div>
          <div className={styles['hero-content-line']}>
            <span style={{ opacity: fadeOutText ? 0 : 1, transition: 'opacity 0.8s ease' }}>
              <TypingText text='정보의 격차가' isActive={showSecondTextPart1} speed={80}>
                {(displayText, showCursor) => (
                  <span>
                    {displayText}
                    {showCursor && <span className={styles['cursor']}>|</span>}
                  </span>
                )}
              </TypingText>
            </span>
            <figure
              ref={inlineCircleRef}
              className={styles['hero-image-container']}
              style={{
                opacity: showCircle && currentStep < 7 ? 1 : 0,
                width: getCircleWidth(),
                height: getCircleHeight(),
                borderRadius: getCircleBorderRadius(),
                transition: 'opacity 0.8s ease, width 0.8s ease, height 0.8s ease, border-radius 0.8s ease',
              }}
            />
            <span style={{ opacity: fadeOutText ? 0 : 1, transition: 'opacity 0.8s ease' }}>
              <TypingText text='정의의 격차가 되지 않도록' isActive={showSecondTextPart2} speed={80}>
                {(displayText, showCursor) => (
                  <span>
                    {displayText}
                    {showCursor && <span className={styles['cursor']}>|</span>}
                  </span>
                )}
              </TypingText>
            </span>
          </div>
        </section>
      </main>

      {/* Circle - 7단계부터 중앙에 absolute positioning */}
      {currentStep >= 7 && (
        <figure
          className={styles['hero-circle']}
          style={{
            width: getCircleWidth(),
            height: getCircleHeight(),
            borderRadius: getCircleBorderRadius(),
            transform:
              currentStep === 7
                ? `translate(calc(-50% + ${circleInitialPos.x}px), calc(-50% + ${circleInitialPos.y}px))`
                : 'translate(-50%, -50%)',
            transition: 'width 0.8s ease, height 0.8s ease, border-radius 0.8s ease, transform 1.2s ease',
          }}
        >
          <img
            src={aboutGoal}
            alt='about-goal'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 10%',
              opacity: currentStep >= 9 ? 1 : 0,
              transition: 'opacity 0.8s ease',
            }}
          />
          {/* 이미지 위에 텍스트 오버레이 */}
          {currentStep >= 9 && (
            <div className={styles['about-goal-text-wrapper']}>
              <span className={styles['about-goal-image-title']} data-moved={titleMoved}>
                정확하고 유용한 법률 정보
              </span>
              {descriptionVisible && (
                <p className={styles['about-goal-image-description']}>
                  정확한 법률 정보는 불필요한 법적 분쟁을 예방하고,
                  <br />
                  문제 발생 시 적절한 대응을 가능하게 합니다.
                  <br />
                  올바로는 이를 위한 가장 빠르고 정확한 법률정보를 제공하겠습니다.
                </p>
              )}
            </div>
          )}
        </figure>
      )}
    </div>
  )
})

HeroWithGoal.displayName = 'HeroWithGoal'

export default HeroWithGoal
