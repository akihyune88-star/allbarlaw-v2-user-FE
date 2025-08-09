import AIRecommender, { LawyerItem } from '@/components/aiRecommender/AIRecommender'
import LawyerVertical from '@/components/lawyer/LawyerVertical'
import styles from './blog-detail-sidebar.module.scss'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import { useRecommendationLegalTerm } from '@/hooks/queries/useRecommendation'
import { useNavigate } from 'react-router-dom'

type BlogDetailSideBarProps = {
  showLoading: boolean
  blogCaseId: number
  lawyer: {
    lawyerId: number
    name: string
    lawfirm: string
    profileImage: string
  }
  recommendLawyerList: {
    lawyerId: number
    lawyerName: string
    lawfirmName: string
    lawyerProfileImage: string
  }[]
}

const BlogDetailSideBar = ({ blogCaseId, showLoading, lawyer, recommendLawyerList }: BlogDetailSideBarProps) => {
  const navigate = useNavigate()
  const { data: recommendationLegalTerm } = useRecommendationLegalTerm({
    blogCaseIds: [blogCaseId],
  })

  const handleLawyerClick = (lawyerId: number) => {
    navigate(`/search/lawyer/${lawyerId}`)
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
                <button>바로 톡</button>
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
            <LawyerItem lawyerList={recommendLawyerList} divider />
          </div>

          <LegalTermWidget lagalTermList={recommendationLegalTerm ?? []} />
        </div>
      )}
    </aside>
  )
}

export default BlogDetailSideBar
