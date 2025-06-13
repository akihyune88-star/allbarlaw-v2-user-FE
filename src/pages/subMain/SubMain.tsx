import { Outlet, useNavigate, useParams } from 'react-router-dom'
import styles from '@/pages/subMain/sub-main.module.scss'
import CategoryTitle from '@/container/subMain/CategoryTitle'
import { SUB_MENU_LIST } from '@/constants/submainConstants'
import Tabs from '@/components/tabs/Tabs'

const SubMain = () => {
  const navigate = useNavigate()
  const { subcategoryId } = useParams<{ subcategoryId: string }>()

  const handleMenuClick = (path: string) => {
    navigate(`/${subcategoryId}/${path}`)
  }

  return (
    <div style={{ width: '100%' }}>
      <header className={styles['header-container']}>
        <CategoryTitle />
        <Tabs items={SUB_MENU_LIST} onChange={handleMenuClick} initialPath={subcategoryId} />
      </header>
      <main className={styles['main-container']}>
        <Outlet />
      </main>
    </div>
  )
}

export default SubMain
