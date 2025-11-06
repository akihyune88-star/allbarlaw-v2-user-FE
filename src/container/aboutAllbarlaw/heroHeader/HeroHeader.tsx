import SvgIcon from '@/components/SvgIcon'
import styles from './heroHeader.module.scss'
import { ROUTER } from '@/routes/routerConstant'
import { useNavigate } from 'react-router-dom'
import { MouseEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import landingHero from '@/assets/imgs/landing-hero.webp'
import landingHeroMobile from '@/assets/imgs/landing-hero-mobile.webp'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const HeroHeader = () => {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const isMobile = useMediaQuery('(max-width: 80rem)')

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

  return (
    <>
      <section className={styles['hero-header']}>
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
              <>
                <a
                  href={ROUTER.LOGIN}
                  className={styles['hero-header-nav-list-item']}
                  onClick={e => handleAuthClick(e, ROUTER.AUTH)}
                >
                  로그인/회원가입
                </a>
              </>
            )}
          </nav>
        </header>
        <section></section>
      </section>
    </>
  )
}

export default HeroHeader
