import { Fragment, useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import Button from '@/components/button/Button'
import styles from '@/container/legalKnowledge/legal-knowledge-list.module.scss'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import Divider from '@/components/divider/Divider'

const LegalKnowledgeList = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const [sortCase, setSortCase] = useState<string>('all')
  const handleSortCase = (key: string) => {
    setSortCase(key)
  }

  const knowledgeList = [1, 2, 3, 4, 5]

  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000)

  return (
    <div className={styles['legal-knowledge-list-container']}>
      <ArticleHeader
        title={`변호사가 직접 답변하는 법률 지식인!\n내 문제와 유사한 문제가 있는지 찾아보세요`}
        button={
          isMobile ? (
            <Button variant='primary' className={styles['chat-button']}>
              변호사 채팅상담 하기
            </Button>
          ) : null
        }
        onClick={handleSortCase}
        activeKey={sortCase}
        totalBlogCount={2147}
        recentBlogCount={4142}
      />
      {!isMobile && <Divider padding={24} />}
      <section className={styles['legal-knowledge-list']}>
        {knowledgeList.map((knowledge, index) => (
          <Fragment key={knowledge}>
            <LegalKnowledgeItem
              title='질문지 선택한 내용과, 사건내용을 AI요약한 제목을 보여줍니다.'
              description='음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 
            혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다. 
            음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다.
            혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다.'
              time={threeHoursAgo}
              lawyerList={[
                {
                  img: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
                  name: '이보람',
                },
                {
                  img: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
                  name: '신중완',
                },
                {
                  img: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
                  name: '백경렬',
                },
              ]}
              isLastAnswer={true}
            />
            {index !== knowledgeList.length - 1 && !isMobile && <Divider padding={0} />}
          </Fragment>
        ))}
      </section>
    </div>
  )
}

export default LegalKnowledgeList
