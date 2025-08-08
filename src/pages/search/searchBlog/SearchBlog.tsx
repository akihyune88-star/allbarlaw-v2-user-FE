import BlogList from '@/container/blog/BlogList'
import styles from './search-blog.module.scss'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import SearchContentHeader from '@/container/search/searchContentHeader/SearchContentHeader'
import SearchBlogResult from '@/container/search/searchBlogResult/SearchBlogResult'

const SearchBlog = () => {
  return (
    <main className='sub-main-container'>
      <section className={`contents-section ${styles.contentBox}`}>
        <SearchContentHeader />
        <SearchBlogResult />
      </section>
      <aside className='aside'>
        <section>
          <ContentsRecommender
            isRefresh={true}
            title='AI 추천 변호사'
            onRefresh={() => {}}
            contents={
              <div className={styles['ai-recommender-lawyer']}>
                {/* {mockLawyerList.map(lawyer => (
                  <LawyerHorizon
                    key={lawyer.lawyerId}
                    name={lawyer.lawyerName}
                    profileImage={lawyer.lawyerProfileImage}
                    description={lawyer.lawfirmName}
                    size='x-small'
                  />
                ))} */}
              </div>
            }
          />
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

export default SearchBlog
