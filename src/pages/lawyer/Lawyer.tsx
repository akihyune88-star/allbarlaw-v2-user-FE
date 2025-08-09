import AIRecommender from '@/components/aiRecommender/AIRecommender'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import AIBlogCarousel from '@/container/blog/AIBlogCarousel'
import LawyerList from '@/container/lawyer/LawyerList'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useInfiniteLawyerList } from '@/hooks/queries/useLawyer'
import { useRecommendationLegalTerm } from '@/hooks/queries/useRecommendation'
import { SortType } from '@/types/sortTypes'

const LawyerLayout = () => {
  const navigate = useNavigate()
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const [sortCase, setSortCase] = useState<SortType>('createdAt')

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteLawyerList({
    subcategoryId: Number(subcategoryId),
    orderBy: sortCase,
    achievementId: 'all',
  })

  const lawyerList = data?.lawyerList || []
  const lawyerIds = useMemo(() => lawyerList.map(l => l.lawyerId), [lawyerList])

  const { data: recommendationLegalTerm } = useRecommendationLegalTerm({
    lawfirmIds: lawyerIds,
  })

  const handleSortCase = (key: SortType) => setSortCase(key === 'all' ? 'createdAt' : key)
  const handleLawyerItemClick = (lawyerId: number) => navigate(`/${subcategoryId}/lawyer/${lawyerId}`)

  return (
    <main className='sub-main-container'>
      <section className='contents-section'>
        <AIBlogCarousel />
        <LawyerList
          lawyerList={lawyerList}
          isLoading={!data}
          hasNextPage={hasNextPage || false}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          sortCase={sortCase}
          onChangeSort={handleSortCase}
          onClickItem={handleLawyerItemClick}
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

export default LawyerLayout
