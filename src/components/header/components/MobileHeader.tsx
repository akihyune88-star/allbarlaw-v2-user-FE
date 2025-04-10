import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import styles from '@/components/header/header.module.scss'
import SvgIcon from '@/components/SvgIcon'

const MobileHeader = () => {
  const navigate = useNavigate()
  return (
    <header className={styles['mobile-container']}>
      <SvgIcon name='search' />
      <SvgIcon name='mobileLogo' onClick={() => navigate(ROUTER.MAIN)} />
      <button onClick={() => navigate(ROUTER.LOGIN)}>
        <span>로그인/가입</span>
      </button>
    </header>
  )
}

export default MobileHeader
