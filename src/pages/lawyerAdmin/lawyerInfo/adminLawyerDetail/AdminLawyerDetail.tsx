import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import styles from './adminLawyerDetail.module.scss'
import LawyerDetail from '@/pages/lawyer/lawyerDetail/LawyerDetail'
import { useLawyerDetailForMe } from '@/hooks/queries/useLawyer'

const AdminLawyerDetail = () => {
  // 로그인한 변호사 본인의 정보 조회
  const { data: lawyerDetailForMe } = useLawyerDetailForMe()

  const lawyerName = lawyerDetailForMe?.lawyerName || ''

  const handleGoToUserPage = () => {
    window.open(`https://v2.allbarlaw.com/search/lawyer/${lawyerDetailForMe?.lawyerId}`, '_blank')
  }

  return (
    <>
      <HeaderPortal>
        <div className={styles.header}>
          <h1 className={styles.header__title}>{lawyerName} 변호사 정보 상세</h1>
          <nav className={styles.header__button}>
            <button type='button' className={styles.header__button__item} onClick={handleGoToUserPage}>
              홈페이지에서 보기
            </button>
            <button type='button' className={styles.header__button__item}>
              변호사 정보 변경하기
            </button>
          </nav>
        </div>
      </HeaderPortal>
      <main className={styles.container}>
        <LawyerDetail detailData={lawyerDetailForMe} />
      </main>
    </>
  )
}

export default AdminLawyerDetail
