import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import styles from './lawfirm-filter.module.scss'
import Tag from '@/components/tag/Tag'
import { LAWFIRM_PERIOD_FILTER_CASE, LAWFIRM_SORT_FILTER_CASE } from '@/constants/filterCase'
import React, { useState } from 'react'
import SvgIcon from '@/components/SvgIcon'
import { SortType } from '@/types/sortTypes'

type FilterSectionProps = {
  title: string
  filterList: { filterName: string; sortType: string }[]
  onClick: (_sortType: string) => void
  activeValue?: string
}

const FilterSection = ({ title, filterList, onClick, activeValue }: FilterSectionProps) => {
  const [menuOpen, setMenuOpen] = useState(true)

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen)
  }
  return (
    <section>
      <header className={styles['filter-header']}>
        <h4>{title}</h4>
        <SvgIcon name='arrowSmall' size={16} onClick={handleToggleMenu} />
      </header>
      {menuOpen && (
        <div className={styles['main-filter-list']}>
          {filterList.map(filter => (
            <Tag
              key={filter.filterName}
              tag={filter.filterName}
              onClick={() => onClick(filter.sortType)}
              className={filter.sortType === activeValue ? styles['active-tag'] : ''}
            />
          ))}
        </div>
      )}
    </section>
  )
}

type LawfirmFilterProps = {
  filter: {
    orderBy: SortType
    recentDays: string
  }
  setFilter: React.Dispatch<
    React.SetStateAction<{
      orderBy: SortType
      recentDays: string
    }>
  >
}

const LawfirmFilter = ({ filter, setFilter }: LawfirmFilterProps) => {
  const handleOrderByChange = (sortType: string) => {
    setFilter(prev => ({ ...prev, orderBy: sortType as SortType }))
  }

  const handleRecentDaysChange = (sortType: string) => {
    setFilter(prev => ({ ...prev, recentDays: sortType }))
  }

  return (
    <ContentsRecommender
      title='필터 검색'
      isRefresh={true}
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
