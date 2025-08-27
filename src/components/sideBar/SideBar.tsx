import styles from '@/components/sideBar/main-side-bar.module.scss'
import SvgIcon from '../SvgIcon'
import { COLOR } from '@/styles/color'
import { CategoryList } from '@/types/categoryTypes'

interface SideBarProps {
  categories: CategoryList
  selectedMainCategory: number | null
  selectedSubcategory: number | null
  onMainCategoryClick: (_id: number) => void
  onSubcategoryClick: (_id: number) => void
  alwaysExpanded?: boolean // 항상 펼쳐보기 옵션
  className?: string
}

interface CategoryItemProps {
  category: CategoryList[number]
  isActive: boolean
  onClick: () => void
  selectedSubcategory: number | null
  onSubcategoryClick: (_id: number) => void
  alwaysExpanded?: boolean // 항상 펼쳐보기 옵션
}

const CategoryItem = ({
  category,
  isActive,
  onClick,
  selectedSubcategory,
  onSubcategoryClick,
  alwaysExpanded,
}: CategoryItemProps) => {
  const shouldShowSubcategories = alwaysExpanded || isActive

  // 현재 카테고리의 서브카테고리가 선택되었는지 확인
  const hasSelectedSubcategory = category.subcategories.some(sub => sub.subcategoryId === selectedSubcategory)

  return (
    <li className={styles['category-list-item']}>
      <div className={styles['category-list-header']}>
        <h3
          className={`${styles.categoryName} ${isActive || hasSelectedSubcategory ? styles.active : ''}`}
          onClick={alwaysExpanded ? undefined : onClick}
          style={{ cursor: alwaysExpanded ? 'default' : 'pointer' }}
        >
          {category.categoryName}
        </h3>
        {isActive && !alwaysExpanded && (
          <SvgIcon name='arrowSmall' color={COLOR.green_01} size={16} style={{ transform: 'rotate(90deg)' }} />
        )}
      </div>
      {shouldShowSubcategories && (
        <ul className={styles['subcategory-list']}>
          {category.subcategories.map(subcategory => (
            <li
              key={subcategory.subcategoryId}
              className={styles['subcategory-item']}
              style={{
                backgroundColor: selectedSubcategory === subcategory.subcategoryId ? COLOR.bg_gray_02 : 'transparent',
              }}
              onClick={() => onSubcategoryClick(subcategory.subcategoryId)}
            >
              <span>{subcategory.subcategoryName}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

const SideBar = ({
  categories,
  selectedMainCategory,
  selectedSubcategory,
  onMainCategoryClick,
  onSubcategoryClick,
  alwaysExpanded = false,
  className,
}: SideBarProps) => {
  return (
    <nav className={`${styles.container} ${className}`} aria-label='카테고리 네비게이션'>
      <ul className={styles['category-list']}>
        {categories.map(category => (
          <CategoryItem
            key={category.categoryId}
            category={category}
            isActive={selectedMainCategory === category.categoryId}
            onClick={() => onMainCategoryClick(category.categoryId)}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryClick={onSubcategoryClick}
            alwaysExpanded={alwaysExpanded}
          />
        ))}
      </ul>
    </nav>
  )
}

export default SideBar
