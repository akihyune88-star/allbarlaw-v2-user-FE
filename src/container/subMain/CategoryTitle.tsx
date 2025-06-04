import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SvgIcon from '@/components/SvgIcon'
import styles from './CategoryTitle.module.scss'
import { useCategory } from '@/hooks/queries/useCategory'
import { useCategoryInfo } from '@/hooks/useCategoryInfo'

const CategoryTitle = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const navigate = useNavigate()
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const { data: categoryList } = useCategory()

  const categoryInfo = useCategoryInfo(subcategoryId)

  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen)
  }

  const handleCategorySelect = (subcategoryId: number) => {
    navigate(`/${subcategoryId}`)
    setIsCategoryOpen(false)
  }

  const currentMainCategory = categoryList?.find(
    category => category.categoryId === categoryInfo?.mainCategory?.categoryId
  )
  const subcategories = currentMainCategory?.subcategories || []

  if (!categoryInfo) return null

  return (
    <div className={styles['category-title']}>
      {/* Desktop View */}
      <h1 className={styles['desktop-title']}>{categoryInfo.subcategory.subcategoryName}</h1>

      {/* Mobile View */}
      <div className={styles['mobile-title']}>
        <h2 onClick={toggleCategory}>
          {categoryInfo.mainCategory.categoryName}
          <SvgIcon
            name='arrowSmall'
            className={`${styles['arrow-icon']} ${isCategoryOpen ? styles.open : ''}`}
            size={16}
          />
        </h2>
        {!isCategoryOpen && <h2>{categoryInfo.subcategory.subcategoryName}</h2>}
      </div>

      {/* Category Selection Panel */}
      {isCategoryOpen && (
        <div className={styles['category-panel']}>
          <div className={styles['category-chips']}>
            {subcategories.map(subcategory => (
              <div
                key={subcategory.subcategoryId}
                className={`${styles['category-chip']} ${
                  categoryInfo.subcategory.subcategoryId === subcategory.subcategoryId ? styles.selected : ''
                }`}
                onClick={() => handleCategorySelect(subcategory.subcategoryId)}
              >
                <span>{subcategory.subcategoryName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryTitle
