import { Outlet } from 'react-router-dom'
import styles from '@/pages/subMain/sub-main.module.scss'
import SubMenuNavigation from '@/container/subMain/SubMenuNavigation'
import CategoryTitle from '@/container/subMain/CategoryTitle'

const SubMain = () => {
  return (
    <div style={{ width: '100%' }}>
      <header className={styles['header-container']}>
        <CategoryTitle />
        <SubMenuNavigation />
      </header>
      <main className={styles['main-container']}>
        <Outlet />
      </main>
    </div>
  )
}

export default SubMain
