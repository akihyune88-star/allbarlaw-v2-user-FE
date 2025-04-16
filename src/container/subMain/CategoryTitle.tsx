import { useState } from 'react'
import SvgIcon from '@/components/SvgIcon'
import styles from './CategoryTitle.module.scss'

const CategoryTitle = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [mainCategory] = useState('음주/교통')
  const [subCategory] = useState('음주운전')
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
      <h1 className={styles['desktop-title']}>{subCategory}</h1>

      {/* Mobile View */}
      <div className={styles['mobile-title']}>
        <h1 onClick={toggleCategory}>
          {mainCategory}{' '}
          <SvgIcon
            name='arrowSmall'
            className={`${styles['arrow-icon']} ${isCategoryOpen ? styles.open : ''}`}
            size={16}
          />
        </h1>
        {!isCategoryOpen && <h2>{subCategory}</h2>}
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
