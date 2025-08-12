import { useNavigate, useParams } from 'react-router-dom'
import LegalItemWidget from '@/components/legalItemWidget/LegalItemWidget'
import styles from './legal-term-detail.module.scss'
import LegalTermDefinition from '@/container/legalTermDetail/LegalTermDefinition'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import LegalTermBlogList from '@/container/legalTermDetail/LegalTermBlogList'
import LegalTermKnowledgeList from '@/container/legalTermDetail/LegalTermKnowledgeList'
import LegalTermVideoList from '@/container/legalTermDetail/LegalTermVideoList'
import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import {
  useLegalTermDetail,
  usePopularLegalTermList,
  useRecentRegisteredLegalTermList,
} from '@/hooks/queries/useLegalTerm'
import { useSearchStore } from '@/stores/searchStore'
import { LegalTermItem } from '@/types/legalTermTypes'

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
  const { termId } = useParams()
  const navigate = useNavigate()
  const { setSearchQuery } = useSearchStore()
  const isMobile = useMediaQuery('(min-width: 80rem)')
  const { data: legalTermDetail, isLoading } = useLegalTermDetail(Number(termId))
  const { data: popularLegalTermList } = usePopularLegalTermList()
  const { data: recentRegisteredLegalTermList } = useRecentRegisteredLegalTermList()
  console.log(11, legalTermDetail)

  if (isLoading) {
    return (
      <main className={`sub-main-container ${styles.container}`}>
        <div className={styles['loading-container']}>
          <div className={styles['loading-spinner']}>
            <div className={styles['spinner']}></div>
            <p>법률 용어 정보를 불러오는 중입니다...</p>
          </div>
        </div>
      </main>
    )
  }

  const similarTermsClick = (terms: LegalTermItem) => {
    setSearchQuery(terms.koreanName)
    navigate(`/search`)
  }

  return (
    <main className={`sub-main-container ${styles.container}`}>
      <div className='contents-section'>
        <LegalTermDefinition
          koreanName={legalTermDetail?.koreanName || ''}
          englishName={legalTermDetail?.englishName || ''}
          chineseName={legalTermDetail?.chineseName || ''}
          content={legalTermDetail?.content || ''}
          source={legalTermDetail?.source || ''}
          legalTermKeep={legalTermDetail?.isKeep || false}
          legalTermId={Number(termId)}
        />
        <div className={styles['related-content-section']}>
          {isMobile && <PcTotalContentsHeader amount={legalTermDetail?.viewCount || 0} />}
          <LegalTermBlogList
            blogList={legalTermDetail?.relatedContent?.blogCases || []}
            termsName={legalTermDetail?.koreanName || ''}
          />
          <LegalTermKnowledgeList
            knowledgeList={legalTermDetail?.relatedContent?.knowledgeAnswers || []}
            termsName={legalTermDetail?.koreanName || ''}
          />
          <LegalTermVideoList
            videoList={legalTermDetail?.relatedContent?.videoCases || []}
            termsName={legalTermDetail?.koreanName || ''}
          />
        </div>
      </div>
      <div className='aside' style={{ width: 250, flexShrink: 0 }}>
        <ContentsRecommender
          title='유사한 법률 용어'
          contents={
            <div className={styles['tag-list']}>
              {legalTermDetail?.similarTerms?.map(term => (
                <span key={term.legalTermId} onClick={() => similarTermsClick(term)} style={{ cursor: 'pointer' }}>
                  #{term.koreanName}
                </span>
              ))}
            </div>
          }
        />
        <LegalItemWidget title='많이 찾는 용어' legalTermList={popularLegalTermList || []} />
        <LegalItemWidget title='최근 등록된 용어' legalTermList={recentRegisteredLegalTermList || []} />
      </div>
    </main>
  )
}

export default LegalTermDetail
