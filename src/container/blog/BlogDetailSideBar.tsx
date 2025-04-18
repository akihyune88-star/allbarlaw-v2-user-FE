import AIRecommender from '@/components/aiRecommender/AIRecommender'
import LawyerVertical from '@/components/lawyer/LawyerVertical'
import styles from './blog-detail-sidebar.module.scss'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'

const BlogDetailSideBar = ({ showLoading }: { showLoading: boolean }) => {
  return (
    <aside className={styles['blog-detail-sidebar']}>
      <section className={styles['lawyer-section']}>
        <LawyerVertical
          id={1}
          name='홍길동'
          lawfirm='법무법인'
          profileImage='https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg'
          type={1}
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
    </aside>
  )
}

export default BlogDetailSideBar
