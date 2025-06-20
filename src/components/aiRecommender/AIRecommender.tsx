import styles from '@/components/aiRecommender/ai-recommender.module.scss'
import Divider from '../divider/Divider'
import SvgIcon from '../SvgIcon'
import { AIRecommenderLawyerItem } from '@/types/lawyerTypes'
import LawyerHorizon from '../lawyer/LawyerHorizon'
import { exampleTagList } from '@/constants/exampleData'
import { generateRandomLawyers } from '@/utils/mockDataGenerator'
import { useState } from 'react'

const TagSection = ({ tagList }: { tagList: string[] }) => {
  return (
    <section className={styles['tag-section']}>
      <h2 className={styles['section-title']}>AI 추천태그</h2>
      <div className={styles['tag-list']}>
        {tagList.map((tag, index) => (
          <span key={tag + index} className={styles['tag-item']}>
            #{tag}
          </span>
        ))}
      </div>
      <button>
        <span>더보기</span>
        <SvgIcon name='arrowSmall' />
      </button>
    </section>
  )
}

export const LawyerItem = ({
  lawyerList,
  divider = false,
  onRefresh,
}: {
  lawyerList: AIRecommenderLawyerItem[]
  divider?: boolean
  onRefresh?: () => void
}) => {
  return (
    <section className={styles['lawyer-section']}>
      <header>
        <h2 className={styles['section-title']}>AI 추천 변호사</h2>
        <SvgIcon name='refresh' onClick={onRefresh} />
      </header>
      {divider && <Divider />}
      <div className={styles['lawyer-list']}>
        {lawyerList.map(lawyer => (
          <LawyerHorizon
            key={lawyer.id}
            name={lawyer.name}
            profileImage={lawyer.profileImage}
            description={lawyer.description}
            size='x-small'
          />
        ))}
      </div>
    </section>
  )
}

const AIRecommender = () => {
  const [lawyerList, setLawyerList] = useState<AIRecommenderLawyerItem[]>(generateRandomLawyers(3))

  const handleRefresh = () => {
    setLawyerList(generateRandomLawyers(3))
  }

  return (
    <article className={styles['ai-recommender']}>
      <TagSection tagList={exampleTagList} />
      <Divider />
      <LawyerItem lawyerList={lawyerList} onRefresh={handleRefresh} />
    </article>
  )
}

export default AIRecommender
