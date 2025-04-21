import { useEffect, useState, useRef } from 'react'
import { useCategoryStore } from '@/store/useCategoryStore'
import styles from './category-selector.module.scss'

type CategorySelectorProps = {
  selection: {
    mainCategoryId: number | null
    subCategoryId: number | null
  }
  onMainCategoryClick: (categoryId: number) => void
  onSubCategoryClick: (subCategoryId: number) => void
}

const CategorySelector = ({ selection, onMainCategoryClick, onSubCategoryClick }: CategorySelectorProps) => {
  const { categoryList } = useCategoryStore()
  const [mainDropdownOpen, setMainDropdownOpen] = useState(false)
  const [subDropdownOpen, setSubDropdownOpen] = useState(false)
  const mainDropdownRef = useRef<HTMLDivElement>(null)
  const subDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mainDropdownRef.current && !mainDropdownRef.current.contains(event.target as Node)) {
        setMainDropdownOpen(false)
      }
      if (subDropdownRef.current && !subDropdownRef.current.contains(event.target as Node)) {
        setSubDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (categoryList && categoryList.length > 0 && selection.mainCategoryId === null) {
      onMainCategoryClick(categoryList[0].id)
    }
  }, [categoryList, selection.mainCategoryId, onMainCategoryClick])

  if (!categoryList) return null

  const selectedMainCategory = categoryList.find(cat => cat.id === selection.mainCategoryId)
  const selectedSubCategory = selectedMainCategory?.subcategories.find(sub => sub.id === selection.subCategoryId)

  const handleMainCategorySelect = (categoryId: number) => {
    onMainCategoryClick(categoryId)
    setMainDropdownOpen(false)
  }

  const handleSubCategorySelect = (subCategoryId: number) => {
    onSubCategoryClick(subCategoryId)
    setSubDropdownOpen(false)
  }

  return (
    <>
      <nav className={styles['desktop-container']} aria-label='카테고리 네비게이션'>
        <section className={styles['category-section']}>
          <header className={styles.title}>대분류</header>

          {/* 데스크톱용 그리드 */}
          <div className={styles.desktopView}>
            <ul className={styles.grid}>
              {categoryList.map(category => (
                <li
                  key={category.id}
                  className={`${styles['grid-item']} ${selection.mainCategoryId === category.id ? styles.active : ''}`}
                  onClick={() => onMainCategoryClick(category.id)}
                >
                  <span>{category.categoryName}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles['category-section']}>
          <header className={styles.title}>소분류</header>
          <div className={styles.desktopView}>
            <ul className={styles.grid}>
              {selection.mainCategoryId &&
                categoryList
                  .find(category => category.id === selection.mainCategoryId)
                  ?.subcategories.map(sub => (
                    <li
                      key={sub.id}
                      className={`${styles['grid-item']} ${selection.subCategoryId === sub.id ? styles.active : ''}`}
                      onClick={() => onSubCategoryClick(sub.id)}
                    >
                      <span>{sub.subcategoryName}</span>
                    </li>
                  ))}
            </ul>
          </div>
        </section>
      </nav>
      {/* 모바일뷰 */}

      <nav className={styles['mobile-container']} aria-label='카테고리 네비게이션'>
        <div className={styles['mobile-view']} ref={mainDropdownRef}>
          <div className={styles['drop-down']} onClick={() => setMainDropdownOpen(!mainDropdownOpen)}>
            <span>{selectedMainCategory?.categoryName || '주 카테고리'}</span>
          </div>
          {mainDropdownOpen && (
            <ul className={styles.dropdownMenu}>
              {categoryList.map(category => (
                <li
                  key={category.id}
                  className={selection.mainCategoryId === category.id ? styles.activeItem : ''}
                  onClick={() => handleMainCategorySelect(category.id)}
                >
                  {category.categoryName}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.mobileView} ref={subDropdownRef}>
          <div className={styles['drop-down']} onClick={() => setSubDropdownOpen(!subDropdownOpen)}>
            <span>{selectedSubCategory?.subcategoryName || '서브카테고리'}</span>
          </div>
          {subDropdownOpen && selectedMainCategory && (
            <ul className={styles.dropdownMenu}>
              {selectedMainCategory.subcategories.map(sub => (
                <li
                  key={sub.id}
                  className={selection.subCategoryId === sub.id ? styles.activeItem : ''}
                  onClick={() => handleSubCategorySelect(sub.id)}
                >
                  {sub.subcategoryName}
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </>
  )
}

export default CategorySelector
