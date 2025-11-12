import { forwardRef, useEffect, useRef, useState, RefObject } from 'react'
import styles from './heroWithGoal.module.scss'
import { TypingText } from '@/components/TypingText'
import { aboutAllbarlawGif, legalCurationService } from '@/assets/imgs'

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
  const [showGoalDescription, setShowGoalDescription] = useState(false) // 올바로의 목표 설명 표시

  // LegalCurationService 애니메이션 상태
  const [showLegalCuration, setShowLegalCuration] = useState(false) // LegalCurationService 섹션 표시
  const [legalCurationTitle, setLegalCurationTitle] = useState(false) // 타이틀 표시
  const [legalCurationText, setLegalCurationText] = useState(false) // 텍스트 표시

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
  // 전체 높이: 1000vh
  // HeroWithGoal 애니메이션: 0% ~ 45% (0vh ~ 450vh) - 더 길게
  const fadeOutText = typingComplete && scrollProgress >= 0.08 // 8% (80vh): 텍스트 페이드아웃 시작
  const moveCircleToCenter = typingComplete && scrollProgress >= 0.12 // 12% (120vh): 서클 중앙 이동
  const hideGoalSection = scrollProgress >= 0.45 // 45% (450vh): 올바로의 목표 섹션 페이드아웃

  // LegalCurationService 애니메이션: 50% ~ 100% (500vh ~ 1000vh) - 시작점을 뒤로
  const showLegalCurationSection = scrollProgress >= 0.50 // 50% (500vh): LegalCurationService 섹션 표시

  // 연속적인 애니메이션을 위한 진행도 계산 (0.50 ~ 0.90 사이를 0 ~ 1로 정규화)
  const legalCurationProgress = Math.min(Math.max((scrollProgress - 0.50) / 0.40, 0), 1)

  // 연속적인 width 계산
  const getLegalCurationWidth = () => {
    if (legalCurationProgress <= 0.3) {
      // 0 ~ 0.3: 124px -> 100vw
      const progress = legalCurationProgress / 0.3
      return `calc(7.75rem + (100vw - 7.75rem) * ${progress})`
    } else {
      // 0.3 ~ 1.0: 100vw -> 677px
      const progress = (legalCurationProgress - 0.3) / 0.7
      return `calc(100vw - (100vw - 42.3125rem) * ${progress})`
    }
  }

  // 연속적인 transform 계산 (이미지가 좌측으로 이동)
  const getLegalCurationTransform = () => {
    if (legalCurationProgress <= 0.3) {
      // 0 ~ 0.3: 중앙 정렬
      return 'translateX(-50%)'
    } else {
      // 0.3 ~ 1.0: 중앙에서 우측 정렬로
      const progress = (legalCurationProgress - 0.3) / 0.7
      // translateX(-50%) -> translateX(calc(-100% + 21.15625rem))
      return `translateX(calc(-50% + (-50% + 21.15625rem) * ${progress}))`
    }
  }

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
          const startPos = {
            top: rect.top + rect.height / 2,
            left: rect.left + rect.width / 2,
          }
          console.log('Circle start position saved (PC):', {
            rectTop: rect.top,
            rectLeft: rect.left,
            rectWidth: rect.width,
            rectHeight: rect.height,
            calculatedTop: startPos.top,
            calculatedLeft: startPos.left,
            viewportWidth: window.innerWidth,
            screenCenterX: window.innerWidth / 2,
            screenCenterY: window.innerHeight / 2,
          })
          setCircleStartPos(startPos)
        }
      }, 900)
    }
  }, [typingComplete, expandCircle, circleStartPos])

  // moveCircleToCenter가 true가 되면 순차적 애니메이션 시작
  useEffect(() => {
    if (moveCircleToCenter && circleStartPos) {
      console.log('Animation starting - moveCircleToCenter triggered:', {
        circleStartPos,
        moveCircleToCenter,
        scrollProgress,
      })
      // 1단계: 중앙으로 이동 (position fixed 전환 후 약간 대기)
      const moveTimer = setTimeout(() => {
        console.log('Setting circleMoving to true')
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

      // 5단계: 타이틀 표시 완료 후 바로 description 표시 (2.25s + 0.5s)
      const descriptionTimer = setTimeout(() => {
        setShowGoalDescription(true)
      }, 2750)

      return () => {
        clearTimeout(moveTimer)
        clearTimeout(widthTimer)
        clearTimeout(heightTimer)
        clearTimeout(titleTimer)
        clearTimeout(descriptionTimer)
      }
    } else if (!moveCircleToCenter) {
      setCircleMoving(false)
      setExpandWidth(false)
      setExpandHeight(false)
      setShowGoalTitle(false)
      setShowGoalDescription(false)
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

        // LegalCurationService 섹션 표시 (50% 이상)
        if (progress > 0.50 && !showLegalCuration) {
          setShowLegalCuration(true)
        } else if (progress <= 0.50 && showLegalCuration) {
          setShowLegalCuration(false)
        }

        // LegalCurationService 타이틀 표시 (65% 이상)
        if (progress > 0.65 && !legalCurationTitle) {
          setLegalCurationTitle(true)
        } else if (progress <= 0.65 && legalCurationTitle) {
          setLegalCurationTitle(false)
        }

        // LegalCurationService 텍스트 표시 (80% 이상)
        if (progress > 0.80 && !legalCurationText) {
          setLegalCurationText(true)
        } else if (progress <= 0.80 && legalCurationText) {
          setLegalCurationText(false)
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
        setShowLegalCuration(false)
        setLegalCurationTitle(false)
        setLegalCurationText(false)
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
  }, [showLegalCuration, legalCurationTitle, legalCurationText, titleMoved, descriptionVisible, typingComplete])

  return (
    <div ref={sectionRef} className={styles['hero-with-goal']}>
      {/* Hero Section - fixed positioning */}
      <main
        className={styles['hero']}
        style={{
          opacity: !hideGoalSection ? 1 : 0,
          pointerEvents: !hideGoalSection ? 'auto' : 'none',
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
                margin: moveCircleToCenter ? 0 : undefined,
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
              {/* 올바로의 목표 타이틀 + Description (이미지 위에 표시) */}
              <div
                className={styles['goal-container']}
                style={{
                  transform: showGoalDescription
                    ? viewportWidth <= 768 ? 'translate(-50%, -50%)' : 'translateY(0)'
                    : viewportWidth <= 768 ? 'translate(-50%, calc(-50% + 30px))' : 'translateY(30px)',
                  opacity: showGoalDescription ? 1 : 0,
                }}
              >
                <div className={styles['goal-description-title']}>올바로의 목표</div>
                <div className={styles['goal-description']}>
                  법률 문제 해결을 위한 첫 걸음은
                  <br /> 정확한 정보를 찾는 것입니다.
                  <br /> <br />
                  그래야 해결책을 세우고
                  <br /> 제대로 된 변호사를 선임할 수 있죠. <br />
                  <br />
                  하지만 현실에선 첫 걸음부터 막힙니다. <br />
                  무분별한 광고와 부정확한 정보로
                  <br /> 모든 검색결과가 도배되어 있기 때문입니다. <br />
                  <br />
                  올바로는 올바른 법률정보만을 선별하여 제공해 <br />
                  법률 정보의 비대칭을 해소하고자 합니다
                </div>
              </div>
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

        {/* 올바로의 목표 타이틀 (이미지 위에 표시) */}
        {(() => {
          const heightStr = getCircleHeight()
          const heightValue = parseFloat(heightStr)

          // PC: 이미지 위 100px, 모바일: 이미지 위 60px
          const offset = viewportWidth <= 768 ? 60 : 100
          const topPosition = `calc(50% - ${heightValue / 2}px - ${offset}px)`

          return (
            <div
              className={styles['goal-title']}
              style={{
                top: topPosition,
                transform: showGoalTitle ? 'translate(-50%, 0)' : 'translate(-50%, 20px)',
                opacity: showGoalTitle ? 1 : 0,
              }}
            >
              올바로의 목표
            </div>
          )
        })()}
      </main>

      {/* LegalCurationService Section */}
      <div
        className={styles['legal-curation-section']}
        style={{
          opacity: showLegalCurationSection && scrollProgress < 0.95 ? 1 : 0,
          pointerEvents: showLegalCurationSection && scrollProgress < 0.95 ? 'auto' : 'none',
        }}
      >
          {legalCurationTitle && <div className={styles['legal-curation-title']}>의뢰인과 변호사와의 연결고리</div>}
          <div
            className={styles['legal-curation-image-wrapper']}
            style={{
              width: getLegalCurationWidth(),
            }}
          >
            <img
              src={legalCurationService}
              alt='legal-curation-service'
              className={styles['legal-curation-image']}
              style={{
                transform: getLegalCurationTransform(),
              }}
            />
          </div>
          {legalCurationText && (
            <div className={styles['legal-curation-text']}>
              <h2>
                나에게 꼭 필요한
                <br />
                법률정보만 골라볼 순 없을까?
              </h2>
              <p>
                세상에 똑같은 고민은 없기에
                <br />
                오직 나만을 위한 해결책이 필요합니다 <br />
                수많은 올바로의 법률정보 속에서
                <br />내 문제의 해결책을 찾아보시기 바랍니다.
              </p>
            </div>
          )}
        </div>
    </div>
  )
})

HeroWithGoal.displayName = 'HeroWithGoal'

export default HeroWithGoal
