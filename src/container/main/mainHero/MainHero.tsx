import guideImageSmall from '@/assets/imgs/guide-banner-s.webp'
import guideImageXSmall from '@/assets/imgs/guide-banner-xs.webp'
import styles from './main-hero.module.scss'
import AdSlider from './adSlider/AdSlider'
import PlayButton from '@/components/playButton/PlayButton'
import { COLOR } from '@/styles/color'

const MainHero = () => {
  return (
    <section className={styles['main-hero']}>
      <div className={styles['slider-container']}>
        <AdSlider ads={imageList} />
      </div>
      <figure className={styles['guide-banner']}>
        <img src={guideImageSmall} alt='main-hero-image' />
      </figure>
      <div className={styles['guide-banner-mobile']}>
        <div className={styles['guide-banner-mobile-left']}>
          <h4 className={styles['title']}>{`올바로 2.0\n쉽게 이용하는 방법`}</h4>
          <p className={styles['description']}>{`분류를 먼저 선택하고, \n원하는 모든 법률정보를 쉽게 찾기`}</p>
          <PlayButton iconColor={COLOR.text_black} />
        </div>
        <figure className={styles['guide-banner-mobile-right']}>
          <img src={guideImageXSmall} alt='main-hero-image' />
        </figure>
      </div>
    </section>
  )
}

export default MainHero

const imageList = [
  {
    id: 1,
    imageUrl: 'https://www.lawinsung.com/mobile/img/m_slide01.jpg',
    link: 'https://www.lawinsung.com/mobile/img/m_slide01.jpg',
  },
  {
    id: 2,
    imageUrl: 'https://www.mstoday.co.kr/news/photo/202309/85069_74095_575.png',
    link: 'https://www.mstoday.co.kr/news/photo/202309/85069_74095_575.png',
  },
]
