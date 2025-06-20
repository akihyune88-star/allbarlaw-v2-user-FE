import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import styles from './lawfirm-filter.module.scss'
import Tag from '@/components/tag/Tag'
import { LAWFIRM_MAIN_FILTER_CASE } from '@/constants/filterCase'
import React, { useState } from 'react'
import SvgIcon from '@/components/SvgIcon'

type FilterSectionProps = {
  title: string
  filterList: { filterName: string; sortType: string }[]
  onClick: (_sortType: string) => void
}

const FilterSection = ({ title, filterList, onClick }: FilterSectionProps) => {
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
            <Tag key={filter.filterName} tag={filter.filterName} onClick={() => onClick(filter.sortType)} />
          ))}
        </div>
      )}
    </section>
  )
}

type LawfirmFilterProps = {
  filter: {
    orderBy: string
    recentDays: string
  }
  setFilter: React.Dispatch<
    React.SetStateAction<{
      orderBy: string
      recentDays: string
    }>
  >
}

const LawfirmFilter = ({ filter: _filter, setFilter: _setFilter }: LawfirmFilterProps) => {
  const handleRefresh = () => {}

  const handleOrderBy = (sortType: string) => {
    _setFilter({ ..._filter, orderBy: sortType })
  }

  return (
    <ContentsRecommender
      title='필터 검색'
      onRefresh={handleRefresh}
      contents={
        <div className={styles['lawfirm-filter']}>
          <FilterSection title='정렬' filterList={LAWFIRM_MAIN_FILTER_CASE} onClick={_sortType => {}} />
          <FilterSection title='지역' filterList={LAWFIRM_MAIN_FILTER_CASE} onClick={_sortType => {}} />
        </div>
      }
    />
  )
}

export default LawfirmFilter
