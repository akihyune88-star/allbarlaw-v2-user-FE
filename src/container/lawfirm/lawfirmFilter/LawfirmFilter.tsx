import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import styles from './lawfirm-filter.module.scss'
import { LAWFIRM_PERIOD_FILTER_CASE, LAWFIRM_SORT_FILTER_CASE } from '@/constants/filterCase'
import React from 'react'
import { SortType } from '@/types/sortTypes'
import FilterSection from '@/components/filterSection/FilterSection'

type LawfirmFilterProps = {
  filter: {
    orderBy: SortType
    recentDays: 'all' | '7' | '30'
  }
  setFilter: React.Dispatch<
    React.SetStateAction<{
      orderBy: SortType
      recentDays: 'all' | '7' | '30'
    }>
  >
}

const LawfirmFilter = ({ filter, setFilter }: LawfirmFilterProps) => {
  const handleOrderByChange = (sortType: string) => {
    setFilter(prev => ({ ...prev, orderBy: sortType as SortType }))
  }

  const handleRecentDaysChange = (sortType: string) => {
    setFilter(prev => ({ ...prev, recentDays: sortType as 'all' | '7' | '30' }))
  }

  const handleReset = () => {
    setFilter({ orderBy: 'createdAt', recentDays: 'all' })
  }

  return (
    <ContentsRecommender
      title='필터 검색'
      isRefresh={true}
      onRefresh={handleReset}
      contents={
        <div className={styles['lawfirm-filter']}>
          <FilterSection
            title='정렬'
            filterList={LAWFIRM_SORT_FILTER_CASE}
            onClick={handleOrderByChange}
            activeValue={filter.orderBy}
          />
          <FilterSection
            title='신규 등록 로펌'
            filterList={LAWFIRM_PERIOD_FILTER_CASE}
            onClick={handleRecentDaysChange}
            activeValue={filter.recentDays}
          />
        </div>
      }
    />
  )
}

export default LawfirmFilter
