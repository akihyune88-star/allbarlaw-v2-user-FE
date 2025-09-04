import SideBar from '@/components/sideBar/SideBar'
import LawyerAdminHeader from '@/container/lawyerAdmin/lawyerAdminHeader/LawyerAdminHeader'
import { CategoryList } from '@/types/categoryTypes'
import styles from '@/styles/app.module.scss'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'

const LawyerAdminLayout = () => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(1)
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(1)
  const navigate = useNavigate()

  const handleMainCategoryClick = (id: number) => {
    setSelectedMainCategory(selectedMainCategory === id ? null : id)
  }

  const handleSubcategoryClick = (id: number) => {
    setSelectedSubcategory(id)
    switch (id) {
      case 1:
        navigate(ROUTER.LAWYER_ADMIN_LAWYER_DETAIL)
        break
      case 2:
        navigate(ROUTER.LAWYER_ADMIN_LAWYER_EDIT)
        break
      case 3:
        navigate(ROUTER.LAWYER_ADMIN_CONTENT_BLOG)
        break
      case 4:
        navigate(ROUTER.LAWYER_ADMIN_CONTENT_VIDEO)
        break
      case 5:
        navigate(ROUTER.LAWYER_ADMIN_CHAT_LIST)
        break
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
    categoryName: '변호사 정보관리',
    imageUrl: '',
    clickedImageUrl: '',
    isUncategorized: false,
    subcategories: [
      {
        subcategoryId: 1,
        subcategoryName: '변호사 정보 상세',
        isUncategorized: false,
        categoryId: 1,
      },
      {
        subcategoryId: 2,
        subcategoryName: '변호사 정보 수정',
        isUncategorized: false,
        categoryId: 1,
      },
    ],
  },
  {
    categoryId: 2,
    categoryName: '분류별 컨텐츠 관리',
    imageUrl: '',
    clickedImageUrl: '',
    isUncategorized: false,
    subcategories: [
      {
        subcategoryId: 3,
        subcategoryName: '블로그 글',
        isUncategorized: false,
        categoryId: 2,
      },
      {
        subcategoryId: 4,
        subcategoryName: '법률영상',
        isUncategorized: false,
        categoryId: 2,
      },
      {
        subcategoryId: 5,
        subcategoryName: '법률 지식인',
        isUncategorized: false,
        categoryId: 2,
      },
    ],
  },
  {
    categoryId: 3,
    categoryName: '채팅상담',
    imageUrl: '',
    clickedImageUrl: '',
    isUncategorized: false,
    subcategories: [
      {
        subcategoryId: 6,
        subcategoryName: '채팅리스트',
        isUncategorized: false,
        categoryId: 3,
      },
    ],
  },
]
