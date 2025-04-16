import { Outlet } from 'react-router-dom'
import styles from '@/pages/subMain/sub-main.module.scss'
import SubMenuNavigation from '@/container/subMain/SubMenuNavigation'
const SubMain = () => {
  return (
    <div style={{ width: '100%' }}>
      <div className={styles['header-container']}>
        <h1>타이틀</h1>
        <SubMenuNavigation />
      </div>
      <Outlet />
    </div>
  )
}

export default SubMain
