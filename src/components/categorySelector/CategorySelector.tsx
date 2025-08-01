import { useState, useEffect } from 'react'
import styles from './category-selector.module.scss'
import { chunk } from '@/utils/arrayUtils'
import { Category, Subcategory } from '@/types/categoryTypes'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import SvgIcon from '@/components/SvgIcon'
import { useCategory } from '@/hooks/queries/useCategory'
import { useCategoryRenderChunk } from '@/hooks/useCategoryRenderChunk'

type CategorySelectorProps = {
  title?: string
  className?: string
  onSubcategoryClick?: (_category: Category, _subcategory: Subcategory) => void
  enableMobileExpand?: boolean // 모바일에서 펼쳐보기 기능 사용 여부
  initialVisibleGroups?: number // 초기에 보여줄 그룹 수 (모바일에서)
  horizontalPadding?: number
  defaultSubcategoryId?: number // 기본 서브카테고리 ID
}

const CategorySelector = ({
  title,
  className,
  onSubcategoryClick,
  enableMobileExpand = false,
  initialVisibleGroups = 2,
  horizontalPadding = 20,
  defaultSubcategoryId,
}: CategorySelectorProps) => {
  const { data: categoryList } = useCategory()
  const [selectedCategory, setSelectedMainCategory] = useState<number | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState<boolean>(false) // 모바일에서 펼침 상태

  // 모바일 분기 처리
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const { chunkSize } = useCategoryRenderChunk({
    horizontalPadding: horizontalPadding,
  })

  // 기본 서브카테고리 ID가 있으면 해당 카테고리와 서브카테고리를 자동으로 선택
  useEffect(() => {
    if (defaultSubcategoryId && categoryList) {
      // 모든 카테고리에서 해당 서브카테고리를 찾기
      for (const category of categoryList) {
        const foundSubcategory = category.subcategories.find(sub => sub.subcategoryId === defaultSubcategoryId)
        if (foundSubcategory) {
          setSelectedMainCategory(category.categoryId)
          setSelectedSubcategory(defaultSubcategoryId)
          break
        }
      }
    }
  }, [defaultSubcategoryId, categoryList])

  const handleMainCategoryClick = (categoryId: number) => {
    setSelectedMainCategory(categoryId)
    setSelectedSubcategory(null) // 메인 카테고리가 바뀌면 서브 카테고리 선택 해제
  }

  const handlesubcategoryClick = (category: Category, subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory.subcategoryId)
    onSubcategoryClick?.(category, subcategory) // 메인카테고리와 서브카테고리 객체 함께 전달
  }

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const categoryGroups = categoryList ? chunk(categoryList, chunkSize) : []

  // 모바일에서 보여줄 그룹 결정
  const visibleGroups =
    isMobile && enableMobileExpand && !isExpanded
      ? categoryGroups.slice(0, initialVisibleGroups) // 설정된 수만큼만 표시
      : categoryGroups // 데스크톱이거나 펼쳐진 상태거나 기능 비활성화면 모든 그룹

  // 펼쳐보기 버튼 표시 조건
  const showExpandButton = isMobile && enableMobileExpand && categoryGroups.length > initialVisibleGroups

  return (
    <section className={`${styles.container} ${className}`}>
      {title && (
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </header>
      )}

      <div className={styles['category-container']}>
        {visibleGroups.map((group, groupIndex) => {
          // 현재 그룹에 선택된 카테고리가 있는지 확인
          const selectedCategoryInGroup = group.find(category => category.categoryId === selectedCategory)

          return (
            <div key={groupIndex} className={styles['category-group']}>
              {/* 현재 그룹의 카테고리들 */}
              <div
                className={`${styles['category-row']} ${isMobile && group.length === chunkSize ? styles.center : ''}`}
              >
                {group.map(category => (
                  <div
                    className={`${styles['icon-wrapper']} ${
                      selectedCategory === category.categoryId ? styles.selected : ''
                    }`}
                    key={category.categoryId}
                    onClick={() => handleMainCategoryClick(category.categoryId)}
                  >
                    <img
                      src={selectedCategory === category.categoryId ? category.clickedImageUrl : category.imageUrl}
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
                    {selectedCategoryInGroup.subcategories.map(subcategory => (
                      <button
                        key={subcategory.subcategoryId}
                        className={`${styles['subcategory-button']} ${
                          selectedSubcategory === subcategory.subcategoryId ? styles.selected : ''
                        }`}
                        onClick={() => handlesubcategoryClick(selectedCategoryInGroup, subcategory)}
                      >
                        {subcategory.subcategoryName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* 모바일에서 펼쳐보기/접기 버튼 */}
        {showExpandButton && (
          <button className={styles['expand-button']} onClick={handleToggleExpand}>
            {isExpanded ? '접기' : '펼쳐보기'}
            <SvgIcon name='arrowSmall' style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>
        )}
      </div>
    </section>
  )
}

export default CategorySelector
