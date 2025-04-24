import { Outlet } from 'react-router-dom'
import Header from './container/header/Header'
import BoxProgressBar from './components/boxProgressBar/BoxProgressBar'
import styles from '@/styles/app.module.scss'

const App = () => {
  return (
    <div className={styles.container}>
      <BoxProgressBar />
      <Header />
      <div className={styles['inner-container']}>
        <Outlet />
      </div>
    </div>
  )
}

export default App
