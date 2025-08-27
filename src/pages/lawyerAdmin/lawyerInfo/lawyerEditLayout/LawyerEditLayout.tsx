import Tabs from '@/components/tabs/Tabs'
import { ROUTER } from '@/routes/routerConstant'
import { Outlet, useNavigate } from 'react-router-dom'
import styles from './lawyerEditLayout.module.scss'

const SEARCH_TAB_LIST = [
  { name: '변호사 기본정보', itemWidth: 114, path: ROUTER.LAWYER_ADMIN_LAWYER_EDIT_BASIC_INFO },
  { name: '이력사항', itemWidth: 84, path: ROUTER.LAWYER_ADMIN_LAWYER_EDIT_CAREER },
  { name: '활동사항', itemWidth: 84, path: ROUTER.LAWYER_ADMIN_LAWYER_EDIT_ACTIVITY },
]

const LawyerEditLayout = () => {
  const navigate = useNavigate()

  const handleTabChange = (path: string) => {
    navigate(path)
  }

  return (
    <div className={styles['lawyer-edit-layout']}>
      <header className={styles['lawyer-edit-layout__header']}>
        <Tabs
          items={SEARCH_TAB_LIST}
          onChange={handleTabChange}
          className={styles['lawyer-edit-layout__header__tabs']}
        />
      </header>
      <Outlet />
    </div>
  )
}

export default LawyerEditLayout
