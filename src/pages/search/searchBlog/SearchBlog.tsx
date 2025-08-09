import styles from './search-blog.module.scss'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import SearchContentHeader from '@/container/search/searchContentHeader/SearchContentHeader'
import SearchBlogResult from '@/container/search/searchBlogResult/SearchBlogResult'

import { useState } from 'react'
import type { SortType } from '@/types/sortTypes'
import { useInfiniteSearchList } from '@/hooks/queries/useSearch'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useSearchStore } from '@/stores/searchStore'
import Divider from '@/components/divider/Divider'
import { Outlet, useParams } from 'react-router-dom'

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
                <ContentsRecommender
                  isRefresh={true}
                  title='AI 추천 변호사'
                  onRefresh={() => {}}
                  contents={<div className={styles['ai-recommender-lawyer']} />}
                />
              </section>
              <section>
                <LegalTermWidget
                  lagalTermList={[
                    '사기죄 [詐欺罪]',
                    '업무방해죄 [業務妨害죄]',
                    '절도죄 [窃盜罪]',
                    '법정대리인 [法定代理人]',
                    '위법성 조각사유 [違法性 阻却事由]',
                  ]}
                />
              </section>
            </aside>
          </>
        </main>
      )}
    </>
  )
}

export default SearchBlog
