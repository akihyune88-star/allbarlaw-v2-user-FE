import LawyerAdminHeader from '@/container/lawyerAdmin/lawyerAdminHeader/LawyerAdminHeader'
import styles from '@/styles/app.module.scss'

const LawyerAdmin = () => {
  return (
    <div className={styles.container}>
      <LawyerAdminHeader />
      <div className={styles['inner-container']}></div>
    </div>
  )
}

export default LawyerAdmin
