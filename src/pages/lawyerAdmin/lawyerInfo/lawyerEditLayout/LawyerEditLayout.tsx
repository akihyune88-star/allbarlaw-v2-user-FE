import Tabs from '@/components/tabs/Tabs'
import { ROUTER } from '@/routes/routerConstant'
import { Outlet } from 'react-router-dom'
import styles from './lawyerEditLayout.module.scss'

const SEARCH_TAB_LIST = [
  { name: '변호사 기본정보', itemWidth: 114, path: ROUTER.LAWYER_ADMIN_LAWYER_EDIT_BASIC_INFO },
  { name: '업적관리', itemWidth: 84, path: ROUTER.LAWYER_ADMIN_LAWYER_EDIT_BASIC_INFO },
  { name: '이력사항', itemWidth: 84, path: ROUTER.LAWYER_ADMIN_LAWYER_EDIT_BASIC_INFO },
  { name: '활동사항', itemWidth: 84, path: ROUTER.LAWYER_ADMIN_LAWYER_EDIT_BASIC_INFO },
]

const LawyerEditLayout = () => {
  return (
    <div className={styles['lawyer-edit-layout']}>
      <header className={styles['lawyer-edit-layout__header']}>
        <Tabs items={SEARCH_TAB_LIST} className={styles['lawyer-edit-layout__header__tabs']} />
      </header>
      <Outlet />
    </div>
  )
}

export default LawyerEditLayout
