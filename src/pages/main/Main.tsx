import styles from './main.module.scss'
import MainNavigation from '@/container/main/mainNavigation/MainNavigation'

const Main = () => {
  return (
    <div className={styles['main-container']}>
      <MainNavigation />
    </div>
  )
}

export default Main
