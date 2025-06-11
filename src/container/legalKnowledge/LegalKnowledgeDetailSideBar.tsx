import { LawyerItem } from '@/components/aiRecommender/AIRecommender'
import styles from './legal-knowledge-detail-sideBar.module.scss'

type LegalKnowledgeDetailSideBarProps = {
  recommendLawyerList: {
    id: number
    name: string
    description: string
    profileImage: string
  }[]
}

const LegalKnowledgeDetailSideBar = ({ recommendLawyerList }: LegalKnowledgeDetailSideBarProps) => {
  return (
    <aside className={styles['legal-knowledge-detail-sidebar']}>
      <LawyerItem lawyerList={recommendLawyerList} divider />
    </aside>
  )
}

export default LegalKnowledgeDetailSideBar
