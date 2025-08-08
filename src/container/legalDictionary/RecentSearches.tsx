import { useRecentSearches } from '@/hooks/queries/useLegalTerm'
import styles from './recent-searches.module.scss'

const RecentSearches = () => {
  const { data: recentSearches } = useRecentSearches()

  return (
    <div className={styles.container}>
      <div className={styles['title-wrapper']}>
        <h3 className={styles.title}>{`최근\n검색어`}</h3>
      </div>
      <div className={styles['divider']} />
      <div className={styles['search-history-wrapper']}>
        {!recentSearches || recentSearches.length === 0 ? (
          <div className={styles['empty-state']}>
            <p className={styles['empty-text']}>최근 검색한 용어가 없습니다</p>
          </div>
        ) : (
          recentSearches.map(item => (
            <span key={item.legalTermId}>
              {item.koreanName} [{item.chineseName}]
            </span>
          ))
        )}
      </div>
    </div>
  )
}

export default RecentSearches
