import styles from '@/container/header/header.module.scss'
import SearchInput from '../../../components/searchInput/SearchInput'
import HeaderNavigation from './HeaderNavigation'

const DesktopHeader = () => {
  return (
    <header className={styles['desktop-container']}>
      <div className={styles['inner-container']}>
        <div className={styles['header-top']}>
          <SearchInput className={styles['search-form']} />
        </div>
        <HeaderNavigation />
      </div>
    </header>
  )
}

export default DesktopHeader
