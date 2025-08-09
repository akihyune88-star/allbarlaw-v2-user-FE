import { Outlet, useLocation } from 'react-router-dom'
import SearchHeader from '@/container/search/searchHedaer/SearchHeader'
import styles from './search-main.module.scss'

const SearchMain = () => {
  const location = useLocation()

  // URL 세그먼트를 기반으로 루트 경로 여부 판단
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const isRootPath = pathSegments.length === 1 // ['search'] 형태일 때만 루트로 판단

  return (
    <div className={styles['search-main']}>
      <SearchHeader />
      <main className={isRootPath ? '' : 'main-container'}>
        <Outlet />
      </main>
    </div>
  )
}

export default SearchMain
