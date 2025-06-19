import AdSlider from '@/container/main/mainHero/adSlider/AdSlider'
import TotalBlogList from '@/container/subMain/total/TotalBlogList'
import TotalLawyer from '@/container/subMain/total/TotalLawyer'
import TotalLegalKnowledge from '@/container/subMain/total/TotalLegalKnowledge'
import TotalVideo from '@/container/subMain/total/TotalVideo'
import { useGetBanner } from '@/hooks/queries/useGetBanner'
import styles from '@/pages/subMain/total-sub-main.module.scss'

const TotalSubMain = () => {
  const { data: bannerList } = useGetBanner()
  return (
    <div className={styles['total-sub-main']}>
      <div className={styles['ad-slider']}>
        <AdSlider ads={bannerList || []} />
      </div>
      <main className='sub-main-container'>
        <section className={`contents-section ${styles['contents-container']}`}>
          <TotalBlogList />
          <TotalLegalKnowledge />
          <TotalVideo />
          <TotalLawyer />
        </section>
      </main>
    </div>
  )
}

export default TotalSubMain
