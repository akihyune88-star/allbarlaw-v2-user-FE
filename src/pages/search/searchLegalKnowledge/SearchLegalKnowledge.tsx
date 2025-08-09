import { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useSearchStore } from '@/stores/searchStore'
import { useInfiniteSearchList } from '@/hooks/queries/useSearch'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import SearchContentHeader from '@/container/search/searchContentHeader/SearchContentHeader'
import SearchLegalKnowledgeResult from '@/container/search/searchLegalKnowledgeResult/SearchLegalKnowledgeResult'
// import SearchSideWidget from '@/container/search/searchSideWidget/SearchSideWidget'
import { SortType } from '@/types/sortTypes'
import styles from './search-legal-knowledge.module.scss'
import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import Divider from '@/components/divider/Divider'

const SearchLegalKnowledge = () => {
  const { knowledgeId } = useParams()
  const { searchQuery } = useSearchStore()
  const [sort, setSort] = useState<SortType>('viewCount')

  const { searchResults, searchTotalCounts, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteSearchList({
      searchQuery,
      searchTab: 'consultation',
      searchSize: 10,
      searchSortBy: sort,
    })

  useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 500,
    enabled: !knowledgeId,
  })

  const knowledgeCount = searchTotalCounts?.searchTotalConsultationCount || 0

  if (knowledgeId) return <Outlet />

  return (
    <main className='sub-main-container'>
      <section className={`contents-section ${styles.contentBox}`}>
        <SearchContentHeader amount={knowledgeCount} searchTab={sort} handleSearchTab={setSort} />
        <Divider padding={24} />
        <SearchLegalKnowledgeResult
          searchResults={searchResults?.searchConsultationResults || []}
          isLoading={isLoading}
        />
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
              '업무방해죄 [業務妨害罪]',
              '절도죄 [窃盜罪]',
              '법정대리인 [法定代理人]',
              '위법성 조각사유 [違법性 阻却事由]',
            ]}
          />
        </section>
      </aside>
    </main>
  )
}

export default SearchLegalKnowledge
