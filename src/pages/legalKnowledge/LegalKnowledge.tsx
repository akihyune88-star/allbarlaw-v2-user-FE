import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import LegalKnowledgeList from '@/container/legalKnowledge/LegalKnowledgeList'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useInfiniteKnowledgeList } from '@/hooks/queries/useGetKnowledgeList'
import { useRecommendationLegalTerm } from '@/hooks/queries/useRecommendation'
import Divider from '@/components/divider/Divider'
import RecentActiveLawyer from '@/container/lawyer/recentActiveLawyer/RecentActiveLawyer'
import { ROUTER } from '@/routes/routerConstant'
import styles from './legal-knowledge.module.scss'

const LegalKnowledgeLayout = () => {
  const navigate = useNavigate()
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const [sortCase, setSortCase] = useState<string>('viewCount')

  const { knowledgeList, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteKnowledgeList({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    take: 4,
    orderBy: sortCase === 'all' ? 'createdAt' : (sortCase as 'createdAt' | 'viewCount' | 'likesCount'),
  })

  const knowledgeIds = useMemo(() => knowledgeList.map(k => k.knowledgeId), [knowledgeList])

  const { data: recommendationLegalTerm } = useRecommendationLegalTerm({
    knowledgeIds,
  })

  const handleSortCase = (key: string) => setSortCase(key)
  const handleKnowledgeItemClick = (knowledgeId: number) => navigate(`/${subcategoryId}/legal-knowledge/${knowledgeId}`)
  const handleRequestConsultation = () => {
    navigate(ROUTER.REQUEST_BARO_TALK)
  }

  return (
    <main className='sub-main-container'>
      <section className='contents-section'>
        <LegalKnowledgeList
          knowledgeList={knowledgeList}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          sortCase={sortCase}
          onChangeSort={handleSortCase}
          onClickItem={handleKnowledgeItemClick}
        />
      </section>
      <aside className='aside'>
        <section className={styles['consultation-section']}>
          <div className={styles['consultation-section-header']}>
            <span className={styles['consultation-section-header-title']}>
              궁금한 내용을
              <br />
              질문하세요
            </span>
            <button className={styles['consultation-section-header-button']} onClick={handleRequestConsultation}>
              변호사 채팅상담하기
            </button>
            <Divider padding={16} />
            <RecentActiveLawyer />
          </div>
        </section>
        <section>
          {recommendationLegalTerm && recommendationLegalTerm.length > 0 && (
            <LegalTermWidget lagalTermList={recommendationLegalTerm ?? []} />
          )}
        </section>
      </aside>
    </main>
  )
}

export default LegalKnowledgeLayout
