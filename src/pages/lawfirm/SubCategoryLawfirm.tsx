import LawfirmFilter from '@/container/lawfirm/lawfirmFilter/LawfirmFilter'
import LawfirmList from '@/container/lawfirm/LawfirmList'
import { useInfiniteLawfirmList } from '@/hooks/queries/useGetLawfirmList'
import { useParams } from 'react-router-dom'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useMemo, useState } from 'react'
import { SortType } from '@/types/sortTypes'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import { useRecommendationLegalTerm } from '@/hooks/queries/useRecommendation'

const SubcategoryLawfirmLayout = () => {
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const [filter, setFilter] = useState<{
    orderBy: SortType
    recentDays: string
  }>({
    orderBy: 'createdAt',
    recentDays: 'all',
  })

  const { lawfirmList, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteLawfirmList({
    subcategoryId: Number(subcategoryId),
    take: 6,
    orderBy: filter.orderBy,
    recentDays: filter.recentDays,
  })

  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  const lawfirmIds = useMemo(() => lawfirmList.map(f => f.lawfirmId), [lawfirmList])

  const { data: recommendationLegalTerm } = useRecommendationLegalTerm({
    lawfirmIds,
  })

  return (
    <main className='sub-main-container'>
      <section className='contents-section'>
        <LawfirmList lawfirmList={lawfirmList} isLoading={isLoading} isFetchingNextPage={isFetchingNextPage} />
      </section>
      <aside className='aside' style={{ width: '250px', flexShrink: 0 }}>
        <LawfirmFilter filter={filter} setFilter={setFilter} />
        {recommendationLegalTerm && recommendationLegalTerm.length > 0 && (
          <LegalTermWidget lagalTermList={recommendationLegalTerm ?? []} />
        )}
      </aside>
    </main>
  )
}

export default SubcategoryLawfirmLayout
