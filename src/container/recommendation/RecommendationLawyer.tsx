import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import { useChunkedRotate } from '@/hooks/useChunkedRotate'
import { useRecommendationLawyer } from '@/hooks/queries/useRecommendation'
import { useNavigate } from 'react-router-dom'

type RecommendationLawyerProps = {
  title?: string
  take?: number
  chunkSize?: number
  className?: string
  showDivider?: boolean
  dividerPadding?: number
}

const RecommendationLawyer = ({
  title = 'AI 추천 변호사',
  take = 10,
  chunkSize = 3,
  className,
  showDivider,
  dividerPadding,
}: RecommendationLawyerProps) => {
  const navigate = useNavigate()
  const { data: recommendationLawyer } = useRecommendationLawyer(take)
  const { visibleItems, rotateNext } = useChunkedRotate(recommendationLawyer ?? [], chunkSize)
  console.log('recommendationLawyer', recommendationLawyer)

  return (
    <ContentsRecommender
      title={title}
      onRefresh={rotateNext}
      showDivider={showDivider}
      dividerPadding={dividerPadding}
      className={className}
      contents={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {visibleItems.map(lawyer => (
            <LawyerHorizon
              key={lawyer.lawyerId}
              name={lawyer.lawyerName}
              profileImage={lawyer.lawyerProfileImage}
              description={lawyer.lawfirmName}
              size='x-small'
              onClick={() => navigate(`/search/lawyer/${lawyer.lawyerId}`)}
            />
          ))}
        </div>
      }
    />
  )
}

export default RecommendationLawyer
