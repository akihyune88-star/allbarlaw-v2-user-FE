import { Outlet, useParams } from 'react-router-dom'
import SearchHeader from '@/container/search/searchHedaer/SearchHeader'
import styles from './search-main.module.scss'

const SearchMain = () => {
  const { query } = useParams<{ query: string }>()
  const searchQuery = query || ''

  return (
    <div className={styles['search-main']}>
      <SearchHeader searchQuery={searchQuery} />
      <main className={styles['search-content']}>
        <Outlet />
      </main>
    </div>
  )
}

export default SearchMain
