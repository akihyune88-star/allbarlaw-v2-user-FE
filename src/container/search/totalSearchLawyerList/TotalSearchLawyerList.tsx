import { Lawyer } from '@/types/lawyerTypes'
import SearchSectionHeader from '../searchSectionHeader/SearchSectionHeader'
import { useNavigate } from 'react-router-dom'
import styles from './totalSearchLawyerList.module.scss'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'

interface TotalSearchLawyerListProps {
  searchResults: Lawyer[]
  query: string
}

const TotalSearchLawyerList = ({ searchResults, query: _query }: TotalSearchLawyerListProps) => {
  const navigate = useNavigate()

  const handleClickMore = () => {
    navigate('/search/lawyer')
  }

  const handleClickLawyerPage = (lawyerId: number) => {
    navigate(`/search/lawyer/${lawyerId}`)
  }

  const handleClickConsultation = (lawyerId: number) => {
    navigate(`/search/lawyer/${lawyerId}/consultation`)
  }

  return (
    <div className={styles['total-search-lawyer-list']}>
      <SearchSectionHeader title='변호사' onClickMore={handleClickMore} />
      <div className={styles['lawyer-list']}>
        {searchResults.map(lawyer => (
          <LawyerHorizon
            key={lawyer.lawyerId}
            name={lawyer.lawyerName}
            profileImage={lawyer.lawyerProfileImage}
            lawfirm={lawyer.lawfirmName}
            description={lawyer.lawyerDescription}
            className={styles['lawyer-list-item']}
            onClick={() => handleClickLawyerPage(lawyer.lawyerId)}
            buttonComponent={
              <div className={styles['button-container']}>
                <button onClick={() => handleClickLawyerPage(lawyer.lawyerId)}>변호사페이지</button>
                <button onClick={() => handleClickConsultation(lawyer.lawyerId)}>상담신청</button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  )
}

export default TotalSearchLawyerList
