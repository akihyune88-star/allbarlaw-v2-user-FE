import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import InputBox from '../inputBox/InputBox'
import SvgIcon from '../SvgIcon'

interface SearchInputProps {
  placeholder?: string
  initialValue?: string
  onSearch?: (value: string) => void
  className?: string
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = '검색은 여기에 해주세요',
  initialValue = '',
  onSearch,
  className,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const queryFromUrl = searchParams.get('q') || ''
  const [searchValue, setSearchValue] = useState(initialValue || queryFromUrl)

  // URL 쿼리 파라미터가 변경될 때 input 값 동기화
  useEffect(() => {
    setSearchValue(queryFromUrl)
  }, [queryFromUrl])

  const handleSearch = () => {
    if (searchValue.trim()) {
      if (onSearch) {
        onSearch(searchValue.trim())
      } else {
        const currentPath = location.pathname
        let searchPath = '/search'

        if (currentPath.includes('/search/blog')) {
          searchPath = '/search/blog'
        } else if (currentPath.includes('/search/video')) {
          searchPath = '/search/video'
        } else if (currentPath.includes('/search/legal-knowledge')) {
          searchPath = '/search/legal-knowledge'
        } else if (currentPath.includes('/search/lawyer')) {
          searchPath = '/search/lawyer'
        }

        navigate(`${searchPath}?q=${encodeURIComponent(searchValue.trim())}`)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <InputBox
      placeholder={placeholder}
      value={searchValue}
      onChange={e => setSearchValue(e.target.value)}
      onKeyDown={handleKeyDown}
      icon={<SvgIcon name='search' style={{ marginRight: 13 }} onClick={handleSearch} />}
      className={className}
    />
  )
}

export default SearchInput