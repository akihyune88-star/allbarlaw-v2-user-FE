// import styles from './multiple-image-slider.module.scss'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styles from './multiple-image-slider.module.scss'
import SvgIcon from '../SvgIcon'
import { CSSProperties, useEffect } from 'react'

type MultipleImageSliderProps = {
  imageList: string[]
  slidesToShow?: number
  slidesToScroll?: number
  imgHeight?: number
  dots?: boolean
  arrow?: boolean
  width?: number | string // 슬라이더 너비 prop 추가
  infinite?: boolean
}

interface CustomArrowProps {
  className?: string
  style?: CSSProperties
  onClick?: () => void
  type?: 'next' | 'prev'
}

const Arrow = ({ className, onClick, type }: CustomArrowProps) => (
  <div
    className={`${className} ${styles['nav-button']} ${styles[`nav-button-${type}`]}`}
    onClick={onClick}
    style={{ display: 'block', right: '0px', zIndex: 1 }}
  >
    <SvgIcon name='slickArrow' size={16} style={{ transform: type === 'prev' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
  </div>
)

const MultipleImageSlider = ({
  imageList,
  slidesToShow = 3,
  slidesToScroll = 1,
  imgHeight = 108,
  dots = false,
  arrow = true,
  infinite = false,
  width = '100%', // 기본값 설정
}: MultipleImageSliderProps) => {
  // 슬라이더 설정
  const settings = {
    className: 'slider variable-width',
    variableWidth: true,
    dots: dots,
    infinite: infinite,
    slidesToShow: slidesToShow ? slidesToShow : 1,
    slidesToScroll: slidesToScroll,
    arrows: arrow,
    nextArrow: <Arrow type='next' />,
    prevArrow: <Arrow type='prev' />,
    swipeToSlide: true,
    centerMode: false,
    adaptiveHeight: false,
  }

  // 슬라이더 스타일
  const sliderStyle: CSSProperties = {
    width: width,
  }

  // 동적으로 CSS 변수 설정
  useEffect(() => {
    document.documentElement.style.setProperty('--slide-height', `${imgHeight}px`)
  }, [imgHeight])

  return (
    <div className={styles.sliderWrapper} style={sliderStyle}>
      <Slider {...settings}>
        {imageList.map((img, index) => (
          <div key={index} className={styles.slideItem} style={{ height: `${imgHeight}px` }}>
            <figure style={{ height: `${imgHeight}px` }}>
              <img src={img} alt='lawfirm' className={styles['img-item']} style={{ height: `${imgHeight}px` }} />
            </figure>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default MultipleImageSlider
