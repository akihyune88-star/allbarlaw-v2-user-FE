import { Lawyer } from '@/types/lawyerTypes'
import SearchSectionHeader from '../searchSectionHeader/SearchSectionHeader'
import { useNavigate } from 'react-router-dom'
import styles from './totalSearchLawyerList.module.scss'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import EmptyState from '@/components/EmptyState/EmptyState'
import { LOCAL } from '@/constants/local'
import { ROUTER } from '@/routes/routerConstant'
import React from 'react'

interface TotalSearchLawyerListProps {
  searchResults: Lawyer[]
  query: string
}

const TotalSearchLawyerList = ({ searchResults, query: _query }: TotalSearchLawyerListProps) => {
  const navigate = useNavigate()

  const handleClickMore = () => {
    navigate('/search/lawyer')
  }

  const handleClickLawyerPage = (e: React.MouseEvent, lawyerId: number) => {
    e.stopPropagation() // 이벤트 버블링 방지
    navigate(`/search/lawyer/${lawyerId}`)
  }

  const handleClickConsultation = (e: React.MouseEvent, lawyerId: number) => {
    e.stopPropagation() // 이벤트 버블링 방지
    sessionStorage.setItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString())
    navigate(ROUTER.REQUEST_BARO_TALK)
  }

  return (
    <div className={styles['total-search-lawyer-list']}>
      <SearchSectionHeader title='변호사' onClickMore={handleClickMore} />
      {searchResults.length === 0 ? (
        <EmptyState message='검색 결과가 없습니다.' />
      ) : (
        <div className={styles['lawyer-list']}>
          {searchResults.map(lawyer => (
            <LawyerHorizon
              key={lawyer.lawyerId}
              lawyerId={lawyer.lawyerId}
              name={lawyer.lawyerName}
              profileImage={lawyer.lawyerProfileImage}
              lawfirm={lawyer.lawfirmName}
              description={lawyer.lawyerDescription}
              className={styles['lawyer-list-item']}
              onClick={(e) => handleClickLawyerPage(e, lawyer.lawyerId)}
              buttonComponent={
                <div className={styles['button-container']}>
                  <button onClick={e => handleClickLawyerPage(e, lawyer.lawyerId)}>변호사페이지</button>
                  <button onClick={e => handleClickConsultation(e, lawyer.lawyerId)}>상담신청</button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TotalSearchLawyerList
