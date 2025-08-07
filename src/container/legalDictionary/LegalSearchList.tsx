import { useNavigate } from 'react-router-dom'
import { useCallback, useEffect } from 'react'
import styles from './legal-search-list.module.scss'
import { useInfiniteLegalTermList } from '@/hooks/queries/useLegalTerm'
import { useLegalDictionaryStore } from '@/stores/useLegalDictionaryStore'

const LegalSearchList = () => {
  const navigate = useNavigate()
  const { searchValue, selectedConsonant } = useLegalDictionaryStore()

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useInfiniteLegalTermList({
    orderBy: 'koreanName',
    sort: 'asc',
    search: searchValue || selectedConsonant || undefined,
  })

  const handleScroll = useCallback(() => {
    // window 스크롤 사용
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = window.innerHeight
    
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200

    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    // window에 스크롤 이벤트 추가
    window.addEventListener('scroll', handleScroll)
    
    // 컴포넌트 마운트 시 스크롤 체크
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

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
