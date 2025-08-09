import styles from './searchSectionHeader.module.scss'
import SvgIcon from '@/components/SvgIcon'

interface SearchSectionHeaderProps {
  title: string
  onClickMore?: () => void
}

const SearchSectionHeader = ({ title, onClickMore }: SearchSectionHeaderProps) => {
  return (
    <div className={styles['search-content-header']}>
      <span className={styles['title']}>{title}</span>
      <button className={styles['more-button']} onClick={onClickMore}>
        <span>더보기</span>
        <SvgIcon name='arrowSmall' style={{ transform: 'rotate(135deg)' }} />
      </button>
    </div>
  )
}

export default SearchSectionHeader
