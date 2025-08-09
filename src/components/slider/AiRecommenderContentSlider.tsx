import React, { useState, useRef, useEffect } from 'react'
import styles from './ai-recommender-content-slider.module.scss'

type AiRecommenderContentSliderProps = {
  title: string
  children: React.ReactNode
  className?: string
  autoPlay?: boolean
  autoPlayInterval?: number
}

const AiRecommenderContentSlider = ({
  title,
  children,
  className,
  autoPlay = false,
  autoPlayInterval = 3000,
}: AiRecommenderContentSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const childrenArray = React.Children.toArray(children)
  const itemsToShow = isMobile ? 1 : 2
  const totalSlides = Math.ceil(childrenArray.length / itemsToShow)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const goToNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides)
  }

  useEffect(() => {
    if (autoPlay && !isPaused && !isDragging && totalSlides > 1) {
      autoPlayRef.current = setInterval(goToNextSlide, autoPlayInterval)
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
        autoPlayRef.current = null
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [autoPlay, isPaused, isDragging, autoPlayInterval, totalSlides, currentSlide])

  const handleSlideChange = (index: number) => {
    // 페이지네이션 클릭 시에도 앞으로만 이동 (순환)
    if (index >= 0 && index < totalSlides) {
      setIsTransitioning(true)
      setCurrentSlide(index)
      setTranslateX(0)
    }
  }

  const handleStart = (clientX: number) => {
    setIsDragging(true)
    setStartX(clientX)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return
    const diff = clientX - startX
    // 오른쪽으로 드래그하는 것을 방지 (이전으로 가지 않음)
    if (diff > 0) {
      setTranslateX(0)
    } else {
      setTranslateX(diff)
    }
  }

  const handleEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    if (Math.abs(translateX) > 50) {
      if (translateX < 0) {
        // 왼쪽으로 스와이프 - 다음 슬라이드로만 이동
        handleSlideChange((currentSlide + 1) % totalSlides)
      }
      // 오른쪽 스와이프는 무시 (이전으로 가지 않음)
    }
    setTranslateX(0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  const handleMouseEnter = () => {
    if (autoPlay) {
      setIsPaused(true)
    }
  }

  const handleMouseLeave = () => {
    if (autoPlay) {
      setIsPaused(false)
    }
  }

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX)
      }
    }

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleEnd()
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging, startX, translateX, currentSlide])

  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      <div
        className={styles.container}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.contentWrapper}>
          <h3 className={styles.title}>{title}</h3>

          <div
            className={styles.sliderWrapper}
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={styles.sliderTrack}
              style={{
                transform: `translateX(calc(-${currentSlide * 100}% + ${translateX}px))`,
                transition: isDragging ? 'none' : isTransitioning ? 'transform 0.3s ease' : 'none',
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className={styles.slideGroup}>
                  {childrenArray.slice(slideIndex * itemsToShow, (slideIndex + 1) * itemsToShow).map((child, index) => (
                    <div key={`${slideIndex}-${index}`} className={styles.slideItem}>
                      {child}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {totalSlides > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`${styles.paginationDot} ${index === currentSlide ? styles.active : ''}`}
              onClick={() => handleSlideChange(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AiRecommenderContentSlider
