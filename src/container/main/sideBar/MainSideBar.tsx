import SideBar from '@/components/sideBar/SideBar'
import { useCategoryStore } from '@/store/useCategoryStore'
import styles from './main-side-bar.module.scss'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import CategoryLoading from '@/container/main/categoryLoading/CategoryLoading'
import { useCategory } from '@/hooks/queries/useCategory'

const MainSideBar = () => {
  const navigate = useNavigate()
  const { category, subcategory, setCategory, setSubcategory } = useCategoryStore()
  const { data: categoryList, isLoading, isError } = useCategory()
  console.log('categoryList', categoryList)

  const handleMainCategoryClick = (id: number) => {
    const selectedCategory = categoryList?.find(category => category.categoryId === id)
    if (selectedCategory) {
      setCategory({ categoryId: selectedCategory.categoryId, categoryName: selectedCategory.categoryName })
    }
  }

  const handleSubCategoryClick = (id: number) => {
    const selectedMainCategory = categoryList?.find(categoryItem => categoryItem.categoryId === category?.categoryId)
    const selectedSubCategory = selectedMainCategory?.subcategories.find(sub => sub.subcategoryId === id)

    if (selectedSubCategory) {
      setSubcategory({
        subcategoryId: selectedSubCategory.subcategoryId,
        subcategoryName: selectedSubCategory.subcategoryName,
      })
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
          selectedMainCategory={category?.categoryId || null}
          selectedSubCategory={subcategory?.subcategoryId || null}
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
