import { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useSearchStore } from '@/stores/searchStore'
import { useInfiniteSearchList } from '@/hooks/queries/useSearch'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import SearchContentHeader from '@/container/search/searchContentHeader/SearchContentHeader'
import SearchVideoResult from '@/container/search/searchVideoResult/SearchVideoResult'
import { SortType } from '@/types/sortTypes'
import styles from './search-video.module.scss'
import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import Divider from '@/components/divider/Divider'
import RecommendationLawyer from '@/container/recommendation/RecommendationLawyer'
import { useRecommendationLegalTerm } from '@/hooks/queries/useRecommendation'

const SearchVideo = () => {
  const { videoId } = useParams()
  const { searchQuery } = useSearchStore()
  const [sort, setSort] = useState<SortType>('viewCount')

  const { searchResults, searchTotalCounts, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteSearchList({
      searchQuery,
      searchTab: 'video',
      searchSize: 10,
      searchSortBy: sort,
    })

  useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 500,
    enabled: !videoId,
  })

  const videoCount = searchTotalCounts?.searchTotalVideoCount || 0

  const { data: recommendationLegalTerm } = useRecommendationLegalTerm({
    videoCaseIds: searchResults?.searchVideoResults.map(result => result.videoCaseId) || [],
  })

  if (videoId) return <Outlet />

  return (
    <main className='sub-main-container'>
      <section className={`contents-section ${styles.contentBox}`}>
        <SearchContentHeader amount={videoCount} searchTab={sort} handleSearchTab={setSort} />
        <Divider padding={24} />
        <SearchVideoResult searchResults={searchResults?.searchVideoResults || []} isLoading={isLoading} />
      </section>
      <aside className='aside'>
        <RecommendationLawyer />
        <section>
          <LegalTermWidget lagalTermList={recommendationLegalTerm || []} />
        </section>
      </aside>
    </main>
  )
}

export default SearchVideo
