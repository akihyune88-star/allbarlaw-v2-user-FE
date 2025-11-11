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
import { Helmet } from 'react-helmet-async'

const AboutAllbarlaw = () => {
  const secondSectionRef = useRef<HTMLDivElement>(null)
  const thirdSectionRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 901px)')

  return (
    <div className={styles['about-allbarlaw']}>
      <Helmet>
        <title>올바로 소개 – 나에게 꼭 필요한 올바른 법률정보</title>
        <meta
          name='description'
          content='올바로는 법률 영상, 법률 정보, 변호사 찾기, 지식인 등 다양한 법률 서비스를 제공합니다. 나에게 꼭 필요한 올바른 법률정보를 찾아보세요.'
        />
        <meta property='og:title' content='올바로 소개 – 나에게 꼭 필요한 올바른 법률정보' />
        <meta
          property='og:description'
          content='올바로는 법률 영상, 법률 정보, 변호사 찾기, 지식인 등 다양한 법률 서비스를 제공합니다.'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://www.allbarlaw.com/about' />
        <meta property='og:image' content='/og-img.png' />
        <link rel='canonical' href='https://www.allbarlaw.com/about' />
      </Helmet>
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
