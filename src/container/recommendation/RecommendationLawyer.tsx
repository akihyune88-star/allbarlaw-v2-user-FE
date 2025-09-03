import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import { useChunkedRotate } from '@/hooks/useChunkedRotate'
import { useRecommendationLawyer } from '@/hooks/queries/useRecommendation'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '@/hooks/useMediaQuery'

type RecommendationLawyerProps = {
  title?: string
  take?: number
  // chunkSize?: number
  className?: string
  showDivider?: boolean
  dividerPadding?: number
}

const RecommendationLawyer = ({
  title = 'AI 추천 변호사',
  take = 10,
  // chunkSize = 3,
  className,
  showDivider,
  dividerPadding,
}: RecommendationLawyerProps) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const chunkSize = isMobile ? 4 : 5
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
              lawyerId={lawyer.lawyerId}
              name={lawyer.lawyerName}
              profileImage={lawyer.lawyerProfileImage}
              description={isMobile ? lawyer.lawyerDescription : lawyer.lawfirmName}
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
