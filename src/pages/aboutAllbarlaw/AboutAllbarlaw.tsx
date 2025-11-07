import Hero from '@/container/aboutAllbarlaw/hero/Hero'
import styles from './about-allbarlaw.module.scss'
import LegalCurationService from '@/container/aboutAllbarlaw/legalCurationService/LegalCurationService'
import LegalResourceHighlight from '@/container/aboutAllbarlaw/legalResourceHighlight/LegalResourceHighlight'
import BrandIdentity from '@/container/aboutAllbarlaw/brandIdentity/BrandIdentity'
import MobileHeader from '@/container/header/components/MobileHeader'
import AboutDesktopHeader from '@/container/aboutAllbarlaw/aboutDesktopHeader/AboutDesktopHeader'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useRef } from 'react'
import AboutGoal from '@/container/aboutAllbarlaw/aboutGoal/AboutGoal'

const AboutAllbarlaw = () => {
  const secondSectionRef = useRef<HTMLDivElement>(null)
  const thirdSectionRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 37.5rem)')

  return (
    <div className={styles['about-allbarlaw']}>
      {isMobile ? <MobileHeader /> : <AboutDesktopHeader />}
      <main className={styles['inner-container']}>
        <Hero nextSectionRef={secondSectionRef} />
        <AboutGoal ref={secondSectionRef} />
        <LegalCurationService ref={thirdSectionRef} />
        <LegalResourceHighlight />
        <BrandIdentity />
      </main>
    </div>
  )
}

export default AboutAllbarlaw
