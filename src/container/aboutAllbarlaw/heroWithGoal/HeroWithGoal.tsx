import { forwardRef, useEffect, useRef, useState, RefObject } from 'react'
import styles from './heroWithGoal.module.scss'
import { TypingText } from '@/components/TypingText'
import { aboutAllbarlawGif, aboutGoal } from '@/assets/imgs'

type HeroWithGoalProps = {
  nextSectionRef: RefObject<HTMLDivElement | null>
}

const HeroWithGoal = forwardRef<HTMLDivElement, HeroWithGoalProps>(({ nextSectionRef: _nextSectionRef }, _ref) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inlineCircleRef = useRef<HTMLElement>(null)

  const [scrollProgress, setScrollProgress] = useState(0) // 0-1 사이의 값
  const [circleStartPos, setCircleStartPos] = useState<{ top: number; left: number } | null>(null)
  const [circleMoving, setCircleMoving] = useState(false) // 중앙으로 이동 중인지
  const [expandWidth, setExpandWidth] = useState(false) // 가로 확장
  const [expandHeight, setExpandHeight] = useState(false) // 세로 확장
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [showGoalTitle, setShowGoalTitle] = useState(false) // 올바로의 목표 타이틀 표시

  // 타이핑 단계별 상태 (순차적 진행)
  const [typingStep, setTypingStep] = useState(0) // 0: 시작 전, 1: 첫 문장, 2: 두번째 문장, 3: 원 작게, 4: 원 크게, 5: 세번째 문장, 6: 완료
  const [typingComplete, setTypingComplete] = useState(false)

  // AboutGoal 애니메이션 상태
  const [titleMoved, setTitleMoved] = useState(false)
  const [descriptionVisible, setDescriptionVisible] = useState(false)

  // Hero 단계별 애니메이션 상태 (타이핑은 순차적으로, 나머지는 스크롤 진행도 기반)
  // 타이핑 완료 후에는 모든 텍스트를 계속 표시
  const showFirstText = typingStep >= 1 || typingComplete
  const showSecondTextPart1 = typingStep >= 2 || typingComplete
  const showCircle = typingStep >= 3 || typingComplete
  const expandCircle = typingStep >= 4 || typingComplete
  const showSecondTextPart2 = typingStep >= 5 || typingComplete

  // 스크롤 기반 애니메이션 (타이핑 완료 후)
  const fadeOutText = typingComplete && scrollProgress >= 0.15 // 텍스트 페이드아웃 시작
  const moveCircleToCenter = typingComplete && scrollProgress >= 0.25 // 텍스트 완전히 사라진 후 서클 이동

  // 타이핑 애니메이션 순차적 진행
  useEffect(() => {
    const text1 = '누구나 법 앞에서 평등할 수 있도록'
    const text2 = '정보의 격차가'
    const text3 = '정의의 격차가 되지 않도록'
    const speed = 60 // 타이핑 속도 (ms per character)
    const circleExpandDuration = 800 // 공이 늘어나는 애니메이션 시간

    // 1단계: 첫 번째 문장 시작
    const timer1 = setTimeout(() => {
      setTypingStep(1)
    }, 100)

    // 2단계: 첫 번째 문장 완료 후 두 번째 문장 시작
    const timer2 = setTimeout(() => {
      setTypingStep(2)
    }, text1.length * speed + 500)

    // 3단계: 두 번째 문장 완료 후 원 작게 표시
    const timer3 = setTimeout(() => {
      setTypingStep(3)
    }, (text1.length + text2.length) * speed + 1000)

    // 4단계: 원이 180px로 늘어남
    const timer4 = setTimeout(() => {
      setTypingStep(4)
    }, (text1.length + text2.length) * speed + 1300)

    // 5단계: 원 확장 완료 후 세 번째 문장 시작
    const timer5 = setTimeout(() => {
      setTypingStep(5)
    }, (text1.length + text2.length) * speed + 1300 + circleExpandDuration)

    // 6단계: 모든 타이핑 완료
    const timer6 = setTimeout(() => {
      setTypingStep(6)
      setTypingComplete(true)
    }, (text1.length + text2.length + text3.length) * speed + 1300 + circleExpandDuration + 500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
      clearTimeout(timer6)
    }
  }, [])

  // viewport width 추적 (반응형 대응)
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 타이핑 완료 후 서클이 180px로 확장되면 위치 저장
  useEffect(() => {
    if (typingComplete && expandCircle && !circleStartPos && inlineCircleRef.current) {
      // 서클 확장 애니메이션이 끝날 때까지 대기 (transition 시간 0.8s + 여유)
      setTimeout(() => {
        if (inlineCircleRef.current) {
          const rect = inlineCircleRef.current.getBoundingClientRect()
          // 서클의 중앙 좌표 저장 (position: relative 상태에서)
          setCircleStartPos({
            top: rect.top + rect.height / 2,
            left: rect.left + rect.width / 2
          })
        }
      }, 900)
    }
  }, [typingComplete, expandCircle, circleStartPos])

  // moveCircleToCenter가 true가 되면 순차적 애니메이션 시작
  useEffect(() => {
    if (moveCircleToCenter && circleStartPos) {
      // 1단계: 중앙으로 이동 (position fixed 전환 후 약간 대기)
      const moveTimer = setTimeout(() => {
        setCircleMoving(true)
      }, 50)

      // 2단계: 중앙 이동 완료 후 가로 확장 시작 (0.8s + 0.1s 대기)
      const widthTimer = setTimeout(() => {
        setExpandWidth(true)
      }, 950)

      // 3단계: 가로 확장 완료 후 바로 세로 확장 시작 (0.95s + 0.5s)
      const heightTimer = setTimeout(() => {
        setExpandHeight(true)
      }, 1450)

      // 4단계: 세로 확장 완료 후 타이틀 표시 (1.45s + 0.5s + 0.3s 대기)
      const titleTimer = setTimeout(() => {
        setShowGoalTitle(true)
      }, 2250)

      return () => {
        clearTimeout(moveTimer)
        clearTimeout(widthTimer)
        clearTimeout(heightTimer)
        clearTimeout(titleTimer)
      }
    }

    if (!moveCircleToCenter) {
      setCircleMoving(false)
      setExpandWidth(false)
      setExpandHeight(false)
      setShowGoalTitle(false)
    }
  }, [moveCircleToCenter, circleStartPos])

  // 동그라미 크기 계산 (타이핑 단계 + 순차적 확장)
  const getCircleWidth = () => {
    // 타이핑 중: 단계별 크기
    if (!typingComplete) {
      if (expandCircle) {
        // 태블릿 이하: 90px, PC: 180px
        return viewportWidth <= 768 ? '90px' : '180px'
      }
      if (showCircle) return 'clamp(2rem, 10vw, 3.75rem)' // 3단계: 작은 크기
      return '0px'
    }

    // 가로 확장 전: 태블릿 이하 90px, PC 180px
    if (!expandWidth) {
      return viewportWidth <= 768 ? '90px' : '180px'
    }

    // 가로 확장 (state의 viewportWidth 사용)
    const tabletBreakpoint = 768
    const desktopBreakpoint = 1280

    // 태블릿 이하: 전체 화면
    if (viewportWidth <= tabletBreakpoint) {
      return '100vw'
    }

    // 1280px 이하: 양옆 1.25rem 여백
    if (viewportWidth <= desktopBreakpoint + 20) {
      return 'calc(100vw - 2.5rem)'
    }

    // 1280px 초과: 최대 1280px
    return '1280px'
  }

  const getCircleHeight = () => {
    // 타이핑 중: 단계별 크기
    if (!typingComplete) {
      if (expandCircle) {
        // 태블릿 이하: 32px, PC: 60px
        return viewportWidth <= 768 ? '32px' : '60px'
      }
      if (showCircle) return 'clamp(2rem, 10vw, 3.75rem)' // 3단계: 작은 크기
      return '0px'
    }

    // 세로 확장 전: 태블릿 이하 32px, PC 60px
    if (!expandHeight) {
      return viewportWidth <= 768 ? '32px' : '60px'
    }

    // 세로 확장 (state의 viewportWidth 사용)
    const tabletBreakpoint = 768
    const desktopBreakpoint = 1280
    const aspectRatio = 1280 / 588

    // 태블릿 이하: 전체 화면 높이
    if (viewportWidth <= tabletBreakpoint) {
      return '100vh'
    }

    // 1280px 이하: 너비에 맞춰 aspect-ratio 유지 (여백 고려)
    if (viewportWidth <= desktopBreakpoint + 20) {
      const actualWidth = viewportWidth - 40 // 2.5rem ≈ 40px
      const height = actualWidth / aspectRatio
      return `${height}px`
    }

    // 1280px 초과: 1280px 기준 aspect-ratio
    const height = 1280 / aspectRatio
    return `${height}px`
  }

  // border-radius 계산
  const getCircleBorderRadius = () => {
    if (!typingComplete) return '30px'
    if (scrollProgress < 0.2) return '30px' // 초반은 원형

    // 태블릿 이하에서 확장 완료 시: radius 없음 (state의 viewportWidth 사용)
    const tabletBreakpoint = 768
    if (viewportWidth <= tabletBreakpoint && expandHeight) {
      return '0'
    }

    // 데스크탑: 둥근 네모
    return 'clamp(1.125rem, 4vw, 2.5rem)'
  }

  // 스크롤 이벤트 처리 - 스크롤 위치에 따라 애니메이션 진행
  useEffect(() => {
    const handleScroll = () => {
      const currentElement = sectionRef.current
      if (!currentElement) return

      const rect = currentElement.getBoundingClientRect()
      const sectionHeight = currentElement.offsetHeight
      const viewportHeight = window.innerHeight

      // 섹션이 화면에 보이는 경우에만 진행도 계산
      if (rect.top <= 0 && rect.bottom > viewportHeight) {
        // 스크롤 진행도 계산 (0-1 사이 값)
        const scrolled = Math.abs(rect.top)
        const progress = Math.min(scrolled / (sectionHeight - viewportHeight), 1)
        setScrollProgress(progress)

        // 스크롤이 일정 이상 진행되면 타이핑 애니메이션 강제 완료
        if (progress > 0.05 && !typingComplete) {
          setTypingStep(6)
          setTypingComplete(true)
        }

        // AboutGoal 텍스트 애니메이션 (90% 이상 스크롤 시)
        if (progress > 0.9 && !titleMoved) {
          setTitleMoved(true)
        } else if (progress <= 0.9 && titleMoved) {
          setTitleMoved(false)
        }

        // Description 표시 (95% 이상 스크롤 시)
        if (progress > 0.95 && !descriptionVisible) {
          setDescriptionVisible(true)
        } else if (progress <= 0.95 && descriptionVisible) {
          setDescriptionVisible(false)
        }
      }
      // 섹션을 지나쳤을 때
      else if (rect.bottom <= viewportHeight) {
        setScrollProgress(1)
      }
      // 섹션 이전일 때
      else if (rect.top > 0) {
        setScrollProgress(0)
        setTitleMoved(false)
        setDescriptionVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // 초기 로드 시에도 실행
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [titleMoved, descriptionVisible, typingComplete])

  return (
    <div ref={sectionRef} className={styles['hero-with-goal']}>
      {/* Hero Section - fixed positioning */}
      <main
        className={styles['hero']}
        style={{
          opacity: scrollProgress < 1 ? 1 : 0,
          pointerEvents: scrollProgress < 1 ? 'auto' : 'none',
          transition: 'opacity 0.8s ease',
        }}
      >
        <section className={styles['hero-content']}>
          <div className={styles['hero-content-line']}>
            <span style={{ opacity: fadeOutText ? 0 : 1, transition: 'opacity 0.8s ease' }}>
              <TypingText text='누구나 법 앞에서 평등할 수 있도록' isActive={showFirstText} speed={60}>
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
              <TypingText text='정보의 격차가' isActive={showSecondTextPart1} speed={60}>
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
                opacity: showCircle ? 1 : 0,
                width: getCircleWidth(),
                height: getCircleHeight(),
                borderRadius: getCircleBorderRadius(),
                overflow: 'hidden',
                margin: circleMoving ? 0 : undefined,
                position: moveCircleToCenter ? 'fixed' : 'relative',
                top: moveCircleToCenter
                  ? circleMoving
                    ? '50%'
                    : circleStartPos
                      ? `${circleStartPos.top}px`
                      : '50%'
                  : 'auto',
                left: moveCircleToCenter
                  ? circleMoving
                    ? '50%'
                    : circleStartPos
                      ? `${circleStartPos.left}px`
                      : '50%'
                  : 'auto',
                transform: moveCircleToCenter ? 'translate(-50%, -50%)' : 'none',
                zIndex: moveCircleToCenter ? 10 : 'auto',
                transition: circleMoving
                  ? 'opacity 0.3s ease, width 0.5s ease, height 0.5s ease, border-radius 0.5s ease, ' +
                    'top 0.8s ease, left 0.8s ease, transform 0.8s ease'
                  : 'opacity 0.3s ease, width 0.5s ease, height 0.5s ease, border-radius 0.5s ease',
              }}
            >
              <img
                src={aboutAllbarlawGif}
                alt='about-goal'
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 10%',
                  // opacity: scrollProgress >= 0.7 ? 1 : 0,
                  transition: 'opacity 0.8s ease',
                }}
              />
              {/* 이미지 위에 텍스트 오버레이 */}
              {scrollProgress >= 0.7 && (
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
            <span style={{ opacity: fadeOutText ? 0 : 1, transition: 'opacity 0.8s ease' }}>
              <TypingText text='정의의 격차가 되지 않도록' isActive={showSecondTextPart2} speed={60}>
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

        {/* 올바로의 목표 타이틀 (PC only, 이미지 위에 표시) */}
        {showGoalTitle && viewportWidth > 768 && (() => {
          const heightStr = getCircleHeight()
          const heightValue = parseFloat(heightStr)
          const topPosition = `calc(50% - ${heightValue / 2}px - 100px)`

          return (
            <div
              style={{
                position: 'fixed',
                top: topPosition,
                left: '50%',
                transform: showGoalTitle
                  ? 'translate(-50%, 0)'
                  : 'translate(-50%, 20px)',
                zIndex: 11,
                fontFamily: 'SUIT',
                fontWeight: 800,
                fontSize: '32px',
                lineHeight: '48px',
                textAlign: 'center',
                color: '#000',
                opacity: showGoalTitle ? 1 : 0,
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              올바로의 목표
            </div>
          )
        })()}
      </main>
    </div>
  )
})

HeroWithGoal.displayName = 'HeroWithGoal'

export default HeroWithGoal
