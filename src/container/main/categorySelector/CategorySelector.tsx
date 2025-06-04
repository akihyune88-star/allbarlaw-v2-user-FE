import { useState } from 'react'
import styles from './category-selector.module.scss'
import { useCategoriesQuery } from '@/hooks/queries/useCategoriesQuery'
import { chunk } from '@/utils/arrayUtils'
import { MainCategory, SubCategory } from '@/types/categoryTypes'

type CategorySelectorProps = {
  title?: string
  onSubCategoryClick?: (mainCategory: MainCategory, subCategory: SubCategory) => void
}

const CategorySelector = ({ title = '분류별 법률정보를 찾아보세요', onSubCategoryClick }: CategorySelectorProps) => {
  const { data: categoryList } = useCategoriesQuery()
  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(7) // 부동산을 기본 선택
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(32) // 기타부동산을 기본 선택

  const handleMainCategoryClick = (categoryId: number) => {
    setSelectedMainCategory(categoryId)
    setSelectedSubCategory(null) // 메인 카테고리가 바뀌면 서브 카테고리 선택 해제
  }

  const handleSubCategoryClick = (mainCategory: MainCategory, subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory.id)
    onSubCategoryClick?.(mainCategory, subCategory) // 메인카테고리와 서브카테고리 객체 함께 전달
  }

  // 카테고리 리스트를 9개씩 그룹으로 나누기
  const categoryGroups = categoryList ? chunk(categoryList, 9) : []

  return (
    <section className={styles.container}>
      {title && (
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </header>
      )}

      <div className={styles['category-container']}>
        {categoryGroups.map((group, groupIndex) => {
          // 현재 그룹에 선택된 카테고리가 있는지 확인
          const selectedCategoryInGroup = group.find(category => category.id === selectedMainCategory)

          return (
            <div key={groupIndex} className={styles['category-group']}>
              {/* 현재 그룹의 카테고리들 */}
              <div className={styles['category-row']}>
                {group.map(category => (
                  <div
                    className={`${styles['icon-wrapper']} ${
                      selectedMainCategory === category.id ? styles.selected : ''
                    }`}
                    key={category.id}
                    onClick={() => handleMainCategoryClick(category.id)}
                  >
                    <img
                      src={selectedMainCategory === category.id ? category.clickedImageUrl : category.imageUrl}
                      alt={category.categoryName}
                      className={styles.icon}
                    />
                    <span className={styles['category-name']}>{category.categoryName}</span>
                  </div>
                ))}
              </div>

              {/* 이 그룹에 선택된 카테고리가 있으면 서브카테고리 아코디언 표시 */}
              {selectedCategoryInGroup && (
                <div className={styles['subcategory-accordion']}>
                  <div className={styles['subcategory-container']}>
                    {selectedCategoryInGroup.subcategories.map(subCategory => (
                      <button
                        key={subCategory.id}
                        className={`${styles['subcategory-button']} ${
                          selectedSubCategory === subCategory.id ? styles.selected : ''
                        }`}
                        onClick={() => handleSubCategoryClick(selectedCategoryInGroup, subCategory)}
                      >
                        {subCategory.subcategoryName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default CategorySelector
