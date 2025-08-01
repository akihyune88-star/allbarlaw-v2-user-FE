import SideBar from '@/components/sideBar/SideBar'
import LawyerAdminHeader from '@/container/lawyerAdmin/lawyerAdminHeader/LawyerAdminHeader'
import { CategoryList } from '@/types/categoryTypes'
import styles from '@/styles/app.module.scss'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'

const LawyerAdminLayout = () => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null)
  const navigate = useNavigate()

  const handleMainCategoryClick = (id: number) => {
    setSelectedMainCategory(selectedMainCategory === id ? null : id)
  }

  const handleSubcategoryClick = (id: number) => {
    setSelectedSubcategory(id)

    // 채팅리스트 서브카테고리 클릭 시 채팅 페이지로 이동
    if (id === 1) {
      navigate(ROUTER.LAWYER_ADMIN_CHAT_LIST)
    }
  }

  return (
    <div className={styles.container}>
      <LawyerAdminHeader />
      <div className={styles['inner-container']} style={{ display: 'flex' }}>
        <SideBar
          categories={categories}
          selectedMainCategory={selectedMainCategory}
          selectedSubcategory={selectedSubcategory}
          onMainCategoryClick={handleMainCategoryClick}
          onSubcategoryClick={handleSubcategoryClick}
          alwaysExpanded={true}
        />
        <div style={{ width: 1120, display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default LawyerAdminLayout

const categories: CategoryList = [
  {
    categoryId: 1,
    categoryName: '채팅상담',
    imageUrl: '',
    clickedImageUrl: '',
    isUncategorized: false,
    subcategories: [
      {
        subcategoryId: 1,
        subcategoryName: '채팅리스트',
        isUncategorized: false,
        categoryId: 1,
      },
    ],
  },
]
