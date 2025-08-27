import styles from './lawyerBlogList.module.scss'
import { useOutletContext, useNavigate } from 'react-router-dom'
import type { LawyerBlogLayoutContext } from '../lawyerBlogLayout/LawyerBlogLayout'
import { useInfiniteBlogList } from '@/hooks/queries/useGetBlogList'
import React, { useState } from 'react'
import { SortType } from '@/types/sortTypes'
import { getLawyerIdFromToken } from '@/utils/tokenUtils'
import { LOCAL } from '@/constants/local'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import BlogItem from '@/components/blogItem/BlogItem'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Divider from '@/components/divider/Divider'
// import { ROUTER } from '@/routes/routerConstant'
import SvgIcon from '@/components/SvgIcon'

interface BlogListHeaderProps {
  sortCase: SortType
  setSortCase: (_sort: SortType) => void
  search: string
  setSearch: (_search: string) => void
  blogCount: number
  onSearch: (_search: string) => void
}

const BlogListHeader = ({ sortCase, setSortCase, search, setSearch, blogCount, onSearch }: BlogListHeaderProps) => {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState(search)

  const handleSearch = () => {
    console.log(searchInput)
    onSearch(searchInput)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const sortOptions = [
    { value: 'createdAt', label: '최신순' },
    { value: 'viewCount', label: '조회순' },
    { value: 'likesCount', label: '추천순' },
  ]

  return (
    <header className={styles['blog-list-header']}>
      <div className={styles['blog-list-header-top']}>
        <h2 className={styles['blog-list-header-title']}>블로그 글</h2>
      </div>
      <div className={styles['blog-list-header-bottom']}>
        <div className={styles['blog-list-header-left']}>
          <select
            className={styles['blog-list-header-select']}
            value={sortCase}
            onChange={e => setSortCase(e.target.value as SortType)}
          >
            <option value='all'>선택</option>
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className={styles['blog-list-header-search']}>
            <input
              type='text'
              placeholder='검색어를 입력하세요'
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles['blog-list-header-search-input']}
            />
            <button onClick={handleSearch} className={styles['blog-list-header-search-button']} aria-label='검색'>
              <SvgIcon name='search' size={20} />
            </button>
          </div>
        </div>
        <div className={styles['blog-list-header-actions-right']}>
          <span className={styles['blog-list-header-count']}>전체 {blogCount}개</span>
          <div className={styles['blog-list-header-sort-buttons']}>
            {sortOptions.map(option => (
              <button
                key={option.value}
                className={`${styles['blog-list-header-sort-button']} ${
                  sortCase === option.value ? styles.active : ''
                }`}
                onClick={() => setSortCase(option.value as SortType)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

const LawyerBlogList = () => {
  const { selectedSubcategoryId } = useOutletContext<LawyerBlogLayoutContext>()
  const [sortCase, setSortCase] = useState<SortType>('createdAt')
  const [search, setSearch] = useState<string>('')
  const lawyerId = getLawyerIdFromToken(sessionStorage.getItem(LOCAL.TOKEN) || localStorage.getItem(LOCAL.TOKEN) || '')
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const { blogList, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteBlogList({
    subcategoryId: selectedSubcategoryId ? Number(selectedSubcategoryId) : 'all',
    take: 10,
    orderBy: sortCase === 'all' ? 'createdAt' : (sortCase as 'createdAt' | 'viewCount' | 'likesCount'),
    lawyerId: lawyerId || undefined,
    search: search || undefined,
  })

  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  const onClickItem = (blogCaseId: number) => {
    console.log(blogCaseId)
  }

  const onSearch = (search: string) => {
    console.log('onSearch', search)
    setSearch(search)
  }

  return (
    <div className={styles['lawyer-blog-list']}>
      <BlogListHeader
        sortCase={sortCase}
        setSortCase={setSortCase}
        search={search}
        setSearch={setSearch}
        blogCount={blogList.length}
        onSearch={onSearch}
      />
      <section className={styles['blog-list']} aria-label='블로그 목록'>
        {blogList.map((blogItem, idx) => (
          <React.Fragment key={blogItem.blogCaseId}>
            <BlogItem type='regular' item={blogItem} onClick={() => onClickItem(blogItem.blogCaseId)} />
            {isMobile || (idx !== blogList.length - 1 && <Divider padding={0} />)}
          </React.Fragment>
        ))}
      </section>
    </div>
  )
}

export default LawyerBlogList
