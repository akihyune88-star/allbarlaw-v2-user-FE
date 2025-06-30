import React, { useState, useRef } from 'react'
import Slider, { Settings } from 'react-slick'
import styles from './image-slider.module.scss'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export interface ImageItem {
  id: string | number
  src: string
  alt?: string
  title?: string
  description?: string
  onClick?: () => void
}

export interface ImageSliderProps {
  images: string[] | ImageItem[] // 문자열 배열 또는 객체 배열 둘 다 지원
  className?: string
  width?: string | number
  height?: string | number
  sliderSettings?: Partial<Settings>
  showTitle?: boolean
  showDescription?: boolean
  imageObjectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  loading?: 'lazy' | 'eager'
  // 추가 확장성을 위한 props
  renderCustomContent?: (item: ImageItem, index: number) => React.ReactNode
  onSlideChange?: (currentSlide: number) => void
  onImageClick?: (src: string, index: number) => void // 간단한 클릭 핸들러
  customArrows?: {
    prevArrow?: React.ComponentType<any>
    nextArrow?: React.ComponentType<any>
  }
  // 커스텀 닷 관련
  customDots?: boolean
  renderCustomDot?: (index: number, isActive: boolean, onClick: () => void) => React.ReactNode
}

const defaultSettings: Settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  arrows: true,
  adaptiveHeight: true,
  lazyLoad: 'ondemand',
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  className = '',
  width = '100%',
  height = 'auto',
  sliderSettings = {},
  showTitle = false,
  showDescription = false,
  imageObjectFit = 'cover',
  loading = 'lazy',
  renderCustomContent,
  onSlideChange,
  onImageClick,
  customArrows,
  customDots = false,
  renderCustomDot,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderRef = useRef<Slider>(null)

  // 문자열 배열을 ImageItem 배열로 변환하는 함수
  const normalizeImages = (images: string[] | ImageItem[]): ImageItem[] => {
    return images.map((item, index) => {
      if (typeof item === 'string') {
        return {
          id: index,
          src: item,
          alt: `이미지 ${index + 1}`,
          onClick: onImageClick ? () => onImageClick(item, index) : undefined,
        }
      }
      return item
    })
  }

  const normalizedImages = normalizeImages(images)

  // 슬라이드 변경 핸들러
  const handleSlideChange = (current: number) => {
    setCurrentSlide(current)
    onSlideChange?.(current)
  }

  // 닷 클릭 핸들러
  const handleDotClick = (index: number) => {
    sliderRef.current?.slickGoTo(index)
  }

  // Slick 설정 병합
  const mergedSettings: Settings = {
    ...defaultSettings,
    ...sliderSettings,
    dots: customDots ? false : sliderSettings.dots ?? defaultSettings.dots, // 커스텀 닷 사용 시 기본 닷 비활성화
    afterChange: (current: number) => {
      handleSlideChange(current)
      // 기존 afterChange 콜백도 유지
      sliderSettings.afterChange?.(current)
    },
    ...(customArrows && {
      prevArrow: customArrows.prevArrow ? <customArrows.prevArrow /> : defaultSettings.prevArrow,
      nextArrow: customArrows.nextArrow ? <customArrows.nextArrow /> : defaultSettings.nextArrow,
    }),
  }

  // 스타일 객체 생성
  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height:
      customDots && height !== 'auto'
        ? typeof height === 'number'
          ? `${height + 24}px` // 이미지 높이 + 닷 영역 (8 + 16)
          : `calc(${height} + 24px)`
        : typeof height === 'number'
        ? `${height}px`
        : height,
  }

  const imageStyle: React.CSSProperties = {
    objectFit: imageObjectFit,
    ...(height !== 'auto' && { height: typeof height === 'number' ? `${height}px` : height }),
  }

  const handleImageClick = (item: ImageItem) => {
    item.onClick?.()
  }

  const renderSlideContent = (item: ImageItem, index: number) => {
    // 커스텀 렌더링이 제공되면 사용
    if (renderCustomContent) {
      return renderCustomContent(item, index)
    }

    // 기본 렌더링
    return (
      <div className={styles['slide-content']}>
        <div
          className={styles['image-container']}
          onClick={() => handleImageClick(item)}
          role={item.onClick ? 'button' : undefined}
          tabIndex={item.onClick ? 0 : undefined}
          onKeyDown={e => {
            if (item.onClick && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              item.onClick()
            }
          }}
        >
          <img
            src={item.src}
            alt={item.alt || `Slide ${index + 1}`}
            className={styles['slide-image']}
            style={imageStyle}
            loading={loading}
          />

          {(showTitle || showDescription) && (item.title || item.description) && (
            <div className={styles['slide-overlay']}>
              {showTitle && item.title && <h3 className={styles['slide-title']}>{item.title}</h3>}
              {showDescription && item.description && <p className={styles['slide-description']}>{item.description}</p>}
            </div>
          )}
        </div>
      </div>
    )
  }

  // 기본 커스텀 닷 렌더링
  const renderDefaultCustomDot = (index: number, isActive: boolean, onClick: () => void) => (
    <button
      key={index}
      className={`${styles['custom-dot']} ${isActive ? styles['custom-dot-active'] : ''}`}
      onClick={onClick}
      aria-label={`${index + 1}번째 슬라이드로 이동`}
    />
  )

  if (!images || images.length === 0) {
    return (
      <div className={`${styles['image-slider-empty']} ${className}`}>
        <p>표시할 이미지가 없습니다.</p>
      </div>
    )
  }

  return (
    <div
      className={`${styles['image-slider-container']} ${className} ${
        customDots ? styles['custom-dots-container'] : ''
      }`}
      style={containerStyle}
    >
      <Slider {...mergedSettings} className={styles['image-slider']} ref={sliderRef}>
        {normalizedImages.map((item, index) => (
          <div key={item.id} className={styles['slide-wrapper']}>
            {renderSlideContent(item, index)}
          </div>
        ))}
      </Slider>

      {/* 커스텀 닷 렌더링 */}
      {customDots && normalizedImages.length > 1 && (
        <div className={styles['custom-dots-wrapper']}>
          {normalizedImages.map((_, index) => {
            const isActive = index === currentSlide
            const onClick = () => handleDotClick(index)

            return renderCustomDot
              ? renderCustomDot(index, isActive, onClick)
              : renderDefaultCustomDot(index, isActive, onClick)
          })}
        </div>
      )}
    </div>
  )
}

export default ImageSlider
