import { useLocation } from 'react-router-dom'
import LegalItemWidget from '@/components/legalItemWidget/LegalItemWidget'
import styles from './legal-term-detail.module.scss'
import LegalTermDefinition from '@/container/legalTermDetail/LegalTermDefinition'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import LegalTermBlogList from '@/container/legalTermDetail/LegalTermBlogList'
import LegalTermKnowledgeList from '@/container/legalTermDetail/LegalTermKnowledgeList'
import LegalTermVideoList from '@/container/legalTermDetail/LegalTermVideoList'
import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'

const PcTotalContentsHeader = ({ amount }: { amount: number }) => {
  return (
    <div className={styles['total-contents-header']}>
      <h3
        className={styles['title']}
      >{`해당 법률용어가 포함된 자료입니다.\n법률 문제를 해결 할 수 있는 글과 영상을 함께 찾아보세요.`}</h3>
      <span className={styles['amount']}>전체 {amount.toLocaleString()}개</span>
    </div>
  )
}

const LegalTermDetail = () => {
  const { state } = useLocation()
  const isMobile = useMediaQuery('(min-width: 80rem)')
  console.log(state.id)

  const tagList = ['#파산', '#선고', '#개인회생', '#개인회생파산', '#법인파산', '#파산선', '#희망파산']

  return (
    <main className={`sub-main-container ${styles.container}`}>
      <div className='contents-section'>
        <LegalTermDefinition termId={state.id} />
        <div className={styles['related-content-section']}>
          {isMobile && <PcTotalContentsHeader amount={2147} />}
          <LegalTermBlogList />
          <LegalTermKnowledgeList />
          <LegalTermVideoList />
        </div>
      </div>
      <div className='aside' style={{ width: 250, flexShrink: 0 }}>
        <ContentsRecommender
          title='유사한 법률 용어'
          contents={
            <div className={styles['tag-list']}>
              {tagList.map(tag => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          }
        />
        <LegalItemWidget title='많이 찾는 용어' />
        <LegalItemWidget title='최근 등록된 용어' />
      </div>
    </main>
  )
}

export default LegalTermDetail
