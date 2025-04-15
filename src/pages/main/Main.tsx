import MobileSearch from '@/container/main/mobileSearch/MobileSearch'
import styles from './main.module.scss'
import MainNavigation from '@/container/main/mainNavigation/MainNavigation'

const Main = () => {
  return (
    <div className={styles['main-container']}>
      <MobileSearch />
      <MainNavigation />
    </div>
  )
}

export default Main
