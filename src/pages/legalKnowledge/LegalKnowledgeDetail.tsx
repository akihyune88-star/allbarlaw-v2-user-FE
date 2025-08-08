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
import { useState } from 'react'
import { useKnowledgeKeep } from '@/hooks/queries/useGetKnowledgeList'
import { copyUrlToClipboard } from '@/utils/clipboard'

const LegalKnowledgeDetail = () => {
  const { knowledgeId } = useParams<{ knowledgeId: string }>()
  const { showLoading } = useDelayedLoading({ delay: 3000 })

  const isMobile = useMediaQuery('(max-width: 80rem)')

  const { data } = useGetKnowledgeDetail({ knowledgeId: Number(knowledgeId) })

  const [isKeep, setIsKeep] = useState(data?.isKeep ?? false)

  const { mutate: changeKnowledgeKeep } = useKnowledgeKeep({
    onSuccess: data => {
      setIsKeep(data.isKeep)
    },
    onError: () => {
      setIsKeep(prevState => !prevState)
    },
  })

  const handleShare = () => {
    copyUrlToClipboard()
  }

  const handleSave = () => {
    if (knowledgeId) {
      setIsKeep(prevState => !prevState)
      changeKnowledgeKeep(Number(knowledgeId))
    }
  }

  const mockLawyerList = generateRandomLawyers(3)

  return (
    <div className={'detail-container'}>
      <DetailHeader
        title={data?.knowledgeTitle || ''}
        onSave={isMobile ? handleSave : undefined}
        onShare={isMobile ? handleShare : undefined}
        isKeep={isKeep}
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
                isKeep={isKeep}
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
                          key={lawyer.lawyerId}
                          name={lawyer.lawyerName}
                          profileImage={lawyer.lawyerProfileImage}
                          description={lawyer.lawfirmName}
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
