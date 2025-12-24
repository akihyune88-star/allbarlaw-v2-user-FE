import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
// import FilterSection from '@/components/filterSection/FilterSection'
import styles from './lawyerFilter.module.scss'
import FilterSection from '@/components/filterSection/FilterSection'
import { LAWYER_SORT_ACHIEVEMENT_CASE, LAWYER_SORT_GENDER_CASE, LAWYER_SORT_REGION_CASE } from '@/constants/filterCase'
// import { useState } from 'react'
import { LawyerListFilter } from '@/types/lawyerTypes'

type LawyerFilterProps = {
  filter: LawyerListFilter
  onFilterChange: (filter: LawyerListFilter) => void
  className?: string
}

const LawyerFilter = ({ filter, onFilterChange, className }: LawyerFilterProps) => {
  const handleOrderByChange = (orderBy: string) => {
    onFilterChange({ ...filter, orderBy: orderBy as LawyerListFilter['orderBy'] })
  }

  const handleRegionChange = (region: string) => {
    onFilterChange({ ...filter, region: region as LawyerListFilter['region'] })
  }

  const handleGenderChange = (gender: string) => {
    onFilterChange({ ...filter, gender: gender as LawyerListFilter['gender'] })
  }

  const handleReset = () => onFilterChange({ orderBy: 'careerDesc', region: 'all', gender: 'all' })

  return (
    <ContentsRecommender
      title='필터 검색'
      isRefresh={true}
      onRefresh={handleReset}
      className={className}
      contents={
        <div className={styles['lawyer-filter']}>
          <FilterSection
            title='정렬'
            filterList={LAWYER_SORT_ACHIEVEMENT_CASE}
            onClick={handleOrderByChange}
            activeValue={filter.orderBy}
          />
          <FilterSection
            title='지역'
            filterList={LAWYER_SORT_REGION_CASE}
            onClick={handleRegionChange}
            activeValue={filter.region}
          />
          <FilterSection
            title='성별'
            filterList={LAWYER_SORT_GENDER_CASE}
            onClick={handleGenderChange}
            activeValue={filter.gender}
          />
        </div>
      }
    />
  )
}

export default LawyerFilter
