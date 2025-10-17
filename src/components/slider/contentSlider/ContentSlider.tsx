import React, { useRef, useState } from 'react'
import Slider, { Settings } from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styles from './content-slider.module.scss'

export interface ContentSliderProps {
  children: React.ReactNode
  className?: string
  autoPlay?: boolean
  autoPlaySpeed?: number
  speed?: number
  pauseOnHover?: boolean
  infinite?: boolean
  fade?: boolean
  onSlideChange?: (currentSlide: number, nextSlide: number) => void
  onNext?: () => void
  onPrev?: () => void
  sliderSettings?: Partial<Settings>
}

const ContentSlider: React.FC<ContentSliderProps> = ({
  children,
  className = '',
  autoPlay = false,
  autoPlaySpeed = 3000,
  speed = 500,
  pauseOnHover = true,
  infinite = false,
  fade = false,
  onSlideChange,
  onNext,
  onPrev,
  sliderSettings = {},
}) => {
  const sliderRef = useRef<Slider>(null)
  const [_currentSlide, setCurrentSlide] = useState(0)

  const defaultSettings: Settings = {
    dots: false,
    infinite,
    speed,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: autoPlay,
    autoplaySpeed: autoPlaySpeed,
    pauseOnHover,
    arrows: false,
    fade,
    beforeChange: (current: number, next: number) => {
      setCurrentSlide(next)
      onSlideChange?.(current, next)

      // 다음/이전 콜백 호출
      if (next > current) {
        onNext?.()
      } else if (next < current) {
        onPrev?.()
      }
    },
  }

  const mergedSettings: Settings = {
    ...defaultSettings,
    ...sliderSettings,
  }

  return (
    <div className={`${styles['content-slider-container']} ${className}`}>
      <Slider {...mergedSettings} ref={sliderRef} className={styles['content-slider']}>
        {React.Children.map(children, (child, index) => (
          <div key={index} className={styles['slide-wrapper']}>
            {child}
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default ContentSlider
