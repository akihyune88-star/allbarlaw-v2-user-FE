import { useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useRef } from 'react'
import styles from './legal-search-list.module.scss'
import { useInfiniteLegalTermList } from '@/hooks/queries/useLegalTerm'
import { useLegalDictionaryStore } from '@/stores/useLegalDictionaryStore'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const LegalSearchList = () => {
  const navigate = useNavigate()
  const { searchValue, selectedConsonant } = useLegalDictionaryStore()
  const prevSearchRef = useRef<string | undefined>(undefined)

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading, refetch } = useInfiniteLegalTermList({
    orderBy: 'koreanName',
    sort: 'asc',
    search: searchValue || selectedConsonant || undefined,
  })

  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  const handleClick = (id: number) => {
    navigate(`/legal-dictionary/${id}`, {
      state: {
        id,
      },
    })
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
