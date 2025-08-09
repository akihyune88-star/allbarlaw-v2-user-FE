import { Fragment } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import Button from '@/components/button/Button'
import styles from '@/container/legalKnowledge/legal-knowledge-list.module.scss'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import Divider from '@/components/divider/Divider'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { KnowledgeItem } from '@/types/knowledgeType'

interface LegalKnowledgeListProps {
  knowledgeList: KnowledgeItem[]
  isLoading: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  sortCase: string
  onChangeSort: (_key: string) => void
  onClickItem: (_knowledgeId: number) => void
}

const LegalKnowledgeList = ({
  knowledgeList,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  sortCase,
  onChangeSort,
  onClickItem,
}: LegalKnowledgeListProps) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const navigate = useNavigate()

  // 무한스크롤 적용
  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  const handleBaroTalk = () => {
    navigate(ROUTER.REQUEST_BARO_TALK)
  }

  const handleSortCase = (key: string) => {
    onChangeSort(key)
  }

  const handleDetailLegalKnowledgeClick = (knowledgeId: number) => {
    onClickItem(knowledgeId)
  }

  return (
    <div className={styles['legal-knowledge-list-container']}>
      <ArticleHeader
        title={`변호사가 직접 답변하는 법률 지식인!\n내 문제와 유사한 문제가 있는지 찾아보세요`}
        button={
          isMobile ? (
            <Button variant='primary' className={styles['chat-button']} onClick={handleBaroTalk}>
              변호사 채팅상담 하기
            </Button>
          ) : null
        }
        onClick={handleSortCase}
        activeKey={sortCase}
        totalBlogCount={2147}
        recentBlogCount={4142}
      />
      {!isMobile && <Divider padding={24} />}
      <section className={styles['legal-knowledge-list']}>
        {knowledgeList && knowledgeList.length > 0 ? (
          knowledgeList.map((knowledge, index) => (
            <Fragment key={knowledge.knowledgeId}>
              <LegalKnowledgeItem
                knowledgeKeep={knowledge.isKeep}
                knowledgeId={knowledge.knowledgeId}
                title={knowledge.knowledgeTitle}
                description={knowledge.summaryContent}
                time={new Date(knowledge.lastMessageAt)}
                lawyerList={knowledge.lawyers || []}
                isLastAnswer={true}
                onClick={() => handleDetailLegalKnowledgeClick(knowledge.knowledgeId)}
              />
              {index !== knowledgeList.length - 1 && !isMobile && <Divider padding={0} />}
            </Fragment>
          ))
        ) : (
          <div>데이터를 불러오는 중...</div>
        )}

        {/* 로딩 인디케이터 */}
        {(isLoading || isFetchingNextPage) && (
          <div className={styles['loading-container']}>
            <div className={styles['loading-text']}>로딩 중...</div>
          </div>
        )}
      </section>
    </div>
  )
}

export default LegalKnowledgeList
