import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import InputBox from '../inputBox/InputBox'
import SvgIcon from '../SvgIcon'
import { useSearchStore } from '@/stores/searchStore'

interface SearchInputProps {
  placeholder?: string
  onSearch?: (_value: string) => void
  onChange?: (_value: string) => void
  className?: string
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = '검색은 여기에 해주세요',
  onSearch,
  onChange,
  className,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // zustand store에서 검색어 가져오기 (유일한 소스)
  const { searchQuery: storeQuery, setSearchQuery: setStoreQuery } = useSearchStore()
  
  // 로컬 상태 - store 값으로 초기화
  const [searchValue, setSearchValue] = useState(storeQuery)

  // store 값이 변경될 때 input 값 동기화
  useEffect(() => {
    setSearchValue(storeQuery)
  }, [storeQuery])

  const handleSearch = () => {
    if (searchValue.trim()) {
      // store에 저장
      setStoreQuery(searchValue.trim())
      
      if (onSearch) {
        onSearch(searchValue.trim())
      } else {
        const currentPath = location.pathname
        let searchPath = '/search'

        // 현재 검색 페이지에 있으면 현재 탭 유지
        if (currentPath.includes('/search/blog')) {
          searchPath = '/search/blog'
        } else if (currentPath.includes('/search/video')) {
          searchPath = '/search/video'
        } else if (currentPath.includes('/search/legal-knowledge')) {
          searchPath = '/search/legal-knowledge'
        } else if (currentPath.includes('/search/lawyer')) {
          searchPath = '/search/lawyer'
        } else if (currentPath.includes('/search')) {
          // /search 경로에 있으면 전체 검색으로
          searchPath = '/search'
        }

        // URL 쿼리 파라미터 제거 - store만 사용
        navigate(searchPath)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    // 입력 중에는 store 업데이트하지 않음 (검색 실행 시만 업데이트)
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <InputBox
      placeholder={placeholder}
      value={searchValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      icon={<SvgIcon name='search' style={{ marginRight: 13 }} onClick={handleSearch} />}
      className={className}
    />
  )
}

export default SearchInput