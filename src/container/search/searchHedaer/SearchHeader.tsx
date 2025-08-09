// import SubMenuNavigation from '@/container/subMain/SubMenuNavigation'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './search-header.module.scss'
import Tabs from '@/components/tabs/Tabs'
import { SEARCH_TAB_LIST } from '@/constants/searchConstants'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import SearchInput from '@/components/searchInput/SearchInput'

type SearchHeaderProps = {
  searchQuery: string
}

const SearchHeader = ({ searchQuery }: SearchHeaderProps) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const query = searchParams.get('q') || ''

  const handleMenuClick = (path: string) => {
    // searchQuery prop 또는 URL 파라미터에서 쿼리 값 사용
    const currentSearchValue = searchQuery || query

    const basePath = path === '/' ? '' : path
    navigate(`/search${basePath}?q=${encodeURIComponent(currentSearchValue)}`)
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
          <strong>“{searchQuery}“</strong>
          검색결과 입니다.
        </span>
      )}
      <Tabs items={SEARCH_TAB_LIST} onChange={handleMenuClick} initialPath={'/'} />
    </header>
  )
}

export default SearchHeader
