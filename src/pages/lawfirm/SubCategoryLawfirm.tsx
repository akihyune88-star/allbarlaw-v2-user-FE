import LawfirmFilter from '@/container/lawfirm/lawfirmFilter/LawfirmFilter'
import LawfirmList from '@/container/lawfirm/LawfirmList'
import { useInfiniteLawfirmList } from '@/hooks/queries/useGetLawfirmList'
import { useParams } from 'react-router-dom'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useState } from 'react'

const SubcategoryLawfirmLayout = () => {
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const [filter, setFilter] = useState({
    orderBy: 'all',
    recentDays: 'all',
  })

  const { lawfirmList, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteLawfirmList({
    subcategoryId: Number(subcategoryId),
    take: 6,
  })

  // 무한스크롤 적용
  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetching: isFetchingNextPage,
    fetchNextPage,
  })

  return (
    <main className='sub-main-container'>
      <section className='contents-section'>
        <LawfirmList lawfirmList={lawfirmList} isLoading={isLoading} isFetchingNextPage={isFetchingNextPage} />
      </section>
      <aside className='aside' style={{ width: '250px', flexShrink: 0 }}>
        <LawfirmFilter filter={filter} setFilter={setFilter} />
      </aside>
    </main>
  )
}

export default SubcategoryLawfirmLayout
