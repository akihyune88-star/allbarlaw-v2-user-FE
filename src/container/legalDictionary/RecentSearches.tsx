import { usePopularLegalTermList } from '@/hooks/queries/useLegalTerm'
import styles from './recent-searches.module.scss'

const RecentSearches = () => {
  const { data: popularLegalTermList } = usePopularLegalTermList()
  console.log('popularLegalTermList', popularLegalTermList)
  if (!popularLegalTermList) return null

  return (
    <div className={styles.container}>
      <div className={styles['title-wrapper']}>
        <h3 className={styles.title}>{`최근\n검색어`}</h3>
      </div>
      <div className={styles['divider']} />
      <div className={styles['search-history-wrapper']}>
        {popularLegalTermList.map(item => (
          <span key={item.legalTermId}>
            {item.koreanName} [{item.chineseName}]
          </span>
        ))}
      </div>
    </div>
  )
}

export default RecentSearches
