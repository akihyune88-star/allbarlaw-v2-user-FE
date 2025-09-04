import HeroHeader from '@/container/aboutAllbarlaw/heroHeader/HeroHeader'
import styles from './about-allbarlaw.module.scss'
import LegalCurationService from '@/container/aboutAllbarlaw/legalCurationService/LegalCurationService'
import LegalResourceHighlight from '@/container/aboutAllbarlaw/legalResourceHighlight/LegalResourceHighlight'
import BrandIdentity from '@/container/aboutAllbarlaw/brandIdentity/BrandIdentity'

const AboutAllbarlaw = () => {
  return (
    <div className={styles['about-allbarlaw']}>
      <HeroHeader />
      <main className={styles['inner-container']}>
        <LegalCurationService />
        <LegalResourceHighlight />
        <BrandIdentity />
      </main>
    </div>
  )
}

export default AboutAllbarlaw
