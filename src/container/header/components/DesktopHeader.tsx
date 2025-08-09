import { useNavigate } from 'react-router-dom'
import styles from '@/container/header/header.module.scss'
import SvgIcon from '../../../components/SvgIcon'
import SearchInput from '../../../components/searchInput/SearchInput'
import { ROUTER } from '@/routes/routerConstant'
import HeaderNavigation from './HeaderNavigation'

const DesktopHeader = () => {
  const navigate = useNavigate()

  return (
    <header className={styles['desktop-container']}>
      <div className={styles['inner-container']}>
        <div className={styles['header-top']}>
          <SvgIcon name='pcLogoHorizon' className={styles['header-logo']} onClick={() => navigate(ROUTER.MAIN)} />
          <div className={styles['search-form']}>
            <SearchInput />
          </div>
        </div>
        <HeaderNavigation />
      </div>
    </header>
  )
}

export default DesktopHeader
