import { useNavigate } from 'react-router-dom'
import styles from './searchLawyerResult.module.scss'
import { Lawyer } from '@/types/lawyerTypes'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import Divider from '@/components/divider/Divider'
import Tag from '@/components/tag/Tag'

type SearchLawyerResultProps = {
  searchResults: Lawyer[]
  isLoading?: boolean
}

const SearchLawyerResult = ({ searchResults, isLoading }: SearchLawyerResultProps) => {
  const navigate = useNavigate()

  const _handleLawyerClick = (lawyerId: number) => {
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
    <div>
      {searchResults.map((lawyer, index) => (
        <>
          <LawyerHorizon
            // onClick={() => handleLawyerDetail(lawyer.lawyerId.toString())}
            tags={lawyer.tags}
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
          {index !== searchResults.length - 1 && <Divider padding={16} />}
        </>
      ))}
    </div>
  )
}

export default SearchLawyerResult
