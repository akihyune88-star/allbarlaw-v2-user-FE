import styles from '@/components/sideBar/main-side-bar.module.scss'
import SvgIcon from '../SvgIcon'
import { COLOR } from '@/styles/color'
import { CategoryList } from '@/types/categoryTypes'

interface SideBarProps {
  categories: CategoryList
  selectedMainCategory: number | null
  selectedSubCategory: number | null
  onMainCategoryClick: (id: number) => void
  onSubCategoryClick: (id: number) => void
}

interface CategoryItemProps {
  category: CategoryList[number]
  isActive: boolean
  onClick: () => void
  selectedSubCategory: number | null
  onSubCategoryClick: (id: number) => void
}

const CategoryItem = ({ category, isActive, onClick, selectedSubCategory, onSubCategoryClick }: CategoryItemProps) => {
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
                backgroundColor: selectedSubCategory === subcategory.subcategoryId ? COLOR.bg_gray_02 : 'transparent',
              }}
              onClick={() => onSubCategoryClick(subcategory.subcategoryId)}
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
  selectedSubCategory,
  onMainCategoryClick,
  onSubCategoryClick,
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
            selectedSubCategory={selectedSubCategory}
            onSubCategoryClick={onSubCategoryClick}
          />
        ))}
      </ul>
    </nav>
  )
}

export default SideBar
