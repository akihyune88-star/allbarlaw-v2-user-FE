import { useEffect, useState, useRef } from 'react'
import { useCategoryStore } from '@/store/useCategoryStore'
import styles from './category-selector.module.scss'
import Divider from '@/components/divider/Divider'
import SvgIcon from '@/components/SvgIcon'

type CategorySelectorProps = {
  selection: {
    mainCategoryId: number | null
    subCategoryId: number | null
  }
  onMainCategoryClick: (categoryId: number) => void
  onSubCategoryClick: (subCategoryId: number) => void
}

type DropdownType = 'main' | 'sub' | null

const CategorySelector = ({ selection, onMainCategoryClick, onSubCategoryClick }: CategorySelectorProps) => {
  const { categoryList } = useCategoryStore()
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null)
  const mainDropdownRef = useRef<HTMLDivElement>(null)
  const subDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mainDropdownRef.current &&
        !mainDropdownRef.current.contains(event.target as Node) &&
        subDropdownRef.current &&
        !subDropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null)
      } else if (
        mainDropdownRef.current &&
        !mainDropdownRef.current.contains(event.target as Node) &&
        openDropdown === 'main'
      ) {
        setOpenDropdown(null)
      } else if (
        subDropdownRef.current &&
        !subDropdownRef.current.contains(event.target as Node) &&
        openDropdown === 'sub'
      ) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

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
    setOpenDropdown(null)
  }

  const handleSubCategorySelect = (subCategoryId: number) => {
    onSubCategoryClick(subCategoryId)
    setOpenDropdown(null)
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
          <h2>대분류</h2>
          <div className={styles['drop-down']} onClick={() => setOpenDropdown(openDropdown === 'main' ? null : 'main')}>
            <span className={styles['category-span']}>{selectedMainCategory?.categoryName || '주 카테고리'}</span>
            <SvgIcon name='arrowSmall' />
          </div>
          {openDropdown === 'main' && (
            <ul className={styles['drop-down-menu']}>
              {categoryList.map(category => (
                <li
                  key={category.id}
                  className={selection.mainCategoryId === category.id ? styles.activeItem : ''}
                  onClick={() => handleMainCategorySelect(category.id)}
                >
                  <span className={styles['category-span']}>{category.categoryName}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Divider padding={24} />
        <div className={styles['mobile-view']} ref={subDropdownRef}>
          <h2>소분류</h2>
          <div className={styles['drop-down']} onClick={() => setOpenDropdown(openDropdown === 'sub' ? null : 'sub')}>
            <span className={styles['category-span']}>
              {selectedSubCategory?.subcategoryName || '소분류를 선택해주세요'}
            </span>
            <SvgIcon name='arrowSmall' />
          </div>
          {openDropdown === 'sub' && selectedMainCategory && (
            <ul className={styles['drop-down-menu']}>
              {selectedMainCategory.subcategories.map(sub => (
                <li
                  key={sub.id}
                  className={selection.subCategoryId === sub.id ? styles.activeItem : ''}
                  onClick={() => handleSubCategorySelect(sub.id)}
                >
                  <span className={styles['category-span']}>{sub.subcategoryName}</span>
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
