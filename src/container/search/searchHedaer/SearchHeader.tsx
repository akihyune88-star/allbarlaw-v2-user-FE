// import SubMenuNavigation from '@/container/subMain/SubMenuNavigation'
import styles from './search-header.module.scss'

type SearchHeaderProps = {
  searchQuery: string
}

const SearchHeader = ({ searchQuery }: SearchHeaderProps) => {
  return (
    <header className={styles['search-header']}>
      <h2
        className={styles['title']}
      >{`찾고자하는 법률정보를 검색해보세요.\n업그레이드된 올바로 2.0은 모든 법률정보를 갖고 있습니다. `}</h2>
      <span className={styles['search-query']}>
        <strong>“{searchQuery}“</strong>
        검색결과 입니다.
      </span>
      {/* <SubMenuNavigation /> */}
    </header>
  )
}

export default SearchHeader
