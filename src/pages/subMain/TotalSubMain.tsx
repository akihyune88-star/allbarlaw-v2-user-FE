import AdSlider from '@/container/main/mainHero/adSlider/AdSlider'
import TotalBlogList from '@/container/subMain/total/TotalBlogList'
import TotalLawyer from '@/container/subMain/total/TotalLawyer'
import TotalVideo from '@/container/subMain/total/TotalVideo'
import { useSubBanner } from '@/hooks/queries/useBanner'
import styles from '@/pages/subMain/total-sub-main.module.scss'
import { useParams } from 'react-router-dom'

const TotalSubMain = () => {
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const numericSubcategoryId = subcategoryId ? Number(subcategoryId) : 0
  const { data: bannerList } = useSubBanner(Number.isNaN(numericSubcategoryId) ? 0 : numericSubcategoryId)

  return (
    <div className={styles['total-sub-main']}>
      <div className={styles['ad-slider']}>
        <AdSlider ads={bannerList || []} />
      </div>
      <main className='sub-main-container'>
        <section className={`contents-section ${styles['contents-container']}`}>
          <TotalBlogList />
          <TotalVideo />
          <TotalLawyer />
        </section>
      </main>
    </div>
  )
}

export default TotalSubMain
