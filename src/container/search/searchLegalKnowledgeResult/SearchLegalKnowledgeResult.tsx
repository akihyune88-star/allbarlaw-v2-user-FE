import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import styles from './searchLegalKnowledgeResult.module.scss'
import { KnowledgeItem as KnowledgeItemType } from '@/types/knowledgeType'
import Divider from '@/components/divider/Divider'
import { useNavigate } from 'react-router-dom'

type SearchLegalKnowledgeResultProps = {
  searchResults: KnowledgeItemType[]
  isLoading?: boolean
}

const SearchLegalKnowledgeResult = ({ searchResults, isLoading }: SearchLegalKnowledgeResultProps) => {
  const navigate = useNavigate()

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

  const handleClickLegalKnowledgeDetail = (knowledgeId: number) => {
    navigate(`/search/legal-knowledge/${knowledgeId}`)
  }

  return (
    <div className={styles['search-legal-knowledge-result']}>
      {searchResults.map((item, index) => (
        <>
          <LegalKnowledgeItem
            onClick={() => handleClickLegalKnowledgeDetail(item.knowledgeId)}
            key={item.knowledgeId}
            knowledgeId={item.knowledgeId}
            title={item.knowledgeTitle}
            description={item.summaryContent}
            time={new Date(item.lastMessageAt)}
            lawyerList={item.lawyers}
            isLastAnswer={true}
            knowledgeKeep={item.isKeep}
            isShowKeep={true}
          />
          {index !== searchResults.length - 1 && <Divider padding={24} />}
        </>
      ))}
    </div>
  )
}

export default SearchLegalKnowledgeResult
