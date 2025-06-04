import CategorySelector from '@/container/main/categorySelector/CategorySelector'
import styles from './main.module.scss'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import { useCategoryStore } from '@/store/useCategoryStore'
import { useCategoriesQuery } from '@/hooks/queries/useCategoriesQuery'

const Main = () => {
  const navigate = useNavigate()
  const { setMaincategory, setSubcategory } = useCategoryStore()
  const { data: categoryList } = useCategoriesQuery()

  const handleSubCategoryClick = (subCategoryId: number) => {
    // 서브카테고리 정보 찾기
    let selectedMainCategory = null
    let selectedSubCategory = null

    for (const category of categoryList || []) {
      const foundSubCategory = category.subcategories.find(sub => sub.id === subCategoryId)
      if (foundSubCategory) {
        selectedMainCategory = category
        selectedSubCategory = foundSubCategory
        break
      }
    }

    // 스토어 업데이트
    if (selectedMainCategory && selectedSubCategory) {
      setMaincategory({
        id: selectedMainCategory.id,
        categoryName: selectedMainCategory.categoryName,
      })
      setSubcategory({
        id: selectedSubCategory.id,
        subcategoryName: selectedSubCategory.subcategoryName,
      })
    }

    // 페이지 이동
    navigate(`${ROUTER.SUB_MAIN.replace(':subCategoryId', subCategoryId.toString())}`)
  }

  return (
    <div className={styles['main-container']}>
      <CategorySelector title='분류별 법률 정보를 찾아보세요' onSubCategoryClick={handleSubCategoryClick} />
    </div>
  )
}

export default Main
