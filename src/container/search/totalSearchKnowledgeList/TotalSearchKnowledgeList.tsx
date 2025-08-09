import { useNavigate } from 'react-router-dom'
import SearchSectionHeader from '../searchSectionHeader/SearchSectionHeader'
import styles from './totalSearchKnowledgeList.module.scss'
import { KnowledgeItem } from '@/types/knowledgeType'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'

interface TotalSearchKnowledgeListProps {
  searchResults: KnowledgeItem[]
  query: string
}

const TotalSearchKnowledgeList = ({ searchResults, query: _query }: TotalSearchKnowledgeListProps) => {
  const navigate = useNavigate()

  const handleClickMore = () => {
    navigate('/search/legal-knowledge')
  }

  return (
    <div className={styles['total-search-knowledge-list']}>
      <SearchSectionHeader title='법률 지식인' onClickMore={handleClickMore} />
      <div className={styles['knowledge-list']}>
        {searchResults.map(knowledge => (
          <LegalKnowledgeItem
            key={knowledge.knowledgeId}
            knowledgeId={knowledge.knowledgeId}
            knowledgeKeep={knowledge.isKeep}
            title={knowledge.knowledgeTitle}
            description={knowledge.summaryContent}
            time={new Date(knowledge.lastMessageAt)}
            isLastAnswer={true}
            isShowKeep={false}
            lawyerList={knowledge.lawyers || []}
            // onClick={() => handleDetailLegalKnowledgeClick(knowledge.knowledgeId)}
          />
        ))}
      </div>
    </div>
  )
}

export default TotalSearchKnowledgeList
