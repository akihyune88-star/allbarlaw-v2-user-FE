import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import styles from './adminLawyerDetail.module.scss'
import LawyerDetail from '@/pages/lawyer/lawyerDetail/LawyerDetail'

const AdminLawyerDetail = () => {
  return (
    <>
      <HeaderPortal>
        <div className={styles.header}>
          <h1 className={styles.header__title}>변호사 정보 상세</h1>
          <nav className={styles.header__button}>
            <button type='button' className={styles.header__button__item}>
              홈페이지에서 보기
            </button>
            <button type='button' className={styles.header__button__item}>
              변호사 정보 변경하기
            </button>
          </nav>
        </div>
      </HeaderPortal>
      <main className={styles.container}>
        <LawyerDetail />
      </main>
    </>
  )
}

export default AdminLawyerDetail
