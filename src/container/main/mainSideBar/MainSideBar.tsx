import SideBar from '@/components/sideBar/SideBar'
import { useCategoryStore } from '@/store/useCategoryStore'
import styles from './main-side-bar.module.scss'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'

const MainSideBar = () => {
  const navigate = useNavigate()
  const { maincategory, subcategory, setMaincategory, setSubcategory, categoryList } = useCategoryStore()

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

  if (!categoryList) {
    return null // or a loading state
  }

  return (
    <aside className={styles['sidebar-container']}>
      <SideBar
        categories={categoryList}
        selectedMainCategory={maincategory?.id || null}
        selectedSubCategory={subcategory?.id || null}
        onMainCategoryClick={handleMainCategoryClick}
        onSubCategoryClick={handleSubCategoryClick}
      />
    </aside>
  )
}

export default MainSideBar
