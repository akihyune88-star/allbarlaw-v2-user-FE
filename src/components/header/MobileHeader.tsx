import styles from '@/components/header/header.module.scss'
import SvgIcon from '../SvgIcon'
import { useNavigate } from 'react-router-dom'

const MobileHeader = () => {
  const navigate = useNavigate()
  return (
    <header className={styles['mobile-container']}>
      <SvgIcon name='search' />
      <SvgIcon name='mobileLogo' onClick={() => navigate('/')} />
      <button>
        <span>로그인/가입</span>
      </button>
    </header>
  )
}

export default MobileHeader
