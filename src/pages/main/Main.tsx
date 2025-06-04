import CategorySelector from '@/components/categorySelector/CategorySelector'
import styles from './main.module.scss'
import { useNavigate } from 'react-router-dom'
import { Category, SubCategory } from '@/types/categoryTypes'
import BlogFeedContainer from '@/container/main/blogFeedContainer/BlogFeedContainer'
import BaroTalkBanner from '@/container/main/baroTalkBanner/BaroTalkBanner'
import LawyerAdvertisementList from '@/container/main/lawyerAdvertisementList/LawyerAdvertisementList'
import LawyerVideoSpotlight from '@/container/main/lawyerVideoSpotlight/LawyerVideoSpotlight'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const Main = () => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const handleSubCategoryClick = (category: Category, subCategory: SubCategory) => {
    navigate(`/${subCategory.subcategoryId}`)
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
