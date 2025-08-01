import { useInfiniteKnowledgeList } from '@/hooks/queries/useGetKnowledgeList'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import styles from './myLegalKnowledgeList.module.scss'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Divider from '@/components/divider/Divider'

const MyLegalKnowledgeList = () => {
  const { knowledgeList, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteKnowledgeList({
    subcategoryId: 4,
    take: 4,
  })

  const isMobile = useMediaQuery('(max-width: 80rem)')

  console.log(knowledgeList)

  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000)

  return (
    <div className={styles.myLegalKnowledgeList}>
      {knowledgeList.map((knowledge, idx) => (
        <>
          <LegalKnowledgeItem
            key={knowledge.knowledgeId}
            title={knowledge.knowledgeTitle}
            description={knowledge.summaryContent}
            time={threeHoursAgo}
            lawyerList={knowledge.lawyers || []}
            isLastAnswer={true}
          />
          {!isMobile && idx !== knowledgeList.length - 1 && <Divider padding={24} />}
        </>
      ))}
    </div>
  )
}

export default MyLegalKnowledgeList
