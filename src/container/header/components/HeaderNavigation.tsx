import styles from '@/container/header/header.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { MENU_LIST } from '@/constants/topMenu'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import { LOCAL } from '@/constants/local'
import { useEffect, useState } from 'react'

const HeaderNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkLoginStatus = () => {
      const hasToken = !!(localStorage.getItem(LOCAL.TOKEN) || sessionStorage.getItem(LOCAL.TOKEN))
      console.log('localStorage', localStorage.getItem(LOCAL.TOKEN))
      console.log('sessionStorage', sessionStorage.getItem(LOCAL.TOKEN))
      console.log('hasToken', hasToken)
      setIsLoggedIn(hasToken)
    }

    console.log('isLoggedIn', isLoggedIn)
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
  }, [location.pathname]) // 페이지 변경될 때마다 체크

  const handleLogout = () => {
    localStorage.removeItem(LOCAL.TOKEN)
    sessionStorage.removeItem(LOCAL.TOKEN)
    setIsLoggedIn(false)
    navigate(ROUTER.MAIN)
  }

  // 로그인 상태에 따라 메뉴 필터링
  const filteredMenuList = MENU_LIST.filter(item => {
    // 로그인 상태일 때는 로그인 버튼을 숨기고 마이페이지를 보여줌
    if (isLoggedIn) {
      return item.name !== '로그인'
    }
    // 로그아웃 상태일 때는 마이페이지를 숨기고 로그인 버튼을 보여줌
    return item.name !== '마이페이지'
  })

  return (
    <div className={styles['navigation-container']}>
      <div className={styles['category']}>
        <SvgIcon name='menu' />
        <span>카테고리</span>
      </div>
      <div className={styles['header-menu-list']}>
        {filteredMenuList.map(item => (
          <button key={item.name} className={styles['menu-item']} onClick={() => navigate(item.path)}>
            {item.name === '바로톡' && (
              <div className={styles['speech-bubble']}>
                <span>변호사랑 바로상담하기</span>
              </div>
            )}
            <span>{item.name}</span>
          </button>
        ))}
        {isLoggedIn && (
          <button className={styles['menu-item']} onClick={handleLogout}>
            <span>로그아웃</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default HeaderNavigation
