import AIRecommender from '@/components/aiRecommender/AIRecommender'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import AIBlogCarousel from '@/container/blog/AIBlogCarousel'
import LegalKnowledgeList from '@/container/legalKnowledge/LegalKnowledgeList'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useInfiniteKnowledgeList } from '@/hooks/queries/useGetKnowledgeList'
import { useRecommendationLegalTerm } from '@/hooks/queries/useRecommendation'

const LegalKnowledgeLayout = () => {
  const navigate = useNavigate()
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const [sortCase, setSortCase] = useState<string>('all')

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

  return (
    <main className='sub-main-container'>
      <section className='contents-section'>
        <AIBlogCarousel />
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
        <section>
          <AIRecommender />
        </section>
        <section>
          <LegalTermWidget lagalTermList={recommendationLegalTerm ?? []} />
        </section>
      </aside>
    </main>
  )
}

export default LegalKnowledgeLayout
