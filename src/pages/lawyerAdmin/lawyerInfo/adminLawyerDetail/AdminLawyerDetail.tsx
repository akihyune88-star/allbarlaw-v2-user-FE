import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import styles from './adminLawyerDetail.module.scss'
import LawyerDetail from '@/pages/lawyer/lawyerDetail/LawyerDetail'
import { useLawyerDetailForMe } from '@/hooks/queries/useLawyer'
import { ROUTER } from '@/routes/routerConstant'
import { useNavigate } from 'react-router-dom'

const AdminLawyerDetail = () => {
  // 로그인한 변호사 본인의 정보 조회
  const navigate = useNavigate()
  const { data: lawyerDetailForMe } = useLawyerDetailForMe()

  const lawyerName = lawyerDetailForMe?.lawyerName || ''

  const handleGoToUserPage = () => {
    window.open(`https://allbarlaw.com/search/lawyer/${lawyerDetailForMe?.lawyerId}`, '_blank')
  }

  const handleGoToEditPage = () => {
    navigate(ROUTER.LAWYER_ADMIN_LAWYER_EDIT)
  }

  return (
    <>
      <HeaderPortal>
        <div className={styles.header}>
          <h1 className={styles.header__title}>{lawyerName} 변호사의 정보입니다.</h1>
          <nav className={styles.header__button}>
            <button type='button' className={styles.header__button__item} onClick={handleGoToUserPage}>
              홈페이지에서 보기
            </button>
            <button type='button' className={styles.header__button__item} onClick={handleGoToEditPage}>
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
