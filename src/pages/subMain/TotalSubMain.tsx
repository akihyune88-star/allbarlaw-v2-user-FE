import TotalBlogList from '@/container/subMain/total/TotalBlogList'
import TotalLawyer from '@/container/subMain/total/TotalLawyer'
import TotalLegalKnowledge from '@/container/subMain/total/TotalLegalKnowledge'
import TotalVideo from '@/container/subMain/total/TotalVideo'
import styles from '@/pages/subMain/total-sub-main.module.scss'

const TotalSubMain = () => {
  return (
    <div className={styles['total-sub-main']}>
      <figure>
        <img
          src={'https://d2v80xjmx68n4w.cloudfront.net/members/portfolios/MqK421730103906.jpg?w=500'}
          alt='광고'
          className={styles['banner']}
        />
      </figure>
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
