import AIRecommender, { LawyerItem } from '@/components/aiRecommender/AIRecommender'
import LawyerVertical from '@/components/lawyer/LawyerVertical'
import styles from './blog-detail-sidebar.module.scss'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'

const BlogDetailSideBar = ({ showLoading }: { showLoading: boolean }) => {
  return (
    <aside className={styles['blog-detail-sidebar']}>
      <div className={styles['sidebar-desktop-wrapper']}>
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
      </div>

      <div className={styles['sidebar-mobile-wrapper']}>
        <div className={styles['lawyer-section']}>
          <LawyerItem lawyerList={mockLawyerList} divider />
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
    </aside>
  )
}

export default BlogDetailSideBar

const mockLawyerList = [
  {
    id: 1,
    name: '이보람',
    description: '이보람은 경찰 고소 공범 통장 보이스피싱 사기공범 신고 은행 경찰 고소에 능하며 어쩌구 저쩌구 ',
    profileImage: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
  },
  {
    id: 1,
    name: '이보람',
    description: '이보람은 경찰 고소 공범 통장 보이스피싱 사기공범 신고 은행 경찰 고소에 능하며 어쩌구 저쩌구 ',
    profileImage: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
  },
  {
    id: 1,
    name: '이보람',
    description: '이보람은 경찰 고소 공범 통장 보이스피싱 사기공범 신고 은행 경찰 고소에 능하며 어쩌구 저쩌구 ',
    profileImage: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
  },
]
