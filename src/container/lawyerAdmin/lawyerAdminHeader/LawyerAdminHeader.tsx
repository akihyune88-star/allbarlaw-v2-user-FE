import styles from './lawyerAdminHeader.module.scss'
import { lawyerAdminLogo } from '@/assets/imgs'
import { useEffect, useState } from 'react'

const LawyerAdminHeader = () => {
  const [portalId, setPortalId] = useState<string>('')

  useEffect(() => {
    const id = 'lawyer-admin-header-portal'
    setPortalId(id)
  }, [])

  return (
    <header className={styles['lawyer-admin-header']}>
      <div className={styles['lawyer-admin-header-inner']}>
        <img src={lawyerAdminLogo} alt='lawyer-admin-logo' className={styles['lawyer-admin-header-inner-logo']} />
        <div id={portalId} className={styles['lawyer-admin-header-portal']} />
      </div>
    </header>
  )
}

export default LawyerAdminHeader
