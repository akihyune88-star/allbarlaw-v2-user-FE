import Divider from '@/components/divider/Divider'
import styles from './legal-knowledge-detail-sideBar.module.scss'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import { generateRandomLawyers } from '@/utils/mockDataGenerator'

type LegalKnowledgeDetailSideBarProps = {
  recommendLawyerList: {
    lawyerId: number
    lawyerName: string
    lawfirmName: string
    lawyerProfileImage: string
  }[]
}

const LegalKnowledgeDetailSideBar = ({ recommendLawyerList }: LegalKnowledgeDetailSideBarProps) => {
  console.log(recommendLawyerList)
  const mockLawyerList = generateRandomLawyers(3)
  return (
    <aside className={styles['legal-knowledge-detail-sidebar']}>
      <section>
        <h2>{`변호사와\n상담을하고 싶다면`}</h2>
        <button>바로톡</button>
        <Divider padding={16} />
        <ContentsRecommender
          className={styles['custom-contents-recommender']}
          isRefresh={true}
          showDivider={false}
          title={`최근 답변이 많은\n변호사입니다.`}
          contents={
            <div className={styles['list']}>
              {mockLawyerList.map(lawyer => (
                <LawyerHorizon
                  key={lawyer.lawyerId}
                  name={lawyer.lawyerName}
                  profileImage={lawyer.lawyerProfileImage}
                  description={lawyer.lawfirmName}
                  size='x-small'
                />
              ))}
            </div>
          }
        />
      </section>
      <section>
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
    </aside>
  )
}

export default LegalKnowledgeDetailSideBar
