import AIRecommender from '@/components/aiRecommender/AIRecommender'
import LawyerVertical from '@/components/lawyer/LawyerVertical'
import styles from './blog-detail-sidebar.module.scss'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import { useNavigate } from 'react-router-dom'
import { RecommendationLegalTerm } from '@/types/recommendationTypes'
import { LOCAL } from '@/constants/local'
import { ROUTER } from '@/routes/routerConstant'

type BlogDetailSideBarProps = {
  showLoading: boolean
  blogCaseId: number
  lawyer: {
    lawyerId: number
    name: string
    lawfirm: string
    profileImage: string
  }
  recommendationLegalTerm: RecommendationLegalTerm[] | undefined
}

const BlogDetailSideBar = ({ showLoading, lawyer, recommendationLegalTerm }: BlogDetailSideBarProps) => {
  const navigate = useNavigate()

  const handleLawyerClick = (lawyerId: number) => {
    navigate(`/search/lawyer/${lawyerId}`)
  }

  const handleBaroTalk = (lawyerId: number) => {
    sessionStorage.setItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString())
    navigate(ROUTER.REQUEST_BARO_TALK)
  }

  return (
    <aside className={styles['blog-detail-sidebar']}>
      <div className={styles['sidebar-desktop-wrapper']}>
        <section className={styles['lawyer-section']}>
          <LawyerVertical
            lawyerId={lawyer.lawyerId}
            name={lawyer.name}
            lawfirm={lawyer.lawfirm}
            profileImage={lawyer.profileImage}
            type={3}
            footer={
              <div className={styles['lawyer-vertical-footer']}>
                <button onClick={() => handleLawyerClick(lawyer.lawyerId)}>변호사 정보</button>
                <button onClick={() => handleBaroTalk(lawyer.lawyerId)}>바로 톡</button>
              </div>
            }
          />
        </section>
        {showLoading ? (
          <div />
        ) : (
          <section className={styles['recommend-section']}>
            <AIRecommender />
            <div style={{ height: 16 }} />
            <LegalTermWidget lagalTermList={recommendationLegalTerm ?? []} />
          </section>
        )}
      </div>

      {!showLoading && (
        <div className={styles['sidebar-mobile-wrapper']}>
          <div className={styles['lawyer-section']}>
            {/* <LawyerItem lawyerList={recommendLawyerList} divider /> */}
          </div>

          <LegalTermWidget lagalTermList={recommendationLegalTerm ?? []} />
        </div>
      )}
    </aside>
  )
}

export default BlogDetailSideBar
