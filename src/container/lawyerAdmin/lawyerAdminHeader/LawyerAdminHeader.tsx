import styles from './lawyerAdminHeader.module.scss'
import { lawyerAdminLogo } from '@/assets/imgs'

const LawyerAdminHeader = () => {
  return (
    <header className={styles['lawyer-admin-header']}>
      <div className={styles['lawyer-admin-header-inner']}>
        <img src={lawyerAdminLogo} alt='lawyer-admin-logo' className={styles['lawyer-admin-header-inner-logo']} />
      </div>
    </header>
  )
}

export default LawyerAdminHeader
