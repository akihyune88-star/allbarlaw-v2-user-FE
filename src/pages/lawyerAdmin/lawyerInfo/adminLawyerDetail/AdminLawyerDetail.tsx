import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import styles from './adminLawyerDetail.module.scss'
import LawyerDetail from '@/pages/lawyer/lawyerDetail/LawyerDetail'

const AdminLawyerDetail = () => {
  return (
    <>
      <HeaderPortal>
        <h2>변호사 정보 상세</h2>
      </HeaderPortal>
      <div className={styles.container}>
        <LawyerDetail />
      </div>
    </>
  )
}

export default AdminLawyerDetail
