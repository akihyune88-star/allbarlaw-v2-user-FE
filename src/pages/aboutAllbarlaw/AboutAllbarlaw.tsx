import styles from './about-allbarlaw.module.scss'
import landingImage from '@/assets/imgs/landing-hero.webp'
import landingImageMobile from '@/assets/imgs/landing-hero-mobile.webp'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const AboutAllbarlaw = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return (
    <div className={styles['container']}>
      <header className={styles['landing-hero']}>
        <figure>
          <img
            src={isMobile ? landingImageMobile : landingImage}
            alt='allbarlaw'
            className={styles['landing-hero-image']}
          />
        </figure>
      </header>
    </div>
  )
}

export default AboutAllbarlaw
