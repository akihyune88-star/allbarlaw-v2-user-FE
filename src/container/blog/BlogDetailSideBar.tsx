import AIRecommender from '@/components/aiRecommender/AIRecommender'
import LawyerVertical from '@/components/lawyer/LawyerVertical'
import styles from './blog-detail-sidebar.module.scss'

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
        <section className={styles['ai-section']}>
          <AIRecommender />
        </section>
      )}
    </aside>
  )
}

export default BlogDetailSideBar
