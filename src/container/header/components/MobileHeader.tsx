import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import styles from '@/container/header/header.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { useAuth } from '@/contexts/AuthContext'

const MobileHeader = () => {
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuth()

  const handleLogout = () => {
    logout()
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
