import styles from './total-search.module.scss'

const SearchCount = ({ count }: { count: number }) => {
  return (
    <div className={styles['search-count']}>
      <span>총 {count.toLocaleString()}건이 검색되었습니다. </span>
    </div>
  )
}

const TotalSearch = () => {
  return (
    <>
      <SearchCount count={1000} />
      <div className={styles['total-search']}></div>
    </>
  )
}

export default TotalSearch
