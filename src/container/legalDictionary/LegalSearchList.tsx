import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './legal-search-list.module.scss'
import { useInfiniteLegalTermList, useInfiniteSearchLegalTermList } from '@/hooks/queries/useLegalTerm'
import { useLegalDictionaryStore } from '@/stores/useLegalDictionaryStore'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'

const LegalSearchList = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { searchValue, selectedConsonant } = useLegalDictionaryStore()

  const isSearchMode = !!searchValue

  const termListQuery = useInfiniteLegalTermList(
    {
      orderBy: 'koreanName',
      sort: 'asc',
      consonant: selectedConsonant || '',
    },
    { enabled: !isSearchMode }
  )

  const searchListQuery = useInfiniteSearchLegalTermList(searchValue || '', { enabled: isSearchMode })

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading, refetch } = isSearchMode
    ? searchListQuery
    : termListQuery

  useEffect(() => {
    if (!isSearchMode && selectedConsonant) {
      queryClient.resetQueries({
        queryKey: [QUERY_KEY.LEGAL_TERM_LIST, 'infinite', 'koreanName', 'asc', 'all', selectedConsonant || 'all'],
      })
      refetch()
    }
  }, [selectedConsonant, isSearchMode, queryClient, refetch])

  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  const handleClick = (id: number) => {
    navigate(`/legal-dictionary/${id}`)
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles['loading']}>로딩 중...</div>
      </div>
    )
  }

  if (!data?.legalTermList || data.legalTermList.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles['empty']}>검색 결과가 없습니다.</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {data.legalTermList.map(item => (
        <div key={item.legalTermId} className={styles['legal-item']} onClick={() => handleClick(item.legalTermId)}>
          <span className={styles['legal-item-korean']}>{item.koreanName}</span>
          <span className={styles['legal-item-other-lang']}>
            [{item.chineseName} / {item.englishName}]
          </span>
        </div>
      ))}
      {isFetchingNextPage && <div className={styles['loading']}>추가 로딩 중...</div>}
    </div>
  )
}

export default LegalSearchList
