import { useState } from 'react'
import SvgIcon from '@/components/SvgIcon'
import styles from './CategoryTitle.module.scss'
import { useCategoryStore } from '@/store/useCategoryStore'

const CategoryTitle = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const { maincategory: _maincategory, subcategory } = useCategoryStore()
  const [mainCategory] = useState('음주/교통')
  const [selectedCategory, setSelectedCategory] = useState('')

  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen)
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setIsCategoryOpen(false)
  }

  const categories = ['음주운전', '무면허 운전', '교통사고', '보복운전', '뺑소니']

  return (
    <div className={styles['category-title']}>
      {/* Desktop View */}
      <h1 className={styles['desktop-title']}>{subcategory?.subcategoryName}</h1>

      {/* Mobile View */}
      <div className={styles['mobile-title']}>
        <h2 onClick={toggleCategory}>
          {mainCategory}
          <SvgIcon
            name='arrowSmall'
            className={`${styles['arrow-icon']} ${isCategoryOpen ? styles.open : ''}`}
            size={16}
          />
        </h2>
        {!isCategoryOpen && <h2>{subcategory?.subcategoryName}</h2>}
      </div>

      {/* Category Selection Panel */}
      {isCategoryOpen && (
        <div className={styles['category-panel']}>
          <div className={styles['category-chips']}>
            {categories.map(category => (
              <div
                key={category}
                className={`${styles['category-chip']} ${selectedCategory === category ? styles.selected : ''}`}
                onClick={() => handleCategorySelect(category)}
              >
                <span>{category}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryTitle
