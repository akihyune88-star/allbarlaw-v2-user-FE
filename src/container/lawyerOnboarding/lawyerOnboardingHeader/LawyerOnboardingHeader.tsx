import SvgIcon from '@/components/SvgIcon'
import styles from './lawyerOnboardingHeader.module.scss'
import { ROUTER } from '@/routes/routerConstant'
import { useNavigate } from 'react-router-dom'
import React, { MouseEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import lawyerOnboardingHero from '@/assets/imgs/lawyer-onboarding-hero.webp'
import MobileHeader from '@/container/header/components/MobileHeader'
import BottomNavigation from '@/components/bottomNavigation/BottomNavigation'

const LawyerOnboardingHeader = () => {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const linkList = [
    {
      name: '바로톡',
      href: ROUTER.REQUEST_BARO_TALK,
    },
    {
      name: '법률사전',
      href: ROUTER.LEGAL_DICTIONARY,
    },
    {
      name: '올바로 소개',
      href: ROUTER.ABOUT,
    },
  ]

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    navigate(href)
  }

  const handleAuthClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    navigate(href)
  }

  const handleSignup = () => navigate(`${ROUTER.AUTH}/${ROUTER.LAWYER_SIGNUP_FORM}`)

  return (
    <>
      {/* 모바일 헤더 */}
      <header className={styles['hero-header-nav-mobile']}>
        <MobileHeader />
      </header>
      <section
        className={styles['hero-header']}
        style={{ '--hero-bg-image': `url(${lawyerOnboardingHero})` } as React.CSSProperties}
      >
        {/* 데스크톱 헤더 */}
        <header className={styles['hero-header-nav']}>
          <SvgIcon name='pcLogoLanding' />
          <nav className={styles['hero-header-nav-list']}>
            {linkList.map(item => (
              <a
                key={item.name}
                href={item.href}
                className={styles['hero-header-nav-list-item']}
                onClick={e => handleNavClick(e, item.href)}
              >
                {item.name}
              </a>
            ))}

            {/* 로그인 상태에 따른 조건부 렌더링 */}
            {isLoggedIn ? (
              <a
                href={ROUTER.MYPAGE}
                className={styles['hero-header-nav-list-item']}
                onClick={e => handleAuthClick(e, ROUTER.MYPAGE)}
              >
                마이페이지
              </a>
            ) : (
              <a
                href={ROUTER.LOGIN}
                className={styles['hero-header-nav-list-item']}
                onClick={e => handleAuthClick(e, ROUTER.AUTH)}
              >
                로그인/회원가입
              </a>
            )}
          </nav>
        </header>

        <div className={styles['hero-header-content']}>
          <h1 className={styles['hero-header-content-title']}>
            더 많은 의뢰인, 더 큰 가능성.
            <br />
            올바로가 열어드립니다.
          </h1>
          <button type='button' onClick={handleSignup}>
            무료 변호사 회원가입
          </button>
        </div>
      </section>
      <BottomNavigation />
    </>
  )
}

export default LawyerOnboardingHeader
