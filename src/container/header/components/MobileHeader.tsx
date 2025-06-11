import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import styles from '@/container/header/header.module.scss'
import SvgIcon from '@/components/SvgIcon'

const MobileHeader = () => {
  const navigate = useNavigate()
  return (
    <header className={styles['mobile-container']}>
      <div>
        <SvgIcon name='totalMenu' onClick={() => navigate(ROUTER.MOBILE_MENU_LIST)} />
        <SvgIcon name='mobileLogo' onClick={() => navigate(ROUTER.MAIN)} />
      </div>
      <div>
        <button onClick={() => navigate(ROUTER.LOGIN)}>
          <span>로그인</span> | <span>회원가입</span>
        </button>
        <SvgIcon name='search' onClick={() => navigate(ROUTER.MAIN)} />
      </div>
    </header>
  )
}

export default MobileHeader
