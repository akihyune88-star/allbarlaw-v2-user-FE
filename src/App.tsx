import { Outlet } from 'react-router-dom'
import Header from './components/header/Header'
import BoxProgressBar from './components/boxProgressBar/BoxProgressBar'
import styles from '@/styles/app.module.scss'

const App = () => {
  return (
    <div className={styles.container}>
      <BoxProgressBar />
      <div className={styles['inner-container']}>
        <Header />
        <Outlet /> {/* 여기에 자식 라우트가 렌더링됩니다 */}
      </div>
    </div>
  )
}

export default App
