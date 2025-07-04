import { Outlet } from 'react-router-dom'
import Header from './container/header/Header'
import BoxProgressBar from './components/boxProgressBar/BoxProgressBar'
import styles from '@/styles/app.module.scss'
import BottomNavigation from './components/bottomNavigation/BottomNavigation'
import { AuthProvider } from './contexts/AuthContext'

const App = () => {
  return (
    <AuthProvider>
      <div className={styles.container}>
        <BoxProgressBar />
        <Header />
        <div className={styles['inner-container']}>
          <Outlet />
        </div>
        <BottomNavigation />
      </div>
    </AuthProvider>
  )
}

export default App
