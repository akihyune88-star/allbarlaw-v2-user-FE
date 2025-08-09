import styles from './search-blog.module.scss'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import SearchContentHeader from '@/container/search/searchContentHeader/SearchContentHeader'
import SearchBlogResult from '@/container/search/searchBlogResult/SearchBlogResult'

import { useState } from 'react'
import type { SortType } from '@/types/sortTypes'
import { useInfiniteSearchList } from '@/hooks/queries/useSearch'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useSearchStore } from '@/stores/searchStore'
import Divider from '@/components/divider/Divider'
import { Outlet, useParams } from 'react-router-dom'
import { useRecommendationLegalTerm } from '@/hooks/queries/useRecommendation'
import RecommendationLawyer from '@/container/recommendation/RecommendationLawyer'

const SearchBlog = () => {
  const [sort, setSort] = useState<SortType>('viewCount')
  const { searchQuery } = useSearchStore()
  const { blogCaseId } = useParams()

  const handleSearchTab = (tab: SortType) => {
    setSort(tab)
  }

  const { hasNextPage, fetchNextPage, isFetchingNextPage, searchResults, searchTotalCounts } = useInfiniteSearchList({
    searchQuery,
    searchTab: 'blog',
    searchSize: 10,
    searchSortBy: sort,
  })

  useInfiniteScroll({
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  })

  const { data: recommendationLegalTerm } = useRecommendationLegalTerm({
    blogCaseIds: searchResults?.searchBlogResults.map(result => result.blogCaseId) || [],
  })

  return (
    <>
      {blogCaseId ? (
        <Outlet />
      ) : (
        <main className='sub-main-container'>
          <>
            <section className={`contents-section ${styles.contentBox}`}>
              <SearchContentHeader
                amount={searchTotalCounts?.searchTotalBlogCount || 0}
                searchTab={sort}
                handleSearchTab={handleSearchTab}
              />
              <Divider padding={0} />
              <SearchBlogResult searchResults={searchResults?.searchBlogResults || []} />
            </section>
            <aside className='aside'>
              <section>
                <RecommendationLawyer />
              </section>
              <section>
                <LegalTermWidget lagalTermList={recommendationLegalTerm || []} />
              </section>
            </aside>
          </>
        </main>
      )}
    </>
  )
}

export default SearchBlog
