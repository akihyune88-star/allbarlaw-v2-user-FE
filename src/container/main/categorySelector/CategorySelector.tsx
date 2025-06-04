import { useState } from 'react'
import styles from './category-selector.module.scss'
import { useCategoriesQuery } from '@/hooks/queries/useCategoriesQuery'

type CategorySelectorProps = {
  title?: string
}

const CategorySelector = ({ title = '분류별 법률정보를 찾아보세요' }: CategorySelectorProps) => {
  const { data: categoryList } = useCategoriesQuery()
  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(7) // 부동산을 기본 선택
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(32) // 기타부동산을 기본 선택

  const handleMainCategoryClick = (categoryId: number) => {
    setSelectedMainCategory(categoryId)
    setSelectedSubCategory(null) // 메인 카테고리가 바뀌면 서브 카테고리 선택 해제
  }

  const handleSubCategoryClick = (subCategoryId: number) => {
    setSelectedSubCategory(subCategoryId)
  }

  const selectedCategory = categoryList?.find(category => category.id === selectedMainCategory)

  return (
    <section className={styles.container}>
      {title && (
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </header>
      )}

      {/* 모든 카테고리와 서브카테고리 */}
      <div className={styles['category-grid']}>
        {/* 메인 카테고리들 렌더링 */}
        {categoryList?.map((category, index) => (
          <div
            className={`${styles['icon-wrapper']} ${selectedMainCategory === category.id ? styles.selected : ''}`}
            key={category.id}
            onClick={() => handleMainCategoryClick(category.id)}
            style={{ order: index }}
          >
            <img
              src={selectedMainCategory === category.id ? category.clickedImageUrl : category.imageUrl}
              alt={category.categoryName}
              className={styles.icon}
            />
            <span className={styles['category-name']}>{category.categoryName}</span>
          </div>
        ))}

        {/* 선택된 카테고리의 서브카테고리들 */}
        {selectedCategory && (
          <div
            className={styles['subcategory-inline']}
            style={{
              order: (categoryList?.findIndex(cat => cat.id === selectedMainCategory) ?? 0) + 0.5,
            }}
          >
            {selectedCategory.subcategories.map(subCategory => (
              <button
                key={subCategory.id}
                className={`${styles['subcategory-button']} ${
                  selectedSubCategory === subCategory.id ? styles.selected : ''
                }`}
                onClick={() => handleSubCategoryClick(subCategory.id)}
              >
                {subCategory.subcategoryName}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default CategorySelector
