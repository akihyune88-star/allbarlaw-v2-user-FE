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
        <LawyerProfile
          discription={mockLawyer.lawyerProfile.discription}
          lawyerLawfirm={mockLawyer.lawyerProfile.lawyerLawfirm}
          lawyerAdress={mockLawyer.lawyerProfile.lawyerAdress}
          tags={mockLawyer.lawyerProfile.tags}
        />
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

const mockLawyer = {
  lawyerProfile: {
    discription: `서울대 로스쿨 수석! \n강력사건 전문 해결, 전문 변호사\n오랜 경험과 깊은 지식, 경험과 실력은 활동내역이 증명합니다.`,
    lawyerLawfirm: '법무법인 대한법률사무소',
    lawyerAdress: '서울 서초구 서초중앙로 123 서초빌딩 16층',
    tags: [
      { id: 1, name: '재산범죄' },
      { id: 2, name: '사기' },
      { id: 3, name: '지식재산권' },
      { id: 4, name: '형사기타' },
      { id: 5, name: '이면계약중지' },
      { id: 6, name: '이면계약중지' },
      { id: 7, name: '이면계약중지' },
      { id: 8, name: '이면계약중지' },
      { id: 9, name: '이면계약중지' },
      { id: 10, name: '이면계약중지' },
      { id: 11, name: '이면계약중지' },
      { id: 12, name: '이면계약중지' },
      { id: 13, name: '이면계약중지' },
    ],
  },
}
