import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import styles from '@/container/header/header.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { LOCAL } from '@/constants/local'
import { useEffect, useState } from 'react'

const MobileHeader = () => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkLoginStatus = () => {
      const hasToken = !!(localStorage.getItem(LOCAL.TOKEN) || sessionStorage.getItem(LOCAL.TOKEN))
      setIsLoggedIn(hasToken)
    }

    // 초기 체크
    checkLoginStatus()

    // storage 이벤트 리스너 등록
    const handleStorageChange = () => {
      checkLoginStatus()
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem(LOCAL.TOKEN)
    sessionStorage.removeItem(LOCAL.TOKEN)
    setIsLoggedIn(false)
    navigate(ROUTER.MAIN)
  }

  return (
    <header className={styles['mobile-container']}>
      <div>
        <SvgIcon name='totalMenu' onClick={() => navigate(ROUTER.MOBILE_MENU_LIST)} />
        <SvgIcon name='mobileLogo' onClick={() => navigate(ROUTER.MAIN)} />
      </div>
      <div>
        {isLoggedIn ? (
          <button onClick={handleLogout}>
            <span>로그아웃</span>
          </button>
        ) : (
          <button onClick={() => navigate(ROUTER.AUTH)}>
            <span>로그인</span> | <span>회원가입</span>
          </button>
        )}
        <SvgIcon name='search' onClick={() => navigate(ROUTER.SEARCH_MAIN)} />
      </div>
    </header>
  )
}

export default MobileHeader
