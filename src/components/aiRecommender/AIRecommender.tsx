import styles from '@/components/aiRecommender/ai-recommender.module.scss'
import Divider from '../divider/Divider'
import SvgIcon from '../SvgIcon'
import { AIRecommenderLawyerItem } from '@/types/lawyerTypes'
import LawyerHorizon from '../lawyer/LawyerHorizon'

const TagSection = ({ tagList }: { tagList: string[] }) => {
  return (
    <section className={styles['tag-section']}>
      <h2 className={styles['section-title']}>AI 추천태그</h2>
      <div className={styles['tag-list']}>
        {tagList.map(tag => (
          <span>#{tag}</span>
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
}: {
  lawyerList: AIRecommenderLawyerItem[]
  divider?: boolean
}) => {
  return (
    <section className={styles['lawyer-section']}>
      <header>
        <h2 className={styles['section-title']}>AI 추천 변호사</h2>
        <SvgIcon name='refresh' />
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
  return (
    <article className={styles['ai-recommender']}>
      <TagSection
        tagList={['경찰', '고소', '공범', '통장', '보이스피싱', '사기공범', '신고', '은행', '경찰', '고소']}
      />
      <Divider />
      <LawyerItem lawyerList={mockLawyerList} />
    </article>
  )
}

export default AIRecommender

const mockLawyerList: AIRecommenderLawyerItem[] = [
  {
    id: 1,
    name: '이보람',
    description: '이보람은 경찰 고소 공범 통장 보이스피싱 사기공범 신고 은행 경찰 고소에 능하며 어쩌구 저쩌구 ',
    profileImage: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
  },
  {
    id: 2,
    name: '신중완',
    description: '신중완은 경찰 고소 공범 통장 보이스피싱 사기공범 신고 은행 경찰 고소에 능하며 어쩌구 저쩌구 ',
    profileImage: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
  },
  {
    id: 3,
    name: '백경렬',
    description: '백경렬은 경찰 고소 공범 통장 보이스피싱 사기공범 신고 은행 경찰 고소에 능하며 어쩌구 저쩌구 ',
    profileImage: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
  },
]
