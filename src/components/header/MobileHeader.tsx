import styles from '@/components/header/header.module.scss'
import SvgIcon from '../SvgIcon'

const MobileHeader = () => {
  return (
    <div className={styles['mobile-container']}>
      <SvgIcon name='search' />
      <SvgIcon name='mobileLogo' />
      <button>
        <span>로그인/가입</span>
      </button>
    </div>
  )
}

export default MobileHeader
