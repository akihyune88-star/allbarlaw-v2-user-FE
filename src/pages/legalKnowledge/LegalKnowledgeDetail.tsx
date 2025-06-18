import AILoading from '@/components/aiLoading/AILoading'
import DetailHeader from '@/components/detailHeader/DetailHeader'
import LegalKnowledgeDetailSideBar from '@/container/legalKnowledge/LegalKnowledgeDetailSideBar'
import { useDelayedLoading } from '@/hooks'
import { useGetKnowledgeDetail } from '@/hooks/queries/useGetKnowledgeDetail'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useParams } from 'react-router-dom'
import styles from './legal-knowledge-detail.module.scss'
import ConsultationContentCard from '@/components/consultationContentCard/ConsultationContentCard'
import LawyerResponse from '@/container/legalKnowledge/LawyerResponse'
import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import { getRelativeTimeString } from '@/utils/date'
import { generateRandomLawyers } from '@/utils/mockDataGenerator'

const LegalKnowledgeDetail = () => {
  const { knowledgeId } = useParams<{ knowledgeId: string }>()
  const { showLoading } = useDelayedLoading({ delay: 3000 })
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const { data } = useGetKnowledgeDetail({ knowledgeId: Number(knowledgeId) })

  const handleShare = () => {
    console.log('공유하기 - 법률 지식:', knowledgeId)
    // 실제 공유 로직 구현
  }

  const handleSave = () => {
    console.log('저장하기 - 법률 지식:', knowledgeId)
    // 실제 저장 로직 구현
  }

  const mockLawyerList = generateRandomLawyers(3)

  return (
    <div className={'detail-container'}>
      <DetailHeader
        title={data?.knowledgeTitle || ''}
        onSave={isMobile ? handleSave : undefined}
        onShare={isMobile ? handleShare : undefined}
      />
      <div className={`detail-body ${styles['detail-body-gap']}`}>
        <div className={styles['detail-content-container']}>
          {showLoading ? (
            <AILoading title='AI가 해당 법률 지식인의 분석중입니다.' />
          ) : (
            <div className={styles['detail-content-container-inner']}>
              <ConsultationContentCard
                content={data?.knowledgeDescription}
                tags={data?.tags}
                lastAnswerTime={data?.lastMessageAt ? getRelativeTimeString(data.lastMessageAt) : ''}
                onShare={handleShare}
                onSave={handleSave}
              />
              {data?.lawyers && <LawyerResponse lawyers={data?.lawyers} />}
              {isMobile && (
                <ContentsRecommender
                  isRefresh={true}
                  title='최근 답변이 많은 변호사입니다.'
                  contents={
                    <div className={styles['lawyer-list']}>
                      {mockLawyerList.map(lawyer => (
                        <LawyerHorizon
                          key={lawyer.id}
                          name={lawyer.name}
                          profileImage={lawyer.profileImage}
                          description={lawyer.description}
                          size='x-small'
                        />
                      ))}
                    </div>
                  }
                />
              )}
            </div>
          )}
        </div>
        {!isMobile && <LegalKnowledgeDetailSideBar recommendLawyerList={mockLawyerList} />}
      </div>
    </div>
  )
}

export default LegalKnowledgeDetail
