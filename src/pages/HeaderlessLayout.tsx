import { Outlet } from 'react-router-dom'
import BottomNavigation from '@/components/bottomNavigation/BottomNavigation'
import ScrollToTop from '@/components/ScrollToTop'
import styles from '@/styles/app.module.scss'

const HeaderlessLayout = () => {
  return (
    <div className={styles.container}>
      <ScrollToTop />
      <div className={styles['inner-container']}>
        <Outlet />
      </div>
      <BottomNavigation />
    </div>
  )
}

export default HeaderlessLayout
