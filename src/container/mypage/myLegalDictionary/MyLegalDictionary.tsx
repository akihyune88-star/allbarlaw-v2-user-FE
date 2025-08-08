import { useInfiniteMyLegalDictionaryList } from '@/hooks/queries/useMypage'
import styles from './myLegalDictionary.module.scss'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const MyLegalDictionary = ({ sort }: { sort: 'asc' | 'desc' }) => {
  const { legalDictionaryList, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteMyLegalDictionaryList({
      take: 10,
      sort: sort,
    })

  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  return (
    <div className={styles.myLegalDictionary}>
      {legalDictionaryList.length === 0 ? (
        <div className={styles.emptyMessage}>등록된 Keep이 없습니다.</div>
      ) : (
        // 법률 사전 목록 렌더링
        <>
          {legalDictionaryList.map((legalDictionary, index) => (
            <div key={legalDictionary.legalTermId} className={styles.legalDictionaryItem}>
              <p className={styles.koreanName}>{legalDictionary.koreanName}</p>
              <p className={styles.otherName}>
                [{legalDictionary.chineseName}/{legalDictionary.englishName}]
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default MyLegalDictionary
