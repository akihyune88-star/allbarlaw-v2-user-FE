import LawyerAchievements from '@/container/lawyer/lawyerAchievements/LawyerAchievements'
import LawyerActivity from '@/container/lawyer/lawyerActivity/LawyerActivity'
import LawyerBlog from '@/container/lawyer/lawyerBlog/LawyerBlog'
import LawyerCareer from '@/container/lawyer/lawyerCareer/LawyerCareer'
import LawyerDetailSidebar from '@/container/lawyer/lawyerDetailSidebar/LawyerDetailSidebar'
import LawyerLegalKnowledge from '@/container/lawyer/lawyerLegalKnowledge/LawyerLegalKnowledge'
import LawyerProfile from '@/container/lawyer/lawyerProfile/LawyerProfile'
import LawyerVideo from '@/container/lawyer/lawyerVideo/LawyerVideo'

const LawyerDetail = () => {
  return (
    <main className='sub-main-container'>
      <section className='contents-section'>
        <LawyerProfile />
        <LawyerActivity />
        <LawyerAchievements />
        <LawyerCareer />
        <LawyerBlog />
        <LawyerVideo />
        <LawyerLegalKnowledge />
      </section>
      <aside className='aside'>
        <LawyerDetailSidebar />
      </aside>
    </main>
  )
}

export default LawyerDetail
