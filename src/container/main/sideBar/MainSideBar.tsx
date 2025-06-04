import SideBar from '@/components/sideBar/SideBar'
import { useCategoryStore } from '@/store/useCategoryStore'
import styles from './main-side-bar.module.scss'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import CategoryLoading from '@/container/main/categoryLoading/CategoryLoading'
import { useCategory } from '@/hooks/queries/useCategory'

const MainSideBar = () => {
  const navigate = useNavigate()
  const { maincategory, subcategory, setMaincategory, setSubcategory } = useCategoryStore()
  const { data: categoryList, isLoading, isError } = useCategory()

  const handleMainCategoryClick = (id: number) => {
    const selectedCategory = categoryList?.find(category => category.id === id)
    if (selectedCategory) {
      setMaincategory({ id: selectedCategory.id, categoryName: selectedCategory.categoryName })
    }
  }

  const handleSubCategoryClick = (id: number) => {
    const selectedMainCategory = categoryList?.find(category => category.id === maincategory?.id)
    const selectedSubCategory = selectedMainCategory?.subcategories.find(sub => sub.id === id)

    if (selectedSubCategory) {
      setSubcategory({ id: selectedSubCategory.id, subcategoryName: selectedSubCategory.subcategoryName })
      navigate(`${ROUTER.SUB_MAIN.replace(':subCategoryId', id.toString())}`)
    }
  }

  return (
    <aside className={styles['sidebar-container']}>
      {isLoading ? (
        <CategoryLoading />
      ) : isError ? (
        <div className={styles['error-state']}>
          <p>카테고리를 불러올 수 없습니다.</p>
        </div>
      ) : categoryList ? (
        <SideBar
          categories={categoryList}
          selectedMainCategory={maincategory?.id || null}
          selectedSubCategory={subcategory?.id || null}
          onMainCategoryClick={handleMainCategoryClick}
          onSubCategoryClick={handleSubCategoryClick}
        />
      ) : (
        <div className={styles['empty-state']}>
          <p>카테고리가 없습니다.</p>
        </div>
      )}
    </aside>
  )
}

export default MainSideBar
