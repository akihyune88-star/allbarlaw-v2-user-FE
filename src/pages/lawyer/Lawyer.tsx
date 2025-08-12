import LawyerList from '@/container/lawyer/LawyerList'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useInfiniteLawyerList } from '@/hooks/queries/useLawyer'
import { SortType } from '@/types/sortTypes'

const LawyerLayout = () => {
  const navigate = useNavigate()
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const [sortCase, setSortCase] = useState<SortType>('createdAt')

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useInfiniteLawyerList({
    subcategoryId: Number(subcategoryId),
    orderBy: sortCase,
    achievementId: 'all',
  })

  const lawyerList = data?.lawyerList || []

  const handleSortCase = (key: SortType) => setSortCase(key === 'all' ? 'createdAt' : key)
  const handleLawyerItemClick = (lawyerId: number) => navigate(`/${subcategoryId}/lawyer/${lawyerId}`)

  return (
    <main className='sub-main-container'>
      <section className='contents-section'>
        <LawyerList
          lawyerList={lawyerList}
          isLoading={isLoading}
          hasNextPage={hasNextPage || false}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          sortCase={sortCase}
          onChangeSort={handleSortCase}
          onClickItem={handleLawyerItemClick}
        />
      </section>
      <aside className='aside'>
        <section>여긴 필터만 들어가면됨</section>
      </aside>
    </main>
  )
}

export default LawyerLayout
