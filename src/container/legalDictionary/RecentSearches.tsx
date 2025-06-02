import styles from './recent-searches.module.scss'

interface SearchHistoryProps {
  searchHistory: string[]
}

const RecentSearches = ({ searchHistory }: SearchHistoryProps) => {
  return (
    <div className={styles.container}>
      <div className={styles['title-wrapper']}>
        <h3 className={styles.title}>{`최근\n검색어`}</h3>
      </div>
      <div className={styles['divider']} />
      <div className={styles['search-history-wrapper']}>
        {searchHistory.map(item => (
          <span>{item}</span>
        ))}
      </div>
    </div>
  )
}

export default RecentSearches
