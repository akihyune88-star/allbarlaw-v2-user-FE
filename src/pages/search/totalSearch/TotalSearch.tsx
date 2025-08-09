import { useSearchList } from '@/hooks/queries/useSearch'
import styles from './total-search.module.scss'
import { useSearchStore } from '@/stores/searchStore'
import TotalSearchBlogList from '@/container/search/totalSearchBlogList/TotalSearchBlogList'
import TotalSearchKnowledgeList from '@/container/search/totalSearchKnowledgeList/TotalSearchKnowledgeList'
import TotalSearchVideoList from '@/container/search/totalSearchVideoList/TotalSearchVideoList'
import TotalSearchLawyerList from '@/container/search/totalSearchLawyerList/TotalSearchLawyerList'

const SearchCount = ({ count }: { count: number }) => {
  return (
    <div className={styles['search-count']}>
      <span>총 {count.toLocaleString()}건이 검색되었습니다. </span>
    </div>
  )
}

const TotalSearch = () => {
  // zustand store에서 검색어 가져오기
  const { searchQuery } = useSearchStore()

  const { data } = useSearchList({
    searchQuery: searchQuery,
    searchTab: 'all',
    searchSize: 4,
    searchSortBy: 'createdAt',
  })

  return (
    <>
      <SearchCount count={data?.totalItems || 0} />
      <div className={styles['total-search']}>
        <TotalSearchBlogList searchResults={data?.searchResults.searchBlogResults || []} query={searchQuery} />
        <TotalSearchKnowledgeList
          searchResults={data?.searchResults.searchConsultationResults || []}
          query={searchQuery}
        />
        <TotalSearchVideoList searchResults={data?.searchResults.searchVideoResults || []} query={searchQuery} />
        <TotalSearchLawyerList searchResults={data?.searchResults.searchLawyerResults || []} query={searchQuery} />
      </div>
    </>
  )
}

export default TotalSearch
