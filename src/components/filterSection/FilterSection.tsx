import { useState } from 'react'
import SvgIcon from '../SvgIcon'
import Tag from '../tag/Tag'
import styles from './filterSection.module.scss'

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
        <SvgIcon
          name='arrowSmall'
          size={16}
          onClick={handleToggleMenu}
          style={{
            cursor: 'pointer',
            transform: menuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        />
      </header>
      {menuOpen && (
        <div className={styles['main-filter-list']}>
          {filterList.map(filter => (
            <Tag
              key={filter.filterName}
              tag={filter.filterName}
              onClick={() => onClick(filter.sortType)}
              className={
                filter.sortType === activeValue || (filter.sortType === 'all' && activeValue === undefined)
                  ? styles['active-tag']
                  : ''
              }
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default FilterSection
