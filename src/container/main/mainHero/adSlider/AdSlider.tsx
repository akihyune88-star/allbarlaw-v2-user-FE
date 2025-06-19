/* eslint-disable consistent-return */
import { useState, useEffect } from 'react'
import styles from './ad-slider.module.scss'
import PlayButton from '@/components/playButton/PlayButton'
import { BannerResponse } from '@/types/banner'

interface AdSliderProps {
  ads: BannerResponse | []
  className?: string
}

const AdSlider = ({ ads, className }: AdSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(prev => prev + 1)
  }

  const handlePrev = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(prev => prev - 1)
  }

  // 트랜지션 끝나면 무한 루프 처리
  const handleTransitionEnd = () => {
    setIsTransitioning(false)
    if (currentIndex >= ads.length) {
      setCurrentIndex(0)
    } else if (currentIndex < 0) {
      setCurrentIndex(ads.length - 1)
    }
  }

  // 3초마다 자동 슬라이드
  useEffect(() => {
    if (ads.length <= 1) return

    const interval = setInterval(() => {
      handleNext()
    }, 3000)
    return () => clearInterval(interval)
  }, [ads.length, isTransitioning])

  return (
    <div className={`${styles['ad-slider']} ${className || ''}`}>
      <div
        className={styles['slider-container']}
        onTransitionEnd={handleTransitionEnd}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
        }}
      >
        {ads.length === 0 ? (
          <div className={styles['empty-state']}>
            <p>현재 표시할 광고가 없습니다</p>
          </div>
        ) : (
          <>
            {ads.map((ad, index) => (
              <a key={ad.id} href={ad.link} className={styles['ad-item']}>
                <img src={ad.imageUrl} alt={`광고 ${index + 1}`} />
              </a>
            ))}
            {/* 무한 루프를 위한 첫 번째 슬라이드 복제 */}
            <a key={`${ads[0]?.id}-clone`} href={ads[0]?.link} className={styles['ad-item']}>
              <img src={ads[0]?.imageUrl} alt={`광고 1 (복제)`} />
            </a>
          </>
        )}
      </div>
      {ads.length > 1 && (
        <div className={styles['nav-button-container']}>
          <span className={styles['page']}>
            <strong>{currentIndex >= ads.length ? 1 : currentIndex + 1}</strong>/{ads.length}
          </span>
          <PlayButton onNext={handleNext} onPrev={handlePrev} className={styles['play-button']} />
        </div>
      )}
    </div>
  )
}

export default AdSlider
