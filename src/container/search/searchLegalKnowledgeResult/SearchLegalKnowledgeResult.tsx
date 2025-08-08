import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import styles from './searchLegalKnowledgeResult.module.scss'
import { KnowledgeItem as KnowledgeItemType } from '@/types/knowledgeType'

type SearchLegalKnowledgeResultProps = {
  searchResults: KnowledgeItemType[]
  isLoading?: boolean
}

const SearchLegalKnowledgeResult = ({ searchResults, isLoading }: SearchLegalKnowledgeResultProps) => {
  if (isLoading) {
    return (
      <div className={styles['search-legal-knowledge-result']}>
        <div className={styles['loading']}>검색 중...</div>
      </div>
    )
  }

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className={styles['search-legal-knowledge-result']}>
        <div className={styles['no-results']}>검색 결과가 없습니다.</div>
      </div>
    )
  }

  return (
    <div className={styles['search-legal-knowledge-result']}>
      {searchResults.map(item => (
        <LegalKnowledgeItem
          key={item.knowledgeId}
          knowledgeId={item.knowledgeId}
          title={item.knowledgeTitle}
          description={item.summaryContent}
          time={new Date(item.lastMessageAt)}
          lawyerList={item.lawyers}
          knowledgeKeep={item.isKeep}
          isShowKeep={true}
        />
      ))}
    </div>
  )
}

export default SearchLegalKnowledgeResult
