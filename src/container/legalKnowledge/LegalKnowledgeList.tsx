import { Fragment, useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import Button from '@/components/button/Button'
import styles from '@/container/legalKnowledge/legal-knowledge-list.module.scss'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import Divider from '@/components/divider/Divider'
import { useGetKnowledgeList } from '@/hooks/queries/useGetKnowledgeList'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import { SortType } from '@/types/sortTypes'

const LegalKnowledgeList = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const navigate = useNavigate()
  const { subcategoryId } = useParams<{ subcategoryId: string }>()

  const [sortCase, setSortCase] = useState<SortType>('all')

  const handleSortCase = (key: SortType) => {
    setSortCase(key)
  }

  const {
    data: knowledgeList,
    isLoading: _isLoading,
    isError: _isError,
  } = useGetKnowledgeList({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    take: 4,
    orderBy: sortCase === 'all' ? 'createdAt' : (sortCase as 'createdAt' | 'viewCount' | 'likesCount'),
  })

  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000)

  const handleBaroTalk = () => {
    navigate(ROUTER.REQUEST_BARO_TALK)
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
                title={knowledge.knowledgeTitle}
                description={knowledge.summaryContent}
                time={threeHoursAgo}
                lawyerList={knowledge.lawyers || []}
                isLastAnswer={true}
              />
              {index !== knowledgeList.length - 1 && !isMobile && <Divider padding={0} />}
            </Fragment>
          ))
        ) : (
          <div>데이터를 불러오는 중...</div>
        )}
      </section>
    </div>
  )
}

export default LegalKnowledgeList
