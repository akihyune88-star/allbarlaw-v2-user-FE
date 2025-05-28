import { useLocation } from 'react-router-dom'

const SearchMain = () => {
  const { state } = useLocation()
  const searchQuery = state?.searchQuery || ''
  console.log('검색어:', searchQuery)

  return <div>서치페이지 메인 - 검색어: {searchQuery}</div>
}

export default SearchMain
