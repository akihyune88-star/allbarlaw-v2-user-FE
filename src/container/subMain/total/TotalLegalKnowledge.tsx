import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import Button from '@/components/button/Button'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import SvgIcon from '@/components/SvgIcon'
import styles from '@/container/subMain/total/total-legal-knowledge.module.scss'
import { useGetKnowledgeList } from '@/hooks/queries/useGetKnowledgeList'
import { useKnowledgeCount } from '@/hooks/queries/useKnowledge'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ROUTER } from '@/routes/routerConstant'
import { useNavigate, useParams } from 'react-router-dom'

const TotalLegalKnowledge = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const navigate = useNavigate()
  const { subcategoryId } = useParams<{ subcategoryId: string }>()

  const {
    data: knowledgeList,
    isLoading: _isLoading,
    isError: _isError,
  } = useGetKnowledgeList({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    take: 4,
    orderBy: 'createdAt',
  })

  const { data: knowledgeTotalCount } = useKnowledgeCount({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    recentDays: 'all',
  })

  const { data: recentMonthKnowledgeCount } = useKnowledgeCount({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    recentDays: 30,
  })

  const handleBaroTalk = () => navigate(ROUTER.REQUEST_BARO_TALK)
  const handleTotalLegalKnowledgeClick = () => navigate(`/${subcategoryId}${ROUTER.LEGAL_KNOWLEDGE}`)
  const handleDetailLegalKnowledgeClick = (knowledgeId: number) =>
    navigate(`/${subcategoryId}${ROUTER.LEGAL_KNOWLEDGE}/${knowledgeId}`)

  return (
    <section className={styles.container}>
      <aside className={styles.aside}>
        {isMobile ? (
          <ArticleHeader title='최신 법률 지식인' totalBlogCount={21321} recentBlogCount={1314} type='total' />
        ) : (
          <>
            <div className={styles.aside__header}>
              <h3 className={styles[`aside__header-title`]}>{`최신 \n법률 지식인`}</h3>
              <span className={styles['aside__header-count']}>
                전체 {knowledgeTotalCount || 0}상담
                <br />
                최근 한달 {recentMonthKnowledgeCount || 0}상담
              </span>
              <button className={'total-view-button'} onClick={handleTotalLegalKnowledgeClick}>
                <span>전체보기</span>
                <SvgIcon name='arrowSmall' size={16} style={{ transform: 'rotate(135deg)' }} />
              </button>
            </div>
            <Button variant='normal' size='small' className={styles['question-button']} onClick={handleBaroTalk}>
              질문하기
            </Button>
          </>
        )}
      </aside>
      <div className={styles['content-area']}>
        {knowledgeList.map(item => (
          <LegalKnowledgeItem
            key={item.knowledgeId}
            knowledgeId={item.knowledgeId}
            knowledgeKeep={item.isKeep}
            title={item.knowledgeTitle}
            description={item.summaryContent}
            time={new Date(item.lastMessageAt)}
            isLastAnswer={true}
            isShowKeep={false}
            lawyerList={item.lawyers || []}
            onClick={() => handleDetailLegalKnowledgeClick(item.knowledgeId)}
          />
        ))}
      </div>
    </section>
  )
}

export default TotalLegalKnowledge
