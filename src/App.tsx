import { Outlet } from 'react-router-dom'
import Header from './container/header/Header'
import styles from '@/styles/app.module.scss'
import BottomNavigation from './components/bottomNavigation/BottomNavigation'
import ScrollToTop from './components/ScrollToTop'

const App = () => {
  return (
    <div className={styles.container}>
      <ScrollToTop />
      <Header />
      <div className={styles['inner-container']}>
        <Outlet />
      </div>
      <BottomNavigation />
    </div>
  )
}

export default App
