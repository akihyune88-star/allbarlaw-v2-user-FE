// import SubMenuNavigation from '@/container/subMain/SubMenuNavigation'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './search-header.module.scss'
import Tabs from '@/components/tabs/Tabs'
import { SEARCH_TAB_LIST } from '@/constants/searchConstants'

type SearchHeaderProps = {
  searchQuery: string
}

const SearchHeader = ({ searchQuery }: SearchHeaderProps) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const handleMenuClick = (path: string) => {
    // 검색창의 현재 값을 가져오기 (input 요소에 id 필요)
    const searchInput = document.querySelector('input[placeholder="검색은 여기에 해주세요"]') as HTMLInputElement
    const currentSearchValue = searchInput?.value?.trim() || query
    
    const basePath = path === '/' ? '' : path
    navigate(`/search${basePath}?q=${encodeURIComponent(currentSearchValue)}`)
  }

  return (
    <header className={styles['search-header']}>
      <h2
        className={styles['title']}
      >{`찾고자하는 법률정보를 검색해보세요.\n업그레이드된 올바로 2.0은 모든 법률정보를 갖고 있습니다. `}</h2>
      <span className={styles['search-query']}>
        <strong>“{searchQuery}“</strong>
        검색결과 입니다.
      </span>
      <Tabs items={SEARCH_TAB_LIST} onChange={handleMenuClick} initialPath={'/'} />
    </header>
  )
}

export default SearchHeader
