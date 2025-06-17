import { Outlet, useParams, useLocation } from 'react-router-dom'
import SearchHeader from '@/container/search/searchHedaer/SearchHeader'
import styles from './search-main.module.scss'

const SearchMain = () => {
  const { query } = useParams<{ query: string }>()
  const location = useLocation()
  const searchQuery = query || ''

  // URL 세그먼트를 기반으로 루트 경로 여부 판단
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const isRootPath = pathSegments.length === 2 // ['search', '검색어'] 형태일 때만 루트로 판단

  return (
    <div className={styles['search-main']}>
      <SearchHeader searchQuery={searchQuery} />
      <main className={isRootPath ? '' : 'main-container'}>
        <Outlet />
      </main>
    </div>
  )
}

export default SearchMain
