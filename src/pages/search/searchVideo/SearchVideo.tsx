import { useState } from 'react'
import { useSearchQuery } from '@/utils/urlUtils'
import { useInfiniteSearchList } from '@/hooks/queries/useSearch'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import SearchContentHeader from '@/container/search/searchContentHeader/SearchContentHeader'
import SearchVideoResult from '@/container/search/searchVideoResult/SearchVideoResult'
// import SearchSideWidget from '@/container/search/searchSideWidget/SearchSideWidget'
import { SortType } from '@/types/sortTypes'
import styles from './search-video.module.scss'
import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'

const SearchVideo = () => {
  const searchQuery = useSearchQuery()
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
    enabled: true,
  })

  const videoCount = searchTotalCounts?.searchTotalVideoCount || 0

  return (
    <main className='sub-main-container'>
      <section className={`contents-section ${styles.contentBox}`}>
        <SearchContentHeader amount={videoCount} searchTab={sort} handleSearchTab={setSort} />
        <SearchVideoResult searchResults={searchResults?.searchVideoResults || []} isLoading={isLoading} />
      </section>
      <aside className='aside'>
        <section>
          <ContentsRecommender
            isRefresh={true}
            title='AI 추천 변호사'
            onRefresh={() => {}}
            contents={
              <div className={styles['ai-recommender-lawyer']}>
                {/* {mockLawyerList.map(lawyer => (
                  <LawyerHorizon
                    key={lawyer.lawyerId}
                    name={lawyer.lawyerName}
                    profileImage={lawyer.lawyerProfileImage}
                    description={lawyer.lawfirmName}
                    size='x-small'
                  />
                ))} */}
              </div>
            }
          />
        </section>
        <section>
          <LegalTermWidget
            lagalTermList={[
              '사기죄 [詐欺罪]',
              '업무방해죄 [業務妨害罪]',
              '절도죄 [窃盜罪]',
              '법정대리인 [法定代理人]',
              '위법성 조각사유 [違法性 阻却事由]',
            ]}
          />
        </section>
      </aside>
    </main>
  )
}

export default SearchVideo
