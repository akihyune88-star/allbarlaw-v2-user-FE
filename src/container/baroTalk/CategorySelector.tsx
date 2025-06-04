import styles from './category-selector.module.scss'
import Divider from '@/components/divider/Divider'
import SvgIcon from '@/components/SvgIcon'
import { useDropdown } from '@/hooks'
import { useCategory } from '@/hooks/queries/useCategory'

type DropdownType = 'main' | 'sub'

type CategorySelectorProps = {
  selection: {
    mainCategoryId: number | null
    subCategoryId: number | null
  }
  onMainCategoryClick: (categoryId: number) => void
  onSubCategoryClick: (subCategoryId: number) => void
}

const CategorySelector = ({ selection, onMainCategoryClick, onSubCategoryClick }: CategorySelectorProps) => {
  const {
    openDropdown,
    mainDropdownRef,
    subDropdownRef,
    mainDropdownMenuRef,
    subDropdownMenuRef,
    toggleDropdown,
    closeDropdown,
  } = useDropdown({
    mainCategoryId: selection.mainCategoryId,
    subCategoryId: selection.subCategoryId,
    activeItemClassName: styles.activeItem,
  })

  // React Query로 카테고리 데이터 가져오기
  const { data: categoryList, isLoading, error } = useCategory()

  // 선택된 카테고리들을 컴포넌트에서 직접 계산
  const selectedMainCategory = categoryList?.find(cat => cat.id === selection.mainCategoryId)
  const selectedSubCategory = selectedMainCategory?.subcategories.find(sub => sub.id === selection.subCategoryId)

  if (isLoading) return <div>카테고리 로딩중...</div>
  if (error) return <div>카테고리 로딩 에러</div>
  if (!categoryList) return null

  const handleMainCategorySelect = (categoryId: number) => {
    onMainCategoryClick(categoryId)
    closeDropdown()
  }

  const handleSubCategorySelect = (subCategoryId: number) => {
    onSubCategoryClick(subCategoryId)
    closeDropdown()
  }

  // 데스크톱 뷰 렌더링 함수
  const renderDesktopView = () => (
    <nav className={styles['desktop-container']} aria-label='카테고리 네비게이션'>
      <section className={styles['category-section']}>
        <header className={styles.title}>대분류</header>
        <div>
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
        <div>
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
  )

  // 모바일 뷰의 드롭다운 메뉴 렌더링 함수
  const renderDropdownMenu = (type: DropdownType) => {
    if (type === 'main' && openDropdown === 'main') {
      return (
        <ul className={styles['drop-down-menu']} ref={mainDropdownMenuRef}>
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
      )
    }

    if (type === 'sub' && openDropdown === 'sub' && selectedMainCategory) {
      return (
        <ul className={styles['drop-down-menu']} ref={subDropdownMenuRef}>
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
      )
    }

    return null
  }

  // 모바일 뷰 렌더링 함수
  const renderMobileView = () => (
    <nav className={styles['mobile-container']} aria-label='카테고리 네비게이션'>
      <div className={styles['mobile-view']} ref={mainDropdownRef}>
        <h2>대분류</h2>
        <div className={styles['drop-down']} onClick={() => toggleDropdown('main')}>
          <span className={styles['category-span']}>{selectedMainCategory?.categoryName || '주 카테고리'}</span>
          <SvgIcon name='arrowSmall' />
        </div>
        {renderDropdownMenu('main')}
      </div>
      <Divider padding={24} />
      <div className={styles['mobile-view']} ref={subDropdownRef}>
        <h2>소분류</h2>
        <div className={styles['drop-down']} onClick={() => toggleDropdown('sub')}>
          <span className={styles['category-span']}>
            {selectedSubCategory?.subcategoryName || '소분류를 선택해주세요'}
          </span>
          <SvgIcon name='arrowSmall' />
        </div>
        {renderDropdownMenu('sub')}
      </div>
    </nav>
  )

  return (
    <>
      {renderDesktopView()}
      {renderMobileView()}
    </>
  )
}

export default CategorySelector
