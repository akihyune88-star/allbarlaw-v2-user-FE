import { Outlet, useLocation, useSearchParams } from 'react-router-dom'
import SearchHeader from '@/container/search/searchHedaer/SearchHeader'
import styles from './search-main.module.scss'
import { useEffect } from 'react'
import { useSearchStore } from '@/stores/searchStore'

const SearchMain = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { setSearchQuery, setSearchLawyerId } = useSearchStore()

  // URL 쿼리 파라미터가 있으면 store에 동기화
  useEffect(() => {
    const urlQuery = searchParams.get('q') || searchParams.get('query') || ''
    const urlLawyerId = searchParams.get('lawyerId')
    
    // 검색어가 있으면 store에 설정
    if (urlQuery) {
      setSearchQuery(urlQuery)
    }
    
    // 변호사 ID가 있으면 store에 설정
    if (urlLawyerId) {
      const lawyerId = parseInt(urlLawyerId)
      if (!isNaN(lawyerId)) {
        setSearchLawyerId(lawyerId)
      }
    } else {
      // URL에 lawyerId가 없으면 store에서도 제거
      setSearchLawyerId(undefined)
    }
  }, [searchParams, setSearchQuery, setSearchLawyerId])

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
