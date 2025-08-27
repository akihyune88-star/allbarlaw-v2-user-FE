import styles from './lawyerLegalKnowledgeList.module.scss'
import { useOutletContext, useNavigate } from 'react-router-dom'
import type { LawyerLegalKnowledgeLayoutContext } from '../lawyerLegalKnowledgeLayout/LawyerLegalKnowledgeLayout'
import { useInfiniteKnowledgeList } from '@/hooks/queries/useGetKnowledgeList'
import React, { Fragment, useState } from 'react'
import { SortType } from '@/types/sortTypes'
import { getLawyerIdFromToken } from '@/utils/tokenUtils'
import { LOCAL } from '@/constants/local'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Divider from '@/components/divider/Divider'
import SvgIcon from '@/components/SvgIcon'
import { ROUTER } from '@/routes/routerConstant'
import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import { useLawyerDetailForMe } from '@/hooks/queries/useLawyer'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'

interface LegalKnowledgeListHeaderProps {
  sortCase: SortType
  setSortCase: (_sort: SortType) => void
  search: string
  setSearch: (_search: string) => void
  knowledgeCount: number
  onSearch: (_search: string) => void
}

const LegalKnowledgeListHeader = ({
  sortCase,
  setSortCase,
  search,
  knowledgeCount,
  onSearch,
}: LegalKnowledgeListHeaderProps) => {
  const [searchInput, setSearchInput] = useState(search)

  const handleSearch = () => {
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
    <header className={styles['legal-knowledge-list-header']}>
      <div className={styles['legal-knowledge-list-header-top']}>
        <h2 className={styles['legal-knowledge-list-header-title']}>법률 지식인</h2>
      </div>
      <div className={styles['legal-knowledge-list-header-bottom']}>
        <div className={styles['legal-knowledge-list-header-left']}>
          <div className={styles['legal-knowledge-list-header-search']}>
            <input
              type='text'
              placeholder='검색어를 입력하세요'
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles['legal-knowledge-list-header-search-input']}
            />
            <button
              onClick={handleSearch}
              className={styles['legal-knowledge-list-header-search-button']}
              aria-label='검색'
            >
              <SvgIcon name='search' size={20} />
            </button>
          </div>
        </div>
        <div className={styles['legal-knowledge-list-header-actions-right']}>
          <span className={styles['legal-knowledge-list-header-count']}>전체 {knowledgeCount}개</span>
          <div className={styles['legal-knowledge-list-header-sort-buttons']}>
            {sortOptions.map(option => (
              <button
                key={option.value}
                className={`${styles['legal-knowledge-list-header-sort-button']} ${
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

const LawyerLegalKnowledgeList = () => {
  const { selectedSubcategoryId } = useOutletContext<LawyerLegalKnowledgeLayoutContext>()
  const navigate = useNavigate()
  const [sortCase, setSortCase] = useState<SortType>('createdAt')
  const [search, setSearch] = useState<string>('')
  const { data: lawyerBasicInfo } = useLawyerDetailForMe()
  const lawyerId = getLawyerIdFromToken(sessionStorage.getItem(LOCAL.TOKEN) || localStorage.getItem(LOCAL.TOKEN) || '')
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const { knowledgeList, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteKnowledgeList({
    subcategoryId: selectedSubcategoryId ? Number(selectedSubcategoryId) : 'all',
    take: 10,
    orderBy: sortCase === 'all' ? 'createdAt' : (sortCase as 'createdAt' | 'viewCount' | 'likesCount'),
    lawyerId: lawyerId || undefined,
    search: search.trim() || undefined,
  })

  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  const onClickItem = (knowledgeId: number) => {
    navigate(`${ROUTER.LAWYER_ADMIN_CONTENT_LEGAL_KNOWLEDGE_DETAIL}/${knowledgeId}`)
  }

  const onSearch = (search: string) => setSearch(search)

  return (
    <>
      <HeaderPortal>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>{lawyerBasicInfo?.lawyerName}변호사님이 답변한 법률 지식인입니다.</h1>
        </div>
      </HeaderPortal>
      <div className={styles['lawyer-legal-knowledge-list']}>
        <LegalKnowledgeListHeader
          sortCase={sortCase}
          setSortCase={setSortCase}
          search={search}
          setSearch={setSearch}
          knowledgeCount={knowledgeList.length}
          onSearch={onSearch}
        />
        <section className={styles['legal-knowledge-list']} aria-label='법률 지식인 목록'>
          {knowledgeList.length > 0 ? (
            knowledgeList.map((knowledge, index) => (
              <Fragment key={knowledge.knowledgeId}>
                <LegalKnowledgeItem
                  knowledgeKeep={knowledge.isKeep}
                  knowledgeId={knowledge.knowledgeId}
                  title={knowledge.knowledgeTitle}
                  description={knowledge.summaryContent}
                  time={new Date(knowledge.lastMessageAt)}
                  lawyerList={knowledge.lawyers || []}
                  isLastAnswer={true}
                  onClick={() => onClickItem(knowledge.knowledgeId)}
                />
                {index !== knowledgeList.length - 1 && !isMobile && <Divider padding={24} />}
              </Fragment>
            ))
          ) : (
            <div className={styles['legal-knowledge-list-empty']}>
              <p>답변한 법률 지식인이 없습니다.</p>
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default LawyerLegalKnowledgeList
