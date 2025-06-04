import styles from '@/components/sideBar/main-side-bar.module.scss'
import SvgIcon from '../SvgIcon'
import { COLOR } from '@/styles/color'
import { CategoryList } from '@/types/categoryTypes'

interface SideBarProps {
  categories: CategoryList
  selectedMainCategory: number | null
  selectedSubcategory: number | null
  onMainCategoryClick: (id: number) => void
  onSubcategoryClick: (id: number) => void
}

interface CategoryItemProps {
  category: CategoryList[number]
  isActive: boolean
  onClick: () => void
  selectedSubcategory: number | null
  onSubcategoryClick: (id: number) => void
}

const CategoryItem = ({ category, isActive, onClick, selectedSubcategory, onSubcategoryClick }: CategoryItemProps) => {
  return (
    <li className={styles['category-list-item']}>
      <div className={styles['category-list-header']}>
        <h3 className={`${styles.categoryName} ${isActive ? styles.active : ''}`} onClick={onClick}>
          {category.categoryName}
        </h3>
        {isActive && (
          <SvgIcon name='arrowSmall' color={COLOR.green_01} size={16} style={{ transform: 'rotate(180deg)' }} />
        )}
      </div>
      {isActive && (
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
}: SideBarProps) => {
  return (
    <nav className={styles.container} aria-label='카테고리 네비게이션'>
      <ul className={styles['category-list']}>
        {categories.map(category => (
          <CategoryItem
            key={category.categoryId}
            category={category}
            isActive={selectedMainCategory === category.categoryId}
            onClick={() => onMainCategoryClick(category.categoryId)}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryClick={onSubcategoryClick}
          />
        ))}
      </ul>
    </nav>
  )
}

export default SideBar
