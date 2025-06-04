import CategorySelector from '@/container/main/categorySelector/CategorySelector'
import styles from './main.module.scss'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import { useCategoryStore } from '@/store/useCategoryStore'
import { MainCategory, SubCategory } from '@/types/categoryTypes'
import BlogFeedContainer from '@/container/main/blogFeedContainer/BlogFeedContainer'
import BaroTalkBanner from '@/container/main/baroTalkBanner/BaroTalkBanner'
import LawyerAdvertisementList from '@/container/main/lawyerAdvertisementList/LawyerAdvertisementList'
import LawyerVideoSpotlight from '@/container/main/lawyerVideoSpotlight/LawyerVideoSpotlight'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const Main = () => {
  const navigate = useNavigate()
  const { setMaincategory, setSubcategory } = useCategoryStore()
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const handleSubCategoryClick = (mainCategory: MainCategory, subCategory: SubCategory) => {
    // 스토어 업데이트 - 받은 객체로 바로 설정
    setMaincategory({
      id: mainCategory.id,
      categoryName: mainCategory.categoryName,
    })
    setSubcategory({
      id: subCategory.id,
      subcategoryName: subCategory.subcategoryName,
    })

    navigate(`${ROUTER.SUB_MAIN.replace(':subCategoryId', subCategory.id.toString())}`)
  }

  return (
    <div className={styles['main-container']}>
      <header></header>
      <div className={styles['content-container']}>
        <CategorySelector title='분류별 법률 정보를 찾아보세요' onSubCategoryClick={handleSubCategoryClick} />
        <BlogFeedContainer />
        {!isMobile && <BaroTalkBanner />}
        <LawyerAdvertisementList />
        <LawyerVideoSpotlight />
      </div>
    </div>
  )
}

export default Main
