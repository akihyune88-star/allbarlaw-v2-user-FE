import Hero from '@/container/aboutAllbarlaw/hero/Hero'
import styles from './about-allbarlaw.module.scss'
import LegalCurationService from '@/container/aboutAllbarlaw/legalCurationService/LegalCurationService'
import LegalResourceHighlight from '@/container/aboutAllbarlaw/legalResourceHighlight/LegalResourceHighlight'
import BrandIdentity from '@/container/aboutAllbarlaw/brandIdentity/BrandIdentity'
import MobileHeader from '@/container/header/components/MobileHeader'
import AboutDesktopHeader from '@/container/aboutAllbarlaw/aboutDesktopHeader/AboutDesktopHeader'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useRef } from 'react'

const AboutAllbarlaw = () => {
  const secondSectionRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 80rem)')

  return (
    <div className={styles['about-allbarlaw']}>
      {isMobile ? <MobileHeader /> : <AboutDesktopHeader />}
      <Hero nextSectionRef={secondSectionRef} />
      <main className={styles['inner-container']}>
        <LegalCurationService ref={secondSectionRef} />
        <LegalResourceHighlight />
        <BrandIdentity />
      </main>
    </div>
  )
}

export default AboutAllbarlaw
