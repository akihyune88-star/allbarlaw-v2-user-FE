import SvgIcon from '@/components/SvgIcon'
import styles from './aboutDesktopHeader.module.scss'
import { ROUTER } from '@/routes/routerConstant'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState, useRef, MouseEvent } from 'react'

const AboutDesktopHeader = () => {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // 스크롤 방향 감지
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // 아래로 스크롤 중 & 50px 이상 스크롤됨 -> 헤더 숨김
        setIsHeaderVisible(false)
      } else if (currentScrollY < lastScrollY.current) {
        // 위로 스크롤 중 -> 헤더 표시
        setIsHeaderVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

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
    <header
      className={styles['about-desktop-header']}
      style={{
        transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <SvgIcon name='pcLogoLanding' />
      <nav className={styles['about-desktop-header-nav']}>
        {linkList.map(item => (
          <a
            key={item.name}
            href={item.href}
            className={styles['about-desktop-header-nav-item']}
            onClick={e => handleNavClick(e, item.href)}
          >
            {item.name}
          </a>
        ))}

        {isLoggedIn ? (
          <a
            href={ROUTER.MYPAGE}
            className={styles['about-desktop-header-nav-item']}
            onClick={e => handleAuthClick(e, ROUTER.MYPAGE)}
          >
            마이페이지
          </a>
        ) : (
          <a
            href={ROUTER.LOGIN}
            className={styles['about-desktop-header-nav-item']}
            onClick={e => handleAuthClick(e, ROUTER.AUTH)}
          >
            로그인/회원가입
          </a>
        )}
      </nav>
    </header>
  )
}

export default AboutDesktopHeader
