import HeroWithGoal from '@/container/aboutAllbarlaw/heroWithGoal/HeroWithGoal'
import styles from './about-allbarlaw.module.scss'
import LegalCurationService from '@/container/aboutAllbarlaw/legalCurationService/LegalCurationService'
import LegalResourceHighlight from '@/container/aboutAllbarlaw/legalResourceHighlight/LegalResourceHighlight'
import BrandIdentity from '@/container/aboutAllbarlaw/brandIdentity/BrandIdentity'
import MobileHeader from '@/container/header/components/MobileHeader'
import AboutDesktopHeader from '@/container/aboutAllbarlaw/aboutDesktopHeader/AboutDesktopHeader'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import Footer from '@/components/footer/Footer'
import UsageBannder from '@/container/aboutAllbarlaw/usageBanner/UsageBannder'
import UserAboutFaqList from '@/container/aboutAllbarlaw/userAboutFaqList/UserAboutFaqList'

const AboutAllbarlaw = () => {
  const thirdSectionRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 901px)')

  return (
    <>
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
          <HeroWithGoal nextSectionRef={thirdSectionRef} />
          <LegalCurationService ref={thirdSectionRef} />
          <LegalResourceHighlight />
          <BrandIdentity />
          <UserAboutFaqList />
          <UsageBannder />

          <Footer style={{ width: '100%' }} />
        </main>
      </div>
    </>
  )
}

export default AboutAllbarlaw
