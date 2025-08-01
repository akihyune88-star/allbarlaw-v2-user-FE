import AIRecommender, { LawyerItem } from '@/components/aiRecommender/AIRecommender'
import LawyerVertical from '@/components/lawyer/LawyerVertical'
import styles from './blog-detail-sidebar.module.scss'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'

type BlogDetailSideBarProps = {
  showLoading: boolean
  lawyer: {
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

const BlogDetailSideBar = ({ showLoading, lawyer, recommendLawyerList }: BlogDetailSideBarProps) => {
  return (
    <aside className={styles['blog-detail-sidebar']}>
      <div className={styles['sidebar-desktop-wrapper']}>
        <section className={styles['lawyer-section']}>
          <LawyerVertical
            name={lawyer.name}
            lawfirm={lawyer.lawfirm}
            profileImage={lawyer.profileImage}
            type={3}
            footer={
              <div className={styles['lawyer-vertical-footer']}>
                <button>변호사 정보</button>
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
            <LegalTermWidget
              lagalTermList={[
                '사기죄 [詐欺罪]',
                '업무방해죄 [業務妨害罪]',
                '절도죄 [窃盜罪]',
                '법정대리인 [法定代理人]',
                '위법성 조각사유 [違法性 阻却事由]',
              ]}
            />
          </section>
        )}
      </div>

      {!showLoading && (
        <div className={styles['sidebar-mobile-wrapper']}>
          <div className={styles['lawyer-section']}>
            <LawyerItem lawyerList={recommendLawyerList} divider />
          </div>

          <LegalTermWidget
            lagalTermList={[
              '사기죄 [詐欺罪]',
              '업무방해죄 [業務妨害罪]',
              '절도죄 [窃盜罪]',
              '법정대리인 [法定代理人]',
              '위법성 조각사유 [違法性 阻却事由]',
            ]}
          />
        </div>
      )}
    </aside>
  )
}

export default BlogDetailSideBar
