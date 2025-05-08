// import styles from './multiple-image-slider.module.scss'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styles from './multiple-image-slider.module.scss'
import SvgIcon from '../SvgIcon'
import { CSSProperties } from 'react'

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
  slidesToShow = 5,
  slidesToScroll = 1,
  imgHeight = 108,
  dots = false,
  arrow = true,
  infinite = false,
  width = '100%', // 기본값 설정
}: MultipleImageSliderProps) => {
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

  // 슬라이더에 직접 너비 적용
  const sliderStyle: CSSProperties = {
    width: width,
  }

  return (
    <div className={styles.sliderWrapper} style={sliderStyle}>
      <Slider {...settings}>
        {imageList.map((img, index) => (
          <div key={index} className={styles.slideItem}>
            <img src={img} alt='lawfirm' className={styles['img-item']} style={{ height: `${imgHeight}px` }} />
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default MultipleImageSlider
