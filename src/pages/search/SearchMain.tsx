import SearchHeader from '@/container/search/searchHedaer/SearchHeader'
import { useLocation } from 'react-router-dom'

const SearchMain = () => {
  const { state } = useLocation()
  const searchQuery = state?.searchQuery || ''

  return (
    <main style={{ width: '100%' }}>
      <SearchHeader searchQuery={searchQuery} />
    </main>
  )
}

export default SearchMain
