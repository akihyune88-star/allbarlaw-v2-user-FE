import { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useSearchStore } from '@/stores/searchStore'
import { useInfiniteSearchList } from '@/hooks/queries/useSearch'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import SearchContentHeader from '@/container/search/searchContentHeader/SearchContentHeader'
import SearchLawyerResult from '@/container/search/searchLawyerResult/SearchLawyerResult'
// import SearchSideWidget from '@/container/search/searchSideWidget/SearchSideWidget'
import { SortType } from '@/types/sortTypes'
import styles from './search-lawyer.module.scss'
import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import Divider from '@/components/divider/Divider'
import RecommendationLawyer from '@/container/recommendation/RecommendationLawyer'
import RecentActiveLawyer from '@/container/lawyer/recentActiveLawyer/RecentActiveLawyer'

const SearchLawyer = () => {
  const { lawyerId } = useParams()
  const { searchQuery } = useSearchStore()
  const [sort, setSort] = useState<SortType>('viewCount')

  const { searchResults, searchTotalCounts, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteSearchList({
      searchQuery,
      searchTab: 'lawyer',
      searchSize: 10,
      searchSortBy: sort,
    })

  useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 500,
    enabled: !lawyerId,
  })

  if (lawyerId) {
    return <Outlet /> // lawyerId가 있으면 상세 페이지 렌더링
  }

  const lawyerCount = searchTotalCounts?.searchTotalLawyerCount || 0

  return (
    <main className='sub-main-container'>
      <section className={`contents-section ${styles.contentBox}`}>
        <SearchContentHeader amount={lawyerCount} searchTab={sort} handleSearchTab={setSort} />
        <Divider padding={24} />
        <SearchLawyerResult searchResults={searchResults?.searchLawyerResults || []} isLoading={isLoading} />
      </section>
      <aside className='aside'>
        <RecommendationLawyer />
        <div className={styles['active-lawyer-container']}>
          <RecentActiveLawyer />
        </div>
      </aside>
    </main>
  )
}

export default SearchLawyer
