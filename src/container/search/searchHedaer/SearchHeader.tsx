// import SubMenuNavigation from '@/container/subMain/SubMenuNavigation'
import { useNavigate } from 'react-router-dom'
import styles from './search-header.module.scss'
import Tabs from '@/components/tabs/Tabs'
import { SEARCH_TAB_LIST } from '@/constants/searchConstants'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import SearchInput from '@/components/searchInput/SearchInput'
import { useSearchStore } from '@/stores/searchStore'

const SearchHeader = () => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 80rem)')
  
  // zustand store에서 검색어 가져오기 (유일한 소스)
  const { searchQuery: storeQuery } = useSearchStore()

  const handleMenuClick = (path: string) => {
    const basePath = path === '/' ? '' : path
    // URL 쿼리 파라미터 제거 - store만 사용
    navigate(`/search${basePath}`)
  }

  return (
    <header className={styles['search-header']}>
      <h2 className={styles['title']}>
        {isMobile
          ? `찾고자하는 법률정보를 검색해보세요.\n업그레이드된 올바로 2.0은 \n모든 법률정보를 갖고 있습니다. `
          : `찾고자하는 법률정보를 검색해보세요.\n업그레이드된 올바로 2.0은 모든 법률정보를 갖고 있습니다. `}
      </h2>
      {isMobile ? (
        <div className={styles['search-input-container']}>
          <SearchInput className={styles['search-input']} />
        </div>
      ) : (
        <span className={styles['search-query']}>
          <strong>"{storeQuery}"</strong>
          검색결과 입니다.
        </span>
      )}
      <Tabs items={SEARCH_TAB_LIST} onChange={handleMenuClick} initialPath={'/'} />
    </header>
  )
}

export default SearchHeader
