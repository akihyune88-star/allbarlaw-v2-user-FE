import { useNavigate } from 'react-router-dom'
import styles from './searchLawyerResult.module.scss'
import LawyerCard from '@/components/lawyerCard/LawyerCard'
import { Lawyer } from '@/types/lawyerTypes'

type SearchLawyerResultProps = {
  searchResults: Lawyer[]
  isLoading?: boolean
}

const SearchLawyerResult = ({ searchResults, isLoading }: SearchLawyerResultProps) => {
  const navigate = useNavigate()

  const handleLawyerClick = (lawyerId: number) => {
    navigate(`/search/lawyer/${lawyerId}${window.location.search}`)
  }

  if (isLoading) {
    return (
      <div className={styles['search-lawyer-result']}>
        <div className={styles['loading']}>검색 중...</div>
      </div>
    )
  }

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className={styles['search-lawyer-result']}>
        <div className={styles['no-results']}>검색 결과가 없습니다.</div>
      </div>
    )
  }

  return (
    <div className={styles['search-lawyer-result']}>
      <div className={styles['lawyer-grid']}>
        {searchResults.map(lawyer => (
          <LawyerCard key={lawyer.lawyerId} lawyer={lawyer} onClick={() => handleLawyerClick(lawyer.lawyerId)} />
        ))}
      </div>
    </div>
  )
}

export default SearchLawyerResult
