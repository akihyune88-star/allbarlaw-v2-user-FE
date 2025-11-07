import styles from './hero.module.scss'
import { RefObject } from 'react'
import { useFullpageScroll } from '@/hooks/useFullpageScroll'

type HeroProps = {
  nextSectionRef: RefObject<HTMLDivElement | null>
}

const Hero = ({ nextSectionRef }: HeroProps) => {
  const { sectionRef, opacity } = useFullpageScroll({
    nextSectionRef,
    threshold: 500,
    scrollTimeout: 1500,
  })

  return (
    <main ref={sectionRef} className={styles['hero']}>
      <section className={styles['hero-content']} style={{ opacity, transition: 'opacity 0.1s ease-out' }}>
        <div className={styles['hero-content-line']}>
          <span>누구나 법 앞에서</span>
          <figure className={styles['hero-image-container']}></figure>
          <span>평등할 수 있도록</span>
        </div>
        <div className={styles['hero-content-line']}>
          <span>정보의 격차가</span>
          <figure className={styles['hero-image-container']}></figure>
          <span>정의의 격차가 되지 않도록</span>
        </div>
      </section>
    </main>
  )
}

export default Hero
