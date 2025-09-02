import HeroHeader from '@/container/aboutAllbarlaw/heroHeader/HeroHeader'
import styles from './about-allbarlaw.module.scss'

const AboutAllbarlaw = () => {
  return (
    <div className={styles['about-allbarlaw']}>
      <HeroHeader />
      <main className={styles['inner-container']}></main>
    </div>
  )
}

export default AboutAllbarlaw
