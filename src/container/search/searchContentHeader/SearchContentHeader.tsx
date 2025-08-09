import styles from './searchContentHeader.module.scss'
import { SortType } from '@/types/sortTypes'

type SearchContentHeaderProps = {
  amount: number
  searchTab: SortType
  handleSearchTab: (_sort: SortType) => void
}

const SearchContentHeader = ({ amount, searchTab, handleSearchTab }: SearchContentHeaderProps) => {
  const handleTabClick = (tab: SortType) => {
    handleSearchTab(tab)
  }

  return (
    <div className={styles['search-content-header']}>
      <span className={styles['amount']}>총 {amount.toLocaleString()}건이 검색되었습니다. </span>
      <section className={styles['button-wrapper']}>
        <button
          onClick={() => handleTabClick('viewCount')}
          className={searchTab === 'viewCount' ? styles['active'] : ''}
        >
          추천수
        </button>
        <button
          onClick={() => handleTabClick('likesCount')}
          className={searchTab === 'likesCount' ? styles['active'] : ''}
        >
          공감순
        </button>
        <button
          onClick={() => handleTabClick('createdAt')}
          className={searchTab === 'createdAt' ? styles['active'] : ''}
        >
          최신순
        </button>
      </section>
    </div>
  )
}

export default SearchContentHeader
