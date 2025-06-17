import { useState, useEffect, useCallback } from 'react'
import styles from './ad-slider.module.scss'
import PlayButton from '@/components/playButton/PlayButton'

interface AdSliderProps {
  ads: {
    id: number
    imageUrl: string
    link: string
  }[]
  className?: string
  autoplay?: boolean
}

const AdSlider = ({ ads, className, autoplay = true }: AdSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoplay)

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev === ads.length - 1 ? 0 : prev + 1))
  }, [ads.length])

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? ads.length - 1 : prev - 1))
  }

  const handleToggle = () => {
    setIsPlaying(prev => !prev)
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    if (isPlaying) {
      interval = setInterval(handleNext, 3000) // 3초마다 슬라이드
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isPlaying, handleNext])

  return (
    <div className={`${styles['ad-slider']} ${className || ''}`}>
      <div className={styles['slider-container']}>
        {ads.map((ad, index) => (
          <a
            key={ad.id}
            href={ad.link}
            className={`${styles['ad-item']} ${index === currentIndex ? styles.active : ''}`}
            style={{ transform: `translateX(${(index - currentIndex) * 100}%)` }}
          >
            <img src={ad.imageUrl} alt={`광고 ${index + 1}`} />
          </a>
        ))}
      </div>
      <div className={styles['nav-button-container']}>
        <span className={styles['page']}>
          <strong>{currentIndex + 1}</strong>/{ads.length}
        </span>
        <PlayButton onNext={handleNext} onPrev={handlePrev} onToggle={handleToggle} className={styles['play-button']} />
      </div>
    </div>
  )
}

export default AdSlider
