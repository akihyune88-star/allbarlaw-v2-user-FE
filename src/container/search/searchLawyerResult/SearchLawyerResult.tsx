import styles from './searchLawyerResult.module.scss'
import { Lawyer } from '@/types/lawyerTypes'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import Tag from '@/components/tag/Tag'
import { useNavigate } from 'react-router-dom'

type SearchLawyerResultProps = {
  searchResults: Lawyer[]
  isLoading?: boolean
}

const SearchLawyerResult = ({ searchResults, isLoading }: SearchLawyerResultProps) => {
  const navigate = useNavigate()

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

  const handleClickLawyerDetail = (lawyerId: number) => {
    navigate(`/search/lawyer/${lawyerId}`)
  }

  return (
    <div className={styles['lawyer-list-wrapper']}>
      {searchResults.map(lawyer => (
        <LawyerHorizon
          key={lawyer.lawyerId}
          onClick={() => handleClickLawyerDetail(lawyer.lawyerId)}
          tags={lawyer.tags}
          lawyerId={lawyer.lawyerId}
          isBaroTalk={true}
          name={lawyer.lawyerName}
          lawfirm={lawyer.lawfirmName}
          profileImage={lawyer.lawyerProfileImage}
          description={lawyer.lawyerDescription}
          className={styles['lawyer-list-item']}
          ad={true}
          buttonComponent={
            <div className={styles['button-wrapper']}>
              {lawyer.tags?.map(tag => (
                <Tag key={tag.id} tag={tag.name} />
              ))}
            </div>
          }
        />
      ))}
    </div>
  )
}

export default SearchLawyerResult
