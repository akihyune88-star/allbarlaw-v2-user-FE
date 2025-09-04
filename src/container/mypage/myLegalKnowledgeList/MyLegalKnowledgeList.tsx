import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import styles from './myLegalKnowledgeList.module.scss'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Divider from '@/components/divider/Divider'
import { useInfiniteMyLegalKnowledgeList } from '@/hooks/queries/useMypage'
import { useNavigate } from 'react-router-dom'
import { KnowledgeItem } from '@/types/knowledgeType'
// import { useNavigate } from 'react-router-dom'
// import { KnowledgeItem } from '@/types/knowledgeType'

const MyLegalKnowledgeList = ({ sort }: { sort: 'asc' | 'desc' }) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const navigate = useNavigate()

  const { knowledgeList, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteMyLegalKnowledgeList({
    take: 10,
    sort: sort,
  })

  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  console.log(knowledgeList)

  const handleKnowledgeDetail = (knowledge: KnowledgeItem) => {
    navigate(`/${knowledge.subcategoryId}/legal-knowledge/${knowledge.knowledgeId}`)
  }

  const isEmptyKnowledgeList = knowledgeList.length === 0

  return (
    <div
      className={styles.myLegalKnowledgeList}
      style={{
        backgroundColor: isEmptyKnowledgeList ? 'transparent' : 'white',
        padding: isEmptyKnowledgeList ? '0' : '1.5rem',
      }}
    >
      {isEmptyKnowledgeList ? (
        <div className={styles.emptyMessage}>등록된 “법률 지식인” Keep이 없습니다.</div>
      ) : (
        knowledgeList.map((knowledge, idx) => (
          <>
            <LegalKnowledgeItem
              knowledgeId={knowledge.knowledgeId}
              knowledgeKeep={knowledge.isKeep}
              key={knowledge.knowledgeId}
              title={knowledge.knowledgeTitle}
              description={knowledge.summaryContent}
              time={new Date(knowledge.lastMessageAt)}
              lawyerList={knowledge.lawyers || []}
              isLastAnswer={true}
              onClick={() => handleKnowledgeDetail(knowledge)}
            />
            {!isMobile && idx !== knowledgeList.length - 1 && <Divider padding={24} />}
          </>
        ))
      )}
    </div>
  )
}

export default MyLegalKnowledgeList
