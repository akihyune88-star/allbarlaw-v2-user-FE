import SideBar from '@/components/sideBar/SideBar'
import { useCategoryStore } from '@/store/useCategoryStore'
import styles from './main-side-bar.module.scss'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'

const MainSideBar = () => {
  const navigate = useNavigate()
  const { maincategory, subcategory, setMaincategory, setSubcategory, cagegoryList } = useCategoryStore()

  const handleMainCategoryClick = (id: number) => {
    setMaincategory(id)
    const selectedCategory = cagegoryList.find(category => category.id === id)
    if (selectedCategory && selectedCategory.subcategories.length > 0) {
      const firstSubCategoryId = selectedCategory.subcategories[0].id
      setSubcategory(firstSubCategoryId)
      navigate(`${ROUTER.SUB_MAIN.replace(':subCategoryId', firstSubCategoryId.toString())}`)
    }
  }

  const handleSubCategoryClick = (id: number) => {
    setSubcategory(id)
    navigate(`${ROUTER.SUB_MAIN.replace(':subCategoryId', id.toString())}`)
  }

  return (
    <aside className={styles['sidebar-container']}>
      <SideBar
        categories={cagegoryList}
        selectedMainCategory={maincategory}
        selectedSubCategory={subcategory}
        onMainCategoryClick={handleMainCategoryClick}
        onSubCategoryClick={handleSubCategoryClick}
      />
    </aside>
  )
}

export default MainSideBar
