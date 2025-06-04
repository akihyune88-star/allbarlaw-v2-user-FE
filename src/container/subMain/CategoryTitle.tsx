import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SvgIcon from '@/components/SvgIcon'
import styles from './CategoryTitle.module.scss'
import { useCategory } from '@/hooks/queries/useCategory'

const CategoryTitle = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const navigate = useNavigate()
  const { subCategoryId } = useParams<{ subCategoryId: string }>()
  const { data: categoryList } = useCategory()

  const categoryInfo = useMemo(() => {
    if (!subCategoryId || !categoryList) return null

    const currentSubCategoryId = Number(subCategoryId)

    for (const category of categoryList) {
      const subCategory = category.subcategories.find(sub => sub.subcategoryId === currentSubCategoryId)
      if (subCategory) {
        return {
          mainCategory: {
            categoryId: category.categoryId,
            categoryName: category.categoryName,
          },
          subCategory: {
            subcategoryId: subCategory.subcategoryId,
            subcategoryName: subCategory.subcategoryName,
          },
        }
      }
    }
    return null
  }, [subCategoryId, categoryList])

  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen)
  }

  const handleCategorySelect = (subcategoryId: number) => {
    navigate(`/${subcategoryId}`)
    setIsCategoryOpen(false)
  }

  // 현재 메인카테고리의 서브카테고리들 가져오기
  const currentMainCategory = categoryList?.find(
    category => category.categoryId === categoryInfo?.mainCategory?.categoryId
  )
  const subcategories = currentMainCategory?.subcategories || []

  if (!categoryInfo) return null

  return (
    <div className={styles['category-title']}>
      {/* Desktop View */}
      <h1 className={styles['desktop-title']}>{categoryInfo.subCategory.subcategoryName}</h1>

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
        {!isCategoryOpen && <h2>{categoryInfo.subCategory.subcategoryName}</h2>}
      </div>

      {/* Category Selection Panel */}
      {isCategoryOpen && (
        <div className={styles['category-panel']}>
          <div className={styles['category-chips']}>
            {subcategories.map(subcategory => (
              <div
                key={subcategory.subcategoryId}
                className={`${styles['category-chip']} ${
                  categoryInfo.subCategory.subcategoryId === subcategory.subcategoryId ? styles.selected : ''
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
