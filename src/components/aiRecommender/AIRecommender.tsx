import styles from '@/components/aiRecommender/ai-recommender.module.scss'
import Divider from '../divider/Divider'
import SvgIcon from '../SvgIcon'
import { AIRecommenderLawyerItem } from '@/types/lawyerTypes'
import LawyerHorizon from '../lawyer/LawyerHorizon'
import { useEffect, useState } from 'react'
import { useRecommendationLawyer, useRecommendationTag } from '@/hooks/queries/useRecommendation'
import { RecommendationTag } from '@/types/recommendationTypes'
import { useNavigate } from 'react-router-dom'
import { useSearchStore } from '@/stores/searchStore'
import { useChunkedRotate } from '@/hooks/useChunkedRotate'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const TagSection = ({ tagList }: { tagList: RecommendationTag[] }) => {
  const [visibleCount, setVisibleCount] = useState<number>(10)
  const [isArrowUp, setIsArrowUp] = useState<boolean>(false)
  const navigate = useNavigate()
  const { setSearchQuery } = useSearchStore()

  useEffect(() => {
    setVisibleCount(Math.min(10, tagList.length))
    setIsArrowUp(false)
  }, [tagList])

  const handleToggle = () => {
    const isExpanded = visibleCount >= tagList.length
    if (isExpanded) {
      setVisibleCount(Math.min(10, tagList.length))
    } else {
      setVisibleCount(prev => Math.min(prev + 10, tagList.length))
    }
    setIsArrowUp(prev => !prev)
  }

  const handleTagClick = (tagName: string) => {
    // 검색어 설정
    setSearchQuery(tagName)
    // 검색 페이지로 이동
    navigate('/search')
  }

  const visibleTags = tagList.slice(0, visibleCount)
  const isExpanded = visibleCount >= tagList.length

  return (
    <section className={styles['tag-section']}>
      <h2 className={styles['section-title']}>AI 추천태그</h2>
      {tagList.length === 0 ? (
        <div className={styles['empty-state']}>
          <p>추천할 태그가 없습니다.</p>
        </div>
      ) : (
        <>
          <div className={styles['tag-list']}>
            {visibleTags.map(tag => (
              <span
                key={tag.tagId}
                className={styles['tag-item']}
                onClick={() => handleTagClick(tag.tagName)}
                style={{ cursor: 'pointer' }}
              >
                #{tag.tagName}
              </span>
            ))}
          </div>
          {tagList.length > 10 && (
            <button onClick={handleToggle}>
              <span>{isExpanded ? '접기' : '더보기'}</span>
              <SvgIcon name='arrowSmall' style={{ transform: `rotate(${isArrowUp ? 90 : 180}deg)` }} />
            </button>
          )}
        </>
      )}
    </section>
  )
}

export const LawyerItem = ({
  lawyerList,
  divider = false,
}: {
  lawyerList: AIRecommenderLawyerItem[]
  divider?: boolean
}) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const CHUNK_SIZE = isMobile ? 4 : 3
  const navigate = useNavigate()
  const { visibleItems: visibleLawyers, rotateNext } = useChunkedRotate(lawyerList, CHUNK_SIZE)

  const handleLawyerClick = (lawyerId: number) => {
    navigate(`/search/lawyer/${lawyerId}`)
  }

  return (
    <section className={styles['lawyer-section']}>
      <header>
        <h2 className={styles['section-title']}>AI 추천 변호사</h2>
        {lawyerList.length > 0 && <SvgIcon name='refresh' onClick={rotateNext} />}
      </header>
      {divider && <Divider />}
      {lawyerList.length === 0 ? (
        <div className={styles['empty-state']}>
          <p>추천할 변호사가 없습니다.</p>
        </div>
      ) : (
        <div className={styles['lawyer-list']}>
          {visibleLawyers.map(lawyer => (
            <LawyerHorizon
              key={lawyer.lawyerId}
              lawyerId={lawyer.lawyerId}
              name={lawyer.lawyerName}
              profileImage={lawyer.lawyerProfileImage}
              description={lawyer.lawfirmName}
              size='x-small'
              onClick={() => handleLawyerClick(lawyer.lawyerId)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

const AIRecommender = () => {
  const { data: recommendationTag } = useRecommendationTag(20)
  const { data: recommendationLawyer } = useRecommendationLawyer(10)

  return (
    <article className={styles['ai-recommender']}>
      <TagSection tagList={recommendationTag || []} />
      <Divider />
      <LawyerItem lawyerList={recommendationLawyer || []} />
    </article>
  )
}

export default AIRecommender
