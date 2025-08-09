import AIRecommender from '@/components/aiRecommender/AIRecommender'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import AIBlogCarousel from '@/container/blog/AIBlogCarousel'
import LegalKnowledgeList from '@/container/legalKnowledge/LegalKnowledgeList'
import { useMemo, useState } from 'react'
import { useRecommendationLegalTerm } from '@/hooks/queries/useRecommendation'
import { formatKoreanWithHanja } from '@/utils/legalTermFormatter'

const LegalKnowledgeLayout = () => {
  const [knowledgeIds, setKnowledgeIds] = useState<number[]>([])
  const { data: recommendation } = useRecommendationLegalTerm({ knowledgeIds })
  const legalTermNames = useMemo(() => formatKoreanWithHanja(recommendation ?? []), [recommendation])

  return (
    <main className='sub-main-container'>
      <section className='contents-section'>
        <AIBlogCarousel />
        <LegalKnowledgeList onIdsChange={setKnowledgeIds} />
      </section>
      <aside className='aside'>
        <section>
          <AIRecommender />
        </section>
        <section>
          <LegalTermWidget lagalTermList={legalTermNames} />
        </section>
      </aside>
    </main>
  )
}

export default LegalKnowledgeLayout
