import AIRecommender from '@/components/aiRecommender/AIRecommender'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import TotalBlogList from '@/container/subMain/total/TotalBlogList'
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
        <section className='contents-section'>
          <TotalBlogList />
        </section>
        <aside className='aside'>
          <section>
            <AIRecommender />
          </section>
          <section>
            <LegalTermWidget
              lagalTermList={[
                '사기죄 [詐欺罪]',
                '업무방해죄 [業務妨害罪]',
                '절도죄 [窃盜罪]',
                '법정대리인 [法定代理人]',
                '위법성 조각사유 [違法性 阻却事由]',
              ]}
            />
          </section>
        </aside>
      </main>
    </div>
  )
}

export default TotalSubMain
