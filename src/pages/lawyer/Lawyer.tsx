import AIRecommender from '@/components/aiRecommender/AIRecommender'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import AIBlogCarousel from '@/container/blog/AIBlogCarousel'

const LawyerLayout = () => {
  return (
    <main className='sub-main-container'>
      <section className='contents-section'>
        <AIBlogCarousel />
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
  )
}

export default LawyerLayout
