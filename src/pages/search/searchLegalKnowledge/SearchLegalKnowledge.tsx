import { useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useSearchStore } from '@/stores/searchStore'
import { useInfiniteSearchList } from '@/hooks/queries/useSearch'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import SearchContentHeader from '@/container/search/searchContentHeader/SearchContentHeader'
import SearchLegalKnowledgeResult from '@/container/search/searchLegalKnowledgeResult/SearchLegalKnowledgeResult'
import { SortType } from '@/types/sortTypes'
import styles from './search-legal-knowledge.module.scss'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import Divider from '@/components/divider/Divider'
import { useRecommendationLegalTerm } from '@/hooks/queries/useRecommendation'
import RecentActiveLawyer from '@/container/lawyer/recentActiveLawyer/RecentActiveLawyer'
import { ROUTER } from '@/routes/routerConstant'

const SearchLegalKnowledge = () => {
  const { knowledgeId } = useParams()
  const { searchQuery, searchLawyerId } = useSearchStore()
  const [sort, setSort] = useState<SortType>('viewCount')
  const navigate = useNavigate()

  const { searchResults, searchTotalCounts, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteSearchList({
      searchQuery,
      searchLawyerId,
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

  const { data: recommendationLegalTerm } = useRecommendationLegalTerm({
    knowledgeIds: searchResults?.searchConsultationResults.map(result => result.knowledgeId) || [],
  })

  if (knowledgeId) return <Outlet />

  const handleRequestConsultation = () => {
    navigate(ROUTER.CHAT)
  }

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
        <section className={styles['consultation-section']}>
          <div className={styles['consultation-section-header']}>
            <span className={styles['consultation-section-header-title']}>
              궁금한 내용을
              <br />
              질문하세요
            </span>
            <button className={styles['consultation-section-header-button']} onClick={handleRequestConsultation}>
              변호사 채팅상담하기
            </button>
            <Divider padding={16} />
            <RecentActiveLawyer />
          </div>
        </section>
        <section>
          <LegalTermWidget lagalTermList={recommendationLegalTerm || []} />
        </section>
      </aside>
    </main>
  )
}

export default SearchLegalKnowledge
